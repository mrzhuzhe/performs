import { send } from '../send';

export function watchLoad() {
  var w = window;

  // save performance
  var isLoad = 0;

  function caculatePerf() {
    var table = [
      ['lookup', ['domainLookupEnd', 'domainLookupStart']],
      ['connect', ['connectEnd', 'connectStart']],
      ['waiting', ['responseStart', 'requestStart']],
      ['receiving', ['responseEnd', 'responseStart']],
      ['parsing', ['domComplete', 'domLoading']],
      ['contentLoaded', ['domContentLoadedEventStart', 'navigationStart']],
      ['pageLoaded', ['loadEventStart', 'navigationStart']]
    ];

    var detail = {};
    table.forEach(item => {
      let [end, start] = item[1];
      detail[item[0]] = w.performance.timing[end] - w.performance.timing[start];
    });
    return detail;
  }

  function savePerf() {
    if (isLoad) return;
    isLoad = 1;
    send('load', caculatePerf());
  }

  function saveUnloadPerf() {
    if (isLoad) return;
    isLoad = 1;
    send('unload', caculatePerf());
  }

  if (w.performance) {
    w.addEventListener('beforeunload', saveUnloadPerf);
    w.addEventListener('load', savePerf);
  }
}
