/** @class Hero */
var Hero = window.Hero = {};
var _outObjects = '';
var _currentPage = null;
var _observeProperties = [];

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
        window.ui2Data.__defineGetter__(observeUI.name, function () {
            return window.ui2Data['_' + observeUI.name];
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

function onMessage(data) {
    if (typeof (data) === 'string') {
        data = JSON.parse(data);
    }

    if (data.name && data.value) {
        window.ui2Data['_' + data.name] = data.value;
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
 * Define a property.
 */
function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    });
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]
.forEach(function (method) {
  // cache original method
    var original = arrayProto[method];

    def(arrayMethods, method, function mutator() {
        var arguments$1 = arguments;

    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
        var i = arguments.length;
        var args = new Array(i);

        while (i--) {
            args[i] = arguments$1[i];
        }
        // eslint-disable-next-line
        var result = original.apply(this, args);
        // eslint-disable-next-line
        var ob = this.__ob__;
        var inserted;

        switch (method) {
            case 'push':
                inserted = args;
                break;
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
        }
        if (inserted) { ob.observeArray(inserted); }
    // notify change
        ob.dep.notify();
        return result;
    });
});

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

// can we use __proto__?
var hasProto = '__proto__' in {};
// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment(target, src) {
  /* eslint-disable no-proto */
    target.__proto__ = src;
  /* eslint-enable no-proto */
}
/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
function copyAugment(target, src, keys) {
    var i, l, key;

    for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];

        def(target, key, src[key]);
    }
}
/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}
var _toString = Object.prototype.toString;

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject(obj) {
    return _toString.call(obj) === '[object Object]';
}
/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;

function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer(value) {
    this.value = value;
    // this.dep = new Dep();
    // this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
        // eslint-disable-next-line
        var augment = hasProto ? protoAugment : copyAugment;

        augment(value, arrayMethods, arrayKeys);
        this.observeArray(value);
    } else {
        this.walk(value);
    }
};

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe(value) {
    if (!isObject(value)) {
        return;
    }
    var ob;

    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
    } else if (
      Object.isExtensible(value) &&
      (Array.isArray(value) || isPlainObject(value))
    ) {
        ob = new Observer(value);
    }
    //
    // if (asRootData && ob) {
    //     ob.vmCount++;
    // }
    return ob;
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1(
  obj,
  key,
  val,
  customSetter
) {
    // var dep = new Dep();

    var property = Object.getOwnPropertyDescriptor(obj, key);

    if (property && property.configurable === false) {
        return;
    }

  // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;

    // var childOb = observe(val);
    observe(val);

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            var value = getter ? getter.call(obj) : val;

            // if (Dep.target) {
            //     dep.depend();
            //     if (childOb) {
            //         childOb.dep.depend();
            //     }
            //     if (Array.isArray(value)) {
            //         dependArray(value);
            //     }
            // }
            return value;
        },
        set: function reactiveSetter(newVal) {
            var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */

            if (newVal === value || (newVal !== newVal && value !== value)) {
                return;
            }
      /* eslint-enable no-self-compare */
            if (customSetter) {
                customSetter();
            }
            if (setter) {
                setter.call(obj, newVal);
            } else {
                val = newVal;
            }
            // childOb = observe(newVal);
            observe(newVal);
            console.log('Set Value: Before=',  value, 'after', newVal);
        }
    });
}
/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk(obj) {
    var keys = Object.keys(obj);
    var i;

    for (i = 0; i < keys.length; i++) {
        defineReactive$$1(obj, keys[i], obj[keys[i]]);
    }
};
/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function (items) {
    var i, l;

    for (i = 0, l = items.length; i < l; i++) {
        observe(items[i]);
    }
};

// function _watchObject() {
//
// }

function traverseView(view, isRoot, callback) {
    if (!view) {
        return;
    }
    if (view.name) {
        callback && callback(view);
    }

    var attrName = isRoot ? 'views' : 'subViews';

    if (view[attrName]) {
        view[attrName].forEach(function (subV) {
            traverseView(subV, false, callback);
        });
    }
}
function _generate$Refs(view) {
    if (!view) {
        _currentPage.$refs = null;
        return;
    }
    var $refs = {};

    $refs.$root = view;

    traverseView(view, true, function (viewWithName) {
        $refs[viewWithName.name] = viewWithName;
    });
    return $refs;
}
var _rootElementVariable;

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

        var _viewUI;

        _currentPage = new Target();
        _observeProperties.forEach(function (attrName) {
            observe(_currentPage[attrName]);
        });
        if (config.template) {
            defineReadOnlyProp(Target.prototype, '__heroRender', config.template);
            _viewUI = _currentPage.__heroRender(_currentPage);
            resetUI(_viewUI);
            _currentPage.$refs = _generate$Refs(_viewUI);
        } else if (config.view) {
            defineProp(Target, '__defaultViews', config.view);
            resetUI(config.view);
        }
        var logo;

        _rootElementVariable = _currentPage.__heroRender._viewName;
        if (getDeviceType() === 'ANDROID' || getDeviceType() === 'IOS') {
            bootstrap();
        } else {
            logo = 'oo         oo     oooooooo     oooooooo           ooooo\n oo         oo     oooooooo     oooooooo         oo     oo \n oo         oo     oo           oo     oo       oo       oo \n oo         oo     oo           oo      oo     oo         oo \n oo         oo     oo           oo      oo    oo           oo \n oo         oo     oo           oo      oo    oo            oo \n oo         oo     oo           oo      oo   oo             oo \n oo         oo     oo           oo     oo    oo             oo \n ooooooooooooo     oooooooo     oooooooo     oo             oo \n ooooooooooooo     oooooooo     oooooooo     oo             oo \n oo         oo     oo           oo   oo      oo             oo \n oo         oo     oo           oo    oo     oo             oo \n oo         oo     oo           oo     oo    oo             oo \n oo         oo     oo           oo     oo     oo            oo \n oo         oo     oo           oo      oo    oo           oo \n oo         oo     oo           oo      oo     oo         oo \n oo         oo     oooooooo     oo      oo      oo      ooo \n oo         oo     oooooooo     oo       oo       oooooo ';

            console.log(logo);
        }
        if (typeof config === 'object') {
            defineReadOnlyProp(Hero, '__heroConfig', config);
        } else {
            console.warn('Invalid Parameters: Parameters in @Component should be Object');
        }
    };
}

