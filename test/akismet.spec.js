
/* akismet.spec.js
 * Describes tests for the akismet-api module */

var Akismet = require('../lib/akismet');
var chai    = require('chai');
var nock    = require('nock');

var expect = chai.expect;

describe('Akismet-api', function() {

  describe('#client()', function() {
    
    it('should return an instance of Akismet', function() {
      var client = Akismet.client({
        blog   : 'http://example.com',
        apiKey : 'testKey'
      });
      expect(client instanceof Akismet.Client).to.be.true;
    });
    
    it('should assign the passed-in variables', function() {
      var client = Akismet.client({
        blog      : 'http://example.com',
        key       : 'testKey',
        host      : 'test.akismet.com',
        endpoint  : 'endpoint.akismet.com',
        userAgent : 'MyAgent 1.0',
        version   : '9.9',
        port      : 500
      });
      expect(client.blog).to.equal('http://example.com');
      expect(client.key).to.equal('testKey');
      expect(client.host).to.equal('test.akismet.com');
      expect(client.endpoint).to.equal('endpoint.akismet.com');
      expect(client.port).to.equal(500);
      expect(client.userAgent).to.equal('MyAgent 1.0');
      expect(client.version).to.equal('9.9');
    });

    it('should provide default values', function() {
      var client = Akismet.client();
      expect(client.blog).to.be.undefined;
      expect(client.key).to.be.undefined;
      expect(client.host).to.equal('rest.akismet.com');
      expect(client.endpoint).to.equal('undefined.rest.akismet.com/1.1/');
      expect(client.port).to.equal(80);
      expect(client.userAgent).to.equal('Node.js/' + process.version + ' | Akismet-api/1.1.0');
      expect(client.version).to.equal('1.1');
    });

  });

  describe('client#verifyKey()', function() {
  
    describe('when the request returns \'valid\'', function() {

      var client;
      var scope;
      
      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey1',
          host : 'rest1.akismet.com'
        });
        scope = nock('http://rest1.akismet.com')
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .post('/1.1/verify-key')
        .reply(200, 'valid', {
          'Content-Type' : 'text/plain' 
        });
      });

      it('should return true', function(done) {
        client.verifyKey(function(err, valid) {
          expect(valid).to.be.true;
          scope.done();
          done();
        });
      });

      it('should not return an error', function(done) {
        client.verifyKey(function(err, valid) {
          expect(err).to.be.null;
          scope.done();
          done();
        });
      });

    });

    describe('when the request returns \'invalid\'', function() {

      describe('when the x-akismet-debug-help header is present', function() {

        var client;
        var scope;
        
        beforeEach(function() {
          client = Akismet.client({
            blog : 'http://example.com',
            key  : 'testKey2',
            host : 'rest2.akismet.com'
          });
          scope = nock('http://rest2.akismet.com')
          .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
          .post('/1.1/verify-key')
          .reply(200, 'invalid', {
            'Content-Type' : 'text/plain',
            'X-akismet-debug-help' : 'Could not find your key'
          });
        });

        it('should return false', function(done) {
          client.verifyKey(function(err, valid) {
            expect(valid).to.be.false;
            scope.done();
            done();
          });
        });

        it('should return the akismet debug error', function(done) {
          client.verifyKey(function(err, valid) {
            expect(err.message).to.equal('Could not find your key');
            scope.done();
            done();
          });
        });
      
      });

      describe('when the x-akismet-debug-help header is not present', function() {

        var client;
        var scope;
        
        beforeEach(function() {
          client = Akismet.client({
            blog : 'http://example.com',
            key  : 'testKey2',
            host : 'rest2.akismet.com'
          });
          scope = nock('http://rest2.akismet.com')
          .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
          .post('/1.1/verify-key')
          .reply(200, 'invalid', {
            'Content-Type' : 'text/plain'
          });
        });

        it('should return false', function(done) {
          client.verifyKey(function(err, valid) {
            expect(valid).to.be.false;
            scope.done();
            done();
          });
        });

        it('should return \'Invalid API key\'', function(done) {
          client.verifyKey(function(err, valid) {
            expect(err.message).to.equal('Invalid API key');
            scope.done();
            done();
          });
        });
      
      });

    });

    describe('when the request returns anything else', function() {

      var client;
      var scope;
      
      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey2',
          host : 'rest2.akismet.com'
        });
        scope = nock('http://rest2.akismet.com')
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .post('/1.1/verify-key')
        .reply(200, 'whatisthiserror', {
          'Content-Type' : 'text/plain'
        });
      });

      it('should return false', function(done) {
        client.verifyKey(function(err, valid) {
          expect(valid).to.be.false;
          scope.done();
          done();
        });
      });

      it('should return the response', function(done) {
        client.verifyKey(function(err, valid) {
          expect(err.message).to.equal('whatisthiserror');
          scope.done();
          done();
        });
      });

    });

    describe('when the request fails', function() {

      var client;
      
      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey3',
          host : 'localhost' // will fail!
        });
      });

      it('should return null', function(done) {
        client.verifyKey(function(err, valid) {
          expect(err).to.not.be.false;
          expect(valid).to.be.null;
          done();
        });
      });

      it('should return the error', function(done) {
        client.verifyKey(function(err, valid) {
          expect(err).to.not.be.null;
          done();
        });
      });

    });

  });

  describe('client#verifyKeyAsync()', function() {

    describe('when the request returns \'valid\'', function() {

      var client;
      var scope;

      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey1',
          host : 'rest1.akismet.com'
        });
        scope = nock('http://rest1.akismet.com')
            .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
            .post('/1.1/verify-key')
            .reply(200, 'valid', {
              'Content-Type' : 'text/plain'
            });
      });

      it('promise should resolve', function(done) {
        client.verifyKeyAsync().then(function() {
          scope.done();
          done();
        });
      });
    });

    describe('when the request returns \'invalid\'', function() {

      describe('when the x-akismet-debug-help header is present', function() {

        var client;
        var scope;

        beforeEach(function() {
          client = Akismet.client({
            blog : 'http://example.com',
            key  : 'testKey2',
            host : 'rest2.akismet.com'
          });
          scope = nock('http://rest2.akismet.com')
              .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
              .post('/1.1/verify-key')
              .reply(200, 'invalid', {
                'Content-Type' : 'text/plain',
                'X-akismet-debug-help' : 'Could not find your key'
              });
        });

        it('should return the akismet debug error', function(done) {
          client.verifyKeyAsync().catch(function(err){
            expect(err).to.equal('Could not find your key');
            scope.done();
            done();
          });
        });

      });

      describe('when the x-akismet-debug-help header is not present', function() {

        var client;
        var scope;

        beforeEach(function() {
          client = Akismet.client({
            blog : 'http://example.com',
            key  : 'testKey2',
            host : 'rest2.akismet.com'
          });
          scope = nock('http://rest2.akismet.com')
              .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
              .post('/1.1/verify-key')
              .reply(200, 'invalid', {
                'Content-Type' : 'text/plain'
              });
        });

        it('should return \'Invalid API key\'', function(done) {
          client.verifyKeyAsync().catch(function(err){
            expect(err).to.equal('Invalid API key');
            scope.done();
            done();
          });
        });

      });

    });

    describe('when the request returns anything else', function() {

      var client;
      var scope;

      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey2',
          host : 'rest2.akismet.com'
        });
        scope = nock('http://rest2.akismet.com')
            .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
            .post('/1.1/verify-key')
            .reply(200, 'whatisthiserror', {
              'Content-Type' : 'text/plain'
            });
      });

      it('should return the response', function(done) {
        client.verifyKeyAsync().catch(function(err){
          expect(err).to.equal('whatisthiserror');
          scope.done();
          done();
        });
      });
    });

    describe('when the request fails', function() {

      var client;

      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey3',
          host : 'localhost' // will fail!
        });
      });

      it('should return the error', function(done) {
        client.verifyKeyAsync().catch(function(err){
          expect(err).to.not.be.null;
          done();
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
          blog : 'http://example.com',
          key  : 'testKey4'
        });
        scope = nock('http://testKey4.rest.akismet.com')
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .post('/1.1/comment-check')
        .reply(200, 'true', {
          'Content-Type' : 'text/plain'
        });
      });

      it('should return true', function(done) {
        client.checkSpam({
          user_ip : '123.123.123.123'
        }, function(err, spam) {
          expect(spam).to.be.true;
          scope.done();
          done();
        });
      });
    
      it('should not return an error', function(done) {
        client.checkSpam({
          user_ip : '123.123.123.123'
        }, function(err, spam) {
          expect(err).to.be.null;
          scope.done();
          done();
        });
      });
    
    });
    
    describe('when the request returns \'false\'', function() {
    
      var client;
      var scope;
      
      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey5'
        });
        scope = nock('http://testKey5.rest.akismet.com')
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .post('/1.1/comment-check')
        .reply(200, 'false', {
          'Content-Type' : 'text/plain'
        });
      });

      it('should return false', function(done) {
        client.checkSpam({
          user_ip : '123.123.123.123'
        }, function(err, spam) {
          expect(spam).to.be.false;
          scope.done();
          done();
        });
      });
    
      it('should not return an error', function(done) {
        client.checkSpam({
          user_ip : '123.123.123.123'
        }, function(err, spam) {
          expect(err).to.be.null;
          scope.done();
          done();
        });
      });
    
    });

    describe('when the request returns something else', function() {

      describe('when the x-akismet-debug-help header is present', function() {
    
        var client;
        var scope;
        
        beforeEach(function() {
          client = Akismet.client({
            blog : 'http://example.com',
            key  : 'testKey6'
          });
          scope = nock('http://testKey6.rest.akismet.com')
          .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
          .post('/1.1/comment-check')
          .reply(200, 'notAValidValueAtAll', {
            'Content-Type' : 'text/plain',
            'X-akismet-debug-help' : 'You did something wrong!'
          });
        });

        it('should return null', function(done) {
          client.checkSpam({
            user_ip : '123.123.123.123'
          }, function(err, spam) {
            expect(spam).to.be.null;
            scope.done();
            done();
          });
        });
      
        it('should return the akismet debug error', function(done) {
          client.checkSpam({
            user_ip : '123.123.123.123'
          }, function(err, spam) {
            expect(err.message).to.equal('You did something wrong!');
            scope.done();
            done();
          });
        });

      });

      describe('when the x-akismet-debug-help header is not present', function() {
    
        var client;
        var scope;
        
        beforeEach(function() {
          client = Akismet.client({
            blog : 'http://example.com',
            key  : 'testKey6'
          });
          scope = nock('http://testKey6.rest.akismet.com')
          .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
          .post('/1.1/comment-check')
          .reply(200, 'notAValidValueAtAll', {
            'Content-Type' : 'text/plain'
          });
        });

        it('should return null', function(done) {
          client.checkSpam({
            user_ip : '123.123.123.123'
          }, function(err, spam) {
            expect(spam).to.be.null;
            scope.done();
            done();
          });
        });
      
        it('should return the response', function(done) {
          client.checkSpam({
            user_ip : '123.123.123.123'
          }, function(err, spam) {
            expect(err.message).to.equal('notAValidValueAtAll');
            scope.done();
            done();
          });
        });

      });

    });

    describe('when the request fails', function() {
    
      var client;
      
      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey7',
          host : 'localhost' // will fail!
        });
      });

      it('should return null', function(done) {
        client.checkSpam({
          user_ip : '123.123.123.123'
        }, function(err, spam) {
          expect(spam).to.be.null;
          done();
        });
      });
    
      it('should return the error', function(done) {
        client.checkSpam({
          user_ip : '123.123.123.123'
        }, function(err, spam) {
          expect(err).to.not.be.null;
          done();
        });
      });

    });

  });

  describe('client#checkSpamAsync()', function() {

    describe('when the request returns \'true\'', function() {

      var client;
      var scope;

      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey4'
        });
        scope = nock('http://testKey4.rest.akismet.com')
            .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
            .post('/1.1/comment-check')
            .reply(200, 'true', {
              'Content-Type' : 'text/plain'
            });
      });

      it('should return true', function(done) {
        client.checkSpamAsync({
          user_ip : '123.123.123.123'
        }).then(function(spam) {
          expect(spam).to.be.true;
          scope.done();
          done();
        });
      });
    });

    describe('when the request returns \'false\'', function() {

      var client;
      var scope;

      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey5'
        });
        scope = nock('http://testKey5.rest.akismet.com')
            .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
            .post('/1.1/comment-check')
            .reply(200, 'false', {
              'Content-Type' : 'text/plain'
            });
      });

      it('should return false', function(done) {
        client.checkSpamAsync({
          user_ip : '123.123.123.123'
        }).then(function(spam) {
          expect(spam).to.be.false;
          scope.done();
          done();
        });
      });
    });

    describe('when the request returns something else', function() {

      describe('when the x-akismet-debug-help header is present', function() {

        var client;
        var scope;

        beforeEach(function() {
          client = Akismet.client({
            blog : 'http://example.com',
            key  : 'testKey6'
          });
          scope = nock('http://testKey6.rest.akismet.com')
              .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
              .post('/1.1/comment-check')
              .reply(200, 'notAValidValueAtAll', {
                'Content-Type' : 'text/plain',
                'X-akismet-debug-help' : 'You did something wrong!'
              });
        });

        it('should return the akismet debug error', function(done) {
          client.checkSpamAsync({
            user_ip : '123.123.123.123'
          }).catch(function(err) {
            expect(err).to.equal('You did something wrong!');
            scope.done();
            done();
          });
        });

      });

      describe('when the x-akismet-debug-help header is not present', function() {

        var client;
        var scope;

        beforeEach(function() {
          client = Akismet.client({
            blog : 'http://example.com',
            key  : 'testKey6'
          });
          scope = nock('http://testKey6.rest.akismet.com')
              .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
              .post('/1.1/comment-check')
              .reply(200, 'notAValidValueAtAll', {
                'Content-Type' : 'text/plain'
              });
        });

        it('should return the response', function(done) {
          client.checkSpamAsync({
            user_ip : '123.123.123.123'
          }).catch(function(err) {
            expect(err).to.equal('notAValidValueAtAll');
            scope.done();
            done();
          });
        });
      });

    });

    describe('when the request fails', function() {

      var client;

      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey7',
          host : 'localhost' // will fail!
        });
      });

      it('should return the error', function(done) {
        client.checkSpamAsync({
          user_ip : '123.123.123.123'
        }).catch(function(err) {
          expect(err).to.not.be.null;
          done();
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
          blog : 'http://example.com',
          key  : 'testKey8'
        });
        scope = nock('http://testKey8.rest.akismet.com')
            .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
            .post('/1.1/submit-spam')
            .reply(200, 'Thank you for making the internet a better place', {
              'Content-Type' : 'text/plain'
            });
      });

      it('should return null', function(done) {
        client.submitSpam({
          user_ip : '123.123.123.123'
        }, function(err) {
          expect(err).to.be.null;
          scope.done();
          done();
        });
      });

    });

    describe('when the request returns a non 2XX status code', function() {

      var client;
      var scope;

      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey9'
        });
        scope = nock('http://testKey9.rest.akismet.com')
            .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
            .post('/1.1/submit-spam')
            .reply(500, 'Oh, whoops.', {
              'Content-Type' : 'text/plain'
            });
      });

      it('should return the message', function(done) {
        client.submitSpam({
          user_ip : '123.123.123.123'
        }, function(err) {
          expect(err).to.equal('Oh, whoops.');
          scope.done();
          done();
        });
      });

    });

    describe('when the request fails', function() {

      var client;

      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey10',
          host : 'localhost' // will fail!
        });
      });

      it('should return the error', function(done) {
        client.submitSpam({
          user_ip : '123.123.123.123'
        }, function(err) {
          expect(err).to.not.be.null;
          done();
        });
      });

    });

  });

  describe('client#submitSpamAsync()', function() {

    describe('when the request returns a 2XX status code ', function() {

      var client;
      var scope;

      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey8'
        });
        scope = nock('http://testKey8.rest.akismet.com')
            .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
            .post('/1.1/submit-spam')
            .reply(200, 'Thank you for making the internet a better place', {
              'Content-Type' : 'text/plain'
            });
      });

      it('should resolve', function(done) {
        client.submitSpamAsync({
          user_ip : '123.123.123.123'
        }).then(function(){
          scope.done();
          done();
        })
      });

    });

    describe('when the request returns a non 2XX status code', function() {

      var client;
      var scope;

      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey9'
        });
        scope = nock('http://testKey9.rest.akismet.com')
            .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
            .post('/1.1/submit-spam')
            .reply(500, 'Oh, whoops.', {
              'Content-Type' : 'text/plain'
            });
      });

      it('should return the message', function(done) {
        client.submitSpamAsync({
          user_ip : '123.123.123.123'
        }).catch(function(err) {
              expect(err).to.equal('Oh, whoops.');
              scope.done();
              done();
         });
      });

    });

    describe('when the request fails', function() {

      var client;

      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey10',
          host : 'localhost' // will fail!
        });
      });

      it('should return the error', function(done) {
        client.submitSpamAsync({
          user_ip : '123.123.123.123'
        }).catch(function(err) {
          expect(err).to.not.be.null;
          done();
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
          blog : 'http://example.com',
          key  : 'testKey11'
        });
        scope = nock('http://testKey11.rest.akismet.com')
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .post('/1.1/submit-ham')
        .reply(200, 'Thank you for making the internet a better place', {
          'Content-Type' : 'text/plain'
        });
      });
 
      it('should return null', function(done) {
        client.submitHam({
          user_ip : '123.123.123.123'
        }, function(err) {
          expect(err).to.be.null;
          scope.done();
          done();
        });
      });
 
    });
 
    describe('when the request returns a non 2XX status code', function() {
    
      var client;
      var scope;
      
      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey12'
        });
        scope = nock('http://testKey12.rest.akismet.com')
        .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
        .post('/1.1/submit-ham')
        .reply(500, 'Oh, whoops.', {
          'Content-Type' : 'text/plain'
        });
      });

      it('should return the message', function(done) {
        client.submitHam({
          user_ip : '123.123.123.123'
        }, function(err) {
          expect(err).to.equal('Oh, whoops.');
          scope.done();
          done();
        });
      });
 
    });

    describe('when the request fails', function() {
    
      var client;
      
      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey13',
          host : 'localhost' // will fail!
        });
      });

      it('should return the error', function(done) {
        client.submitHam({
          user_ip : '123.123.123.123'
        }, function(err) {
          expect(err).to.not.be.null;
          done();
        });
      });

    });

  });

  describe('client#submitHamAsync()', function() {

    describe('when the request returns a 2XX status code ', function() {

      var client;
      var scope;

      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey11'
        });
        scope = nock('http://testKey11.rest.akismet.com')
            .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
            .post('/1.1/submit-ham')
            .reply(200, 'Thank you for making the internet a better place', {
              'Content-Type' : 'text/plain'
            });
      });

      it('should resolve', function(done) {
        client.submitHamAsync({
          user_ip : '123.123.123.123'
        }).then(function(){
          scope.done();
          done();
        })
      });

    });

    describe('when the request returns a non 2XX status code', function() {

      var client;
      var scope;

      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey12'
        });
        scope = nock('http://testKey12.rest.akismet.com')
            .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
            .post('/1.1/submit-ham')
            .reply(500, 'Oh, whoops.', {
              'Content-Type' : 'text/plain'
            });
      });

      it('should return the message', function(done) {
        client.submitHamAsync({
          user_ip : '123.123.123.123'
        }).catch(function(err) {
          expect(err).to.equal('Oh, whoops.');
          scope.done();
          done();
        });
      });

    });

    describe('when the request fails', function() {

      var client;

      beforeEach(function() {
        client = Akismet.client({
          blog : 'http://example.com',
          key  : 'testKey13',
          host : 'localhost' // will fail!
        });
      });

      it('should return the error', function(done) {
        client.submitHamAsync({
          user_ip : '123.123.123.123'
        }).catch(function(err) {
          expect(err).to.not.be.null;
          done();
        });
      });

    });

  });

});
