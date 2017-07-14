import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Input } from 'antd';

export default class UserAuthForm extends Component {
  constructor(props) {
    super(props);
    this.setUsername = this.setInputValue.bind(this, 'username');
    this.setPassword = this.setInputValue.bind(this, 'password');
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.state = {
      username: '', password: '',
    };
  }

  setInputValue(key, ev) {
    this.setState({
      [key]: ev.target.value,
    });
  }

  getFormData() {
    const { username, password } = this.state;
    return {
      username, password,
    };
  }

  handleKeyUp(ev) {
    if (ev.which === 13) {
      this.props.onSubmit();
    }
  }

  render() {
    return (
      <div>
        <label htmlFor="name">
          Name:
          <Input
            onKeyUp={this.handleKeyUp}
            onChange={this.setUsername}
            type="name"
            id="name"
          />
        </label><br />
        <label htmlFor="password">
          Password:
          <Input
            onKeyUp={this.handleKeyUp}
            onChange={this.setPassword}
            type="password"
            id="password"
          />
        </label><br />
      </div>
    );
  }
}

UserAuthForm.defaultProps = {
  onSubmit: () => {},
};

UserAuthForm.propTypes = {
  onSubmit: PropTypes.func,
};
