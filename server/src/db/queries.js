'use strict'

const mysql = require('../config/mysql')

/** query :: (String, [Arguments]) -> a */
const query = (query, args) =>
  mysql.execute(query, args).then(([result]) => result)

const allUsers = `SELECT * FROM users; `

const ratedMovies = `
SELECT movie_id,
       rating
FROM   ratings
WHERE  user_id = ?;
`

const whoAlsoHaveRatedSameMovies = `
SELECT u.name,
       r.rating,
       r.movie_id,
       r.user_id
FROM   ratings AS r
       INNER JOIN users AS u
               ON r.user_id = u.user_id
WHERE  r.movie_id IN (SELECT movie_id
                      FROM   ratings
                      WHERE  user_id = ?)
       AND r.user_id <> ?;
`

const notSeenMovies = `
SELECT title,
       r.*
FROM   movies
       INNER JOIN (SELECT *
                   FROM   ratings
                   WHERE  movie_id NOT IN (SELECT movie_id
                                           FROM   ratings
                                           WHERE  ratings.user_id = ?)) AS r
               ON r.movie_id = movies.movie_id;
`

module.exports = {
  getAllUsers: () => query(allUsers),
  getRatedMovies: id => query(ratedMovies, [id]),
  getWhoAlsoHaveRatedSameMovies: id =>
    query(whoAlsoHaveRatedSameMovies, [id, id]),
  getNotSeenMovies: id => query(notSeenMovies, [id])
}
