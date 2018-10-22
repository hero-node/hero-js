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
      rightIconWrap: this.shadowDom.querySelector('#rightIconWrap'),
      DisclosureIndicator: this.shadowDom.querySelector('.DisclosureIndicator'),
      Checkmark: this.shadowDom.querySelector('.Checkmark'),
      DetailButton: this.shadowDom.querySelector('.DetailButton'),
      rightIcon: this.shadowDom.querySelector('.rightIcon'),
    };

    var onTapCallback = this.onTap.bind(this);
    this.$.heroContent.addEventListener('touchstart', onTapCallback);
    this.$.heroContent.addEventListener('click', onTapCallback);
  }

  template() {
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
      #rightIconWrap{
        position: absolute;
        right: 15px;
        display: none;
      }
      .rightIcon,.DisclosureIndicator,.Checkmark,.DetailButton {
        display: none;
      }
      #heroContent{
        height: 44px;
      }
      </style>
      <div id='heroContent' on-Tap='onTap' >
        <paper-ripple id='ripple'></paper-ripple>
        <img id='icon' src=''>
        <p id='title'></p>
        <p id='other'></p>
        <div id="rightIconWrap">
          <svg class="DisclosureIndicator rightIcon" width="100%" height="100%" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#333333" d="M233.172357 15.083013C254.338231-5.027671 288.693982-5.027671 309.859855 15.083013L791.398997 472.973481C802.695739 483.711593 807.506165 497.95666 806.73029 512.015518 807.506165 526.04334 802.695739 540.288407 791.398997 551.026519L309.859855 1008.916987C288.693982 1029.027671 254.338231 1029.027671 233.172357 1008.916987 211.975448 988.806304 211.975448 956.157478 233.172357 936.046795L679.114348 512.015518 233.172357 87.953205C211.975448 67.842522 211.975448 35.224731 233.172357 15.083013Z" /></svg>
          <svg class="Checkmark rightIcon" width="100%" height="100%" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#333333" d="M384 691.2 204.8 512 145.066667 571.733333 384 810.666667 896 298.666667 836.266667 238.933333Z" /></svg>
          <svg class="DetailButton rightIcon" width="100%" height="100%" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#333333" d="M512 0c282.428952 0 512 229.571048 512 512s-229.571048 512-512 512S0 794.428952 0 512 229.571048 0 512 0z m0 48.761905C256.512 48.761905 48.761905 256.512 48.761905 512s207.750095 463.238095 463.238095 463.238095c255.512381 0 463.238095-207.725714 463.238095-463.238095 0-255.488-207.725714-463.238095-463.238095-463.238095z m82.505143 654.774857c-39.253333 58.904381-79.335619 104.69181-147.260953 104.691809-45.787429-7.363048-65.414095-40.886857-54.784-74.435047l86.698667-287.939048a13.702095 13.702095 0 0 0-8.167619-17.16419c-6.558476-2.438095-18.822095 5.729524-30.281143 17.993143l-51.516952 64.609523c-1.633524-10.605714 0-27.794286 0-35.157333 39.253333-58.904381 104.69181-106.325333 148.041143-106.325333 41.71581 4.071619 61.342476 37.61981 53.979428 74.435047l-87.527619 289.548191c-0.804571 6.558476 2.462476 13.092571 8.192 15.555047 6.558476 2.438095 19.626667-5.729524 31.085715-17.993142l52.345904-63.000381c1.633524 9.825524-0.804571 28.647619-0.804571 35.181714z m-11.459048-376.271238c-33.54819 0-60.537905-24.551619-60.537905-59.733334 0-35.961905 26.989714-59.684571 60.537905-59.684571 33.54819 0 60.537905 24.527238 60.537905 59.708952 0 35.986286-26.989714 59.708952-60.537905 59.708953z" /></svg>
        </div>
       <p id='bottomLine'></p>
      </div>

    `;
  }
  wrapperTemplate(html) {
    return html;
  }

  ready() {
    super.ready();
    this.$.ripple.style.color = '#ddd';
  }

  on(json) {
    if (json.textValue) {
      this.$.title.innerHTML = json.title;
      this.$.other.innerHTML = json.textValue;
      this.$.title.style.lineHeight = json.height ? json.height + 'px' : '44px';
      this.$.other.style.lineHeight = json.height ? json.height + 'px' : '44px';
      this.$.title.style.width = '50%';
      this.$.other.style.width = '50%';
      this.$.other.style.right = '15px';
      this.$.other.style.textAlign = 'right';
    } else if (json.detailText) {
      this.$.title.innerHTML = json.title;
      this.$.other.innerHTML = json.detailText;
      this.$.title.style.lineHeight = json.height
        ? json.height / 3 + 'px'
        : '15px';
      this.$.other.style.lineHeight = json.height
        ? json.height * 2 / 3 + 'px'
        : '29px';
      this.$.title.style.top = '2px';
      this.$.other.style.top = '16px';
    } else if (json.title) {
      this.$.title.innerHTML = json.title;
      this.$.title.style.lineHeight = json.height ? json.height + 'px' : '44px';
    }
    if (json.bottomLine) {
      this.$.bottomLine.style.display = 'block';
    }
    if (json.size) {
      this.$.title.style.fontSize = json.size + 'px';
      this.$.other.style.fontSize = json.size + 'px';
    }
    if (json.color) {
      this.$.title.style.color = '#' + json.color;
      this.$.other.style.color = '#' + json.color;
    }
    if (json.hasOwnProperty('ripple')) {
      if (json.ripple) {
        this.$.ripple.style.display = 'block';
      } else {
        this.$.ripple.style.display = 'none';
      }
    }
    if (json.hasOwnProperty('valueDelete')) {
      this.$.other.style.textDecoration = 'line-through';
    }
    if (json.height) {
      this.$.heroContent.style.height = json.height + 'px';
    }

    if (json.image) {
      this.$.icon.style.display = 'block';
      this.$.icon.src = json.image;
      this.$.icon.style.top = json.height / 4 + 'px';
      this.$.icon.style.left = '30px';
      this.$.icon.style.width = json.height * 2 / 4 + 'px';
      this.$.icon.style.height = json.height * 2 / 4 + 'px';
      if (json.detailText) {
        this.$.title.style.left = 15 + 8 + json.height + 'px';
        this.$.title.style.top = json.height / 4 + 'px';
        this.$.title.style.fontSize = json.height / 4 + 2 + 'px';

        this.$.other.style.top = json.height / 3 + 4 + 'px';
        this.$.other.style.left = 15 + 8 + json.height + 'px';
        this.$.other.style.fontSize = json.height / 6 + 2 + 'px';
        this.$.other.style.color = '#aaa';
      } else {
        this.$.title.style.left = json.height * 2 / 3 + 40 + 'px';
        this.$.title.style.top = '0px';
        this.$.title.style.height = json.height + 'px';
        this.$.title.style.lineHeight = json.height + 'px';
      }
    }

    // if rightButton
    if (json.accessoryType) {
      var btn = json.accessoryType;
      if (btn === 'DisclosureIndicator') {
        this.$.rightIcon.style.display = 'none';
        this.$.DisclosureIndicator.style.display = 'block';
      } else if (btn === 'DetailButton') {
        this.$.rightIcon.style.display = 'none';
        this.$.DetailButton.style.display = 'block';
      } else if (btn === 'Checkmark') {
        this.$.rightIcon.style.display = 'none';
        this.$.Checkmark.style.display = 'block';
      }
      this.$.rightIconWrap.style.display = 'block';
      this.$.rightIconWrap.style.top = json.height / 3 + 'px';
      this.$.rightIconWrap.style.width = json.height * 2 / 6 + 'px';
      this.$.rightIconWrap.style.height = json.height * 2 / 6 + 'px';
    }

    // titleXoffset
    if (json.indentationWidth) {
      this.$.title.style.left = json.indentationWidth + 'px';
    }
  }

  onTap() {
    var json = this._json;
    if (json.action) {
      this.controller.on(json.action);
    } else {
      this.controller.on(json);
    }
  }
}
