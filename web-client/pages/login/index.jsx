import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'antd';

import { authenticate, signup } from '../../domain/auth';

import PageContent from '../../components/page-content';
import UserAuthForm from '../../components/user-auth-form';

if (process.env.BROWSER) {
  require('./index.scss');
}

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
      <PageContent className="auth-page">
        <div className="auth-page-form-wrapper">
          <h2 className="auth-page-title">Login / Signup</h2>
          <div>
            <UserAuthForm ref={this.setAuthFormRef} onSubmit={this.handleLogin} />
            <div className="auth-page-actions">
              <Button type="primary" onClick={this.handleLogin}>
                Login
              </Button>

              <Button onClick={this.handleSignUp}>
                Signup
              </Button>
            </div>
          </div>
        </div>
      </PageContent>
    );
  }
}

AuthenticatePage.propTypes = {
  authenticate: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
};

export default connect(
  null,
  dispatch => ({
    authenticate: bindActionCreators(authenticate, dispatch),
    signup: bindActionCreators(signup, dispatch),
  }))(AuthenticatePage);
