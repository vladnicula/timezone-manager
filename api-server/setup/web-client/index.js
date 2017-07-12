import path from 'path';
import express from 'express';

export default function (app) {
  app.use('/dist/', express.static('dist'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve('./dist/index.html'));
  });
}
