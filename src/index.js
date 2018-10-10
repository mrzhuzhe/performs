import {
  send
  , sendEvent
  , sendRawEvent
  , digestConfigs //  解析事件队列
 } from './send';

/* 七种全局监听 s */
import { watchErrors } from './report/error';
import { watchLoad } from './report/load';
import { watchEvents } from './report/event';
import { watchApis, watchAssets } from './report/network';
import { detectAjaxHttp, detectAssetHttp } from './report/http';
/* e */

import { defaultConfigs } from './configs';
import { loadConfigs } from './util/site-configs';
import { checkVariables } from './report/variables';
import { loadSsid } from './util/ssid';


// make sure the global configs is defined
if (!window.perfConfigs) {
  window.perfConfigs = {};
}

var fillInDefaultConfigs = function() {
  for (var k in defaultConfigs) {
    if (!window.perfConfigs[k]) {
      window.perfConfigs[k] = defaultConfigs[k];
    }
  }
  if (
    window.perfConfigs.source !== 'web' &&
    window.perfConfigs.source !== 'web-sw'
  ) {
    console.warn('[PERF] `source` field should be `web` or `web-sw`');
    window.perfConfigs.source = 'web';
  }
};

if (document.addEventListener != null) {
  var isTypesConfigured = window.perfConfigs.sendingTypes != null;

  fillInDefaultConfigs();
  // expose for access
  window.perf = { send, sendEvent, sendRawEvent };

  var featureConfigs = window.perfConfigs.sendingTypes;

  if (featureConfigs.error) watchErrors();
  if (featureConfigs.load) watchLoad();
  if (featureConfigs.event) watchEvents();
  if (featureConfigs.asset) watchAssets();

  if (featureConfigs.http) detectAssetHttp();
  if (featureConfigs.http) detectAjaxHttp();

  // adding delay to make sure polyfills and scripts loaded
  setTimeout(function() {
    // by default ensureVariables is [], means checking nothing
    checkVariables(window.perfConfigs.ensureVariables);
  }, 1000);

  // priorities: 1. use developer's configs,
  //             2. use online configs,
  //             3. fallback to default configs.
  if (isTypesConfigured) {
    if (featureConfigs.api) watchApis();
    digestConfigs(featureConfigs);
  } else {
    //  loadConfigs((error, godConfiguredTypes) => {
      var currentTypes = /* error == null ? godConfiguredTypes :*/ featureConfigs;
      // API's tracking is special, by default it's false
      // decide after God configs loaded, otherwise there is side-effects
      if (currentTypes.api) watchApis();
      // adjust module state of send
      digestConfigs(currentTypes);
    //  });
  }

  // actually create ssid in Cookies
  window.perfConfigs.ssid = loadSsid();
}
