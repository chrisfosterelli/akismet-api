
/* 
 * akismet.js
 * Provide Nodejs API bindings to the Akismet web service 
 * "Ham" refers to anything not spam 
 * See README for more info 
 */

var Promise = require('bluebird');
var request = require('superagent');
var pjson   = require('../package.json');

Promise.promisifyAll(request);

var Akismet = function(options) {

  /*
  /* Configure our client based on provided options 
   */

  options        = options || {};
  this.key       = options.key;
  this.blog      = options.blog;
  this.port      = options.port || 80;
  this.version   = options.version || '1.1';
  this.protocol  = options.protocol || 'https';
  this.host      = options.host || 'rest.akismet.com';
  this.endpoint  = options.endpoint || this.protocol + '://' + this.key + '.' + this.host + '/' + this.version + '/';
  this.userAgent = options.userAgent || 'Node.js/' + process.version + ' | Akismet-api/' + pjson.version;

  /*
   * Verify that the provided key is accepted by Akismet 
   */

  this.verifyKey = function(cb) {
    var url = this.protocol + '://' + this.host + '/' + this.version + '/verify-key';
    return request
    .post(url)
    .type('form')
    .send({
      key  : this.key,
      blog : this.blog
    })
    .set('User-Agent', this.userAgent)
    .endAsync()
    .then(function(res) {
      if (res.text == 'valid') return true;
      if (res.text == 'invalid') return false;
      throw new Error(res.text);
    })
    .asCallback(cb);
  };

  /*
   * Check if the given data is spam 
   * Returns true for spam
   * Return false for ham 
   */

  this.checkSpam = function(options, cb) {
    var url = this.endpoint + 'comment-check';
    options = options || {};
    return request
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
      referrer             : options.referrer || options.referer || '',
      is_test              : options.is_test === true
    })
    .set('User-Agent', this.userAgent)
    .endAsync()
    .then(function(res) {
      if (res.text == 'true') return true;
      if (res.text == 'false') return false;
      if (res.text == 'invalid') throw new Error('Invalid API key');
      if (res.header['x-akismet-debug-help']) throw new Error(res.header['x-akismet-debug-help']);
      throw new Error(res.text);
    })
    .asCallback(cb);
  };

  /*
   * Submit the given value as a false-negative
   * Essentially, tell Akismet that they told us this WASN'T spam, but it WAS 
   */

  this.submitSpam = function(options, cb) {
    var url = this.endpoint + 'submit-spam';
    options = options || {};
    return request
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
      referrer             : options.referrer || options.referer || '',
      is_test              : options.is_test === true
    })
    .set('User-Agent', this.userAgent)
    .endAsync()
    .asCallback(cb);
  };

  /*
   * Submit the given value as a false-positive
   * Essentially, tell Akismet that they told us this WAS spam, but it WASN'T 
   */

  this.submitHam = function(options, cb) {
    var url = this.endpoint + 'submit-ham';
    options = options || {};
    return request
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
      referrer             : options.referrer || options.referer || '',
      is_test              : options.is_test === true
    })
    .set('User-agent', this.userAgent)
    .endAsync()
    .asCallback(cb);
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
