import React, { PropTypes } from 'react';
import styled from 'styled-components';
import './MyInfo.css';
import Modal from '../Modal/Modal';

const NickNameWarning = styled.div`
  color: red;
  font-size: 11px;
`;

class MyInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSetting: false,
      nickName: '',
    };
  }

  setNickname = () => {
    this.setState({ showSetting: false });
    let { nickName, pwd } = this.state;
    this.props.setNickname && this.props.setNickname(nickName, pwd);
  };

  nickNameChange = e => {
    this.setState({ nickName: e.currentTarget.value.trim() });
  };

  pwdChange = e => {
    this.setState({ pwd: e.currentTarget.value.trim() });
  };

  gotoHomepage = () => {
    const { loginAddress } = this.props;
    window.location = '#p/' + loginAddress;
  };

  render() {
    const { loginAddress, data, edit } = this.props;
    const { showSetting, nickName } = this.state;
    return (
      <div className="myinfo-wrap">
        <div className="myinfo-menu">
          <ul>
            <li className="ico-ank" onClick={this.props.hideMyInfo} />
            <li className="on">我的帐户</li>
          </ul>
        </div>
        <div className="myinfo-detail">
          <div className="hd" onClick={this.gotoHomepage}>
            <a>我的主页</a>
          </div>
          <div className="info-edit" onClick={edit}>
            <a>编辑</a>
          </div>
          <ul>
            <li>
              <p>
                昵称{' '}
                {
                  <i
                    className="set-nickname"
                    onClick={() => {
                      this.setState({ showSetting: true });
                    }}
                  >
                    设置
                  </i>
                }
              </p>
              <p>{data.nickName || nickName || '暂未设置'}</p>
            </li>
            <li>
              <p>账户/地址</p>
              <p>{loginAddress}</p>
            </li>
            <li>
              <p>作品发布数</p>
              <p>{data && data.blogs && data.blogs.length}</p>
            </li>
            <li>
              <p>评论数</p>
              <p>0</p>
            </li>
          </ul>
          <div className="exit" onClick={this.props.loginOut}>
            退出
          </div>
        </div>
        <Modal
          visible={showSetting}
          confirm={this.setNickname}
          cancel={() => {
            this.setState({ showSetting: false });
          }}
        >
          <div style={{ width: '350px' }}>
            <p style={{ padding: '10px' }}>
              请输入昵称<NickNameWarning>
                (只能设置一次,不能再修改)
              </NickNameWarning>
            </p>
            <input
              type="text"
              className="lg-input"
              value={nickName}
              onChange={this.nickNameChange}
            />
            <p style={{ padding: '10px' }}>请输入密码</p>
            <input
              type="password"
              className="lg-input"
              onChange={this.pwdChange}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

MyInfo.propTypes = {
  hideMyInfo: PropTypes.func,
  setNickname: PropTypes.func,
  loginOut: PropTypes.func,
};

export default MyInfo;
