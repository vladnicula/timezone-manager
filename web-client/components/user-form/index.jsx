import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class UserForm extends Component {
  constructor(props) {
    super(props);
    const { providedPassword, providedUserName, providedRole } = props;
    this.state = {
      username: providedUserName,
      password: providedPassword,
      role: providedRole,
    };

    this.setUserName = this.setValueOnChange.bind(this, 'name');
    this.setPassword = this.setValueOnChange.bind(this, 'city');
    this.setRole = this.setValueOnChange.bind(this, 'offset');
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { providedUserName, providedPassword, providedRole } = nextProps;
    if (providedUserName !== undefined) {
      this.setState({ name: providedUserName });
    }
    if (providedPassword !== undefined) {
      this.setState({ city: providedPassword });
    }
    if (providedRole !== undefined) {
      this.setState({ offset: providedRole });
    }
  }

  setValueOnChange(key, ev) {
    this.setState({
      [key]: ev.target.value,
    });
  }

  handleSubmit() {
    const { name, city, offset } = this.state;
    const { onSubmit } = this.props;
    onSubmit({ name, city, offset });
  }

  handleKeyUp(ev) {
    if (ev.which === 13) {
      this.handleSubmit();
    }
  }

  render() {
    const { role, username, password } = this.state;

    return (
      <div className="user-form">
        <div className="field" onKeyUp={this.handleKeyUp}>
          <input value={username} onChange={this.setUserName} type="text" name="timezone-name" />
          <br />
          <input value={password} onChange={this.setPassword} type="text" name="timezone-city" />
          <br />
          <input value={role} onChange={this.setRole} type="text" name="timezone-offset" />
          <br />
          <button onClick={this.handleSubmit}>Save</button>
        </div>
      </div>
    );
  }
}

const emptyFn = () => {};

UserForm.defaultProps = {
  providedUserName: '',
  providedPassword: '',
  providedRole: 0,
  onSubmit: emptyFn,
};

UserForm.propTypes = {
  providedUserName: PropTypes.string,
  providedPassword: PropTypes.string,
  providedRole: PropTypes.number,
  onSubmit: PropTypes.func,
};
