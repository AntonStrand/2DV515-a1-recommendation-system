'use strict'

const mysql = require('mysql2')
require('dotenv').config()

/** connection :: () -> Promise Connection */
const connection = mysql
  .createConnection({
    host: process.env.HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 200,
    dateStrings: true
  })
  .promise()

module.exports = connection
