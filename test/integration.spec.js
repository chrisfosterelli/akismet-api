const chai = require('chai')
const Akismet = require('../lib/akismet')

const expect = chai.expect

if (!process.env.AKISMET_KEY) {
  console.log('\nSkipping integration tests, no AKISMET_KEY present...')
}

describe('integration', function () {
  let client
  this.slow(2000)

  before(function () {
    if (!process.env.AKISMET_KEY) {
      this.skip()
    }
  })

  beforeEach(() => {
    client = Akismet.client({
      blog: 'https://github.com/chrisfosterelli/akismet-api',
      key: process.env.AKISMET_KEY
    })
  })

  describe('client#verifyKey()', () => {
    it('should resolve with true', async () => {
      const isValid = await client.verifyKey()
      expect(isValid).to.be.true
    })
  })

  describe('client#checkSpam()', () => {
    it("should return 'true' for guarenteed spam", async () => {
      const comment = {
        user_ip: '123.123.123.123',
        user_agent: "My user's user agent",
        referrer: 'https://google.com',
        comment_author_email: 'akismet-guaranteed-spam@example.com',
        is_test: true
      }
      const isSpam = await client.checkSpam(comment)
      expect(isSpam).to.be.true
    })
    it("should return 'false' for guarenteed ham", async () => {
      const comment = {
        user_ip: '123.123.123.123',
        user_agent: "My user's user agent",
        referrer: 'https://google.com',
        user_role: 'administrator',
        is_test: true
      }
      const isSpam = await client.checkSpam(comment)
      expect(isSpam).to.be.false
    })
  })

  describe('client#submitHam()', () => {
    it('should return no errors', async () => {
      const comment = {
        user_ip: '123.123.123.123',
        user_agent: "My user's user agent",
        referrer: 'https://google.com',
        user_role: 'administrator',
        is_test: true
      }
      await client.submitHam(comment)
    })
  })

  describe('client#submitHam()', () => {
    it('should return no errors', async () => {
      const comment = {
        user_ip: '123.123.123.123',
        user_agent: "My user's user agent",
        referrer: 'https://google.com',
        comment_author_email: 'akismet-guaranteed-spam@example.com',
        is_test: true
      }
      await client.submitSpam(comment)
    })
  })
})
