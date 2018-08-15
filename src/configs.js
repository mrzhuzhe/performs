export var defaultConfigs = {
  trackerDomain: 'http://t.imaisu.com/api',
  sdkVer: '1.2.1',
  appVer: '0.0.0',
  appName: location.hostname,
  pageName: undefined,
  source: 'web',

  // feature switches
  // will probably be overwritten by site configs
  sendingTypes: {
    load: true,
    error: true,
    event: true,
    asset: false,
    http: true,

    // disabled by default
    api: false
    // important note!!
    // if you want to enable this, make sure API servers handle `X-ELEME-RequestID` correctly
  },

  // to checking with window[x], an exmaple configure: ['Promise', 'fetch']
  ensureVariables: [],

  // feature configs

  // when api is to be captured, use this to choose the requests to add requestId
  etraceApiFilter: /(^\/[^\/])|^(https?:)?\/\/([^\/]+\.)?(ele(net)?\.me)/,

  // real-time configurations
  // in URL without @json it would return JavaScript code
  configsUrl: `https://crayfish.elemecdn.com/perf.js@json/sdk-config/${location.hostname}`,
  // configsUrl: 'http://perf.alpha.elenet.me/v2/sdk/config/type' // development

  // let perf generate the id
  ssid: null
};
