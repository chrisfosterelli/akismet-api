Comment Data Structure
======================

Akismet-api provides a "javascript" version of the Akismet API. We've converted
the snake case API attributes from Akismet into more idiomatic javascript
variables. If you prefer the original, you can use them and they will work too.

Provide as many of these as you can as it really helps with accuracy.

| Parameter | Akismet API Name | Description |
| --- | --- | --- |
| `ip` | `user_ip` | The commentor's IP address (**required**)|
| `useragent` | `user_agent` | The commentor's user agent |
| `referrer` | `referrer` | The referrer header sent by the commentor's browser |
| `content` | `comment_content` | The actual content of the comment |
| `name` | `comment_author` | The commentor's name |
| `email` | `comment_author_email` | The commentor's email |
| `url` | `comment_author_url` | The commentor's URL (only some sites collect this) |
| `date` | `comment_date_gmt` | The ISO 8601 format of the comment date. Defaults to current time |
| `permalink` | `permalink` | A permalink to the post being commented on | 
| `permalinkDate` | `comment_post_modfied_gmt` | The ISO8601 format of the permalink's date |
| `recheck` | `recheck_reason` | If checking a previously checked comment, you can provide a reason why (e.g. 'edit') |
| `type` | `comment_type` | The type of comment (e.g. 'comment', 'reply', 'forum-post', 'blog-post') |
| `role` | `user_role` | The commentor's 'role'. If set to 'administrator', it will never be marked spam |
| `honeypot` | `honeypot_field_name` | See section below for detailed description |
| `isTest` | `is_test` | Set this to `true` for your automated tests |

Honeypot field
--------------

Akismet supports a ["honeypot" field][0]. Honeypot fields are visually hidden
inputs which trick bot users into completing a field that human users can't
detect. If your form is submitted with a value in the honeypot field it is a
very strong signal for spam, because only a bot would detect and complete the
field. For convenience, Akismet-api provides a single field for honeypot values:

```javascript
comment['honeypot'] = myForm['myHoneypotField']
```

Like other comment fields, you can also use the official snake case API
attributes (both are equivalent):

```javascript
comment['honeypot_field_name'] = 'myHoneypotField'
comment['myHoneypotField'] = myForm['myHoneypotField']
```

Make sure that, on the user interface side, your honeypot field is hidden via
CSS or Javascript.

[0]: https://en.wikipedia.org/wiki/Honeypot_(computing)
