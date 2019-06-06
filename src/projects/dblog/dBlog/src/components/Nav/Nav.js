import React, { PropTypes } from 'react';
import FileList from './FileList';
import './Nav.css';

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <nav className="nav">
        <FileList {...this.props} />
      </nav>
    );
  }
}

Nav.propTypes = {
  fileList: PropTypes.array,
  selectFile: PropTypes.func,
  deleteFile: PropTypes.func,
};

export default Nav;
