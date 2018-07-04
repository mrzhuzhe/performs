import { send } from '../send';
import { detectInError } from '../util';

var errorCache = {};
var w = window;

function generateError(error, callback) {
  var ret = {};
  if (typeof error === 'string') {
    ret = {
      line: '0:0',
      file: callback.toString(),
      error: error,
      stack: null
    };
  } else if (typeof error === 'object') {
    if (error.sourceURL) {
      ret = {
        line: `${error.line}:${error.column}`,
        file: error.sourceURL,
        error: error.message
      };
    } else if (error.stack) {
      let stackDetail = error.stack.split('\n');
      let errorName = error.toString();
      let regexpCheckErrorStack = /(https?:\/\/.*?):(\d*):(\d*)/;
      let errorDetail;
      for (let i = 0, len = stackDetail.length; i < len; ++i) {
        let statckItem = stackDetail[i];
        if (regexpCheckErrorStack.test(statckItem)) {
          errorDetail = regexpCheckErrorStack.exec(statckItem);
          break;
        }
      }
      if (errorDetail && errorDetail.length > 3) {
        ret = {
          line: `${errorDetail[2]}:${errorDetail[3]}`,
          file: errorDetail[1],
          error: errorName,
          stack: error.stack
        };
      } else {
        ret = {
          line: '0:0',
          file: stackDetail.toString(),
          error: errorName,
          stack: error.stack
        };
      }
    }
  }

  return ret;
}

function asynchronousErrorCatch(callback, args) {
  try {
    if (typeof callback !== 'function') callback = new Function(callback);
    callback.apply(null, args);
  } catch (error) {
    var error2Send = generateError(error, callback);
    var key = JSON.stringify(error2Send);
    if (errorCache[key]) return;
    errorCache[key] = true;
    send('error', error2Send);
    throw error;
  }
}

export function watchErrors() {
  w.addEventListener('error', function(e) {
    // console.debug('error', e);
    var key = e.filename + e.lineno + e.colno + w.location.href;
    if (errorCache[key]) return;
    errorCache[key] = true;
    send('error', {
      line: `${e.lineno}:${e.colno}`,
      file: e.filename,
      error: e.message,
      stack: e.error ? e.error.stack : null
    });
  });

  // a Chrome only event
  w.addEventListener('unhandledrejection', function(e) {
    var key = 'Unhandled promise rejection: ' + e.reason;
    if (e.reason && e.reason.stack) {
      var info = detectInError(e.reason.stack);
      send('error', {
        file: info.file,
        line: info.line,
        error: key,
        stack: e.reason.stack
      });
    } else {
      send('error', {
        error: key,
        stack: e.reason ? e.reason.stack : null
      });
    }
  });

  // 重写setTimeout、setInterval方法，以便能够捕捉异步的报错

  var setTimeoutCustom = w.setTimeout;
  w.setTimeout = function(callback, timeout) {
    var args = [].slice.call(arguments, 2);
    return setTimeoutCustom(
      function() {
        asynchronousErrorCatch(callback, args);
      },
      timeout
    );
  };

  var setIntervalCustom = w.setInterval;
  w.setInterval = function(callback, interval) {
    var args = [].slice.call(arguments, 2);
    return setIntervalCustom(
      function() {
        asynchronousErrorCatch(callback, args);
      },
      interval
    );
  };
}
