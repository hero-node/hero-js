import HeroElement from './hero-element';

export default class HeroLocationView extends HeroElement {
  template(json){
    return `
    <style type="text/css">
      div{
        display: inline-block;
        position: absolute;
        overflow: hidden;
      }
    </style>
    `;
  }

  on(json){
    if(json.fetch_coordinate){
      json.fetch_coordinate.la = 122.0;
      json.fetch_coordinate.lo = 122.0;
      this.controller.on(json.fetch_coordinate);
    }
  }
}
