import React, { PropTypes } from 'react';
import './PreviewList.css';

class PreviewList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  gotoPreview = e => {
    let hash = e.currentTarget.getAttribute('data-hash');
    this.props.gotoPreview && this.props.gotoPreview(hash);
  };

  render() {
    let fileList = this.props.data;
    return (
      <div className="preview-wrap">
        <ul>
          {fileList.map((file, index) => {
            return (
              <li data-hash={file.hash} key={index} onClick={this.gotoPreview}>
                <p className="preview-author">作者: {this.props.author}</p>
                <p className="preview-title">{file.title}</p>
                <p className="preview-content">
                  {file.summary || '我很懒，没有摘要'}
                </p>
              </li>
            );
          })}
        </ul>
        {fileList.length == 0 && (
          <p className="preview-no-data">作者很懒, 还没有作品</p>
        )}
      </div>
    );
  }
}

PreviewList.propTypes = {
  fileList: PropTypes.array,
};

export default PreviewList;
