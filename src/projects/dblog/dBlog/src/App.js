import React, { Component } from 'react';
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertToHTML,
} from 'draft-js';
import './App.css';
import MyEditor from './Editor';
import Login from './Login';
import Banner from './components/Banner/Banner';
import Nav from './components/Nav/Nav';
import Loading from './components/Loading/Loading';
import MyInfo from './components/MyInfo/MyInfo';
import InputPwd from './components/Modal/InputPwd';
import PreviewList from './components/Preview/PreviewList';
import AddressInfo from './components/AddressInfo/AddressInfo';
import Edit from './components/Person/Edit';
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      data: { blogs: [], fans: [], address: '', friends: [], nickName: '' },
      loginAddress: '',
      addressQRCode: '',
      isLogin: false,
      isCreateNew: false,
      showPwd: false,
      contract: {},
      ensContract: {},
      isShowFiles: false,
      showAddresInfo: false,
      balance: 0,
      selectedFile: {},
    };
  }

  componentDidMount() {
    document.getElementById('ld').style.display = 'none';
    if (!this.props.location.state || !this.props.location.state.isLogin) {
      this.props.history.push({ pathname: '/Login' });
      return;
    }

    let files = this.state.files;
    let storedFiles = JSON.parse(localStorage.getItem('files') || '[]');

    const ipfs = ipfsAPI({
      host: '106.14.187.240',
      port: '80',
      protocol: 'http',
      'api-path': '/_/ipfs/api/api/v0/',
    });
    // const ipfs = ipfsAPI({ host: 'localhost', port: '5001', protocol: 'http' });

    let loginAddress =
      this.props.location.state && this.props.location.state.address;

    let contract = new window.web3.eth.Contract(
      blogContractJON,
      contractAddress
    );

    let ensContract = new window.web3.eth.Contract(
      ensContractJSON,
      ensContractAddress
    );

    this.setState({
      files: storedFiles,
      ipfs,
      loginAddress,
      contract,
      ensContract,
    });

    let data = sessionStorage.getItem('blogData');
    if (data) {
      data = JSON.parse(data);
      if (data.address != loginAddress) {
        this.loadData(contract, loginAddress);
      } else {
        this.getCacheData(data);
      }
    } else {
      this.loadData(contract, loginAddress);
    }

    this.genAddressQrCode(loginAddress);

    this.getBalance(loginAddress);
  }

  getCacheData = data => {
    let files = data.blogs.map((b, i) => {
      return {
        id: b.id,
        title: b.title,
        content: b.content,
        hash: b.hash,
        summary: b.summary,
      };
    });
    this.setState({ data, files, selectedFile: files[0], isLoading: false });
  };

  getBalance = loginAddress => {
    window.web3.eth.getBalance(loginAddress).then(res => {
      let balance = window.web3.utils.fromWei(res, 'ether');
      this.setState({ balance });
    });
  };

  genAddressQrCode = loginAddress => {
    QRCode.toDataURL(loginAddress).then(url => {
      this.setState({ addressQRCode: url });
    });
  };

  loadData = (contract, address) => {
    contract = contract || this.state.contract;
    let txs = [];
    this.setState({ isLoading: true });
    this.getNickname(contract, address);
    this.getHashes(false, 0, txs, address, contract);
  };

  getNickname = (contract, address) => {
    contract.methods
      .ensA2S(address)
      .call({ from: address })
      .then(res => {
        let nickName = window.web3.utils.hexToAscii(res);
        this.setState({ nickName });
      })
      .catch(err => {
        console.log(err);
      });
  };

  getHashes(isEnd, i, txs, address, contract) {
    if (isEnd) return;
    let that = this;
    contract.methods
      .articlesCount(address)
      .call({ from: address })
      .then(res1 => {
        let count = parseInt(res1);

        if (!count) {
          that.setState({ isLoading: false });
          return;
        }

        contract.methods
          .articles(address, count - 1)
          .call({ from: address })
          .then(res => {
            txs.push(res);
            // that.getDataFromIpfs(txs);
            that.getData(txs);
          })
          .catch(err => {
            that.setState({ isLoading: false });
            console.log(err);
          });
      });
  }

  getData = txs => {
    let hash = txs[txs.length - 1];
    let state = this.state;
    const { loginAddress } = this.state;
    get(apiHost + '/api/ipfs/cat', { path: hash.articleHash }).then(res => {
      console.log(res);
      this.setState({ isLoading: false, txs });
      let data = Object.assign(state.data, JSON.parse(res.content), {
        nickName: state.nickName,
        address: loginAddress,
      });
      let files = data.blogs.map((b, i) => {
        return {
          id: b.id,
          title: b.title,
          content: b.content,
          hash: b.hash,
          summary: b.summary,
        };
      });
      sessionStorage.setItem('blogData', JSON.stringify(data));
      try {
        this.setState({ data, files, selectedFile: files[0] });
      } catch (e) {
        this.setState({
          data: { address: loginAddress, blogs: [], friends: [], fans: [] },
        });
      }
    });
  };

  getDataFromIpfs = txs => {
    let ipfs = this.state.ipfs;
    let state = this.state;
    let hash = txs[txs.length - 1];
    ipfs.cat(hash.articleHash).then(stream => {
      this.setState({ isLoading: false, txs });
      let strContent = Utf8ArrayToStr(stream);
      let data = Object.assign(state.data, JSON.parse(strContent), {
        nickName: state.nickName,
      });
      let files = data.blogs.map((b, i) => {
        return { id: b.id, title: b.title, content: b.content, hash: b.hash };
      });
      try {
        this.setState({ data, files, selectedFile: files[0] });
      } catch (e) {
        this.setState({
          data: {
            address: this.state.loginAddress,
            blogs: [],
            friends: [],
            fans: [],
          },
        });
      }
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

  //通过ipfs-api保存数据到ipfs
  saveTextBlobOnIpfs = blob => {
    let ipfs = this.state.ipfs;
    return new Promise(function(resolve, reject) {
      const descBuffer = ipfs.Buffer.from(blob, 'utf-8');
      ipfs
        .add(descBuffer)
        .then(response => {
          console.log(response);
          resolve(response[0].hash);
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    });
  };

  saveImageOnIpfs = reader => {
    let ipfs = this.state.ipfs;
    return new Promise(function(resolve, reject) {
      // const buffer = ipfs.Buffer.from(reader.result);
      // ipfs.add(buffer).then((res) => {
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

  searchByEthAddress = address => {
    if (!address) {
      alert('不能为空!');
      return;
    }
    const { contract, ensContract } = this.state;
    let txs = [];
    if (window.web3.utils.isAddress(address)) {
      this.getHashes(false, 0, txs, address, contract);
    } else if (address.indexOf('.eth') > -1) {
      this.getAddressByEns(address);
    } else {
      this.getAddressByNickname(address);
    }
  };

  getAddressByEns = ens => {
    const { contract, ensContract } = this.state;
    let txs = [];
    var domainHash = namehash.hash(ens);
    ensContract.methods
      .addr(domainHash)
      .call({})
      .then(res => {
        if (res == '0x0000000000000000000000000000000000000000') {
          alert('找不到该用户');
          return;
        }
        this.getHashes(false, 0, txs, res, contract);
      })
      .catch(err => {
        console.log(err);
      });
  };

  getAddressByNickname = nickName => {
    const { contract, ensContract } = this.state;
    let txs = [];
    let nameBytes = window.web3.utils.asciiToHex(nickName);
    contract.methods
      .ensS2A(nameBytes)
      .call({})
      .then(res => {
        if (res == '0x0000000000000000000000000000000000000000') {
          alert('找不到该用户');
          return;
        }
        this.getHashes(false, 0, txs, res, contract);
      })
      .catch(err => {
        console.log(err);
      });
  };

  create = name => {
    let files = this.state.files;
    name = name || `未命名文件${files.length}`;
    let fileObj = { title: name || '', content: '<p></p>' };
    files.push(fileObj);
    this.setState({ files, isCreateNew: true, selectedFile: fileObj });
  };

  getGasPrice = () => {
    return new Promise(function(resolve, reject) {
      window.web3.eth.getGasPrice().then(resolve);
    });
  };

  buildPublishOptions = hash => {
    return new Promise((resolve, reject) => {
      window.web3.eth
        .estimateGas({
          to: contractAddress,
          data: window.web3.utils.toHex(hash),
        })
        .then(estGas => {
          this.getGasPrice().then(gasPrice => {
            resolve(estGas, gasPrice);
          });
        });
    });
  };

  buildTx = (gasPrice, gas, data, pwd, account) => {
    const { contract, ipfs, loginAddress } = this.state;
    let privateKey = new ipfs.Buffer(account.privateKey.split('0x')[1], 'hex');
    return new Promise((resolve, reject) => {
      window.web3.eth.getTransactionCount(loginAddress).then(count => {
        var rawTx = {
          nonce: window.web3.utils.toHex(count),
          gasPrice: window.web3.utils.toHex(gasPrice),
          gasLimit: window.web3.utils.toHex(gas),
          to: contractAddress,
          value: '0x00',
          data: data,
        };
        var tx = new Tx(rawTx);
        tx.sign(privateKey);
        resolve(tx.serialize());
      });
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
    amount = amount || '0.008';
    let lastedBlog = data.blogs[data.blogs.length - 1];
    let utils = window.web3.utils;
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

  upload = (
    pwd,
    content,
    summary,
    articleTitle,
    noticeAddress,
    checked,
    amount
  ) => {
    let {
      data,
      contract,
      selectedFile,
      loginAddress,
      files,
      balance,
    } = this.state;
    let account;

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

    let newBlog = { title: articleTitle, summary, content };
    this.setState({ isLoading: true });
    this.saveDataIpfs(JSON.stringify(newBlog)).then(newBlogHash => {
      newBlog.hash = newBlogHash;
      data.blogs.push(newBlog);
      data.noticeAddress = noticeAddress;
      files[files.length - 1].title = articleTitle;
      files[files.length - 1].summary = summary;
      files[files.length - 1].hash = newBlogHash;
      sessionStorage.setItem('blogData', JSON.stringify(data));
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
      gasPrice = 1.8 * gasPrice;
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

  hideMyInfo = () => {
    this.setState({ isShowMyInfo: false });
  };

  showMyInfo = () => {
    this.setState({ isShowMyInfo: true });
  };

  setNickname = (name, pwd) => {
    this.state.data.nickName = name;
    let { type, loginAddress, data, ipfs, balance } = this.state;

    if (balance <= 0) {
      this.setState({ showAddresInfo: true });
      return;
    }

    let account = {};
    try {
      let accountInfo = JSON.parse(localStorage.getItem('accountInfo') || '{}');
      account = window.web3.eth.accounts.decrypt(accountInfo.current, pwd);
    } catch (e) {
      alert('密码错误');
      return;
    }
    let nameBytes = window.web3.utils.asciiToHex(name);
    this.saveToEth(account, pwd, 'setEns', nameBytes);
    // this.saveTextBlobOnIpfs(JSON.stringify(data)).then((hash)=>{
    //   this.saveToEth(account, pwd, 'publish', hash);
    // });
  };

  loginOut = () => {
    this.props.history.push({ pathname: '/Login' });
  };

  gotoPreview = hash => {
    window.open('#preview/' + hash, '_blank');
  };

  showEditor = () => {
    this.setState({ isCreateNew: true });
    this.create();
  };

  hideEditor = () => {
    this.setState({ isCreateNew: false });
  };

  editInfo = () => {
    this.setState({ isShowEditInfo: true });
  };

  hideEditInfo = () => {
    this.setState({ isShowEditInfo: false });
  };

  confirmEdit = (avatar, wechatQr, socials, intro, pwd) => {
    let account;
    try {
      let accountInfo = JSON.parse(localStorage.getItem('accountInfo') || '{}');
      account =
        account || window.web3.eth.accounts.decrypt(accountInfo.current, pwd);
    } catch (e) {
      alert('密码错误');
      return;
    }
    let { data } = this.state;
    data.avatar = avatar;
    data.wechatQr = wechatQr;
    data.socials = socials;
    data.intro = intro;
    data = JSON.stringify(data);
    this.saveDataIpfs(data).then(hash => {
      sessionStorage.setItem('blogData', data);
      this.saveToEth(account, pwd, 'publish', hash, false, 0);
    });
  };

  uploadImg = params => {
    console.log(params);
    this.saveImageOnIpfs(params.file).then(hash => {
      params.success({
        url: `${apiHost}/_/ipfs/files/${hash}`,
      });
      console.log(hash);
    });
  };

  onInsert = files => {
    console.log(files);
  };

  render() {
    const {
      files,
      selectedFile,
      isLogin,
      loginAddress,
      isLoading,
      addressQRCode,
      balance,
      isShowFiles,
      isShowMyInfo,
      data,
      showPwd,
      isCreateNew,
      showAddresInfo,
      isShowEditInfo,
    } = this.state;

    const bannerProps = {
      search: this.searchByEthAddress,
      showMyInfo: this.showMyInfo,
      add: this.showEditor,
      address: loginAddress,
      create: this.create,
    };

    const editorProps = {
      file: selectedFile || files[0],
      close: this.hideEditor,
      uploadImg: this.uploadImg,
      onInsert: this.onInsert,
      noticeAddress: data.noticeAddress,
      upload: this.upload,
    };

    const navProps = {
      fileList: files,
      isShowFiles,
      selectFile: this.selectFile,
      deleteFile: this.deleteFile,
    };

    const myInfoProps = {
      data: data,
      loginAddress: loginAddress,
      hideMyInfo: this.hideMyInfo,
      setNickname: this.setNickname,
      edit: this.editInfo,
      loginOut: this.loginOut,
    };

    return (
      <div className="wrap">
        <div>
          <div className="hd">
            <Banner {...bannerProps} />
          </div>
          <div className={'body'}>
            {isCreateNew && <MyEditor {...editorProps} />}
            <PreviewList
              data={files}
              author={data.nickName}
              gotoPreview={this.gotoPreview}
            />
          </div>
        </div>
        {isShowMyInfo && <MyInfo {...myInfoProps} />}
        <Loading isShow={isLoading} />
        <Edit
          visible={isShowEditInfo}
          hide={this.hideEditInfo}
          confirm={this.confirmEdit}
          data={data}
        />
      </div>
    );
  }
}

export default withRouter(App);
