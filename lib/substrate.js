const Client = require('tfgrid-api-client')

const { MNEMONIC, URL } = process.env

const client = new Client(URL, MNEMONIC)

async function init () {
  return await client.init()
}

module.exports = {
  client,
  init
}
