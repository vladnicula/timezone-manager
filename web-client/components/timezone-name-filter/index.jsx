import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Input, Button } from 'antd';

if (process.env.BROWSER) {
  require('./index.scss');
}

class TimezoneNameFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter: props.providedName,
    };
    this.setNameFilter = this.setNameFilter.bind(this);
    this.handleFilterApply = this.handleFilterApply.bind(this);
    this.handleFilterClear = this.handleFilterClear.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  setNameFilter(ev) {
    this.setState({ nameFilter: ev.target.value });
  }

  handleFilterApply() {
    this.props.onApplyFilter(this.state.nameFilter);
  }

  handleFilterClear() {
    this.setState({ nameFilter: '' }, () => {
      this.props.onApplyFilter(this.state.nameFilter);
    });
  }

  handleKeyDown(ev) {
    if (ev.which === 13) {
      this.handleFilterApply();
    }
  }

  render() {
    return (
      <div className="timezone-filter-by-name">
        <label htmlFor="name-filter">
          Filter by name:
          <Input
            id="name-filter"
            name="name-filter"
            value={this.state.nameFilter}
            onChange={this.setNameFilter}
            onKeyDown={this.handleKeyDown}
          />
        </label>
        <Button onClick={this.handleFilterApply}>Filter</Button>
        <Button onClick={this.handleFilterClear}>Clear</Button>
      </div>
    );
  }
}

TimezoneNameFilter.defaultProps = {
  providedName: '',
};

TimezoneNameFilter.propTypes = {
  providedName: PropTypes.string,
  onApplyFilter: PropTypes.func.isRequired,
};

export default TimezoneNameFilter;
