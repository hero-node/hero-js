import 'whatwg-fetch';

export const apiHost = 'http://106.14.187.240';

function formatUrlQuery(url, data) {
  if (!data) {
    return url;
  }

  var arr = [];
  for (var k in data) {
    arr.push(k + '=' + data[k]);
  }

  if (arr.length == 0) {
    return url;
  }
  return url + '?' + arr.join('&');
}

function path(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}

export function sendReq(url, method, data) {
  url = method.toLowerCase() == 'get' ? formatUrlQuery(url, data) : url;
  let option = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (method.toLowerCase() == 'post') {
    option.body = data && JSON.stringify(data);
  }

  return fetch(url, option)
    .then(response => response.json())
    .then(json => {
      console.log(json.code == 500);
      if (json.code == 500) {
        location.hash = 'login';
        return;
      }

      return json;
    });
}

export function get(url, data) {
  url = formatUrlQuery(url, data);
  let option = {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(url, option)
    .then(response => response.json())
    .then(json => {
      return json;
    });
}

export function postFormData(url, data) {
  let formData = new FormData();
  formData.append('content', data && JSON.stringify(data));
  let option = {
    method: 'post',
    body: formData,
  };

  return fetch(url, option)
    .then(response => response.json())
    .then(json => {
      return json;
    });
}

export function postFormImg(url, data) {
  let formData = new FormData();
  formData.append('content', data);
  let option = {
    method: 'post',
    body: formData,
  };

  return fetch(url, option)
    .then(response => response.json())
    .then(json => {
      return json;
    });
}

export function uploadFile(url, data) {
  data = data || [];

  var requestOptions = {
    method: 'POST',
    mode: 'cors',
    // credentials: 'include',
    body: data,
  };

  return fetch(url, requestOptions)
    .then(response => response.json())
    .then(json => {
      return json;
    });
}
