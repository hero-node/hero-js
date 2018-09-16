import HeroElement from './hero-element';

export default class HeroToolbarItem extends HeroElement {
  init() {
    this.$ = {
      title: this.shadowDom.querySelector('#title'),
      button: this.shadowDom.querySelector('hero-button'),
      div: this.shadowDom.querySelector('#wpr'),
      icon: this.shadowDom.querySelector('img'),
      span: this.shadowDom.querySelector('#wpr span'),
    };
    this.$.button.setController(this.controller);

    var onTapCallback = this.onTap.bind(this);
    this.$.button.addEventListener('touchstart', onTapCallback);
    this.$.button.addEventListener('click', onTapCallback);
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
        text-align: center;
      }
      #title.hasIcon{
        top:30px;
        left:0px;
        font-size: 11px;
        width: 100%;
        line-height: 14px;
      }
      img{
        display: inline-block;
        overflow: hidden;
        text-align: center;
        width: 22px;
        height: 22px;
      }
      #wpr.selected hero-button{
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
        <img id="icon" />
        <span id="span"></span>
        <hero-button id="title"></hero-button>
      </div>
    `;
  }

  onTap() {
    this.selected = !this.selected;
    this.addSelectedClz();
    if (this._json.click) {
      this.controller.on(this._json.click);
    }
  }
  addSelectedClz() {
    if (!this.selected) {
      this.$.div.classList.add('selected');
    } else {
      this.$.div.classList.remove('selected');
    }
  }
  on(json) {
    if (json.title) {
      this.$.title.in({
        title: json.title,
        click: {
          command: 'load:' + json.url,
        },
      });
      // this.updateContent(this.$.title, json.title);
    }
    if (json.image) {
      this.$.image.src = json.image;
      this.$.title.classList.add('hasIcon');
    } else {
      this.$.span && this.$.span.remove();
      this.$.icon && this.$.icon.remove();
    }
    this.selected = this._json.selected;
    this.addSelectedClz();
  }
}
