import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
 NavLink, withRouter,
} from 'react-router-dom';

import { Button } from 'antd';

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
    const { currentUser } = this.props;
    return (
      <div className="navigation-menu">
        <NavLink to="/timezones">Timezones</NavLink>
        { (currentUser && currentUser.role !== 0) && <NavLink to="/users">Users</NavLink>}
        <div className="navigation-menu-user-details">
          <div className="navigation-menu-user-info">
            <span>{currentUser.username}</span><br />
            <span>role: {currentUser.role}</span>
          </div>
          <Button onClick={this.handleLogout}>Logout</Button>
        </div>
      </div>
    );
  }
}

NavMenu.propTypes = {
  logout: PropTypes.func.isRequired,
  currentUser: PropTypes.shape(
    {
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      role: PropTypes.number.isRequired,
    })
    .isRequired,
};

export default withRouter(connect(
  state => ({ currentUser: state.users.currentUser }),
  dispatch => bindActionCreators({ logout }, dispatch),
)(NavMenu));
