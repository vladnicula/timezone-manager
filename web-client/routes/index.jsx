import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Route, Link, IndexRoute, Switch,
} from 'react-router-dom';

import Layout from '../layout';
import Login from '../pages/login';


const Page1 = () => (<div>page 1</div>);
const Page2 = () => (<div>page 2</div>);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      token,
    } = this.props;

    if (!token) {
      return (
        <Layout>
          <Route exact path="/" component={Login} />
        </Layout>
      );
    }

    return (
      <Layout>
        <Switch>
          <Route exact path="/" component={Page1} />
          <Route exact path="/page2" component={Page2} />
        </Switch>
      </Layout>
    );
  }
}

App.propTypes = {
  token: PropTypes.string,
};

export default connect(state => (state.auth))(App);
