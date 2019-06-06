import React, { PropTypes } from 'react';
import styled, { keyframes } from 'styled-components';
import Modal from '../Modal/Modal';

const preFix = 'http://106.14.187.240/_/ipfs/files/';

const Wrapper = styled.div`
  min-width: 325px;
  background: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 15px;
  margin: 0 auto;
  max-width: 1000px;
`;
const Avatar = styled.div`
  position: relative;
  margin: -20px 15px 0 -4px;
  float: left;
  border-radius: 50px;
  border: 3px solid;
  background-color: #fff;
  border-color: #fff;
  img {
    width: 84px;
    height: 84px;
    border-radius: 50px;
    border: 1px solid;
    border-color: #ddd;
  }
`;

const UserInfo = styled.div`
  margin: 15px 0 20px;
  padding-left: 100px;
  position: absolute;
  top: 0;
`;
const UserInfoName = styled.div`
  font-size: 19px;
  font-weight: 700;
  display: inline-block;
  vertical-align: middle;
  line-height: 1.3;
  color: #484848;
`;

const Intro = styled.div`
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 20px;
  color: #484848;
  padding: 10px 0;
`;
const Socials = styled.div`
  padding: 10px 0;
`;
const BtnGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  .tipping {
    margin-left: 0;
    line-height: 32px;
    width: 100px;
    margin-right: 20px;
  }
  .qr-address {
    left: -24px;
    top: 30px;
  }
  .tipping-address {
    top: 30px;
  }
`;
const Empty = styled.div`
  font-size: 14px;
  color: #969696;
  margin: 15px 0;
`;

const TippingAddress = styled.div`
  top: 0;
  z-index: 10;
  text-align: center;
  font-size: 14px;
  color: #999;
  background: rgba(256, 256, 256, 0.8);
  width: 210px;
  left: 65px;
  word-break: break-all;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  padding: 15px 10px;
`;

const QRAddress = styled.div`
  top: 0;
  z-index: 10;
  text-align: center;
  font-size: 14px;
  color: #999;
  background: rgba(256, 256, 256, 0.8);
  width: 220px;
  height: 220px;
  left: 65px;
  word-break: break-all;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  padding-top: 15px;
`;

class PersonCardMobile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddress: false,
      showWeichat: false,
    };
  }

  hideAddress = () => {
    this.setState({ showAddress: false });
  };

  showAddress = () => {
    this.setState({ showAddress: true });
  };

  hideWeichat = () => {
    this.setState({ showWeichat: false });
  };

  showWeichat = () => {
    this.setState({ showWeichat: true });
  };

  render() {
    const { data, addressQRCode, address } = this.props;
    const { showAddress, showWeichat } = this.state;
    return (
      <Wrapper>
        <Avatar>
          <img src={data.avatar ? preFix + data.avatar : ''} />
          <UserInfo>
            <UserInfoName>{data.nickName}</UserInfoName>
          </UserInfo>
        </Avatar>
        {data.socials && <Socials>{data.socials}</Socials>}
        {data.intro && <Intro>{data.intro}</Intro>}
        {!data.socials && !data.intro && <Empty>什么都没有~~</Empty>}
        <BtnGroup>
          <a className="tipping" onClick={this.showAddress}>
            打赏
          </a>
          <a className="tipping profile-qrcode" onClick={this.showWeichat}>
            微信二维码
          </a>
        </BtnGroup>
        <Modal
          visible={showWeichat}
          confirm={this.hideWeichat}
          cancel={this.hideWeichat}
        >
          <QRAddress>
            {data.wechatQr ? <img src={preFix + data.wechatQr} /> : '暂未设置'}
          </QRAddress>
        </Modal>
        <Modal
          visible={showAddress}
          confirm={this.hideAddress}
          cancel={this.hideAddress}
        >
          <TippingAddress>
            <img src={addressQRCode} />
            <p>钱包地址:</p>
            <p> {address}</p>
          </TippingAddress>
        </Modal>
      </Wrapper>
    );
  }
}

PersonCardMobile.propTypes = {};

export default PersonCardMobile;
