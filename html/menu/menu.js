/*by zhuhy*/
summerready = function () {
    initPage();
};

//判断是否存在json的key
function objIsEmpty(obj) {
    if (obj != undefined && obj != null && obj != "") {
        return false;
    } else {
        return true;
    }
};
//判断是否为空
function isEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "" || obj.trim() == "") {
        return true;
    } else {
        return false;
    }
};

var turn = 0;

var vue = null;

function initPage() {
    // 构造控件Vue实例
    vue = new Vue({
        el: '#index',
        data: {
            netStatus: 0,
            baseUrlLogin: summer.getStorage('loginIP'),
            //属于哪个部门
            // dept: summer.pageParam.dept,
            dept: "income",
            usrname: summer.getStorage('usrname'),
            availableModules: eval(summer.pageParam.availableModules),
            //dept : "sale",
            deptShowName: "",
            //可用的功能模块
            modules: [],
            timeOutEvent: 0,
            touchStatus: 0,
            pulldownToggle: false
        },
        methods: {
            //检查更新
            checkUpdate: function () {
                var info = summer.getSysInfo();
                var appKey = (info.systemType == "android") ? "0dd61973cfdc6a63781232d9249500c4" : "dcdaddc8ee5a0770ac203e757faa0d49";
                var accountkey = "706dea0e787c151c278696fa885e38c4";
                var versionInfo = summer.getAppVersion();
                var version = JSON.parse(versionInfo);
                var url = "http://www.pgyer.com/apiv2/app/check?_api_key=" + accountkey + "&appKey=" + appKey + "&buildVersion=" + version.versionName;

                $.ajax({
                    url: url,
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    async: true,
                    timeout: 5000,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("User-Agent", "headertest");
                    },
                    success: function (data) {
                        if (data.data.buildHaveNewVersion) {
                            UM.confirm({
                                title: "检测到新版本：" + data.data.buildVersion,
                                text: "更新内容：" + data.data.buildUpdateDescription,
                                btnText: ["暂不安装", "安装更新"],
                                overlay: true,
                                duration: 2000,
                                cancle: function () { },
                                ok: function () {
                                    summer.openWebView({
                                        url: data.data.downloadURL
                                    });
                                }
                            });
                        }
                    },
                    error: function (err) { },
                    complete: function (XMLHttpRequest, status) { }
                });
            },
            checkNet: function () {
                var param = {}
                roads.oldSkoolAjax(vue.baseUrlLogin + "/service/validate", param, "get", function (data) {
                    if (data.status)
                        vue.netStatus = 1;
                });
            },
            //初始化模块列表
            initModules: function () {
                //根据公司获取信息
                var allList = this.langFunk(this.dept).moduleList;
                // for (var i = 0; i < allList.length; i++) {
                // 	var moduleId = allList[i].module_id;
                // 	if (!vue.checkAvailability(moduleId))
                // 		allList.splice(i--, 1);
                // };

                this.modules = allList;
                this.deptShowName = this.langFunk(this.dept).showName;
            },
            // checkAvailability: function (moduleId) {
            // 	var flag = 0;
            // 	$.each(vue.availableModules, function (i, obj) {
            // 		flag += (moduleId == obj) ? 1 : 0;
            // 	});
            // 	return flag;
            // },
            //初始化轮播
            initSlider: function () {
                var imgPath = "https://raw.githubusercontent.com/BIZZEW/rnbupdate/master/banner/";
                var list = [{
                    content: imgPath + "receive/bg1.jpg"
                }, {
                    content: imgPath + "receive/bg2.jpg"
                }, {
                    content: imgPath + "receive/bg3.jpg"
                }, {
                    content: imgPath + "receive/bg4.jpg"
                }, {
                    content: imgPath + "receive/bg5.jpg"
                }, {
                    content: imgPath + "receive/bg6.jpg"
                }];
                var islider = new iSlider({
                    type: 'pic',
                    data: list,
                    dom: document.getElementById("iSlider-wrapper"),
                    isLooping: true,
                    animateType: 'default',
                    animateEasing: 'ease-in-out',
                    isAutoplay: true,
                    animateTime: 800
                });
            },
            tapHold: function (index) {
                // 这里编辑长按列表项逻辑
                this.touchStatus = 1;
            },
            moveTapHold: function (index) {
                this.touchStatus = 0;
            },
            cancelTapHold: function (index) {
                var item = this.modules[index];
                // 取消长按
                if (!this.netStatus) {
                    roads.alertAIO(1);
                } else if (this.touchStatus) {
                    roads.openWin(this.dept, item["module_id"] + "", item["module_id"] + "/" + item["module_id"] + ".html", {
                        "dept": this.dept,
                        "module_id": item["module_id"],
                        "module_title": item["module_title"],
                        "record_id": "-999"
                    });
                }
                this.touchStatus = 0;
            },
            exitApp: function (param) {
                UM.confirm({
                    title: vue.langFunk("confirmExitTitle"),
                    text: vue.langFunk("confirmExitText"),
                    btnText: [vue.langFunk("cancelBtntext"), vue.langFunk("confirmBtntext")],
                    overlay: true,
                    duration: 2000,
                    cancle: function () { },
                    ok: vue.okCallback
                });
            },
            okCallback: function () {
                summer.setStorage('loginStatus', 0);
                var t = setTimeout(function () {
                    her.loadingSpring(vue.langFunk("loading"));
                    roads.openWinSpecial("login", "login", "login.html", {});
                }, 2000);
            },
            goSettings: function () {
                roads.openWin("menu", "settings", "settings/settings.html", {
                    "dept": vue.dept,
                    "module_id": vue.module_id
                });
            },
            langFunk: function (strTag) {
                var langCode = isEmpty(summer.getStorage('lang')) ? 1 : summer.getStorage('lang');
                return lang.getStr(langCode, strTag);
            },
            backfrModule: function (param) {
                UM.toast({
                    "title": vue.langFunk("opSucceeded"),
                    "text": eval(param)["module_title"] + vue.langFunk("opSucceededText"),
                    "duration": 3000
                });
            },
            formSubmitted: function (param) {
                roads.alertAIO("表单数据提交成功！");
            }
        },
        mounted: function () {
            // 加载数据...
            this.$nextTick(function () {
                this.checkNet();
                this.initSlider();
                this.initModules();
                this.checkUpdate();
            })
        }
    });
}

// reference to last opened menu
var $lastOpened = false;

// simply close the last opened menu on document click
$(document).click(function () {
    if ($lastOpened) {
        $lastOpened.removeClass('open');
    }
});

// simple event delegation
$(document).on('click', '.pulldown-toggle', function (event) {
    // jquery wrap the el
    var el = $('.pulldown-toggle');
    // prevent this from propagating up
    event.preventDefault();
    event.stopPropagation();
    // check for open state
    if (el.hasClass('open')) {
        el.removeClass('open');
    } else {
        if ($lastOpened) {
            $lastOpened.removeClass('open');
        }
        el.addClass('open');
        $lastOpened = el;
    }
});

function refresh() {
    window.location.reload();
};

function keyBack() {
    turn++;
    if (turn == 2) {
        clearInterval(intervalID);
        summer.exitApp();
    } else {
        summer.toast({
            "msg": "再点击一次退出应用"
        });
    }
    var intervalID = setInterval(function () {
        clearInterval(intervalID);
        turn = 0;
    }, 3000);
};

function gainFocus() {
    setTimeout(function () {
        try {
            document.getElementById('invisibleInput').focus();
        } catch (e) { }
    }, 3000);
};