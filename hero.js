/** @class Hero */
var Hero = window.Hero = {};
var _outObjects = '';
var _currentPage = null;

window.ui = {};
window.ui2Data = {};

var _deviceType = 'PC';

function _mergeAttributes(o1, o2) {
    if (!o2) {
        return;
    }
    if (typeof o2 !== 'object') {
        return;
    }
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
                if (!v) {
                    return;
                }
                if (typeof v !== 'object') {
                    return;
                }
                Object.keys(v).forEach(function (key) {
                    data[key] = v[key];
                });
            }
            Hero.out({ datas: data });
        });
    }
}

function checkValidUsage(name, descriptor) {
    if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, 'writable')) {
        throw new Error('Invalid usage of @' + name + '. Expected @' + name + ' without any expression. For Example: \n\n@' + name + '\ncallback(){\n   \/\/Todo\n}\n');
    }
}

/**
 * JS代码往组件发送视图更新数据
 * @alias Hero.out
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
        window.ui2Data[data.name] = data.value;
    }
    Hero.__beforeMessage.call(_currentPage, data);
    Hero.__messageList.forEach(function (expressions) {
        var matchCondition = false;

        if (typeof expressions.condition === 'function') {
            matchCondition = expressions.condition.call(_currentPage, data);
        } else if (typeof expressions.condition === 'boolean') {
            matchCondition = expressions.condition;
        }

        if (matchCondition) {
            expressions.callback.call(_currentPage, data);
        }
    });
    Hero.__afterMessage.call(_currentPage, data);
}
 /**
  * @description
  Define the interceptor before [`@Message`]{@link Message} invoked.
  ```javascript
  * import { BeforeMessage, Component, Message } from 'hero-js';
  *
  * &#64Component()
  * export class DecoratePage {
  *
  *     &#64BeforeMessage
  *     before(data) {
  *         console.log('Checking data is valid...', data);
  *     }
  *
  *     &#64Message(function(data){
  *       return data.click && data.click === "login";
  *     })
  *     login(data) {
  *         console.log('Sending Request...');
  *     }
  *
  * }
  ```
  */
function BeforeMessage(target, name, descriptor) {
    checkValidUsage('BeforeMessage', descriptor);
    Hero.__beforeMessage = target[name];
    // Only one callback method
    descriptor.writable = false;
    return descriptor;
}
 /**
  * @description
  * Define the interceptor after [`@Message`]{@link Message} invoked.
  ```javascript
  * import { AfterMessage, Component, Message } from 'hero-js';
  *
  * &#64Component()
  * export class DecoratePage {
  *
  *     &#64Message(function(data){
  *       return data.click && data.click === "login";
  *     })
  *     login(data) {
  *         console.log('Sending Request...');
  *     }
  *
  *     &#64AfterMessage
  *     after(data) {
  *       console.log('Checking consistence of data...', data);
  *     }
  *
  * }
  ```
  */
