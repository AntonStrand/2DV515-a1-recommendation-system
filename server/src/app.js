require('dotenv').config()
const http = require('http')
const { cors, mount, logger, routes, methods, json } = require('paperplane')

const { getAllUsers } = require('./db/queries')
const metrics = require('./models/metrics')
const findTopMoviesBy = require('./models/topMovies')

const app = cors(
  routes({
    '/users': methods({
      GET: () => getAllUsers().then(json)
    }),
    '/users/:id': methods({
      GET: ({ params: { id } }) =>
        findTopMoviesBy(metrics.euclidean, id).then(json)
    }),
    '/pearson/:id': methods({
      GET: ({ params: { id } }) =>
        findTopMoviesBy(metrics.pearson, id).then(json)
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
