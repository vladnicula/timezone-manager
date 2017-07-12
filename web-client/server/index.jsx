import express from 'express';
import webpack from 'webpack';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';

import { WEB_SERVER_PORT } from '../config';

import Routes from '../routes';

import webpackConfig from '../build/webpack.client.config.dev.js';

import pageTempalte from './template';

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

app.use('/dist', express.static('dist'));

app.get('*', (req, res) => {
  const context = {};
  const html = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <Routes />
    </StaticRouter>,
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
