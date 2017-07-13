import React, { Component } from 'react';
import PropTypes from 'prop-types';

const UserListItem = (props) => {
  const { _id, username, role, onEdit, onDelete } = props;
  return (
    <div className="timezone-list-item" data-timezone-id={_id}>
      {username} - {role}
      <div>
        <span data-timezone-id={_id} onClick={onEdit}>Edit</span> | <span data-timezone-id={_id} onClick={onDelete}>Delete</span>
      </div>
    </div>
  );
};

UserListItem.defaultProps = {
  role: 0,
  password: '',
};

UserListItem.propTypes = {
  _id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  role: PropTypes.number,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default class UserList extends Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.renderUser = this.renderUser.bind(this);
  }

  handleEdit(ev) {
    const targetId = ev.target.dataset.timezoneId;
    if (targetId) {
      this.props.onEditReuqest(targetId);
    }
  }

  handleDelete(ev) {
    const targetId = ev.target.dataset.timezoneId;
    if (targetId) {
      this.props.onDeleteRequest(targetId);
    }
  }

  renderUser(user) {
    return (
      <UserListItem key={user._id} {...user} onEdit={this.handleEdit} onDelete={this.handleDelete} />
    );
  }

  render() {
    const { users } = this.props;

    return (
      <div className="user-list">
        {users.map(this.renderUser)}
      </div>
    );
  }
}

UserList.PropTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEditReuqest: PropTypes.func.isRequired,
  onDeleteRequest: PropTypes.func.isRequired,
};
