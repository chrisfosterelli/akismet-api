Comment Data Structure
======================

Akismet-api provides a "javascript" version of the Akismet API. We've converted the snake case
API attributes from Akismet into more idiomatic javascript variables. If you prefer 
the original, you can use them and they will work too.

This is the full list of attributes you can provide to Akismet on the comment.

```javascript
const comment = {
  ip: '123.123.123.123',
  useragent: 'MyUserAgent 1.0 WebKit',
  referrer: 'https://google.com',
  perma
}
```

The akismet API also requires a blog key which we provide directly.


| Parameter | Akismet API Key | Description |
| --- | --- | --- |
| ip | user_ip | The commentor's IP address |
| useragent | user_agent | The commentor's user agent |
| referrer| referrer | The referrer header sent by the commentor's browser |
| permalink | permalink | A permalink to the page containing the comment | 
| type| comment_type | The type of comment (e.g. "comment", "reply", "forum-post", "blog-post" |
| name | comment_author | The commentor's name |
| email | comment_author_email | The commentor's email |
| date | comment_date_gmt | The ISO 8601 format of the comment date. Defaults to current time |
| dateModified | comment_post_modfied_gmt | The ISO8601 format of the permalink's date |
| url | comment_author_url | The commentor's URL (only some sites collect this) |
| role | user_role | The commentor's 'role'. If set to 'administrator', it will never be marked spam. |
| recheckReason | recheck_reason | If you're checking the same comment twice, you can say why. E.g. 'edit' |
| content | comment_content | The actual content of the comment |
| isTest | is_test | Set this to `true` for your automated tests |
