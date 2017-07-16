import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Modal, Button, Alert } from 'antd';

import {
  fetchUsers,
  updateUser,
  deleteUser,
  createUser,
  clearUsersError,
  fetchMe,
} from '../../domain/users';

import PageContent from '../../components/page-content';

import UserList from '../../components/user-list';
import UserForm from '../../components/user-form';

if (process.env.BROWSER) {
  require('./index.scss');
}

export class UsersPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedUserEntity: null,
      userDataModalVisible: false,
      deleteModalVisible: false,
      loading: false,
    };

    this.setUserFormRef = this.setRef.bind(this, 'userForm');

    this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
    this.handleEditStartFlow = this.handleEditStartFlow.bind(this);
    this.handleDeleteRequest = this.handleDeleteRequest.bind(this);
    this.handleDeleteStartFlow = this.handleDeleteStartFlow.bind(this);

    this.handleCreateFlowStart = this.handleCreateFlowStart.bind(this);
    this.handleUserDataModalCancel = this.handleUserDataModalCancel.bind(this);
    this.handleUserDeleteModalCancel = this.handleUserDeleteModalCancel.bind(this);
  }

  componentDidMount() {
    this.props.fetchUsers(this.props.accessToken);
  }

  setRef(key, el) {
    if (el) {
      this[key] = el;
    }
  }

  getFormData() {
    return new Promise((resolve) => {
      this.userForm.getForm().validateFields(null, {}, (errors, values) => {
        if (!errors) {
          return resolve(values);
        }
        return resolve(null);
      });
    });
  }

  handleCreateFlowStart() {
    if (this.userForm) {
      this.userForm.getForm().resetFields();
    }

    this.setState({
      userDataModalVisible: true,
    });
  }

  handleUserDataModalCancel() {
    this.props.clearUsersError();
    this.setState({
      userDataModalVisible: false,
      selectedUserEntity: null,
    });
  }

  async handleUserFormSubmit() {
    const { selectedUserEntity } = this.state;
    const newUserData = await this.getFormData();

    if (!newUserData) {
      return false;
    }

    this.setState({
      loading: true,
    });

    if (selectedUserEntity) {
      await this.props.updateUser(
        this.props.accessToken,
        selectedUserEntity._id,
        { ...selectedUserEntity, ...newUserData },
      );
    } else {
      await this.props.createUser(this.props.accessToken, newUserData);
    }

    const { error } = this.props;

    if (error) {
      return this.setState({
        loading: false,
      });
    }

    await this.props.fetchUsers(this.props.accessToken);
    await this.props.fetchMe(this.props.accessToken);

    return this.setState({
      loading: false,
    }, () => (
        this.setState({
          selectedUserEntity: null,
          userDataModalVisible: false,
        })
      ),
    );
  }

  handleEditStartFlow(id) {
    if (this.userForm) {
      this.userForm.getForm().resetFields();
    }
    this.setState({
      selectedUserEntity: this.props.users.find(user => user._id === id),
      userDataModalVisible: true,
    });
  }

  async handleDeleteStartFlow() {
    this.setState({ loading: true });
    const { userToDeleteById } = this.state;
    try {
      await this.props.deleteUser(this.props.accessToken, userToDeleteById);
    } catch (err) {
      console.log(`User deletion failed for id ${userToDeleteById}`);
      console.error(err);
    }

    const { error } = this.props;

    if (error) {
      return this.setState({ loading: false });
    }

    await this.props.fetchUsers(this.props.accessToken);

    return this.setState({ loading: false, userToDeleteById: null, deleteModalVisible: false });
  }

  handleDeleteRequest(id) {
    this.setState({
      deleteModalVisible: true,
      userToDeleteById: id,
    });
  }

  handleUserDeleteModalCancel() {
    this.props.clearUsersError();
    this.setState({
      deleteModalVisible: false,
      userToDeleteById: null,
    });
  }

  renderDeleteConfirmModal() {
    const { deleteModalVisible } = this.state;
    return (
      <Modal
        visible={deleteModalVisible}
        title="Confirm Deletion of User"
        onOk={() => this.handleDeleteStartFlow()}
        onCancel={this.handleUserDeleteModalCancel}
        footer={[
          <Button
            key="cancel"
            onClick={this.handleUserDeleteModalCancel}
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
        <p>Are you sure you want to delete this user record?</p>
      </Modal>
    );
  }

  renderUserFormModal() {
    const { selectedUserEntity, userDataModalVisible } = this.state;
    const userFormProps = {
      onSubmit: this.handleUserFormSubmit,
      ref: this.setUserFormRef,
    };

    const confirmLabel = selectedUserEntity ? 'Save' : 'Create';
    const modalTitle = selectedUserEntity ? 'Update Existing User' : 'Create User';

    if (selectedUserEntity) {
      userFormProps.providedUserName = selectedUserEntity.username;
      userFormProps.providedPassword = selectedUserEntity.password;
      userFormProps.providedRole = selectedUserEntity.role;
    } else {
      userFormProps.providedUserName = '';
      userFormProps.providedPassword = '';
      userFormProps.providedRole = 0;
    }

    return (
      <Modal
        visible={userDataModalVisible}
        title={modalTitle}
        onOk={this.handleUserFormSubmit}
        onCancel={this.handleUserDataModalCancel}
        footer={[
          <Button
            key="cancel"
            onClick={this.handleUserDataModalCancel}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.state.loading}
            onClick={this.handleUserFormSubmit}
          >
            {confirmLabel}
          </Button>,
        ]}
      >
        { this.props.error && <Alert message={this.props.error} type="error" /> }
        <UserForm {...userFormProps} />
      </Modal>
    );
  }


  renderUserListWrapper() {
    const { users } = this.props;
    return (
      <UserList
        onEditReuqest={this.handleEditStartFlow}
        onDeleteRequest={this.handleDeleteRequest}
        users={users}
      />
    );
  }

  render() {
    return (
      <PageContent>
        <h2>Users</h2>
        {this.renderUserFormModal()}
        {this.renderDeleteConfirmModal()}
        <div className="user-list-toolbar">
          <Button type="primary" onClick={this.handleCreateFlowStart}>Create new user</Button>
        </div>
        <div className="user-list-wrapper">
          {this.renderUserListWrapper()}
        </div>
      </PageContent>
    );
  }
}

UsersPage.defaultProps = {
  users: [],
  error: '',
};

UsersPage.propTypes = {
  createUser: PropTypes.func.isRequired,
  fetchUsers: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  clearUsersError: PropTypes.func.isRequired,
  fetchMe: PropTypes.func.isRequired,
  error: PropTypes.string,
  users: PropTypes.arrayOf(PropTypes.object),
  accessToken: PropTypes.string.isRequired,
};

export default connect(
  state => ({ ...state.users, accessToken: state.auth.token }),
  dispatch => bindActionCreators({
    fetchUsers,
    updateUser,
    deleteUser,
    createUser,
    clearUsersError,
    fetchMe,
  }, dispatch),
)(UsersPage);
