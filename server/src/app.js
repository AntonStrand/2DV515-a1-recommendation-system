require('dotenv').config()
const http = require('http')
const { cors, mount, logger, routes, methods, json } = require('paperplane')

const { getAllUsers } = require('./db/queries')
const metrics = require('./models/metrics')
const findTopMoviesBy = require('./models/topMovies')
const findTopMatchingUsersBy = require('./models/similarUsers')

const { take } = require('./lib/helpers')

const app = cors(
  routes({
    '/users': methods({
      GET: () => getAllUsers().then(json)
    }),
    '/users/:id': methods({
      GET: ({ params, query }) =>
        findTopMatchingUsersBy(metrics[query.metric], params.id)
          .then(take(query.limit))
          .then(json)
    }),
    '/movies/:id': methods({
      GET: ({ params, query }) =>
        findTopMoviesBy(metrics[query.metric], params.id)
          .then(take(query.limit))
          .then(json)
    }),
    '/metrics': methods({
      GET: () => json(Object.keys(metrics))
    })
  })
)

const port = process.env.PORT || 3001

http
  .createServer(mount({ app, logger }))
  .listen(port, () =>
    console.log(
      '\nServer is running on port ' + port + '\nPress ctrl+c to terminate...\n'
    )
  )
