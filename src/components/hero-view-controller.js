import HeroElement from './hero-element';

export default class HeroViewController extends HeroElement {
  findViewByname(name, root) {
    var view = root.querySelector('#' + name);
    if (!view || !view.json) {
      for (var i = 0; i < root.children.length; i++) {
        if (root.children[i].$ && root.children[i].$.heroContent) {
          view = this.findViewByname(name, root.children[i].$.heroContent);
          if (view) {
            break;
          }
        }
      }
    }
    if (view && view.$ && view.$.heroContent) {
      return view;
    }
  }
  ui2Data(observeUI) {
    if (Array.isArray(observeUI)) {
      for (var i = 0; i < observeUI.length; i++) {
        this.ui2Data(observeUI[i]);
      }
    } else if (observeUI.subViews) {
      this.ui2Data(observeUI.subViews);
    }
    if (observeUI.name) {
      window.ui2Data['_' + observeUI.name] = '';
      window.ui2Data.__defineSetter__(observeUI.name, function(v) {
        window.ui2Data['_' + observeUI.name] = v;
        var data = { name: observeUI.name };
        if (typeof v == 'string') {
          data.text = v;
        } else {
          for (var key in v) {
            data[key] = v[key];
          }
        }
        window.Hero.out({ datas: data });
      });
      window.ui2Data.__defineGetter__(observeUI.name, function() {
        return window.ui2Data['_' + observeUI.name];
      });
    }
  }

  template() {
    return `
      <style>
        div{
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          visibility: hidden;
          overflow: hidden;
          -webkit-backface-visibility: hidden;
          -moz-backface-visibility: hidden;
          backface-visibility: hidden;
          -webkit-transform: translate3d(0, 0, 0);
          -moz-transform: translate3d(0, 0, 0);
          transform: translate3d(0, 0, 0);
          -webkit-transform-style: preserve-3d;
          -moz-transform-style: preserve-3d;
          transform-style: preserve-3d;
        }
      </style>
    `;
  }
  connectedCallback() {
    if (window.Hero && window.Hero.ui) {
      this.view = window.Hero.ui;
      this.controller = window.Hero;
      window.Hero.page = this;
      var heroContent = document.createElement('div');
      heroContent.style.height = '100%';
      heroContent.style.width = '100%';
      this.appendChild(heroContent);
      this.heroContent = heroContent;
      if (this.view.backgroundColor) {
        heroContent.style.backgroundColor = window.APP.str2Color(
          this.view.backgroundColor
        );
      } else {
        heroContent.style.backgroundColor = '#ffffff';
      }
      this.viewWillAppear();
      this.viewDidLoad();
    } else {
      var iframe = document.createElement('iframe');
      iframe.style.display = 'inline-block';
      iframe.style.position = 'absolute';
      iframe.style.overflow = 'hidden';
      iframe.style.top = '0px';
      iframe.style.left = '0px';
      iframe.style.border = '0px';
      iframe.style.borderWidth = '0px';
      iframe.style.height = '100%';
      iframe.style.width = '100%';
      this.appendChild(iframe);
      var url = this.url;
      setTimeout(function() {
        iframe.src = url;
      }, 1000);
      var that = this;
      iframe.onload = function() {
        try {
          that.title = iframe.contentDocument.title;
          // eslint-disable-next-line
        } catch (e) {}
        window.APP.setNav({ title: that.title });
      };
    }
  }

  viewDidLoad() {
    if (this.controller) {
      this.controller.boot();
    }
  }

  viewWillAppear() {
    if (this.view && this.view.nav) {
      if (this.view.tintColor) {
        this.view.nav.tintColor = this.view.tintColor;
      }
      window.APP.setNav(this.view.nav);
    } else {
      window.APP.setNav({ title: this.title });
    }
    if (this.appearObject) {
      this.controller.in(this.appearObject);
    } else if (window.Hero && window.Hero.viewWillAppear) {
      window.Hero.viewWillAppear();
    }
  }

  viewWillDisappear() {
    if (this.disAppearObject) {
      this.controller.in(this.disAppearObject);
    } else if (window.Hero.viewWillDisppear) {
      window.Hero.viewWillDisppear();
    }
  }

