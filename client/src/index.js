import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Login, { Manager, CurateLogin, CurateJoin } from './components/Login';
import Content from './components/Content';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import 'whatwg-fetch';

import firebase from 'firebase';

// import 'tachyons/css/tachyons.min.css'
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
import './index.css';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAYFY_TIn1-2dUZapJycrTlAl6wzaUR7kc",
  authDomain: "curate-me.firebaseapp.com",
  databaseURL: "https://curate-me.firebaseio.com",
  storageBucket: "curate-me.appspot.com",
  messagingSenderId: "363011336555"
};
firebase.initializeApp(config);

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Content} />
      <Route path="redirect/:tokens" component={Manager} />
      <Route path="search/:query" component={Content} />
    </Route>
  </Router >,
  document.getElementById('root')
);
