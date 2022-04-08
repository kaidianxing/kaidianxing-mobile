/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息
 */
const order = [
    {
        path: '/kdxOrder/create',
        name: 'order_create',
        meta: {
            title: '确认订单',
            needLogin: true,
            bindSence: 'buy'
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
    {
        path: '/kdxOrder/remarkBuyer',
        name: 'order_remarkBuyer',
        meta: {
            title: '买家留言',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
    {
        path: '/kdxOrder/invoice',
        name: 'order_invoice',
        meta: {
            title: '发票信息',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
    {
        path: '/kdxOrder/alipay',
        name: 'order_alipay',
        meta: {
            title: '支付宝支付',
            needLogin: false
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
    {
        path: '/kdxOrder/paySuccess',
        name: 'order_paySuccess',
        meta: {
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
    {
        path: '/kdxOrder/detail',
        name: 'order_detail',
        meta: {
            title: '订单详情',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
    {
        path: '/kdxOrder/list',
        name: 'order_list',
        meta: {
            title: '订单列表',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
    {
        path: '/kdxOrder/refund/list',
        name: 'order_refundList',
        meta: {
            title: '售后列表',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
    {
        path: '/kdxOrder/refund/start',
        name: 'order_refundStart',
        meta: {
            title: '选择售后类型',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
    {
        path: '/kdxOrder/refund/action',
        name: 'order_refundAction',
        meta: {
            title: '仅退款',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    }, {
        path: '/kdxOrder/refund/detail',
        name: 'order_refundDetail',
        meta: {
            title: '退款详情',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    }, {
        path: '/kdxOrder/refund/express',
        name: 'order_refundExpress',
        meta: {
            title: '填写快递单号',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    }, {
        path: '/kdxOrder/refund/expressChoose',
        name: 'order_chooseExpress',
        meta: {
            title: '选择快递公司',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    }, {
        path: '/kdxOrder/refund/expressInfo',
        name: 'order_expressInfo',
        meta: {
            title: '查看物流',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
    {
        path: '/kdxOrder/package/list',
        name: 'order_package_list',
        meta: {
            title: '查看物流',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
    {
        path: '/kdxOrder/package/detail',
        name: 'order_package_detail',
        meta: {
            title: '物流详情',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
    {
        path: '/kdxOrder/comment/list',
        name: 'order_nocomments',
        meta: {
            title: '待评价商品',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
    {
        path: '/kdxOrder/comment/index',
        name: 'order_comments',
        meta: {
            title: '评价',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    }
    
]
export default order