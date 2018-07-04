import { $, ERROR } from '../util';
import { send } from '../send';

var w = window;

function eventHandler(e) {
  var ev = e.type;
  var raw = {};
  var message = {
    id: this.getAttribute('perf-id'),
    name: this.getAttribute(`perf-${ev}`),
    event: ev
  };
  if (!message.id) {
    if (w.PERF_DEBUG) throw new Error(ERROR.id(ev));
    return console.log(ERROR.id(ev));
  }

  if (this.getAttribute('perf-route')) {
    message.route = this.getAttribute('perf-route');
  }

  var err = null;
  if (this.getAttribute('perf-data')) {
    raw = this.getAttribute('perf-data');
    try {
      raw = JSON.parse(raw);
    } catch (e) {
      err = 1;
      if (w.PERF_DEBUG) throw new Error(ERROR.data);
      console.log(err);
    }
  }

  if (!err) {
    message.data = raw;
    send('event', message);
  }
}

// auto save use `perf-EVENT`
function initCustomPerfEvent() {
  [
    'click',
    'contextmenu',
    'dblclick',
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mousemove',
    'mouseover',
    'mouseout',
    'mouseup',
    'keydown',
    'keypress',
    'keyup',
    'abort',
    'beforeunload',
    'error',
    'hashchange',
    'load',
    'pageshow',
    'pagehide',
    'resize',
    'scroll',
    'unload',
    'blur',
    'change',
    'focus',
    'focusin',
    'focusout',
    'input',
    'invalid',
    'reset',
    'search',
    'select',
    'submit',
    'drag',
    'dragend',
    'dragenter',
    'dragleave',
    'dragover',
    'dragstart',
    'drop',
    'copy',
    'cut',
    'paste',
    'afterprint',
    'beforeprint',
    'abort',
    'canplay',
    'canplaythrough',
    'durationchange',
    'ended',
    'error',
    'loadeddata',
    'loadedmetadata',
    'loadstart',
    'pause',
    'play',
    'playing',
    'progress',
    'ratechange',
    'seeked',
    'seeking',
    'stalled',
    'suspend',
    'timeupdate',
    'volumechange',
    'waiting',
    'animationend',
    'animationiteration',
    'animationstart',
    'transitionend'
  ].forEach(ev => {
    var els = $(`[perf-${ev}]`);
    if (!els.length) return;
    [].slice.call(els).forEach(el => el.addEventListener(ev, eventHandler));
  });
}

export function watchEvents() {
  // Why the code run in onload event?
  w.addEventListener('load', initCustomPerfEvent);
}
