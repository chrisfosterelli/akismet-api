
/* 
 * akismet.js
 * Provide Nodejs API bindings to the Akismet web service 
 * "Ham" refers to anything not spam 
 * See README for more info 
 */

var request = require('superagent');

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
