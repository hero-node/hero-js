import React, { PropTypes } from 'react';
import styled, { keyframes } from 'styled-components';

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const LoadWrapper = styled.div`
  position: absolute;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border-left: 4px solid rgba(119, 174, 252, 0.4);
  border-right: 4px solid rgba(119, 174, 252, 0.4);
  border-bottom: 4px solid rgba(119, 174, 252, 0.4);
  border-top: 4px solid #77aefc;
  animation: ${rotate360} 0.8s linear infinite;
  top: 1px;
  right: -36px;
`;

class LoadingRotate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <LoadWrapper />;
  }
}

export default LoadingRotate;
