4.0.1
=====

* Patch: Update superagent to 3.8.0

4.0.0
=====

* Feature: Add official support for Node 9.x
* Patch: Update superagent to 3.6.1
* Patch: Update mocha to 4.0.0
* **Breaking:** Removed support for node 0.10 (end of life)
* **Breaking:** Removed support for node 0.12 (end of life)
* **Breaking:** Removed support for io.js (end of life)

3.0.0
=====

* Feature: Added official support for Node 8.x
* Feature: Added official support for Node 7.x
* Feature: Added support for `is_test` in `submitHam` and `submitSpam`
* Feature: Added test suite for the client promise API
* Feature: Requests to Akismet now default to HTTPS
* Feature: Added `protocol` option to the constructor
* Patch: Updated superagent to 3.0.0
* Patch: Updated nock to 9.0.6
* Patch: Updated chai to 4.0.1
* Patch: Updated mocha to 3.4.1
* Patch: Removed dependency on `setimmediate`
* **Breaking:** Removed support for Node 0.8. Node 0.8 reached end-of-life a 
very long time ago, you should upgrade if you are still using it.

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
