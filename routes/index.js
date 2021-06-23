const express = require('express')
const router = express.Router()
const { validateActivation } = require('../controllers/substrate')

const { validateBodyMiddleware } = require('../middleware/validator')

router.post('/activate', validateBodyMiddleware('activate'), (req, res, next) => {
  const { body } = req

  validateActivation(body)
    .then(() => res.send(body))
    .catch(next)
})

module.exports = router
