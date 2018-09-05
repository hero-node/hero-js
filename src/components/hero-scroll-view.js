import HeroElement from './hero-element';

export default class HeroScrollView extends HeroElement {
  template() {
    return `
      <style>
        div{
          overflow: scroll;
        }
      </style>
    `;
  }

}
