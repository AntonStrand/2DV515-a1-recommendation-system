const { cors, routes, methods, json } = require('paperplane')

const { getAllUsers } = require('../db/queries')
const metrics = require('../models/metrics')
const findTopMoviesBy = require('../models/topMovies')
const findTopMoviesFor = require('../models/topItemBasedMovies')
const findTopMatchingUsersBy = require('../models/similarUsers')

const { take } = require('../lib/helpers')

const endpoints = {
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
  }),
  '/item-based/:id': methods({
    GET: ({ params, query }) =>
      findTopMoviesFor(params.id)
        .then(take(query.limit))
        .then(json)
  })
}

module.exports = cors(
  routes({
    '/': methods({
      GET: () =>
        json({
          description: 'available routes',
          routes: Object.keys(endpoints)
        })
    }),
    ...endpoints
  })
)
