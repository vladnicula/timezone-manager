import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { createTimezone, updateTimezone, fetchTimezones, deleteTimezone } from '../domain/timezones';
import { fetchUsers } from '../domain/users';

import PageContent from '../components/page-content';

import TimezoneForm from '../components/timezone-form';
import TimezoneList from '../components/timezone-list';

export class TimezonesPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTimezoneEntity: null,
      userTargetId: props.currentUser._id,
      nameFilter: '',
    };

    this.handleTimezoneFormSubmit = this.handleTimezoneFormSubmit.bind(this);
    this.handleEditStartFlow = this.handleEditStartFlow.bind(this);
    this.handleDeleteStartFlow = this.handleDeleteStartFlow.bind(this);
    this.setNameFilter = this.setNameFilter.bind(this);
    this.handleFilterByName = this.handleFilterByName.bind(this);
    this.handleUserTargetIdChanged = this.handleUserTargetIdChanged.bind(this);
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

  async handleDeleteStartFlow(id) {
    try {
      await this.props.deleteTimezone(id);
    } catch (err) {
      console.error('delete action failed', err);
    }

    try {
      await this.refreshTimezoneList();
    } catch (err) {
      console.error('timezone list refresh after delete action failed', err);
    }
  }

  componentDidMount() {
    this.refreshTimezoneList();

    const { currentUser } = this.props;

    if (currentUser.role === 2) {
      const { users } = this.props;
      if (!users.length) {
        this.props.fetchUsers();
      }
    }
  }

  componentWillUnmount() {
    this.setState({
      selectedTimezoneEntity: null,
      userTargetId: this.props.currentUser._id,
      nameFilter: '',
    });
  }

  async handleTimezoneFormSubmit(newTimezoneData) {
    const { selectedTimezoneEntity, userTargetId } = this.state;
    if (selectedTimezoneEntity) {
      await this.props.updateTimezone(
        selectedTimezoneEntity._id, {
          ...selectedTimezoneEntity,
          ...newTimezoneData,
          userId: userTargetId,
        },
      );
    } else {
      await this.props.createTimezone({ ...newTimezoneData, userId: userTargetId });
    }

    await this.refreshTimezoneList();

    this.setState({
      selectedTimezoneEntity: null,
    });
  }

  handleFilterByName() {
    this.refreshTimezoneList();
  }

  handleUserTargetIdChanged(event) {
    const userId = event.target.value;
    this.setState({ userTargetId: userId }, () => (this.refreshTimezoneList()));
  }

  async refreshTimezoneList() {
    // todo add jwt here as well
    const { nameFilter, userTargetId: userId } = this.state;
    await this.props.fetchTimezones(null, { userId, nameFilter });
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
        <select onChange={this.handleUserTargetIdChanged} value={this.state.userTargetId}>
          {users.map(user => <option key={user._id} value={user._id}>{user.username}</option>)}
        </select>
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
      <PageContent className="timezone-page">
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
      </PageContent>
    );
  }
}

TimezonesPage.defaultProps = {
  timezones: [],
  currentUser: {},
  users: [],
};

TimezonesPage.propTypes = {
  currentUser: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }),
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      role: PropTypes.number.isRequired,
    }),
  ),
  timezones: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      offset: PropTypes.number.isRequired,
    }),
  ),
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
