const ecies = require('eth-ecies');
const Buffer = require('safe-buffer').Buffer;
const Wallet = require('ethereumjs-wallet');
const EthUtil = require('ethereumjs-util');
const crypto = require('crypto');

function getPublicKey(priva) {
  var suffixPriv = priva;
  if (suffixPriv.indexOf('0x') == -1) {
    suffixPriv = '0x' + priva;
  }
  const priBuff = EthUtil.toBuffer(suffixPriv);
  const wallet = Wallet.fromPrivateKey(priBuff);
  return wallet.getPublicKeyString();
}

function encrypt(pub, data, iv, randomBytes) {
  var purePub = pub;
  if (pub.indexOf('0x') != -1) {
    purePub = pub.slice(2);
  }
  let userPub = Buffer.from(purePub, 'hex');
  let bufferData = Buffer.from(data);
  let encryptedData = ecies.encrypt(userPub, bufferData, {
    iv: Buffer.from(iv, 'hex'),
    ephemPrivKey: Buffer.from(randomBytes, 'hex'),
  });

  return encryptedData.toString('base64');
}

function decrypt(priva, encryptedData) {
  var purePriv = priva;
  if (priva.indexOf('0x') != -1) {
    purePriv = priva.slice(2);
  }

  let userPriv = Buffer.from(purePriv, 'hex');
  let bufferEncryptedData = Buffer.from(encryptedData, 'base64');
  let decryptedData = ecies.decrypt(userPriv, bufferEncryptedData);

  return decryptedData.toString('utf8');
}

global.getPublicKey = getPublicKey;
global.heroencrypt = encrypt;
global.decrypt = decrypt;

// console.log(crypto.randomBytes(32).toString('hex'))
// var en = encrypt('0xf2e0c123f725cc00d38f46786bea9efc2e07f26af555b843015fdbf265ad7326f3cdab33bc7eb0c2948d08f1fa37921dec6fb4c5cc56ac6b502cfc05dc6003f6', 'hello', '7cf5e4b3d4bb39345eecad787f339e86f82ac8a51748c0d08f29e3b6cdc42ba3')
// console.log(en)
// console.log(decrypt('24ba34c164996d969a32b70f91c037fcdb0b821fa93ead9ea7e54ba8cf7dcbfb', en))
