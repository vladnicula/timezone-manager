import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import TimezoneForm from '../components/timezone-form';

export class TimezonesPage extends Component {
  render() {
    const { props } = this;
    return (
      <div className="timezone-page">
        <h2>Timezones</h2>
        <div className="timezone-form-wrapper">
          <TimezoneForm />
        </div>
      </div>
    );
  }
}

export default connect()(TimezonesPage);
