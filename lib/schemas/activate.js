module.exports = {
  type: 'object',
  properties: {
    kycSignature: { type: 'string' },
    data: {
      type: 'object',
      properties: {
        name: { type: 'string' }
      }
    },
    substrateAccountID: { type: ['string'] }
  },
  required: ['kycSignature', 'data', 'substrateAccountID'],
  additionalProperties: false
}
