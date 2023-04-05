# MusicFuze-library-organizer

A full stack JavaScript application where music enthusiasts can look up songs, save them to their library,
and create playlists to organize their music catalog.

## Why I Built This

As someone who uses Apple Music daily and loves a wide variety of music, I wanted to recreate a music library
app that allows me to easily arrange my songs based on groups such as genere, moods, artists, etc. I also used this as an opportunity to practice my backend skills by utilizing technologies like Node.js, Express, Webpack, and postgreSQL.

## Technologies Used:

- HTML5
- CSS3
- JavaScript
- React.js
- Webpack
- Node.js
- Express.js
- PostgreSQL
- Babel
- Dokku
- Amazon EC2
- [React Bootstrap](https://react-bootstrap.github.io/)
- [deezer API](https://developers.deezer.com/guidelines)

## Live Demo

Try the application live at [https://final-project.mkweon.com/](https://final-project.mkweon.com/)

## Features:
- User can create an account
- User can log in
- User can search songs, artists, and albums
- User can save songs to their library
- User can view the saved songs in their library
- User can delete songs from their library
- User can create a playlist
- User can add songs from their library to a playlist
- User can delete songs from their playlists
- User can log out

### Preview
![Log in and save song](server/public/preview-gifs/log-in-and-save.gif)
![Create playlist and add song](server/public/preview-gifs/create-and-add.gif)

## Strech Features:
- User can view general, preset categories of their saved songs (albums, artists, genres)
- When searching for artists, user can click to view a list of songs by that artist
- When searching for albums, user can click to view a list of songs in that album

## Development

### System Requirements:
- Node.js 10 or higher
- NPM 6 or higher
- PostgreSQL 1.62 or higher

### Getting Started

1. Clone the repository.
```
git clone git@github.com:MattKweon/final-project.git
```

2. Install all dependencies with NPM.
```
npm install
```

3. Create a copy of the `.env.example` file.
```
cp .env.example .env
```

4. In the `.env` file, replace TOKEN_SECRET `changeMe` with a random string value.

   TOKEN_SECRET=**_changeMe_**

5. Start the database server.
```
sudo service postgresql start
```

6. Create a new database.
```
createdb 'name of database'
```

7. In the `.env` file, update the DATABASE_URL `changeMe`.

   DATABASE_URL=postgres://dev:dev@localhost/**_changeMe_**?sslmode=disable

8. Import the `schema.sql` and `data.sql` files to the database.
```
npm run db:import
```

9. Start the project. Project can be viewed at [http://localhost:3000](http://localhost:3000) on your browser.
```
npm run dev
```

10. Start pgweb to view your database. Database can be viewed by opening [http://localhost:8081](http://localhost:8081) on your browser.
```
pgweb --db='name of database'
```
