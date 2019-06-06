import React, { PropTypes } from 'react';

class FileList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectId: '', reName: false };
  }

  selectFile = e => {
    let selectId = e.target.getAttribute('data-id');

    if (e.target.nodeName == 'LI') {
      e.stopPropagation();

      this.setState({ selectId, reName: false });
      this.props.selectFile && this.props.selectFile(selectId);
    }

    if (e.target.nodeName == 'I') {
      if (e.target.className.indexOf('file-del') > -1) {
        this.props.deleteFile && this.props.deleteFile(selectId);
      }
    }
  };

  reTitle = e => {
    let selectId = this.state.selectId;
    this.props.fileList.forEach((file, index) => {
      if (selectId == file.id) {
        file.title = e.currentTarget.value.trim();
      }
    });
    this.forceUpdate();
  };

  dbClick = e => {
    console.log(e.target);
    let selectId = e.target.getAttribute('data-id');
    if (e.target.nodeName == 'LI') {
      this.setState({ reName: true, selectId });
      // this.props.selectFile && this.props.selectFile(selectId);
    }
  };

  render() {
    const { fileList } = this.props;
    const { selectId, reName } = this.state;
    let fileItems =
      fileList &&
      fileList.map((file, index) => {
        return (
          <li
            key={file.id}
            data-id={file.id}
            className={
              (!selectId && index == 0) || selectId == file.id
                ? 'li-selected'
                : ''
            }
          >
            {reName && selectId == file.id ? (
              <input value={file.title} onChange={this.reTitle} />
            ) : (
              file.title
            )}
            {
              //<i data-id={file.id} className="file-del fa fa-trash-o fa-lg">删除</i>
            }
          </li>
        );
      });

    return (
      <div className="file-list">
        <ul onClick={this.selectFile} onDoubleClick={this.dbClick}>
          {fileItems}
        </ul>
      </div>
    );
  }
}

FileList.propTypes = {
  fileList: PropTypes.array,
  selectFile: PropTypes.func,
  deleteFile: PropTypes.func,
};

export default FileList;
