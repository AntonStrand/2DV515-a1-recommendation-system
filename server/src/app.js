require('dotenv').config()
const http = require('http')
const { mount, logger, routes, methods, json } = require('paperplane')
const mysql = require('./config/mysql')
const { groupBy, isEmpty, pLift, roundDec2 } = require('./lib/helpers')

const getUsersQuery = `SELECT * FROM users; `

const ratedMovies = `select movie_id, rating from ratings where user_id = ?`

const getWhoAlsoHaveRatedSameMovies = `
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

const getNotSeenMovies = `
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

/** query :: (String, [Arguments]) -> a */
const query = (query, args) =>
  mysql.execute(query, args).then(([result]) => result)

/** euclidean :: ([Rating], [Rating]) -> Number */
const euclidean = (as, bs) => {
  let sim = 0

  as.forEach(a => {
    bs.forEach(b => {
      if (a.movie_id === b.movie_id) {
        sim += (a.rating - b.rating) ** 2
      }
    })
  })
  // don't invert the value if there is no match
  return sim > 0 ? 1 / (1 + sim) : 0
}

/** desc :: String -> Number */
const desc = key => (a, b) => b[key] - a[key]

const sortedEuclidean = (user, rest) =>
  groupBy('user_id')(rest)
    .reduce(
      (users, u) =>
        isEmpty(u)
          ? users
          : users.concat({
            user_id: u[0].user_id,
            name: u[0].name,
            simularity: roundDec2(euclidean(user, u))
          }),
      []
    )
    .sort(desc('simularity'))

/** findTopMatchingEqulideanUsers :: Number -> [ SimularityData ] */
const findTopMatchingEqulideanUsers = id =>
  pLift(sortedEuclidean)(
    query(ratedMovies, [id]),
    query(getWhoAlsoHaveRatedSameMovies, [id, id])
  )

const findMovie = (users, notSeenMovies) =>
  Object.values(
    notSeenMovies.reduce((table, { movie_id, ...m }) => {
      let sim = roundDec2(users.find(u => u.user_id === m.user_id).simularity)
      const tm = table[movie_id] || { ws: 0, sim: 0 }
      return {
        ...table,
        [movie_id]: {
          movie_id,
          title: m.title,
          ws: roundDec2(tm.ws + m.rating * sim),
          sim: roundDec2(tm.sim + sim)
        }
      }
    }, {})
  )
    .map(({ title, movie_id, ws, sim }) => ({
      title,
      movie_id,
      score: roundDec2(ws / sim)
    }))
    .sort(desc('score'))

const findTopEqulideanMovies = id =>
  pLift(findMovie)(
    findTopMatchingEqulideanUsers(id),
    query(getNotSeenMovies, [id])
  )

const app = routes({
  '/users': methods({
    GET: () => query(getUsersQuery).then(json)
  }),
  '/users/:id': methods({
    GET: ({ params: { id } }) => findTopEqulideanMovies(id).then(json)
    // findTopMatchingEqulideanUsers(id).then(json)
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
