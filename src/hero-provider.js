import We3ProviderEngine from '../node_modules/web3-provider-engine/index.js';
import HookedWalletSubprovider from '../node_modules/web3-provider-engine/subproviders/hooked-wallet.js';
import RpcSubprovider from '../node_modules/web3-provider-engine/subproviders/rpc.js';
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
  new HookedWalletSubprovider({
    getAccounts: function(cb) {
      npc('HeroSignature', { accounts: 'get' }, function(json) {
        if (typeof json === 'string') {
          json = JSON.parse(json);
        }
        cb(json.npc === 'fail' ? { npc: 'fail' } : null, json);
      });
    },
    // approveTransaction: function(cb){
    //   cb(null,true);
    // },
    // sendTransaction: function(tx, cb){
    //   alert('sendTransaction');
    //   var signTx = tx;
    //   signTx.sign = true;
    //   cb(null,signTx);
    // },
    signTransaction: function(tx, cb) {
      npc('HeroSignature', { message: tx }, function(signTx) {
        cb(json.npc === 'fail' ? { npc: 'fail' } : null, signTx);
      });
    },
    sign: function(data, cb) {
      npc('HeroSignature', { message: tx }, function(signTx) {
        cb(json.npc === 'fail' ? { npc: 'fail' } : null, signTx);
      });
    },
  })
);
engine.addProvider(
  new RpcSubprovider({
    rpcUrl: 'https://localhost:3001',
  })
);
// engine.on('block', function(block){
//   console.log('================================')
//   console.log('BLOCK CHANGED:', '#'+block.number.toString('hex'), '0x'+block.hash.toString('hex'))
//   console.log('================================')
// })

// // network connectivity error
// engine.on('error', function(err){
//   // report connectivity errors
//   console.error(err.stack)
// })

// // start polling for blocks
engine.start();
