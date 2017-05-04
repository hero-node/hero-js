/**
 * Pants module.
 * @module hero-js/Hero
 */

 /**
  * Solves equations of the form a * x = b
  * @description
  ```
  * import { Component, Boot } from 'hero-js';
  *
  * var defaultUIViews = {
  *   version:0,
  *   backgroundColor:'ffffff',
  *   nav:{
  *     title:'Home Page',
  *     navigationBarHiddenH5:true,
  *   },
  *   views:
  *   [
  *     {
  *       'class':'HeroWebView',
  *       name:'webview',
  *       frame:{w:'1x',h:'1x'}
  *     },
  *   ]
  * }
  * &#64Component({
  *   view: defaultUIViews
  * })
  * export class DecoratePage {
  *   &#64Boot
  *   boot(){
  *     console.log('Bootstrap Successfully!')
  *   }
  * }
  ```
  */

var Hero = window.Hero = {};
var _outObjects = '';
var _currentPage = null;

window.ui = {};
window.ui2Data = {};

var _deviceType = 'PC';

function _mergeAttributes(o1, o2) {
    var index;
    var keys = Object.keys(o2);

    for (index = 0; index < keys.length; index++) {
        o1[keys[index]] = o2[keys[index]];
    }
    return o1;
}

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
                _mergeAttributes(data, v);
                Object.keys(v).forEach(function (key) {
                    data[key] = v[key];
                });
            }
            Hero.out({ datas: data });
        });
        window.ui2Data.__defineGetter__(observeUI.name, function () {
            return window.ui2Data['_' + observeUI.name];
        });

    }
}


/**
 * JS代码往组件发送视图更新数据
 * @param {Object} data - 需要更新的视图数据
 */
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
        window.Hero.page.on(data);
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

// eslint-disable-next-line
function __executeExpression(expression, data, page) {
    // eslint-disable-next-line
    return (function (expression, __data, __page, window, Hero) {
        // eslint-disable-next-line
        var value = eval('expression');
        // eslint-disable-next-line
        value = eval(value);
        return value;
    })(expression, data, page, null, null);
}

function onMessage(data) {
    if (typeof (data) === 'string') {
        data = JSON.parse(data);
    }

    if (data.name && data.value) {
        window.ui2Data['_' + data.name] = data.value;
    }
    Hero.__beforeMessage.call(_currentPage, data);
    Object.keys(Hero.__messageList).forEach(function (expressions) {
        var matchCondition = __executeExpression(expressions, data, _currentPage);

        if (matchCondition) {
            Hero.__messageList[expressions].forEach(function (callback) {
                callback.call(_currentPage, data);
            });
        }
    });
    Hero.__afterMessage.call(_currentPage, data);
}
/**
 * 定义JS代码在执行消息回调方法之前需要执行的方法，参数同@Message
 */
function BeforeMessage(target, name, descriptor) {
    Hero.__beforeMessage = target[name];
    // Only one callback method
    descriptor.writable = false;
    return descriptor;
}
/**
 * 定义JS代码在执行消息回调方法成功后需要执行的方法，参数同@Message
 */
