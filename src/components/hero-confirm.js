import HeroElement from './hero-element';

export default class HeroConfirm extends HeroElement {
  constructor() {
    super();

    var btOk = '确定',
      btCancel = '取消';
    var ul = navigator.language.toLowerCase();
    if (ul === 'en-us') {
      btOk = 'ok';
      btCancel = 'Cancel';
    }
    this.btOk = btOk;
    this.btCancel = btCancel;
  }
  init() {
    this.$ = {
      confirm: this.shadowDom.querySelector('#confirm'),
      cancel: this.shadowDom.querySelector('#cancel'),
      text: this.shadowDom.querySelector('p'),
      wpr: this.shadowDom.querySelector('.wpr'),
    };

    var tapOKCallback = this.tapOk.bind(this);
    var tapCancelCallback = this.tapCancel.bind(this);

    this.$.confirm.addEventListener('touchstart', tapOKCallback);
    this.$.confirm.addEventListener('click', tapOKCallback);

    this.$.cancel.addEventListener('touchstart', tapCancelCallback);
    this.$.cancel.addEventListener('click', tapCancelCallback);
  }

  template(json) {
    let that = this;
    return `
      <style type="text/css">

      .buttons {
        position:absolute;
        width:100%;
        left:0;
        bottom:10px;
        display: block !important;
        text-align: center;
      }
      #confirm{
          background:#80CB5C;
          border-radius:8px;
          border:solid 1px #F1F8EB;
          color:#F1F8EB;
      }
      #cancel{
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
        max-height:200px;
        max-width:300px;
        min-width:150px;
        visibility:hidden;
        border-radius:12px;
        padding: 16px 24px;
        background:#F1F8EB;
        opacity:0;
        transform:scale(0.8,0.8);
        transition: all 0.5s cubic-bezier(.25,.1,.3,1.5);
      }
      p{
        color:#80CB5C
        text-align:center;
      }
      </style>
      <div class="wpr">
        <p>${json.text}</p>
        <div class="buttons">
          <button id="confirm">${this.btOk}</button>
          <button id="cancel">${this.btCancel}</button>
        </div>
      </div>
    `;
  }

  on(json) {
    if (json.text) {
      this.updateContent(this.$.text, json.text);
      this.updateContent(this.$.confirm, this.btOk);
      this.updateContent(this.$.cancel, this.btCancel);
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
  tapOk() {
    this.close();
    this.controller.on(this._json.action);
  }
  tapCancel() {
    this.close();
    this.controller.on(this._json.cancelAction);
  }
}
