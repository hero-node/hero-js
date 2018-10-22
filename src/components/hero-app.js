import HeroElement from './hero-element';
import HeroViewController from './hero-view-controller';

export default class HeroApp extends HeroElement {
  wrapperTemplate(html) {
    return html;
  }
  init() {
    this.rootPages = [];
    this.pageStack = [];
    this.loadedPages = [];
    this.currentPage = [];
    if (this.mobile) {
      this.$ = {
        tab: this.shadowDom.querySelector('#tab'),
        bar: this.shadowDom.querySelector('#bar'),
        title: this.shadowDom.querySelector('#title'),
        pages: this.shadowDom.querySelector('#pages'),
        menu: this.shadowDom.querySelector('#menu'),
        cover: this.shadowDom.querySelector('#cover'),
        leftMenu: this.shadowDom.querySelector('#leftMenu'),
        rightMenu: this.shadowDom.querySelector('#rightMenu'),
        backBtn: this.shadowDom.querySelector('#backBtn'),
        leftBtn: this.shadowDom.querySelector('#leftBtn'),
        rightBtn: this.shadowDom.querySelector('#rightBtn'),
        leftBtn2: this.shadowDom.querySelector('#leftBtn2'),
        rightBtn2: this.shadowDom.querySelector('#rightBtn2'),
      };
    } else {
      this.$ = {
        tab: this.shadowDom.querySelector('#pad_tab'),
        bar: this.shadowDom.querySelector('#pad_bar'),
        title: this.shadowDom.querySelector('#title'),
        rootPages: this.shadowDom.querySelector('#root_pages'),
        contentPages: this.shadowDom.querySelector('#content_pages'),
        menu: this.shadowDom.querySelector('#menu'),
        cover: this.shadowDom.querySelector('#cover'),
        leftMenu: this.shadowDom.querySelector('#leftMenu'),
        rightMenu: this.shadowDom.querySelector('#rightMenu'),
        backBtn: this.shadowDom.querySelector('#backBtn'),
        leftBtn: this.shadowDom.querySelector('#leftBtn'),
        rightBtn: this.shadowDom.querySelector('#rightBtn'),
        leftBtn2: this.shadowDom.querySelector('#leftBtn2'),
        rightBtn2: this.shadowDom.querySelector('#rightBtn2'),
      };
    }

    var localStorageTemp = {};
    var forceMem = false;
    try {
      window.localStorage.boot = '{}';
    } catch (e) {
      forceMem = true;
    }
    if (forceMem) {
      window.__defineGetter__('localStorage', function() {
        return localStorageTemp;
      });
    }
  }

