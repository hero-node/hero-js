import We3ProviderEngine from '../node_modules/web3-provider-engine/index.js';
import HookedWalletSubprovider from '../node_modules/web3-provider-engine/subproviders/hooked-wallet.js';
import RpcSubprovider from '../node_modules/web3-provider-engine/subproviders/rpc.js';
import FixtureSubprovider from '../node_modules/web3-provider-engine/subproviders/fixture.js';
// import FilterSubprovider from '../node_modules/web3-provider-engine/subproviders/filters.js';
import NonceSubprovider from '../node_modules/web3-provider-engine/subproviders/nonce-tracker.js';
import SubscriptionSubprovider from '../node_modules/web3-provider-engine/subproviders/subscriptions.js';
import CacheSubprovider from '../node_modules/web3-provider-engine/subproviders/cache.js';

import Web3 from '../node_modules/Web3/src/index.js';

var engine = new We3ProviderEngine();
window.Web3 = Web3;
window.web3 = new Web3(engine);
var npc = function(module, json, callback) {
  window[module + 'callback'] = callback;
  json.isNpc = true;
  var npcStr = 'heronpc://' + module + '?' + JSON.stringify(json);
  if (window.native) {
    window.native.npc(npcStr);
  } else {
    var iframe = document.createElement('iframe');
    iframe.setAttribute('src', npcStr);
    document.documentElement.appendChild(iframe);
    iframe.parentNode.removeChild(iframe);
    iframe = null;
  }
};

// if (window.location.href.search('hasMetamask')>=0) {
web3.currentProvider.isMetaMask = true; //we will delete this value in the future;
web3.currentProvider.isHeroNode = true;
// };
engine.addProvider(
  new FixtureSubprovider({
    web3_clientVersion: 'ProviderEngine/v0.0.0/javascript',
    net_listening: true,
    eth_hashrate: '0x00',
    eth_mining: false,
    eth_syncing: true,
  })
);

var filterAndSubsSubprovider = new SubscriptionSubprovider();
filterAndSubsSubprovider.on('data', function(err, notification) {
  engine.emit('data', err, notification);
});
engine.addProvider(filterAndSubsSubprovider);

engine.addProvider(new CacheSubprovider());
// engine.addProvider(new FilterSubprovider())
engine.addProvider(new NonceSubprovider());

engine.addProvider(
  new HookedWalletSubprovider({
    getAccounts: function(cb) {
      npc('HeroSignature', { accounts: 'get' }, function(json) {
        if (typeof json === 'string') {
          json = JSON.parse(json);
        }
        cb(json.npc === 'fail' ? { npc: 'fail' } : null, json);
      });
    },
    // sendTransaction: function(tx, cb){
    //   cb(null,tx);
    // },
    // sendSignedTransaction: function(tx, cb){
    //   cb(null,tx);
    // },
    signTransaction: function(tx, cb) {
      npc('HeroSignature', { transaction: tx }, function(signTx) {
        cb(signTx.npc === 'fail' ? signTx : null, signTx);
      });
    },
    sign: function(data, cb) {
      npc('HeroSignature', { message: tx }, function(signTx) {
        cb(signTx.npc === 'fail' ? signTx : null, signTx);
      });
    },
  })
);
engine.addProvider(
  new RpcSubprovider({
    rpcUrl: 'https://localhost:3001',
  })
);
engine.on('block', function(block) {});

// // network connectivity error
// engine.on('error', function(err){
//   // report connectivity errors
//   console.error(err.stack)
// })

// // start polling for blocks
npc('HeroSignature', { accounts: 'get' }, function(json) {
  if (typeof json === 'string') {
    json = JSON.parse(json);
  }
  web3.eth.defaultAccount = json[0];
});
engine.start();
