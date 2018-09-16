import HeroElement from './hero-element';

export default class HeroButton extends HeroElement {
  init() {
    this.$ = {
      button: this.shadowDom.querySelector('button'),
    };

    this.$.button.addEventListener('tap', this.onClick.bind(this));
    this.$.button.addEventListener('click', this.onClick.bind(this));
  }

  on(json) {
    if (json.title) {
      this.updateContent(this.$.button, json.title);
    }
    if (json.disabled) {
      this.updateAttr(this.$.button, 'disabled', json.disabled);
      if (json.titleDisabledColor) {
        this.$.button.style.color = '#' + json.titleDisabledColor;
      }
      if (json.backgroundDisabledColor) {
        this.$.button.style.background = '#' + json.backgroundDisabledColor;
      }
    } else {
      if (json.titleColor) {
        this.$.button.style.color = '#' + json.titleColor;
      }
      if (json.backgroundColor) {
        this.$.button.style.background = '#' + json.backgroundColor;
      }
    }
    if (json.size) {
      this.$.button.style.fontSize = json.size + 'px';
    }

    if (json.cornerRadius) {
      this.$.button.style.borderRadius = json.cornerRadius + 'px';
    }
  }

  onClick() {
    this.controller.on(this._json.click);
  }

  template(json) {
    return `
       <style>
          button {
            font-size: ${json.size}px;
            color: ${json.titleColor};
            background: ${json.backgroundColor};
            border-radius: ${json.cornerRadius}+'px';
            background: transparent;
            border: 0;
            height: 100%;
            width: 100%;
            color: #FFF;
            outline: 0;
          }
          button[disabled]{
            color: ${json.titleDisabledColor};
            background: ${json.backgroundDisabledColor};
          }
          div {
            text-align: center;
            height: 100%;
          }
        </style>
        <div>
          <button></button>
        </div>
      `;
  }
}
