
/* 
 * akismet.js
 * Provide Nodejs API bindings to the Akismet web service 
 * "Ham" refers to anything not spam 
 * See README for more info 
 */

require("setimmediate"); // Shim to support setImmediate in Node 0.8.x

var request = require('superagent');
var Promise = require('bluebird');

var Akismet = function(options) {

  /*
   * Configure our client based on provided options 
   */
  options         = options || {};
  this.key        = options.key;
  this.blog       = options.blog;
  this.port       = options.port || 80;
  this.host       = options.host || 'rest.akismet.com';
  this.version    = options.version || '1.1';
  this.endpoint   = options.endpoint || this.key + '.' + this.host + '/' + this.version + '/';
  this.userAgent  = options.userAgent || 'Node.js/' + process.version + ' | Akismet-api/1.1.0';

  // saved to use context inside the Promises
  var self = this;

  /*
   * Verify that the provided key is accepted by Akismet 
   */
  this.verifyKey = function(cb) {
    var url = this.host + '/' + this.version + '/verify-key';
    request
    .post(url)
    .type('form')
    .send({
      key  : this.key,
      blog : this.blog
    })
    .set('User-Agent', this.userAgent)
    .end(function(err, res) {
      if (err) cb(err, null);
      else if (res.text == 'valid') cb(null, true);
      else if (res.header['x-akismet-debug-help']) 
        cb(new Error(res.header['x-akismet-debug-help']), false);
      else if (res.text == 'invalid')
        cb(new Error('Invalid API key'), false);
      else 
        cb(new Error(res.text), false);
    });


  };

  /*
   * Verify that the provided key is accepted by Akismet
   *
   * Returns a promise that is resolved when the response is valid
   * and throws an error otherwise.
   */
  this.verifyKeyAsync = function() {
    return new Promise(function(resolve, reject){
      var url = self.host + '/' + self.version + '/verify-key';
      request
          .post(url)
          .type('form')
          .send({
            key  : self.key,
            blog : self.blog
          })
          .set('User-Agent', self.userAgent)
          .end(function(err, res) {
            var error;

            if (res && res.text == 'valid') resolve();

            if (err) error = err;
            else if (res.header['x-akismet-debug-help'])
              error = res.header['x-akismet-debug-help'];
            else if (res.text == 'invalid')
              error = 'Invalid API key';
            else
              error = res.text;

            reject(error);
          });
    });

  };

  /*
   * Check if the given data is spam 
   * Returns true for spam
   * Return false for ham 
   */
  this.checkSpam = function(options, cb) {
    var url = this.endpoint + 'comment-check';
    options = options || {};
    request
    .post(url)
    .type('form')
    .send({
      blog                 : this.blog,
      user_ip              : options.user_ip || '',
      permalink            : options.permalink || '',
      user_agent           : options.user_agent || '',
      comment_type         : options.comment_type || '',
      comment_author       : options.comment_author || '',
      comment_content      : options.comment_content || '',
      comment_author_url   : options.comment_author_url || '',
      comment_author_email : options.comment_author_email || '',
      referrer             : options.referrer || options.referer || ''
    })
    .set('User-Agent', this.userAgent)
    .end(function(err, res) {
      if (err) cb(err, null);
      else if (res.text == 'true') cb(null, true);
      else if (res.text == 'false') cb(null, false);
      else if (res.header['x-akismet-debug-help']) 
        cb(new Error(res.header['x-akismet-debug-help']), null);
      else if (res.text == 'invalid')
        cb(new Error('Invalid API key'), null);
      else 
        cb(new Error(res.text), null);
    });
  };

  /*
   * Check if the given data is spam
   * Returns a promise that resolves to true for spam
   * Returns a promise that resolves to false for ham
   */
  this.checkSpamAsync = function(options) {
    return new Promise(function(resolve, reject){
      var url = self.endpoint + 'comment-check';
      options = options || {};
      request
          .post(url)
          .type('form')
          .send({
            blog                 : self.blog,
            user_ip              : options.user_ip || '',
            permalink            : options.permalink || '',
            user_agent           : options.user_agent || '',
            comment_type         : options.comment_type || '',
            comment_author       : options.comment_author || '',
            comment_content      : options.comment_content || '',
            comment_author_url   : options.comment_author_url || '',
            comment_author_email : options.comment_author_email || '',
            referrer             : options.referrer || options.referer || ''
          })
          .set('User-Agent', self.userAgent)
          .end(function(err, res) {
            var error;

            if (res && res.text == 'true') resolve(true);
            if (res && res.text == 'false') resolve(false);

            if (err) error = err;
            else if (res.header['x-akismet-debug-help'])
              error = res.header['x-akismet-debug-help'];
            else if (res.text == 'invalid')
              error = 'Invalid API key';
            else
              error = res.text;

            reject(error);
          });
    })
  };

  /*
   * Submit the given value as a false-negative
   * Essentially, tell Akismet that they told us this WASN'T spam, but it WAS 
   */

  this.submitSpam = function(options, cb) {
    var url = this.endpoint + 'submit-spam';
    options = options || {};
    request
    .post(url)
    .type('form')
    .send({
      blog                 : this.blog,
      user_ip              : options.user_ip || '',
      permalink            : options.permalink || '',
      user_agent           : options.user_agent || '',
      comment_type         : options.comment_type || '',
      comment_author       : options.comment_author || '',
      comment_content      : options.comment_content || '',
      comment_author_url   : options.comment_author_url || '',
      comment_author_email : options.comment_author_email || '',
      referrer             : options.referrer || options.referer || ''
    })
    .set('User-Agent', this.userAgent)
    .end(function(err, res) { 
      if (err) cb(err);
      else if (res.statusType == 2) cb(null);
      else cb(res.text);
    });
  };

  /*
   * Submit the given value as a false-negative
   * Essentially, tell Akismet that they told us this WASN'T spam, but it WAS
   *
   * Returns a promise that resolves when there is no error and throws an error otherwise.
   */

  this.submitSpamAsync = function(options) {
    return new Promise(function(resolve, reject){
      var url = self.endpoint + 'submit-spam';
      options = options || {};
      request
          .post(url)
          .type('form')
          .send({
            blog                 : this.blog,
            user_ip              : options.user_ip || '',
            permalink            : options.permalink || '',
            user_agent           : options.user_agent || '',
            comment_type         : options.comment_type || '',
            comment_author       : options.comment_author || '',
            comment_content      : options.comment_content || '',
            comment_author_url   : options.comment_author_url || '',
            comment_author_email : options.comment_author_email || '',
            referrer             : options.referrer || options.referer || ''
          })
          .set('User-Agent', self.userAgent)
          .end(function(err, res) {
            var error;

            if (res && res.statusType == 2) resolve();

            error = err ? err : res.text;
            reject(error);
          });
    });
  };

  /*
   * Submit the given value as a false-positive
   * Essentially, tell Akismet that they told us this WAS spam, but it WASN'T 
   */
  this.submitHam = function(options, cb) {
    var url = this.endpoint + 'submit-ham';
    options = options || {};
    request
    .post(url)
    .type('form')
    .send({
      blog                 : this.blog,
      user_ip              : options.user_ip || '',
      permalink            : options.permalink || '',
      user_agent           : options.user_agent || '',
      comment_type         : options.comment_type || '',
      comment_author       : options.comment_author || '',
      comment_content      : options.comment_content || '',
      comment_author_url   : options.comment_author_url || '',
      comment_author_email : options.comment_author_email || '',
      referrer             : options.referrer || options.referer || ''
    })
    .set('User-agent', this.userAgent)
    .end(function(err, res) {
      if (err) cb(err);
      else if (res.statusType == 2) cb(null);
      else cb(res.text);
    });
  };

  /*
   * Submit the given value as a false-positive
   * Essentially, tell Akismet that they told us this WAS spam, but it WASN'T
   *
   * Returns a promise that resolves when there is no error and throws an error otherwise.
   */
  this.submitHamAsync = function(options) {
    return new Promise(function(resolve, reject){
      var url = self.endpoint + 'submit-ham';
      options = options || {};
      request
          .post(url)
          .type('form')
          .send({
            blog                 : self.blog,
            user_ip              : options.user_ip || '',
            permalink            : options.permalink || '',
            user_agent           : options.user_agent || '',
            comment_type         : options.comment_type || '',
            comment_author       : options.comment_author || '',
            comment_content      : options.comment_content || '',
            comment_author_url   : options.comment_author_url || '',
            comment_author_email : options.comment_author_email || '',
            referrer             : options.referrer || options.referer || ''
          })
          .set('User-agent', self.userAgent)
          .end(function(err, res) {
            var error;

            if (res && res.statusType == 2) resolve();

            error = err ? err : res.text;
            reject(error);
          });
    });
  };

};

module.exports = {

  Client : Akismet,

  /*
   * Shorthand Client constructor function 
   */
  client: function(options) {
    return new Akismet(options);
  }

};
