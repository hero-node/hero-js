import HeroElement from './hero-element';

export default class HeroSegmentControl extends HeroElement {

  template(json){
    return `
    <style type="text/css">
      div{
        display: inline-block;
        position: absolute;
        overflow: hidden;
      }
      p{
        display: block;
        margin: 0px;
        padding: 0px;
        width: 100%;
        height: 100%;
        line-height: 100%;
        vertical-align: center;
      }
    </style>
    <div id='heroContent'>
      <p id='text'>开发中</p>
    </div>

    `;
  }
}
