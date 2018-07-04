import xceptor from 'xceptor';
import fceptor from 'fceptor';
import { send } from '../send';

var cachedReportedUrls = {}; // example: {url1: true, url2: true}
var isReported = url => cachedReportedUrls[url];
var rememberUrl = url => {
  cachedReportedUrls[url] = true;
};

var startsWithHttp = url => {
  if (url.match(/^http:/)) return true;
  // detect //x.y/z and /x/y urls
  if (url.match(/^\//) && location.protocol === 'http:') return true;

  return false;
};

var detectUrl = (url, method) => {
  if (!startsWithHttp(url)) return;
  if (isReported(url)) return;

  send('http-warning', {
    method: method,
    url: url
  });
  rememberUrl(url);
};

var detectXhr = request => {
  detectUrl(request.url, 'xhr');
};

var detectFetch = obj => {
  detectUrl(obj.request.url, 'fetch');
};

export function detectAssetHttp() {
  window.addEventListener('load', () => {
    if (window.performance != null && performance.getEntries != null) {
      var entries = performance.getEntries();
      entries.forEach(entry => {
        detectUrl(entry.name, 'asset');
      });
    }
  });
}

export function detectAjaxHttp() {
  // add interceptor in XMLHttpRequest
  xceptor.when(/^/, /^/, detectXhr);

  // add interceptor in Fetch
  if (window.fetch != null) {
    // if Fetch API is polyfilled, there's a chance we inserted 2 interceptors
    // somehow Fceptor is trying to mock Fetch API too...(not sure about detail)
    // tricky code to prevent it from inserting twice
    var snippet = 'function Headers() { [native code] }';
    if (window.Headers.toString() === snippet) {
      fceptor.when(/^/, /^/, detectFetch);
    }
  }
}
