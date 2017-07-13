import express from 'express';
import cookieParser from 'cookie-parser';

import React from 'react';
import { Provider } from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';

import webpack from 'webpack';


import { WEB_SERVER_PORT } from '../config';

import App from '../App';

import webpackConfig from '../build/webpack.client.config.dev.js';

import pageTempalte from './template';

import store from '../domain';
import { SET_AUTH_TOKEN } from '../domain/auth/actions';

const app = express();

const configWebpack = () => new Promise((resolve, reject) => {
  if (process.env.NODE_ENV === 'development') {
    webpack(webpackConfig, (err, stats) => {
      if (err || stats.hasErrors()) {
        // Handle errors here
        reject(err || stats.hasErrors);
      }
      const assets = Object.keys(stats.compilation.assets);
      const vendorPath = `dist/${assets[1]}`;
      const appPath = `dist/${assets[0]}`;

        // console.log({ appPath, vendorPath });

      resolve({
        appPath,
        vendorPath,
      });
    });
  }
});

app.use(cookieParser());

app.use('/dist', express.static('dist'));

app.get('*', (req, res) => {
  const context = {};
  const { jwt } = req.cookies || {};
  if (jwt) {
    store.dispatch({
      type: SET_AUTH_TOKEN,
      token: jwt,
    });
  }
  const html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </Provider>,
  );

  // context.url will contain the URL to redirect to if a <Redirect> was used
  if (context.url) {
    res.writeHead(302, {
      Location: context.url,
    });
    res.end();
  } else {
    res.write(pageTempalte({
      serverSideContent: html,
      appBundleUrl: app.get('APP_BUNDLE_PATH'),
      vendorBundleUrl: app.get('VENDOR_BUNDLE_PATH'),
    }));
    res.end();
  }
});


configWebpack()
  .then(({ appPath, vendorPath }) => {
    app.set('APP_BUNDLE_PATH', appPath);
    app.set('VENDOR_BUNDLE_PATH', vendorPath);

    app.listen(WEB_SERVER_PORT, () => {
      console.log(`Started universal web server ${WEB_SERVER_PORT}`);
    });
  })
  .catch(err => (
    console.log(err)
  ));
