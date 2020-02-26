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

// const customers = [
//     {
//         "code": "001",
//         "name": "省份1",
//         "childs": [
//             {
//                 "code": "001-1",
//                 "name": "城市1",
//             },
//             {
//                 "code": "001-2",
//                 "name": "城市2",
//             }
//         ]
//     },
//     {
//         "code": "002",
//         "name": "省份2",
//         "childs": [
//             {
//                 "code": "002-1",
//                 "name": "城市3",
//             },
//             {
//                 "code": "002-2",
//                 "name": "城市4",
//             }
//         ]
//     },
//     {
//         "code": "003",
//         "name": "省份3",
//         "childs": [
//             {
//                 "code": "003-1",
//                 "name": "城市5",
//             },
//             {
//                 "code": "003-2",
//                 "name": "城市6",
//             }
//         ]
//     },
// ];

var vue = null;

function initPage() {
    vue = new Vue({
        el: '#index',
        data: {
            loginIP: summer.getStorage('loginIP'),
            dept: summer.pageParam.dept,
            module_id: summer.pageParam.module_id,
            module_title: summer.pageParam.module_title,
            content: summer.pageParam.itemContent,
            usercode: summer.getStorage('usrcode'),

            infodate: "",
            paymethod: "",
            account1: "",
            account2: "",
            releasemoney: "",

            // 客户
            oppunitname: "",
            pk_oppunitname: "",
            // 订单客户
            popupVisibleCustomer: false,
            ordername: null,
            pk_ordercustomer: null,
            customers: [],

            // 收支项目
            popupVisibleInoutbusiclass: false,
            inoutbusiclass: null,
            pk_inoutbusiclass: null,
            inoutbusiclasses: [],

            // 人员PK
            pk_psndoc: "",
            // 资金计划PK
            pk_plan: "",
            // 资金计划名称
            planname: "",
            // 资金计划编码
            plancode: "",
            // 部门PK
            pk_dept: "",

            // 组织PK
            pk_org: "",
            // 到账通知PK
            pk_informer: "",
        },
        methods: {
            fillPage0: function () {
                var parsedData = JSON.parse(vue.content);

                vue.pk_org = parsedData.pk_org;
                vue.pk_informer = parsedData.pk_informer;

                // 客户
                vue.oppunitname = parsedData.oppunitname;
                vue.pk_oppunitname = parsedData.pk_oppunitname;
                // 订单客户
                vue.ordername = parsedData.oppunitname;
                vue.pk_ordercustomer = parsedData.pk_oppunitname;

                vue.infodate = parsedData.infodate;
                vue.paymethod = parsedData.paymethod;
                vue.account1 = parsedData.account1;
                vue.account2 = parsedData.account2;
                vue.releasemoney = parsedData.releasemoney;

                vue.getCustomers();
                vue.getInoutbusiclasses();
            },
            // 返回
            goback: function () {
                roads.closeWin();
            },
            onValuesChange(picker, values) {
                // if (!values[0]) {
                //     this.$nextTick(() => {
                //         if (this.customer) {
                //             // 赋默认值
                //         } else {
                //             picker.setValues([customers[0], customers[0].childs[0]])
                //         }
                //     });
                // } else {
                //     picker.setSlotValues(1, values[0].childs);
                //     let town = [];
                //     if (values[1]) {
                //         town = values[1].childs;
                //     }
                //     picker.setSlotValues(2, town);
                // }
            },
            confirmChangeCustomer: function () {
                this.ordername = this.$refs.customerPicker.getValues()[0].ordername;
                this.pk_ordercustomer = this.$refs.customerPicker.getValues()[0].pk_ordercustomer;
                this.popupVisibleCustomer = false;
            },
            confirmChangeInoutbusiclass: function () {
                this.inoutbusiclass = this.$refs.inoutbusiclassPicker.getValues()[0].name;
                this.pk_inoutbusiclass = this.$refs.inoutbusiclassPicker.getValues()[0].pk_inoutbusiclass;

                // 人员PK
                this.pk_psndoc = this.$refs.inoutbusiclassPicker.getValues()[0].pk_psndoc;
                // 资金计划PK
                this.pk_plan = this.$refs.inoutbusiclassPicker.getValues()[0].pk_plan;
                // 资金计划名称
                this.planname = this.$refs.inoutbusiclassPicker.getValues()[0].planname;
                // 资金计划编码
                this.plancode = this.$refs.inoutbusiclassPicker.getValues()[0].plancode;
                // 部门PK
                this.pk_dept = this.$refs.inoutbusiclassPicker.getValues()[0].pk_dept;

                this.popupVisibleInoutbusiclass = false;
            },
            getInoutbusiclasses: function () {
                try {
                    var param = {
                        pk_org: vue.pk_org,
                        usercode: vue.usercode,
                    }
                    roads.oldSkoolAjax(vue.loginIP + "/cusapl/refproject", param, "post", function (res) {
                        var result = JSON.parse(res.data);
                        switch (result.status) {
                            case -1:
                                // roads.alertAIO(vue.langFunk("noUsr"));
                                vue.inoutbusiclasses = [];
                                break;
                            case 1:
                                vue.inoutbusiclasses = [
                                    {
                                        values: eval(result.data)
                                    }
                                ];
                                break;
                            case 0:
                                roads.alertAIO(0);
                                vue.inoutbusiclasses = [];
                                break;
                            default:
                                break;
                        }
                    });
                } catch (e) {
                    alert(e)
                }

            },
            getCustomers: function () {
                var param = {
                    pk_oppunitname: vue.pk_oppunitname,
                    oppunitname: vue.oppunitname
                }
                roads.oldSkoolAjax(vue.loginIP + "/cusapl/refordercustomer", param, "post", function (res) {
                    var result = JSON.parse(res.data);
                    switch (parseInt(result.status)) {
                        case -1:
                            // roads.alertAIO(vue.langFunk("noUsr"));
                            vue.customers = [];
                            break;
                        case 1:
                            var customerslist = eval(result.data);
                            // 把客户也插入订单客户的下拉选项列表里
                            customerslist.push({
                                pk_ordercustomer: vue.pk_oppunitname,
                                ordername: vue.oppunitname
                            });

                            vue.customers = [
                                {
                                    values: customerslist
                                }
                            ];
                            break;
                        case 0:
                            roads.alertAIO(0);
                            vue.customers = [];
                            break;
                        default:
                            break;
                    }
                });
            }
        },
        watch: {},
        mounted: function () {
            // 加载数据...
            this.$nextTick(function () {
                //监听返回按钮
                document.addEventListener("backbutton", this.goback, false);

                vue.fillPage0();
                // vue.getInoutbusiclasses();
                // vue.getCustomers();
            })
        }
    });
};