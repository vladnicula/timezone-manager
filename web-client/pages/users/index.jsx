import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Modal, Button } from 'antd';

import { fetchUsers, updateUser, deleteUser, createUser } from '../../domain/users';

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
    this.handleUserDdataModalCancel = this.handleUserDdataModalCancel.bind(this);
    this.handleUserDeleteModalCancel = this.handleUserDeleteModalCancel.bind(this);
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  setRef(key, el) {
    if (el) {
      this[key] = el;
    }
  }

  handleCreateFlowStart() {
    this.setState({
      userDataModalVisible: true,
    });
  }

  handleUserDdataModalCancel() {
    this.setState({
      userDataModalVisible: false,
    });
  }

  handleUserFormSubmit() {
    const { selectedUserEntity } = this.state;
    const newUserData = this.userForm.getFormData();

    this.setState({
      loading: true,
    });

    if (selectedUserEntity) {
      this.props.updateUser(
      selectedUserEntity._id, { ...selectedUserEntity, ...newUserData },
    );
    } else {
      this.props.createUser(newUserData);
    }

    this.setState({
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
    this.setState({
      selectedUserEntity: this.props.users.find(user => user._id === id),
      userDataModalVisible: true,
    });
  }

  async handleDeleteStartFlow() {
    this.setState({ loading: true });
    const { userToDeleteById } = this.state;
    try {
      await this.props.deleteUser(userToDeleteById);
    } catch (err) {
      console.log(`User deletion failed for id ${userToDeleteById}`);
      console.error(err);
    }
  }

  handleDeleteRequest(id) {
    this.setState({
      deleteModalVisible: true,
      userToDeleteById: id,
    });
  }

  handleUserDeleteModalCancel() {
    this.setState({
      deleteModalVisible: false,
    });
  }

  renderDeleteConfirmModal() {
    const { deleteModalVisible } = this.state;
    return (
      <Modal
        visible={deleteModalVisible}
        title="Confirm Deleteion of User"
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
        <p>Are you sure you want to delete this timezone record?</p>
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
        onCancel={this.handleUserDdataModalCancel}
        footer={[
          <Button
            key="cancel"
            onClick={this.handleUserDdataModalCancel}
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
};

UsersPage.propTypes = {
  createUser: PropTypes.func.isRequired,
  fetchUsers: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.object),
};

export default connect(
  state => state.users,
  dispatch => bindActionCreators({
    fetchUsers, updateUser, deleteUser, createUser,
  }, dispatch),
)(UsersPage);
