import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Select } from 'antd';

const Option = Select.Option;

export default class UserForm extends Component {
  constructor(props) {
    super(props);
    const { providedPassword, providedUserName, providedRole } = props;
    this.state = {
      username: providedUserName,
      password: providedPassword,
      role: providedRole,
    };

    this.setUserName = this.setValueOnChange.bind(this, 'username');
    this.setPassword = this.setValueOnChange.bind(this, 'password');
    this.setRole = this.setSelectRole.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { providedUserName, providedPassword, providedRole } = nextProps;
    if (providedUserName !== undefined) {
      this.setState({ username: providedUserName });
    }
    if (providedPassword !== undefined) {
      this.setState({ password: providedPassword });
    }
    if (providedRole !== undefined) {
      this.setState({ role: providedRole });
    }
  }

  setSelectRole(value) {
    this.setState({
      role: parseInt(value, 10),
    });
  }

  setValueOnChange(key, ev) {
    this.setState({
      [key]: ev.target.value,
    });
  }

  handleSubmit() {
    const { username, password, role } = this.state;
    const { onSubmit } = this.props;
    onSubmit({ username, password, role });
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
          <Input value={username} onChange={this.setUserName} type="text" name="username" />
          <Input value={password} onChange={this.setPassword} type="password" name="password" />
          <Select
            name="user-role"
            defaultValue={role.toString()}
            style={{ width: 120 }}
            onChange={this.setRole}
          >
            <Option value={'0'}>User</Option>
            <Option value={'1'}>Manager</Option>
            <Option value={'2'}>Admin</Option>
          </Select>
          <Button onClick={this.handleSubmit}>Save</Button>
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
