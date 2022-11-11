require('dotenv/config');
const path = require('path');
const pg = require('pg');
const argon2 = require('argon2');
const express = require('express');
const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');

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
          res.json({ token, user: payload });
        });
    });
});

app.get('/api/search', (req, res, next) => {
  const { q } = req.query;
  fetch(`https://api.deezer.com/search?q=${q}`)
    .then(res => res.json())
    .then(result => {
      res.status(201).json(result);
    });
});

app.get('/api/search/:endpoint', (req, res, next) => {
  const { endpoint } = req.params;
  const { q } = req.query;
  // const options = {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // };
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

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
