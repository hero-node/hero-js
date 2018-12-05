var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));
var fs = require('fs');
var path = require('path');
// deploy('','','');
/*
@param file 文件名，会自动查找文件名路径下的被编译过的文件
@param from 合约账户，合约部署到私链上将从这个账户上扣除gas
@param password 该账户的密码，如果你账户是锁定状态
*/
var gasPrice = web3.eth.gasPrice;
console.log(gasPrice.toString(10));
function deploy(file, from, password) {
  var filename = path.parse(file)['name'].toString();
  var interface = fs.readFileSync(file + '.json').toString();
  var bytecode = fs.readFileSync(file + '.abi').toString();
  var MyContract = new web3.eth.Contract(JSON.parse(interface), {
    from: from,
    gasPrice: '1597262155',
    gas: 3000000,
    data: bytecode,
  }); // 如果账户是未锁定状态，可以将这里去掉
  //     web3.eth.personal.unlockAccount(from,password,function (err,result) {
  //         if (result){
  MyContract.deploy({
    data: bytecode,
  })
    .send(
      {
        from: from,
        gas: 6000000,
        gasPrice: '1597262155',
        value: 0,
      },
      function(error, transactionHash) {
        if (error) console.log(error);
        console.log(transactionHash);
      }
    )
    .on('error', function(error) {
      console.log(error);
    })
    .on('transactionHash', function(transactionHash) {
      console.log(transactionHash);
    })
    .on('receipt', function(receipt) {
      console.log(receipt);
    })
    .on('confirmation', function(confirmationNumber, receipt) {
      console.log(confirmationNumber);
      console.log(receipt);
    })
    .then(function(newContractInstance) {
      console.log(newContractInstance.options.address); // instance with the new contract address // 将合约部署的地址保存到本地
      fs.writeFile(
        filename + 'address.txt',
        newContractInstance.options.address,
        {},
        function(err, result) {
          if (err) {
            console.log(err);
          }
          console.log('contract address write into contractAddress.txt');
        }
      );
    });
  //         }
  //     })
}
