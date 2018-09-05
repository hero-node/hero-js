window.fuABI = [ 
    { "constant": false, "inputs": [ { "name": "massage", "type": "string" } ], "name": "sponsor", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" },
    { "constant": true, "inputs": [], "name": "ticketPrice", "outputs": [ { "name": "", "type": "uint256", "value": "10000000000000000" } ], "payable": false, "stateMutability": "view", "type": "function" },
    { "constant": false, "inputs": [ { "name": "add", "type": "address" } ], "name": "synthesizeHelp", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" },
    { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "happyNewYear", "outputs": [ { "name": "btc", "type": "uint256", "value": "0" }, { "name": "eth", "type": "uint256", "value": "0" }, { "name": "eos", "type": "uint256", "value": "0" }, { "name": "qtum", "type": "uint256", "value": "0" }, { "name": "hnc", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, 
    { "constant": false, "inputs": [ { "name": "add", "type": "address" }, { "name": "massage", "type": "string" } ], "name": "sponsorHelp", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, 
    { "constant": true, "inputs": [], "name": "reward", "outputs": [ { "name": "", "type": "uint256", "value": "100000000000000000" } ], "payable": false, "stateMutability": "view", "type": "function" }, 
    { "constant": false, "inputs": [ { "name": "reciver", "type": "address" }, { "name": "luckyType", "type": "uint256" } ], "name": "sentLucky", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, 
    { "constant": false, "inputs": [ { "name": "add", "type": "address" } ], "name": "payHelp", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, 
    { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address", "value": "0x39d21006bafa9a8c25309d579eb26e51032fdc1f" } ], "payable": false, "stateMutability": "view", "type": "function" }, 
    { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "sponsors", "outputs": [ { "name": "spo", "type": "address", "value": "0x39d21006bafa9a8c25309d579eb26e51032fdc1f" }, { "name": "msg", "type": "string", "value": "Hero Node" }, { "name": "amount", "type": "uint256", "value": "1000000000000000000" } ], "payable": false, "stateMutability": "view", "type": "function" }, 
    { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "awareders", "outputs": [ { "name": "", "type": "address", "value": "0x164732dc9261b06b2c3bc700f1c534c999088585" } ], "payable": false, "stateMutability": "view", "type": "function" }, 
    { "constant": false, "inputs": [], "name": "synthesize", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, 
    { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, 
    { "payable": true, "stateMutability": "payable", "type": "fallback" }, 
    { "anonymous": false, "inputs": [ { "indexed": false, "name": "payer", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" } ], "name": "PayEvent", "type": "event" }, 
    { "anonymous": false, "inputs": [ { "indexed": false, "name": "payer", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" } ], "name": "AwaredEvent", "type": "event" }, 
    { "anonymous": false, "inputs": [ { "indexed": false, "name": "payer", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "massage", "type": "string" } ], "name": "SponsorEvent", "type": "event" }, 
    { "anonymous": false, "inputs": [ { "indexed": false, "name": "sender", "type": "address" }, { "indexed": false, "name": "reciver", "type": "address" }, { "indexed": false, "name": "luckyType", "type": "uint256" } ], "name": "SentLuckyEvent", "type": "event" },
    { "constant": true, "inputs": [], "name": "spodata", "outputs": [ { "components": [ { "name": "spo", "type": "address" }, { "name": "msg", "type": "string" }, { "name": "amount", "type": "uint256" } ], "name": "", "type": "tuple[]" } ], "payable": false, "stateMutability": "view", "type": "function" }    
]
window.contactAddress = '0x5D47Daa3Fcb7210c96c2482bfF0F35305F7f7f17';
window.ethProvider = 'https://mainnet.infura.io/mew';

window.copyTextToClipboard = function(text){
    var textArea = document.createElement("textarea")
    textArea.style.position = 'fixed'
    textArea.style.top = 0
    textArea.style.left = 0
    textArea.style.width = '2em'
    textArea.style.height = '2em'
    textArea.style.padding = 0
    textArea.style.border = 'none'
    textArea.style.outline = 'none'
    textArea.style.boxShadow = 'none'
    textArea.style.background = 'transparent'
    textArea.value = text

    document.body.appendChild(textArea)

    textArea.select()

    try {
      var msg = document.execCommand('copy') ? '成功' : '失败'
      Hero.datas({name:'toast',text:'已复制'});
    } catch (err) {
      Hero.datas({name:'toast',text:'复制失败'});
    }
    document.body.removeChild(textArea)
}
