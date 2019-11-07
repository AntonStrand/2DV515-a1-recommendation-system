console.log('Hello from server')
require('dotenv').config()
const http = require('http')
const { mount, logger, routes, methods, json } = require('paperplane')

// const middleware = [
//   require('redux-future2'),
//   require('./src/utils/internalErrorMiddleware')
// ]

// const app = require('./src/routes')

const app = routes({
  '/': methods({
    GET: () =>
      json({
        message: 'Welcome to server'
      })
  })
})
// '/users': methods({
//   GET: request => users.getUsers(request).map(format(request))
// }),
// '/users/:id': methods({
//   GET: request => users.getUser(request).map(format(request))

const port = process.env.PORT || 3001

http
  .createServer(mount({ app, logger }))
  .listen(port, () =>
    console.log(
      '\nServer is running on port ' + port + '\nPress ctrl+c to terminate...\n'
    )
  )
