const chai = require('chai')
const nock = require('nock')
const Akismet = require('../lib/akismet')

const expect = chai.expect

describe('promise API', () => {
  describe('client#verifyKey()', () => {
    describe("when the request returns 'valid'", () => {
      let client
      let scope

      beforeEach(() => {
        client = Akismet.client({
          blog: 'https://example.com',
          key: 'testKey1',
          host: 'rest1.akismet.com'
        })
        scope = nock('https://rest1.akismet.com')
          .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
          .post('/1.1/verify-key')
          .reply(200, 'valid', {
            'Content-Type': 'text/plain'
          })
      })

      it('should resolve with true', () => {
        return client.verifyKey().then(valid => {
          expect(valid).to.be.true
          scope.done()
        })
      })
    })

    describe("when the request returns 'invalid'", () => {
      let client
      let scope

      beforeEach(() => {
        client = Akismet.client({
          blog: 'https://example.com',
          key: 'testKey2',
          host: 'rest2.akismet.com'
        })
        scope = nock('https://rest2.akismet.com')
          .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
          .post('/1.1/verify-key')
          .reply(200, 'invalid', {
            'Content-Type': 'text/plain'
          })
      })

      it('should resolve with false', () => {
        return client.verifyKey().then(valid => {
          expect(valid).to.be.false
          scope.done()
        })
      })
    })

    describe('when the request returns anything else', () => {
      let client
      let scope

      beforeEach(() => {
        client = Akismet.client({
          blog: 'https://example.com',
          key: 'testKey2',
          host: 'rest2.akismet.com'
        })
        scope = nock('https://rest2.akismet.com')
          .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
          .post('/1.1/verify-key')
          .reply(200, 'whatisthiserror', {
            'Content-Type': 'text/plain'
          })
      })

      it('should reject with the response', () => {
        return client
          .verifyKey()
          .then(valid => {
            const msg = 'Unexpectedly resolved'
            throw new Error(msg)
          })
          .catch(err => {
            expect(err.message).to.equal('whatisthiserror')
            scope.done()
          })
      })
    })

    describe('when the request fails', () => {
      let client

      beforeEach(() => {
        client = Akismet.client({
          blog: 'https://example.com',
          key: 'testKey3',
          host: 'notarealdomain' // will fail!
        })
      })

      it('should reject with the error', () => {
        return client
          .verifyKey()
          .then(valid => {
            const msg = 'Unexpectedly resolved'
            throw new Error(msg)
          })
          .catch(err => {
            expect(err.message).to.include('getaddrinfo')
          })
      })
    })
  })

  describe('client#checkSpam()', () => {
    describe("when the request returns 'true'", () => {
      let client
      let scope

      beforeEach(() => {
        client = Akismet.client({
          blog: 'https://example.com',
          key: 'testKey4'
        })
        scope = nock('https://testKey4.rest.akismet.com')
          .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
          .post('/1.1/comment-check')
          .reply(200, 'true', {
            'Content-Type': 'text/plain'
          })
      })

      it('should resolve with true', () => {
        return client
          .checkSpam({
            user_ip: '123.123.123.123'
          })
          .then(spam => {
            expect(spam).to.be.true
            scope.done()
          })
      })
    })

    describe("when the request returns 'false'", () => {
      let client
      let scope

      beforeEach(() => {
        client = Akismet.client({
          blog: 'https://example.com',
          key: 'testKey5'
        })
        scope = nock('https://testKey5.rest.akismet.com')
          .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
          .post('/1.1/comment-check')
          .reply(200, 'false', {
            'Content-Type': 'text/plain'
          })
      })

      it('should resolve with false', () => {
        return client
          .checkSpam({
            user_ip: '123.123.123.123'
          })
          .then(spam => {
            expect(spam).to.be.false
            scope.done()
          })
      })
    })

    describe('when the request returns something else', () => {
      describe('when the akismet debug header is present', () => {
        let client
        let scope

        beforeEach(() => {
          client = Akismet.client({
            blog: 'https://example.com',
            key: 'testKey6'
          })
          scope = nock('https://testKey6.rest.akismet.com')
            .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
            .post('/1.1/comment-check')
            .reply(200, 'notAValidValueAtAll', {
              'Content-Type': 'text/plain',
              'X-akismet-debug-help': 'You did something wrong!'
            })
        })

        it('should reject with the akismet debug error', () => {
          return client
            .checkSpam({
              user_ip: '123.123.123.123'
            })
            .then(function (spam) {
              const msg = 'Unexpectedly resolved'
              throw new Error(msg)
            })
            .catch(function (err) {
              expect(err.message).to.equal('You did something wrong!')
              scope.done()
            })
        })
      })

      describe('when the akismet debug header is not present', () => {
        let client
        let scope

        beforeEach(() => {
          client = Akismet.client({
            blog: 'https://example.com',
            key: 'testKey6'
          })
          scope = nock('https://testKey6.rest.akismet.com')
            .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
            .post('/1.1/comment-check')
            .reply(200, 'notAValidValueAtAll', {
              'Content-Type': 'text/plain'
            })
        })

        it('should reject with the response', () => {
          return client
            .checkSpam({
              user_ip: '123.123.123.123'
            })
            .then(spam => {
              const msg = 'Unexpectedly resolved'
              throw new Error(msg)
            })
            .catch(err => {
              expect(err.message).to.equal('notAValidValueAtAll')
              scope.done()
            })
        })
      })
    })

    describe('when the request fails', () => {
      let client

      beforeEach(() => {
        client = Akismet.client({
          blog: 'https://example.com',
          key: 'testKey7',
          host: 'notarealdomain' // will fail!
        })
      })

      it('should reject with the error', () => {
        return client
          .checkSpam({
            user_ip: '123.123.123.123'
          })
          .then(spam => {
            const msg = 'Unexpectedly resolved'
            throw new Error(msg)
          })
          .catch(err => {
            expect(err.message).to.include('getaddrinfo')
          })
      })
    })
  })

  describe('client#submitSpam()', () => {
    describe('when the request returns a 2XX status code ', () => {
      let client
      let scope

      beforeEach(() => {
        client = Akismet.client({
          blog: 'https://example.com',
          key: 'testKey8'
        })
        scope = nock('https://testKey8.rest.akismet.com')
          .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
          .post('/1.1/submit-spam')
          .reply(200, 'Thanks for making the web a better place.', {
            'Content-Type': 'text/plain'
          })
      })

      it('should resolve', () => {
        return client.submitSpam({
          user_ip: '123.123.123.123'
        })
      })
    })

    describe('when the request returns a non 2XX status code', () => {
      let client
      let scope

      beforeEach(() => {
        client = Akismet.client({
          blog: 'https://example.com',
          key: 'testKey9'
        })
        scope = nock('https://testKey9.rest.akismet.com')
          .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
          .post('/1.1/submit-spam')
          .reply(500, {
            'Content-Type': 'text/plain'
          })
      })

      it('should reject with the message', () => {
        return client
          .submitSpam({
            user_ip: '123.123.123.123'
          })
          .then(() => {
            const msg = 'Unexpectedly resolved'
            throw new Error(msg)
          })
          .catch(err => {
            expect(err.message).to.equal('Internal Server Error')
            scope.done()
          })
      })
    })

    describe('when the request fails', () => {
      let client

      beforeEach(() => {
        client = Akismet.client({
          blog: 'https://example.com',
          key: 'testKey10',
          host: 'notarealdomain' // will fail!
        })
      })

      it('should reject with the error', () => {
        return client
          .submitSpam({
            user_ip: '123.123.123.123'
          })
          .then(() => {
            const msg = 'Unexpectedly resolved'
            throw new Error(msg)
          })
          .catch(err => {
            expect(err.message).to.include('getaddrinfo')
          })
      })
    })
  })

  describe('client#submitHam()', () => {
    describe('when the request returns a 2XX status code ', () => {
      let client
      let scope

      beforeEach(() => {
        client = Akismet.client({
          blog: 'https://example.com',
          key: 'testKey11'
        })
        scope = nock('https://testKey11.rest.akismet.com')
          .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
          .post('/1.1/submit-ham')
          .reply(200, 'Thanks for making the web a better place.', {
            'Content-Type': 'text/plain'
          })
      })

      it('should resolve', () => {
        return client.submitHam({
          user_ip: '123.123.123.123'
        })
      })
    })

    describe('when the request returns a non 2XX status code', () => {
      let client
      let scope

      beforeEach(() => {
        client = Akismet.client({
          blog: 'https://example.com',
          key: 'testKey12'
        })
        scope = nock('https://testKey12.rest.akismet.com')
          .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
          .post('/1.1/submit-ham')
          .reply(500, {
            'Content-Type': 'text/plain'
          })
      })

      it('should reject with the message', () => {
        return client
          .submitHam({
            user_ip: '123.123.123.123'
          })
          .then(() => {
            const msg = 'Unexpectedly resolved'
            throw new Error(msg)
          })
          .catch(err => {
            expect(err.message).to.equal('Internal Server Error')
            scope.done()
          })
      })
    })

    describe('when the request fails', () => {
      let client

      beforeEach(() => {
        client = Akismet.client({
          blog: 'https://example.com',
          key: 'testKey13',
          host: 'notarealdomain' // will fail!
        })
      })

      it('should reject with the error', () => {
        return client
          .submitHam({
            user_ip: '123.123.123.123'
          })
          .then(() => {
            const msg = 'Unexpectedly resolved'
            throw new Error(msg)
          })
          .catch(err => {
            expect(err.message).to.include('getaddrinfo')
          })
      })
    })
  })
})
