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
    <view class="detail-order-info">
        <!-- 订单编号 -->
        <view class="detail-order-no">
            <view class="rr-cell">
                <view class="flex">
                    <view class="flex1">
                        <span class="label">订单编号：</span>
                        <span class="uni-text-color">{{orderData.order_no}}</span>
                    </view>
                    <view class="right">
                        <text class="theme-primary-color" @click="handleCopy">复制</text>
                    </view>
                </view>
            </view>
            <view class="rr-cell">
                <view class="flex">
                    <view class="flex1">
                        <span class="label">下单时间：</span>
                        <span class="uni-text-color">{{orderData.created_at}}</span>
                    </view>
                </view>
            </view>
            <view class="rr-cell" v-if="orderData.pay_time">
                <view class="flex">
                    <view class="flex1">
                        <span class="label">支付时间：</span>
                        <span class="uni-text-color">{{orderData.pay_time}}</span>
                    </view>
                </view>
            </view>
        </view>
        <view class="detail-order-message">
            <view class="rr-cell" v-if="invoice && invoice.is_company">
                <view class="flex">
                    <view class="flex1 line-hide">
                        <span class="label">发票信息：</span>
                        <text>
                            <span class="uni-text-color">{{invoice.is_electronic == 1?'纸质':''}}{{invoice.is_electronic == 2?'电子':''}} </span>
                            <span class="uni-text-color">{{invoice.is_company == 1?' 个人':''}} {{invoice.is_company == 2?' 企业':''}}</span>
                            <span class="uni-text-color">{{invoice.title}}</span>
                        </text>
                    </view>
                    <view class="right">
                        <text class="uni-text-color-grey" @click="showInvoice">查看</text>
                    </view>
                </view>
            </view>
            <view class="rr-cell" v-if="orderData.buyer_remark">
                <view class="flex">
                    <view>
                        <span class="label">买家备注：</span>
                    </view>
                    <view class="flex1 line-hide">
                        <span class="uni-text-color">{{orderData.buyer_remark}}</span>
                    </view>
                    <view class="right uni-text-color-grey" @click="showRemark"><text>查看</text></view>
                </view>
            </view>
        </view>
        <!-- 交易信息 -->
        <detail-order-price :orderData="orderData"></detail-order-price>
        <!-- 备注弹窗 -->
        <detail-order-modal title="买家备注" v-model="remarkModal" @handlerCancel="remarkCancel">
            <template slot="content">
                <view class="remark-content">
                    <view class="uni-text-color">{{orderData.buyer_remark}}</view>
                </view>
            </template>
        </detail-order-modal>
        <!-- 发票弹窗 -->
        <detail-order-modal title="发票信息" v-model="invoiceModal" @handlerCancel="invoiceCancel">
            <template slot="content">
                <view class="invoice-content">
                    <view>
                        <text class="label">发票类型</text>
                        <text>{{invoice.is_electronic == 1 || invoice.is_electronic == 0?'纸质发票':invoice.is_electronic == 2?'电子发票':''}}</text>
                    </view>
                    <view>
                        <text class="label">抬头类型</text>
                        <text>{{invoice.is_company == 1?'个人':invoice.is_company == 2?'企业':''}}</text>
                    </view>
                    <view v-if="invoice.title">
                        <text class="label">发票抬头</text>
                        <text>{{invoice.title}}</text>
                    </view>
                    <view v-if="invoice.number">
                        <text class="label">税号</text>
                        <text>{{invoice.number}}</text>
                    </view>
                    <view v-if="invoice.address">
                        <text class="label">电子邮箱</text>
                        <text>{{invoice.address}}</text>
                    </view>
                </view>
            </template>
        </detail-order-modal>
    </view>
</template>

<script>
    import detailOrderPrice from './DetailOrderPrice'
    import detailOrderModal from './DetailOrderModal'
    import { mapState } from 'vuex'


    export default {
        name: "DetailOrderInfo",
        components: {
            detailOrderPrice, detailOrderModal
        },
        props: {
            orderData: {
                type: Object,
                default: () => {}
            },
        },
        data() {
            return {
                // orderData: {},
                remarkModal: false,
                invoiceModal: false,
                invoice: {
                    title: "",
                    is_electronic: '',
                    is_company: '',
                    number: "",
                    address: ""
                }
            }
        },
        watch: {
            orderData(newValue) {
                if (newValue?.invoice_info?.is_company) {
                    this.invoice = newValue.invoice_info
                }
            }
        },
        computed: {
              ...mapState('setting'),
        },
        created() {
        },
        mounted() {},
        methods: {
            handleCopy() {
                uni.setClipboardData({
                    data: this.orderData.order_no,
                    success: () => {
                        uni.showToast({
                            title: '复制成功',
                        })
                    }
                })
            },
            showRemark() {
                this.remarkModal = true
            },
            showInvoice() {
                this.invoiceModal = true
            },
            invoiceCancel() {
                this.invoiceModal = false
            },
            remarkCancel() {
                this.remarkModal = false
            }
        },
    }
</script>

<style lang="scss">
    .detail-order-info {
        background-color: #fff;
        border-radius: 12rpx;
        overflow: hidden;
        .rr-cell {
            .label {
                color: #565656;
                font-size: px2rpx(12);
            }
            span {
                font-size: px2rpx(12);
            }
            .flex .flex1 text {
                color: $uni-text-color;
                font-size: px2rpx(12);
            }
        }
        .detail-order-no {
            position: relative;
            padding: 32rpx 0;
            &::after {
                content: '';
                position: absolute;
                left: 24rpx;
                bottom: 0;
                width: 97%;
                height: 1rpx;
                background-color: $uni-border-color;
            }
            .rr-cell {
                margin-bottom: 32rpx;
                height: 34rpx;
                line-height: 34rpx;
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
        .detail-order-message {
            .rr-cell {
                height: 96rpx;
                line-height: 96rpx;
                .flex {
                    border-top: 1rpx solid $uni-border-color;
                }
                &:last-child > .flex {
                    border-bottom: 1rpx solid $uni-border-color;
                }
                &:first-child > .flex {
                    border-top: 0;
                }
            }
        }
        .right {
            padding-right: 24rpx;
        }
        .invoice-content {
            text-align: left;
            > view {
                margin-bottom: 32rpx;
            }
            text {
                font-size: 24rpx;
                line-height: 34rpx;
                color: $uni-text-color;
            }
            .label {
                display: inline-block;
                margin-right: 24rpx;
                width: 148rpx;
                color: $uni-text-color-grey;
                text-align: right;
            }
        }
        .remark-content {
            padding: 0 48rpx 32rpx;
            color: $uni-text-color;
            word-break: break-word;
        }
    }
</style>