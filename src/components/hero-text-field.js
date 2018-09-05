import HeroElement from './hero-element';

export default class HeroTextField extends HeroElement{

    init(json) {
        this.$ = {
            div: this.shadowDom.querySelector('span'),
            input: this.shadowDom.querySelector('input')
        }

        this.$.input.addEventListener('change', this.textChange.bind(this));

        if(json.focus){
            this.$.input.focus();
        }
        if(json.blur){
            this.$.input.blur();
        }
    }

    on(json){
       
        if (json.size) {
            this.updateCSSRule('span', 'fontSize', json.size+'px');
        };
        
        if (json.textColor) {
            this.updateCSSRule('span', 'color', json.textColor);
        };
        if (json.clear) {
            json.text = '';
        };
        if (json.text) {
            this.$.input.value = json.text;
        };
        
        this.controller && this.controller.on(json.textFieldDidEditing);

        if (json.placeHolder) {
            this.updateAttr(this.$.input, 'placeHolder', json.placeHolder);
        };

        if (json.secure) {
            json.type = 'password';
        }
        
        if(json.type === 'pin'){
            jsont.type = 'tel';
        }
        
        if(!json.type){
            json.type = 'text';
        }
     
        this.updateAttr(this.$.input, 'type', json.type);

        if(json.focus){
            this.$.input.focus();
        }

        if(json.blur){
            this.$.input.blur();
        }
    }

    textChange(e){
        var text = e.target.value;
        if(this._json.textFieldDidEditing){
          this._json.textFieldDidEditing.value = text;
          this._json.textFieldDidEditing.name = this._json.name;
          this.controller.on(this._json.textFieldDidEditing);
        }
    }


    template(json){
        return `
         <style>
            input{
                color: ${json.textColor};
                font-size: ${json.size || 16}px;
                width: 100%;
                border: 0;
                outline: 0;
                position: absolute;
                left: 0;
                bottom: 1px;
                height: 100%;
                border-bottom: 1px solid #212121;
            }
            div{
                position: relative;
                height: 100%;
            }
          </style>
          <div>
            <input type="${json.secure?'password': (json.type==='pin'?'tel':json.type)}" placeholder="${json.placeHolder}" value="${json.clear?json.text:''}" />
          </div>
        `;
      }

}
