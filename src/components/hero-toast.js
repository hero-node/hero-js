import HeroElement from './hero-element';

export default class HeroToast extends HeroElement {
  init() {
    this.$ = {
      p: this.shadowDom.querySelector('p'),
      div: this.shadowDom.querySelector('#wpr'),
    };
  }

  template() {
    return `
    <style type="text/css">
      #wpr {
        position: fixed;
        bottom: 0;
        background-color: #323232;
        color: #f1f1f1;
        min-height: 48px;
        min-width: 288px;
        padding: 16px 24px;
        box-sizing: border-box;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
        border-radius: 2px;
        margin: 12px;
        font-size: 14px;
        cursor: default;
        -webkit-transition: -webkit-transform 0.3s, opacity 0.3s;
        transition: transform 0.3s, opacity 0.3s;
        opacity: 1;
        font-family: 'Roboto', 'Noto', sans-serif;
        -webkit-font-smoothing: antialiased;
        z-index: 100;
      }
      .hidden{
        opacity: 0;
        display: none;
      }
      p{
        margin: 0;
      }
      </style>
      <div id="wpr" class="fit-bottom hidden"><p></p></dov>
    `;
  }

  on(json) {
    if (json.corrnerRadius) {
      this.$.div.style.borderRadius = json.corrnerRadius + 'px';
    }
    if (json.text && json.text.length > 0) {
      this.updateContent(this.$.p, json.text);
      this.$.div.classList.remove('hidden');

      var that = this;
      setTimeout(function() {
        that.$.div.classList.add('hidden');
      }, 2000);
    }
  }
}
