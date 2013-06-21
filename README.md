Akismet-api
===========

Full Nodejs bindings to the Akismet (http://akismet.com) spam detection service.

Uses a modern HTTP client and provides a full test suite.

Installing
--------

```bash
npm install akismet-api
```

Testing
-------

```bash
cd node_modules/akismet-api
npm test
```

Creating the Client
-------------------

The blog and key values are required by Akismet.
There are a set of other avaliable default options visible in the source, but you likely will not need to change those.

```javascript
var akismet = require('akismet-api');
var client = akismet.client({
  key  : 'myKey',                   // Required!
  blog : 'http://myblog.com'        // Required!
});
```

Verifying your Key
------------------

It's a good idea to verify your key before use. If your key returns as invalid, the error field will contain the debug help message returned by Akismet.

```javascript
client.verifyKey(function(err, valid) {
  if (valid) {
    console.log('Valid key!');
  } else {
    console.log('Key validation failed...');
    console.log(err.message);
  }
});
```

Checking for Spam
-----------------

The user_ip, user_agent, and referrer are required options. All other options are optional, but will provide you with better spam detection accuracy.

```javascript
client.checkSpam({
  user_ip : '123.123.123.123',              // Required!
  user_agent : 'MyUserAgent 1.0 Webkit',    // Required!
  referrer : 'http://google.com',           // Required!
  permalink : 'http://myblog.com/myPost',
  comment_type : 'comment',
  comment_author : 'John Smith',
  comment_author_email : 'john.smith@gmail.com',
  comment_author_url : 'http://johnsblog.com',
  comment_content : 'Very nice blog! Check out mine!'
}, function(err, spam) {
  if (err) console.log ('Error!');
  if (spam) {
    console.log('OMG Spam!');
  } else {
    console.log('Totally not spam');
  }
});
```

Submitting False Negatives
--------------------------

If Akismet reports something as not-spam, but it turns out to be spam anyways, we can report this to Akismet via this API call.

```javascript
client.submitSpam({
  user_ip : '123.123.123.123',              // Required!
  user_agent : 'MyUserAgent 1.0 Webkit',    // Required!
  referrer : 'http://google.com',           // Required!
  permalink : 'http://myblog.com/myPost',
  comment_type : 'comment',
  comment_author : 'John Smith',
  comment_author_email : 'john.smith@gmail.com',
  comment_author_url : 'http://johnsblog.com',
  comment_content : 'Very nice blog! Check out mine!'
}, function(err) {
  if (!err) {
    console.log('Spam reported!');
  }
});
```

Submitting False Positives
--------------------------

If Akismet reports something as spam, but it turns out to not be spam anyways, we can report this to Akismet via this API call.

```javascript
client.submitHam({
  user_ip : '123.123.123.123',              // Required!
  user_agent : 'MyUserAgent 1.0 Webkit',    // Required!
  referrer : 'http://google.com',           // Required!
  permalink : 'http://myblog.com/myPost',
  comment_type : 'comment',
  comment_author : 'John Smith',
  comment_author_email : 'john.smith@gmail.com',
  comment_author_url : 'http://johnsblog.com',
  comment_content : 'Very nice blog! Check out mine!'
}, function(err) {
  if (!err) {
    console.log('Non-spam reported!');
  }
});
```

Development
-----------

Development was sponsored by MemoryLeaf Media.

Github: http://github.com/memoryleaf
Web: http://memoryleaf.net

