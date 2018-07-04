import xceptor from 'xceptor';
import fceptor from 'fceptor';
import { send } from '../send';
import {
  guid,
  assign,
  shallowParseUrl,
  ensureUrlHasProtocol,
  cutFloat,
  guessConnection
} from '../util';
import { pickNetworkInfos, pickAssetsInfos } from '../util/network';

var reportJsCss = () => {
  var resourceEntries = performance
    .getEntries()
    .filter(info => {
      return info.initiatorType === 'script' || info.initiatorType === 'css';
    })
    .map(info => {
      return assign(pickAssetsInfos(info), pickNetworkInfos(info));
    });
  send('networkBatched', resourceEntries);
};

var getATime = () => {
  if (window.performance != null && performance.now != null) {
    return performance.now();
  } else {
    return new Date().valueOf();
  }
};

var prepareXHR = request => {
  // mutation!!!
  request._startedTime = getATime();

  var _requestId = `${guid()}|${new Date().valueOf()}`;
  request._requestId = _requestId;
  try {
    // Not documented, need to push this format into headers to add
    request.headers.push({ header: 'X-Eleme-RequestID', value: _requestId });
  } catch (error) {
    // Would return failure for cross domain requests
    // console.error('Failed to add requestId', error);
  }
};

var prepareFetch = obj => {
  var { request } = obj;
  // mutation!!!
  request._startedTime = getATime();
  var _requestId = `${guid()}|${new Date().valueOf()}`;
  request._requestId = _requestId;
  try {
    request.headers.append('X-Eleme-RequestID', _requestId);
  } catch (error) {
    // Would return failure for cross domain requests
    // console.error('Failed to add requestId', error);
  }
};

var assembleNetworkInfoAndSend = info => {
  var baseInfo = {
    solution: 'ajax',
    network: guessConnection()
  };
  assign(baseInfo, info);
  if (window.performance != null && performance.getEntriesByName != null) {
    var entries = performance.getEntriesByName(ensureUrlHasProtocol(info.url)); // returns an array
    var latestEntry = entries[entries.length - 1];
    if (latestEntry != null) {
      assign(baseInfo, pickNetworkInfos(latestEntry));
      assign(baseInfo, { solution: 'ajax timing' });
    }
  }
  send('network', baseInfo);
};

var getXhrResponseSize = response => {
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
  // json will be turned into '' automatically
  if (response.responseType === 'text' || response.responseType === '') {
    var responseText = response.responseText;
    try {
      // it throws errors in Samsung note 2 UC developer edition and WebView, date Dec 14 2016
      // new Blob(["xxx"], {type: 'plain/text'})
      // using try/catch as a fix
      var dataInBlob = new Blob([responseText], { type: 'plain/text' });
      return dataInBlob.size;
    } catch (error) {
      // note that UTF8 string might be inaccurate
      if (typeof responseText === 'string') {
        return responseText.length;
      } else {
        return 0;
      }
    }
  } else if (response.responseType === 'blob') {
    return response.response.size;
  } else {
    return -1; // indicates unreadable
  }
};

var checkXhrResponse = (request, response) => {
  // console.log(request, response);
  var url = request.url;
  var fullUrl = ensureUrlHasProtocol(url); // url might be //
  var { host, urlPath, port } = shallowParseUrl(fullUrl);
  // detect errors
  var status = response.status;
  var errored = false;
  if (status === 0 || status >= 400) {
    errored = true;
  }
  // compuate time
  var elapsedTime;
  if (request._startedTime != null) {
    elapsedTime = cutFloat(getATime() - request._startedTime);
  } else {
    elapsedTime = -1; // indicates unreadable
  }
  var info = {
    statusCode: status,
    reqLength: url.length,
    respLength: getXhrResponseSize(response),
    httpMethod: request.method,
    url: fullUrl,
    host: host,
    port: port,
    urlPath: urlPath,
    error: errored, // Boolean
    errorDomain: undefined, // keep empty by now
    errorDescription: errored ? response.responseText : undefined,
    requestId: request._requestId,
    elapsedTime: elapsedTime
  };
  assembleNetworkInfoAndSend(info);
};

var checkFetchResponse = obj => {
  var { request, response } = obj;
  var url = request.url;
  var fullUrl = ensureUrlHasProtocol(url); // url might be //
  var { host, urlPath, port } = shallowParseUrl(fullUrl);
  // compuate time
  var elapsedTime;
  if (request._startedTime) {
    elapsedTime = cutFloat(getATime() - request._startedTime);
  } else {
    elapsedTime = -1; // indicates unreadable
  }
  // mock response, it might be null when network breaks
  if (response == null) {
    var info = {
      statusCode: -1, // -1 to indicate unreadable
      reqLength: -1,
      respLength: -1,
      httpMethod: -1,
      url: fullUrl,
      host: host,
      port: port,
      urlPath: urlPath,
      error: true, // Boolean
      errorDomain: undefined, // keep empty by now
      errorDescription: 'Fetch API failed with no response',
      requestId: request._requestId,
      elapsedTime: elapsedTime
    };
    assembleNetworkInfoAndSend(info);
    return;
  } else {
    // detect errors
    var status = response.status;
    var errored = false;
    if (status === 0 || status >= 400) {
      errored = true;
    }
    response.clone().blob().then(dataInBlob => {
      var info = {
        statusCode: status,
        reqLength: url.length,
        respLength: dataInBlob.size,
        httpMethod: request.method,
        url: fullUrl,
        host: host,
        port: port,
        urlPath: urlPath,
        error: errored, // Boolean
        errorDomain: undefined, // keep empty by now
        errorDescription: errored ? response.statusText : undefined,
        requestId: request._requestId,
        elapsedTime: elapsedTime
      };
      assembleNetworkInfoAndSend(info);
    });
  }
};

export function watchAssets() {
  window.addEventListener('load', () => {
    if (window.performance != null && performance.getEntries != null) {
      reportJsCss();
    }
  });
}

export function watchApis() {
  var etraceApiFilter = window.ElemePerfConfigs.etraceApiFilter;

  // add interceptor in XMLHttpRequest
  xceptor.when(/^/, etraceApiFilter, prepareXHR, checkXhrResponse);

  // add interceptor in Fetch
  if (window.fetch != null) {
    // if Fetch API is polyfilled, there's a chance we inserted 2 interceptors
    // somehow Fceptor is trying to mock Fetch API too...(not sure about detail)
    // tricky code to prevent it from inserting twice
    var snippet = 'function Headers() { [native code] }';
    if (window.Headers.toString() === snippet) {
      fceptor.when(/^/, etraceApiFilter, prepareFetch, checkFetchResponse);
    }
  }
}