  template() {
    this.mobile = /iphone|ipad|ipod|android|blackberry|mini|palm/i.test(
      navigator.userAgent.toLowerCase()
    );
    if (this.mobile) {
      return `
      <style>
        :host {
          display: block;
          position: absolute;
          margin: 0px;
          padding: 0px;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        #bar {
          display:block;
          position: absolute;
          overflow:hidden;
          top: 0px;
          width: 100%;
          height: 43px;
          background-color: #ffffff;
          border-bottom:1px solid #ddd;
        }
        #tab {
          display:block;
          position: absolute;
          overflow:hidden;
          bottom: 0px;
          width: 100%;
          height: 44px;
          background-color: #fff;
          border-top:1px solid #ddd;
        }
        #cover {
          display:block;
          position: absolute;
          overflow:hidden;
          height: 100%;
          width: 100%;
          background: url(../../../images/cover.jpeg);
          background-color: #fff;
          background-size:cover;
          z-index:1
        }
        #menu {
          display:block;
          position: absolute;
          overflow:hidden;
          display: none;
          height: 100%;
          width: 100%;
          background-color: rgba(0,0,0,0.4);
        }
        #leftMenu {
          display:block;
          position: absolute;
          overflow:hidden;
          display: none;
          height: 100%;
          width: 66%;
          background-color: #fff;
        }
        #rightMenu {
          display:block;
          position: absolute;
          overflow:hidden;
          display: none;
          height: 100%;
          left: 34%;
          width: 66%;
          background-color: #fff;
        }
        #title {
          display:inline-block;
          position: absolute;
          overflow:hidden;
          width: 100%;
          height: 100%;
          color: #fff;
          font-size: 20px;
          text-align: center;
          top:-10px;
          pointer-events:none;
        }
        #leftBtn {
          display:none;
          position: absolute;
          overflow:hidden;
          color: #fff;
          width: 40px;
          height: 30px;
          left:10px;
          top:7px;
        }
        #leftBtn2 {
          display:none;
          position: absolute;
          overflow:hidden;
          color: #fff;
          width: 40px;
          height: 30px;
          left:60px;
          top:7px;
        }
        #backBtn {
          display:none;
          position: absolute;
          overflow:hidden;
          width: 25px;
          height: 25px;
          left:10px;
          top:12px;
        }
        #rightBtn {
          display:none;
          position: absolute;
          overflow:hidden;
          width: 40px;
          height: 30px;
          right:10px;
          top:7px;
        }
        #rightBtn2 {
          display:none;
          position: absolute;
          overflow:hidden;
          width: 40px;
          height: 30px;
          right:60px;
          top:7px;
        }
        hero-pages{
          display:block;
          position: absolute;
          overflow:hidden;
          top: 44px;
          bottom: 100%;
          width: 100%;
        }
        @keyframes backBtnIn
        {
          from {opacity: 0;}
          to {opacity: 1;}
        }
        @keyframes backBtnOut
        {
          from {opacity: 1;}
          to {opacity: 0;}
        }
        @keyframes coverGo
        {
          from {opacity: 1;}
          to {opacity: 0;}
          from {transform:scale(1,1);}
          to {transform:scale(1.1,1.1);}
        }
        @keyframes leftMenuIn
        {
          from {left: -66%;}
          to {left: 0%;}
        }
        @keyframes leftMenuOut
        {
          from {left: 0%;}
          to {left: -66%;}
        }
      </style>

      <div id='bar'>
        <hero-button class='btn' id ='backBtn'></hero-button>
        <hero-button class='btn' id ='leftBtn'></hero-button>
        <hero-button class='btn' id ='leftBtn2'></hero-button>
        <hero-button class='btn' id ='rightBtn'></hero-button>
        <hero-button class='btn' id ='rightBtn2'></hero-button>
        <p id='title'></p>
      </div>
      <hero-pages id='pages'></hero-pages>
      <div id='tab'></div>
      <div id='menu' on-tap='closeMenu'>
        <div id='leftMenu'></div>
        <div id='rightMenu'></div>
      </div>
      <div id='cover'></div>

      `;
    } else {
      return `
      <style>
        :host {
          display: block;
          position: absolute;
          margin: 0px;
          padding: 0px;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        #pad_bar {
          display:block;
          position: absolute;
          overflow:hidden;
          top: 0px;
          left: 440px;
          right: 0px;
          height: 88px;
          background-color: #ffffff;
          border-bottom:1px solid #ddd;
        }
        #pad_tab {
          display:block;
          position: absolute;
          overflow:hidden;
          left:0px;
          width:120px;
          height: 100%;
          background-color: #fff;
          border-right:1px solid #ddd;
        }
        #root_pages{
          display:block;
          position: absolute;
          overflow:hidden;
          top: 0px;
          left: 121px;
          width: 320px;
          height: 100%;
          border-right:1px solid #ddd;
        }
        #content_pages{
          display:block;
          position: absolute;
          overflow:hidden;
          top: 0px;
          left: 442px;
          right: 0px;
          height: 100%;
        }
        #cover {
          display:block;
          position: absolute;
          overflow:hidden;
          height: 100%;
          width: 100%;
          background: url(../../../images/cover.jpeg);
          background-color: #fff;
          background-size:cover;
          z-index:1;
        }
        #menu {
          display:block;
          position: absolute;
          overflow:hidden;
          display: none;
          height: 100%;
          width: 100%;
          background-color: rgba(0,0,0,0.4);
        }
        #leftMenu {
          display:block;
          position: absolute;
          overflow:hidden;
          display: none;
          height: 100%;
          width: 66%;
          background-color: #fff;
        }
        #rightMenu {
          display:block;
          position: absolute;
          overflow:hidden;
          display: none;
          height: 100%;
          left: 34%;
          width: 66%;
          background-color: #fff;
        }
        #title {
          display:inline-block;
          position: absolute;
          overflow:hidden;
          width: 100%;
          height: 100%;
          line-height:88px;
          margin:0px;
          color: #fff;
          font-size: 20px;
          text-align: center;
          pointer-events:none;
        }
        #leftBtn {
          display:none;
          position: absolute;
          overflow:hidden;
          color: #fff;
          width: 40px;
          height: 30px;
          left:20px;
          top:29px;
        }
        #leftBtn2 {
          display:none;
          position: absolute;
          overflow:hidden;
          color: #fff;
          width: 40px;
          height: 30px;
          left:80px;
          top:29px;
        }
        #backBtn {
          display:none;
          position: absolute;
          overflow:hidden;
          width: 25px;
          height: 25px;
          left:10px;
          top:12px;
        }
        #rightBtn {
          display:none;
          position: absolute;
          overflow:hidden;
          width: 40px;
          height: 30px;
          right:20px;
          top:29px;
        }
        #rightBtn2 {
          display:none;
          position: absolute;
          overflow:hidden;
          width: 40px;
          height: 30px;
          right:80px;
          top:29px;
        }
        @keyframes backBtnIn
        {
          from {opacity: 0;}
          to {opacity: 1;}
        }
        @keyframes backBtnOut
        {
          from {opacity: 1;}
          to {opacity: 0;}
        }
        @keyframes coverGo
        {
          from {opacity: 1;}
          to {opacity: 0;}
          from {transform:scale(1,1);}
          to {transform:scale(1.1,1.1);}
        }
        @keyframes leftMenuIn
        {
          from {left: -66%;}
          to {left: 0%;}
        }
        @keyframes leftMenuOut
        {
          from {left: 0%;}
          to {left: -66%;}
        }
      </style>
      <div id='pad_bar'>
        <hero-button class='btn' id ='backBtn'></hero-button>
        <hero-button class='btn' id ='leftBtn'></hero-button>
        <hero-button class='btn' id ='leftBtn2'></hero-button>
        <hero-button class='btn' id ='rightBtn'></hero-button>
        <hero-button class='btn' id ='rightBtn2'></hero-button>
        <p id='title'></p>
      </div>
      <hero-pages id='root_pages'></hero-pages>
      <hero-pages id='content_pages'></hero-pages>
      <div id='pad_tab'></div>
      <div id='pad_menu' on-tap='closeMenu'>
        <div id='leftMenu'></div>
        <div id='rightMenu'></div>
      </div>
      <div id='cover'></div>
        `;
    }
  }

