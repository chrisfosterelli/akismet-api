const chai = require('chai')
const nock = require('nock')
const Akismet = require('../lib/akismet')

const expect = chai.expect

describe('comment structure', () => {
  it('should pass-through the Akismet API parameters', async () => {
    const client = Akismet.client({
      blog: 'https://example.com',
      blog_lang: 'en, fr_ca',
      blog_charset: 'UTF-8',
      key: 'testKey1'
    })
    const scope = nock('https://testKey1.rest.akismet.com')
      .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
      .post(
        '/1.1/comment-check',
        'user_ip=123.123.123.123' +
          '&user_agent=John%20Doe%20Agent%20v1' +
          '&referrer=https%3A%2F%2Fgoogle.com' +
          '&comment_author=John%20Doe' +
          '&comment_author_email=john%40doe.com' +
          '&comment_content=This%20is%20my%20comment%21' +
          '&is_test=true' +
          '&comment_type=comment' +
          '&comment_date_gmt=2019-12-22T13%3A05%3A04Z' +
          '&permalink=https%3A%2F%2Fexample.com%2Fposts%2F123215' +
          '&comment_post_modified_gmt=2019-12-22T13%3A05%3A04Z' +
          '&comment_author_url=https%3A%2F%2Fauthorsite.com' +
          '&user_role=user' +
          '&blog=https%3A%2F%2Fexample.com' +
          '&blog_lang=en%2C%20fr_ca' +
          '&blog_charset=UTF-8'
      )
      .reply(200, 'true', {
        'Content-Type': 'text/plain'
      })
    const isSpam = await client.checkSpam({
      user_ip: '123.123.123.123',
      user_agent: 'John Doe Agent v1',
      referrer: 'https://google.com',
      comment_author: 'John Doe',
      comment_author_email: 'john@doe.com',
      comment_content: 'This is my comment!',
      is_test: true,
      comment_type: 'comment',
      comment_date_gmt: '2019-12-22T13:05:04Z',
      permalink: 'https://example.com/posts/123215',
      comment_post_modified_gmt: '2019-12-22T13:05:04Z',
      comment_author_url: 'https://authorsite.com',
      user_role: 'user'
    })
    expect(isSpam).to.be.true
    scope.done()
  })

  it('should support a JS-specific API', async () => {
    const client = Akismet.client({
      blog: 'https://example.com',
      lang: 'en, fr_ca',
      charset: 'UTF-8',
      key: 'testKey1'
    })
    const scope = nock('https://testKey1.rest.akismet.com')
      .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
      .post(
        '/1.1/comment-check',
        'user_ip=123.123.123.123' +
          '&user_agent=John%20Doe%20Agent%20v1' +
          '&referrer=https%3A%2F%2Fgoogle.com' +
          '&comment_author=John%20Doe' +
          '&comment_author_email=john%40doe.com' +
          '&comment_content=This%20is%20my%20comment%21' +
          '&is_test=true' +
          '&comment_type=comment' +
          '&comment_date_gmt=2019-12-22T13%3A05%3A04Z' +
          '&permalink=https%3A%2F%2Fexample.com%2Fposts%2F123215' +
          '&comment_post_modified_gmt=2019-12-22T13%3A05%3A04Z' +
          '&comment_author_url=https%3A%2F%2Fauthorsite.com' +
          '&user_role=user' +
          '&blog=https%3A%2F%2Fexample.com' +
          '&blog_lang=en%2C%20fr_ca' +
          '&blog_charset=UTF-8'
      )
      .reply(200, 'true', {
        'Content-Type': 'text/plain'
      })
    const isSpam = await client.checkSpam({
      ip: '123.123.123.123',
      useragent: 'John Doe Agent v1',
      referrer: 'https://google.com',
      name: 'John Doe',
      email: 'john@doe.com',
      content: 'This is my comment!',
      isTest: true,
      type: 'comment',
      date: '2019-12-22T13:05:04Z',
      permalink: 'https://example.com/posts/123215',
      permalinkDate: '2019-12-22T13:05:04Z',
      url: 'https://authorsite.com',
      role: 'user'
    })
    expect(isSpam).to.be.true
    scope.done()
  })
})
