Client Constructor
==================

You create an instance of the Akismet client with the `AkismetClient` class. It
accepts the following options:

| Parameter | Akismet API name | Description |
| --- | --- | --- |
| `key` | N/A | Your Akismet API key (**required**) |
| `blog` | `blog` | The URL of the domain you are using Aksimet with (**required**) |
| `lang` | `blog_lang` | ISO 639-1 language of the languages used on your site (e.g. "en, fr_ca") |
| `charset` | `blog_charset` | The character encoding of the data in the comment (e.g. "UTF-8") |
