import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Route, Switch, IndexRoute,
} from 'react-router-dom';

import {
  withRouter, Redirect,
} from 'react-router';

import { Layout } from 'antd';

import NavigationMenu from './NavMenu';

import Login from './pages/login';
import Timezones from './pages/timezones';
import Users from './pages/users';

const roles = ['User', 'Manager', 'Admin'];

const { Header, Footer, Content } = Layout;

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
          <Content>
            <Switch>
              <Route exact path="/login" component={Login} />
              <Redirect to="/login" />
            </Switch>
          </Content>
        </Layout>
      );
    }

    return (
      <Layout>
        <Header><NavigationMenu /></Header>
        <Content>
          <Switch>

            <Route path="/timezones" component={Timezones} />
            <Route
              path="/users"
              render={() => {
                if (currentUser.role) {
                  return <Users />;
                }
                return <Redirect to="/" />;
              }}
            />

            <Redirect exact from="/" to="/timezones" />
            <Redirect from="/login" to="/timezones" />
          </Switch>
        </Content>
        <Footer>
          <div className="footer-menu-user-info">
            <span>Logged in as <strong>{currentUser.username}</strong></span><br />
            <span>Current role: <strong>{roles[currentUser.role]}</strong></span>
          </div>
        </Footer>
      </Layout>
    );
  }
}

App.defaultProps = {
  token: '',
  currentUser: {
    _id: '',
    username: '',
    role: 0,
  },
  match: {},
};

App.propTypes = {
  token: PropTypes.string,
  currentUser: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.number.isRequired,
  }),
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }),
};

export default withRouter(connect(state => ({
  token: state.auth.token,
  currentUser: state.users.currentUser,
}))(App));
