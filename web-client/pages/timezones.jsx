import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { createTimezone, fetchTimezones } from '../domain/timezones';

import TimezoneForm from '../components/timezone-form';
import TimezoneList from '../components/timezone-list';

export class TimezonesPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTimezoneEntity: null,
    };

    this.handleTimezoneFormSubmit = this.handleTimezoneFormSubmit.bind(this);
    this.handleEditStartFlow = this.handleEditStartFlow.bind(this);
    this.handleDeleteStartFlow = this.handleDeleteStartFlow.bind(this);
  }

  handleEditStartFlow(id) {
    console.log('start edit', id, this.state);
  }

  handleDeleteStartFlow(id) {
    console.log('start delete flow', id, this.state);
  }

  componentDidMount() {
    this.props.fetchTimezones();
  }

  handleTimezoneFormSubmit(newTimezoneData) {
    const { selectedTimezoneEntity } = this.state;
    const { createTimezone, updateTimezone } = this.props;
    if (selectedTimezoneEntity) {
      // edit/update flow, must update existing entity
      console.log('edit', selectedTimezoneEntity, updateTimezone);
    } else {
      // create flow
      console.log('create', newTimezoneData, createTimezone);
      createTimezone(newTimezoneData);
    }
  }

  renderTimezoneForm() {
    const { selectedTimezoneEntity } = this.state;
    const timezoneFormProps = {
      onSubmit: this.handleTimezoneFormSubmit,
    };

    if (selectedTimezoneEntity) {
      timezoneFormProps.providedName = selectedTimezoneEntity.name;
      timezoneFormProps.providedCity = selectedTimezoneEntity.city;
      timezoneFormProps.providedOffset = selectedTimezoneEntity.offset;
    }

    return (<TimezoneForm {...timezoneFormProps} />);
  }

  renderTimezoneWrapper() {
    const { timezones } = this.props;
    return (
      <TimezoneList
        onEditReuqest={this.handleEditStartFlow}
        onDeleteRequest={this.handleDeleteStartFlow}
        timezones={timezones}
      />
    );
  }

  render() {
    const { props, state } = this;

    return (
      <div className="timezone-page">
        <h2>Timezones</h2>
        <div className="timezone-form-wrapper">
          {this.renderTimezoneForm()}
        </div>
        <div className="timezone-list-wrapper">
          {this.renderTimezoneWrapper()}
        </div>
      </div>
    );
  }
}

TimezonesPage.defaultProps = {
  timezones: [],
};

TimezonesPage.propTypes = {
  timezones: PropTypes.arrayOf(PropTypes.object),
};

export default connect(
  state => state.timezones,
  dispatch => bindActionCreators({
    createTimezone,
    updateTimezone: () => {},
    deleteTimezone: () => {},
    fetchTimezones,
  }, dispatch),
)(TimezonesPage);
