Akismet-api
===========

[![Build Status][img:build]][build]
[![Download Count][img:downloads]][downloads]
[![License][img:license]][license]

Full Nodejs bindings to the Akismet (https://akismet.com) spam detection
service.

Features:
* Typescript support 
* API support for async/await, promises, and callbacks
* Supports all active versions of node (14 to 19)
* Supports all Akismet API features
* Complete set of unit and integration tests
* Idiomatic JS parameters (with backward compatability)
* Trusted by many projects (like [Coral][coral]!)

_Upgrading to 6.0?_ Changes are fairly minimal as long as you're on an active
version of node, but check out the [changelog][changelog] for full details.

**These docs below are with ES6 async/await usage, but if you prefer another
API you can also use this library [with promises][promises] or [with
callbacks][callbacks]!**

Installing
----------

```bash
$ npm install --save akismet-api
```

Creating the Client
-------------------

Your blog URL and API key are required by Akismet and are all you will need to
get started! For a full list of available client parameters and alternative
constructors, check out the [client documentation][client].

```javascript
import { AkismetClient } from 'akismet-api'

const key = 'myKey'
const blog = 'https://myblog.com'
const client = new AkismetClient({ key, blog })
```

Verifying your Key
------------------

It's a good idea to verify your key before use.

```javascript
try {
  const isValid = await client.verifyKey()

  if (isValid) console.log('Valid key!')
  else console.log('Invalid key!')
} catch (err) {
  console.error('Could not reach Akismet:', err.message)
}
```

Creating a Comment
------------------

A comment, at the bare minimum, must have the commenter's IP and user agent.
You can provide more than that for better accuracy and doing so is strongly
recommended. The following is a basic example, but see our documentation on the
[comment data structure][comments] for a complete list of fields you can
provide.

```javascript
const comment = {
  ip: '123.123.123.123',
  useragent: 'CommentorsAgent 1.0 WebKit',
  content: 'Very nice blog! Check out mine!',
  email: 'not.a.spammer@gmail.com',
  name: 'John Doe'
}
```

Checking for Spam
-----------------

Once you have a comment, we can check it! This tells you if it is spam or not.
If Akismet cannot be reached or returns an error, `checkSpam` will throw an
exception.

```javascript
try {
  const isSpam = await client.checkSpam(comment)

  if (isSpam) console.log('OMG Spam!')
  else console.log('Totally not spam')
} catch (err) {
  console.error('Something went wrong:', err.message)
}
```

Submitting False Negatives
--------------------------

If Akismet reports something as not-spam, but it turns out to be spam anyways,
we can report this to Akismet to help improve their accuracy in the future.

```javascript
try {
  await client.submitSpam(comment)
  console.log('Spam reported!')
} catch (err) {
  console.error('Something went wrong:', err.message)
}
```

Submitting False Positives
--------------------------

If Akismet reports something as spam, but it turns out to not be spam, we can
report this to Akismet too.

```javascript
try {
  await client.submitHam(comment)
  console.log('Non-spam reported!')
} catch (err) {
  console.error('Something went wrong:', err.message)
}
```

Testing
-------

If you are running integration tests on your app with Akismet, you should set 
`isTest: true` in your comments! That way, your testing data won't affect
Akismet.

To run the library's tests, just use `npm test`. To also run the optional
integration tests, include a valid Akismet API key in the `AKISMET_KEY`
environment variable.

```bash
npm test
```

Credits
-------

Author and maintainer is [Chris Foster][chrisfosterelli].
Development was sponsored by [Two Story Robot][twostoryrobot]

License
-------

Released under the MIT license.

See [LICENSE.txt][license] for more information.

[img:build]: https://img.shields.io/github/actions/workflow/status/chrisfosterelli/akismet-api/main.yml?style=flat-square&branch=main
[img:downloads]: https://img.shields.io/npm/dm/akismet-api.svg?style=flat-square
[img:license]: https://img.shields.io/npm/l/akismet-api.svg?style=flat-square
[build]: https://github.com/chrisfosterelli/akismet-api/actions
[deps]: https://david-dm.org/chrisfosterelli/akismet-api
[downloads]: https://www.npmjs.com/package/akismet-api
[license]: /LICENSE.txt
[coral]: https://github.com/coralproject/talk
[changelog]: /CHANGELOG.md
[chrisfosterelli]: https://github.com/chrisfosterelli
[twostoryrobot]: https://github.com/twostoryrobot
[comments]: /docs/comments.md
[promises]: /docs/promises.md
[callbacks]: /docs/callbacks.md
[client]: /docs/client.md
