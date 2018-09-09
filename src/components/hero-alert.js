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

    this.$.button.addEventListener('touchstart', this.close.bind(this));
  }

  template(json) {
    return `
    <style type="text/css">
      .action {
        display: block !important;
        text-align: center;
        padding-left: 8px;
      }
      .wpr{
        position: absolute;
        top: 0px;
        width: 90%;
        top: 50%;
        transform: translateY(-50%);
        display: none;
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
      var that = this;
      setTimeout(function() {
        that.open();
      }, 50);
    }
  }

  open() {
    this.$.wpr.style.display = 'block';
  }

  close() {
    this.$.wpr.style.display = 'none';
  }
}
