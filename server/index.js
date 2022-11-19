require('dotenv/config');
const path = require('path');
const pg = require('pg');
const argon2 = require('argon2');
const express = require('express');
const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const authorizationMiddleware = require('./authorization-middleware');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
const publicPath = path.join(__dirname, 'public');

app.use(express.json());
app.use(express.static(publicPath));

app.use(staticMiddleware);

app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
        insert into "accounts" ("username", "hashedPassword")
        values ($1, $2)
        on conflict ("username")
        do nothing
        returning "userId", "username"
      `;
      const params = [username, hashedPassword];
      return db.query(sql, params);
    })
    .then(result => {
      const [account] = result.rows;
      if (!account) {
        throw new ClientError(409, 'username is already taken');
      }
      res.status(201).json(account);
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "userId",
           "hashedPassword"
      from "accounts"
     where "username" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { userId, hashedPassword } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { userId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.get('/api/search/:endpoint', (req, res, next) => {
  const { endpoint } = req.params;
  const { q } = req.query;
  fetch(`https://api.deezer.com/search/${endpoint}?q=${q}`)
    .then(res => res.json())
    .then(result => {
      const data = result.data;
      if (endpoint === 'artist') {
        const artistList = data.map(({ id: artistId, name: artistName, picture: artistPicture }) => ({ artistId, artistName, artistPicture }));
        res.status(201).json(artistList);
      } else if (endpoint === 'album') {
        const albumList = data.map(({ id: albumId, title: albumTitle, cover: albumCover, artist: { name: artistName } }) => ({ albumId, albumTitle, albumCover, artistName }));
        res.status(201).json(albumList);
      } else if (endpoint === 'track') {
        const trackList = data.map(
          ({ id, title, artist: { id: artistId, name: artistName, picture: artistPicture }, album: { id: albumId, title: albumTitle, cover: albumCover } }) => ({ id, title, artistId, artistName, artistPicture, albumId, albumTitle, albumCover })
        );
        res.status(200).json(trackList);
      }
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

app.post('/api/save/library', (req, res, next) => {
  const { userId } = req.user;
  const { id, title, artistId, artistName, artistPicture, albumId, albumTitle, albumCover } = req.body;
  const sql = `
    with "insertTrack" as (
      insert into "tracks" ("trackId", "title", "artistId", "albumId")
    values ($1, $2, $3, $6)
    on conflict ("trackId")
    do nothing
    ), "insertArtist" as (
      insert into "artists" ("artistId", "name", "pictureUrl")
    values ($3, $4, $5)
    on conflict ("artistId")
    do nothing
    )
    insert into "albums" ("albumId", "title", "coverUrl")
    values ($6, $7, $8)
    on conflict ("albumId")
    do nothing;
  `;
  const params = [id, title, artistId, artistName, artistPicture, albumId, albumTitle, albumCover];
  db.query(sql, params)
    .then(result => {
      const sql = `
        insert into "library" ("userId", "trackId")
        values ($1, $2)
        returning "trackId"
      `;
      const params = [userId, id];
      db.query(sql, params)
        .then(result => {
          const [trackId] = result.rows;
          res.status(201).json(trackId);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.get('/api/user/library/songs', (req, res, next) => {
  const { userId } = req.user;
  const sql = `
    select "l"."trackId" as "id",
           "t"."title",
           "art"."name" as "artistName",
           "alb"."coverUrl" as "albumCover"
      from "library" as "l"
      join "tracks" as "t" using ("trackId")
      join "artists" as "art" using ("artistId")
      join "albums" as "alb" using ("albumId")
      where "l"."userId" = '${userId}'
      order by "t"."title"
  `;
  db.query(sql)
    .then(result => {
      const trackList = result.rows;
      res.status(200).json(trackList);
    })
    .catch(err => next(err));
});

app.get('/api/user/library/playlists', (req, res, next) => {
  const { userId } = req.user;
  const sql = `
        select "a"."username",
               "p"."playlistId",
               "p"."name" as "playlistName",
               "pt"."trackId"
          from "accounts" as "a"
          join "playlist" as "p" using ("userId")
          join "playlistTracks" as "pt" using ("playlistId")
          where "userId" = '${userId}'
      `;
  db.query(sql)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/create/playlist', (req, res, next) => {
  const { userId } = req.user;
  const { playlistName } = req.body;
  if (!playlistName) {
    throw new ClientError(400, 'playlist name is required');
  }
  const sql = `
    insert into "playlist" ("userId", "name")
    values ($1, $2)
  `;
  const params = [userId, playlistName];
  db.query(sql, params)
    .then(result => {
      const sql = `
        select "playlistId", "name"
        from "playlist"
        where "userId" = '${userId}'
      `;
      db.query(sql)
        .then(result => {
          res.status(201).json(result.rows);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.post('/api/save/library/playlist', (req, res, next) => {
  const { playlistId, trackId } = req.body;
  const sql = `
    insert into "playlistTracks" ("playlistId", "trackId")
    values ($1, $2)
    returning "trackId"
  `;
  const params = [playlistId, trackId];
  db.query(sql, params)
    .then(result => {
      const [trackId] = result.rows;
      res.status(201).json(trackId);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});

// user-token:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYW5vbnltb3VzIiwiaWF0IjoxNjY4ODIyNjg0fQ.eHNnl1BXw7dbQPjvELnhpHhKWR1fUHdNfdc_zfZq68s
