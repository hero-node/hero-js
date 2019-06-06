import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import Modal from './components/Modal/Modal';
import NoticeRadio from './components/NoticeRadio/NoticeRadio';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: props.file,
      showPwd: false,
      pwd: '',
      noticeAddress: props.noticeAddress,
      amount: 0,
      checked: false,
      articleTitle: '',
    };

    this.onChange = content => {
      this.state.file.content = content;
      this.forceUpdate();
    };
  }

  componentDidMount() {
    let braftEditorCon = document.getElementsByClassName(
      'BraftEditor-content'
    )[0];
    braftEditorCon.style.height = '450px';
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ noticeAddress: nextProps.noticeAddress });
    nextProps.file.content &&
      this.editorInstance &&
      this.editorInstance.setContent(nextProps.file.content, 'html');
  }

  save = () => {
    alert('保存成功');
    console.log('111');
  };

  upload = () => {
    this.setState({ showPwd: false });
    const {
      pwd,
      file,
      summary,
      articleTitle,
      noticeAddress,
      checked,
      amount,
    } = this.state;
    this.props.upload &&
      this.props.upload(
        pwd,
        file.htmlContent,
        summary,
        articleTitle,
        noticeAddress,
        checked,
        amount
      );
  };

  handleHTMLChange = html => {
    this.state.file.htmlContent = html;
    console.log(html);
  };

  pwdChange = e => {
    this.setState({ pwd: e.currentTarget.value.trim() });
  };

  summaryChange = e => {
    this.setState({ summary: e.currentTarget.value.trim() });
  };

  articleTitleChange = e => {
    this.setState({ articleTitle: e.currentTarget.value.trim() });
  };

  hideEditor = () => {
    this.props.close && this.props.close();
  };

  noticeAddressChange = e => {
    this.setState({ noticeAddress: e.currentTarget.value.trim() });
  };

  amountChange = e => {
    this.setState({ amount: e.currentTarget.value.trim() });
  };

  check = () => {
    this.setState({ checked: !this.state.checked });
  };

  render() {
    const {
      pwd,
      showPwd,
      showSummary,
      summary,
      articleTitle,
      noticeAddress,
      checked,
      amount,
    } = this.state;

    const extendControls = [
      {
        type: 'split',
      },
      {
        type: 'button',
        className: 'preview-button',
        text: <span>预览</span>,
        onClick: this.preview,
      },
    ];

    const editorProps = {
      height: 600,
      placeholder: '想说点啥...',
      contentFormat: 'html',
      initialContent: this.state.file && this.state.file.content,
      onChange: this.onChange,
      onHTMLChange: this.handleHTMLChange,
      onSave: this.save,
      media: {
        uploadFn: this.props.uploadImg,
        onInsert: this.props.onInsert,
      },
    };

    return (
      <div className="pop-up-mask show">
        <div className="editor-wrap">
          <div className="close-editor" onClick={this.hideEditor} />
          <div className="">
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                className="lg-input editor-input"
                placeholder="请输入标题"
                value={articleTitle}
                onChange={this.articleTitleChange}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                className="lg-input editor-input"
                placeholder="请输入摘要"
                onChange={this.summaryChange}
              />
            </div>
          </div>
          <BraftEditor
            {...editorProps}
            ref={instance => (this.editorInstance = instance)}
          />
          <div className="editor-op">
            <div style={{ float: 'left', marginRight: '20px' }}>
              <NoticeRadio
                address={noticeAddress}
                checked={checked}
                check={this.check}
                addressChange={this.noticeAddressChange}
                amountChange={this.amountChange}
              />
            </div>
            <div
              className="btn publish"
              onClick={() => {
                this.setState({ showPwd: true });
              }}
            >
              发布
            </div>
            <div className={showPwd ? 'confirm' : 'confirm hide'}>
              <input
                type="password"
                className="lg-input editor-input"
                placeholder="请输入密码"
                value={pwd}
                onChange={this.pwdChange}
              />
              <div className="confirm-op">
                <div
                  className="btn btn-cancel"
                  onClick={() => {
                    this.setState({ showPwd: false, pwd: '' });
                  }}
                >
                  取消
                </div>
                <div className="btn" onClick={this.upload}>
                  确定
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MyEditor.propTypes = {
  file: PropTypes.object,
  uploadImg: PropTypes.func,
  save: PropTypes.func,
  noticeAddress: PropTypes.string,
  upload: PropTypes.func,
};

export default MyEditor;
