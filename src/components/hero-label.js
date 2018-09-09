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
            this.$.span.style.fontSize = json.size + 'px';
        };
        if (json.alignment) {
            this.$.span.style.textAlign = json.alignment;
        };
        if (json.textColor) {
            this.$.span.style.color = '#'+json.textColor;
        };
        if (json.weight) {
            this.$.span.style.fontWeight = json.weight;
        };
        
      }

    template(json){
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
