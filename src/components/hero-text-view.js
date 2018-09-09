import HeroElement from './hero-element';

export default class HeroTextView extends HeroElement {
  init() {
    this.$ = {
      textarea: this.shadowDom.querySelector('textarea'),
    };

    this.$.textarea.addEventListener('change', this.textChange.bind(this));
  }

  template() {
    return `
    <style type="text/css">
      textarea{
        display: block;
        margin: 0px;
        padding: 0px;
        width: 100%;
        height: 100%;
        line-height: 1.4;
        vertical-align: center;
        border-color: #fff;
        background-color: transparent;
      }
      </style>
      <textarea id='text'></textarea>
    `;
  }

  on(json) {
    if (json.size) {
      this.$.textarea.style.fontSize = json.size + 'px';
    }
    if (json.alignment) {
      this.$.textarea.style.textAlign = json.alignment;
    }
    if (json.textColor) {
      this.$.textarea.style.color = '#' + json.textColor;
    }
    if (json.append) {
      this.text = (this.text || '') + '\n' + json.append;
      this.$.textarea.scrollTop =
        this.$.textarea.scrollHeight - this.$.textarea.clientHeight;
    }

    if (json.text) {
      this.$.textarea.value = json.text;
    }
  }

  textChange(text) {
    if (this._json.textFieldDidEditing) {
      this._json.textFieldDidEditing.value = text;
      this.controller.on(this._json.textFieldDidEditing);
    }
  }
}
