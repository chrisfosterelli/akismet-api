const chai = require('chai')
const Akismet = require('../lib/akismet')
const pjson = require('../package.json')

const expect = chai.expect

describe('constructors', () => {
  describe('#client()', () => {
    it('should return an instance of Akismet', () => {
      const client = Akismet.client({
        blog: 'https://example.com',
        apiKey: 'testKey'
      })
      expect(client instanceof Akismet.Client).to.be.true
    })

    it('should assign the passed-in constiables', function() {
      const client = Akismet.client({
        blog: 'https://example.com',
        key: 'testKey',
        host: 'test.akismet.com',
        endpoint: 'endpoint.akismet.com',
        userAgent: 'MyAgent 1.0',
        protocol: 'http',
        version: '9.9',
        port: 500
      })
      expect(client.port).to.equal(500)
      expect(client.key).to.equal('testKey')
      expect(client.blog).to.equal('https://example.com')
      expect(client.version).to.equal('9.9')
      expect(client.host).to.equal('test.akismet.com')
      expect(client.endpoint).to.equal('endpoint.akismet.com')
      expect(client.userAgent).to.equal('MyAgent 1.0')
      expect(client.protocol).to.equal('http')
    })

    it('should provide default values', function() {
      const client = Akismet.client()
      expect(client.port).to.equal(80)
      expect(client.key).to.be.undefined
      expect(client.blog).to.be.undefined
      expect(client.version).to.equal('1.1')
      expect(client.protocol).to.equal('https')
      expect(client.host).to.equal('rest.akismet.com')
      expect(client.endpoint).to.equal(
        'https://undefined.rest.akismet.com/1.1/'
      )
      expect(client.userAgent).to.equal(
        'Node.js/' + process.version + ' | Akismet-api/' + pjson.version
      )
    })
  })
})