function AfterMessage(target, name, descriptor) {
    Hero.__afterMessage = target[name];
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


function resetUI(ui) {
    window.ui = ui;
}
var emptyObject = {};

/**
 * 定义当前页面为一个组件，所指定的类将会被自动创建一个实例
 * @param {object} config - 可以传入view参数，指定当前页面初始化时的界面数据
 *
 */
function Component(config) {
    return function (Target) {
        if (!config) {
            config = emptyObject;
        }
        if (config.view) {
            defineProp(Target, '__defaultViews', config.view);
            resetUI(config.view);
        }
        _currentPage = new Target();
        if (typeof config === 'object') {
            defineReadOnlyProp(Hero, '__heroConfig', config);
        } else {
            console.warn('Invalid Parameters: Parameters in @Component should be Object');
        }
    };
}

/**
 * 定义当前页面在渲染之前的回调
 */
function ViewWillAppear(target, name, descriptor) {
    Hero.__viewWillAppear = target[name];
    // Only one callback method
    descriptor.writable = false;
    return descriptor;
}

/**
 * 定义当前页面在离开之前的回调
 */
function ViewWillDisappear(target, name, descriptor) {
    Hero.__viewWillDisppear = target[name];
    // Only one callback method
    descriptor.writable = false;
    return descriptor;
}

/**
 * 定义当前页面启动时的回调方法
 */
function Boot(target, name, descriptor) {
    Hero.__boot = target[name];
    // Only one boot callback method
    descriptor.writable = false;
    return descriptor;
}

/**
 * 定义Native原生组件往JS代码发送消息时的回调方法，方法中的第一个参数为具体的消息内容
 * 如@Message('__data && __data.type="myMessage"')
 * @param {string} expressions - JS表达式，当该表达式执行结果为true时，会进入该回调，否则不进入该回调。
 *  表达式中可以使用__data来引用该消息内容
 */
function Message(expressions) {
    if (!Hero.__messageList[expressions]) {
        Hero.__messageList[expressions] = [];
    }
    return function (target, name, descriptor) {
        Hero.__messageList[expressions].push(target[name]);
        return descriptor;
    };
}

function getUI() {
    return window.ui;
}

/**
 *
 * @return {object} 返回当前页面中的每个元素及组件的状态数据
 */
function getState() {
    return window.ui2Data;
}
/**
 * 设置当前页面中的元素及组件的状态
 * @return {object} 对象中的key对应元素组件，value为更新后的值
 */
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


function bootstrap() {

    if (window.ui !== 'blank') {
        sendMessage({ ui: window.ui });
    }

    if (window.ui && window.ui.views) {
        view2Data(window.ui.views);
    }

    // var isRunInApp = (_deviceType === 'IOS' || _deviceType === 'ANDROID');

    // setTimeout(function () {
    Hero.__boot.call(_currentPage);
    // }, isRunInApp ? 0 : 500);
}

function __viewWillDisppearCallback() {
    Hero.__viewWillDisppear.call(_currentPage);
}
function __viewWillAppearCallback() {
    Hero.__viewWillDisppear.call(_currentPage);
}
function _getDeviceType() {
    var ua = navigator.userAgent.toLowerCase();

    if (ua.indexOf('hero-ios') !== -1) {
        _deviceType = 'IOS';
    } else if (ua.indexOf('hero-android') !== -1) {
        _deviceType = 'ANDROID';
    } else if (ua.indexOf('micromessenger') !== -1) {
        _deviceType = 'WECHAT';
    }
}

function getDeviceType() {
    return _deviceType;
}

defineProp(Hero, '__heroConfig', {});
defineProp(Hero, '__boot', loop);
defineProp(Hero, '__viewWillDisppear', loop);
defineProp(Hero, '__viewWillAppear', loop);

definePublicFreezeProp(Hero, '__viewWillDisppearCallback', __viewWillDisppearCallback);
definePublicFreezeProp(Hero, '__viewWillAppearCallback', __viewWillAppearCallback);

defineProp(Hero, '__beforeMessage', loop);
defineProp(Hero, '__afterMessage', loop);

defineReadOnlyProp(Hero, '__messageList', {});

definePublicFreezeProp(Hero, 'boot', bootstrap);
// definePublicFreezeProp(Hero, 'bootstrap', bootstrap);
definePublicFreezeProp(Hero, 'getState', getState);
definePublicFreezeProp(Hero, 'getUI', getUI);
definePublicFreezeProp(Hero, 'in', onMessage);
definePublicFreezeProp(Hero, 'out', sendMessage);
definePublicFreezeProp(Hero, 'outObjects', outObjects);
definePublicFreezeProp(Hero, 'resetUI', resetUI);
definePublicFreezeProp(Hero, 'setState', setState);
definePublicFreezeProp(Hero, 'updateView', view2Data);
definePublicFreezeProp(Hero, 'getDeviceType', getDeviceType);

if (_getDeviceType() === 'PC') {
    bootstrap();
}

module.exports = {
    Component: Component,
    Boot: Boot,
    Message: Message,
    ViewWillAppear: ViewWillAppear,
    ViewWillDisappear: ViewWillDisappear,
    BeforeMessage: BeforeMessage,
    AfterMessage: AfterMessage,
    Hero: Hero
};
