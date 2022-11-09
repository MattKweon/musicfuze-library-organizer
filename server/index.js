require('dotenv/config');
const path = require('path');
const pg = require('pg');
const argon2 = require('argon2');
const express = require('express');
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

app.get('/api/auth/sign-up', (req, res, next) => {
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

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
