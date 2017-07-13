import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
 NavLink,
} from 'react-router-dom';

export class NavMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="navigation-menu">
        <NavLink to="/">Timezones</NavLink>
        <NavLink to="/users">Users</NavLink>
      </div>
    );
  }
}

export default connect(
  null, null,
)(NavMenu);
