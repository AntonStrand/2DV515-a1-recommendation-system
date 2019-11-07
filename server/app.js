console.log('Hello from server')
require('dotenv').config()
const http = require('http')
const { mount, logger, routes, methods, json } = require('paperplane')
const mysql = require('./src/config/mysql')

const getUsers = `select * from users;`

const app = routes({
  '/': methods({
    GET: () => mysql.execute(getUsers).then(([rows]) => json(rows))
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
