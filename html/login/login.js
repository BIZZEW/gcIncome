/*by zhuhy*/
summerready = function () {
    initPage();
}
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
    if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
    } else {
        return false;
    }
};

var vue = null;

function initPage() {
    vue = new Vue({
        el: '#index',
        data: {
            //0:未登录；2:初始；1:已登录
            loginStatus: 2,
            sessionId: "",
            //1:中文；0:英文
            lang: 1,
            serverShow: false,
            turn: 0,
            serverShow2: false,
            turn2: 0,
            dept: "",
            ip: "",
            usrname: "",
            usrcode: "",
            usrtype: "",
            password: "",
            showPD: false,
            remeberPD: 0,
            //公司选择功能
            coWindowToggle: false,
            //存储的公司信息
            loginCompany: "",
            loginCode: "",
            loginIP: "",
            loginPk: "",

            //输入的搜索词
            coInput: "",
            userList: [],
            // userList: [{ username: "11" }, { username: "22" }, { username: "33" }, { username: "44" }, { username: "55" }],
            coList: [],
            availableModules: "",
            // NCIP: ""
        },
        methods: {
            secretDoor: function (target) {
                this.turn++;
                if (this.turn == target) {
                    vue.serverShow = !vue.serverShow;
                }
                var intervalID = setInterval(function () {
                    clearInterval(intervalID);
                    vue.turn = 0;
                }, 3000);
            },
            secretDoor2: function (target) {
                this.turn2++;
                if (this.turn2 == target) {
                    vue.serverShow2 = !vue.serverShow2;
                }
                var intervalID2 = setInterval(function () {
                    clearInterval(intervalID2);
                    vue.turn2 = 0;
                }, 3000);
            },
            //初始化页面
            fillPage: function () {
                var langTmp = summer.getStorage('lang');
                vue.lang = isEmpty(langTmp) ? 1 : langTmp;

                var modulesTmp = summer.getStorage('availableModules');
                vue.availableModules = isEmpty(modulesTmp) ? "" : modulesTmp;

                var tmp = summer.getStorage('loginStatus');
                vue.loginStatus = isEmpty(tmp) ? 0 : tmp;

                setTimeout(function () {
                    if (vue.loginStatus == 1 || vue.loginStatus == "1")
                        vue.goMenu("sale");
                }, 1000);

                var loginIPStore = summer.getStorage('loginIP');

                if (!isEmpty(loginIPStore))
                    this.loginIP = loginIPStore;

                var remeberPD = summer.getStorage('remeberPD');
                var usrname = summer.getStorage('usrname');
                var usrcode = summer.getStorage('usrcode');
                var password = summer.getStorage('password');

                if (!isEmpty(remeberPD)) {
                    this.remeberPD = parseInt(remeberPD);
                    if (this.remeberPD) {
                        this.usrname = (!isEmpty(usrname)) ? usrname : "";
                        this.usrcode = (!isEmpty(usrcode)) ? usrcode : "";
                        this.password = (!isEmpty(password)) ? password : "";
                    }
                }
            },
            goMenu: function (tag) {
                roads.openWinSpecial("menu", "menu", "menu.html", {
                    "dept": tag,
                    "usrname": this.usrname,
                    "availableModules": this.availableModules
                });
            },
            userItemClick: function (index, e) {
                e.preventDefault();
                var item = this.userList[index];
                this.usrname = item.username;
                this.usrcode = item.usercode;
                this.usrtype = item.logo;
            },

            // 提交表单
            login: function () {
                // vue.loginStatus = 1;

                if (!isEmpty(this.usrname) && !isEmpty(this.password)) {
                    //记住密码逻辑
                    summer.setStorage('remeberPD', (this.remeberPD) ? "1" : "0");
                    summer.setStorage('usrname', this.usrname);
                    summer.setStorage('usrcode', this.usrcode);
                    summer.setStorage('password', this.password);
                    summer.setStorage('loginIP', vue.loginIP);

                    var tmpLang = summer.getStorage('lang');
                    var lang = isEmpty(tmpLang) ? "1" : tmpLang;
                    var param = {
                        "lang": lang,
                        "usercode": vue.usrcode,
                        "password": vue.password
                    };
                    roads.oldSkoolAjax(vue.loginIP + "/cusapl/userlogin", param, "post", function (res) {
                        var result = JSON.parse(res.data);

                        switch (result.status) {
                            case -1:
                                roads.alertAIO(result.message);
                                break;
                            case 0:
                                roads.alertAIO(0);
                                break;
                            case 1:
                                roads.vibrator(500);
                                UM.toast({
                                    "title": vue.langFunk("successToastTitle"),
                                    "text": vue.langFunk("loginSucceeded"),
                                    "duration": 1000
                                });
                                //记录登录状态
                                summer.setStorage('sessionId', result.sessionid);
                                summer.setStorage('loginStatus', result.status);
                                vue.sessionId = result.sessionid;
                                vue.loginStatus = result.status;
                                break;
                            case 2:
                                roads.alertAIO(vue.langFunk("wrongNameorPwd"));
                                break;
                            default:
                                break;
                        }
                    });
                } else
                    roads.alertAIO(vue.langFunk("emptyNameorPwd"));
            },
            langFunk: function (strTag) {
                return lang.getStr(vue.lang, strTag);
            },
            getUserList: function () {
                if (vue.loginIP != "") {
                    var tmpLang = summer.getStorage('lang');
                    var lang = isEmpty(tmpLang) ? "1" : tmpLang;
                    var param = {
                        "lang": lang,
                        "flag": "0"
                    }
                    roads.oldSkoolAjax(vue.loginIP + "/cusapl/userlist", param, "get", function (res) {
                        var result = JSON.parse(res.data);
                        switch (parseInt(result.status)) {
                            case -1:
                                roads.alertAIO(vue.langFunk("noUsr"));
                                vue.userList = [];
                                break;
                            case 1:
                                var userlistraw = result.data;
                                vue.userList = eval(userlistraw);
                                break;
                            case 0:
                                roads.alertAIO(0);
                                vue.userList = [];
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
        },
        watch: {
            lang: function (val) {
                summer.setStorage('lang', val);
            },
            loginStatus: function (val) {
                if (val == 1 || val == "1") {
                    vue.goMenu("sale");
                }
            },
        },
        mounted: function () {
            // 加载数据...
            this.$nextTick(function () {
                this.fillPage();
            })
        }
    })
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
$(document).on('click', '.pen-outer', function (event) {
    // jquery wrap the el
    var el = $('.pulldown-toggle');
    // prevent this from propagating up
    event.preventDefault();
    event.stopPropagation();
    // check for open state
    if (el.hasClass('open')) {
        el.removeClass('open');
    } else {
        vue.getUserList();
        if ($lastOpened) {
            $lastOpened.removeClass('open');
            // document.getElementsByClassName('pulldown-menu')[0].removeEventListener('touchmove', this.handler, { passive: false })// 打开默认事件
            // document.getElementsByClassName('pulldown')[0].removeEventListener('touchmove', this.handler, { passive: false })// 打开默认事件
        }
        el.addClass('open');
        $lastOpened = el;
        // document.getElementsByClassName('body')[0].addEventListener('touchmove', this.handler, { passive: false })// 阻止默认事件
    }
});

function keyBack() {
    summer.exitApp();
};