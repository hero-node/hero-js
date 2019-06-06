import React, { PropTypes } from 'react';
import LoadingRotate from './LoadingRotate';
import styled from 'styled-components';

const KLine = styled.div`
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 15px;
  background-color: #4079b9;
  margin-left: 10px;
`;

const Wrap = styled.div`
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #eee;
  .k-line {
    margin-left: 10px;
  }
  p {
    color: #999;
    padding: 20px;
  }
`;

const LDWrap = styled.div`
  border-radius: 5px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-left: -10px;
  margin-top: -35px;
`;

class Loading2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Wrap>
        {
          // <div className="load-3">
          //   <p>Load....</p>
          //   <div className="k-line k-line1-1"></div>
          //   <div className="k-line k-line1-2"></div>
          //   <div className="k-line k-line1-3"></div>
          // </div>
        }
        <LDWrap>
          <LoadingRotate />
        </LDWrap>
      </Wrap>
    );
  }
}

Loading2.propTypes = {
  isShow: PropTypes.bool,
};

export default Loading2;
