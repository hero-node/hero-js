/*
  Hero.js
  Hero

  Created by gpliu on 14/10/16.
  Copyright (c) 2015年 GPLIU. All rights reserved.
*/

// Hero base
(function() {
  var hero = (window.Hero = {});
  hero.ui = {};
  hero.ui2Data = {};
  hero.initData;
  hero.name = window.location.href.match(/[^(/index)][A-Za-z0-9_-]+.html/)[0];
  hero.deviceType =
    navigator.userAgent.toLowerCase().indexOf('hero-ios') > 0
      ? 'IOS'
      : navigator.userAgent.toLowerCase().indexOf('hero-android') > 0
        ? 'ANDROID'
        : navigator.userAgent.toLowerCase().indexOf('micromessenger') > 0
          ? 'WECHAT'
          : 'PC';
  if (hero.deviceType === 'PC' || hero.deviceType === 'WECHAT') {
    var heroAppClz = customElements.get('hero-app');
    if (!heroAppClz) {
      window.location.replace(
        window.location.origin + '/index.html?heropage=' + window.location.href
      );
    }
  }
  hero.on = function(msg) {
    //page logic
  };
  hero.viewWillAppear = function() {};
  hero.viewWillDisappear = function() {};
  hero.viewDidLoad = function() {};
  hero.boot = function() {
    hero.jsProcessUI(hero.ui);
    hero.observeUI(hero.ui);
    hero.out({ ui: hero.ui });
    hero.viewDidLoad();
  };
  document.onreadystatechange = function() {
    var state = document.readyState;
    if (state == 'complete') {
    }
  };

  //Hero utils function
  hero.connect = function(card) {
    window._io = io.connect();
    window._io.on('message', function(data) {
      hero.out(data);
    });
  };
  hero.disconnect = function() {
    window._io.disconnect();
  };
  hero.getInitData = function() {
    var _initData;
    if (localStorage.boot) {
      _initData = JSON.parse(localStorage.boot);
    }
    _initData = _initData || {};
    var params = (window.location.search.split('?')[1] || '').split('&');
    for (var param in params) {
      if (params.hasOwnProperty(param)) {
        paramParts = params[param].split('=');
        _initData[paramParts[0]] = decodeURIComponent(paramParts[1] || '');
      }
    }
    return _initData;
  };
  (hero.getCookie = function(name) {
    var arr,
      reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
    else return null;
  }),
    (hero.contain = function(objs, obj) {
      var i = objs.length;
      while (i--) {
        if (objs[i] === obj) {
          return true;
        }
      }
      return false;
    }),
    (hero.merge = function(o1, o2) {
      for (var key in o2) {
        o1[key] = o2[key];
      }
      return o1;
    }),
    (hero.remove = function(arr, value) {
      if (!arr) return;
      var a = arr.indexOf(value);
      if (a >= 0) {
        arr.splice(a, 1);
      }
    });
  hero.async = function(fun, second) {
    setTimeout(function() {
      fun();
    }, second * 1000);
  };
  hero.datas = function(data) {
    hero.out({ datas: data });
  };
  hero.command = function(data) {
    hero.out({ command: data });
  };
  hero.setChildPropertyByName = function(o, name, value) {
    Object.keys(o).forEach(function(k) {
      if (o[k].name === name) {
        hero.merge(o[k], value);
      } else if (typeof o[k] === 'object') {
        hero.setChildPropertyByName(o[k], name, value);
      }
    });
  };
  hero._outObjects = '';
  hero.outObjects = function() {
    return hero._outObjects;
  };
  hero.out = function(data) {
    if (hero.deviceType == 'IOS') {
      hero._outObjects = JSON.stringify(data);
      var nativeObject = 'Hero://' + 'ready';
      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', nativeObject);
      document.documentElement.appendChild(iframe);
      iframe.parentNode.removeChild(iframe);
      iframe = null;
    } else if (hero.deviceType == 'IOS8') {
      window.webkit.messageHandlers.native.postMessage(data);
    } else if (hero.deviceType == 'ANDROID') {
      if (typeof data === 'object') {
        data = JSON.stringify(data);
      }
      window.native.on(data);
    } else {
      hero.page.on(data);
    }
  };
  hero.in = function(data) {
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    if (data.socket) {
      window._io.emit('message', data.socket);
    } else if (data.http) {
      data = data.http;
      var api = data.url;
      var success = data.success;
      var fail = data.fail;
      var apiData = data.data;
      for (var prop in apiData) {
        apiData[prop] = encodeURIComponent(apiData[prop]);
      }
      xhr({
        url: api.search(/ttp/) > 0 ? api : host + api,
        async: true,
        data: apiData,
        contentType: data.contentType,
        method: data.method ? data.method : 'GET',
        timeout: data.timeout ? data.timeout : 30000,
        success: function(data) {
          if (typeof data === 'string') {
            data = JSON.parse(data);
          }
          success(data);
        },
        error: function(data) {
          fail(data);
        },
      });
    } else {
      if (data.name && data.value) {
        hero.ui2Data['_' + data.name] = data.value;
      }
      hero.on(data);
    }
  };
  hero.findUI = function(ui, func) {
    if (ui instanceof Array) {
      for (var i = 0; i < ui.length; i++) {
        func(ui[i]);
      }
    }
    if (ui.subViews) {
      func(ui.subViews);
    }
    if (ui.views) {
      func(ui.views);
    }
    if (ui.leftMenu) {
      func(ui.leftMenu);
    }
    if (ui.footer) {
      func(ui.footer);
    }
    if (ui.header) {
      func(ui.header);
    }
  };
  hero.observeUI = function(ui) {
    hero.findUI(ui, hero.observeUI);
    if (ui.name) {
      hero.ui2Data['_' + ui.name] = null;
      hero.ui2Data.__defineSetter__(ui.name, function(v) {
        if (hero.ui2Data['_' + ui.name] != v) {
          hero.ui2Data['_' + ui.name] = v;
          var data = { name: ui.name };
          if (typeof v == 'string') {
            data.text = v;
          } else {
            hero.merge(data, v);
          }
          hero.out({ datas: data });
        }
      });
      hero.ui2Data[ui.name] = ui.text;

      hero.ui2Data.__defineGetter__(ui.name, function() {
        return hero.ui2Data['_' + ui.name];
      });
    }
  };
  hero.jsProcessUI = function(ui) {
    hero.findUI(ui, hero.jsProcessUI);
    if (ui.jsClass && window[ui.jsClass]) {
      var t1 = JSON.parse(JSON.stringify(window[ui.jsClass]));
      var t2 = hero.merge({}, ui);
      Object.keys(t2).forEach(function(k) {
        hero.setChildPropertyByName(t1, k, t2[k]);
      });
      hero.merge(ui, t1);
      hero.merge(ui, t2);
      ui.jsClass = undefined;
      hero.jsProcessUI(ui);
    }
  };

  document.onreadystatechange = function() {
    var state = document.readyState;
    if (state == 'complete') {
      if (hero.deviceType === 'IOS' || hero.deviceType === 'ANDROID') {
        hero.boot();
      }
    }
  };
})();
