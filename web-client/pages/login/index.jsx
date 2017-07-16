import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Alert } from 'antd';

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

  getFormData() {
    return new Promise((resolve) => {
      this.authForm.getForm().validateFields(null, {}, (errors, values) => {
        if (!errors) {
          return resolve(values);
        }
        return resolve(null);
      });
    });
  }

  async handleLogin() {
    const formData = await this.getFormData();
    if (!formData) {
      return;
    }
    const { username, password } = formData;

    try {
      await this.props.authenticate({
        username, password,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async handleSignUp() {
    const formData = await this.getFormData();
    if (!formData) {
      return;
    }
    const { username, password } = formData;

    try {
      await this.props.signup({
        username, password,
      });
    } catch (err) {
      console.log(err);
    }
  }

  renderErrorBox() {
    return (
      <Alert message={this.props.error} type="error" />
    );
  }

  render() {
    const { error } = this.props;
    return (
      <PageContent className="auth-page">
        <div className="auth-page-form-wrapper">
          <h2 className="auth-page-title">Login / Signup</h2>
          { error && this.renderErrorBox() }
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

AuthenticatePage.defaultProps = {
  error: null,
};

AuthenticatePage.propTypes = {
  authenticate: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
  error: PropTypes.string,
};


export default connect(
  state => state.auth,
  dispatch => ({
    authenticate: bindActionCreators(authenticate, dispatch),
    signup: bindActionCreators(signup, dispatch),
  }))(AuthenticatePage);
