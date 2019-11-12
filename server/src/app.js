require('dotenv').config()
const http = require('http')
const { mount, logger, routes, methods, json } = require('paperplane')

const { allUsers } = require('./db/queries')
const { euclidean, pearson } = require('./models/metrics')
const findTopMoviesBy = require('./models/topMovies')

const app = routes({
  '/users': methods({
    GET: () => query(allUsers).then(json)
  }),
  '/users/:id': methods({
    GET: ({ params: { id } }) => findTopMoviesBy(euclidean, id).then(json)
  }),
  '/pearson/:id': methods({
    GET: ({ params: { id } }) => findTopMoviesBy(pearson, id).then(json)
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
