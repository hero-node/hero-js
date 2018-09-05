import HeroElement from './hero-element';

export default class HeroLabel extends HeroElement{

    init(json) {
        this.$ = {
            span: this.shadowDom.querySelector('span')
        }
    }

    on(json){

        if (json.text !== undefined) {
          this.updateContent(this.$.span, json.text);
        };
        if (json.size) {
          this.updateCSSRule('span', 'fontSize', json.size+'px');
        };
        if (json.alignment) {
          this.updateCSSRule('span', 'textAlign', json.alignment);
        };
        if (json.textColor) {
            this.updateCSSRule('span', 'color', json.textColor);
        };
        if (json.weight) {
            this.updateCSSRule('span', 'fontWeight', json.weight);
        };
        
      }

    template(json){
        return `
         <style>
            span{
                display: block;
                font-size: ${json.size}px;
                text-align: ${json.alignment};
                color: ${json.textColor};
                font-weight: ${json.weight};
            }
          </style>
          <span>${json.text}</span>
        `;
      }
}
