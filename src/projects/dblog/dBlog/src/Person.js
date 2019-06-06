import React, { Component } from 'react';
import styled from 'styled-components';
import './Person.css';
import Loading2 from './components/Loading/Loading2';
import Modal from './components/Modal/Modal';
import PersonCard from './components/Person/PersonCard';
import PersonCardMobile from './components/Person/PersonCardMobile';
import blogContractJON from './contracts/blog.json';
import ensContractJSON from './contracts/ens.json';
import PreviewList from './components/Preview/PreviewList';
import { default as ipfsAPI } from 'ipfs-api';
import { default as Tx } from 'ethereumjs-tx';
import { default as namehash } from 'eth-ens-namehash';
import { get, postFormData, apiHost, postFormImg } from './utils/ajax';
import QRCode from 'qrcode';

const preFix = 'http://106.14.187.240/_/ipfs/files/';

// const contractAddress = '0x0FABA2D9EA5A324db109Bee6632fFa8b642aaD20';
//http://106.14.187.240:8544
// const contractAddress = '0xfcff10a257986672b027168a3583ab1cacca6ce9';
//mainnet
const contractAddress = '0x2F9037c6B5139D7Ce2B750b71693E518c7FFF0A7';
const ensContractAddress = '0x1da022710df5002339274aadee8d58218e9d6ab5';

const NoArticle = styled.div`
  margin: 15px 0;
  font-size: 14px;
  color: #969696;
`;

class Person extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressQRCode: '',
      data: {},
      isLoading: true,
      isMobile: true,
      files: [],
    };
  }

  componentDidMount() {
    document.getElementById('ld').style.display = 'none';

    let reg = /(nokia|iphone|android|motorola|^mot-|softbank|foma|docomo|kddi|up.browser|up.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte-|longcos|pantech|gionee|^sie-|portalmmm|jigs browser|hiptop|^benq|haier|^lct|operas*mobi|opera*mini|320x320|240x320|176x220)/i;

    const address = this.props.match.params && this.props.match.params.address;

    let contract = new window.web3.eth.Contract(
      blogContractJON,
      contractAddress
    );

    let ensContract = new window.web3.eth.Contract(
      ensContractJSON,
      ensContractAddress
    );

    this.setState({
      address,
      contract,
      ensContract,
      isMobile: reg.test(window.navigator.userAgent),
    });

    let data = sessionStorage.getItem('blogData');
    if (data) {
      data = JSON.parse(data);
      if (data.address != address || data.nickName != address) {
        this.loadData(contract, address, ensContract);
      } else {
        this.getCacheData(data);
        this.genAddressQrCode(address);
      }
    } else {
      this.loadData(contract, address, ensContract);
    }

    window.addEventListener('resize', e => {
      this.resizeWindow(e.currentTarget);
    });
  }

  resizeWindow = target => {
    if (target.innerWidth < 600) {
      this.setState({ isMobile: true });
    } else {
      this.setState({ isMobile: false });
    }
  };

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

  loadData = (contract, address, ensContract) => {
    contract = contract;
    let txs = [];
    if (window.web3.utils.isAddress(address)) {
      this.getHashes(false, 0, txs, address, contract);
      this.setState({ address });
    } else if (address.indexOf('.eth') > -1) {
      this.getAddressByEns(address, ensContract, contract);
    } else {
      this.getAddressByNickname(address, contract);
    }
  };

  getAddressByEns = (ens, ensContract, contract) => {
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
        this.setState({ address: res });
        this.getHashes(false, 0, txs, res, contract);
      })
      .catch(err => {
        console.log(err);
      });
  };

  getAddressByNickname = (nickName, contract) => {
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
        this.setState({ address: res });
        this.getHashes(false, 0, txs, res, contract);
      })
      .catch(err => {
        console.log(err);
      });
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
    this.genAddressQrCode(address);
    this.getNickname(contract, address);
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
    get(apiHost + '/api/ipfs/cat', { path: hash.articleHash }).then(res => {
      console.log(res);
      this.setState({ isLoading: false, txs });
      let data = Object.assign(state.data, JSON.parse(res.content), {
        nickName: state.nickName,
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
      try {
        this.setState({ data, files, selectedFile: files[0] });
      } catch (e) {
        this.setState({
          data: {
            address: this.state.address,
            blogs: [],
            friends: [],
            fans: [],
          },
        });
      }
    });
  };

  genAddressQrCode = address => {
    address = address;
    QRCode.toDataURL(address).then(url => {
      this.setState({ addressQRCode: url });
    });
  };

  gotoPreview = hash => {
    window.open('#preview/' + hash, '_blank');
  };

  gotoLogin = () => {
    this.props.history.push({ pathname: '/login' });
  };

  render() {
    const {
      visible,
      addressQRCode,
      address,
      files,
      data,
      isLoading,
      isMobile,
      nickName,
    } = this.state;
    data.nickName = data.nickName || nickName;
    const artileLis = files.map(blog => {
      return (
        <li>
          <p
            className="article-title"
            onClick={() => {
              this.gotoPreview(blog.hash);
            }}
          >
            {blog.title}
          </p>
          <p className="article-intro">{blog.summary}</p>
        </li>
      );
    });

    return (
      <div className="wrap">
        <header className="person-header">
          <div className="person-hd-logo" onClick={this.gotoLogin}>
            <div className="person-hd-logo-ico" />
          </div>
        </header>

        <div className="person-bd">
          <div className="person-content-wrap">
            {isMobile ? (
              <PersonCardMobile
                data={data}
                addressQRCode={addressQRCode}
                address={address}
              />
            ) : (
              <PersonCard
                data={data}
                addressQRCode={addressQRCode}
                address={address}
              />
            )}
          </div>
          <div className="article-list-wrap">
            <h2>文章列表</h2>
            <ul>{artileLis}</ul>
            {artileLis.length === 0 && (
              <NoArticle>刚开通, 没开始写呢~~</NoArticle>
            )}
          </div>
        </div>
        {isLoading && <Loading2 />}
      </div>
    );
  }
}

export default Person;
