import React, { PropTypes } from 'react';
import Modal from '../Modal/Modal';
import MyEditor from '../../Editor';

class AddressInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { hide, addressQRCode, loginAddress, visible, balance } = this.props;
    return (
      <Modal visible={visible} confirm={hide} cancel={hide}>
        <div className="address-qrcode">
          <p>钱包余额: {balance}</p>
          <img src={addressQRCode} />
          <p>钱包地址: {loginAddress}</p>
        </div>
      </Modal>
    );
  }
}

export default AddressInfo;
