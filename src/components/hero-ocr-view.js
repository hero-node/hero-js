import HeroElement from './hero-element';

export default class HeroOcrView extends HeroElement {

  on(json) {
    
    if (json.scanResult) {
      this.actionObject = json.scanResult;
    }
    if (json.type === '银行卡') {
      this.actionObject.value = {bankCode:'888888888888888'};
      this.controller.on(this.actionObject);
    };
    if (json.type === '身份证反面') {
      this.actionObject.value = {code:'美国华盛顿特区',valid:'2999-10-19'};
      this.controller.on(this.actionObject);
    };
    if (json.type === '身份证正面') {
      this.actionObject.value = {name:'奥巴马',code:312267198910107678+(new Date()).getTime()+'',address:'美国华盛顿特区白宫'};
      this.controller.on(this.actionObject);
    };
    if (json.type === '身份证') {
      this.actionObject.value = {name:'奥巴马',code:312267198910107678+(new Date()).getTime()+'',address:'美国华盛顿特区白宫'};
      this.controller.on(this.actionObject);
      this.actionObject.value = {code:'美国华盛顿特区',valid:'2999-10-19'};
      this.controller.on(this.actionObject);
    };
    if (json.type === '敏识') {
      this.actionObject.value = {minshi:true};
      this.controller.on(this.actionObject);
    };
  }

}
