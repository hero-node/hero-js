import React, { PropTypes } from 'react';

class Operator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  cancel = () => {
    this.setState({ visible: false });
  };

  showPwd = () => {
    this.setState({ visible: true });
  };

  pwdChange = e => {
    this.setState({ pwd: e.currentTarget.value.trim() });
  };

  confirm = () => {
    this.setState({ visible: false });
    this.props.upload && this.props.upload(this.state.pwd);
  };

  render() {
    const { create, save, upload } = this.props;
    const { pwd, visible } = this.state;
    return (
      <div className="operator">
        <ul>
          <li onClick={create}>新建</li>
          <li onClick={save}>保存</li>
          <li onClick={this.showPwd}>上传</li>
        </ul>
        <div className={visible ? 'pop-up-mask show' : 'pop-up-mask'}>
          <div className="pop-up">
            <div style={{ width: '350px' }}>
              <p style={{ padding: '10px' }}>请输入密码</p>
              <input
                type="password"
                className="lg-input"
                value={pwd}
                onChange={this.pwdChange}
              />
            </div>
            <div className="pop-up-op">
              <div className="op-col">
                <button type="submit" className="btn" onClick={this.cancel}>
                  Cancel
                </button>
              </div>
              <div className="op-col">
                <button type="submit" className="btn" onClick={this.confirm}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Operator.propTypes = {
  create: PropTypes.func,
  save: PropTypes.func,
  upload: PropTypes.func,
};

export default Operator;
