// var parseString = require('xml2js').parseString;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
var typeKey = '_class';
var heryKeys = 'hero-';
var xml = `
<hero-view  hero-if="hasHeroView" version="0" backgroundColor="ffffff" nav="navigationBarHiddenH5=true;">
  <DRTextField
      hero-if="showTelephone"
      name="phone"
      type="phone"
      theme="green"
      placeHolder="手机号码"
      frame="{ x: '15', r: '15', y: '115', h: '50' }"
      textFieldDidEditing="{ name: 'phone' }"></DRTextField>

  <DRTextField
      name="password"
      theme="green"
      secure="true"
      placeHolder="密码"
      frame="{ x: '15', r: '15', y: '178', h: '50' }"
      drSecure="{ secure: true }"
      textFieldDidEditing="{ name: 'password' }">密码</DRTextField>

  <DRButton
    name="loginBtn"
    DRStyle="B1"
    enable="false"
    frame="{ x: '15', r: '15', y: '0', h: '44' }"
    yOffset="password+50"
    title="登录"
    click="{ click: 'login' }">登录</DRButton>

  <HeroLabel
    hero-for="(item, index) in [0, 1, 2]"
    frame="{ w: '1x', h: '50', b: '0' }"
    text="Powered by Dianrong.com">Powered by Dianrong.com</HeroLabel>

  <HeroLabel
    hero-for="(item, index) in labels"
    frame="{ w: '1x', h: '50', b: '0' }"
    text="\${item}">Powered by Dianrong.com</HeroLabel>
  <!-- BACCCC -->
  <HeroToast
    name="toast"
    corrnerRadius="10"
    frame="{ w: '300', h: '44' }"
    center="{ x: '0.5x', y: '0.5x' }"></HeroToast>

  <UIView frame="{ w: '1x', h: '1x' }" name="payView"
      hidden="true" backgroundColor="000000aa">
    <HeroImageView frame="{ r: '5', y: '7', w: '12', h: '12' }"
      image="/images/close_gray.png"></HeroImageView>
  </UIView>
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
    return name.split('-').map(function (subName) {
        // console.log(subName + '');
        return subName.charAt(0).toUpperCase() + subName.substring(1);
    }).join('');
}
function getHeroDirectives(attributes) {
    var heroDirective = [];
    var i, len;

    for (i = 0, len = attributes.length; i < len; i++) {
        if (attributes[i].name.indexOf(heryKeys) === 0) {
            heroDirective.push(attributes[i].name);
        }
    }
    return heroDirective;
}
function element2Json(element) {
    if (!element) {
        return null;
    }
    var fn = '';
    var attributes = element[0].attributes;

    var json = {}, i, len, subIdx, subLen, subView;

    var heroDirectives = getHeroDirectives(attributes);
    var existsFor = heroDirectives.indexOf('hero-for');
    var existsIf = heroDirectives.indexOf('hero-if');

    if (existsFor !== -1) {
    }
    if (existsIf !== -1) {
        fn += '; if(' + attributes[existsIf].value + '){';
    }
    for (i = 0, len = attributes.length; i < len; i++) {
        // console.log(attributes[i].value);
        json[attributes[i].name] = attributes[i].value;
    }
    var childrens = element.children();

    if (childrens) {
        if (!json.subViews) {
            json.subViews = [];
        }
        for (subIdx = 0, subLen = childrens.length; subIdx < subLen; subIdx++) {
            subView = element2Json($(childrens[subIdx]));
            subView[typeKey] = nameFormat(childrens[subIdx].tagName);
            json.subViews.push(subView);
        }
    }
    if (existsIf) {
        fn += '}';
    }
    console.log(fn);
    return json;
}
console.log(element2Json($('hero-view'))); // "Hello world"
// console.log(Object.keys(heroView)); // "Hello world"

// // console.log(xml);
// parseString(xml, function (err, result) {
//     // console.log(JSON.stringify(result));
// });
