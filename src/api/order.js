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

export const orderApi = {
    // 确认订单
    confirmOrder: {
        method: 'post',
        api: '/order/create/confirm'
    },
    createOrder: {//提交订单
        method: 'post',
        api: '/order/create/index',
        needLogin: true,
        bindSence: 'buy'
    },
    // 获取支付方式
    getPayList: {
        method: 'get',
        api: '/pay/index'
    },
    // 支付
    pay: {
        method: 'post',
        api: '/pay/index/pay'
    },
    // 支付结果
    orderPayResult: {
        method: 'post',
        api: '/pay/index/check'
    },
    // 全部订单列表
    allOrderList: {
        method: 'get',
        api: '/order/list/all',
    },
    // 待付款订单列表
    payOrderList: {
        method: 'get',
        api: '/order/list/pay'
    },
    // 待发货订单列表
    sendOrderList: {
        method: 'get',
        api: '/order/list/send'
    },
    // 待收货订单列表
    pickOrderList: {
        method: 'get',
        api: '/order/list/pick'
    },
    // 已完成订单列表
    finishOrderList: {
        method: 'get',
        api: '/order/list/finish'
    },
    // 已删除订单列表
    deleteOrderList: {
        method: 'get',
        api: '/order/list/delete'
    },
    // 取消订单
    cancelOrder: {
        method: 'post',
        api: '/order/op/cancel'
    },
    // 删除订单
    deleteOrder: {
        method: 'post',
        api: '/order/op/delete'
    },
    // 确认收货
    finishOrder: {
        method: 'post',
        api: '/order/op/finish'
    },
    // 包裹列表
    getPackageList: {
        method: 'get',
        api: '/order/detail/express-package-list'
    },
    // 包裹信息
    getPackage: {
        method: 'get',
        api: '/order/detail/get-express'
    },
    // 待评价列表
    getCommentList: {
        method: 'get',
        api: '/order/comment/wait-list'
    },
    // 获取评价商品
    getCommentGoods: {
        method: 'get',
        api: '/order/comment/write-comment'
    },
    // 写评价
    submitComment: {
        method: 'post',
        api: '/order/comment/write-comment'
    },
    // 订单详情
    orderDetail: {
        method: 'get',
        api: '/order/detail/index',
    },
    // 维权信息
    refundInfo: {
        method: 'get',
        api: '/order/refund',
    },
    // 申请维权
    refundSubmit: {
        method: 'post',
        api: '/order/refund/submit'
    },
    // 快递列表
    expressList: {
        method: 'get',
        api: '/order/refund/all-express'
    },
    // 维权详情
    refundDetail: {
        method: 'get',
        api: '/order/refund/detail'
    },
    // 取消维权
    cancelRefund: {
        method: 'get',
        api: '/order/refund/cancel'
    },
    // 提交维权申请
    submitExpress: {
        method: 'post',
        api: '/order/refund/express'
    },
    // 换货成功关闭
    exchangeSuc: {
        method: 'post',
        api: '/order/refund/exchange-close'
    },
    // 文件上传
    uploadFile: {
        method: 'upload',
        api: '/utility/attachment/upload'
    },
    getUploadSet: {
        method: 'get',
        api: '/utility/attachment/upload/get-settings'
    },
    // 查询物流信息
    queryExpress: {
        method: 'get',
        api: '/order/refund/query-express'
    },
    refundList: {
        method: 'get',
        api: '/order/refund/list'
    },
    getTotal:{
        method: 'get',
        api: '/order/list/get-total'
    },
    // 提交系统表单
    submitGoodsForm: {
        method: 'post',
        api: '/form/submit-temp/submit'
    },
    // 组合配送预判断
    preOrderCreate: {
        method: 'post',
        api: '/product/cart/check-select'
    },
    // 视频号校验支付场景
    checkScene: {
        method: 'post',
        api: '/wxTransactionComponent/index/check-scene'
    }
};
