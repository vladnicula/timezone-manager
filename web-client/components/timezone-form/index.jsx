import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, InputNumber } from 'antd';

if (process.env.BROWSER) {
  require('./index.scss');
}

export default class TimezoneForm extends Component {
  constructor(props) {
    super(props);
    const { providedCity, providedName, providedOffset } = props;
    this.state = {
      name: providedName,
      city: providedCity,
      offset: providedOffset,
    };

    this.setName = this.setValueOnChange.bind(this, 'name');
    this.setCity = this.setValueOnChange.bind(this, 'city');
    this.setOffset = this.setOffset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { providedName, providedCity, providedOffset } = nextProps;
    if (providedName !== undefined) {
      this.setState({ name: providedName });
    }
    if (providedCity !== undefined) {
      this.setState({ city: providedCity });
    }
    if (providedOffset !== undefined) {
      this.setState({ offset: providedOffset });
    }
  }

  setOffset(value) {
    this.setState({ offset: value });
  }

  setValueOnChange(key, ev) {
    this.setState({
      [key]: ev.target.value,
    });
  }

  getFormData() {
    const { name, city, offset } = this.state;
    return {
      name, city, offset,
    };
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
    const { name, city, offset } = this.state;

    return (
      <div className="timezone-form">
        <div className="field" onKeyUp={this.handleKeyUp}>
          <label htmlFor="timezone-name">
            Timezone Name:
            <Input value={name} onChange={this.setName} type="text" name="timezone-name" />
          </label>
          <label htmlFor="timezone-city">
            City Name:
            <Input value={city} onChange={this.setCity} type="text" name="timezone-city" />
          </label>
          <label htmlFor="timezone-offset">
            Offset Value:
            <InputNumber value={offset} min={-13} max={14} step={0.1} onChange={this.setOffset} name="timezone-offset" />
          </label>
        </div>
      </div>
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
};
