import React, { Component } from 'react';
import PropTypes from 'prop-types';

const TimezoneListItem = (props) => {
  const { name, city, offset, _id, onEdit, onDelete } = props;
  return (
    <div className="timezone-list-item" data-timezone-id={_id}>
      {name} - {city} - {offset}
      <div>
        <span data-timezone-id={_id} onClick={onEdit}>Edit</span> | <span data-timezone-id={_id} onClick={onDelete}>Delete</span>
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
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.renderTimezone = this.renderTimezone.bind(this);
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

  renderTimezone(timezone) {
    return (
      <TimezoneListItem {...timezone} onEdit={this.handleEdit} onDelete={this.handleDelete} />
    );
  }

  render() {
    const { timezones } = this.props;

    return (
      <div className="timezone-list">
        {timezones.map(this.renderTimezone)}
      </div>
    );
  }
}

TimezoneList.propTypes = {
  timezones: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEditReuqest: PropTypes.func.isRequired,
  onDeleteRequest: PropTypes.func.isRequired,
};
