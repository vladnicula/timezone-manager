import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { fetchUsers, updateUser, deleteUser, createUser } from '../domain/users';

import PageContent from '../components/page-content';

import UserList from '../components/user-list';
import UserForm from '../components/user-form';

export class UsersPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedUserEntity: null,
    };

    this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
    this.handleEditStartFlow = this.handleEditStartFlow.bind(this);
    this.handleDeleteStartFlow = this.handleDeleteStartFlow.bind(this);
  }

  handleUserFormSubmit(newUserData) {
    const { selectedUserEntity } = this.state;
    if (selectedUserEntity) {
      this.props.updateUser(
        selectedUserEntity._id, { ...selectedUserEntity, ...newUserData },
      );
    } else {
      this.props.createUser(newUserData);
    }

    this.setState({
      selectedUserEntity: null,
    });
  }

  handleEditStartFlow(id) {
    this.setState({
      selectedUserEntity: this.props.users.find(user => user._id === id),
    });
  }

  handleDeleteStartFlow(id) {
    this.props.deleteUser(id);
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  handleUserFormSubmit(newUserData) {
    const { selectedUserEntity } = this.state;
    if (selectedUserEntity) {
      this.props.updateUser(
        selectedUserEntity._id, { ...selectedUserEntity, ...newUserData },
      );
    } else {
      this.props.createUser(newUserData);
    }

    this.setState({
      selectedUserEntity: null,
    });
  }

  renderUserForm() {
    const { selectedUserEntity } = this.state;
    const userFormProps = {
      onSubmit: this.handleUserFormSubmit,
    };

    if (selectedUserEntity) {
      userFormProps.providedUserName = selectedUserEntity.username;
      userFormProps.providedPassword = selectedUserEntity.password;
      userFormProps.providedRole = selectedUserEntity.role;
    } else {
      userFormProps.providedUserName = '';
      userFormProps.providedPassword = '';
      userFormProps.providedRole = 0;
    }

    return (<UserForm {...userFormProps} />);
  }


  renderUserListWrapper() {
    const { users } = this.props;
    return (
      <UserList
        onEditReuqest={this.handleEditStartFlow}
        onDeleteRequest={this.handleDeleteStartFlow}
        users={users}
      />
    );
  }

  render() {
    const { props } = this;
    return (<PageContent>
      <h2>Users</h2>
      <div className="user-form-wrapper">
        {this.renderUserForm()}
      </div>
      <div className="user-list-wrapper">
        {this.renderUserListWrapper()}
      </div>
    </PageContent>);
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
