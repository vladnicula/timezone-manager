import express from 'express';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';

import { WEB_SERVER_PORT } from './config';

import Routes from './routes';


const app = express();

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
    res.write(html);
    res.end();
  }
});

app.listen(WEB_SERVER_PORT, () => {
  console.log(`Started universal web server ${WEB_SERVER_PORT}`);
});
