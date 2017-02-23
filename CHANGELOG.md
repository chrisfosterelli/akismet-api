2.2.0
=====

* Feature: Added `is_test` flag to `checkSpam()`

2.1.1
=====

* Patch: Updated superagent to 2.0.0

2.1.0
=====

* Feature: Added official support for Node 6.x 
* Feature: Added official support for Node 5.x 
* Patch: Updated superagent to 1.8.3
* Patch: Updated mocha to 2.4.5
* Patch: Updated chai to 3.5.0

2.0.0
=====

* Feature: Added support for promises
* Bug fix: Errors were sometimes strings, they'll now _always_ be `Error` instances
* **Minor Breaking:** Failed requests (that have an `err`) used to set the return value explicitly to `null`, but will now be `undefined`.
* **Minor Breaking:** If `verifyKey` returned `false`, it used to also provide an `err` with an explanation. `verifyKey` will now only provide an `err` if the request actually fails, otherwise the `err` value will be `null`. [See the new usage](https://github.com/chrisfosterelli/akismet-api#verifying-your-key).

1.1.5
=====

* Updated superagent to 0.21

1.1.4
=====

* Added CHANGELOG.md
