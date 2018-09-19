import HeroElement from './hero-element';

export default class HeroAlert extends HeroElement {
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
    };

    var callback = this.close.bind(this);
    this.$.button.addEventListener('touchstart', callback);
    this.$.button.addEventListener('click', callback);
  }

  template(json) {
    return `
    <style type="text/css">
      .action {
        display: block !important;
        text-align: center;
        padding-left: 8px;
        margin-top:10px;
      }
      button{
        background:#F99190;
        border-radius:8px;
        border:solid 1px #FEEFF0;
        color:#FEEFF0;
      }
      .wpr{
        position: fixed;
        box-sizing: border-box;
        top:0;
        bottom:0;
        left:0;
        right:0;
        margin:auto;
        width: 50%;
        height:100px;
        max-width:300px;
        min-width:150px;
        visibility:hidden;
        border-radius:12px;
        padding: 16px 24px;
        background:#FEEFF0;
        opacity:0;
        transform:scale(0.8,0.8);
        transition: all 0.5s;
      }
      p{
        text-align:center;
        color:#F99190;
      }
    </style>
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
    this.$.wpr.style.opacity = 1;
    this.$.wpr.style.visibility = 'visible';
  }

  close() {
    this.$.wpr.style.transform = 'scale(0.8,0.8)';
    this.$.wpr.style.opacity = 0;
    this.$.wpr.style.visibility = 'hidden';
  }
}
