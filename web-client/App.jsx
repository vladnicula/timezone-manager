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
      currentUser,
    } = this.props;

    if (!token) {
      return (
        <Layout>
          <Route
            render={
              () => {
                if (match.path !== '/') {
                  return (<Redirect to="/" />);
                }
                return (<Login />);
              }
            }
          />
        </Layout>
      );
    }

    return (
      <Layout>
        <NavMenu />
        <Switch>
          <Route exact path="/" component={Timezones} />
          <Route
            exact
            path="/users"
            render={() => {
              if (currentUser.role) {
                return <Users />;
              }
              return <Redirect to="/" />;
            }}
          />
        </Switch>
      </Layout>
    );
  }
}

App.defaultProps = {
  token: '',
  currentUser: {},
  match: {},
};

App.propTypes = {
  token: PropTypes.string,
  currentUser: PropTypes.object,
  match: PropTypes.object,
};

export default withRouter(connect(state => ({
  token: state.auth.token,
  currentUser: state.users.currentUser,
}))(App));
