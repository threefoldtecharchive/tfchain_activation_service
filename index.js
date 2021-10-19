const express = require('express')
const cors = require('cors')
const httpError = require('http-errors')
const { omit } = require('lodash')
const path = require('path')

// attach env variables to process.env
require('dotenv').config()

const {
  NODE_ENV = 'development'
} = process.env

const log = require('./lib/logger')

const pinoMiddleware = require('express-pino-logger')({
  logger: log
})

const app = express()

app.use(cors())
app.options('*', cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(pinoMiddleware)

app.use('/activation', require('./routes'))

app.use(express.static(path.join(__dirname, './build')))

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  log.info(res)
  res.sendFile(path.join(__dirname, '/build/index.html'))
})

app.use((req, res, next) => next(httpError.NotFound()))

app.use(function (err, req, res, next) {
  if (httpError.isHttpError(err)) {
    // use warning since we threw the error
    log.warn(err)
    res.status(err.status)
    if (NODE_ENV !== 'development') return res.send(omit(err, ['stack']))
    return res.send(err)
  }

  // default error handler
  log.error(err, 'error happened handling the request')
  res.status(err.status || 500).send(err.message)
})

module.exports = app
