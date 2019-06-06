import React, { PropTypes } from 'react';
import './Loading.css';

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const loadingClass = this.props.isShow
      ? 'loading-wrap'
      : 'loading-wrap hide';
    return (
      <div className={loadingClass}>
        <div className="spinner">
          <div className="m-cycle" />
          <div className="m-intro">加载数据...</div>
        </div>
      </div>
    );
  }
}

Loading.propTypes = {
  isShow: PropTypes.bool,
};

export default Loading;
