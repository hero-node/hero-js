import HeroElement from './hero-element';

export default class HeroToolbarItem extends HeroElement {
  init() {
    this.$ = {
      button: this.shadowDom.querySelector('#btn'),
      div: this.shadowDom.querySelector('#wpr'),
      icon: this.shadowDom.querySelector('img'),
      span: this.shadowDom.querySelector('#wpr span'),
    };
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
        width: 100%;
        height: 100%;
      }
      #btn{
        display: inline-block;
        position: absolute;
        overflow: hidden;
        left:0px;
        top:0px;
        height:100%;
        width:100%;
      }
      #span{
        display: block;
        overflow: hidden;
        position:absolute;
        text-align: center;
        width:100%;
        height:100%;
        line-height:100%;
        pointer-events:none;
      }
      img{
        display: none;
        position:absolute;
        overflow: hidden;
        left:30%;
        width:40%;
        top:10%;
        height:40%;
        pointer-events:none;
      }
      #wpr.selected #btn{
        background: rgba(0, 0, 0, 0.08);
      }
      #wpr.selected #span{
        color: #00BC8D;
      }
      </style>
      <div id="wpr">
        <img id="icon" />
        <span id="span"></span>
        <div id="btn"></div>
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
    if (this.selected) {
      this.$.div.classList.add('selected');
    } else {
      this.$.div.classList.remove('selected');
    }
  }
  on(json) {
    if (json.title) {
      this.$.span.innerHTML = json.title;
    }
    if (json.image) {
      this.$.icon.style.display = 'block';
      this.$.icon.src = json.image;
      this.$.span.style.top = '50%';
      this.$.span.style.height = '50%';
    }
    var that = this;
    setTimeout(function(){
      if (json.image) {
        that.$.span.style.lineHeight = that.$.span.getBoundingClientRect().height+'px';
      }else{
        that.$.span.style.lineHeight = that.$.span.getBoundingClientRect().height+'px';
      }
    },100);
    this.selected = this._json.selected;
    this.addSelectedClz();
  }
}
