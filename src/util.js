export function assign(dist, src) {
  for (var p in src) {
    dist[p] = src[p];
  }
  return dist;
}

// http://stackoverflow.com/a/1714899/883571
export var serialize = function(obj, prefix) {
  var str = [];
  var p;
  for (p in obj) {
    var v = obj[p]; // but dont show undefined keys
    if (obj.hasOwnProperty(p) && v != null) {
      var k = prefix ? prefix + '[' + p + ']' : p;
      str.push(
        v !== null && typeof v === 'object'
          ? serialize(v, k)
          : encodeURIComponent(k) + '=' + encodeURIComponent(v)
      );
    }
  }
  return str.join('&');
};

export function type(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

export function $(selector, parent) {
  parent = document || parent;
  return parent.querySelectorAll(selector);
}

export const ERROR = {
  id: ev => `You need a "project/id", like perf-${ev}="project/id"`,
  data: '`perf-data` show be a json string'
};

// based on random numbers
// modified from http://stackoverflow.com/a/105074/883571
export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
      .toUpperCase();
  }
  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

export function shallowParseUrl(url) {
  var trimmedUrl = url.replace(/^(https?:)?\/\//, '');
  // detect path and port
  var posOfFirstSlash = trimmedUrl.indexOf('/');
  var host = trimmedUrl.slice(0, posOfFirstSlash).replace(/:\d+$/, '');
  var pathPart = trimmedUrl.slice(posOfFirstSlash);
  var urlPath, search;
  if (pathPart.indexOf('?') >= 0) {
    [urlPath, search] = pathPart.split('?');
  } else {
    urlPath = pathPart;
    search = '';
  }
  var port;
  if (host.match(/:\d+/) != null) {
    port = host.match(/:(\d+)/)[1];
  } else {
    port = '80';
  }
  return { host, urlPath, port, search };
}

export function cutFloat(x) {
  return Math.round(x * 1000) / 1000;
}

export function ensureUrlHasProtocol(url) {
  if (url.match(/^https?:/)) {
    return url;
  } else {
    return `${location.protocol}${url}`;
  }
}

export function detectInError(errorMessage) {
  // Trying to match with regular expression, a piece of demo
  // "at https://perf.ele.me/app.b0ef1b8.js:105:31276"
  var urls = errorMessage.match(/https?\:\/\/[\w\d\-_\:\.\/]+/g);
  if (urls != null) {
    var lastUrl = urls[urls.length - 1];
    return {
      file: lastUrl.split(':').slice(0, -2).join(':'),
      line: lastUrl.split(':').slice(-2).join(':')
    };
  } else {
    return {
      file: undefined,
      line: undefined
    };
  }
}

export function guessConnection() {
  var connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  var type;
  if (connection != null) {
    // https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/type
    type = connection.type;
  } else {
    type = 'guessWifi'; // not defined, but probably WiFi on desktop, see UA for details
  }
  return type;
}
