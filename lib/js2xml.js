// var parseString = require('xml2js').parseString;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
var typeKey = '_class';
var heryKeys = 'hero-';
var xml = `
<hero-view  hero-if="hasHeroView" version="0" backgroundColor="ffffff" nav="navigationBarHiddenH5=true;">
  <d-r-text-field
      hero-if="showTelephone"
      name="phone"
      type="phone"
      theme="green"
      placeHolder="手机号码"
      frame="{ x: '15', r: '15', y: '115', h: '50' }"
      textFieldDidEditing="{ name: 'phone' }"></d-r-text-field>
  <u-i-view frame="{ w: '1x', h: '1x' }" name="payView"
      hidden="true" backgroundColor="000000aa">
    <hero-image-view frame="{ r: '5', y: '7', w: '12', h: '12' }"
      image="/images/close_gray.png"></hero-image-view>
  </u-i-view>

  <d-r-text-field
      name="password"
      theme="green"
      secure="true"
      placeHolder="密码"
      frame="{ x: '15', r: '15', y: '178', h: '50' }"
      drSecure="{ secure: true }"
      textFieldDidEditing="{ name: 'password' }">密码</d-r-text-field>

    <d-r-button
    name="loginBtn"
    DRStyle="B1"
    enable="false"
    frame="{ x: '15', r: '15', y: '0', h: '44' }"
    yOffset="password+50"
    title="登录"
    click="{ click: 'login' }">登录</d-r-button>

  <hero-label
    hero-for="(item, index) in [0, 1, 2]"
    frame="{ w: '1x', h: '50', b: '0' }"
    text="Powered by Dianrong.com">Powered by Dianrong.com</hero-label>

  <hero-label
    hero-for="(item, index) in labels"
    frame="{ w: '1x', h: '50', b: '0' }"
    text="\${item}">Powered by Dianrong.com</hero-label>
  <!-- BACCCC -->
  <hero-toast
    name="toast"
    corrnerRadius="10"
    frame="{ w: '300', h: '44' }"
    center="{ x: '0.5x', y: '0.5x' }"></hero-toast>

</hero-view>
`;

const dom = new JSDOM(xml);
// var domFragement = JSDOM.fragment(xml);
// var heroView = dom.window.document.querySelector('hero-view');

// console.log(dom.window);
var $ = require('jquery')(dom.window);

// d-r-text-field
// DRTextField
function nameFormat(name) {
    return name.toLowerCase().split('-').map(function (subName) {
        // console.log(subName + '');
        return subName.charAt(0).toUpperCase() + subName.substring(1);
    }).join('');
}
function getHeroDirectives(attributes) {
    var heroDirective = [];
    var i,
        len;

    for (i = 0, len = attributes.length; i < len; i++) {
        if (attributes[i].name.indexOf(heryKeys) === 0) {
            heroDirective.push(attributes[i].name);
        }
    }
    return heroDirective;
}

var fnMappings = {};

function traverse(element, callback, parentIdx, parent) {
    if (!element) {
        return null;
    }

    var idx, len;

    // console.log(element);
    callback && callback(element, parentIdx);

    var childrens = element.children();

    if (childrens) {
        for (idx = 0, len = childrens.length; idx < len; idx++) {
            traverse($(childrens[idx]), callback, (parentIdx
                ? parentIdx.concat(idx)
                : [idx]), element);
        }
    }
}
//
// function element2Json(element, parentIdx) {
//     if (!element) {
//         return null;
//     }
//     var __fnName = nameFormat(element[0].tagName) + (parentIdx
//         ? parentIdx
//         : '_root');
//
//     console.log(__fnName);
//     var fn = 'function __fnName(element, view){__body;return view;}'.replace('__fnName', __fnName);
//     var attributes = element[0].attributes;
//
//     var json = {},
//         i,
//         len,
//         subIdx,
//         subLen,
//         subView;
//
//     var heroDirectives = getHeroDirectives(attributes);
//     // var existsFor = heroDirectives.indexOf('hero-for');
//     var existsIf = heroDirectives.indexOf('hero-if');
//
//     var __body = '';
//
//     for (i = 0, len = attributes.length; i < len; i++) {
//         // console.log(attributes[i].value);
//         __body += 'view["' + attributes[i].name + '"]="' + attributes[i].value + '";'.replace();
//         json[attributes[i].name] = attributes[i].value;
//     }
//     fnMappings[__fnName] = fn.replace('__body', __body);
//     var childrens = element.children();
//
//     if (childrens) {
//         if (!json.subViews) {
//             json.subViews = [];
//         }
//         for (subIdx = 0, subLen = childrens.length; subIdx < subLen; subIdx++) {
//             subView = traverse($(childrens[subIdx]), (parentIdx
//                 ? parentIdx + '_' + subIdx
//                 : '_' + subIdx));
//             subView[typeKey] = nameFormat(childrens[subIdx].tagName);
//             json.subViews.push(subView);
//         }
//     }
//     if (existsIf) {
//         fn += '}';
//     }
//     // console.log(fn);
//     return json;
// }
var xmlJson = {};

traverse($('hero-view'), function (element, path, parent) {
    console.log(path);
    var attributes = element[0].attributes;

    if (!parent) {
        xmlJson[nameFormat(element[0].tagName)] = {};
    } else {
        if (!parent.children) {
            parent.children = [];
        }
        parent.children.push(element);
    }

    var json = {},
        i,
        len;

    for (i = 0, len = attributes.length; i < len; i++) {
        // console.log(attributes[i].value);
        json[attributes[i].name] = attributes[i].value;
    }
});

var generatedJSCode = '';
var tree = {};
var keys = [];

traverse($('hero-view'), function (element, path) {
    var attributes = element[0].attributes;

    var suffix = (path ? path.join('_') : '');
    var __fnName = nameFormat(element[0].tagName) + '_' + suffix;

    keys.push(suffix);

    tree[suffix] = {
        key: __fnName,
        expressions: {}
    };
    var fn = 'function __fnName(element, view){__body;return view;}'.replace('__fnName', __fnName);

    var __body = '';
    var json = {},
        i,
        len;

    for (i = 0, len = attributes.length; i < len; i++) {
        if (attributes[i].name.indexOf(heryKeys) === 0) {

            tree[suffix].expressions[attributes[i].name.replace(heryKeys, '')] = attributes[i].value;
            continue;
        }
        // console.log(attributes[i].value);
        __body += 'view["' + attributes[i].name + '"]="' + attributes[i].value + '";'.replace();
        json[attributes[i].name] = attributes[i].value;
    }

    fn = fn.replace('__body', __body);
    fnMappings[__fnName] = fn;

    generatedJSCode += fn;
    generatedJSCode += ';\n';
});
// console.log(tree);
// console.log(JSON.stringify(tree));
console.log(JSON.stringify(keys));
// console.log(generatedJSCode + '\nvar treeObject = ' + JSON.stringify(tree));
console.log(generatedJSCode + '\nvar treeObject = ' + JSON.stringify(tree) + ';\n var KEYS = ' + JSON.stringify(keys) + ';');
// console.log(traverse($('hero-view'))); // "Hello world"
// console.log(Object.keys(heroView)); // "Hello world"

// // console.log(xml);
// parseString(xml, function (err, result) {
//     // console.log(JSON.stringify(result));
// });
