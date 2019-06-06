import React, { PropTypes } from 'react';
import Modal from './Modal';

class InputPwd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pwd: '',
    };
  }

  confirm = () => {
    let pwd = this.state.pwd;
    this.props.confirm && this.props.confirm(pwd);
  };

  pwdChange = e => {
    this.setState({ pwd: e.currentTarget.value });
  };

  render() {
    const { visible } = this.props;
    let pwd = this.state.pwd;
    return (
      <Modal
        visible={visible}
        confirm={this.confirm}
        cancel={this.props.cancel}
      >
        <div style={{ width: '350px' }}>
          <p style={{ padding: '10px' }}>请输入密码</p>
          <input
            type="password"
            className="lg-input"
            value={pwd}
            onChange={this.pwdChange}
          />
        </div>
      </Modal>
    );
  }
}

InputPwd.propTypes = {
  confirm: PropTypes.func,
};

export default InputPwd;
