import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Route, Link, IndexRoute, Switch,
} from 'react-router-dom';

import Layout from './components/layout';
import Login from './pages/login';
import Timezones from './pages/timezones';
import Users from './pages/users';

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
          <Route exact path="/" component={Timezones} />
          <Route exact path="/users" component={Users} />
        </Switch>
      </Layout>
    );
  }
}

App.propTypes = {
  token: PropTypes.string,
};

export default connect(state => (state.auth))(App);
