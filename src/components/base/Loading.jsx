import { Spin, message } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

const Loading = ({ loading, error }) => (
  <div>
    {loading && <Spin />}
    {error && message.error(':( Please try again')}
  </div>
);

Loading.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.bool,
};

Loading.defaultProps = {
  error: false,
  loading: false,
};

export default Loading;
