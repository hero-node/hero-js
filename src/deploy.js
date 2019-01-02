var Web3 = require('web3');
var fs = require('fs');
var path = require('path');
var privateKey = require('../heronode.json');
var Tx = require('ethereumjs-tx');

if (privateKey.privateKey === '') {
  console.log('Please input your privateKey!');
}

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));
}

web3.eth.getGasPrice((err, res) => {
  if (!err) {
    var gasPrice = parseInt(res).toString(16);
    findSol(privateKey.privateKey, gasPrice);
  }
});

function getFileType(filePath) {
  var startIndex = filePath.lastIndexOf('.');
  if (startIndex != -1) {
    return {
      type: filePath.substring(startIndex + 1, filePath.length).toLowerCase(),
      name: filePath.substring(0, startIndex).toLowerCase(),
    };
  } else {
    return '';
  }
}

function findSol(privateKey, gasPrice) {
  fs.readdir('./projects/', (err, files) => {
    for (let i = 0; i < files.length; i++) {
      fs.stat('./projects/' + files[i], (err, stats) => {
        if (stats.isDirectory()) {
          // into app dir
          fs.readdir('./projects/' + files[i] + '/app/', (err, folders) => {
            for (let j = 0; j < folders.length; j++) {
              fs.stat(
                './projects/' + files[i] + '/app/' + folders[j],
                (err, stats) => {
                  if (stats.isFile()) {
                    let fileType = getFileType(folders[j]).type;
                    let fileName = getFileType(folders[j]).name;
                    if (fileType === 'abi') {
                      deploy(
                        './projects/' + files[i] + '/app/' + fileName,
                        privateKey,
                        './projects/' + files[i] + '/app/',
                        gasPrice
                      );
                    }
                  }
                }
              );
            }
          });
        }
      });
    }
  });
}
/*
@param file 文件名，会自动查找文件名路径下的被编译过的文件
@param from 账户私钥
@param filePath 当前合约地址存储文件夹路径
@param gasPrice
*/
function deploy(file, from, filePath, gasPrice) {
  var filename = path.parse(file)['name'].toString();
  var interface = fs.readFileSync(file + '.json').toString();
  var bytecode = fs.readFileSync(file + '.abi').toString();

  //你自己的私钥
  var privateKey = new Buffer(from, 'hex');
  //构造的交易中，是不需要包含 from 的，因为这个交易是通过私钥签名的，而私钥生成的签名是可以还原出公钥地址的，所以交易本身不需要冗余存储发送方信息。
  var rawTx = {
    nonce: '0x00',
    gasPrice: '0x' + gasPrice,
    gasLimit: '0x295f05',
    to: '',
    data: bytecode,
  };
  var tx = new Tx(rawTx);
  tx.sign(privateKey);
  var serializedTx = tx.serialize();
  web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(
    err,
    hash
  ) {
    if (!err) {
      web3.eth.getTransactionReceipt(hash, (err, data) => {
        fs.writeFile(
          filePath + filename + 'address.txt',
          data.contractAddress,
          {},
          function(err, result) {
            if (err) {
              console.log(err);
            }
            console.log(
              'contract address write into ' +
                filePath +
                filename +
                'address.txt'
            );
          }
        );
      });
    } else {
      console.log(err);
    }
  });
}
