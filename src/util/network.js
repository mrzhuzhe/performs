import { assign, shallowParseUrl, cutFloat, guessConnection } from '../util';

export var pickNetworkInfos = entry => {
  return {
    startTime: cutFloat(entry.startTime),
    duration: cutFloat(entry.duration),
    navigationStart: performance.timing.navigationStart,
    dnsTime: cutFloat(entry.domainLookupEnd - entry.domainLookupStart),
    tcpTime: cutFloat(entry.connectEnd - entry.connectStart),
    reqTime: cutFloat(entry.responseStart - entry.requestStart),
    resTime: cutFloat(entry.responseEnd - entry.responseStart)
  };
};

export var pickAssetsInfos = entry => {
  var baseInfo = {
    solution: 'ajax',
    network: guessConnection()
  };
  assign(baseInfo, { solution: 'timing' });
  var { port, host, urlPath } = shallowParseUrl(entry.name);
  var moreInfo = {
    statusCode: 200,
    reqLength: undefined,
    respLength: undefined,
    httpMethod: 'GET',
    url: entry.name,
    host: host,
    port: port,
    urlPath: urlPath,
    error: false, // Boolean
    errorDomain: undefined, // keep empty by now
    errorDescription: undefined,
    elapsedTime: undefined
  };
  assign(baseInfo, moreInfo);
  return baseInfo;
};
