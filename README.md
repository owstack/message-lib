MessageLib
=======

[![NPM Package](https://img.shields.io/npm/v/@owstack/message-lib.svg?style=flat-square)](https://www.npmjs.org/package/@owstack/message-lib)
[![Build Status](https://img.shields.io/travis/com/owstack/message-lib.svg?branch=master&style=flat-square)](https://travis-ci.com/owstack/message-lib)
[![Coverage Status](https://img.shields.io/coveralls/owstack/message-lib.svg?style=flat-square)](https://coveralls.io/r/owstack/message-lib)

Adds support for verifying and signing messages in [Node.js](http://nodejs.org/) and web browsers.

## Getting Started

```sh
npm install @owstack/message-lib
```

## Example
To sign a message:

```javascript
const {PrivateKey} = require('@owstack/key-lib');
const Message = require('@owstack/message-lib');
const btcLib = require('@owstack/btc-lib');
const config = {coinLib: btcLib};

const privateKey = PrivateKey.fromWIF('cPBn5A4ikZvBTQ8D7NnvHZYCAxzDZ5Z2TSGW2LkyPiLxqYaJPBW4');
const signature = new Message(config, 'hello, world').sign(privateKey);
```

To verify a message:

```javascript
const {PrivateKey} = require('@owstack/key-lib');
const Message = require('@owstack/message-lib');
const btcLib = require('@owstack/btc-lib');
const config = {coinLib: btcLib};

const address = 'n1ZCYg9YXtB5XCZazLxSmPDa8iwJRZHhGx';
const signature = 'H/DIn8uA1scAuKLlCx+/9LnAcJtwQQ0PmcPrJUq90aboLv3fH5fFvY+vmbfOSFEtGarznYli6ShPr9RXwY9UrIY=';
const verified = new Message(config, 'hello, world').verify(address, signature);
```

## License

Code released under [the MIT license](https://github.com/owstack/message-lib/blob/master/LICENSE).

Copyright 2019 Open Wallet Stack.
