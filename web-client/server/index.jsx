import express from 'express';
import cookieParser from 'cookie-parser';

import React from 'react';
import { Provider } from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';

import webpack from 'webpack';

import { client } from 'config';


import App from '../App';

import webpackConfig from '../build/webpack.client.config.dev.js';

import pageTempalte from './template';

import configureStore from '../domain';
import { SET_AUTH_TOKEN } from '../domain/auth/actions';
import { fetchMe } from '../domain/users';
import asycnRoutehandler from './async-route-handler';
import errorHandler from './error-handler';

const app = express();

const configWebpack = () => new Promise((resolve, reject) => {
  if (process.env.NODE_ENV !== 'production') {
    const compiler = webpack(webpackConfig);
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        // Handle errors here
        reject(err || stats.toString({ colors: true, reasons: true }));
      }

      const assets = Object.keys(stats.compilation.assets);
      const vendorPath = `dist/${assets[1]}`;
      const appPath = `dist/${assets[0]}`;

      console.log(stats.toString({ colors: true, reasons: true }));

      resolve({
        appPath,
        vendorPath,
      });
    });
  }
});

app.use(cookieParser());

app.use('/dist', express.static('dist'));

app.get('*', asycnRoutehandler(
  async (req, res) => {
    const context = {};
    const { jwt } = req.cookies || {};
    const store = configureStore();
    if (jwt) {
      store.dispatch({
        type: SET_AUTH_TOKEN,
        token: jwt,
      });

      await store.dispatch(fetchMe(jwt));

      if (!store.getState().users.currentUser) {
        res.clearCookie('jwt');
        return res.redirect(302, req.url);
      }
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
      return res.end();
    }

    res.write(pageTempalte({
      serverSideContent: html,
      appBundleUrl: app.get('APP_BUNDLE_PATH'),
      vendorBundleUrl: app.get('VENDOR_BUNDLE_PATH'),
      initialState: store.getState(),
    }));
    return res.end();
  }),
);

app.use(errorHandler);
const { WEB_SERVER_PORT } = client;
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
