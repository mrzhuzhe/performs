var _getBrowserName = function() {
    var ua = window.navigator.userAgent.toLowerCase();
    var browser = "";
    if (window.ActiveXObject) {
        browser = "IE";
    } else if (document.getBoxObjectFor || ua.indexOf("firefox") > -1) {
        browser = "Firefox";
    }
        //qq娴忚鍣�
    else if (ua.indexOf("qqbrowser") > -1) {
        browser = "qqbrowser";
    }
		//qq瀹㈡埛绔�
	else if (ua.indexOf("qq/") > -1) {
        browser = "qqclient";
    }
        //鐧惧害APP
    else if (ua.indexOf("baiduboxapp") > -1) {
        browser = "baiduboxapp";
    }
        //鐧惧害娴忚鍣�
    else if (ua.indexOf("baidubrowser") > -1) {
        browser = "baiduboxapp";
    }
        //鐧惧害
    else if (ua.indexOf("baidubrowser") > -1) {
        browser = "baidubrowser";
    }
        //uc娴忚鍣�
    else if (ua.indexOf("ucbrowser") > -1) {
        browser = "ucbrowser";
    }
        //灏忕背
    else if (ua.indexOf('miuibrowser') > -1) {
        browser = "miuibrowser";
    }
        //鐚庤惫
    else if (ua.indexOf('lbbrowser') > -1) {
        browser = "lbbrowser";
    }
        //360
    else if (ua.indexOf('qhbrowser') > -1 || ua.indexOf("360browser") >-1) {
        browser = "qhbrowser";
    }
        //hao123
    else if (ua.indexOf('hao123') > -1) {
        browser = "hao123";
    }
        //鎼滅嫍娴忚鍣�
    else if (ua.indexOf('sogoumobilebrowser') > -1) {
        browser = "sogousearch";
    }
    else if (ua.indexOf('maxthon') > -1) {
        browser = "maxthon";
    }
        //瀹夊崜鑷甫娴忚鍣� TODO 鏈夌枒鐐�
    else  if (ua.indexOf('androidbrowser') > -1) {
        browser = "androidbrowser";
    }
        //涓夋槦鑷甫娴忚鍣�
    else  if (ua.indexOf('samsung') > -1) {
        browser = "samsung";
    }    
        //鍗庝负 
    else  if (ua.indexOf('huawei') > -1) {
        browser = "huawei";
    } 
        //vivo 
    else  if (ua.indexOf('vivo') > -1) {
        browser = "vivo";
    }     
        //oppo 
    else  if (ua.indexOf('oppo') > -1) {
        browser = "oppo";
    }     
        //lenovo
    else  if (ua.indexOf('lenovo') > -1) {
        browser = "lenovo";
    }    
        //MicroMessenger
    else  if (ua.indexOf('micromessenger') > -1) {
        browser = "micromessenger";
    }     
        //weibo
    else  if (ua.indexOf('weibo') > -1) {
        browser = "weibo";
    }  
        //chorme
    else if (ua.indexOf("chrome") > -1) {
        browser = "Chrome";
    } else if (window.opera) {
        browser = "Opera";
    } else if (ua.indexOf("safari") > -1) {
        browser = "Safari";
    }
    return browser
}

export var browserName = _getBrowserName()