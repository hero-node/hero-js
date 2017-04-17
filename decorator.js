var API = window.API = {};
var _outObjects = '';

window.ui = {};
window.ui2Data = {};

var _deviceType = 'PC';

function view2Data(observeUI) {
    var i;

    if (observeUI instanceof Array) {
        for (i = 0; i < observeUI.length; i++) {
            view2Data(observeUI[i]);
        }
    } else if (observeUI.subViews) {
        view2Data(observeUI.subViews);
    }
    if (observeUI.name) {
        window.ui2Data['_' + observeUI.name] = '';
        window.ui2Data.__defineSetter__(observeUI.name, function (v) {
            window.ui2Data['_' + observeUI.name] = v;
            var data = { name: observeUI.name };

            if (typeof v == 'string') {
                data.text = v;
            } else {
                API.merge(data, v);
                Object.keys(v).forEach(function (key) {
                    data[key] = v[key];
                });
            }
            API.out({ datas: data });
        });
        window.ui2Data.__defineGetter__(observeUI.name, function () {
            return window.ui2Data['_' + observeUI.name];
        });

    }
}

function sendMessage(data) {
    var iframe;

    if (_deviceType === 'IOS') {
        _outObjects = data;
        iframe = document.createElement('iframe');
        iframe.setAttribute('src', 'hero://ready');

        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;

    } else if (_deviceType === 'IOS8') {
        window.webkit.messageHandlers.native.postMessage(data);
    } else if (_deviceType === 'ANDROID') {
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }
        window.native.on(data);
    } else {
        window.API.page.on(data);
    }
}


function loop() {}

function outObjects() {
    var messages = '';

    if (_outObjects) {
        if (typeof _outObjects === 'string') {
            messages = _outObjects;
        } else {
            messages = JSON.stringify(_outObjects);
        }
        _outObjects = '';
    }

    return messages;
}


function onMessage(data) {
    if (typeof data === 'string') {
        data = JSON.parse(data);
    }

    if (data.name && data.value) {
        window.ui2Data['_' + data.name] = data.value;
    }
    Object.keys(API.__messageList).forEach(function (event) {
        if (data.type === event) {
            API.__messageList[event].forEach(function (callback) {
                API.__beforeMessage.call(null);
                callback.call(null, data);
                API.__afterMessage.call(null);
            });
        }
    });
}

function beforeMessage(target, name, descriptor) {
    API.__beforeMessage = target[name];
    // Only one callback method
    descriptor.writable = false;
    return descriptor;
}

function afterMessage(target, name, descriptor) {
    API.__afterMessage = target[name];
    // Only one callback method
    descriptor.writable = false;
    return descriptor;
}

function definePublicFreezeProp(obj, name, value) {
    Object.defineProperty(obj, name, {
        enumerable: true,
        configurable: false,
        writable: false,
        value: value
    });
}
function defineProp(obj, name, value, isEnumerable) {
    Object.defineProperty(obj, name, {
        enumerable: !!isEnumerable,
        configurable: false,
        writable: true,
        value: value
    });
}
function defineReadOnlyProp(obj, name, value) {
    Object.defineProperty(obj, name, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: value
    });
}

function Component(config) {
    return function (target) {
        if (config && typeof config === 'object') {
            defineReadOnlyProp(API, '__heroConfig', config);
        } else {
            console.warn('Invalid Parameters: Parameters in @Component should be Object');
        }
        return target;
    };
}


function ViewWillAppear(target, name, descriptor) {
    API.__viewWillAppear = target[name];
    // Only one callback method
    descriptor.writable = false;
    return descriptor;
}


function ViewWillDisappear(target, name, descriptor) {
    API.__viewWillDisppear = target[name];
    // Only one callback method
    descriptor.writable = false;
    return descriptor;
}


function Boot(target, name, descriptor) {
    API.__boot = target[name];
    // Only one boot callback method
    descriptor.writable = false;
    return descriptor;
}


function Message(eventType) {
    if (!API.__messageList[eventType]) {
        API.__messageList[eventType] = [];
    }
    return function (target, name, descriptor) {
        API.__messageList[eventType].push(target[name]);
        return descriptor;
    };
}

function resetUI(ui) {
    window.ui = ui;
}

function getUI() {
    return window.ui;
}

function getState() {
    return window.ui2Data;
}
function setState(status) {
    if (!status) {
        return;
    }
    if (typeof status !== 'object') {
        return;
    }
    Object.keys(status).forEach(function (key) {
        window.ui2Data[key] = status[key];
    });
}

defineProp(API, '__heroConfig', {});
defineProp(API, '__boot', loop);
defineProp(API, '__viewWillDisppear', loop);
defineProp(API, '__viewWillAppear', loop);

defineProp(API, '__beforeMessage', loop);
defineProp(API, '__afterMessage', loop);

defineReadOnlyProp(API, '__messageList', {});

definePublicFreezeProp(API, 'out', sendMessage);
definePublicFreezeProp(API, 'outObjects', outObjects);
definePublicFreezeProp(API, 'setState', setState);
definePublicFreezeProp(API, 'updateView', view2Data);
definePublicFreezeProp(API, 'boot', API.__boot);
definePublicFreezeProp(API, 'resetUI', resetUI);
definePublicFreezeProp(API, 'setState', setState);
definePublicFreezeProp(API, 'getState', getState);
definePublicFreezeProp(API, 'getUI', getUI);
definePublicFreezeProp(API, 'in', onMessage);

(function getDeviceType() {
    var ua = navigator.userAgent.toLowerCase();

    if (ua.indexOf('hero-ios') !== -1) {
        _deviceType = 'IOS';
    } else if (ua.indexOf('hero-android') !== -1) {
        _deviceType = 'ANDROID';
    } else if (ua.indexOf('micromessenger') !== -1) {
        _deviceType = 'WECHAT';
    }

})();

(function bootstrap() {
    if (window.ui !== 'blank') {
        sendMessage({ ui: window.ui });
    }

    if (window.ui && window.ui.views) {
        view2Data(window.ui.views);
    }

    var isRunInApp = (_deviceType === 'IOS' || _deviceType === 'ANDROID');

    setTimeout(function () {
        API.__boot();
    }, isRunInApp ? 0 : 500);

})();

module.exports = {
    Component: Component,
    Boot: Boot,
    Message: Message,
    ViewWillAppear: ViewWillAppear,
    ViewWillDisappear: ViewWillDisappear,
    beforeMessage: beforeMessage,
    onMessage: onMessage,
    afterMessage: afterMessage,
    API: API
};
