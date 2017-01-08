import React from 'react';
import ReactDOM from 'react-dom';
import App, { Content } from './components/App';
import Login, { Manager } from './components/Login';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import 'whatwg-fetch';


// import 'tachyons/css/tachyons.min.css'
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
import './index.css';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Content} />
      <Route path="login" component={Login} />
      <Route path="redirect/:tokens" component={Manager} />
      <Route path="search/:query" component={Content} />
    </Route>
  </Router >,
  document.getElementById('root')
);
