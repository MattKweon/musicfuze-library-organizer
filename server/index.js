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
        returning "accountId", "username"
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
    select "accountId",
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
      const { accountId, hashedPassword } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { accountId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, account: payload });
        });
    });
});

app.get('/api/search/:endpoint', (req, res, next) => {
  const { endpoint } = req.params;
  const { q } = req.query;
  fetch(`https://api.deezer.com/search/${endpoint}?q=${q}`)
    .then(res => res.json())
    .then(result => {
      const data = result.data;
      if (endpoint === 'artist') {
        const artistList = data.map(({ name, picture }) => ({ name, picture }));
        res.status(201).json(artistList);
      } else if (endpoint === 'album') {
        const albumList = data.map(({ title, cover, artist: { name } }) => ({ title, cover, name }));
        res.status(201).json(albumList);
      } else if (endpoint === 'track') {
        // eslint-disable-next-line camelcase
        const trackList = data.map(({ title, explicit_lyrics, artist: { name }, album: { cover } }) => ({ title, explicit_lyrics, name, cover }));
        res.status(201).json(trackList);
      }
    });
});

app.use(authorizationMiddleware);

app.post('/api/save/library', (req, res, next) => {
  const { accountId } = req.account;
  const { title, name, picture, album, cover } = req.body;
  const sql = `
    insert into "tracks" ("title", "name", "artistPictureUrl", "album", "albumCoverUrl")
    values ($1, $2, $3, $4, $5)
    returning "trackId"
  `;
  const params = [title, name, picture, album, cover];
  db.query(sql, params)
    .then(result => {
      const [trackId] = result.rows;
      const sql = `
          insert into "library" ("accountId", "trackId")
          values ($1, $2)
          returning "trackId"
        `;
      const params = [accountId, trackId.trackId];
      db.query(sql, params)
        .then(result => {
          const [trackId] = result.rows;
          res.status(201).json(trackId);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
