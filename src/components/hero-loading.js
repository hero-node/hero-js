import HeroElement from './hero-element';

export default class HeroLoading extends HeroElement {
  init() {
    this.$ = {
      layer: this.shadowDom.querySelector('#layer'),
      loading: this.shadowDom.querySelector('#loading'),
    };
  }

  template() {
    return `
      <style type="text/css">
        #loading{
          position: fixed;
          left:50%;
          top:50%;
          background-color: 'F00',
          -webkit-transform: translate(-50%,-50%);
          transform: translate(-50%,-50%);
        }
        #layer{
          position: absolute;
          top: 0px;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.4)
        }
      </style>
      <div id='layer'>
        <div id='loading'>Loading...</div>
      </div>
    `;
  }

  on(json) {
    if (typeof json.show === 'boolean') {
      this.$.loading.active = json.show;
      this.$.layer.style.visibility = json.show ? 'visible' : 'hidden';
    }
  }
}
