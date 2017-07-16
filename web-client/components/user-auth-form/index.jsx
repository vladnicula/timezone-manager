import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Input, Form } from 'antd';

const FormItem = Form.Item;

export class UserAuthForm extends Component {
  constructor(props) {
    super(props);

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  getFormData() {
    return this.form.getFieldsValue();
  }

  handleKeyUp(ev) {
    if (ev.which === 13) {
      this.handleFormSubmit();
    }
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

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleFormSubmit} className="login-form">
        <FormItem label="Username">
          {getFieldDecorator('username', {
            rules: [
              { required: true, message: 'Please provide your username!' },
              { min: 4, message: 'username cannot be less than 4 characters long' },
              { max: 12, message: 'username cannot be more than 12 characters long' },
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
            rules: [
              { required: true, message: 'Please provide your password!' },
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
      </Form>
    );
  }
}

UserAuthForm.defaultProps = {
  onSubmit: () => {},
};

UserAuthForm.propTypes = {
  onSubmit: PropTypes.func,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
  }).isRequired,
};


export default Form.create()(UserAuthForm);
