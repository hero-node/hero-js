import HeroElement from './hero-element';

export default class HeroToolbarItem extends HeroElement {
  init() {
    this.$ = {
      title: this.shadowDom.querySelector('#title'),
      button: this.shadowDom.querySelector('hero-button'),
      div: this.shadowDom.querySelector('#wpr'),
      img: this.shadowDom.querySelector('img'),
    };
  }

  template() {
    return `
    <style type="text/css">
      #wpr{
        display: inline-block;
        position: absolute;
        overflow: hidden;
        text-align:center;
        padding-top:4px;
        width: 100%;
        height: 44px;
      }
      #title{
        display: inline-block;
        position: absolute;
        overflow: hidden;
        color: #999999;
        top:30px;
        left:0px;
        height:14px;
        font-size: 11px;
        width: 100%;
        line-height: 14px;
        text-align: center;
      }
      img{
        display: inline-block;
        overflow: hidden;
        text-align: center;
        width: 22px;
        height: 22px;
      }
      .overlay {
        background: rgba(0, 0, 0, 0.08);
      }

      hero-button{
        display: inline-block;
        position: absolute;
        overflow: hidden;
        width: 100%;
        height: 100%;
        left:0px;
        top:0px;
      }
      #title{
        color: #999;
      }
      #wpr.selected #title{
        color: #00BC8D;
      }
      </style>
      <div id="wpr">
        <img />
        <span id="title"></span>
        <hero-button></hero-button>
      </div>
    `;
  }

  on(json) {
    if (json.title) {
      this.updateContent(this.$.title, json.title);
    }
    if (json.image) {
      this.$.image.src = json.image;
    }

    if (json.selected) {
      this.$.div.classList.add('selected');
    } else {
      this.$.div.classList.remove('selected');
    }
  }
}
