import HeroElement from './hero-element';

export default class HeroDialog extends HeroElement {
  constructor() {
    super();
    var btOk = '确定';
    var ul = navigator.language.toLowerCase();
    if (ul === 'en-us') {
      btOk = 'ok';
    }
    this.btOk = btOk;
  }
  init() {
    this.$ = {
      button: this.shadowDom.querySelector('button'),
      p: this.shadowDom.querySelector('p'),
      wpr: this.shadowDom.querySelector('.wpr'),
      mask: this.shadowDom.querySelector('.mask'),
    };

    var callback = this.close.bind(this);
    this.$.button.addEventListener('touchstart', callback);
    this.$.button.addEventListener('click', callback);
  }

  template(json) {
    return `
    <style type="text/css">
      .mask{
        opacity:0;
        position: fixed;
        height:100%;
        width:100%;
        background:transparent;
        transition:all 0.6s;
        visibility:hidden;
      }
      .wpr{
        opacity:0;
        position: fixed;
        box-sizing: border-box;
        top:0;
        bottom:0;
        left:0;
        right:0;
        margin:auto;
        height: 300px;
        width: 50%;
        min-width:300px;
        visibility:hidden;
        border-radius:12px;
        padding: 16px 24px;
        border:1px solid rgb(57, 52, 54);
        background:white;
        transform:scale(0.8,0.8);
        transition:all 0.5s cubic-bezier(.25,.1,.3,1.5);
      }
      button{
        position:absolute;
        background:#80CB5C;
        border-radius:8px;
        border:solid 1px #F1F8EB;
        color:#F1F8EB;
        right:15px;
        bottom:10px;
      }
      p{
        text-align:center;
      }
    </style>
    <div class="mask"></div>
    <div class="wpr">
      <p id='text'>${json.text}</p>
      <div class="action">
        <button>${this.btOk}</button>
      </div>
    </div>

    `;
  }
  on(json) {
    if (json.text) {
      this.updateContent(this.$.p, json.text);
      this.updateContent(this.$.button, this.btOk);
      var that = this;
      setTimeout(function() {
        that.open();
      }, 50);
    }
  }

  open() {
    this.$.wpr.style.transform = 'scale(1,1)';
    this.$.wpr.style.visibility = 'visible';
    this.$.mask.style.visibility = 'visible';
    this.$.mask.style.background = 'rgba(12, 13, 12, 0.64)';
    this.$.mask.style.opacity = 1;
    this.$.wpr.style.opacity = 1;
  }

  close() {
    this.$.wpr.style.transform = 'scale(0.8,0.8)';
    this.$.wpr.style.visibility = 'hidden';
    this.$.mask.style.visibility = 'hidden';
    this.$.mask.style.background = 'transparent';
    this.$.mask.style.opacity = 0;
    this.$.wpr.style.opacity = 0;
  }
}
