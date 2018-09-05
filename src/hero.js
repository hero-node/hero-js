/*
  Hero.js
  Hero

  Created by gpliu on 14/10/16.
  Copyright (c) 2015年 GPLIU. All rights reserved.
*/

// Hero base

var HeroAppClz = customElements.get('hero-app');
if(!HeroAppClz){
  window.location.replace(window.location.origin+'/index.html?heropage='+window.location.href);
}

Hero = {};
Hero.ui;
Hero.ui2Data={};
Hero.initData;
Hero.name = window.location.href.match(/[^(/index)][A-Za-z0-9_-]+.html/)[0];
Hero.deviceType = (navigator.userAgent.toLowerCase().indexOf("hero-ios") > 0)?'IOS': (navigator.userAgent.toLowerCase().indexOf("hero-android") > 0)?'ANDROID':(navigator.userAgent.toLowerCase().indexOf("micromessenger") > 0)?'WECHAT':'PC';
Hero.on = function(msg){
    //page logic
};
Hero.viewWillAppear = function() {
};
Hero.viewWillDisappear = function() {
};
Hero.viewDidLoad = function() {
};
Hero.boot = function(){
    Hero.jsProcessUI(Hero.ui);
    Hero.observeUI(Hero.ui);
    Hero.out({'ui':Hero.ui});
    Hero.viewDidLoad();
};
document.onreadystatechange = function () {
  var state = document.readyState;
  if (state == 'complete') {

  }
};





//Hero utils function
Hero.connect = function(card)
{
    window._io = io.connect();
    window._io.on('message',function(data){
        Hero.out(data);
    });
};
Hero.disconnect = function()
{
    window._io.disconnect();
};
Hero.getInitData = function(){
    var _initData;
    if (localStorage.boot) {
        _initData = JSON.parse(localStorage.boot);
    };
    _initData = _initData || {};
    var params = (window.location.search.split('?')[1] || '').split('&');
    for(var param in params) {
        if (params.hasOwnProperty(param)){
            paramParts = params[param].split('=');
            _initData[paramParts[0]] = decodeURIComponent(paramParts[1] || "");
         }
    }
    return _initData;
};
Hero.getCookie = function(name) {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
},
Hero.contain = function(objs,obj){var i = objs.length;while (i--) {if (objs[i] === obj) {return true;}}return false;},
Hero.merge = function(o1,o2){for(var key in o2){o1[key]=o2[key]}return o1},
Hero.remove = function(arr,value) {if(!arr)return;var a = arr.indexOf(value);if (a >= 0){arr.splice(a, 1)}}
Hero.async = function(fun,second){
    setTimeout(function(){
        fun();
    },second*1000);
}
Hero.datas = function(data){Hero.out({datas:data})}
Hero.command = function(data){Hero.out({command:data})}
Hero.setChildPropertyByName = function(o,name,value){
    Object.keys(o).forEach(function(k){
        if (o[k].name === name){
            Hero.merge(o[k],value)
        }else if(typeof o[k] === 'object'){
            Hero.setChildPropertyByName(o[k],name,value)
        }
    })
}
Hero._outObjects = '';
Hero.outObjects = function(){
    return Hero._outObjects;
};
Hero.out = function(data)
{
    if (Hero.deviceType == 'IOS') {
        Hero._outObjects = JSON.stringify(data);
        var nativeObject = 'Hero://' + 'ready';
        var iframe = document.createElement('iframe');
        iframe.setAttribute('src', nativeObject);
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
    }else if(Hero.deviceType == 'IOS8'){
        window.webkit.messageHandlers.native.postMessage(data)
    }else if(Hero.deviceType == 'ANDROID'){
        if (typeof(data) === 'object') {
            data = JSON.stringify(data);
        };
        window.native.on(data);
    }else{
        Hero.page.on(data);
    }
};
Hero.in = function(data){
    if (typeof(data) === 'string') {
        data = JSON.parse(data);
    };
    if (data.socket) {
        window._io.emit('message', data.socket);
    }else if(data.http){
        data = data.http;
        var api = data.url;
        var success = data.success;
        var fail = data.fail;
		var apiData = data.data;
		for (var prop in apiData) {
			apiData[prop] = encodeURIComponent(apiData[prop]);
		}
        xhr({
            url:(api.search(/ttp/)>0?api:host+api),
            async:true,
            data:apiData,
            contentType:data.contentType,
            method:data.method?data.method:'GET',
            timeout:data.timeout?data.timeout:30000,
            success: function(data){
                if (typeof(data) === 'string') {
                    data = JSON.parse(data);
                };
                success(data);
            },
            error:function(data){
                fail(data);
            }
        });
    }else{
        if(data.name && data.value){
            Hero.ui2Data['_'+data.name] = data.value;
        }
        Hero.on(data);
    }
}
Hero.findUI = function(ui,func ){
    if (ui instanceof Array) {
        for (var i = 0; i < ui.length; i++) {
            func(ui[i]);
        };
    }
    if(ui.subViews){
        func(ui.subViews);
    }
    if(ui.views){
        func(ui.views);
    }
    if(ui.leftMenu){
        func(ui.leftMenu);
    }
    if(ui.footer){
        func(ui.footer);
    }
    if(ui.header){
        func(ui.header);
    }
}
Hero.observeUI = function(ui){
    Hero.findUI(ui,Hero.observeUI)
    if (ui.name) {
        Hero.ui2Data['_'+ui.name] = {};
        Hero.ui2Data.__defineSetter__(ui.name, function(v) {
            Hero.ui2Data['_'+ui.name] = v;
            var data = {name:ui.name};
            if (typeof v == 'string') {
                data.text = v;
            }else{
                Hero.merge(data,v);
            }
            Hero.out({datas:data});
        });
        Hero.ui2Data.__defineGetter__(ui.name, function() {
            return Hero.ui2Data['_'+ui.name];
        });
    };
};
Hero.jsProcessUI = function(ui){
    Hero.findUI(ui,Hero.jsProcessUI)
    if(ui.jsClass && window[ui.jsClass]){
        var t1 = JSON.parse(JSON.stringify(window[ui.jsClass]));
        var t2 = Hero.merge({},ui);
        Object.keys(t2).forEach(function(k){
            Hero.setChildPropertyByName(t1,k,t2[k]);
        });
        Hero.merge(ui,t1);
        Hero.merge(ui,t2);
        ui.jsClass = undefined;
        Hero.jsProcessUI(ui);
    }
};

document.onreadystatechange = function () {
  var state = document.readyState;
  if (state == 'complete') {
    if(Hero.deviceType === 'IOS' || Hero.deviceType === 'ANDROID'){
        Hero.boot();
    }
  }
};
