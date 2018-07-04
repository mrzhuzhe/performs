import { defaultConfigs } from '../configs';

export function loadConfigs(cb) {
  var req = new XMLHttpRequest();
  req.open('GET', defaultConfigs.configsUrl);
  if (typeof cb === 'function') {
    req.onreadystatechange = function(event) {
      if (req.readyState === 4) {
        if (req.status === 200) {
          cb(null, JSON.parse(req.responseText || null));
        } else {
          cb({ req: req, msg: 'failed' }, null);
        }
      }
    };
  }
  req.send();
}

export function isEventEnabled(type, message) {
  // console.log('Detecting:', type, message);
  var sending = window.ElemePerfConfigs.sendingTypes;
  switch (type) {
    case 'load':
      return sending.load;
    case 'error':
      return sending.error;
    case 'http-warning':
      return sending.http;
    case 'event':
      return sending.event;
    case 'network':
      return sending.api;
    case 'networkBatched':
      return sending.asset;
    default:
      console.warn('[PERF] Unknown event:', type);
      return false;
  }
}
