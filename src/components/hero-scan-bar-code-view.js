import HeroElement from './hero-element';

export default class HeroScanBarCodeView extends HeroElement {

  template(json) {
    return `
    <style type="text/css">
      div{display: inline-block;position:absolute;overflow: hidden; margin: 0px;padding: 0px;width: 100%;height: 100%;}
      p{display: inline-block;position:absolute;overflow: hidden; margin-top: 60%;height: 1px;width: 100%; text-align: center;pointer-events:none;line-height: 100%;background-color: red}
    </style>
    <p id='line'></p>
    `;
  }

  connectedCallback(){
    var that = this;
    setTimeout(function(){
        that.json.getBarCode.value='http://Only.test.com&invitationKey=97979';
        this.controller.on(that.json.getBarCode)
    },2000);
  }

}
