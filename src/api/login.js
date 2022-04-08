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
export const loginApi = {
    login: {
        method: 'get',
        api: '/client/wx-app/wx-app-login'
    },
    // 获取微信授权信息
    getAuth: {
        method: 'get',
        api: '/member/index/auth'
    },
    postAuth: {
        method: 'post',
        api: '/member/index/auth'
    },
    getLogin: {
        method: 'post',
        api: '/member/index/login'
    },
    // 获取图形验证码
    getCapture: {
        method: 'get',
        api: '/member/index/get-capture'
    },
    // 获取验证码
    sendSms: {
        method: 'post',
        api: '/member/index/send-sms'
    },
    // 注册
    toRegister: {
        method: 'post',
        api: '/member/index/register'
    },
    // 验证码登录
    loginByCode: {
        method: 'post',
        api: '/member/index/login-by-code'
    },
    // 找回密码
    resetPass: {
        method: 'post',
        api: '/member/index/forget-password'
    },
    // 修改密码
    changePW: {
        method: 'post',
        api: '/member/index/change-password'
    },
    // 绑定手机号
    bindMobile: {
        method: 'post',
        api: '/member/index/bind-mobile'
    },
    // 选择会员
    bindMember: {
        method: 'post',
        api: '/member/index/merge-member'
    },
    // 校验验证码
    validateCode: {
        method: 'post',
        api: '/member/index/check-sms-code'
    },
    // 换绑手机号
    changeBind: {
        method: 'post',
        api: '/member/index/change-bind-mobile'
    },
    // 检测登录状态
    checkLogin: {
        method: 'post',
        api: '/member/index/get-login-status',
        needCache: false,
    },
    // 统计 pv/uv
    viewRecord: {
        method: 'post',
        api: '/index/view-record'
    }

}