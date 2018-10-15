import HeroElement from './hero-element';

export default class HeroLabel extends HeroElement {
  init() {
    this.shadowDom.querySelector('#heroContent').style.pointerEvents='none';
    this.$ = {
      span: this.shadowDom.querySelector('span'),
    };
  }

  on(json) {
    if (json.text !== undefined) {
      this.updateContent(this.$.span, json.text);
    }
    if (!json.hasOwnProperty("numberOfLines") ) {
      this.$.span.style.lineHeight = this.$.heroContent.style.height;
    };
    if (json.size) {
      this.$.span.style.fontSize = json.size + 'px';
    }
    if (json.alignment) {
      this.$.span.style.textAlign = json.alignment;
    }
    if (json.textColor) {
      this.$.span.style.color = '#' + json.textColor;
    }
    if (json.weight) {
      this.$.span.style.fontWeight = json.weight;
    }
  }

  template() {
    return `
         <style>
            span{
              display: block;
            }
          </style>
          <span></span>
        `;
  }
}
