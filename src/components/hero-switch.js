import HeroElement from './hero-element';

export default class HeroSwitch extends HeroElement {

  init(json) {
      this.$ = {
          input: this.shadowDom.querySelector('input')
      }
  }

  template(json) {
    return `
    <style type="text/css">
      div#wpr{ display:inline-block;position:absolute;overflow:hidden;}
      input {display: block;position:absolute;margin: 0px;padding: 0px;left:50%;top:50%;transform: translate(-50%,-50%);}
    </style>
    <div id='wpr'>
      <input type="checkbox" />
    </div>

    `;
  }

  on(json) {
    if (json.value) {
      this.checked = json.value;
    };
    if(json.click){
      this.click=json.click;
    }
  }

  valueChange(value) {
    if (this._json&&this._json.click) {
      this._json.click.value=value;
      this._json.click.name=this._json.name;
      this.controller.on(this._json.click)
    };
  }

}