function AfterMessage(target, name, descriptor) {
    checkValidUsage('AfterMessage', descriptor);
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
var emptyObject = { view: '' };

function bootstrap() {

    if (window.ui !== 'blank') {
        sendMessage({ ui: window.ui });
    }
    if (window.ui && window.ui.views) {
        view2Data(window.ui.views);
    }
    Hero.__boot.call(_currentPage);

}

(function () {
    var ua = navigator.userAgent.toLowerCase();

    if (ua.indexOf('hero-ios') !== -1) {
        _deviceType = 'IOS';
    } else if (ua.indexOf('hero-android') !== -1) {
        _deviceType = 'ANDROID';
    } else if (ua.indexOf('micromessenger') !== -1) {
        _deviceType = 'WECHAT';
    }
    return _deviceType;
})();

function getDeviceType() {
    return _deviceType;
}

 /**
  * @description
  * Mark current `class` as a component which cause an instance of the class created automatically.
  ```javascript
  * import { Component } from 'hero-js';
  *
  * &#64Component()
  * export class DecoratePage {
  *
  * }
  ```
  * @param {object} config configurations of the marked class. Valid Attributes:
  *
  * `view` The layout of the Component
  *
  ```javascript
  * &#64Component({
  *   view: {
  *     version:0,
  *     backgroundColor:'ffffff',
  *     nav:{
  *       title:'Home Page',
  *       navigationBarHiddenH5:true,
  *     },
  *     views:
  *     [
  *       {
  *         'class':'HeroWebView',
  *         name:'webview',
  *         frame:{w:'1x',h:'1x'}
  *       },
  *     ]
  *   }
  * })
  ```
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
        if (getDeviceType() === 'ANDROID' || getDeviceType() === 'IOS') {
            bootstrap();
        } else {
            var logo = ' \n                                                                                                                                        \n                                                                                                                                        \n                                                                                                                                        \n                                                                                                                                        \n    @@@@@        @@@@@                                           @@@@@@@         @@@@@@                                                 \n    @@@@@        @@@@@                                           @@@@@@@         @@@@@@                                                 \n    @@@@@        @@@@@                                           @@@@@@@        @@@@@@@                                                 \n    @@@@@        @@@@@                                           @@@@@@@@       @@@@@@@                                                 \n    @@@@@        @@@@@                                           @@@@@@@@       @@@@@@@                                                 \n    @@@@@        @@@@@                                           @@@@@@@@      @@@@@@@@                                                 \n    @@@@@        @@@@@                                           @@@@ @@@@     @@@@@@@@                                                 \n    @@@@@@@@@@@@@@@@@@                                           @@@@ @@@@     @@@ @@@@                                                 \n    @@@@@@@@@@@@@@@@@@                                           @@@@ @@@@    @@@@ @@@@                                                 \n    @@@@@@@@@@@@@@@@@@                          @@               @@@@  @@@@   @@@@ @@@@       @@                                        \n    @@@@@@@@@@@@@@@@@@   @@@@@@@  @@@@@@@@    @@@@@@             @@@@  @@@@   @@@@ @@@@    @@@@@@@   @@@@@@@@  @@@  @@      @@@@@@@@    \n    @@@@@@@@@@@@@@@@@@   @@@@@@@  @@@  @@@   @@@  @@@            @@@@  @@@@  @@@@  @@@@    @@@  @@@  @@@  @@@  @@@  @@      @@@@@@@@    \n    @@@@@        @@@@@   @@       @@    @@   @@    @@@           @@@@   @@@@ @@@@  @@@@   @@@    @@  @@@   @@  @@@  @@      @@@         \n    @@@@@        @@@@@   @@       @@    @@  @@@     @@  @@@@@@   @@@@   @@@@ @@@   @@@@   @@     @@@ @@@   @@  @@@  @@      @@@         \n    @@@@@        @@@@@   @@@@@@@  @@@@@@@   @@@     @@  @@@@@@   @@@@   @@@@@@@@   @@@@   @@     @@@ @@@@@@@   @@@  @@      @@@@@@@     \n    @@@@@        @@@@@   @@@@@@@  @@@@@@@   @@@     @@  @@@@@@   @@@@    @@@@@@@   @@@@   @@     @@@ @@@   @@  @@@  @@      @@@@@@@     \n    @@@@@        @@@@@   @@       @@   @@@  @@@    @@@           @@@@    @@@@@@    @@@@   @@     @@  @@@   @@@ @@@  @@      @@@         \n    @@@@@        @@@@@   @@       @@    @@   @@@   @@            @@@@    @@@@@@    @@@@   @@@   @@@  @@@   @@@ @@@  @@      @@@         \n    @@@@@        @@@@@   @@@@@@@@ @@    @@@  @@@@@@@@            @@@@     @@@@@    @@@@    @@@@@@@   @@@@@@@@  @@@  @@@@@@@ @@@@@@@@    \n    @@@@@        @@@@@   @@@@@@@@ @@@   @@@    @@@@@             @@@@@    @@@@     @@@@     @@@@@    @@@@@@@   @@@  @@@@@@@ @@@@@@@@    \n                                                                                                                                        \n                                                                                                                                        \n ';

            console.log(logo);
        }
        if (typeof config === 'object') {
            defineReadOnlyProp(Hero, '__heroConfig', config);
        } else {
            console.warn('Invalid Parameters: Parameters in @Component should be Object');
        }
    };
}
 /**
  * @description
  * Callback method before page will appear.
  ```javascript
  * import { Component, ViewWillAppear } from 'hero-js';
  *
  * &#64Component()
  * export class DecoratePage {
  *   &#64ViewWillAppear
  *   beforePageAppear(){
  *     console.log('Page will appear...')
  *   }
  * }
  ```
  */
function ViewWillAppear(target, name, descriptor) {
    checkValidUsage('ViewWillAppear', descriptor);
    Hero.__viewWillAppear = target[name];
    // Only one callback method
    descriptor.writable = false;
    return descriptor;
}

/**
 * @description
 * Callback method when page will disappear.
 ```javascript
 * import { Component, ViewWillDisappear } from 'hero-js';
 *
 * &#64Component()
 * export class DecoratePage {
 *   &#64ViewWillDisappear
 *   pageWillDisappear(){
 *     console.log('Page will disappear...')
 *   }
 * }
 ```
 */
function ViewWillDisappear(target, name, descriptor) {
    checkValidUsage('ViewWillDisappear', descriptor);
    Hero.__viewWillDisppear = target[name];
    // Only one callback method
    descriptor.writable = false;
    return descriptor;
}

/**
 * @description
 * Callback method when page bootstrap. This method executed before [`@ViewWillAppear`]{@link ViewWillAppear}. <br>1. In Browser Environment: this method will executed every time when page loaded.<br> 2. In Native Environment: this method execute one time only.
```javascript
 *import { Boot, Component } from 'hero-js';
 *
 * &#64Component()
 * export class DecoratePage {
 *  &#64Boot
 *  start(){
 *    console.log('Bootstrap Successfully!')
 *  }
 * }
 ```
 */
function Boot(target, name, descriptor) {
    checkValidUsage('Boot', descriptor);
    Hero.__boot = target[name];
    // Only one boot callback method
    descriptor.writable = false;
    return descriptor;
}

/**
 * @description
 * Handle messages sent from NativeApp to JS. Given the condition, whether invoke the decorated function or not.
```javascript
* import { Component, Message } from 'hero-js';
*
* &#64Component({
*   view: {
*             version:0,
*             backgroundColor:'ffffff',
*             nav:{
*                 navigationBarHiddenH5:true
*             },
*             views:[
*                 {
*                     class:'DRTextField',
*                     type:'phone',
*                     theme:'green',
*                     frame:{x:'15',r:'15',y:'115',h:'50'},
*                     placeHolder:'手机号码',
*                     name:'phone',
*                     textFieldDidEditing:{name:'phone'},
*                 },
*                 {
*                     class:'DRTextField',
*                     theme:'green',
*                     frame:{x:'15',r:'15',y:'178',h:'50'},
*                     placeHolder:'密码',
*                     secure:true,
*                     name:'password',
*                     drSecure:{'secure':true}, // 带小眼睛
*                     textFieldDidEditing:{name:'password'},
*                 },
*                 {
*                     class:'DRButton',
*                     name:'loginBtn',
*                     DRStyle:'B1',
*                     enable:false,
*                     frame:{x:'15',r:'15',y:'0',h:'44'},
*                     yOffset:'password+50',
*                     title:'登录',
*                     // define the message sent from NativeApp to JS when the button click.
*                     click:{click:'login'}
*                 },
*             ]
*
*   }
* })
* export class DecoratePage {
*
*     // Receive the message from NativeApp
*     &#64Message(function(data){
*       // whether call the login method according to the result of this function
*       return data.click && data.click === "login";
*     })
*     login(data) {
*       console.log('Send request...');
*     }
* }

 ```
 * @param {function} condition - `condition` function and the decorated function `callback` has one argument: <br> `data`: The message sent from NativeApp.
 *
 * if condition is `function`, decorated function `callback` invoked when the result of condition equals to true.<br>
 ```javascript
 * &#64Message(function(data){
 *   // condition function
 *   function checkCondition(data){
 *      return true;
 *   }
 *   return checkCondition(data);
 * })
 * callback(data) {
 *   // decorated function
 *   console.log('Send request...');
 * }
 ```
 *
 * if condition equals `undefined`, the decorated method `callback` will always invoked.
 ```
 * &#64Message()
 * callback(data){
 *  console.log('Received Data:', data);
 *}
 ```
 * Equals to
 ```
 * &#64Message(function(data){
 *  return true;
 * })
 * callback(data){
 *  console.log('Received Data:', data);
 *}
 ```
 */
function Message(condition) {

    var validCondition = true;

    if (typeof condition !== 'function' && typeof condition !== 'undefined') {
        console.warn('Invalid Usage of @Message(' + condition + ')');
        validCondition = false;
    }

    return function (target, name, descriptor) {
        if (validCondition) {
            Hero.__messageList.push({
                condition: condition ? condition : true,
                callback: target[name]
            });
        }
        return descriptor;
    };
}

function getUI() {
    return window.ui;
}

/**
 * @memberof Hero
 * @return {object} 返回当前页面中的每个元素及组件的状态数据
 */
function getState() {
    return window.ui2Data;
}
/**
 * 设置当前页面中的元素及组件的状态
 * @memberof Hero
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


function __viewWillDisppearCallback() {
    Hero.__viewWillDisppear.call(_currentPage);
}
function __viewWillAppearCallback() {
    Hero.__viewWillAppear.call(_currentPage);
}

defineProp(Hero, '__heroConfig', {});
defineProp(Hero, '__boot', loop);
defineProp(Hero, '__viewWillDisppear', loop);
defineProp(Hero, '__viewWillAppear', loop);

// Legacy Name
defineReadOnlyProp(Hero, 'viewWillDisppear', __viewWillDisppearCallback);
defineReadOnlyProp(Hero, 'viewWillAppear', __viewWillAppearCallback);

defineProp(Hero, '__beforeMessage', loop);
defineProp(Hero, '__afterMessage', loop);

defineReadOnlyProp(Hero, '__messageList', []);

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
