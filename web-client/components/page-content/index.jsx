import React from 'react';
import PropTypes from 'prop-types';

if (process.env.BROWSER) {
  require('./index.scss');
}

const PageContent = props => (
  <div className={`page-content ${props.className}`}>
    {props.children}
  </div>
  )
;

PageContent.defaultProps = {
  children: null,
  className: '',
};

PageContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default PageContent;