  on(json) {
    if (!json) {
      return;
    }
    var element, num, viewObject, view;
    if (Array.isArray(json)) {
      for (num in json) {
        this.on(json[num]);
      }
      return;
    }
    if (json.appearance) {
      window.APP.setNav({ nav: json.appearance });
    } else if (json.ui) {
      while (this.heroContent.lastChild) {
        this.heroContent.removeChild(this.heroContent.lastChild);
      }
      if (json.ui.leftMenu) {
        var leftMenu = json.ui.leftMenu;
        window.APP.$.leftMenu.style.backgroundColor =
          '#' + (leftMenu.backgroundColor || 'f5f5f5');
        for (num in leftMenu.views) {
          viewObject = leftMenu.views[num];
          view = document.createElement(
            window.APP.camelCase2bar(viewObject.class || viewObject.res)
          );
          if (view.in) {
            window.APP.$.leftMenu.appendChild(view);
            view.controller = this;
            view.in(viewObject);
          }
        }
      }
      var views = json.ui.views;
      for (num in views) {
        viewObject = views[num];
        view = document.createElement(
          window.APP.camelCase2bar(viewObject.class || viewObject.res)
        );
        if (view.in) {
          this.heroContent.appendChild(view);
          view.controller = this;
          if (viewObject.frame) {
            // viewObject.frame.p = {w:window.innerWidth,h:window.innerHeight};
          }
          view.in(viewObject);
        }
      }
    } else if (json.ui_fragment) {
      var parentElement;
      for (num in json.ui_fragment) {
        view = json.ui_fragment[num];
        if (view.parent) {
          parentElement = this.findViewByname(view.parent, this.heroContent);
        } else {
          parentElement = this.heroContent;
        }
        element = document.createElement(
          window.APP.camelCase2bar(view.class || view.res)
        );
        parentElement.appendChild(element);
        parentElement.$.heroContent.appendChild(element);
        element.controller = this;
        element.in(view);
      }
    } else if (json.datas) {
      var datas = json.datas;
      if (Array.isArray(datas)) {
        for (num in datas) {
          var data = datas[num];
          element = this.findViewByname(data.name, this.heroContent);
          // if (!element) {
          //   element = this.findViewByname(data.name, document.body);
          // }
          if (element && element.in) {
            element.in(data);
          }
        }
      } else {
        if (datas.frame) {
          datas.frame.p = { w: window.innerWidth, h: window.innerHeight };
        }
        element = this.findViewByname(datas.name, this.heroContent);
        if (!element) {
          element = this.findViewByname(datas.name, document.body);
        }
        if (element && element.in) {
          element.in(datas);
        }
      }
    } else if (json.command) {
      var command = json.command;
      var loading;
      if (typeof command === 'string') {
        if (command === 'refresh') {
          window.location.reload();
        } else if (command === 'showLoading') {
          loading = this.findViewByname('loading', this.heroContent);
          if (!loading) {
            loading = document.createElement('hero-loading');
            loading.controller = this;
            this.heroContent.appendChild(loading);
          }
          loading.in({ show: true, name: 'loading' });
        } else if (command === 'stopLoading') {
          loading = this.findViewByname('loading', this.heroContent);
          if (loading) {
            loading.in({ show: false });
          }
          var showing =
            document.querySelector('hero-dialog') ||
            document.querySelector('hero-loading');
          if (showing) {
            showing.parentElement.removeChild(showing);
          }
        } else if (command.substring(0, 5) === 'goto:') {
          var url = command.replace('goto:', '');
          if (url.substring(0, 3) == 'tel') {
            // this.on({command:{show:{title:'拨打电话'+url}}});
            window.location.href = 'tel://' + url;
          } else {
            window.APP.gotoPage(url);
          }
        } else if (command.substring(0, 5) === 'load:') {
          window.APP.gotoPage(command.substring(5, command.length), 'load');
        } else if (command.substring(0, 4) === 'back') {
          window.history.back();
        } else if (command.substring(0, 8) === 'rootBack') {
          window.history.back();
        } else if (command.substring(0, 8) === 'present:') {
          var _data = {};
          var params = (window.location.search.split('?')[1] || '').split('&');
          for (var param in params) {
            if (params.hasOwnProperty(param)) {
              var paramParts = params[param].split('=');
              _data[paramParts[0]] = decodeURIComponent(paramParts[1] || '');
            }
          }
          if (_data.heropage) {
            window.presentedPage = _data.heropage;
          }
          window.APP.gotoPage(command.substring(8, command.length), 'present');
        } else if (command.substring(0, 7) === 'dismiss') {
          if (window.presentedPage) {
            window.APP.gotoPage(window.presentedPage);
            window.presentedPage = '';
          } else {
            window.history.back();
          }
        } else if (command.substring(0, 6) === 'submit') {
          //todo
        }
      } else if (command.hasOwnProperty('showMenu')) {
        var showMenu = command.showMenu;
        window.APP.showLeftmenu(showMenu);
      } else if (command.show) {
        if (command.show.action || command.show.cancelAction) {
          var confirm = document.createElement('hero-confirm');
          confirm.controller = this;
          confirm.in({
            text: command.show.content || '',
            action: command.show.action,
            cancelAction: command.show.cancelAction,
          });
          this.heroContent.appendChild(confirm);
        } else if (command.show.title || command.show.content) {
          var alert = document.createElement('hero-alert');
          alert.controller = this;
          alert.in({ text: command.show.title || command.show.content });
          this.heroContent.appendChild(alert);
        } else if (command.show.class) {
          var dialog = document.createElement('hero-dialog');
          dialog.controller = this;
          dialog.in({ str: JSON.stringify(command.show) });
          document.body.appendChild(dialog);
        }
      } else if (command.delay) {
        var delayObj = command.delay;
        var delayTime = command.delayTime;
        var that = this;
        setTimeout(function() {
          that.on(delayObj);
        }, delayTime);
      } else if (command.viewWillAppear) {
        this.appearObject = command.viewWillAppear;
      }
      // else if (command.viewWillDisappear) {

      // }
    } else {
      if (window.APP.mobile) {
        this.controller.in(json);
      }else{
        for (var i = 0; i < window.Heros.length; i++) {
          window.Heros[i].in(json);
        };
      }
    }
  }
}
