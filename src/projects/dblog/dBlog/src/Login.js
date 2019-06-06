import React, { PropTypes } from 'react';
import { withRouter } from 'react-router-dom';
import Loading from './components/Loading/Loading';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keystore: '',
    };
  }

  componentDidMount() {
    document.getElementById('ld').style.display = 'none';
    let accountInfo = JSON.parse(localStorage.getItem('accountInfo') || '{}');
    this.setState({ keystore: accountInfo.current });
  }

  keystoreChange = e => {
    this.setState({ keystore: e.currentTarget.value.trim() });
  };

  passwordChange = e => {
    this.setState({ password: e.currentTarget.value.trim() });
  };

  buildAccounts = keystore => {
    let accountInfo = JSON.parse(localStorage.getItem('accountInfo') || '{}');
    accountInfo.accList = accountInfo.accList || [];
    accountInfo.accList.push(keystore);
    return JSON.stringify(accountInfo);
  };

  createAccount = () => {
    let newAccountPwd = this.state.newAccountPwd;
    let account = window.web3.eth.accounts.create();
    let keystore = account.encrypt(newAccountPwd);
    this.setState({ visible: false, keystore: JSON.stringify(keystore) });
    let accountInfo = this.buildAccounts(keystore);
    localStorage.setItem('accountInfo', accountInfo);
  };

  showPwd = () => {
    this.setState({ visible: true });
  };

  newAccountPwdChange = e => {
    this.setState({ newAccountPwd: e.currentTarget.value.trim() });
  };

  login = () => {
    const { keystore, password } = this.state;
    if (!keystore) {
      alert('keystore 不能为空');
      return;
    }
    if (!password) {
      alert('密码不能为空');
      return;
    }
    this.setState({ isLoading: true });
    let account = {};
    setTimeout(() => {
      try {
        account = window.web3.eth.accounts.decrypt(keystore, password);
      } catch (e) {
        alert('密码错误');
        this.setState({ isLoading: false });
        return;
      }
      console.log(account);
      if (window.web3.utils.isAddress(account.address)) {
        this.setState({ loginAddress: account.address, isLoading: false });
        let accountInfo = JSON.parse(
          localStorage.getItem('accountInfo') || '{}'
        );
        accountInfo.current = keystore;
        localStorage.setItem('accountInfo', JSON.stringify(accountInfo));
        account.isLogin = true;
        this.props.history.push({ pathname: '/', state: account });
      } else {
        alert('请输入正确的以太坊地址');
      }
    }, 800);
  };

  cancel = () => {
    this.setState({ visible: false, newAccountPwd: '' });
  };

  render() {
    let {
      visible,
      keystore,
      password,
      newAccountPwd,
      isLoading,
      url,
    } = this.state;
    return (
      <div className="login">
        <div className="logo">
          <div className="logo-ico" />
        </div>
        <div className="login-box">
          <h1>Login</h1>
          <div>
            <div className="lg-row">
              <p>Keystore</p>
              <input
                type="text"
                className="lg-input"
                value={keystore}
                onChange={this.keystoreChange}
              />
            </div>
            <div className="lg-row">
              <p>Password</p>
              <input
                type="password"
                placeholder="please enter your password"
                className="lg-input"
                value={password}
                onChange={this.passwordChange}
              />
            </div>
            <div className="lg-row">
              <button type="submit" className="button" onClick={this.login}>
                Login
              </button>
            </div>
            <div className="lg-row">
              <button
                type="submit"
                className="button btn2"
                onClick={this.showPwd}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
        <div className={visible ? 'pop-up-mask show' : 'pop-up-mask'}>
          <div className="pop-up">
            <div style={{ width: '350px' }}>
              <p style={{ padding: '10px' }}>Password</p>
              <input
                type="password"
                className="lg-input"
                value={newAccountPwd}
                onChange={this.newAccountPwdChange}
              />
            </div>
            <div className="pop-up-op">
              <div className="op-col">
                <button
                  type="submit"
                  className="btn btn-cancel"
                  onClick={this.cancel}
                >
                  Cancel
                </button>
              </div>
              <div className="op-col">
                <button
                  type="submit"
                  className="btn"
                  onClick={this.createAccount}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
        <Loading isShow={isLoading} />
      </div>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func,
};

export default withRouter(Login);
