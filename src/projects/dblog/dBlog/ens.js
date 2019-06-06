var namehash = require('eth-ens-namehash');
var Web3 = require('web3');
var web3 = new Web3(
  new Web3.providers.HttpProvider('https://mainnet.infura.io/mew')
);

var domainHash = namehash.hash('heronode.eth'); // edit here
console.log('This is the hash of your domain:', domainHash);

// don't put something.eth here, ONLY the subdomain
var subdomainSha = web3.utils.sha3('ico'); // edit here, this means sub.something.eth
console.log('This is the web3.sha3 string of your subdomain:', subdomainSha);

var subdomainHash = namehash.hash('ico.heronode.eth'); // edit here
console.log('This is the hash of your subdomain:', subdomainHash);
