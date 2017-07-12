import React from 'react';

import {
  Route, Link, IndexRoute, Switch,
} from 'react-router-dom';


const Page1 = () => (<div>page 1</div>);
const Page2 = () => (<div>page 2</div>);

const routes = () => (
  <div>
    <Switch>
      <Route exact path="/" component={Page1} />
      <Route exact path="/page2" component={Page2} />
    </Switch>
  </div>
);

export default routes;
