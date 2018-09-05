import HeroElement from './hero-element';

export default class HeroButton extends HeroElement{

  init(json) {
      // super.init(json); // always call super() first in the constructor.
      this.$ = {
        button: this.shadowDom.querySelector('button')
      }
      
      this.$.button.addEventListener('click', this.onClick.bind(this));
  }
  
  // attributeChangedCallback(name, oldValue, newValue){
  //   this.init(JSON.parse(newValue));
  // }
  
  on(json) {
      if(json.title){
        this.updateContent(this.$.button, json.title);
      }
      if(json.disabled){
        this.updateAttr(this.$.button, 'disabled', json.disabled);
      }
      if(json.size){
        this.updateCSSRule('button', 'fontSize', json.size+'px');
      }
      if(json.titleColor){
        this.updateCSSRule('button', 'color', json.titleColor);
      }
      if(json.backgroundColor){
        this.updateCSSRule('button', 'background', json.backgroundColor);
      }

      if(json.titleDisabledColor){
        this.updateCSSRule('button[disabled]', 'color', json.titleDisabledColor);
      }
      if(json.backgroundDisabledColor){
        this.updateCSSRule('button[disabled]', 'background', json.backgroundDisabledColor);
      }
      if(json.cornerRadius){
        this.updateCSSRule('button', 'borderRadius', json.cornerRadius);
      }
    }

    onClick (){
      this.controller.on(this._json.click);
    }

    template(json){
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
