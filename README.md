# ember-vcard

This is a simple vCard parser for ember-cli.    
It exports (now) only one usable function: parse(vCardString[, bringinForm])

## Installation

* `git clone <repository-url>` this repository
* `cd ember-vcard`
* `npm install`

## Usage

in your controller/component import the package

`import vcard from 'ember-vcard/vcard';`

then parse any vCard-string like so:

	actions: {
		parse() {
			let parsed = vcard.parse(this.get('vcardString'), true);
			console.log(parsed);
			// or
			let stringified = JSON.stringify(parsed, 0,2);
			this.set('outputParsed', stringified);
		},
	}


The method parse has two parameters:
- the vCard as string to be parsed
- an ooptional flag if the parsed object should be re-formed to a more useable form.


## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
