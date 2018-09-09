import HeroElement from './hero-element';

export default class HeroContactView extends HeroElement {
  template() {
    return `
    <style type="text/css">
      #heroContent{
        background-color: rgba(0.5,0.5,0.5,0.5);
      }
      </style>
      <div id='heroContent'></div>

    `;
  }

  on(json) {
    if (json.show) {
      alert('设备不支持此操作');
      this.controller.on({
        name: this.json.name,
        value: { name: '奥巴马', phone: '13333333333' },
      });
    }
  }
}
