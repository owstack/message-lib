'use strict';

var owsCommon = require('@owstack/ows-common');
var keyLib = require('@owstack/key-lib');
var BufferWriter = owsCommon.encoding.BufferWriter;
var ECDSA = keyLib.crypto.ECDSA;
var JSUtil = owsCommon.util.js;
var PrivateKey = keyLib.PrivateKey;
var PublicKey = keyLib.PublicKey;
var Signature = keyLib.crypto.Signature;
var sha256sha256 = owsCommon.Hash.sha256sha256;
var lodash = owsCommon.deps.lodash;
var $ = owsCommon.util.preconditions;

/**
 * Constructs a new message to sign and verify.
 *
 * @param {String} message
 * @returns {Message}
 */
function Message(config, message) {
  if (!(this instanceof Message)) {
    return new Message(config, message);
  }
  $.checkArgument(lodash.isObject(config), 'First argument should be an object');
  $.checkArgument(lodash.isString(message), 'Second argument should be a string');

  this.config = config;
  this.message = message;

  return this;
};

Message.MAGIC_BYTES = new Buffer('Bitcoin Signed Message:\n');

Message.prototype.magicHash = function magicHash() {
  var prefix1 = BufferWriter.varintBufNum(Message.MAGIC_BYTES.length);
  var messageBuffer = new Buffer(this.message);
  var prefix2 = BufferWriter.varintBufNum(messageBuffer.length);
  var buf = Buffer.concat([prefix1, Message.MAGIC_BYTES, prefix2, messageBuffer]);
  var hash = sha256sha256(buf);
  return hash;
};

Message.prototype._sign = function _sign(privateKey) {
  $.checkArgument(privateKey instanceof PrivateKey,
    'First argument should be an instance of PrivateKey');
  var hash = this.magicHash();
  var ecdsa = new ECDSA();
  ecdsa.hashbuf = hash;
  ecdsa.privkey = privateKey;
  ecdsa.pubkey = privateKey.toPublicKey();
  ecdsa.signRandomK();
  ecdsa.calci();
  return ecdsa.sig;
};

/**
 * Will sign a message with a given private key.
 *
 * @param {PrivateKey} privateKey - An instance of PrivateKey
 * @returns {String} A base64 encoded compact signature
 */
Message.prototype.sign = function sign(privateKey) {
  var signature = this._sign(privateKey);
  return signature.toCompact().toString('base64');
};

Message.prototype._verify = function _verify(publicKey, signature) {
  $.checkArgument(publicKey instanceof PublicKey, 'First argument should be an instance of PublicKey');
  $.checkArgument(signature instanceof Signature, 'Second argument should be an instance of Signature');
  var hash = this.magicHash();
  var verified = ECDSA.verify(hash, signature, publicKey);
  if (!verified) {
    this.error = 'The signature was invalid';
  }
  return verified;
};

/**
 * Will return a boolean of the signature is valid for a given address.
 * If it isn't the specific reason is accessible via the "error" member.
 *
 * @param {Address|String} address - An address
 * @param {String} signatureString - A base64 encoded compact signature
 * @returns {Boolean}
 */
Message.prototype.verify = function verify(address, signatureString) {
  $.checkArgument(address);
  $.checkArgument(signatureString && lodash.isString(signatureString));

  if (lodash.isString(address)) {
    address = this.config.coinLib.Address.fromString(address);
  }
  var signature = Signature.fromCompact(new Buffer(signatureString, 'base64'));

  // recover the public key
  var ecdsa = new ECDSA();
  ecdsa.hashbuf = this.magicHash();
  ecdsa.sig = signature;
  var publicKey = ecdsa.toPublicKey();

  var signatureAddress = this.config.coinLib.Address.fromPublicKey(publicKey, address.network);

  // check that the recovered address and specified address match
  if (address.toString() !== signatureAddress.toString()) {
    this.error = 'The signature did not match the message digest';
    return false;
  }

  return this._verify(publicKey, signature);
};

/**
 * Instantiate a message from a message string
 *
 * @param {String} str - A string of the message
 * @returns {Message} A new instance of a Message
 */
Message.fromString = function(config, str) {
  return new Message(config, str);
};

/**
 * Instantiate a message from JSON
 *
 * @param {String} json - An JSON string or Object with keys: message
 * @returns {Message} A new instance of a Message
 */
Message.fromJSON = function fromJSON(config, json) {
  if (JSUtil.isValidJSON(json)) {
    json = JSON.parse(json);
  }
  return new Message(config, json.message);
};

/**
 * @returns {Object} A plain object with the message information
 */
Message.prototype.toObject = function toObject() {
  return {
    message: this.message
  };
};

/**
 * @returns {String} A JSON representation of the message information
 */
Message.prototype.toJSON = function toJSON() {
  return JSON.stringify(this.toObject());
};

/**
 * Will return a the string representation of the message
 *
 * @returns {String} Message
 */
Message.prototype.toString = function() {
  return this.message;
};

/**
 * Will return a string formatted for the console
 *
 * @returns {String} Message
 */
Message.prototype.inspect = function() {
  return '<Message: ' + this.toString() + '>';
};

module.exports = Message;
