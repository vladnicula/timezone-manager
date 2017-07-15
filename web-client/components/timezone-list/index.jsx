import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';

import { EditIcon, DeleteIcon } from '../icons';
import { getDataValueByKey } from '../../utils/dom-props';


if (process.env.BROWSER) {
  require('./index.scss');
}

const formatOffset = offset => (
  offset >= 0 ? `+${offset}` : `${offset}`
);

const TimezoneListItem = (props) => {
  const { name, city, offset, _id, onEdit, onDelete } = props;
  return (
    <div className="timezone-list-item" data-timezone-id={_id}>
      <div className="timezone-list-item-title">
        <div className="timezone-list-item-heading">
          {name} - GMT{formatOffset(offset)}
        </div>
        <div className="timezone-list-item-meta">
          {city} - {moment().utcOffset(offset * 60).format('ddd HH:mm')}
        </div>
      </div>

      <div className="timezone-list-item-controls">
        <span
          tabIndex={0}
          role="menuitem"
          data-timezone-id={_id}
          onClick={onEdit}
        >
          <EditIcon size={18} />
        </span>
        <span
          tabIndex={0}
          role="menuitem"
          data-timezone-id={_id}
          onClick={onDelete}
        >
          <DeleteIcon size={18} />
        </span>
      </div>
    </div>
  );
};


TimezoneListItem.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  offset: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default class TimezoneList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timezones: [...props.timezones],
    };

    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.renderTimezone = this.renderTimezone.bind(this);
  }

  componentDidMount() {
    this.updateTo = setTimeout(() => {
      this.refreshTimezoneListTimes();
    }, this.props.updateInterval);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      timezones: [...nextProps.timezones],
    });
  }

  componentWillUnMount() {
    clearTimeout(this.updateTo);
  }

  handleEdit(ev) {
    const targetId = getDataValueByKey(ev.target, 'timezoneId');
    if (targetId) {
      this.props.onEditReuqest(targetId);
    }
  }

  handleDelete(ev) {
    const targetId = getDataValueByKey(ev.target, 'timezoneId');
    if (targetId) {
      this.props.onDeleteRequest(targetId);
    }
  }

  refreshTimezoneListTimes() {
    this.setState({
      timezones: [...this.state.timezones],
    });
  }

  renderTimezone(timezone) {
    return (
      <TimezoneListItem
        key={timezone._id}
        {...timezone}
        onEdit={this.handleEdit}
        onDelete={this.handleDelete}
      />
    );
  }

  render() {
    const { timezones } = this.state;

    return (
      <div className="timezone-list">
        {timezones.map(this.renderTimezone)}
        {timezones.length === 0 && <p>No timezone records for this user</p>}
      </div>
    );
  }
}

TimezoneList.defaultProps = {
  updateInterval: 30 * 1000,
};

TimezoneList.propTypes = {
  timezones: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEditReuqest: PropTypes.func.isRequired,
  onDeleteRequest: PropTypes.func.isRequired,
  updateInterval: PropTypes.number,
};
