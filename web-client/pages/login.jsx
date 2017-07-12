import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { authenticate, signup } from '../domain/auth';

export class AuthenticatePage extends Component {

  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.setUsername = this.setInputValue.bind(this, 'username');
    this.setPassword = this.setInputValue.bind(this, 'password');
    this.state = {
      username: '', password: '',
    };
  }

  setInputValue(key, ev) {
    this.setState({
      [key]: ev.target.value,
    });
  }

  async handleLogin() {
    const { username, password } = this.state;
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
    const { username, password } = this.state;
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
          <label htmlFor="name">
            Name:
            <input onChange={this.setUsername} type="name" id="name" />
          </label><br />
          <label htmlFor="password">
            Password:
            <input onChange={this.setPassword} type="password" id="password" />
          </label><br />

          <button onClick={this.handleLogin}>
            Login
          </button>

          <button onClick={this.handleSignUp}>
            Signup
          </button>
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
