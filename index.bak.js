var host = window.location.origin;

window.host = host;
window.path = host + '/mkt/asset2cash'; // 如果url路径有前缀请加上;
localStorage.versionPath = path;
var ui;

window.ui = ui;

var loadedClass = [];

window.ui2Data = {};
(function () {
    var w = window;
    var _deviceType = 'PC';
    var _initData;
    var _outObjects;

    w.API = {
        outObjects: function () {
            if (_outObjects) {
                var str = '';

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
            if (_deviceType == 'IOS') {
                _outObjects = data;
                var nativeObject = 'hero://' +
                'ready';
                var iframe = document.createElement('iframe');

                iframe.setAttribute('src', nativeObject);
                document.documentElement.appendChild(iframe);
                iframe.parentNode.removeChild(iframe);
                iframe = null;
            } else if (_deviceType == 'IOS8') {
                window.webkit.messageHandlers.native.postMessage(data);
            } else if (_deviceType == 'ANDROID') {
                if (typeof (data) === 'object') {
                    data = JSON.stringify(data);
                }
                window.native.on(data);
            } else {
                API.page.on(data);
            }
        }, in: function (data) {
            if (typeof (data) === 'string') {
                data = JSON.parse(data);
            }
            if (data.http) {} else {
                if (data.name && data.value) {
                    ui2Data['_' + data.name] = data.value;
                }
                API.special_logic(data);
            }
        },
        deviceType: function () {
            return _deviceType;
        },
        setDeviceType: function (deviceType) {
            _deviceType = deviceType;
            if (ui !== 'blank') {
                API.out({ ui: ui });
            }
            if (_deviceType === 'IOS') {
                API.boot(_initData);
            } else if (_deviceType === 'ANDROID') {
                API.boot(_initData);
            } else {
                if (ui && ui.views) {
                    API.ui2Data(ui.views);
                }
                setTimeout(function () {
                    API.boot(_initData);
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

            for (var param in params) {
                if (params.hasOwnProperty(param)) {
                    paramParts = params[param].split('=');
                    _initData[paramParts[0]] = decodeURIComponent(paramParts[1] || '');
                }
            }
            return _initData;
        },
        ui2Data: function (observeUI) {
            if (observeUI instanceof Array) {
                for (var i = 0; i < observeUI.length; i++) {
                    API.ui2Data(observeUI[i]);
                }
            } else if (observeUI.subViews) {
                API.ui2Data(observeUI.subViews);
            }
            if (observeUI.name) {
                ui2Data['_' + observeUI.name] = '';
                ui2Data.__defineSetter__(observeUI.name, function (v) {
                    ui2Data['_' + observeUI.name] = v;
                    var data = {
                        name: observeUI.name
                    };

                    if (typeof v == 'string') {
                        data.text = v;
                    } else {
                        API.merge(data, v);
                    }
                    API.out({ datas: data });
                });
                ui2Data.__defineGetter__(observeUI.name, function () {
                    return ui2Data['_' + observeUI.name];
                });

            }
        },
        getDeviceType: function () {
            return _deviceType;
        }

    };
})();
