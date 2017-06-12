
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

var jsdom = require('jsdom');
var JSDOM = jsdom.JSDOM;
// var typeKey = '_class';
var heryKeys = 'hero-';
var dom = new JSDOM(xml);
var $ = require('jquery')(dom.window);

// d-r-text-field --> DRTextField
function nameFormat(name) {
    return name.toLowerCase().split('-').map(function (subName) {
        return subName.charAt(0).toUpperCase() + subName.substring(1);
    }).join('');
}

function traverse(element, callback, parentIdx) {
    if (!element) {
        return null;
    }

    var idx, len;

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


var __$$heroCurrentView = '__$hero$CurrentView';

function getMeta() {
    var tree = {};
    var keys = [];
    var fnMappings = {};

    traverse($('hero-view'), function (element, path) {
        var attributes = element[0].attributes;
        var suffix = (path ? path.join('_') : '');
        var __fnName = nameFormat(element[0].tagName) + '_' + suffix;
        var embeddedName = __$$heroCurrentView + suffix;

        keys.push(suffix);

        tree[suffix] = {
            key: __fnName,
            expressions: {}
        };
        var __body = '\nvar ' + embeddedName + '={};';
        var i, len;

        for (i = 0, len = attributes.length; i < len; i++) {
            if (attributes[i].name.indexOf(heryKeys) === 0) {

                tree[suffix].expressions[attributes[i].name.replace(heryKeys, '')] = attributes[i].value;
                continue;
            }
            __body += embeddedName + '["' + attributes[i].name + '"]="' + attributes[i].value + '";\n';
        }
        fnMappings[__fnName] = __body;
    });

    return {
        tree: tree,
        keys: keys,
        fnMappings: fnMappings
    };
}
function treeObject(metaData) {
    var keys = metaData.key;
    var tree = metaData.tree;
    var fnMappings = metaData.fnMappings;

    var idx, len, expressions;
    var fors, hasSquare;
    var currentViewVariableName;
    var elementPaths, parentView;
    var j;
    var __body = ['module.exports = function generateView(context){'];

    for (idx = 0, len = keys.length; idx < len; idx++) {
        expressions = tree[keys[idx]].expressions;
        if (expressions.for) {
            fors = expressions.for.trim().split(/\bin\b/);
            hasSquare = /^\(.*\)$/.test(fors[0].trim());
            if (!hasSquare) {
                fors[0] = '(' + fors[0] + ')';
            }
            __body.push('\n');
            __body.push(fors[1]);
            __body.push('.forEach(function');
            __body.push(fors[0]);
            __body.push('{');
        }
        if (expressions.if) {
            __body.push('if(');
            __body.push(expressions.if);
            __body.push('){');
        }
        __body.push(fnMappings[tree[keys[idx]].key]);

        currentViewVariableName = __$$heroCurrentView + keys[idx];
        if (idx === 0) {
            __body.push(currentViewVariableName);
            __body.push('.views = [];\n');
        } else {
            for (j = idx + 1; j < len; j++) {
                if (keys[j].indexOf(keys[idx] + '_') !== -1) {
                    __body.push(currentViewVariableName);
                    __body.push('.subViews = [];\n');
                }
            }
            elementPaths = keys[idx].split('_');
            elementPaths.pop();

            parentView = __$$heroCurrentView + elementPaths.join('');
            if (parentView === __$$heroCurrentView) {
                __body.push(parentView);
                __body.push('.views.push(');
                __body.push(currentViewVariableName);
                __body.push(');');
            } else {
                __body.push(parentView);
                __body.push('.subViews.push(');
                __body.push(currentViewVariableName);
                __body.push(');');
            }
        }
        if (expressions.if) {
            __body.push('}');
        }
        if (expressions.for) {
            __body.push('});');
        }
    }
    __body.push('; \nreturn ');
    __body.push(__$$heroCurrentView);
    __body.push(';}');

    return __body.join('');
}

console.log(treeObject(getMeta()));
