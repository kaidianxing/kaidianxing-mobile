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

const login = [
    {
        //注意：path必须跟pages.json中的地址对应，最前面别忘了加'/'哦
        path: '/kdxLogin/index',
        name: 'login_login',
        meta: {
            title: '登录',
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
    {
        path: '/kdxLogin/register',
        name: 'login_register',
        meta: {
            title: '注册',
        },
        beforeEnter: (to, from, next) => {

            next();
        }
    },
    {
        path: '/kdxLogin/forget',
        name: 'login_forget',
        meta: {
            title: '密码找回',
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
    {
        path: '/kdxLogin/setPass',
        name: 'login_setPass',
        meta: {
            title: '设置登录密码',
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
    {
        path: '/kdxLogin/resetPass',
        name: 'login_resetPass',
        meta: {
            title: '重置登录密码',
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
    {
        path: '/kdxLogin/dealWechat',
        name: 'login_dealWechat',
        meta: {
            title: '微信认证',
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    }
]
export default login