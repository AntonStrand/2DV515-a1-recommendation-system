require('dotenv').config()
const http = require('http')
const { mount, logger, routes, methods, json } = require('paperplane')
const mysql = require('./config/mysql')

const getUsers = `select * from users;`

// const getUserMatchingRatings = `
//   select title, rating from movies where
//   select * from ratings where movie_id in (
//     select movie_id from ratings where user_id=(select user_id from users where name='Billy')
//   );
// `

const getAll = `select title, rating from movies inner join ratings on ratings.movie_id = movies.movie_id and ratings.user_id = (select user_id from users where name='Billy')`

// const getAllMatchingMovieRatings = `select * from ratings where movie_id in (select movie_id from ratings where )`

// const getAllAlsoRated = `select * from ratings where movie_id in (select movie_id from )`

const get = `
select user_id, rating from ratings
where movie_id in (select movie_id from ratings where user_id = (select user_id from users where name='Billy'));`

const getUserId = `select user_id from users where name='Billy'`

const app = routes({
  '/': methods({
    GET: () => mysql.execute(get).then(([rows]) => json(rows))
  })
})

const port = process.env.PORT || 3001

http
  .createServer(mount({ app, logger }))
  .listen(port, () =>
    console.log(
      '\nServer is running on port ' + port + '\nPress ctrl+c to terminate...\n'
    )
  )
