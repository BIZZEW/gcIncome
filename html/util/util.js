window.roads = (function (win, r) {
    // 是否Debug模式
    r.G_DEBUG_MODE = true;

    r.G_BASE_SALE_URL = "html/sale/";
    r.G_BASE_PROCURE_URL = "html/procure/";
    r.G_BASE_RECEIVE_URL = "html/receive/";
    r.G_BASE_INCOME_URL = "html/income/";
    r.G_BASE_LOGIN_URL = "html/login/";
    r.G_BASE_MENU_URL = "html/menu/";
    r.G_BASE_UTIL_URL = "html/util/";

    /*多语*/
    r.langFunk = function (strTag) {
        var langCode = isEmpty(summer.getStorage('lang')) ? 1 : summer.getStorage('lang');
        return lang.getStr(langCode, strTag);
    };

    /**
     * 跨页面传值
     * @param {String} winid
     * @param {String} func
     * @param {Object} params 传递的参数
     */
    r.execScript = function (winid, func, params) {
        var paramStr = typeof params == "String" ? params : JSON.stringify(params);
        summer.execScript({
            winId: winid,
            script: func + '(' + paramStr + ');'
        });
    };

    r.checkTimeout = function (functionName) {
        var url2 = summer.getStorage('loginIP') + "/uapws/service/nc.itf.app.webservice.IPurchaseAppWebService/isTimeout";
        var tmpLang = summer.getStorage('lang');
        var lang = isEmpty(tmpLang) ? "1" : tmpLang;
        var param = {
            "lang": lang,
            requestMethod: functionName,
            status: ""
        };
        var data = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ipur='http://webservice.app.itf.nc/IPurchaseAppWebService'><soapenv:Header/><soapenv:Body><ipur:isTimeout><param>" + JSON.stringify(param) + "</param></ipur:isTimeout></soapenv:Body></soapenv:Envelope>";
        $.ajax({
            url: url2,
            type: "POST",
            dataType: "xml",
            contentType: "text/xml; charset=utf-8",
            data: data,
            async: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function (ret) { },
            error: function (err) { },
            complete: function (XMLHttpRequest, status) { }
        });
    };

    r.ajaxKernel = function (url, param, type, successCallback, functionName) {
        window.cordovaHTTP.settings = { timeout: 40000 };
        summer.ajax({
            type: type,
            url: url,
            param: param,
            header: {
                "Content-Type": "application/json:charset=UTF-8"
            }
        }, function (ret) {
            her.loadedSpring();
            successCallback(ret);
        }, function (response) {
            her.loadedSpring();
            r.alertAIO(r.langFunk("netDisconnect"));
        });
    };

    r.checkLogin = function (url, data, type, successCallback) {
        //提取方法名
        var functionName = url.split('/').pop();
        //除去“登录”和“获取用户列表”外的方法都要判断登录状态有效性
        if (functionName != "login" && functionName != "userList" && functionName != "userlist" && functionName != "userlogin") {
            var url2 = summer.getStorage('loginIP') + "/cusapl/checkstatus";

            var usrcode = summer.getStorage('usrcode');
            var sessionId = summer.getStorage('sessionId');
            var tmpLang = summer.getStorage('lang');
            var lang = isEmpty(tmpLang) ? "1" : tmpLang;
            var param = {
                "lang": lang,
                user_code: usrcode,
                sessionid: sessionId
            };

            window.cordovaHTTP.settings = { timeout: 8000 }; //设置5秒超时
            summer.post(url2, param, {
                // Authorization: "OAuth2: token"
            }, function (ret) {
                var result = JSON.parse(ret.data);

                if (result.status > 0)
                    r.ajaxKernel(url, data, type, successCallback, functionName);
                else {
                    her.loadedSpring();
                    summer.setStorage('loginStatus', 0);

                    r.alertAIO(r.langFunk("invalidLogin"));
                    r.openWinSpecial("login", "login", "login.html", {});
                }
            }, function (response) {
                her.loadedSpring();

                r.alertAIO(r.langFunk("netDisconnect"));
            });
        } else
            r.ajaxKernel(url, data, type, successCallback, functionName);
    };

    /*土味AJAX*/
    r.oldSkoolAjax = function (url, data, type, successCallback) {
        her.loadingSpring(r.langFunk("loading"));
        // 判断网络
        if (!summer.netAvailable()) {
            r.alertAIO(r.langFunk("invalidLogin"));
            her.loadedSpring();
            return false;
        }

        //判断登录状态是否有效
        r.checkLogin(url, data, type, successCallback);
    };

    //打开窗口
    r.openWin = function (module, winid, win_url, pageParam) {
        var baseUrl = "";
        switch (module) {
            case "sale":
                baseUrl = r.G_BASE_SALE_URL;
                break;
            case "procure":
                baseUrl = r.G_BASE_PROCURE_URL;
                break;
            case "receive":
                baseUrl = r.G_BASE_RECEIVE_URL;
                break;
            case "income":
                baseUrl = r.G_BASE_INCOME_URL;
                break;
            case "login":
                baseUrl = r.G_BASE_LOGIN_URL;
                break;
            case "menu":
                baseUrl = r.G_BASE_MENU_URL;
                break;
            case "util":
                baseUrl = r.G_BASE_UTIL_URL;
                break;
        }
        summer.openWin({
            id: winid,
            url: baseUrl + win_url,
            pageParam: pageParam
        });
    };

    // 监听打开窗口
    r.openWinSpecial = function (module, winid, win_url, pageParam) {
        var baseUrl = "";
        switch (module) {
            case "sale":
                baseUrl = r.G_BASE_SALE_URL;
                break;
            case "procure":
                baseUrl = r.G_BASE_PROCURE_URL;
                break;
            case "receive":
                baseUrl = r.G_BASE_RECEIVE_URL;
                break;
            case "income":
                baseUrl = r.G_BASE_INCOME_URL;
                break;
            case "login":
                baseUrl = r.G_BASE_LOGIN_URL;
                break;
            case "menu":
                baseUrl = r.G_BASE_MENU_URL;
                break;
            case "util":
                baseUrl = r.G_BASE_UTIL_URL;
                break;
        }
        summer.openWin({
            id: winid,
            url: baseUrl + win_url,
            pageParam: pageParam,
            addBackListener: true,
            isKeep: false,
            animation: {
                type: "fade",
                duration: 100
            }
        });
    };

    r.initializeWin = function (winid, module, win_url, toId) {
        var baseUrl = "";
        switch (module) {
            case "sale":
                baseUrl = r.G_BASE_SALE_URL;
                break;
            case "procure":
                baseUrl = r.G_BASE_PROCURE_URL;
                break;
            case "receive":
                baseUrl = r.G_BASE_RECEIVE_URL;
                break;
            case "income":
                baseUrl = r.G_BASE_INCOME_URL;
                break;
            case "login":
                baseUrl = r.G_BASE_LOGIN_URL;
                break;
            case "menu":
                baseUrl = r.G_BASE_MENU_URL;
                break;
            case "util":
                baseUrl = r.G_BASE_UTIL_URL;
                break;
        }
        summer.initializeWin({
            id: winid,
            url: baseUrl + win_url,
            toId: toId
        });
    };

    // 关闭窗口
    r.closeWin = function () {
        summer.closeWin();
    };

    // 关闭窗口并执行
    r.closeWinExec = function (winid, func, params) {

        var paramStr = typeof params == "String" ? params : JSON.stringify(params);
        summer.execScript({
            winId: winid,
            script: func + '(' + params + ');'
        });
        summer.closeWin();
    };

    // 关闭窗口确认
    r.confirmClose = function () {
        // UM.confirm({
        // 	title: "确认要离开吗",
        // 	text: "数据没保存或提交,将不会保存",
        // 	btnText: [vue.langFunk("cancelBtntext"), vue.langFunk("confirmBtntext")],
        // 	overlay: true,
        // 	duration: 2000,
        // 	cancle: function () {
        // 	},
        // 	ok: function (data) {
        // 		summer.closeWin();
        // 	}
        // });

        UM.confirm({
            title: r.langFunk("confirmCloseTitle"),
            text: r.langFunk("confirmCloseText"),
            btnText: [r.langFunk("cancelBtntext"), r.langFunk("confirmBtntext")],
            overlay: true,
            duration: 2000,
            cancle: function () { },
            ok: function (data) {
                summer.closeWin();
            }
        });
    };

    // 关闭窗口确认
    r.closetoWinExec = function (winId, func, params) {
        if (params != "") {
            var paramStr = typeof params == "String" ? params : JSON.stringify(params);
            summer.execScript({
                winId: winId,
                script: func + '(' + paramStr + ');'
            });
            //alert(func + '(' + paramStr + ');');
        } else {
            summer.execScript({
                winId: winId,
                script: func + '();'
            });
        }
        summer.closeToWin({
            id: winId,
            animation: {
                type: "fade", //动画类型（详见动画类型常量）
                subType: "from_right", //动画子类型（详见动画子类型常量）
                duration: 300 //动画过渡时间，默认300毫秒
            }
        });
    };

    // 退出应用确认
    r.confirmExit = function () {
        UM.confirm({
            title: r.langFunk("confirmExitTitle"),
            text: r.langFunk("confirmExitText"),
            btnText: [r.langFunk("cancelBtntext"), r.langFunk("confirmBtntext")],
            overlay: true,
            duration: 2000,
            cancle: function () { },
            ok: function (data) {
                summer.setStorage('loginStatus', 0);
                var t = setTimeout(function () {
                    var params = ["android.permission.READ_EXTERNAL_STORAGE", "android.permission.WRITE_EXTERNAL_STORAGE", "android.permission.READ_PHONE_STATE"];
                    summer.getPermission(params, function (args) {
                        clearTimeout(t);
                        summer.exitApp();
                    }, function (args) {
                        r.alertAIO(args + "");
                    });
                }, 2000);
            }
        });
    };

    // 关闭窗口确认并执行
    r.confirmClosenExec = function (winid, func, params) {
        var paramStr = typeof params == "String" ? params : JSON.stringify(params);
        UM.confirm({
            title: r.langFunk("confirmCloseTitle"),
            text: r.langFunk("confirmCloseText"),
            btnText: [r.langFunk("cancelBtntext"), r.langFunk("confirmBtntext")],
            overlay: true,
            duration: 2000,
            cancle: function () { },
            ok: function (data) {
                summer.execScript({
                    winId: winid,
                    script: func + '(' + params + ');'
                });
                summer.closeWin();
            }
        });
    };

    //alert集中整理
    r.alertAIO = function (content) {
        var text = null;
        if (typeof (content) == "string")
            text = content;
        else if (typeof (content) == "number") {
            switch (content) {
                case (0):
                    text = r.langFunk("alertAIO0");
                    break;
                case (1):
                    text = r.langFunk("alertAIO1");
                    break;
                case (2):
                    text = r.langFunk("alertAIO2");
                    break;
                case (3):
                    text = r.langFunk("alertAIO3");
                    break;
                case (4):
                    text = r.langFunk("alertAIO4");
                    break;
                case (5):
                    text = r.langFunk("alertAIO5");
                    break;
                case (6):
                    text = r.langFunk("alertAIO6");
                    break;
                case (7):
                    text = r.langFunk("alertAIO7");
                    break;
                case (8):
                    text = r.langFunk("alertAIO8");
                    break;
                default:
                    text = r.langFunk("alertAIO");
                    break;
            }
        } else {
            text = r.langFunk("alertAIOerror");
        }

        UM.alert({
            title: text,
            btnText: [r.langFunk("cancelBtntext"), r.langFunk("confirmBtntext")],
            overlay: true,
            ok: function () { }
        });
    };

    // 日志输出
    r.log = function (msg) {
        if (r.G_DEBUG_MODE) {
            console.log(msg);
        }
    };

    //震动
    r.vibrator = function (duration) {
        var params = ["android.permission.VIBRATE"];
        summer.getPermission(params, function (args) {
            navigator.vibrate(duration);
        }, function (args) {
            r.alertAIO(args + "");
        });
    };

    //语音
    r.speech2 = function (content) {
        var audioHost = document.getElementById('audioHost');
        var audioCode = document.getElementById('audioCode');
        audioHost.removeChild(audioCode);
        audioHost.innerHTML = '<audio id="audioCode"><source id="tts_source_id" src="http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=6&pit=7&vol=13&text=' + content + '" type="audio/mpeg"><embed id="tts_embed_id" height="0" width="0" src=""></audio>';
        var audioCode = document.getElementById('audioCode');
        audioCode.play();
    };

    //本地语音
    r.speech3 = function (content) {
        var audioHost = document.getElementById('audioHost');
        var audioCode = document.getElementById('audioCode');
        var tmpLang = summer.getStorage('lang');
        var lang = isEmpty(tmpLang) ? "1" : tmpLang;
        audioHost.removeChild(audioCode);
        audioHost.innerHTML = '<audio id="audioCode"><source id="tts_source_id" src="../../../../audio/' + content + '-' + lang + '.mp3" type="audio/mpeg"><embed id="tts_embed_id" height="0" width="0" src=""></audio>';
        var audioCode = document.getElementById('audioCode');
        audioCode.play();
    };

    //本地语音
    r.speech = function (content) {
        var audioHost = document.getElementById('audioHost');
        var audioCode = document.getElementById('audioCode');
        var tmpLang = summer.getStorage('lang');
        var lang = isEmpty(tmpLang) ? "1" : tmpLang;
        audioHost.removeChild(audioCode);
        audioHost.innerHTML = '<audio id="audioCode"><source id="tts_source_id" src="../../../audio/' + content + '-' + lang + '.mp3" type="audio/mpeg"><embed id="tts_embed_id" height="0" width="0" src=""></audio>';
        var audioCode = document.getElementById('audioCode');
        audioCode.play();
    };

    return r;
})(window, window.roads || {})