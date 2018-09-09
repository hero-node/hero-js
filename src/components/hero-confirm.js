import HeroElement from './hero-element';

export default class HeroConfirm extends HeroElement {

  constructor(){
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
        wpr: this.shadowDom.querySelector('.wpr')
      }

      this.$.confirm.addEventListener('touchstart', this.tapOk.bind(this));
      this.$.cancel.addEventListener('touchstart', this.tapCancel.bind(this));
  }

  template(json) {
    return `
      <style type="text/css">

      .buttons {
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
        <p>${json.text}</p>
        <div class="buttons">
          <button id="confirm">${this.btOk}</button>
          <button id="cancel">${this.btCancel}</button>
        </div>
      </div>
    `;
  }

  on(json){
    if(json.text){
      this.updateContent(this.$.text, json.text);
      var that=this;
      setTimeout(function(){
        that.open();
      },50);
    }

  }
  open() {
    this.$.wpr.style.display = 'block';
    
  }
  close() {
    this.$.wpr.style.display = 'none';
  }
  tapOk() {
    this.close();
    this.controller.on(this._json.action);
  }
  tapCancel(){
    this.close();
    this.controller.on(this._json.cancelAction);
  }

}
