import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'antd';
import 'antd/lib/button/style/index.css';

import { authenticate, signup } from '../domain/auth';

import UserAuthForm from '../components/user-auth-form';

export class AuthenticatePage extends Component {

  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.setAuthFormRef = this.setRef.bind(this, 'authForm');
  }

  setRef(key, el) {
    if (el) {
      this[key] = el;
    }
  }

  async handleLogin() {
    const { username, password } = this.authForm.getFormData();
    try {
      const response = await this.props.authenticate({
        username, password,
      });
      console.log('login success', response);
    } catch (err) {
      console.log(err);
    }
  }

  async handleSignUp() {
    const { username, password } = this.authForm.getFormData();
    try {
      const response = await this.props.signup({
        username, password,
      });
      console.log('signup success', response);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <div>
        <h2>Login / Signup</h2>
        <div>
          <UserAuthForm ref={this.setAuthFormRef} onSubmit={this.handleLogin} />

          <Button onClick={this.handleLogin}>
            Login
          </Button>

          <Button onClick={this.handleSignUp}>
            Signup
          </Button>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    authenticate: bindActionCreators(authenticate, dispatch),
    signup: bindActionCreators(signup, dispatch),
  }))(AuthenticatePage);
