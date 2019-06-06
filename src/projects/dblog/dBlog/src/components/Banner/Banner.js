import React, { PropTypes } from 'react';
import Operator from './Operator';
import './Banner.css';
import Modal from '../Modal/Modal';

class Banner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ethAddress: '',
      articleName: '',
      showArticle: false,
    };
  }

  search = () => {
    this.props.search && this.props.search(this.state.ethAddress.trim());
  };

  addressChange = e => {
    this.setState({ ethAddress: e.currentTarget.value.trim() });
  };

  articleNameChange = e => {
    this.setState({ articleName: e.currentTarget.value.trim() });
  };

  addArticle = () => {
    // this.setState({ showArticle: true });
    this.props.add && this.props.add();
  };

  hideArticle = () => {
    this.setState({ showArticle: false });
  };

  createArticle = () => {
    this.props.create && this.props.create(this.state.articleName);
    this.hideArticle();
  };

  render() {
    const { ethAddress, articleName, showArticle } = this.state;
    return (
      <header className="App-header">
        <div className="hd-logo">
          <div className="hd-logo-ico" />
        </div>
        <div className="search-wrap">
          <input
            type="text"
            placeholder="请输入地址,昵称,ens"
            value={ethAddress}
            onChange={this.addressChange}
          />
          <div className="search-ico" onClick={this.search} />
        </div>
        <div className="add" onClick={this.addArticle}>
          写文章
        </div>
        <Modal
          visible={showArticle}
          confirm={this.createArticle}
          cancel={this.hideArticle}
        >
          <div style={{ width: '350px' }}>
            <p style={{ padding: '10px' }}>请输入文章名称</p>
            <input
              type="text"
              className="lg-input"
              value={articleName}
              onChange={this.articleNameChange}
            />
          </div>
        </Modal>
        <div className="expand" onClick={this.props.showMyInfo}>
          <div className="expand-ico" />
        </div>

        {
          // <Operator
          //   {...this.props.operator}
          // />
        }
      </header>
    );
  }
}

Banner.propTypes = {
  operator: PropTypes.object,
  search: PropTypes.func,
  create: PropTypes.func,
};

export default Banner;
