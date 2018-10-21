import HeroElement from './hero-element';

export default class HeroTextField extends HeroElement {
  init(json) {
    this.$ = {
      div: this.shadowDom.querySelector('div'),
      input: this.shadowDom.querySelector('input'),
    };

    this.$.input.addEventListener('change', this.textChange.bind(this));

    if (json.focus) {
      this.$.input.focus();
    }
    if (json.blur) {
      this.$.input.blur();
    }
  }

  on(json) {
    if (json.size) {
      this.$.div.style.fontSize = json.size + 'px';
    }

    if (json.textColor) {
      this.$.div.style.color = '#' + json.textColor;
    }
    if (json.clear) {
      json.text = '';
    }
    if (json.text) {
      this.$.input.value = json.text;
    }

    this.controller && this.controller.on(json.textFieldDidEditing);

    if (json.placeHolder) {
      this.updateAttr(this.$.input, 'placeHolder', json.placeHolder);
    }

    if (json.secure) {
      json.type = 'password';
    }

    if (json.type === 'pin') {
      json.type = 'tel';
    }

    if (!json.type) {
      json.type = 'text';
    }

    this.updateAttr(this.$.input, 'type', json.type);

    if (json.focus) {
      this.$.input.focus();
    }

    if (json.blur) {
      this.$.input.blur();
    }
  }

  textChange(e) {
    var text = e.target.value;
    if (this._json.textFieldDidEditing) {
      this._json.textFieldDidEditing.value = text;
      this._json.textFieldDidEditing.name = this._json.name;
      this.controller.on(this._json.textFieldDidEditing);
    }
  }

  template() {
    return `
         <style>
            input{
                font-size: 16px;
                padding:0px;
                margin:0px;
                width: 100%;
                position: absolute;
                height: 100%;
                border:none;
                outline:none;
                padding-left:15px;
                background-color:transparent;
            }
            div{
                position: relative;
                height: 100%;
            }
          </style>
          <div>
            <input />
          </div>
        `;
  }
}
