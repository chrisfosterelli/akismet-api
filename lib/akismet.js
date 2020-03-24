const Promise = require('bluebird')
const request = require('superagent')
const pjson = require('../package.json')

Promise.promisifyAll(request)

// Index 0 is the API key, indices >= 1 are aliases
const clientAliases = [
  ['blog'],
  ['blog_lang', 'lang'],
  ['blog_charset', 'charset']
]

const commentAliases = [
  ['user_ip', 'ip'],
  ['user_agent', 'useragent'],
  ['referrer', 'referer'],
  ['comment_author', 'name'],
  ['comment_author_email', 'email'],
  ['comment_content', 'content'],
  ['is_test', 'isTest'],
  ['comment_type', 'type'],
  ['comment_date_gmt', 'date'],
  ['permalink'],
  ['comment_post_modified_gmt', 'permalinkDate'],
  ['comment_author_url', 'url'],
  ['user_role', 'role']
]

function mapAliases(input, aliases = commentAliases) {
  const output = {}
  for (const alias of aliases) {
    for (const key of alias) {
      if (input[key] !== undefined) {
        output[alias[0]] = input[key]
      }
    }
  }
  return output
}

class AkismetClient {
  // Configure our client based on provided options
  constructor(options = {}) {
    this.requestOpts = mapAliases(options, clientAliases)
    this.host = options.host || 'rest.akismet.com'
    this.protocol = options.protocol || 'https'
    this.version = options.version || '1.1'
    this.blog = options.blog
    this.key = options.key

    this.userAgent =
      options.userAgent ||
      `Node.js/${process.version} | Akismet-api/${pjson.version}`
    this.rootEndpoint = `${this.protocol}://${this.host}/${this.version}/`
    this.endpoint = `${this.protocol}://${this.key}.${this.host}/${this.version}/`
  }

  // Verify that the provided key is accepted by Akismet
  verifyKey(cb) {
    const url = `${this.rootEndpoint}verify-key`
    return request
      .post(url)
      .type('form')
      .send({
        key: this.key,
        blog: this.blog
      })
      .set('User-Agent', this.userAgent)
      .endAsync()
      .then(function (res) {
        if (res.text == 'valid') return true
        if (res.text == 'invalid') return false
        throw new Error(res.text)
      })
      .asCallback(cb)
  }

  // Check if the given data is spam
  checkSpam(comment = {}, cb) {
    const url = `${this.endpoint}comment-check`
    comment = { ...mapAliases(comment), ...this.requestOpts }
    return request
      .post(url)
      .type('form')
      .send(comment)
      .set('User-Agent', this.userAgent)
      .endAsync()
      .then(res => {
        if (res.text == 'true') return true
        if (res.text == 'false') return false
        if (res.text == 'invalid') throw new Error('Invalid API key')
        if (res.header['x-akismet-debug-help'])
          throw new Error(res.header['x-akismet-debug-help'])
        throw new Error(res.text)
      })
      .asCallback(cb)
  }

  // Submit the given value as a false-negative
  submitSpam(comment = {}, cb) {
    const url = `${this.endpoint}submit-spam`
    comment = { ...mapAliases(comment), ...this.requestOpts }
    return request
      .post(url)
      .type('form')
      .send(comment)
      .set('User-Agent', this.userAgent)
      .endAsync()
      .asCallback(cb)
  }

  // Submit the given value as a false-positive
  submitHam(comment = {}, cb) {
    const url = `${this.endpoint}submit-ham`
    comment = { ...mapAliases(comment), ...this.requestOpts }
    return request
      .post(url)
      .type('form')
      .send(comment)
      .set('User-Agent', this.userAgent)
      .endAsync()
      .asCallback(cb)
  }
}

module.exports = {
  AkismetClient,

  // For backward compatability
  Client: AkismetClient,
  client: options => {
    return new AkismetClient(options)
  }
}