  on(json) {
    var i, item;

    if (json.tabs) {
      this.tabs = json.tabs;
      for (i = 0; i < json.tabs.length; i++) {
        var tab = json.tabs[i];
        this.rootPages.push(this.page2Element(tab.url));
        item = document.createElement('hero-toolbar-item');
        this.$.tab.appendChild(item);
        this.$.tab.style.backgroundColor = '#' + tab.backgroundColor;
        this.$.tab.style.color = '#' + tab.color;
        item.setController(this);
        if (this.mobile) {
          item.in({
            frame: {
              x: i / json.tabs.length + 'x',
              w: 1 / json.tabs.length + 'x',
              y: '0',
              h: '44',
            },
            image: tab.image,
            title: tab.title,
            selected: i == 0,
            click: { select: i + 1 },
          });
        } else {
          item.in({
            frame: {
              x: '0',
              w: '120',
              y: i * 120 + (i + 1) * 10 + '',
              h: '120',
            },
            image: tab.image,
            title: tab.title,
            selected: i == 0,
            click: { select: i + 1 },
          });
        }
      }
      if (this.tabs.length == 1) {
        this.$.tab.style.display = 'none';
        if (this.mobile) {
          this.$.pages.style.bottom = '0px';
        } else {
        }
      }
      this.gotoPage(json.tabs[0].url);
      if (json.loadPage) {
        var that = this;
        setTimeout(function() {
          that.gotoPage(json.loadPage);
        }, 1500);
      }
    }
    if (json.select) {
      for (i = 0; i < this.$.tab.children.length; i++) {
        item = this.$.tab.children[i];
        item.in({ selected: i == json.select - 1 });
      }
      this.$.title.innerHTML = this.json.tabs[json.select - 1].title;
      this.gotoPage(this.json.tabs[json.select - 1].url);
    }
    if (json.goBack) {
      window.history.back();
    }
  }
  merge(o1, o2) {
    for (var key in o2) {
      o1[key] = o2[key];
    }
    return o1;
  }
  str2Color(str) {
    if (str.length == 3 || str.length == 6) {
      return '#' + str;
    } else if (str.length == 8) {
      var r = parseInt('0x' + str.substr(0, 2));
      var g = parseInt('0x' + str.substr(2, 2));
      var b = parseInt('0x' + str.substr(4, 2));
      var a = parseInt('0x' + str.substr(6, 2)) / 255;
      return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }
  }
  camelCase2bar(str) {
    var low = str.toLowerCase();
    var des = low.substr(0, 2);
    for (var i = 2; i < str.length; i++) {
      if (str.charAt(i) !== low.charAt(i)) {
        des = des.concat('-' + low.charAt(i));
      } else {
        des = des.concat(low.charAt(i));
      }
    }
    return des;
  }
  remove(arr, value) {
    if (!arr) return;
    var a = arr.indexOf(value);
    if (a >= 0) {
      arr.splice(a, 1);
    }
  }
  contain(objs, obj) {
    var i = objs.length;
    while (i--) {
      if (objs[i] === obj) {
        return true;
      }
    }
    return false;
  }
  registerElement(element) {
    if (!this.contain(this.loadedPages, element)) {
      this.loadedPages.push(element);

      class Page extends HeroViewController {
        constructor() {
          super();
        }
        _on() {
          // override parent
        }
      }
      customElements.define(element, Page);
    }
  }
  page2Element(page) {
    var pageElement;
    if (page.search(/pageName=/) > 0) {
      pageElement = page.split('pageName=')[1];
      pageElement =
        pageElement.search(/-/) > 0 ? pageElement : 'hero-' + pageElement;
      return pageElement;
    }
    pageElement = page.replace('_', '-');
    if (page.search(/.html/) > 0) {
      pageElement = pageElement.split('/').pop();
      if (pageElement.search(/\?/) > 0) {
        pageElement = pageElement.split('?')[0];
      }
      pageElement = pageElement.replace('.html', '');
      pageElement =
        pageElement.search(/-/) > 0 ? pageElement : 'hero-' + pageElement;
    }
    return pageElement;
  }
  connectedCallback() {
    window.APP = this;
    window.addEventListener('popstate', function(e) {
      if (e.state) {
        window.window.APP.gotoPage(e.state.state || e.state.heropage, 'back');
      }
    });
    this.$.backBtn.setController(this);
    this.$.backBtn.in({ image: 'back.png', click: { goBack: true } });
    this.$.rightBtn.in({ title: ' ', titleColor: 'ffffff' });
    this.$.leftMenu.style.width = parseInt(window.innerWidth) * 2 / 3 + 'px';
    var that = this;
    if (/[127\.0\.0\.0|localhost]/.test(window.location.host)) {
      this.$.cover.style.display = 'none';
    } else {
      setTimeout(function() {
        that.$.cover.style.animation = 'coverGo 1s';
      }, 2000);
      setTimeout(function() {
        that.$.cover.style.display = 'none';
      }, 2900);
    }
    window.Heros = [];
    window.__defineSetter__('Hero', function(v) {
      window.Heros.push(v);
      window[window.location.href + '_Hero'] = v;
    });

    window.__defineGetter__('Hero', function() {
      return window[window.location.href + '_Hero'];
    });

    window.last_ui2Data = '';

    window.__defineSetter__('ui2Data', function(v) {
      window[window.location.href + '_ui2Data'] = v;
    });
    window.__defineGetter__('ui2Data', function() {
      var _ui2Data = window[window.location.href + '_ui2Data'];
      if (_ui2Data) {
        window.last_ui2Data = _ui2Data;
      }
      return window.last_ui2Data;
    });
  }
  setNav(nav) {
    if (nav) {
      if (nav.nav) {
        nav = nav.nav;
      }
      this.$.title.innerHTML = nav.title || '';
      document.title = nav.title || '';
      if (nav.titleColor) {
        this.$.title.style.color = '#' + nav.titleColor;
      }
      if (nav.tintColor) {
        this.$.bar.style.backgroundColor = this.str2Color(nav.tintColor);
      }
      if (nav.navigationBarHidden || nav.navigationBarHiddenH5) {
        this.$.bar.style.height = '0px';
        if (this.mobile) {
          this.$.pages.style.top = '0px';
        } else {
          this.$.contentPages.style.top = '0px';
        }
      } else {
        if (this.mobile) {
          this.$.bar.style.height = '43px';
          this.$.pages.style.top = '44px';
        } else {
          this.$.bar.style.height = '88px';
          this.$.contentPages.style.top = '89px';
        }
      }
      if (nav.leftItems && nav.leftItems.length > 0) {
        this.$.backBtn.style.display = 'none';
        this.$.backBtn.style.animation = 'backBtnOut 0.25s';
        this.$.leftBtn.style.display = 'inline-block';
        this.$.leftBtn.in(nav.leftItems[0]);
        this.$.leftBtn.setController(this.currentPage);
        //second leftItem
        if (nav.leftItems[1]) {
          this.$.leftBtn2.style.display = 'inline-block';
          this.$.leftBtn2.in(nav.leftItems[1]);
          this.$.leftBtn2.setController(this.currentPage);
        }
      } else {
        this.$.leftBtn.style.display = 'none';

        this.$.leftBtn2.style.display = 'none';

        if (this.contain(this.rootPages, this.currentPage.name)) {
          this.$.backBtn.style.display = 'none';
          this.$.backBtn.style.animation = 'backBtnOut 0.25s';
        } else {
          this.$.backBtn.style.display = 'inline-block';
          this.$.backBtn.style.animation = 'backBtnIn 0.25s';
        }
      }
      if (nav.rightItems && nav.rightItems.length > 0) {
        this.$.rightBtn.in(nav.rightItems[0]);
        this.$.rightBtn.setController(this.currentPage);
        this.$.rightBtn.style.display = 'inline-block';
        //second rightItem
        if (nav.rightItems[1]) {
          this.$.rightBtn2.style.display = 'inline-block';
          this.$.rightBtn2.in(nav.rightItems[1]);
          this.$.rightBtn2.setController(this.currentPage);
        }
      } else {
        this.$.rightBtn.style.display = 'none';

        this.$.rightBtn2.style.display = 'none';
      }
    }
  }
  showLeftmenu(show) {
    if (show) {
      this.$.menu.style.display = 'block';
      this.$.leftMenu.style.display = 'block';
      this.$.leftMenu.style.animation = 'leftMenuIn 0.3s';
    } else {
      this.$.leftMenu.style.animation = 'leftMenuOut 0.3s';
      // this.async(function(){
      this.$.menu.style.display = 'none';
      this.$.leftMenu.style.display = 'none';
      // },200);
    }
  }
  closeMenu() {
    this.showLeftmenu(false);
  }
  loadPage(page) {
    var pageElement = this.page2Element(page);
    if (!this.contain(this.loadedPages, pageElement)) {
      this.registerElement(pageElement);
      var that = this;
      window.API = undefined;
      window.ui = undefined;
      // eslint-disable-next-line
      if (/[127\.0\.0\.0|localhost]/.test(page)) {
        if (page.endWith('html')) {
          page = page + '?test=true';
        } else {
          page = page + '&test=true';
        }
      }
      if (this.mobile) {
        this.$.pages.on();
      } else {
        if (this.contain(this.rootPages, pageElement)) {
          this.$.rootPages.on();
        } else {
          this.$.contentPages.on();
        }
      }
      window.importHref(
        page,
        function() {
          that.currentPage = document.createElement(pageElement);
          that.currentPage.name = pageElement;
          that.currentPage.url = page;
          if (that.mobile) {
            that.$.pages.addPage(that.currentPage);
          } else {
            if (that.contain(that.rootPages, pageElement)) {
              that.$.rootPages.addPage(that.currentPage);
            } else {
              that.$.contentPages.addPage(that.currentPage);
            }
          }
        },
        function() {
          that.currentPage = document.createElement(pageElement);
          that.currentPage.name = pageElement;
          that.currentPage.url = page;
          if (that.mobile) {
            that.$.pages.addPage(that.currentPage);
          } else {
            if (that.contain(that.rootPages, page)) {
              that.$.rootPages.addPage(that.currentPage);
            } else {
              that.$.contentPages.addPage(that.currentPage);
            }
          }
        }
      );
    } else {
      if (this.mobile) {
        this.$.pages.on({
          selected: pageElement,
          callback: true,
        });
        const next = this.$.pages.selectedItem;
        if (this.pageStack.indexOf(pageElement) === -1) {
          next.viewDidLoad();
        }
        next.viewWillAppear();
      } else {
        if (this.contain(this.rootPages, pageElement)) {
          this.$.rootPages.on({
            selected: pageElement,
            callback: true,
          });
          const next = this.$.rootPages.selectedItem;
          if (this.pageStack.indexOf(pageElement) === -1) {
            next.viewDidLoad();
          }
          next.viewWillAppear();
        } else {
          this.$.contentPages.on({
            selected: pageElement,
            callback: true,
          });
          const next = this.$.contentPages.selectedItem;
          if (this.pageStack.indexOf(pageElement) === -1) {
            next.viewDidLoad();
          }
          next.viewWillAppear();
        }
      }
    }
  }
  gotoPage(page, option) {
    var pageElement = this.page2Element(page);
    if (pageElement.search(/http/) >= 0) {
      window.open(pageElement, '_blank');
      window.focus();
      return;
    }
    const isInPageStack = this.contain(this.pageStack, pageElement);
    const isInRootStack = this.contain(this.rootPages, pageElement);
    const isIn = this.contain(
      this.rootPages,
      this.pageStack[this.pageStack.length - 1]
    );

    if (isInRootStack && this.rootPages.length > 1) {
      if (this.mobile) {
        this.$.tab.style.display = 'block';
        this.$.pages.style.bottom = '44px';
        this.$.backBtn.style.display = 'none';
      } else {
      }
    } else {
      if (this.mobile) {
        this.$.tab.style.display = 'none';
        this.$.pages.style.bottom = '0px';
      } else {
      }
    }
    var animationType = '';

    if (isInPageStack) {
      if (!isIn) {
        animationType = 10;
      }
    } else if (!isInRootStack) {
      animationType = 9;
    }
    if (option == 'present') {
      animationType = 3;
    } else if (option == 'dissmiss') {
      animationType = 4;
    } else if (option == 'load') {
      animationType = 9;
    }
    if (this.mobile) {
      this.$.pages.setEffect(animationType);
      if (this.$.pages.selectedItem) {
        this.$.pages.selectedItem.viewWillDisappear();
      }
    } else {
    }

    if (
      !history.state ||
      (history.state.state || history.state.heropage) === page ||
      option === 'load'
    ) {
      history.replaceState(
        { heropage: page },
        pageElement,
        '?heropage=' + page
      );
    } else if (
      option != 'dissmiss' &&
      option != 'back' &&
      option != 'rootBack' &&
      option != 'load'
    ) {
      history.pushState({ heropage: page }, pageElement, '?heropage=' + page);
    }
    if (!this.contain(this.pageStack, pageElement)) {
      this.pageStack.push(pageElement);
    } else {
      while (this.pageStack[this.pageStack.length - 1] != pageElement) {
        this.pageStack.pop();
      }
    }
    this.loadPage(page);
  }
}
