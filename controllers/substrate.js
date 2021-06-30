const { client } = require('../lib/substrate')
const httpError = require('http-errors')
// const { take } = require('lodash')
// const whitelist = require('../whitelist.json')

// 500 tokens with 12 decimals precision
const AMOUNT = 1e12 * 500

// const { KYC_PUBLIC_KEY } = process.env

async function validateActivation (body) {
  // const { kycSignature, data, substrateAccountID } = body

  // // allow whitelisted users to be funded whenever they want
  // if (whitelist.includes(substrateAccountID)) {
  //   try {
  //     await client.transfer(substrateAccountID, AMOUNT)
  //   } catch (error) {
  //     throw httpError(error)
  //   }
  //   return
  // }

  // const { email, name: identifier } = data
  // const originalData = `{ "email": "${email}", "identifier": "${identifier}" }`

  // try {
  //   const buff = Buffer.from(kycSignature, 'base64')
  //   const sig = take(buff, 64)

  //   const valid = await client.verify(originalData, sig, KYC_PUBLIC_KEY)
  //   if (!valid) throw httpError('signature is not valid')
  // } catch (error) {
  //   throw httpError('failed to verify signature')
  // }
  const { substrateAccountID } = body

  const balance = await client.getBalanceOf(substrateAccountID)
  if (balance.free !== 0) {
    throw httpError('account already activated')
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
