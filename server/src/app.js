require('dotenv').config()
const http = require('http')
const { mount, logger } = require('paperplane')
const app = require('./routes')
const port = process.env.PORT || 3001

http
  .createServer(mount({ app, logger }))
  .listen(port, () =>
    console.log(
      '\nServer is running on port ' + port + '\nPress ctrl+c to terminate...\n'
    )
  )
