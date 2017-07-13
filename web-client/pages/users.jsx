import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

export class UsersPage extends Component {
  render() {
    const { props } = this;
    return <div>Users</div>;
  }
}

export default connect()(UsersPage);
