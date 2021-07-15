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
  if (balance.free > 1) {
    throw httpError(409)
  }

  try {
    await client.transfer(substrateAccountID, AMOUNT)
  } catch (error) {
    throw httpError(error)
  }
}

async function createEntity (body, res, next) {
  const { target, name, signature, countryID, cityID } = body

  const entityByName = await client.getEntityIDByName(name)
  if (entityByName !== 0) {
    throw httpError(409)
  }

  const entityByPubkey = await client.getEntityIDByPubkey(target)
  if (entityByPubkey !== 0) {
    throw httpError(409)
  }

  try {
    await client.createEntity(target, name, countryID, cityID, signature, result => {
      if (result instanceof Error) {
        console.log(result)
        return
      }
      const { events = [], status } = result
      console.log(`Current status is ${status.type}`)
      res.write(status.type)
      if (status.type === 'Invalid') {
        res.end()
      }
      if (status.isFinalized) {
        events.forEach(({ phase, event: { data, method, section } }) => {
          if (section === 'system' && method === 'ExtrinsicFailed') {
            console.log(`\t' ${phase}: ${section}.${method}:: ${data}`)
            res.write('failure')
            res.end()
          } else if (section === 'system' && method === 'ExtrinsicSuccess') {
            res.write('success')
            res.end()
            console.log(`\t' ${phase}: ${section}.${method}:: ${data}`)
          }
        })
      }
    })
  } catch (error) {
    throw httpError(error.toString())
  }
}

module.exports = {
  validateActivation,
  createEntity
}