function Observable(target, name, descriptor) {
    checkValidUsage('Observable', descriptor);
    _observeProperties.push(name);
    descriptor.writable = false;
    return descriptor;
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
var isArray = Array.isArray;

function isRegExp(value) {
    return toString.call(value) === '[object RegExp]';
}
function isFunction(value) { return typeof value === 'function'; }
function isDefined(value) { return typeof value !== 'undefined'; }

function isDate(value) {
    return toString.call(value) === '[object Date]';
}
function createMap() {
    return Object.create(null);
}

function equals(o1, o2) {
    if (o1 === o2) { return true; }
    if (o1 === null || o2 === null) { return false; }
    if (o1 !== o1 && o2 !== o2) { return true; } // NaN === NaN
    var t1 = typeof o1, t2 = typeof o2, length, key, keySet;

    if (t1 === t2 && t1 === 'object') {
        if (isArray(o1)) {
            if (!isArray(o2)) { return false; }
            if ((length = o1.length) === o2.length) {
                for (key = 0; key < length; key++) {
                    if (!equals(o1[key], o2[key])) { return false; }
                }
                return true;
            }
        } else if (isDate(o1)) {
            if (!isDate(o2)) { return false; }
            return equals(o1.getTime(), o2.getTime());
        } else if (isRegExp(o1)) {
            if (!isRegExp(o2)) { return false; }
            return o1.toString() === o2.toString();
        } else {
            if (isArray(o2) || isDate(o2) || isRegExp(o2)) { return false; }
            keySet = createMap();
            for (key in o1) {
                if (isFunction(o1[key])) { continue; }
                if (!equals(o1[key], o2[key])) { return false; }
                keySet[key] = true;
            }
            for (key in o2) {
                if (!(key in keySet) &&
                key.charAt(0) !== '$' &&
                isDefined(o2[key]) &&
                !isFunction(o2[key])) { return false; }
            }
            return true;
        }
    }
    return false;
}

function _diff(_differences, before, after, template) {

    if (!before && !after) {
        return;
    }

    if (!before || !after) { // if one is null --> Remove or Add
        _differences.push({
            type: before ? 'R' : 'A',
            name: before ? before.name : after.name,
            value: before ? null : after
        });
        return;
    }
    // Compare Attribute
    if (template.dynamic) {
        template.dynamic.forEach(function (attr) {
            var beforeExists = (attr in before);
            var afterExists = (attr in after);

            if (beforeExists && afterExists) {
                if (!equals(before[attr], after[attr])) {
                    _differences.push({
                        // Update
                        type: 'U',
                        name: before.name,
                        attr: attr,
                        value: after[attr]
                    });
                }
            } else if (beforeExists !== afterExists) { // one is true, one is false --> Changed
                _differences.push({
                    // R : Remove, A: Add
                    type: beforeExists ? 'R' : 'A',
                    name: beforeExists ? before.name : after.name,
                    attr: attr,
                    value: beforeExists ? null : after[attr]
                });
            }
        });
    }

    var isRoot, childAttr, beforeChildElements, afterChildElements;

    // Compare Child
    if (template.childrens) {
        isRoot = (template.key === _rootElementVariable);
        childAttr = isRoot ? 'views' : 'subViews';

        template.childrens.forEach(function (childTempate) {
            beforeChildElements = before[childAttr].filter(function (element) {
                return element[_currentPage.__heroRender._className] === childTempate.key;
            });
            afterChildElements = after[childAttr].filter(function (element) {
                return element[_currentPage.__heroRender._className] === childTempate.key;
            });

            var bLen, aLen, idx, iLen;

            bLen = beforeChildElements.length;
            aLen = afterChildElements.length;
            if (bLen > aLen) {
                afterChildElements.length = bLen;
            } else if (bLen < aLen) {
                beforeChildElements.length = aLen;
            }
            for (idx = 0, iLen = beforeChildElements.length; idx < iLen; idx++) {
              // For Each will skip undefined element
                _diff(_differences, beforeChildElements[idx], afterChildElements[idx], childTempate);
            }
        });
    }
}

function diff(before, after, template) {
    var _differences = [];

    _diff(_differences, before, after, template);

    return _differences;
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
definePublicFreezeProp(Hero, 'diff', diff);
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
    Observable: Observable,
    ViewWillDisappear: ViewWillDisappear,
    BeforeMessage: BeforeMessage,
    AfterMessage: AfterMessage,
    Hero: Hero
};
