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
            tt: "3456",
            /*incomeQuery*/
            //起始日期
            beginDate: new Date().format("yyyy-MM-dd"),
            beignDatePickerValue: new Date(),
            //结束日期
            stopDate: new Date().format("yyyy-MM-dd"),
            stopDatePickerValue: new Date(),

            logList: [],
            // logList: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],

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
                var param = {
                    "usercode": vue.usercode,
                };

                var url = vue.loginIP + "/cusapl/receivlist";

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
                            vue.endFlag = true;
                            break;
                        case 2:
                            roads.alertAIO(result.message);
                            break;
                        default:
                            break;
                    }
                });
            },
            goDetail: function (index) {
                var item = this.logList[index];
                var tmp = "incomeConfirmDetail";
                console.log(vue.module_id + "/" + tmp + "/" + tmp + ".html");
                roads.openWin(this.dept, tmp, vue.module_id + "/" + tmp + "/" + tmp + ".html", {
                    "pondId": item.vbillcode,
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
        },
        watch: {},
        mounted: function () {
            // 加载数据...
            this.$nextTick(function () {
                //监听返回按钮
                document.addEventListener("backbutton", this.goback, false);

                this.query();
            })
        }
    });
};