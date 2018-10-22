function formatData(fd) {
  var res = '';
  for (var f in fd) {
    if (fd[f]) {
      res += f + '=' + fd[f] + '&';
    }
  }
  return res.slice(0, -1);
}
function objKeySort(obj) {
  var newkey = Object.keys(obj).sort();
  var newObj = {};
  for (var i = 0; i < newkey.length; i++) {
    newObj[newkey[i]] = obj[newkey[i]];
  }
  return newObj;
}

var xhr = (function() {
  var ajax = (function() {
      return 'XMLHttpRequest' in window
        ? function() {
            return new XMLHttpRequest();
          }
        : function() {
            return new ActiveXObject('Microsoft.XMLHTTP');
          };
    })(),
    AJAX = function(ops) {
      var root = this,
        req = ajax();
      root.url = ops.url;
      root.contentType = ops.contentType;
      root.type = ops.type || 'responseText';
      root.method = ops.method || 'GET';
      root.async = ops.async || true;
      root.data = ops.data || {};
      root.complete = ops.complete || function() {};
      root.success = ops.success || function() {};
      root.error =
        ops.error ||
        function(s) {
          alert(root.url + '->status:' + s + 'error!');
        };
      root.abort = req.abort;
      root.timeout = ops.timeout || 90000;
      root.setData = function(data) {
        for (var d in data) {
          root.data[d] = data[d];
        }
      };
      root.send = function() {
        var datastring = root.data,
          get = false,
          async = root.async,
          complete = root.complete,
          method = root.method,
          type = root.type;
        if (!root.contentType) {
          datastring = formatData(root.data);
        }
        if (method === 'GET') {
          root.url += '?' + datastring;
          get = true;
        }
        req.timeout = root.timeout;
        req.open(method, root.url, async);
        if (localStorage.uticket) {
          req.setRequestHeader('uticket', localStorage.uticket);
        }
        if (!get) {
          if (root.contentType) {
            req.setRequestHeader('Content-type', root.contentType);
          } else {
            req.setRequestHeader(
              'Content-type',
              'application/x-www-form-urlencoded'
            );
          }
        }
        //在send之前重置onreadystatechange方法,否则会出现新的同步请求会执行两次成功回调(chrome等在同步请求时也会执行onreadystatechange)
        req.onreadystatechange = async
          ? function() {
              // console.log('async true');
              if (req.readyState == 4) {
                complete();
                if (req.status == 200) {
                  root.success(req[type]);
                } else {
                  root.error(req.status);
                }
              }
            }
          : null;
        req.send(datastring);
        if (!async) {
          complete();
          root.success(req[type]);
        }
      };
      root.url && root.send();
    };
  return function(ops) {
    return new AJAX(ops);
  };
})();
(function() {
  window.HeroHelper = {
    get: function(url, data, success, showLoading) {
      if (showLoading) {
        Hero.command('showLoading');
      }
      var httpOption = { url: url, method: 'GET' };
      data = objKeySort(data);
      var dataString = formatData(data);
      data.sign = md5(dataString);
      if (data) {
        httpOption['data'] = data;
      }
      httpOption['success'] = function(json) {
        if (showLoading) {
          Hero.command('stopLoading');
        }
        if (json.response_code === 'SUCCESS') {
          success(json);
        } else if (json.response_code === 'MEMBER_NOT_LOGIN_ERROR') {
          Hero.command('present:' + path + 'login.html');
        } else {
          Hero.datas({
            name: 'toast',
            text: json.memo || json.response_message,
          });
        }
      };
      httpOption['fail'] = function(json) {
        if (showLoading) {
          Hero.command('stopLoading');
        }
        Hero.datas({ name: 'toast', text: '网络错误，请稍后再试' });
      };
      Hero.in({ http: httpOption });
    },
    post: function(url, data, success, showLoading) {
      if (showLoading) {
        Hero.command('showLoading');
      }
      var httpOption = { url: url, method: 'POST' };
      data = objKeySort(data);
      var dataString = formatData(data);
      data.sign = md5(dataString);
      if (data) {
        httpOption['data'] = data;
      }
      httpOption['success'] = function(json) {
        if (showLoading) {
          Hero.command('stopLoading');
        }
        if (json.response_code === 'SUCCESS') {
          success(json);
        } else if (json.response_code === 'MEMBER_NOT_LOGIN_ERROR') {
          Hero.command('present:' + path + 'login.html');
        } else {
          Hero.datas({
            name: 'toast',
            text: json.memo || json.response_message,
          });
        }
      };
      httpOption['fail'] = function(json) {
        if (showLoading) {
          Hero.command('stopLoading');
        }
        Hero.datas({ name: 'toast', text: '网络错误，请稍后再试' });
      };
      Hero.in({ http: httpOption });
    },
    showLoading: function() {
      Hero.out({ command: 'showLoading' });
    },
    back: function() {
      Hero.out({ command: 'back' });
    },
    rootBack: function() {
      Hero.out({ command: 'rootBack' });
    },
    dismiss: function() {
      Hero.out({ command: 'dismiss' });
    },
    setLabelText: function(labelName, text) {
      Hero.out({ datas: { name: labelName, text: text, hAuto: true } });
    },
    fmoney: function(s, n) {
      n = n >= 0 && n <= 20 ? n : 2;
      // eslint-disable-next-line
      s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
      var l = s
          .split('.')[0]
          .split('')
          .reverse(),
        r = s.split('.')[1];

      var t = '',
        i;
      for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '');
      }
      return (
        t
          .split('')
          .reverse()
          .join('') + (r ? '.' + r : '')
      );
    },
    dateFormat: function(date, fmt) {
      var o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds(), //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        );
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length)
          );
        }
      }
      return fmt;
    },
    decimalAdjust: function(type, value, exp) {
      if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
      }
      value = +value;
      exp = +exp;
      if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
      }
      if (value < 0) {
        return -HeroHelper.decimalAdjust(type, -value, exp);
      }
      value = value.toString().split('e');
      value = Math[type](
        +(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp))
      );
      value = value.toString().split('e');
      return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp));
    },
    round10: function(value, exp) {
      return HeroHelper.decimalAdjust('round', value, exp);
    },

    floor10: function(value, exp) {
      return HeroHelper.decimalAdjust('floor', value, exp);
    },
    ceil10: function(value, exp) {
      return HeroHelper.decimalAdjust('ceil', value, exp);
    },
  };
})();
