import React from 'react';
import ReactDOM from 'react-dom';

import Cookies from 'js-cookie';

import { Provider } from 'react-redux';

import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import configureStore from './domain';
import { SET_AUTH_TOKEN } from './domain/auth/actions';

const token = Cookies.get('jwt');
const store = configureStore();
store.dispatch({
  type: SET_AUTH_TOKEN,
  token,
});

// import './styles/index.scss';
ReactDOM.render(
  <Provider store={store}><Router><App /></Router></Provider>,
  document.getElementById('react-app'),
);

