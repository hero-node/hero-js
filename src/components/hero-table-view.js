import HeroElement from './hero-element';
import './hero-table-view-section';
import './hero-table-view-cell';

export default class HeroTableView extends HeroElement {
  init() {
    this.$ = {
      header: this.shadowDom.querySelector('#header'),
      footer: this.shadowDom.querySelector('#footer'),
      heroContent: this.shadowDom.querySelector('#heroContent'),
      tableData: this.shadowDom.querySelector('#table-data'),
    };
  }

  template() {
    return `
    <style type="text/css">
      #heroContent{
        display: inline-block;
        position: absolute;
        overflow: auto;
        padding: 0px;
        background-color: #fff;
      }
      #footer{
        margin-top: 5px;
        margin-bottom: 15px;
      }
      </style>
      <div id = 'header'></div>
      <div id="table-data">
        <hero-table-view-section></hero-table-view-section>
      </div>
      <div id = 'footer'></div>

    `;
  }

  on(json) {
    var viewObject, view;

    if (json.header) {
      this.$.header.innerHTML = '';
      viewObject = json.header;
      view = document.createElement(
        window.APP.camelCase2bar(viewObject.class || viewObject.res)
      );
      this.$.header.appendChild(view);
      view.controller = this.controller;
      if (viewObject.frame) {
        viewObject.frame.p = {
          w: parseInt(this.$.heroContent.style.width),
          h: parseInt(this.$.heroContent.style.height),
        };
      }
      view.in(viewObject);
      view.$.heroContent.style.position = 'relative';
    }
    if (json.data) {
      this.$.tableData.innerHTML =
        json.data &&
        json.data
          .map(function(ele) {
            return `
          <hero-table-view-section json='${JSON.stringify(
            ele
          )}'></hero-table-view-section>
        `;
          })
          .join('');
    }
    if (json.footer) {
      this.$.footer.innerHTML = '';
      viewObject = json.footer;
      view = document.createElement(
        window.APP.camelCase2bar(viewObject.class || viewObject.res)
      );
      this.$.footer.appendChild(view);
      view.controller = this.controller;
      if (viewObject.frame) {
        viewObject.frame.p = {
          w: parseInt(this.$.heroContent.style.width),
          h: parseInt(this.$.heroContent.style.height),
        };
      }
      view.in(viewObject);
      view.$.heroContent.style.position = 'relative';
    }
    var that = this;
    // this.async(function(){
    for (var i = 0; i < that.$.heroContent.children.length; i++) {
      that.$.heroContent.children[i].controller = that.controller;
    }
    // },100);
  }
}
