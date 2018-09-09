import HeroElement from './hero-element';

export default class HeroTextView extends HeroElement {

  init(json) {
    this.$ = {
      textarea: this.shadowDom.querySelector('textarea')
  }

  this.$.textarea.addEventListener('change', this.textChange.bind(this));
}

  template(json) {
    return `
    <style type="text/css">
      textarea{
        display: block;
        margin: 0px;
        padding: 0px;
        width: 100%;
        height: 100%;
        line-height: 140%;
        vertical-align: center;
        border-color: #fff;
        background-color: transparent;
        font-size: ${json.size}px;
        text-align: ${json.alignment};
        color: ${json.textColor};
      }
      </style>
      <textarea id='text' value="${json.text}"></textarea>
    `;
  }

  on(json) {

    if (json.append) {
      this.text = (this.text||'')+'\n'+json.append;
      this.$.textarea.scrollTop = this.$.textarea.scrollHeight - this.$.textarea.clientHeight;
    }; 

    if(json.text){
      this.$.textarea.value = json.text;
    }
  }

  textChange(text){
    if(this._json.textFieldDidEditing){
      this._json.textFieldDidEditing.value = text;
      this.controller.on(this._json.textFieldDidEditing);
    }
  }

}