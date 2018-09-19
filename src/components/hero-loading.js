import HeroElement from './hero-element';

export default class HeroLoading extends HeroElement {
  init() {
    this.$ = {
      layer: this.shadowDom.querySelector('#layer'),
      loading: this.shadowDom.querySelector('#loading'),
  };
};

template() {
    return `
    <style type="text/css">
    * {
        width: 100%;
        height: 100%;
    }
    #loading{
        width: 100px;
        height: 100px;
        position: absolute;
        left:50%;
        top:50%;
        -webkit-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        z-index: 99999;
    }
    #layer{
        position: absolute;
        top: 0px;
        width: 100%;
        height: 100%;
        z-index: 99998;
        background-color:#000; 
        filter: alpha(opacity=40); 
        -moz-opacity: 0.4; 
        opacity: 0.4; 
    }
    .loadEffect {
        width: 100px;
        height: 100px;
        position: relative;
    }
    .loadEffect span{
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #fff;
        position: absolute;
        -webkit-animation: load 1.04s ease infinite;
    }
    @-webkit-keyframes load{
        0%{
            opacity: 1;
        }
        100%{
            opacity: 0.2;
        }
    }
    .loadEffect span:nth-child(1) {
        left: 0;
        top: 50%;
        margin-top:-8px;
        -webkit-animation-delay:0.13s;
    } 
    .loadEffect span:nth-child(2) {
        left: 14px;
        top: 14px;
        -webkit-animation-delay:0.26s;
    }
    .loadEffect span:nth-child(3) {
        left: 50%;
        top: 0;
        margin-left: -8px;
        -webkit-animation-delay:0.39s;
    }
    .loadEffect span:nth-child(4) {
        top: 14px;
        right:14px;
        -webkit-animation-delay:0.52s;
    }
    .loadEffect span:nth-child(5) {
        right: 0;
        top: 50%;
        margin-top:-8px;
        -webkit-animation-delay:0.65s;
    }
    .loadEffect span:nth-child(6) {
        right: 14px;
        bottom:14px;
        -webkit-animation-delay:0.78s;
    }
    .loadEffect span:nth-child(7) {
        bottom: 0;
        left: 50%;
        margin-left: -8px;
        -webkit-animation-delay:0.91s;
    }
    .loadEffect span:nth-child(8) {
        bottom: 14px;
        left: 14px;
        -webkit-animation-delay:1.04s;
    }
    .loadText {
        position: relative;
        left: 15px;
        top: 10px;
        font-size: 15px;
        color: #fff;
    }

    </style>
    <div id='layer'>
    <div id='loading'>
    <div class="loadEffect">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    </div>
    </div>
    </div>
    `;
};

on(json) {
    if (typeof json.show === 'boolean') {
      this.$.loading.active = json.show;
      this.$.layer.style.visibility = json.show ? 'visible' : 'hidden';
  }
}
}
