import HeroElement from './hero-element';

export default class HeroScrollView extends HeroElement {
  init() {
    this.shadowDom.querySelector('#heroContent').style.overflow = 'scroll';
  }
}
