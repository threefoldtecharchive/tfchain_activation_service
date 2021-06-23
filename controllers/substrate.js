const { client } = require('../lib/substrate')
const httpError = require('http-errors')

// 500 tokens with 12 decimals precision
const AMOUNT = 1e12 * 500

async function validateActivation (body) {
  const { substrateAccountID } = body

  // TODO: verify kyc signature and data

  const balance = await client.getBalanceOf(substrateAccountID)
  if (balance.free !== 0) {
    throw httpError('account already activated', 400)
  }

  try {
    await client.transfer(substrateAccountID, AMOUNT)
  } catch (error) {
    throw httpError(error)
  }
}

module.exports = {
  validateActivation
}
