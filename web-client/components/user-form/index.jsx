import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Select, Form } from 'antd';

if (process.env.BROWSER) {
  require('./index.scss');
}

const FormItem = Form.Item;
const Option = Select.Option;

export class UserForm extends Component {
  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  setValueOnChange(key, ev) {
    this.setState({
      [key]: ev.target.value,
    });
  }

  handleFormSubmit(ev) {
    if (ev) {
      ev.preventDefault();
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  }

  handleKeyUp(ev) {
    if (ev.which === 13) {
      this.handleFormSubmit();
    }
  }

  render() {
    const { providedUserName, providedRole, providedPassword } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleFormSubmit} className="user-form">
        <FormItem label="Username">
          {getFieldDecorator('username', {
            initialValue: providedUserName,
            rules: [
              { required: true, message: 'Please provide your username!' },
              { min: 4, message: 'username cannot be less than 4 characters long' },
              { max: 12, message: 'username cannot be more than 12 characters long' },
              {
                pattern: /^[A-Za-z0-9\-_]+$/,
                message: 'username must contain only letters, numbers, "-" and "_"',
              },
            ],
          })(
            <Input
              onKeyUp={this.handleKeyUp}
              placeholder="Username"
            />,
          )}
        </FormItem>

        <FormItem label="Password">
          {getFieldDecorator('password', {
            initialValue: providedPassword,
            rules: [
              { min: 4, message: 'password cannot be less than 4 characters long' },
              { max: 12, message: 'password cannot be more than 12 characters long' },
            ],
          })(
            <Input
              onKeyUp={this.handleKeyUp}
              type="password"
              placeholder="Password"
            />,
          )}
        </FormItem>

        <FormItem label="Role">
          {getFieldDecorator('role', {
            initialValue: providedRole.toString(),
            rules: [
              { required: true, message: 'Please provide your password!' },
            ],
          })(
            <Select
              className="user-form-role-control"
              name="user-role"
              style={{ flex: 1 }}
              onChange={this.setRole}
            >
              <Option value={'0'}>User</Option>
              <Option value={'1'}>Manager</Option>
              <Option value={'2'}>Admin</Option>
            </Select>,
          )}
        </FormItem>
      </Form>
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
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
  }).isRequired,
};

export default Form.create()(UserForm);
