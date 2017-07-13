import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
    this.setOffset = this.setValueOnChange.bind(this, 'offset');
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { providedName, providedCity, providedOffset } = nextProps;
    if (providedName) {
      this.setState({ name: providedName });
    }
    if (providedCity) {
      this.setState({ city: providedCity });
    }
    if (providedOffset !== undefined) {
      this.setState({ offset: providedOffset });
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
    console.log('validate on submit timezone', { name, city, offset });
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
          <input value={name} onChange={this.setName} type="text" name="timezone-name" />
          <br />
          <input value={city} onChange={this.setCity} type="text" name="timezone-city" />
          <br />
          <input value={offset} onChange={this.setOffset} type="text" name="timezone-offset" />
          <br />
          <button onClick={this.handleSubmit}>Save</button>
        </div>
      </div>
    );
  }
}

const emptyFn = () => {};

TimezoneForm.defaultProps = {
  providedName: '',
  providedCity: '',
  providedOffset: 0,
  onSubmit: emptyFn,
};

TimezoneForm.propTypes = {
  providedName: PropTypes.string,
  providedCity: PropTypes.string,
  providedOffset: PropTypes.number,
  onSubmit: PropTypes.func,
};
