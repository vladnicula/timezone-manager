import React from 'react';
import PropTypes from 'prop-types';

import { Select } from 'antd';


const Option = Select.Option;

const TimezoneUserFilter = (props) => {
  const { users, onUserIdChanged, selectedUserId } = props;
  return (
    <div className="timezone-listing-user-filter">
      <label htmlFor="user-target">Viewing timezones of user:</label>

      <Select
        id="user-target"
        name="user-target"
        onChange={onUserIdChanged}
        value={selectedUserId}
        style={{ width: '100%' }}
      >
        {users.map(user => <Option key={user._id} value={user._id}>{user.username}</Option>)}
      </Select>
    </div>
  );
};


TimezoneUserFilter.defaultProps = {
  users: [],
  selectedUserId: '',
};

TimezoneUserFilter.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  })),
  selectedUserId: PropTypes.string,
  onUserIdChanged: PropTypes.func.isRequired,
};

export default TimezoneUserFilter;
