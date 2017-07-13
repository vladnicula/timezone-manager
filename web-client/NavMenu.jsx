import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
 NavLink,
} from 'react-router-dom';

import { logout } from './domain/auth';

export class NavMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(ev) {
    this.props.logout();
    ev.preventDefault();
    ev.stopPropagation();
  }

  render() {
    return (
      <div className="navigation-menu">
        <NavLink to="/">Timezones</NavLink>
        <NavLink to="/users">Users</NavLink>
        <button onClick={this.handleLogout}>Logout</button>
      </div>
    );
  }
}

NavMenu.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default connect(
  null, dispatch => bindActionCreators({ logout }, dispatch),
)(NavMenu);
