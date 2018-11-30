(function() {
  var res = {
    账户: {
      en: 'acount',
      kr: 'ACOUNT',
    },
  };
  var language = 'en';
  var ul = navigator.language.toLowerCase();
  if (ul === 'en-us') {
    language = 'en';
  }
  if (ul === 'zh-cn') {
    language = 'zh';
  }
  window.i18n = function(str) {
    if (res[str] && res[str][language]) {
      return res[str][language];
    }
    return str;
  };
})();
