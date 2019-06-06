import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';

import App from './App';
import Login from './Login';
import Preview from './components/Preview/Preview';
import Write from './Write';
import Person from './Person';

import { default as Web3 } from 'web3';
import './index.css';

const router = (
  <HashRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/user/:address" component={App} />
      <Route exact path="/Login" component={Login} />
      <Route exact path="/Preview/:id" component={Preview} />
      <Route exact path="/p/:address" component={Person} />
    </Switch>
  </HashRouter>
);

// window.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/mew"));
// window.web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/mew"));
window.web3 = new Web3(
  new Web3.providers.HttpProvider('http://106.14.187.240:8545')
);
// window.web3 = new Web3(new Web3.providers.HttpProvider("https://api.myetherapi.com/eth"));
window.eth = window.web3.eth;
ReactDOM.render(router, document.getElementById('root'));
