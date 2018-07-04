// 生成随机字符串的函数
var uuid = function() {
  var s = '';
  for (var i = 0; i < 4; i++) {
    s += '0000000'
      .concat(Math.floor(Math.random() * 2821109907456).toString(36))
      .slice(-8);
  }
  return s;
};

var createSsid = function() {
  // 创建一个北京时间的日期字符串作为 ssid 的结尾（TODO: 客户端时间可能是不准确的）
  var t = new Date(new Date().getTime() + 480 * 60000);
  var ssid =
    uuid() +
    '_' +
    [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()]
      .join('-')
      .replace(/\b\d\b/g, '0$&');
  return ssid;
};

var createCookie = function(ssid, domain) {
  return (
    'perf_ssid=' +
    ssid +
    '; Expires=Wed, 31 Dec 2098 16:00:00 GMT; Domain=' +
    domain +
    '; Path=/'
  );
};

export function loadSsid() {
  var ssid;
  // 尝试获取当前根域名
  var domain = /(?:[\w-]+\.)?[\w-]+$|$/i.exec(document.domain || '')[0];
  // 尝试获取已经存储下来的 perf_ssid
  // 注意: Cookies 当中的 perf_ssid 只用于存储, God 从 JSON 数据当中直接获取 perf_ssid
  if (domain) {
    // 如果存在域名则表示这是一个正常的环境，从 Cookie 中取 perf_ssid
    ssid = document.cookie.match(/(?:^|; )perf_ssid=(.*?)(?:; |$)|$/)[1];
  } else {
    // 否则可能是写不了 Cookie 的 Cordova 之类的环境，尝试从 localStorage 获取 perf_ssid
    try {
      ssid = localStorage.getItem('perf_ssid');
    } catch (error) {
      // 如果连 localStorage 都用不了就跑异常
      setTimeout(function() {
        throw error;
      });
    }
  }
  // 如果不存在则初始化 perf_ssid（种植第一方 Cookie）
  if (!ssid) {
    ssid = createSsid();
    if (domain) {
      // 如果能获取到域名就将 ssid 存入根域的根目录 Cookie
      document.cookie = createCookie(ssid, domain);
    } else {
      // 否则可能是写不了 Cookie 的 Cordova 之类的环境，尝试使用 localStorage
      try {
        localStorage.setItem('perf_ssid', ssid);
      } catch (error) {
        // 如果连 localStorage 都用不了就抛异常
        setTimeout(function() {
          throw error;
        });
      }
    }
  }

  return ssid;
}
