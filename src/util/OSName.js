var _getOSName = function () {
	var _ua = window.navigator.userAgent.toLocaleLowerCase()
	var _res = "other";
	if (!!_ua.match(/(ipad|iphone)/i)) {
		_res = "IOS";
	} else if (!!_ua.match(/android/i)) {
		_res = "androud";
	} else if (!!_ua.match(/MSIE/i)) {
		_res = "IE";
	}
	return _res
}

export var OSName = _getOSName()