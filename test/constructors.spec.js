const chai = require('chai')
const Akismet = require('../lib/akismet')
const pjson = require('../package.json')

const expect = chai.expect

describe('constructors', () => {
  describe('#AkismetClient', () => {
    it('should assign the passed-in variables', () => {
      const client = new Akismet.AkismetClient({
        blog: 'https://example.com',
        key: 'testKey',
        host: 'test.akismet.com',
        userAgent: 'MyAgent 1.0',
        protocol: 'http',
        version: '9.9'
      })
      expect(client.key).to.equal('testKey')
      expect(client.blog).to.equal('https://example.com')
      expect(client.version).to.equal('9.9')
      expect(client.host).to.equal('test.akismet.com')
      expect(client.userAgent).to.equal('MyAgent 1.0')
      expect(client.protocol).to.equal('http')
    })

    it('should provide default values', () => {
      const client = new Akismet.AkismetClient()
      expect(client.key).to.be.undefined
      expect(client.blog).to.be.undefined
      expect(client.version).to.equal('1.1')
      expect(client.protocol).to.equal('https')
      expect(client.host).to.equal('rest.akismet.com')
      expect(client.userAgent).to.equal(
        'Node.js/' + process.version + ' | Akismet-api/' + pjson.version
      )
    })

    it('should assign the Akismet API parameters', () => {
      const client = new Akismet.AkismetClient({
        blog: 'https://example.com',
        blog_lang: 'en, fr_ca',
        blog_charset: 'UTF-8'
      })
      expect(client.requestOpts.blog).to.equal('https://example.com')
      expect(client.requestOpts.blog_lang).to.equal('en, fr_ca')
      expect(client.requestOpts.blog_charset).to.equal('UTF-8')
    })

    it('should support a JS-specific API', () => {
      const client = new Akismet.AkismetClient({
        blog: 'https://example.com',
        lang: 'en, fr_ca',
        charset: 'UTF-8'
      })
      expect(client.requestOpts.blog).to.equal('https://example.com')
      expect(client.requestOpts.blog_lang).to.equal('en, fr_ca')
      expect(client.requestOpts.blog_charset).to.equal('UTF-8')
    })
  })
  describe('#Client()', () => {
    it("should be an alias of 'AkismetClient'", () => {
      expect(Akismet.Client).to.equal(Akismet.AkismetClient)
    })
  })
  describe('#client()', () => {
    it('should return an instance of Akismet', () => {
      const client = Akismet.client({
        blog: 'https://example.com',
        apiKey: 'testKey'
      })
      expect(client instanceof Akismet.AkismetClient).to.be.true
    })
  })
})
