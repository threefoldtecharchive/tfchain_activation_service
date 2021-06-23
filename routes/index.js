const express = require('express')
const router = express.Router()
// const httpError = require('http-errors')

const { validateBodyMiddleware } = require('../middleware/validator')

router.post('/activate', validateBodyMiddleware('activate'), (req, res, next) => {
  res.send({ status: 'success' })
})

module.exports = router
