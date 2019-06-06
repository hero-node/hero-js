import React, { Component } from 'react';
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertToHTML,
} from 'draft-js';
import './write.css';
import MyEditor from './Editor';
import Loading from './components/Loading/Loading';
import AddressInfo from './components/AddressInfo/AddressInfo';
import { GUID, Utf8ArrayToStr, stringToByte } from './common/utils';
import { withRouter } from 'react-router-dom';
import blogContractJON from './contracts/blog.json';
import ensContractJSON from './contracts/ens.json';
import { default as ipfsAPI } from 'ipfs-api';
import { default as Tx } from 'ethereumjs-tx';
import { default as namehash } from 'eth-ens-namehash';
import { get, postFormData, apiHost, postFormImg } from './utils/ajax';
import QRCode from 'qrcode';

// const contractAddress = '0x0FABA2D9EA5A324db109Bee6632fFa8b642aaD20';
//http://106.14.187.240:8544
// const contractAddress = '0xfcff10a257986672b027168a3583ab1cacca6ce9';
//mainnet
const contractAddress = '0x2F9037c6B5139D7Ce2B750b71693E518c7FFF0A7';
const ensContractAddress = '0x1da022710df5002339274aadee8d58218e9d6ab5';

class Write extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginAddress: '',
      addressQRCode: '',
      contract: {},
      ensContract: {},
      balance: 0,
      showAddresInfo: false,
      selectedFile: {},
    };
  }

  componentDidMount() {
    const ipfs = ipfsAPI({
      host: '106.14.187.240',
      port: '80',
      protocol: 'http',
      'api-path': '/_/ipfs/api/api/v0/',
    });

    const loginAddress = this.props.match.params.address;

    let contract = new window.web3.eth.Contract(
      blogContractJON,
      contractAddress
    );

    let ensContract = new window.web3.eth.Contract(
      ensContractJSON,
      ensContractAddress
    );

    this.setState({ ipfs, loginAddress, contract, ensContract });

    this.genAddressQrCode(loginAddress);

    this.getBalance(loginAddress);
  }

  genAddressQrCode = loginAddress => {
    QRCode.toDataURL(loginAddress).then(url => {
      this.setState({ addressQRCode: url });
    });
  };

  saveEthSuccess = (result, gasPrice, gas, account, checked, amount) => {
    if (result && result.blockHash) {
      if (checked) {
        this.transferEth(account, gasPrice, gas, amount);
      } else {
        this.setState({ isLoading: false });
        this.hideEditor();
        alert('保存成功');
      }
    }
  };

  transferEth = (account, gasPrice, gas, amount) => {
    let { data, loginAddress, ipfs } = this.state;
    let lastedBlog = data.blogs[data.blogs.length - 1];
    let utils = window.web3.utils;
    amount = amount || 0.008;
    let privateKey = new ipfs.Buffer(account.privateKey.split('0x')[1], 'hex');
    window.web3.eth.getTransactionCount(loginAddress).then(count => {
      const rawTx = {
        nonce: utils.toHex(count),
        gasPrice: utils.toHex(gasPrice),
        gasLimit: utils.toHex(gas),
        to: data.noticeAddress,
        value: utils.toHex(utils.toWei(amount, 'ether')),
        data: utils.toHex(lastedBlog.title),
      };
      var tx = new Tx(rawTx);
      tx.sign(privateKey);
      window.web3.eth.sendSignedTransaction(
        '0x' + tx.serialize().toString('hex'),
        (err, hash) => {
          if (err) {
            console.log(err);
          }
          this.setState({ isLoading: false });
          this.hideEditor();
          alert('保存成功');
        }
      );
    });
  };

  getBalance = loginAddress => {
    window.web3.eth.getBalance(loginAddress).then(res => {
      let balance = window.web3.utils.fromWei(res, 'ether');
      this.setState({ balance });
    });
  };

  //通过调接口方式保存数据到ipfs
  saveDataIpfs = blob => {
    let ipfs = this.state.ipfs;
    return new Promise(function(resolve, reject) {
      postFormData(apiHost + '/api/ipfs/upload/raw', { content: blob })
        .then(res => {
          console.log(res);
          resolve(res[0].hash);
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    });
  };

  upload = (
    pwd,
    content,
    summary,
    articleTitle,
    noticeAddress,
    checked,
    amount
  ) => {
    let { contract, selectedFile, loginAddress, files, balance } = this.state;
    let account,
      data = window.data;

    if (balance <= 0) {
      this.setState({ showAddresInfo: true });
      return;
    }

    try {
      let accountInfo = JSON.parse(localStorage.getItem('accountInfo') || '{}');
      account =
        account || window.web3.eth.accounts.decrypt(accountInfo.current, pwd);
    } catch (e) {
      alert('密码错误');
      return;
    }

    if (!content) {
      alert('内容不能为空');
      return;
    }

    let newBlog = { title: articleTitle, summary };
    this.setState({ isLoading: true });
    this.saveDataIpfs(JSON.stringify(newBlog)).then(newBlogHash => {
      newBlog.hash = newBlogHash;
      data.blogs.push(newBlog);
      data.noticeAddress = noticeAddress;
      this.saveDataIpfs(JSON.stringify(data)).then(hash => {
        this.saveToEth(account, pwd, 'publish', hash, checked, amount);
      });
    });
  };

  saveToEth = (account, pwd, method, data, checked, amount) => {
    let { contract } = this.state;
    let eth = window.eth;
    data = contract.methods[method](data).encodeABI();
    eth.getGasPrice().then(gasPrice => {
      eth.estimateGas({ to: contractAddress, data }).then(gas => {
        gas = gas < 70000 ? 70000 : gas;
        this.buildTx(gasPrice, gas, data, pwd, account).then(tx => {
          try {
            window.web3.eth
              .sendSignedTransaction('0x' + tx.toString('hex'))
              .on('receipt', result => {
                this.saveEthSuccess(
                  result,
                  gasPrice,
                  gas,
                  account,
                  checked,
                  amount
                );
              });
          } catch (e) {
            alert('发布失败');
            this.setState({ isLoading: false });
          }
        });
      });
    });
  };

  uploadImg = param => {
    var reader = new FileReader();
    reader.readAsArrayBuffer(param.file);
    reader.onloadend = e => {
      this.saveImageOnIpfs(param.file).then(hash => {
        param.success({
          url: `http://106.14.187.240/_/ipfs/files/${hash}`,
        });
      });
    };
  };

  saveImageOnIpfs = reader => {
    let ipfs = this.state.ipfs;
    return new Promise(function(resolve, reject) {
      postFormImg(apiHost + '/api/ipfs/upload/file', reader)
        .then(res => {
          resolve(res[0].hash);
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    });
  };

  hideAddressInfo = () => {
    this.setState({ showAddresInfo: false });
  };

  render() {
    const {
      loginAddress,
      isLoading,
      addressQRCode,
      balance,
      isCreateNew,
      showAddresInfo,
    } = this.state;
    const data = window.data || {};

    return (
      <div className="wrap">
        <div className="hd">
          <header className="App-header">
            <div className="hd-logo">
              <div className="hd-logo-ico" />
            </div>
            <div className="hd-right">
              <span>地址：</span>
              <span>{loginAddress}</span>
            </div>
          </header>
        </div>
        <div className="body" style={{ background: '#fff' }}>
          <MyEditor
            uploadImg={this.uploadImg}
            noticeAddress={data.noticeAddress}
            upload={this.upload}
          />
        </div>
        <AddressInfo
          visible={showAddresInfo}
          balance={balance}
          loginAddress={loginAddress}
          addressQRCode={addressQRCode}
          hide={this.hideAddressInfo}
        />
        <Loading isShow={isLoading} />
      </div>
    );
  }
}

export default Write;
