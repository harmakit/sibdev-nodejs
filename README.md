# nodejs-blog
* [Node.js](https://nodejs.org)
* [Express](https://www.npmjs.com/package/express)
* [PostgreSQL](https://www.postgresql.org/) ([Docker](https://www.docker.com/))
* [Sequelize](https://www.npmjs.com/package/sequelize)
* [EJS](https://www.npmjs.com/package/ejs)
* [Passport.js](https://www.npmjs.com/package/passport)
* [Sanitize-Html](https://www.npmjs.com/package/sanitize-html)
* [Foreman](https://github.com/ddollar/foreman)

# starting an app:
`npm install`

create `.env` file with `DATABASE_URL=postgres://postgres@localhost/blog`

`docker-compose up`

`foreman run sequelize db:create`

`foreman run sequelize db:migrate`

`foreman start`

server url: localhost:5000
