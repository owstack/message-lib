'use strict';

var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

var bchLib = require('@owstack/bch-lib');
var btcLib = require('@owstack/btc-lib');
var ltcLib = require('@owstack/ltc-lib');
var keyLib = require('@owstack/key-lib');
var Message = require('..');
var Signature = keyLib.crypto.Signature;

describe('Message', function() {

  var address = 'n1ZCYg9YXtB5XCZazLxSmPDa8iwJRZHhGx';
  var badAddress = 'mmRcrB5fTwgxaFJmVLNtaG8SV454y1E3kC';
  var privateKey = keyLib.PrivateKey.fromWIF('cPBn5A4ikZvBTQ8D7NnvHZYCAxzDZ5Z2TSGW2LkyPiLxqYaJPBW4', 'testnet');

  var text = 'hello, world';
  var signatureString = 'H/DIn8uA1scAuKLlCx+/9LnAcJtwQQ0PmcPrJUq90aboLv3fH5fFvY+vmbfOSFEtGarznYli6ShPr9RXwY9UrIY=';

  var badSignatureString = 'H69qZ4mbZCcvXk7CWjptD5ypnYVLvQ3eMXLM8+1gX21SLH/GaFnAjQrDn37+TDw79i9zHhbiMMwhtvTwnPigZ6k=';

  var signature = Signature.fromCompact(new Buffer(signatureString, 'base64'));
  var badSignature = Signature.fromCompact(new Buffer(badSignatureString, 'base64'));

  var publicKey = privateKey.toPublicKey();

  var bchPrivateKey = new keyLib.PrivateKey('KwF9LjRraetZuEjR8VqEq539z137LW5anYDUnVK11vM3mNMHTWb4', 'bch');
  var bchPublicKey = bchPrivateKey.toPublicKey();
  var bchSignatureString = 'IOMkHmNmz7lCnIeuRMvRsq1G4tDN4gJkGxzlm9bek1dYU2ZlLsGd6/9yF3Gr0YVVDAGjK+OuXCoMUBOqXMQQ6eA=';
  var bchSignature = Signature.fromCompact(new Buffer(bchSignatureString, 'base64'));

  var ltcPrivateKey = new keyLib.PrivateKey('T35QnUj2z2sAg5NHg8n73RaXvrgRQb6Ubk7jeHwYatXDHFvTPJyA', 'ltc');
  var ltcPublicKey = ltcPrivateKey.toPublicKey();
  var ltcSignatureString = 'H0nSCpviGAHcWlKaWluGSL0mbgTF33SwuDIsaDhFeTkPVae1ryB7fdjGLC513IwhjWnyf78uT2nf6bDV5rQ0eNU=';
  var ltcSignature = Signature.fromCompact(new Buffer(ltcSignatureString, 'base64'));

  it('will error with incorrect message type', function() {
    expect(function() {
      return new Message(new Date(), 'btc');
    }).to.throw('First argument should be a string');
  });

  it('will instantiate without "new"', function() {
    var message = new Message(text, 'btc');
    should.exist(message);
  });

  var signature2;
  var signature3;

  it('can sign a message with BTC private key', function() {
    var message2 = new Message(text, 'btc');
    signature2 = message2._sign(privateKey);
    signature3 = new Message(text, 'btc').sign(privateKey);
    should.exist(signature2);
    should.exist(signature3);
  });

  it('can sign a message with BCH private key', function() {
    var message2 = new Message(text, 'bch');
    var signature4 = message2._sign(bchPrivateKey);
    var signature5 = new Message(text, 'bch').sign(bchPrivateKey);
    should.exist(signature4);
    should.exist(signature5);
  });

  it('can sign a message with LTC private key', function() {
    var message2 = new Message(text, 'ltc');
    var signature4 = message2._sign(ltcPrivateKey);
    var signature5 = new Message(text, 'ltc').sign(ltcPrivateKey);
    should.exist(signature4);
    should.exist(signature5);
  });

  it('sign will error with incorrect private key argument', function() {
    expect(function() {
      var message3 = new Message(text, 'btc');
      return message3.sign('not a private key');
    }).to.throw('First argument should be an instance of PrivateKey');
  });

  it('can verify a message with signature BTC', function() {
    var message4 = new Message(text, 'btc');
    var verified = message4._verify(publicKey, signature2);
    verified.should.equal(true);
  });

  it('can verify a message with signature BCH', function() {
    var message4 = new Message(text, 'bch');
    var verified = message4._verify(bchPublicKey, bchSignature);
    verified.should.equal(true);
  });

  it('can verify a message with signature LTC', function() {
    var message4 = new Message(text, 'ltc');
    var verified = message4._verify(ltcPublicKey, ltcSignature);
    verified.should.equal(true);
  });

  it('can verify a message with existing signature', function() {
    var message5 = new Message(text, 'btc');
    var verified = message5._verify(publicKey, signature);
    verified.should.equal(true);
  });

  it('verify will error with incorrect public key argument', function() {
    expect(function() {
      var message6 = new Message(text, 'btc');
      return message6._verify('not a public key', signature);
    }).to.throw('First argument should be an instance of PublicKey');
  });

  it('verify will error with incorrect signature argument', function() {
    expect(function() {
      var message7 = new Message(text, 'btc');
      return message7._verify(publicKey, 'not a signature');
    }).to.throw('Second argument should be an instance of Signature');
  });

  it('verify will correctly identify a bad signature', function() {
    var message8 = new Message(text, 'btc');
    var verified = message8._verify(publicKey, badSignature);
    should.exist(message8.error);
    verified.should.equal(false);
  });

  it('can verify a message with address and generated signature string', function() {
    var message9 = new Message(text, 'btc');
    var verified = message9.verify(address, signature3);
    should.not.exist(message9.error);
    verified.should.equal(true);
  });

  it('will not verify with address mismatch', function() {
    var message10 = new Message(text, 'btc');
    var verified = message10.verify(badAddress, signatureString);
    should.exist(message10.error);
    verified.should.equal(false);
  });

  it('will verify with an uncompressed pubkey', function() {
    var privateKey = new keyLib.PrivateKey('5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss', 'btc');
    var message = new Message('This is an example of a signed message.', 'btc');
    var signature = message.sign(privateKey);
    var verified = message.verify(btcLib.Address.fromPrivateKey(privateKey), signature);
    verified.should.equal(true);
  });

  it('can chain methods', function() {
    var verified = new Message(text, 'btc').verify(address, signatureString);
    verified.should.equal(true);
  });

  it('accepts BTC Address for verification', function() {
    var verified = new Message(text, 'btc')
      .verify(new btcLib.Address(address), signatureString);
    verified.should.equal(true);
  });

  it('can do BCH', function() {
    var verified = new Message(text, 'btc').verify(address, signatureString);
    verified.should.equal(true);
  });

  describe('#json', function() {

    it('roundtrip to-from-to', function() {
      var json = new Message(text, 'btc').toJSON();
      var message = new Message.fromJSON(json, 'btc');
      message.toString().should.equal(text);
    });

    it('checks that the string parameter is valid JSON', function() {
      expect(function() {
        return Message.fromJSON('¹', 'btc');
      }).to.throw();
    });

  });

  describe('#toString', function() {

    it('message string', function() {
      var message = new Message(text, 'btc');
      message.toString().should.equal(text);
    });

    it('roundtrip to-from-to', function() {
      var str = new Message(text, 'btc').toString();
      var message = new Message.fromString(str, 'btc');
      message.toString().should.equal(text);
    });

  });

  describe('#inspect', function() {

    it('should output formatted output correctly', function() {
      var message = new Message(text, 'btc');
      var output = '<Message: '+text+'>';
      message.inspect().should.equal(output);
    });

  });

});
