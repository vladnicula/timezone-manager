import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Button, Modal, Alert } from 'antd';

import {
  createTimezone,
  updateTimezone,
  fetchTimezones,
  deleteTimezone,
  clearTimezoneError,
} from '../../domain/timezones';
import { fetchUsers } from '../../domain/users';

import PageContent from '../../components/page-content';

import TimezoneForm from '../../components/timezone-form';
import TimezoneList from '../../components/timezone-list';
import TimezoneNameFilter from '../../components/timezone-name-filter';
import TimezoneUserFilter from '../../components/timezone-user-filter';

if (process.env.BROWSER) {
  require('./index.scss');
}

export class TimezonesPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTimezoneEntity: null,
      userTargetId: props.currentUser._id,
      nameFilter: '',
      modalVisible: false,
      loading: false,
    };

    this.handleTimezoneFormSubmit = this.handleTimezoneFormSubmit.bind(this);
    this.handleEditStartFlow = this.handleEditStartFlow.bind(this);
    this.handleDeleteStartFlow = this.handleDeleteStartFlow.bind(this);
    this.handleDeleteRequest = this.handleDeleteRequest.bind(this);
    this.setNameFilter = this.setNameFilter.bind(this);
    this.handleFilterByName = this.handleFilterByName.bind(this);
    this.handleUserTargetIdChanged = this.handleUserTargetIdChanged.bind(this);
    this.setTimezoneFormRef = this.setRef.bind(this, 'timezoneForm');

    this.handleTimezoneModalConfirm = this.handleTimezoneModalConfirm.bind(this);
    this.handleTimezoneModalCancel = this.handleTimezoneModalCancel.bind(this);

    this.handleTimezoneCreateRequest = this.handleTimezoneCreateRequest.bind(this);
    this.handleTimezoneDeleteModalCancel = this.handleTimezoneDeleteModalCancel.bind(this);
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

  getFormData() {
    return new Promise((resolve) => {
      this.timezoneForm.getForm().validateFields(null, {}, (errors, values) => {
        if (!errors) {
          return resolve(values);
        }
        return resolve(null);
      });
    });
  }

  setNameFilter(ev) {
    this.setState({
      nameFilter: ev.target.value,
    });
  }

  setRef(key, el) {
    if (el) {
      this[key] = el;
    }
  }

  async handleDeleteStartFlow() {
    this.setState({ loading: true });
    const { timezoneToDeleteById } = this.state;
    try {
      await this.props.deleteTimezone(timezoneToDeleteById);
    } catch (err) {
      console.error('delete action failed', err);
    }

    const { error } = this.props;

    if (error) {
      return this.setState({
        loading: false,
      });
    }

    try {
      await this.refreshTimezoneList();
    } catch (err) {
      console.error('timezone list refresh after delete action failed', err);
    }

    return this.setState({
      deleteModalVisible: false,
      loading: false,
      timezoneToDeleteById: false,
    });
  }

  handleDeleteRequest(id) {
    this.setState({
      deleteModalVisible: true,
      timezoneToDeleteById: id,
    });
  }

  handleEditStartFlow(id) {
    if (this.timezoneForm) {
      this.timezoneForm.getForm().resetFields();
    }
    this.setState({
      selectedTimezoneEntity: this.props.timezones.find(timezone => timezone._id === id),
      modalVisible: true,
    });
  }


  handleTimezoneModalConfirm() {
    this.setState({ modalVisible: false });
  }

  handleTimezoneModalCancel() {
    this.props.clearTimezoneError();
    this.setState({ modalVisible: false });
  }

  handleTimezoneDeleteModalCancel() {
    this.props.clearTimezoneError();
    this.setState({ deleteModalVisible: false });
  }

  async handleTimezoneFormSubmit() {
    const { selectedTimezoneEntity, userTargetId } = this.state;
    const newTimezoneData = await this.getFormData();

    if (!newTimezoneData) {
      return;
    }

    this.setState({
      loading: true,
    });

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

    const { error } = this.props;
    if (error) {
      this.setState({
        loading: false,
      });
    } else {
      await this.refreshTimezoneList();

      this.setState({
        loading: false,
      }, () => (
          this.setState({
            selectedTimezoneEntity: null,
            modalVisible: false,
          })
        ),
      );
    }
  }

  handleTimezoneCreateRequest() {
    if (this.timezoneForm) {
      this.timezoneForm.getForm().resetFields();
    }
    this.setState({
      modalVisible: true,
    });
  }

  handleFilterByName(nameFilter) {
    this.setState({ nameFilter }, () => (this.refreshTimezoneList()));
  }

  handleUserTargetIdChanged(value) {
    this.setState({ userTargetId: value }, () => (this.refreshTimezoneList()));
  }

  async refreshTimezoneList() {
    // todo add jwt here as well
    const { nameFilter, userTargetId: userId } = this.state;
    await this.props.fetchTimezones(null, { userId, nameFilter });
  }

  renderTimezoneFormModal() {
    const { selectedTimezoneEntity, modalVisible } = this.state;
    const timezoneFormProps = {
      onSubmit: this.handleTimezoneFormSubmit,
      ref: this.setTimezoneFormRef,
    };

    const confirmLabel = selectedTimezoneEntity ? 'Save' : 'Create';
    const modalTitle = selectedTimezoneEntity ? 'Update timezone' : 'Create Timezone';

    if (selectedTimezoneEntity) {
      timezoneFormProps.providedName = selectedTimezoneEntity.name;
      timezoneFormProps.providedCity = selectedTimezoneEntity.city;
      timezoneFormProps.providedOffset = selectedTimezoneEntity.offset;
    } else {
      timezoneFormProps.providedName = '';
      timezoneFormProps.providedCity = '';
      timezoneFormProps.providedOffset = 0;
    }

    return (
      <Modal
        visible={modalVisible}
        title={modalTitle}
        onOk={this.handleTimezoneModalConfirm}
        onCancel={this.handleTimezoneModalCancel}
        footer={[
          <Button key="cancel" onClick={this.handleTimezoneModalCancel}>Cancel</Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.state.loading}
            onClick={this.handleTimezoneFormSubmit}
          >
            {confirmLabel}
          </Button>,
        ]}
      >
        { this.props.error && <Alert message={this.props.error} type="error" /> }
        <TimezoneForm {...timezoneFormProps} />
      </Modal>
    );
  }

  renderDeleteConfirmModal() {
    const { deleteModalVisible } = this.state;
    return (
      <Modal
        visible={deleteModalVisible}
        title="Confirm Deletion of Timezone"
        onOk={() => this.handleDeleteStartFlow()}
        onCancel={this.handleTimezoneDeleteModalCancel}
        footer={[
          <Button
            key="cancel"
            onClick={this.handleTimezoneDeleteModalCancel}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.state.loading}
            onClick={() => this.handleDeleteStartFlow()}
          >
            Delete
          </Button>,
        ]}
      >
        { this.props.error && <Alert message={this.props.error} type="error" /> }
        <p>Are you sure you want to delete this timezone record?</p>
      </Modal>
    );
  }

  renderTimezoneWrapper() {
    const { timezones } = this.props;
    return (
      <TimezoneList
        onEditReuqest={this.handleEditStartFlow}
        onDeleteRequest={this.handleDeleteRequest}
        timezones={timezones}
      />
    );
  }

  renderUserFilter() {
    const { users } = this.props;
    return (
      <TimezoneUserFilter
        onUserIdChanged={this.handleUserTargetIdChanged}
        selectedUserId={this.state.userTargetId}
        users={users}
      />
    );
  }

  renderFilterByName() {
    return (
      <TimezoneNameFilter onApplyFilter={this.handleFilterByName} />
    );
  }

  renderTimezoneListFilters() {
    const { currentUser } = this.props;
    return (
      <div className="timezone-filters">
        {this.renderFilterByName()}
        {currentUser.role === 2 && this.renderUserFilter()}
      </div>
    );
  }

  render() {
    return (
      <PageContent className="timezone-page">
        <h2>Timezones</h2>
        {this.renderTimezoneFormModal()}
        {this.renderDeleteConfirmModal()}
        <div className="timezone-filters-wrapper">
          {this.renderTimezoneListFilters()}
          <Button
            type="primary"
            onClick={this.handleTimezoneCreateRequest}
          >Create new timezone</Button>
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
  error: '',
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
  clearTimezoneError: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default connect(
  state => ({
    error: state.timezones.error,
    // loading: state.timezones.working,
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
    clearTimezoneError,
  }, dispatch),
)(TimezonesPage);
