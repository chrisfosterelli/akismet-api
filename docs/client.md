Client Constructor
==================

Akismet-api provides a "javascript" version of the Akismet API. We've converted
the snake case API attributes from Akismet into more idiomatic javascript
variables. If you prefer the original, you can use them and they will work too.

You create an instance of the Akismet client with the `AkismetClient` class. It
accepts the following options:

| Parameter | Akismet API name | Description |
| --- | --- | --- |
| `key` | N/A | Your Akismet API key (**required**) |
| `blog` | `blog` | The URL of the domain you are using Aksimet with (**required**) |
| `lang` | `blog_lang` | ISO 639-1 language of the languages used on your site (e.g. 'en, fr_ca') |
| `charset` | `blog_charset` | The character encoding of the data you'll be checking (e.g. 'UTF-8') |
