import HeroElement from './hero-element';

export default class HeroTableViewCell extends HeroElement {

  init() {

      this.$ = {
        ripple: this.shadowDom.querySelector('#ripple'),
        icon: this.shadowDom.querySelector('#icon'),
        heroContent: this.shadowDom.querySelector('#heroContent'),
        title: this.shadowDom.querySelector('#title'),
        other: this.shadowDom.querySelector('#other'),
        bottomLine: this.shadowDom.querySelector('#bottomLine'),
      }

      this.$.heroContent.addEventListener('touchstart', this.onTap.bind(this));
  }


  template(){
    return `
    <style type="text/css">
      :host {
        display: block;
        position:relative;
        width: 100%;
        margin: 0px;
        padding: 0px;
        border: 0px;
        overflow: hidden;
        background-color: #fff;
        left: 0px;
      }
      paper-ripple{
        width: 100%;
        height: 100%;
      }
      p{
        display: inline-block;
        position: absolute;
        overflow: hidden;
        margin: 0px;padding: 0px;width: 100%;height: 100%;
      }
      #title{
        left: 15px;
      }
      #other{
        font-size: 14px;
      }
      #bottomLine{
        left: 15px;
        height: 1px;
        right: 0px;
        bottom: 0px;
        display: none;
        background-color: #e4e4e4;
      }
      #icon{
        position: absolute;
        left: 15px;
        width: 15px;
        height: 15px;
        display: none;
      }
      #heroContent{
        height: 44px;
      }
      </style>
      <div id='heroContent' on-Tap='onTap' >
        <paper-ripple id='ripple'></paper-ripple>
        <img id='icon' src=''></img>
        <p id='title'></p>
        <p id='other'></p>
        <p id='bottomLine'></p>
      </div>

    `;
  }
  wrapperTemplate(html){
    return html;
  }

  ready(){
    super.ready();
    this.$.ripple.style.color = '#ddd'
  }


  on(json) {
    if (json.textValue) {
      this.$.title.innerHTML = json.title;
      this.$.other.innerHTML = json.textValue;
      this.$.title.style.lineHeight = json.height?json.height+'px':'44px';
      this.$.other.style.lineHeight = json.height?json.height+'px':'44px';
      this.$.title.style.width = '50%';
      this.$.other.style.width = '50%';
      this.$.other.style.right = '15px';
      this.$.other.style.textAlign = 'right';
    }else if(json.detailText){
      this.$.title.innerHTML = json.title;
      this.$.other.innerHTML = json.detailText;
      this.$.title.style.lineHeight = json.height?json.height/3+'px':'15px';
      this.$.other.style.lineHeight = json.height?json.height*2/3+'px':'29px';
      this.$.title.style.top = '2px';
      this.$.other.style.top = '16px';
    }else if(json.title){
      this.$.title.innerHTML = json.title;
      this.$.title.style.lineHeight = json.height?json.height+'px':'44px';
    };
    if (json.bottomLine) {
      this.$.bottomLine.style.display = 'block';
    };
    if (json.size) {
      this.$.title.style.fontSize = json.size+'px';
      this.$.other.style.fontSize = json.size+'px';
    };
    if (json.color) {
      this.$.title.style.color = '#'+json.color;
      this.$.other.style.color = '#'+json.color;
    };
    if(json.hasOwnProperty("ripple")) {
      if (json.ripple) {
        this.$.ripple.style.display = 'block';
      }else{
        this.$.ripple.style.display = 'none';
      }
    };
    if(json.hasOwnProperty("valueDelete")) {
      this.$.other.style.textDecoration = 'line-through';
    };
    if (json.image) {
      this.$.icon.style.display = 'block';
      this.$.icon.src = json.image;
      this.$.icon.style.top = json.height/6+'px';
      this.$.icon.style.left = '16px';
      this.$.icon.style.width = json.height*2/3+'px';
      this.$.icon.style.height = json.height*2/3+'px';
      if (json.detailText) {
        this.$.title.style.left = 15+8+json.height-10+'px';
        this.$.title.style.top = '0px';
        this.$.title.style.height = json.height/2+'px';
        this.$.title.style.lineHeight = json.height/2+'px';

        this.$.other.style.top = json.height/2+'px';
        this.$.other.style.left = 15+8+json.height-10+'px';
        this.$.other.style.height = json.height/2+'px';
        this.$.other.style.lineHeight = '';
        this.$.other.style.color = '#aaa';
      }else{
        this.$.title.style.left = 15+8+json.height-10+'px';
        this.$.title.style.top = '0px';
        this.$.title.style.height = json.height+'px';
        this.$.title.style.lineHeight = json.height+'px';
      }

    };
  }

  onTap(){
    var json = this._json;
    if (json.action) {
      this.controller.on(json.action)
    }else{
      this.controller.on(json)
    }
  }

}
