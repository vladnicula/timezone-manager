import React from 'react';
import ReactDOM from 'react-dom';

import cookies from 'js-cookie';

import { Provider } from 'react-redux';

import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import configureStore from './domain';
import { SET_AUTH_TOKEN } from './domain/auth/actions';


import './client.scss';

let token = cookies.get('jwt');

const store = configureStore();
store.dispatch({
  type: SET_AUTH_TOKEN,
  token,
});

store.subscribe(() => {
  const auth = store.getState().auth;
  if (auth.token !== token) {
    token = auth.token;
    if (token) {
      cookies.set('jwt', token);
    } else {
      cookies.remove('jwt');
    }
  }
});

// import './styles/index.scss';
ReactDOM.render(
  <Provider store={store}><Router><App /></Router></Provider>,
  document.getElementById('react-app'),
);

