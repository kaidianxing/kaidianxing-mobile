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
<template>
    <view class="order-alipay">
        <web-view
            class="iframe"
            v-if="!isWeixin && iframe"
            :src="url"
            frameborder="0"
        ></web-view>
        <view v-if="isWeixin" class="alipay-guide">
            <view class="tips">如需继续支付，请点击下方“复制链接”后</view>
            <view class="tips">用浏览器打开</view>
            <text class="copy-btn" @click="handleCopy">复制链接</text>
            <textarea
                readonly
                type="text"
                id="input"
                style="position: fixed;opacity: 0;bottom: 0;"
            ></textarea>
        </view>
    </view>
</template>
<script>
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    data() {
        return {
            url: '',
            orderId: '',
            searchTime: 0,
            iframe: true,
            payStep: 1, //预付的目前支付第几步
            pageFrom: '', // 来自于哪个页面 区分优惠券支付、充值、订单
            couponId: '', // 优惠券id 用于优惠券支付成功跳转
            paySuccessFlag: false, // 支付状态
            timer: null,
        }
    },
    computed: {
        isWeixin() {
            return this.$utils.is_weixin()
        },
    },
    onShow() {
        // 处理公众号使用支付宝返回问题
        if (this.isWeixin && this.paySuccessFlag) {
            this.jumpGoPage()
        }
    },
    mounted() {
        this.url = decodeURI(this.$Route.query.url_alipay) // 防止微信公众号使用浏览器打开url编码问题
        this.orderId = this.$Route.query.id || this.orderId
        this.pageFrom = this.$Route.query.pageFrom
        this.couponId = this.$Route.query.couponId
        let $this = this
        // 两秒请求一次是否支付成功订单接口
        this.timer = setInterval(() => {
            if ($this.searchTime < 150) {
                $this.paySuccess()
                $this.searchTime++
            } else {
                clearInterval(this.timer)
                $this.iframe = false
                this.$toast('查询支付结果失败')
                setTimeout(() => {
                    this.jumpBackPage()
                }, 2000)
            }
        }, 2000)
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    methods: {
        handleCopy() {
            uni.setClipboardData({
                data: this.url,
                success: () => {
                    this.$toast('复制成功')
                },
            })
        },
        paySuccess() {
            if (this.pageFrom === 'coupunPay') {
                this.$api.memberApi
                    .checkCouponPayStatus(
                        {
                            id: this.orderId,
                            pay_type: 'alipay',
                        },
                        { errorToast: false }
                    )
                    .then((res) => {
                        if (res.error == 0) {
                            this.paySuccessFlag = true
                            this.$toast('支付成功')
                            this.jumpGoPage()
                            clearInterval(this.timer)
                        }
                    })
            } else if (this.pageFrom === 'recharge') {
                this.$api.memberApi
                    .checkFinancePayStatus(
                        {
                            id: this.orderId,
                            pay_type: 'alipay',
                        },
                        { errorToast: false }
                    )
                    .then((res) => {
                        if (res.error == 0) {
                            this.paySuccessFlag = true
                            this.$toast('支付成功')
                            this.jumpGoPage()
                            clearInterval(this.timer)
                        }
                    })
            } else if (this.pageFrom === 'planPay') {
                this.$api.merchantsApi
                    .checkPayStatus(
                        {
                            order_id: this.orderId,
                        },
                        { errorToast: false }
                    )
                    .then((res) => {
                        if (res.error == 0) {
                            if (res.success) {
                                this.paySuccessFlag = true
                                this.$toast('支付成功')
                                this.jumpGoPage()
                                clearInterval(this.timer)
                            }
                        }
                    })
            } else {
                this.$api.orderApi
                    .orderPayResult(
                        {
                            order_id: this.orderId,
                            pay_type: 'alipay',
                        },
                        { errorToast: false }
                    )
                    .then((res) => {
                        if (res.error == 0) {
                            this.paySuccessFlag = true
                            this.$toast('支付成功')
                            this.jumpGoPage()
                            clearInterval(this.timer)
                        }
                    })
            }
        },
        jumpGoPage() {
            this.iframe = false
            this.$nextTick(() => {
                if (this.pageFrom === 'coupunPay') {
                    this.$Router.replace({
                        path: '/kdxMember/coupon/paySuccess/index',
                        query: {
                            id: this.couponId,
                        },
                    })
                } else if (this.pageFrom === 'recharge') {
                    // this.$Router.replace({
                    //     path: '/kdxMember/balance/index',
                    // })
                    if (this.isWeixin) {
                        setTimeout(() => {
                            this.$Router.back(1)
                        }, 1500)
                    } else {
                        setTimeout(() => {
                            this.$Router.back(3)
                        }, 1500)
                    }
                }else {
                    this.$Router.replace({
                        path: '/kdxOrder/paySuccess',
                        query: {
                            id: this.orderId,
                        },
                    })
                }
            })
        },
        jumpBackPage() {
            this.iframe = false
            this.$nextTick(() => {
                if (this.pageFrom === 'coupunPay') {
                    this.$Router.replace({
                        path: '/kdxMember/coupon/detail/index',
                        query: {
                            id: this.couponId,
                        },
                    })
                } else if (this.pageFrom === 'recharge') {
                    this.$Router.replace({
                        path: '/kdxMember/balance/index',
                    })
                } else if (this.pageFrom === 'planPay') {
                    setTimeout(() => {
                        this.$Router.back(1)
                    }, 1500)
                } else {
                    this.$Router.replace({
                        path: '/kdxOrder/detail',
                        query: {
                            id: this.orderId,
                        },
                    })
                }
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.order-alipay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    .iframe {
        width: 100%;
        height: 100%;
        display: block;
    }
    .alipay-guide {
        width: 100%;
        height: 100%;
        padding-top: 200rpx;
        box-sizing: border-box;
        text-align: center;
        .tips {
            font-size: 30rpx;
            color: #000;
            line-height: 52rpx;
        }
        .copy-btn {
            display: inline-block;
            width: 250rpx;
            height: 68rpx;
            font-size: 28rpx;
            color: #fd463e;
            border: 1px solid #fd463e;
            border-radius: 68rpx;
            text-align: center;
            line-height: 68rpx;
            margin-top: 50rpx;
        }
    }
}
</style>
