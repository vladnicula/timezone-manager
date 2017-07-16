import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, InputNumber, Form } from 'antd';

if (process.env.BROWSER) {
  require('./index.scss');
}

const FormItem = Form.Item;

function offsetValidator(number) {
  if (number >= -13 && number <= 14) {
    return {
      validateStatus: 'success',
      error: null,
    };
  }
  return {
    validateStatus: 'error',
    error: new Error('Offset must be between -13 and 14!'),
  };
}

export class TimezoneForm extends Component {
  constructor(props) {
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
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
    const { providedName, providedCity, providedOffset } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleFormSubmit} className="timezone-form">
        <FormItem label="Timezone Name">
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: 'please provide a timezone name!' },
              { min: 2, message: 'timezone name must be more than 1 character' },
              { max: 24, message: 'timezone name must be less than 24 characters' },
              {
                pattern: /^[A-Za-z0-9\-_ ]+$/,
                message: 'timezone name can contain alhpanumeric, space and - characters',
              },
            ],
            initialValue: providedName,
          })(
            <Input
              onKeyUp={this.handleKeyUp}
              name="timezone-name"
              placeholder="Timezone Name"
            />,
          )}
        </FormItem>

        <FormItem label="City Name">
          {getFieldDecorator('city', {
            rules: [
              { required: true, message: 'please provide your city name!' },
              { min: 2, message: 'city name must be more than 1 caharacter' },
              { max: 24, message: 'city name must be less than 24 characters' },
              {
                pattern: /^[A-Za-z0-9\-_ ]+$/,
                message: 'city name can contain alhpanumeric, space and - characters',
              },
            ],
            initialValue: providedCity,
          })(
            <Input
              onKeyUp={this.handleKeyUp}
              name="city-name"
              placeholder="city Name"
            />,
          )}
        </FormItem>

        <FormItem label="Timezone Offset">
          {getFieldDecorator('offset', {
            rules: [
              { required: true, message: 'Please provide a GMT offset!' },
              (rule, value, callback) => {
                const errors = [];
                const status = offsetValidator(value);
                if (status.error) {
                  errors.push(status.error);
                }
                callback(errors);
              },
            ],
            initialValue: parseFloat(providedOffset),
          })(
            <InputNumber
              onKeyUp={this.handleKeyUp}
              min={-13}
              max={14}
              step={0.1}
              name="timezone-offset"
            />,
          )}
        </FormItem>

      </Form>
    );
  }
}

const emptyFn = () => {};

TimezoneForm.defaultProps = {
  providedName: '',
  providedCity: '',
  providedOffset: '',
  onSubmit: emptyFn,
};

TimezoneForm.propTypes = {
  providedName: PropTypes.string,
  providedCity: PropTypes.string,
  providedOffset: PropTypes.number,
  onSubmit: PropTypes.func,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
  }).isRequired,
};

export default Form.create()(TimezoneForm);
