window.heroSignature = {
  init: function() {
    window.web3 = {};
    window.addEventListener('load', function() {
      if (window.Web3) {
        Object.keys(window).forEach(function(k) {
          if (window[k] && window[k].eth) {
            var web3 = window[k];
            web3.currentProvider = new Web3.providers.HttpProvider(
              'https://infura.io/33USgHxvCp3UoDItBSRs'
            );
            web3.eth.accounts = function() {
              return new Promise(function(resolve, reject) {
                window.heroSignature.npc(
                  'HeroSignature',
                  { accounts: 'get' },
                  function(json) {
                    if (typeof json === 'string') {
                      json = JSON.parse(json);
                    }
                    if (json.npc === 'fail') {
                      reject();
                    } else {
                      resolve(json);
                    }
                  }
                );
              });
            };
            web3.eth.getAccounts = async function() {
              return eth.accounts();
            };
          }
        });
      }
    });
  },
  npc: function(module, json, callback) {
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
  },
};
window.heroSignature.init();
