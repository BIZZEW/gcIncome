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

const customers = [
    {
        "code": "001",
        "name": "省份1",
        "childs": [
            {
                "code": "001-1",
                "name": "城市1",
            },
            {
                "code": "001-2",
                "name": "城市2",
            }
        ]
    },
    {
        "code": "002",
        "name": "省份2",
        "childs": [
            {
                "code": "002-1",
                "name": "城市3",
            },
            {
                "code": "002-2",
                "name": "城市4",
            }
        ]
    },
    {
        "code": "003",
        "name": "省份3",
        "childs": [
            {
                "code": "003-1",
                "name": "城市5",
            },
            {
                "code": "003-2",
                "name": "城市6",
            }
        ]
    },
];

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

            // 到账通知PK
            pk_informer: "",

            infodate: "",
            paymethod: "",
            oppunitname: "",
            customer: "",
            account1: "",
            account2: "",
            releasemoney: "",

            // 订单客户
            popupVisibleCustomer: false,
            customer: null,
            pk_customer: null,
            customers: [
                {
                    values: [
                        {
                            "name": "customers0",
                            "pk_customer": "pk_customer0"
                        },
                        {
                            "name": "customers1",
                            "pk_customer": "pk_customer1"
                        },
                        {
                            "name": "customers2",
                            "pk_customer": "pk_customer2"
                        },
                        {
                            "name": "customers3",
                            "pk_customer": "pk_customer3"
                        }
                    ]
                }
            ],
            // 收支项目
            popupVisibleInoutbusiclass: false,
            inoutbusiclass: null,
            pk_inoutbusiclass: null,
            inoutbusiclasses: [],
        },
        methods: {
            fillPage0: function () {
                var parsedData = JSON.parse(vue.content);

                vue.infodate = parsedData.infodate;
                vue.paymethod = parsedData.paymethod;
                vue.oppunitname = parsedData.oppunitname;
                // vue.account1 = parsedData.account1;
                // vue.account2 = parsedData.account2;
                vue.releasemoney = parsedData.releasemoney;
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
                this.customer = this.$refs.customerPicker.getValues()[0].name;
                this.pk_customer = this.$refs.customerPicker.getValues()[0].pk_customer;
                this.popupVisibleCustomer = false;
            },
            confirmChangeInoutbusiclass: function () {
                this.inoutbusiclass = this.$refs.inoutbusiclassPicker.getValues()[0].name;
                this.pk_inoutbusiclass = this.$refs.inoutbusiclassPicker.getValues()[0].pk_inoutbusiclass;
                this.popupVisibleInoutbusiclass = false;
            },
            getInoutbusiclasses: function () {
                try {
                    var param = {
                        pk_org: "test"
                    }
                    roads.oldSkoolAjax(vue.loginIP + "/cusapl/refproject", param, "post", function (res) {
                        var result = JSON.parse(res.data);
                        switch (result.status) {
                            case -1:
                                // roads.alertAIO(vue.langFunk("noUsr"));
                                vue.inoutbusiclasses = [];
                                break;
                            case 1:
                                var tmplist = [{
                                    values: eval(result.data)
                                }]
                                vue.inoutbusiclasses = [{
                                    values: eval(result.data)
                                }];
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
                    pk_org: "test"
                }
                roads.oldSkoolAjax(vue.loginIP + "/cusapl/refproject", param, "post", function (res) {
                    var result = JSON.parse(res.data);
                    switch (parseInt(result.status)) {
                        case -1:
                            // roads.alertAIO(vue.langFunk("noUsr"));
                            vue.inoutbusiclasses = [];
                            break;
                        case 1:
                            var inoutbusiclasslist = result.data;
                            var tmpList = [
                                {
                                    values: eval(inoutbusiclasslist)
                                }
                            ]
                            vue.inoutbusiclasses = tmpList;
                            break;
                        case 0:
                            roads.alertAIO(0);
                            vue.inoutbusiclasses = [];
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
                vue.getInoutbusiclasses();
                // vue.getCustomers();
            })
        }
    });
};