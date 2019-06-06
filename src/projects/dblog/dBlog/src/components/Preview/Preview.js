import React, { PropTypes } from 'react';
import styled, { keyframes } from 'styled-components';
import Loading2 from '../Loading/Loading2';
import { get, postFormData, apiHost } from '../../utils/ajax';

const Header = styled.div`
  background: #ffffff;
  height: 50px;
  border: 1px solid #e4e4e4;
`;

class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      blog: {},
    };
  }

  componentDidMount() {
    document.getElementById('ld').style.display = 'none';
    let hash = this.props.match.params.id;
    this.getData(hash);
  }

  getData = hash => {
    get(apiHost + '/api/ipfs/cat', { path: hash }).then(res => {
      console.log(res);
      if (!res.content) return;
      this.setState({ blog: JSON.parse(res.content), loading: false });
    });
  };

  buildContent(state) {
    const blog = this.findBlog(state.data && state.data.blogs, state.id) || {};
    return `<h1>${blog.title}</h1><p></p>${blog.content}`;
  }

  render() {
    const { loading, blog } = this.state;
    return (
      <div className="wrap">
        <Header>
          <div className="person-hd-logo" onClick={this.gotoLogin}>
            <div className="person-hd-logo-ico" />
          </div>
        </Header>
        <div
          className="preview-wrap"
          dangerouslySetInnerHTML={{
            __html: `<h1>${blog.title || ''}</h1><p></p>${blog.content || ''}`,
          }}
        />
        {loading && <Loading2 />}
      </div>
    );
  }
}

export default Preview;
