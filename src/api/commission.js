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
export const commissionApi = {
    // 分销是否开启
    getCommissionStatus: {
        method: 'get',
        api: '/commission/index/commission-status',
        
    },
    // 分销二维码
    getQrcode: {
        method: 'get',
        api: '/commission/qr-code/get'
    },
    getWxappQrcode: {
        method: 'get',
        api: '/commission/qr-code/get-wxapp'
    },
    // 分销文字设置
    commissionSet: {
        method: 'get',
        api: '/commission/index/get-set',
    },
    // 我的下线
    getDownLineList: {
        method: 'get',
        api: '/commission/down-line/get-list'
    },
    // 我的下线
    getDownLineCount: {
        method: 'get',
        api: '/commission/down-line/get-count'
    },
    // 佣金排行
    getRank: {
        method: 'get',
        api: '/commission/rank/get'
    },
    // 所有获取分销订单
    allCommissionOrder: {
        method: 'get',
        api: '/commission/order/all'
    },
    // 获取分销订单
    waitCommissionOrder: {
        method: 'get',
        api: '/commission/order/wait'
    },
    // 获取分销订单
    payCommissionOrder: {
        method: 'get',
        api: '/commission/order/pay'
    },
    // 获取分销订单
    finishCommissionOrder: {
        method: 'get',
        api: '/commission/order/finish'
    },
    // 获取等级
    getLevel: {
        method: 'get',
        api: '/commission/level/get-list'
    },
    // 等级详情
    getLevelData: {
        method: 'get',
        api: '/commission/level/get-detail'
    },

    // 分销佣金概览
    getCommissionWithdraw: {
        method: 'get',
        api: '/commission/withdraw'
    },
    // 申请提现_获取数据
    getApplyWithdraw: {
        method: 'get',
        api: '/commission/apply/index'
    },
    // 申请提现_提交申请
    submitWithdraw: {
        method: 'post',
        api: '/commission/apply/submit'
    },
    // 提现明细
    withdrawList: {
        method: 'get',
        api: '/commission/withdraw/get-list'
    },
    // 获取待入账佣金明细
    getWaitSettlement: {
        method: 'get',
        api: '/commission/statistics/wait-settlement/get-list'
    },
    // 获取待入账佣金明细
    getWaitSettlementTotal: {
        method: 'get',
        api: '/commission/statistics/wait-settlement/get-total'
    },
    // 分销首页数据
    getCommissionData: {
        method: 'get',
        api: '/commission/index'
    },
    // 申请成为分销商
    getApplyData: {
        method: 'get',
        api: '/commission/register'
    },
    // 申请成为分销商提交
    submitApply: {
        method: 'post',
        api: '/commission/register/submit'
    },
};