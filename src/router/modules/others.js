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
const others = [
    {
        path: '/kdxOthers/webview',
        name: 'webview',
        meta: {
            title: '',
            needLogin: false
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxOthers/followPoster',
        name: 'followPoster',
        meta: {
            title: '关注',
            needLogin: false
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxOthers/close/close',
        name: 'home_close'
    },
    {
        path: '/kdxOthers/pluginsInvalid',
        name: 'pluginsInvalid'
    },
    {
        path: '/kdxOthers/notice/detail',
        name: 'notice_detail',
        meta: {
            title: '公告详情',
            needLogin: false
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxOthers/form/success',
        name: 'formSuccess',
        meta: {
            title: '提交成功'
        }
    },
    {
        path: '/kdxOthers/paySuccess',
        name: 'paySuccess',
        meta: {
            title: '支付成功',
            needLogin: false
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxOthers/middle/wxapp',
        name: 'wxapp',
        meta: {
            title: '小程序跳转',
            needLogin: false
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    }
]
export default others
