'use strict';

var messageLib = {};

messageLib.version = 'v' + require('./package.json').version;
messageLib.message = require('./lib/message');

module.exports = messageLib;
