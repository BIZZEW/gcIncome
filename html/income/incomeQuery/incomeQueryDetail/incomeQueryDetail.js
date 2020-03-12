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
            turn: 0,
            dept: summer.pageParam.dept,
            module_id: summer.pageParam.module_id,
            module_title: summer.pageParam.module_title,
            gatherbillPk: summer.pageParam.gatherbillPk,
            content: summer.pageParam.itemContent,

            billno: "",
            billdate: "",
            customer: "",
            ordercustomer: "",
            money: "",
            project: "",
            paymethod: "",
            account1: "",
            account2: "",
            discountrate: "",
        },
        methods: {
            fillPage0: function () {
                var param = {
                    pk_gatherbill: vue.gatherbillPk,
                };

                var url = vue.loginIP + "/cusapl/receivdetail";

                roads.oldSkoolAjax(url, param, "post", function (res) {
                    // alert(JSON.stringify(res));
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

                            vue.billno = parsedData.billno;
                            vue.billdate = parsedData.billdate;
                            vue.customer = parsedData.customer;
                            vue.ordercustomer = parsedData.ordercustomer;
                            vue.money = parsedData.money;
                            vue.project = parsedData.project;
                            vue.paymethod = parsedData.paymethod;
                            vue.account1 = parsedData.account1;
                            vue.account2 = parsedData.account2;
                            vue.discountrate = parsedData.discountrate;
                            break;
                        case 2:
                            roads.alertAIO(result.message);
                            break;
                        default:
                            break;
                    }
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

                vue.fillPage0();
            })
        }
    });
};