import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';

// import './styles/index.scss';

ReactDOM.render(
  <Router><Routes /></Router>,
  document.getElementById('react-app'),
);

