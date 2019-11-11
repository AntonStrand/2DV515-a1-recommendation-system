require('dotenv').config()
const http = require('http')
const { mount, logger, routes, methods, json } = require('paperplane')
const mysql = require('./config/mysql')
const { groupBy, isEmpty, pLift } = require('./lib/helpers')

const getUsersQuery = `select * from users;`

const ratedMovies = `select movie_id, rating from ratings where user_id = ?`

const getWhoAlsoHaveRatedSameMovies = `
select u.name, r.rating, r.movie_id, r.user_id 
from ratings as r
inner join users as u on r.user_id = u.user_id
where r.movie_id in (select movie_id from ratings where user_id=?) and r.user_id <> ?;
`

// const getNotSeenMovies = `select movies.title, ratings.* from movies inner join ratings on ratings.user_id <> ?;`
const getNotSeenMovies = `select * from ratings where ratings.user_id <> ?;`

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

/** descSimularity :: (SimularityData, SimularityData) -> Number */
const descSimularity = (u1, u2) => u2.simularity - u1.simularity

const sortedEuclidean = id => (user, rest) =>
  groupBy('user_id')(rest)
    .reduce(
      (users, u) =>
        isEmpty(u)
          ? users
          : users.concat({
            user_id: u[0].user_id,
            name: u[0].name,
            simularity: euclidean(user, u)
          }),
      []
    )
    .sort(descSimularity)

/** findTopMatchingEqulideanUsers :: Number -> [ SimularityData ] */
const findTopMatchingEqulideanUsers = id =>
  pLift(sortedEuclidean(id))(
    mysql.execute(ratedMovies, [id]).then(([x]) => x),
    mysql.execute(getWhoAlsoHaveRatedSameMovies, [id, id]).then(([x]) => x)
  )

const app = routes({
  '/users': methods({
    GET: () => mysql.query(getUsersQuery).then(([users]) => json(users))
  }),
  '/users/:id': methods({
    GET: ({ params: { id } }) =>
      mysql
        .execute(getNotSeenMovies, [id])
        .then(([x]) => console.log(x) || json(x)) // findTopMatchingEqulideanUsers(id).then(json)
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
