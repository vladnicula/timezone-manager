import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { createTimezone, updateTimezone, fetchTimezones, deleteTimezone } from '../domain/timezones';
import { fetchUsers } from '../domain/users';

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
    this.setNameFilter = this.setNameFilter.bind(this);
    this.handleFilterByName = this.handleFilterByName.bind(this);
  }

  handleEditStartFlow(id) {
    this.setState({
      selectedTimezoneEntity: this.props.timezones.find(timezone => timezone._id === id),
    });
  }

  setNameFilter(ev) {
    this.setState({
      nameFilter: ev.target.value,
    });
  }

  handleDeleteStartFlow(id) {
    this.props.deleteTimezone(id);
  }

  componentDidMount() {
    this.props.fetchTimezones(null, {});

    const { currentUser } = this.props;
    if (currentUser.role === 2) {
      const { users } = this.props;
      if (!users.length) {
        this.props.fetchUsers();
      }
    }
  }

  handleTimezoneFormSubmit(newTimezoneData) {
    const { selectedTimezoneEntity } = this.state;
    if (selectedTimezoneEntity) {
      this.props.updateTimezone(
        selectedTimezoneEntity._id, { ...selectedTimezoneEntity, ...newTimezoneData },
      );
    } else {
      this.props.createTimezone(newTimezoneData);
    }

    this.setState({
      selectedTimezoneEntity: null,
    });
  }

  handleFilterByName() {
    const { nameFilter, currentNameFilter } = this.state;
    if (nameFilter !== currentNameFilter) {
      this.props.fetchTimezones(null, { nameFilter }).then(() => {
        this.setState({
          currentNameFilter: nameFilter,
        });
      });
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
    } else {
      timezoneFormProps.providedName = '';
      timezoneFormProps.providedCity = '';
      timezoneFormProps.providedOffset = 0;
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

  renderUserFilter() {
    const { users } = this.props;
    return (
      <div>
        <div>Filter by username:</div>
        {users.map(user => <div>{user._id} - {user.username}</div>)}
      </div>
    );
  }

  renderFilterByName() {
    return (
      <div className="timezone-filters-filter-by-name">
        <input name="name-filter" value={this.state.nameFilter} onChange={this.setNameFilter} />
        <button onClick={this.handleFilterByName}>Filter</button>
      </div>
    );
  }

  renderTimezoneListFilters() {
    const { currentUser } = this.props;
    return (
      <div className="timezone-filters">
        {currentUser.role === 2 && this.renderUserFilter()}
        {this.renderFilterByName()}
      </div>
    );
  }

  render() {
    return (
      <div className="timezone-page">
        <h2>Timezones</h2>
        <div className="timezone-form-wrapper">
          {this.renderTimezoneForm()}
        </div>
        <div className="timezone-filters-wrapper">
          {this.renderTimezoneListFilters()}
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
  currentUser: {},
  users: [],
};

TimezonesPage.propTypes = {
  currentUser: PropTypes.object,
  users: PropTypes.arrayOf(PropTypes.object),
  timezones: PropTypes.arrayOf(PropTypes.object),
  createTimezone: PropTypes.func.isRequired,
  updateTimezone: PropTypes.func.isRequired,
  deleteTimezone: PropTypes.func.isRequired,
  fetchTimezones: PropTypes.func.isRequired,
  fetchUsers: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    timezones: state.timezones.timezones,
    currentUser: state.users.currentUser,
    users: state.users.users,
  }),
  dispatch => bindActionCreators({
    createTimezone,
    updateTimezone,
    deleteTimezone,
    fetchTimezones,
    fetchUsers,
  }, dispatch),
)(TimezonesPage);
