import { send } from '../send';

export function watchLoad() {
  var w = window;

  // save performance
  var isLoad = 0;

  function caculatePerf() {
    /* var table = [
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
    }); */

    // parse Url paramenter then assgin to detail
    /*
		website：页面网址，http://xxx.cn
		page：页面名称，/index/，/goods/，/order/confirm/，/order/finish/   目前只需统计这4个页面
		goods：商品类型，px606，qk916
		hmsr：来源渠道，fei_message，jin_message
		hmpl：来源细节，20180628
		hmcu：用户标识，15201790279
		hmad：关联说明，ad，px606
     */
    
    var _page = ["index", "goods","order/confirm", "order/finish"];
    var _goods = "[a-z\\d]+";
    var _regExp = new RegExp("(http[s]*://[^/]+)(/(?:" + _page.join("|") +  ")/)(" + _goods + ")", "i");
    var _res =  window.location.href.match(_regExp);
    var detail = _res && _res.length > 3 ? { 
    	"website":_res[1],
		"page":_res[2],
		"goods":_res[3]
    }:{};    
    var _pareseSearchQuery = (key) => {
      var location = window.location;
	  var _reg = new RegExp("(" + key + ")=([^?&#]+)", "i");
      var res = location.search.match(_reg);    
      return res && res.length && res[2] ? res[2] : ""
    }
    var _query = ["hmsr", "hmpl", "hmcu", "hmad"];
    _query.forEach(e => {
    	detail[e] = _pareseSearchQuery(e);
    })    
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
