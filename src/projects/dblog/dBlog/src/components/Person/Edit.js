import React, { PropTypes } from 'react';
// import { Upload, Icon } from 'antd';
import './Edit.css';
import Modal from '../Modal/Modal';
import LoadingRotate from '../Loading/LoadingRotate';
import { apiHost, postFormImg } from '../../utils/ajax';

const preFix = 'http://106.14.187.240/_/ipfs/files/';

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarUploading: false,
      wechatQrUploading: false,
    };
  }

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

  avatarChange = e => {
    if (e.currentTarget.files.length === 0) return;
    this.setState({ avatarUploading: true });
    this.saveImageOnIpfs(e.currentTarget.files[0]).then(hash => {
      this.setState({ avatar: hash, avatarUploading: false });
    });
  };

  weChatQrChange = e => {
    if (e.currentTarget.files.length === 0) return;
    this.setState({ wechatQrUploading: true });
    this.saveImageOnIpfs(e.currentTarget.files[0]).then(hash => {
      this.setState({ wechatQr: hash, wechatQrUploading: false });
    });
  };

  introChange = e => {
    this.setState({ intro: e.currentTarget.value.trim() });
  };

  pwdChange = e => {
    this.setState({ pwd: e.currentTarget.value.trim() });
  };

  socialsChange = e => {
    this.setState({ socials: e.currentTarget.value.trim() });
  };

  confirm = () => {
    const { avatar, wechatQr, socials, intro, pwd } = this.state;
    this.props.confirm(avatar, wechatQr, socials, intro, pwd);
  };

  render() {
    const {
      avatar,
      wechatQr,
      socials,
      intro,
      pwd,
      avatarUploading,
      wechatQrUploading,
    } = this.state;
    const { visible, hide, data } = this.props;
    return (
      <Modal visible={visible} confirm={this.confirm} cancel={hide}>
        <div className="edit-wrap">
          <div className="edit-row">
            <div>设置头像</div>
            <div className="edit-upload">
              <a>
                上传头像
                {avatarUploading && !avatar && <LoadingRotate />}
              </a>
              <input type="file" onChange={this.avatarChange} />
              {avatar && <img src={preFix + avatar} />}
            </div>
          </div>
          <div className="edit-row">
            <div>简介</div>
            <div>
              <textarea
                onChange={this.introChange}
                value={intro || (data && data.intro)}
                rows="10"
              />
            </div>
          </div>
          <div className="edit-row">
            <div>添加社区</div>
            <div>
              <textarea
                onChange={this.socialsChange}
                value={socials || (data && data.socials)}
                rows="10"
              />
            </div>
          </div>
          <div className="edit-row">
            <div>设置微信二维码</div>
            <div className="edit-upload">
              <a>
                上传二维码
                {wechatQrUploading && <LoadingRotate />}
              </a>
              <input type="file" onChange={this.weChatQrChange} />
              {wechatQr && <img src={preFix + wechatQr} />}
            </div>
          </div>
          <div className="edit-row">
            <div>密码</div>
            <div>
              <input
                type="password"
                className="lg-input"
                onChange={this.pwdChange}
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

Edit.propTypes = {};

export default Edit;
