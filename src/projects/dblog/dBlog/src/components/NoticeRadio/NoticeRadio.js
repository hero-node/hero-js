import React, { PropTypes } from 'react';
import './NoticeRadio.css';

class NoticeRadio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked,
      address: props.address,
      amount: props.amount,
    };
  }

  render() {
    let { checked, address, amount, amountChange, addressChange } = this.props;
    return (
      <div className="notice-radio">
        <div
          className={checked ? 'radioo checked' : 'radioo'}
          onClick={this.props.check}
        >
          通知
        </div>
        {checked && (
          <div>
            <div className="radioo-input">
              <input
                type="text"
                className="lg-input"
                placeholder="请输入地址"
                value={address}
                onChange={addressChange}
              />
            </div>
            <div className="radioo-input amount">
              <input
                type="number"
                className="lg-input"
                placeholder="通知金额(eth)"
                value={amount}
                onChange={amountChange}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

NoticeRadio.propTypes = {
  address: PropTypes.string,
  addressChange: PropTypes.func,
};

export default NoticeRadio;
