MessageLib
=======

[![NPM Package](https://img.shields.io/npm/v/message-lib.svg?style=flat-square)](https://www.npmjs.org/package/message-lib)
[![Build Status](https://img.shields.io/travis/owstack/message-lib.svg?branch=master&style=flat-square)](https://travis-ci.org/owstack/message-lib)
[![Coverage Status](https://img.shields.io/coveralls/owstack/message-lib.svg?style=flat-square)](https://coveralls.io/r/owstack/message-lib?branch=master)

Adds support for verifying and signing messages in [Node.js](http://nodejs.org/) and web browsers.

## Getting Started

```sh
npm install message-lib
```

```sh
bower install message-lib
```

## Example
To sign a message:

```javascript
var btcLib = require('@owstack/btc-lib');
var config = {coinLib: btcLib};

var privateKey = PrivateKey.fromWIF('cPBn5A4ikZvBTQ8D7NnvHZYCAxzDZ5Z2TSGW2LkyPiLxqYaJPBW4');
var signature = Message(config, 'hello, world').sign(privateKey);
```

To verify a message:

```javascript
var btcLib = require('@owstack/btc-lib');
var config = {coinLib: btcLib};

var address = 'n1ZCYg9YXtB5XCZazLxSmPDa8iwJRZHhGx';
var signature = 'H/DIn8uA1scAuKLlCx+/9LnAcJtwQQ0PmcPrJUq90aboLv3fH5fFvY+vmbfOSFEtGarznYli6ShPr9RXwY9UrIY=';
var verified = Message(config, 'hello, world').verify(address, signature);
```

## License

Code released under [the MIT license](https://github.com/owstack/message-lib/blob/master/LICENSE).

Copyright 2019 Open Wallet Stack.

