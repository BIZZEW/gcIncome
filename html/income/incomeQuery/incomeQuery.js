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
    if (typeof obj == "undefined" || obj == null || obj == "" || obj.trim() == "") {
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
            loginIP: summer.getStorage('loginIP'),
            dept: summer.pageParam.dept,
            module_id: summer.pageParam.module_id,
            module_title: summer.pageParam.module_title,
            record_id: parseInt(summer.pageParam.record_id),
            popupVisible: false,

            //起始日期
            beginDate: new Date().format("yyyy-MM-dd"),
            beignDatePickerValue: new Date(),
            //结束日期
            stopDate: new Date().format("yyyy-MM-dd"),
            stopDatePickerValue: new Date(),

            client: "",

            logList: [],
            // logList: [{}, {}, {}, {}, {}, {}, {}, {}],

            //分页使用
            isLoading: false,
            //条目高度值
            threshold: null,
            //当前请求数据页码
            currentPage: 0,
            //控制是否加载更多
            endFlag: false,
            //控制加载文字
            loadText: "正在加载更多",
            //控制旋转
            spinning: false,

            usercode: summer.getStorage('usrcode'),
        },
        methods: {
            onScroll: function (evt) {
                console.log("scrollingnew");
                var box = document.getElementsByClassName("ultra-list-item");
                vue.threshold = box[0].clientHeight;
                const el = evt.target;
                const height = el.scrollHeight - el.offsetHeight;
                const scroll = el.scrollTop;
                const distance = height - scroll;
                const needLoad = distance < vue.threshold;
                if (needLoad && !vue.isLoading && vue.endFlag)
                    vue.loadMore();
            },
            onValueChange: function (picker, value) { },
            // 打开日期picker 视图
            open: function (picker) {
                this.$refs[picker].open();
            },
            handleDateConfirm: function (tag, value) {
                //console.log(tag);
                tag == "begin" ? this.beginDate = value.format("yyyy-MM-dd") : this.stopDate = value.format("yyyy-MM-dd");
            },
            reset: function () {
                this.beginDate = new Date().format("yyyy-MM-dd");
                this.stopDate = new Date().format("yyyy-MM-dd");
                this.logList = [];
                this.currentPage = 0;
            },
            query: function () {
                if ((vue.beginDate == "") || (vue.stopDate == "")) {
                    her.loaded();
                    roads.toastAIO("请先完整填选所有的字段再提交！", 3000, 1);
                } else {

                    var searchText = vue.client;
                    searchText = encodeURI(searchText);

                    var param = {
                        "usercode": vue.usercode,
                        "starttime": vue.beginDate + " 00:00:00",
                        "endtime": vue.stopDate + " 23:59:59",
                        "customername": searchText,
                        "currentPage": vue.currentPage
                    };

                    var url = vue.loginIP + "/cusapl/collectlist";

                    roads.oldSkoolAjax(url, param, "post", function (res) {
                        var result = JSON.parse(res.data);
                        switch (result.status) {
                            case -1:
                                roads.alertAIO(result.message);
                                break;
                            case 0:
                                roads.alertAIO(result.message);
                                break;
                            case 1:
                                var parsedData = JSON.parse(result.data);
                                vue.logList = parsedData;
                                vue.endFlag = result.endFlag;
                                break;
                            case 2:
                                roads.alertAIO(result.message);
                                break;
                            default:
                                break;
                        }
                    });
                }
            },
            goDetail: function (index) {
                var item = this.logList[index];
                var tmp = "incomeQueryDetail";
                console.log(vue.module_id + "/" + tmp + "/" + tmp + ".html");
                roads.openWin(this.dept, tmp, vue.module_id + "/" + tmp + "/" + tmp + ".html", {
                    "pondId": item.vbillcode,
                    "gatherbillPk": item.pk_gatherbill,


                    "module_id": vue.module_id,
                    "dept": vue.dept,
                    "flag": 0,
                    "itemContent": JSON.stringify(item)
                });
            },
            // 返回
            goback: function () {
                roads.closeWin();
            },
            loadMore: function () {
                if (!vue.spinning) {
                    vue.isLoading = true;
                    vue.spinning = true;
                    vue.loadText = "正在加载更多";

                    var param = {
                        "usercode": vue.usercode,
                        "starttime": vue.beginDate + " 00:00:00",
                        "endtime": vue.stopDate + " 23:59:59",
                        "customername": vue.client,
                        "currentPage": (vue.currentPage + 1),
                    };
                    var url = vue.loginIP + "/cusapl/collectlist";

                    window.cordovaHTTP.settings = { timeout: 8000 };

                    summer.ajax({
                        type: "post",
                        url: url,
                        param: param,
                        header: {
                            "Content-Type": "application/json:charset=UTF-8"
                        }
                    }, function (res) {
                        var result = JSON.parse(res.data);
                        switch (result.status) {
                            case -1:
                                vue.loadText = "加载失败，点击重试";
                                break;
                            case 1:
                                //接收是否还可以加载更多的标识
                                vue.endFlag = result.endFlag;
                                //接收新的一页数据
                                var moreList = JSON.parse(result.data);
                                //插入数据
                                for (var i = 0; i < moreList.length; i++)
                                    vue.logList.push(moreList[i]);
                                //当前请求数据页码自增
                                vue.currentPage++;
                                //加载部件隐藏
                                vue.isLoading = false;
                                break;
                            default:
                                break;
                        }
                        vue.spinning = false;
                    }, function (response) {
                        vue.loadText = "加载失败，点击重试";
                        vue.spinning = false;
                    });
                }
            }
        },
        watch: {},
        mounted: function () {
            // 加载数据...
            this.$nextTick(function () {
                //监听返回按钮
                document.addEventListener("backbutton", this.goback, false);

                var topBar = document.getElementsByClassName("um-header")[0];
                var queryKit = document.getElementsByClassName("query-kit")[0];
                var ultraScrollList = document.getElementsByClassName("ultra-scroll-list")[0];

                const windowHeight = document.body.clientHeight;
                const topBarHeight = 44;
                const queryKitHeight = 275;
                var tmpHeight = windowHeight - topBarHeight - queryKitHeight;
                ultraScrollList.style.height = tmpHeight + "px";
            })
        }
    });
};