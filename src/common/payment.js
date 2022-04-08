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
import { router } from "@/router";
import { is_weixin } from './util.js'


// 小程序支付
export function requestPayment(paymentData) {
    return new Promise((resolve) => {
        let params = {
            provider: paymentData.provider,
        }
        // #ifdef MP-WEIXIN
        params = {
            ...params,
            timeStamp: paymentData.timeStamp,
            nonceStr: paymentData.nonceStr,
            package: paymentData.package,
            signType: paymentData.signType,
            paySign: paymentData.paySign,
        }
        // #endif
        // #ifdef MP-TOUTIAO
        params = {
            ...params,
            orderInfo: paymentData.orderInfo,
            // service: paymentData.provider === 'wxpay' ? 3 : 4, // service=3： 微信API支付，不拉起小程序收银台；service=4： 支付宝API支付，不拉起小程序收银台
            service: 5, // 固定值：5（拉起小程序收银台）// 抖音支付修改
        }
        // #endif
        console.log('支付参数--------', params)
        uni.requestPayment({
            ...params,
            success: (res) => {
                console.log(res, '支付success返回结果+++++++++')
                // #ifdef MP-TOUTIAO
                // code  0：支付成功 1：支付超时 2：支付失败 3：支付关闭 4：支付取消 9：订单状态开发者自行获取。只要调起收银台成功，支付状态都会回调success返回，开发者依据返回的 code 值，进行后续业务逻辑处理
                if (res.code === 0) {
                    // 支付成功
                    resolve('ok')
                } else {
                    resolve('fail')
                    uni.hideLoading()
                    uni.showToast({
                        title: '支付失败',
                        icon: 'none',
                    })
                }
                // #endif
                // #ifdef MP-WEIXIN
                resolve('ok')
                // #endif
            },
            fail: (rej) => {
                resolve('fail')
                uni.hideLoading()
                uni.showToast({
                    title: '支付失败',
                    icon: 'none',
                    duration: 2000
                })
                console.log('支付报错信息-----------', rej)
            },
        })
    })
}

// 需要校验的小程序支付
export function requestOrderPayment(paymentData) {
    return new Promise((resolve) => {
        let params = {
            timeStamp: paymentData.timeStamp,
            nonceStr: paymentData.nonceStr,
            package: paymentData.package,
            signType: paymentData.signType,
            paySign: paymentData.paySign,
        }
        if (paymentData.orderInfo) {
            params.orderInfo = paymentData.orderInfo;
        }
        console.log('支付参数--------requestOrderPayment', params)
        console.log('paymentData.orderInfo', paymentData.orderInfo)
        wx.requestOrderPayment({
            ...params,
            success: (res) => {
                console.log(res, '支付success返回结果+++++++++requestOrderPayment')
                // #ifdef MP-TOUTIAO
                // code  0：支付成功 1：支付超时 2：支付失败 3：支付关闭 4：支付取消 9：订单状态开发者自行获取。只要调起收银台成功，支付状态都会回调success返回，开发者依据返回的 code 值，进行后续业务逻辑处理
                if (res.code === 0) {
                    // 支付成功
                    resolve('ok')
                } else {
                    resolve('fail')
                    uni.hideLoading()
                    uni.showToast({
                        title: '支付失败',
                        icon: 'none',
                    })
                }
                // #endif
                // #ifdef MP-WEIXIN
                resolve('ok')
                // #endif
            },
            fail: (rej) => {
                resolve('fail')
                uni.hideLoading()
                uni.showToast({
                    title: '支付失败',
                    icon: 'none',
                    duration: 2000
                })
                console.log('支付报错信息-----------requestOrderPayment', rej)
            },
        })
    })
}
// H5微信支付
export function wapWechatPay(paymentData) {
    return new Promise((resolve) => {
        // js bridge微信支付
        function onBridgeReady() {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                {
                    appId: paymentData.appId,
                    timeStamp: paymentData.timeStamp
                        ? paymentData.timeStamp
                        : paymentData.timestamp,
                    nonceStr: paymentData.nonceStr,
                    package: paymentData.package,
                    signType: paymentData.signType,
                    paySign: paymentData.paySign,
                },
                function(res) {
                    if (res.err_msg == 'get_brand_wcpay_request:ok') {
                        resolve('ok')
                    } else if (
                        res.err_msg == 'get_brand_wcpay_request:cancel'
                    ) {
                        resolve('cancle')
                        uni.showToast({
                            title: '取消支付',
                            icon: 'none',
                        })
                    } else {
                        resolve('fail')
                        uni.showToast({
                            title: '支付失败',
                            icon: 'none',
                        })
                    }
                }
            )
        }
        if (typeof WeixinJSBridge == 'undefined') {
            if (document.addEventListener) {
                document.addEventListener(
                    'WeixinJSBridgeReady',
                    onBridgeReady,
                    false
                )
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
            }
        } else {
            onBridgeReady()
        }
    })
}

// H5支付宝支付
export function wapAliPay(paymentData) {
    const isWeiXin = is_weixin();
    if (isWeiXin) {
        // 公众号环境
        router.replace({
            path: '/kdxOrder/alipay',
            query: {
                url_alipay: paymentData.url,
                id: Array.isArray(paymentData.order_id)?paymentData.order_id.join(','):paymentData.order_id,
                // id: paymentData.order_id,
                couponId: paymentData.couponId || '',
                pageFrom: paymentData.pageFrom || '',
                dispatch_type: paymentData.dispatch_type,
                orderID: Array.isArray(paymentData.order_id)?1:0
            },
        })
    } else {
        // H5环境
        location.href = paymentData.url
    }
}
