import React, { PropTypes } from 'react';
import Modal from '../Modal/Modal';
import MyEditor from '../../Editor';

class NewBlog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { visible, editorProps } = this.props;
    return (
      <Modal
        visible={visible}
        confirm={this.createArticle}
        cancel={this.hideArticle}
      >
        <div style={{ width: '350px' }}>
          <MyEditor {...editorProps} />
        </div>
      </Modal>
    );
  }
}

export default NewBlog;
