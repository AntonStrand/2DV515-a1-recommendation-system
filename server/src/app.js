require('dotenv').config()
const http = require('http')
const { mount, logger, routes, methods, json } = require('paperplane')
const mysql = require('./config/mysql')

/* pLift :: (a, b .. x -> y) -> (Promise a, Promise b, .. Promise x) -> Promise y */
const pLift = fn => (...promises) =>
  Promise.all(promises).then(args => fn(...args))

const getUsersQuery = `select * from users;`

const ratedMovies = `select movie_id, rating from ratings where user_id = ?`

const getWhoAlsoHaveRatedSameMovies = `
select u.name, r.rating, r.movie_id, r.user_id 
from ratings as r
inner join users as u on r.user_id = u.user_id
where r.movie_id in (select movie_id from ratings where user_id=?) and r.user_id <> ?;
`

/** groupSimularity :: MovieRating -> Object -> MovieRating -> Object */
const groupSimularity = movie => (table, { user_id, name, ...o }) => {
  if (movie.movie_id === o.movie_id) {
    table[user_id] = {
      name,
      user_id,
      simularity:
        (table[`${user_id}.simularity`] || 0) + (movie.rating - o.rating) ** 2
    }
  }
  return table
}

/** getSimularityTable :: ([Movie], [Movie]) -> { user_id: SimularityData } */
const getSimularityTable = (userRatings, otherRatings) =>
  userRatings.reduce(
    (table, movie) => otherRatings.reduce(groupSimularity(movie), table),
    {}
  )

const euclideanDistance = ([userRatings], [otherRatings]) =>
  Object.values(getSimularityTable(userRatings, otherRatings))
    .map(user => ({ ...user, simularity: 1 / (1 + user.simularity) }))
    .sort((u1, u2) => u2.simularity - u1.simularity)

/** findTopMatchingEqulideanUsers :: Number -> [ SimularityData ] */
const findTopMatchingEqulideanUsers = id =>
  pLift(euclideanDistance)(
    mysql.execute(ratedMovies, [id]),
    mysql.execute(getWhoAlsoHaveRatedSameMovies, [id, id])
  )

const app = routes({
  '/users': methods({
    GET: () => mysql.query(getUsersQuery).then(([users]) => json(users))
  }),
  '/users/:id': methods({
    GET: ({ params: { id } }) => findTopMatchingEqulideanUsers(id).then(json)
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
