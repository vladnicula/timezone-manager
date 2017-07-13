import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Route, Switch,
} from 'react-router-dom';

import {
  withRouter, Redirect,
} from 'react-router';

import NavMenu from './NavMenu';

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
      match,
    } = this.props;

    if (!token) {
      return (
        <Layout>
          <Route
            render={() => (
              match.path !== '/' ? (
                <Redirect to="/" />
              ) : (
                <Login />
              )
            )}
          />
        </Layout>
      );
    }

    return (
      <Layout>
        <NavMenu />
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
  match: PropTypes.object,
};

export default withRouter(connect(state => (state.auth))(App));
