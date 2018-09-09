import HeroElement from './hero-element';

export default class HeroChatMsgView extends HeroElement {
  init() {
    this.$ = {
      p: this.shadowDom.querySelector('p'),
    };
  }

  template(json) {
    return `
      <style>
        div{
          position: relative;
          display: block;
          padding: 5px;
        }
        p{
          font-size: 14px;
          padding: 0px;
          margin: 0px;
          color: #666;
        }
      </style>
      <p id='text'>${json.text}</p>
    `;
  }

  on(json) {
    if (json.text) {
      this.updateContent(this.$.p, json.text);
    }
  }
}
