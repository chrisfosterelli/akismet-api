
/* promises.spec.js
 * Describes tests for the akismet-api promises API */

var chai    = require('chai');
var nock    = require('nock');
var Akismet = require('../lib/akismet');

var expect = chai.expect;

describe('promises', function() {

  describe('client#verifyKey()', function() {
  
    describe('when the request returns \'valid\'', function() {

      var client;
      var scope;
      
      beforeEach(function() {
        client = Akismet.client({
          blog : 'https://example.com',
          key  : 'testKey1',
          host : 'rest1.akismet.com'
        });
        scope = nock('https://rest1.akismet.com')
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .post('/1.1/verify-key')
        .reply(200, 'valid', {
          'Content-Type' : 'text/plain' 
        });
      });

      it('should resolve with true', function() {
        return client.verifyKey()
        .then(function(valid) {
          expect(valid).to.be.true;
          scope.done();
        });
      });

    });

    describe('when the request returns \'invalid\'', function() {

      var client;
      var scope;
      
      beforeEach(function() {
        client = Akismet.client({
          blog : 'https://example.com',
          key  : 'testKey2',
          host : 'rest2.akismet.com'
        });
        scope = nock('https://rest2.akismet.com')
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .post('/1.1/verify-key')
        .reply(200, 'invalid', {
          'Content-Type' : 'text/plain'
        });
      });

      it('should resolve with false', function() {
        return client.verifyKey()
        .then(function(valid) {
          expect(valid).to.be.false;
          scope.done();
        });
      });

    });

    describe('when the request returns anything else', function() {

      var client;
      var scope;
      
      beforeEach(function() {
        client = Akismet.client({
          blog : 'https://example.com',
          key  : 'testKey2',
          host : 'rest2.akismet.com'
        });
        scope = nock('https://rest2.akismet.com')
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .post('/1.1/verify-key')
        .reply(200, 'whatisthiserror', {
          'Content-Type' : 'text/plain'
        });
      });

      it('should reject with the response', function() {
        return client.verifyKey()
        .then(function(valid) {
          var msg = 'Unexpectedly resolved';
          throw new Error(msg);
        })
        .catch(function(err) {
          expect(err.message).to.equal('whatisthiserror');
          scope.done();
        });
      });

    });

    describe('when the request fails', function() {

      var client;
      
      beforeEach(function() {
        client = Akismet.client({
          blog : 'https://example.com',
          key  : 'testKey3',
          host : 'notarealdomain' // will fail!
        });
      });

      it('should reject with the error', function() {
        return client.verifyKey()
        .then(function(valid) {
          var msg = 'Unexpectedly resolved';
          throw new Error(msg);
        })
        .catch(function(err) {
          expect(err.message).to.include('ENOTFOUND');
        });
      });

    });

  });

  describe('client#checkSpam()', function() {
    
    describe('when the request returns \'true\'', function() {
    
      var client;
      var scope;
      
      beforeEach(function() {
        client = Akismet.client({
          blog : 'https://example.com',
          key  : 'testKey4'
        });
        scope = nock('https://testKey4.rest.akismet.com')
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .post('/1.1/comment-check')
        .reply(200, 'true', {
          'Content-Type' : 'text/plain'
        });
      });

      it('should resolve with true', function() {
        return client.checkSpam({
          user_ip : '123.123.123.123'
        })
        .then(function(spam) {
          expect(spam).to.be.true;
          scope.done();
        });
      });
    
    });
    
    describe('when the request returns \'false\'', function() {
    
      var client;
      var scope;
      
      beforeEach(function() {
        client = Akismet.client({
          blog : 'https://example.com',
          key  : 'testKey5'
        });
        scope = nock('https://testKey5.rest.akismet.com')
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .post('/1.1/comment-check')
        .reply(200, 'false', {
          'Content-Type' : 'text/plain'
        });
      });

      it('should resolve with false', function() {
        return client.checkSpam({
          user_ip : '123.123.123.123'
        })
        .then(function(spam) {
          expect(spam).to.be.false;
          scope.done();
        });
      });
    
    });

    describe('when the request returns something else', function() {

      describe('when the akismet debug header is present', function() {
    
        var client;
        var scope;
        
        beforeEach(function() {
          client = Akismet.client({
            blog : 'https://example.com',
            key  : 'testKey6'
          });
          scope = nock('https://testKey6.rest.akismet.com')
          .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
          .post('/1.1/comment-check')
          .reply(200, 'notAValidValueAtAll', {
            'Content-Type' : 'text/plain',
            'X-akismet-debug-help' : 'You did something wrong!'
          });
        });

        it('should reject with the akismet debug error', function() {
          return client.checkSpam({
            user_ip : '123.123.123.123'
          })
          .then(function(spam) {
            var msg = 'Unexpectedly resolved';
            throw new Error(msg);
          })
          .catch(function(err) {
            expect(err.message).to.equal('You did something wrong!');
            scope.done();
          });
        });

      });

      describe('when the akismet debug header is not present', function() {
    
        var client;
        var scope;
        
        beforeEach(function() {
          client = Akismet.client({
            blog : 'https://example.com',
            key  : 'testKey6'
          });
          scope = nock('https://testKey6.rest.akismet.com')
          .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
          .post('/1.1/comment-check')
          .reply(200, 'notAValidValueAtAll', {
            'Content-Type' : 'text/plain'
          });
        });
      
        it('should reject with the response', function() {
          return client.checkSpam({
            user_ip : '123.123.123.123'
          })
          .then(function(spam) {
            var msg = 'Unexpectedly resolved';
            throw new Error(msg);
          })
          .catch(function(err) {
            expect(err.message).to.equal('notAValidValueAtAll');
            scope.done();
          });
        });

      });

    });

    describe('when the request fails', function() {
    
      var client;
      
      beforeEach(function() {
        client = Akismet.client({
          blog : 'https://example.com',
          key  : 'testKey7',
          host : 'notarealdomain' // will fail!
        });
      });

      it('should reject with the error', function() {
        return client.checkSpam({
          user_ip : '123.123.123.123'
        })
        .then(function(spam) {
          var msg = 'Unexpectedly resolved';
          throw new Error(msg);
        })
        .catch(function(err) {
          expect(err.message).to.include('ENOTFOUND');
        });
      });

    });

  });

  describe('client#submitSpam()', function() {
 
    describe('when the request returns a 2XX status code ', function() {
    
      var client;
      var scope;
      
      beforeEach(function() {
        client = Akismet.client({
          blog : 'https://example.com',
          key  : 'testKey8'
        });
        scope = nock('https://testKey8.rest.akismet.com')
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .post('/1.1/submit-spam')
        .reply(200, 'Thanks for making the web a better place.', {
          'Content-Type' : 'text/plain'
        });
      });
 
      it('should resolve', function() {
        return client.submitSpam({
          user_ip : '123.123.123.123'
        });
      });
 
    });
 
    describe('when the request returns a non 2XX status code', function() {
    
      var client;
      var scope;
      
      beforeEach(function() {
        client = Akismet.client({
          blog : 'https://example.com',
          key  : 'testKey9'
        });
        scope = nock('https://testKey9.rest.akismet.com')
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .post('/1.1/submit-spam')
        .reply(500, {
          'Content-Type' : 'text/plain'
        });
      });

      it('should reject with the message', function() {
        return client.submitSpam({
          user_ip : '123.123.123.123'
        })
        .then(function() {
          var msg = 'Unexpectedly resolved';
          throw new Error(msg);
        })
        .catch(function(err) {
          expect(err.message).to.equal('Internal Server Error');
          scope.done();
        });
      });
 
    });

    describe('when the request fails', function() {
    
      var client;
      
      beforeEach(function() {
        client = Akismet.client({
          blog : 'https://example.com',
          key  : 'testKey10',
          host : 'notarealdomain' // will fail!
        });
      });

      it('should reject with the error', function() {
        return client.submitSpam({
          user_ip : '123.123.123.123'
        })
        .then(function() {
          var msg = 'Unexpectedly resolved';
          throw new Error(msg);
        })
        .catch(function(err) {
          expect(err.message).to.include('ENOTFOUND');
        });
      });

    });

  });

  describe('client#submitHam()', function() {
    
    describe('when the request returns a 2XX status code ', function() {
    
      var client;
      var scope;
      
      beforeEach(function() {
        client = Akismet.client({
          blog : 'https://example.com',
          key  : 'testKey11'
        });
        scope = nock('https://testKey11.rest.akismet.com')
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .post('/1.1/submit-ham')
        .reply(200, 'Thanks for making the web a better place.', {
          'Content-Type' : 'text/plain'
        });
      });
 
      it('should resolve', function() {
        return client.submitHam({
          user_ip : '123.123.123.123'
        });
      });
 
    });
 
    describe('when the request returns a non 2XX status code', function() {
    
      var client;
      var scope;
      
      beforeEach(function() {
        client = Akismet.client({
          blog : 'https://example.com',
          key  : 'testKey12'
        });
        scope = nock('https://testKey12.rest.akismet.com')
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .post('/1.1/submit-ham')
        .reply(500, {
          'Content-Type' : 'text/plain'
        });
      });

      it('should reject with the message', function() {
        return client.submitHam({
          user_ip : '123.123.123.123'
        })
        .then(function() {
          var msg = 'Unexpectedly resolved';
          throw new Error(msg);
        })
        .catch(function(err) {
          expect(err.message).to.equal('Internal Server Error');
          scope.done();
        });
      });
 
    });

    describe('when the request fails', function() {
    
      var client;
      
      beforeEach(function() {
        client = Akismet.client({
          blog : 'https://example.com',
          key  : 'testKey13',
          host : 'notarealdomain' // will fail!
        });
      });

      it('should reject with the error', function() {
        return client.submitHam({
          user_ip : '123.123.123.123'
        })
        .then(function() {
          var msg = 'Unexpectedly resolved';
          throw new Error(msg);
        })
        .catch(function(err) {
          expect(err.message).to.include('ENOTFOUND');
        });
      });

    });

  });

});
