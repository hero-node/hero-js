window.ui2Data = {};

var w = window;
var _deviceType = 'PC';
var _initData;
var _outObjects;

w.API = {
    outObjects: function () {
        var str = '';

        if (_outObjects) {

            if (typeof (_outObjects) === 'string') {
                str = _outObjects;
            } else {
                str = JSON.stringify(_outObjects);
            }
            _outObjects = '';
            return str;
        } else {
            return '';
        }
    },
    out: function (data) {
        var nativeObject, iframe;

        if (_deviceType === 'IOS') {
            _outObjects = data;
            nativeObject = 'hero://' + 'ready';

            iframe = document.createElement('iframe');

            iframe.setAttribute('src', nativeObject);
            document.documentElement.appendChild(iframe);
            iframe.parentNode.removeChild(iframe);
            iframe = null;

        } else if (_deviceType === 'IOS8') {
            window.webkit.messageHandlers.native.postMessage(data);
        } else if (_deviceType === 'ANDROID') {
            if (typeof (data) === 'object') {
                data = JSON.stringify(data);
            }
            window.native.on(data);
        } else {
            window.API.page.on(data);
        }
    },
    in: function (data) {
        if (typeof (data) === 'string') {
            data = JSON.parse(data);
        }

        if (data.name && data.value) {
            window.ui2Data['_' + data.name] = data.value;
        }
        window.API.special_logic(data);
    },
    deviceType: function () {
        return _deviceType;
    },
    setDeviceType: function (deviceType) {
        _deviceType = deviceType;
        if (window.ui !== 'blank') {
            window.API.out({ ui: window.ui });
        }
        if (_deviceType === 'IOS') {
            window.API.boot(_initData);
        } else if (_deviceType === 'ANDROID') {
            window.API.boot(_initData);
        } else {
            if (window.ui && window.ui.views) {
                window.API.ui2Data(window.ui.views);
            }
            setTimeout(function () {
                window.API.boot(_initData);
            }, 500);
        }
    },
    getInitData: function () {
        if (localStorage.boot) {
            _initData = JSON.parse(localStorage.boot);
            localStorage.boot = '';
        }
        _initData = _initData || {};
        var params = (window.location.search.split('?')[1] || '').split('&');

        var param, paramParts;

        for (param in params) {
            if (params.hasOwnProperty(param)) {
                paramParts = params[param].split('=');
                _initData[paramParts[0]] = decodeURIComponent(paramParts[1] || '');
            }
        }
        return _initData;
    },
    ui2Data: function (observeUI) {
        var i;

        if (observeUI instanceof Array) {
            for (i = 0; i < observeUI.length; i++) {
                window.API.ui2Data(observeUI[i]);
            }
        } else if (observeUI.subViews) {
            window.API.ui2Data(observeUI.subViews);
        }
        if (observeUI.name) {
            window.ui2Data['_' + observeUI.name] = '';
            window.ui2Data.__defineSetter__(observeUI.name, function (v) {
                window.ui2Data['_' + observeUI.name] = v;
                var data = {
                    name: observeUI.name
                };

                if (typeof v == 'string') {
                    data.text = v;
                } else {
                    window.API.merge(data, v);
                }
                window.API.out({ datas: data });
            });
            window.ui2Data.__defineGetter__(observeUI.name, function () {
                return window.ui2Data['_' + observeUI.name];
            });

        }
    },
    getDeviceType: function () {
        return _deviceType;
    },
    contain: function (objs, obj) {
        var i = objs.length;

        while (i--) {
            if (objs[i] === obj) {
                return true;
            }
        }
        return false;
    },
    merge: function (o1, o2) {
        var key;

        // eslint-disable-next-line
        for (key in o2) {
            o1[key] = o2[key];
        }
        return o1;
    },
    remove: function (arr, value) {
        if (!arr) {
            return;
        }
        var a = arr.indexOf(value);

        if (a >= 0) {
            arr.splice(a, 1);
        }
    }
};
