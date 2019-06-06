import React, { PropTypes } from 'react';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ visible: nextProps.visible });
  }

  cancel = () => {
    this.setState({ visible: false });
    this.props.cancel && this.props.cancel();
  };

  confirm = () => {
    this.setState({ visible: false });
    this.props.confirm && this.props.confirm();
  };

  render() {
    const { visible } = this.state;
    const { create, save, upload } = this.props;
    return (
      <div className={visible ? 'pop-up-mask show' : 'pop-up-mask'}>
        <div className="pop-up">
          <div className="pop-up-bd">{this.props.children}</div>
          <div className="pop-up-op">
            <div className="op-col">
              <button
                type="submit"
                className="btn btn-cancel"
                onClick={this.cancel}
              >
                取消
              </button>
            </div>
            <div className="op-col">
              <button type="submit" className="btn" onClick={this.confirm}>
                确定
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  create: PropTypes.func,
  save: PropTypes.func,
  confirm: PropTypes.func,
};

export default Modal;
