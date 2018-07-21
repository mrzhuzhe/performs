import { serialize, type, guessConnection } from './util';
import { isEventEnabled } from './util/site-configs';

var w = window;

var stateLoadedConfigs = false; // crayfish config
var stateQueue = [];

var sendMessage = function(type, message) {
  // events can be disabled by category from God, see util/site-configs.js
  if (!isEventEnabled(type, message)) return;

  var information = {
    id: w.location.href,
    sdkVer: window.ElemePerfConfigs.sdkVer,
    appVer: window.ElemePerfConfigs.appVer,
    appName: window.ElemePerfConfigs.appName,
    pageName: window.ElemePerfConfigs.pageName,
    source: window.ElemePerfConfigs.source,
    ssid: window.ElemePerfConfigs.ssid,
    type: type,
    network: guessConnection(),
    d: message
  };

  if (typeof w.PERF_DEBUG === 'function') {
    // for debug
    w.PERF_DEBUG(information);
  } else {
    var domain = window.ElemePerfConfigs.trackerDomain;
    var img = new Image();
    img.src = `${domain}/event.gif?${serialize(information)}&time=${Date.now()}`;
  }

  return this;
};

export function send(type, message) {
  if (stateLoadedConfigs) {
    sendMessage(type, message);
  } else {
    stateQueue.push([type, message]);
  }
}

export function digestConfigs(realTimeConfigs) {
  stateLoadedConfigs = true;
  if (realTimeConfigs != null) {
    window.ElemePerfConfigs.sendingTypes = realTimeConfigs;
  }
  stateQueue.forEach(function(pair) {
    sendMessage.apply(null, pair);
  });
  stateQueue = [];
}

export function sendEvent(message) {
  if (message.id == null) {
    console.error('Custom event: `id` is required');
  }
  if (message.name == null) {
    console.error('Custom event: `name` is required');
  }
  switch (type(message.data)) {
    case 'Undefined':
      break;
    case 'Object':
    case 'Array':
      for (var k in message.data) {
        var v = message.data[k];
        if (type(v) !== 'String') {
          console.warn(`Custom event: ${v} is not a string at ${k}`);
        }
      }
      break;
    default:
      console.warn('Custom event: `data` should be array or object');
  }
  send('event', message);
}

// events sent by this function do not follow event format
// any type can be passed to send to server
export function sendRawEvent(type, message) {
  var information = {
    id: w.location.href,
    sdkVer: window.ElemePerfConfigs.sdkVer,
    appVer: window.ElemePerfConfigs.appVer,
    appName: window.ElemePerfConfigs.appName,
    pageName: window.ElemePerfConfigs.pageName,
    source: window.ElemePerfConfigs.source,
    ssid: window.ElemePerfConfigs.ssid,
    type: type,
    network: guessConnection(),
    d: message
  };

  if (typeof w.PERF_DEBUG === 'function') {
    // for debug
    w.PERF_DEBUG(information);
  } else {
    var domain = window.ElemePerfConfigs.trackerDomain;
    var img = new Image();
    img.src = `${domain}/_.gif?${serialize(information)}&time=${Date.now()}`;
  }

  return this;
}
