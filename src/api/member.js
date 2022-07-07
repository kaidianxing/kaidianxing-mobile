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
export const memberApi = {
    getAddressBase: {
        // 地址库
        method: 'post',
        api: '/index/get-address-list',
    },
    addAddress: {
        method: 'post',
        api: '/member/address/create',
    },
    editAddress: {
        method: 'post',
        api: '/member/address/save',
    },
    getAddress: {
        method: 'get',
        api: '/member/address/edit',
    },
    getAddressList: {
        method: 'get',
        api: '/member/address/index',
    },
    deleteAddress: {
        method: 'get',
        api: '/member/address/delete',
    },
    getUserInfo: {
        method: 'get',
        api: '/member/index/user-info',
    },
    getCouponCenterList: {
        method: 'get',
        api: '/member/coupon',
    },
    getCoupon: {
        method: 'get',
        api: '/member/coupon/get-coupon',
        bindSence: 'get_coupon'
    },
    getCouponPayType: {
        method: 'post',
        api: '/member/coupon/pay-coupon',
        bindSence: 'get_coupon'
    },
    payCoupon: {
        method: 'post',
        api: '/member/coupon/pay',
    },
    getCouponTotal: {
        method: 'post',
        api: '/member/coupon/total',
    },
    getMyCouponList: {
        method: 'get',
        api: '/member/coupon/my',
    },
    getFavorite: {
        method: 'get',
        api: '/member/favorite',
    },
    changeFavorite: {
        method: 'post',
        api: '/member/favorite/change',
    },
    getFootprint: {
        method: 'get',
        api: '/member/footprint',
    },
    getLog: {
        method: 'get',
        api: '/member/balance-log/list',
    },
    getCouponDetail: {
        method: 'get',
        api: '/member/coupon/detail',
    },
    levelList: {
        method: 'get',
        api: '/member/level',
    },
    // 提现记录
    withdrawRecord: {
        method: 'get',
        api: '/member/withdraw/list',
    },
    // 充值配置获取充值方式
    rechargeWays: {
        method: 'get',
        api: '/member/recharge',
    },
    // 发起充值
    rechargeSubmit: {
        method: 'post',
        api: '/member/recharge/submit',
    },
    // 检查是否支付成功
    rechargeCheck: {
        method: 'get',
        api: '/member/recharge/check',
    },
    //提现申请初始化
    withDrawInfo: {
        method: 'get',
        api: '/member/withdraw',
    },
    submitWithdraw: {
        method: 'post',
        api: '/member/withdraw/submit',
    },
    checkCouponPayStatus: {
        method: 'post',
        api: '/member/coupon/check',
    },
    //修改会员资料
    changeUserInfo: {
        method: 'post',
        api: '/member/index/change-user-info',
    },
    checkFinancePayStatus: {
        method: 'post',
        api: '/member/recharge/check',
    },
    // 检测新人送礼活动 未登录用户
    checkNewGifts: {
        method: 'get',
        api: '/newGifts/index/un-login',
    },
    // 新人送礼 登录用户
    sendGifts: {
        method: 'get',
        api: '/newGifts/index/send-new',
    },
    // 获取充值奖励活动
    getRechargeRewardActivity: {
        method: 'get',
        api: '/rechargeReward/index/get-activity',
    },
    // 获取消费奖励活动
    getConsumeRewardActivity: {
        method: 'get',
        api: '/consumeReward/index/send-reward',
    },
    // 购物奖励发送
    sendShoppingReward: {
        method: 'get',
        api: '/shoppingReward/index/send-reward',
    },
    // 积分规则
    getCreditSet: {
        method: 'get',
        api: '/member/index/get-credit-set'
    },
    // 积分明细
    getCreditDetail: {
        method: 'get',
        api: '/member/credit/index'
    },
    // 获取红包明细
    getRedpacketList: {
        method: 'get',
        api: '/member/red-package/my-red-package',
    },
    // 获取待领取红包
    getNoRedpacket: {
        method: 'get',
        api: '/member/red-package/list',
    },
    // 领取红包
    getRedpacket: {
        method: 'post',
        api: '/member/red-package/get',
    },
    // 支付成功后 邀请好友
    getGroupsSuccess: {
        method: 'get',
        api: '/order/index/get-groups-success'
    },
}
