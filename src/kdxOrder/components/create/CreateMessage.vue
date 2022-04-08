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
    <view class="create-message">
        <!-- 留言 -->
        <view class="rr-cell" @click="toRemarkBuyer">
            <view class="flex bor-top">
                <view>
                    <text class="uni-text-color">买家留言</text>
                </view>
                <view class="flex1 line-hide">
                    <text class="uni-text-color">{{params.buyer_remark}}</text>
                </view>
                <view class="more uni-text-color-grey"><i class="iconfont-m- icon-m-right"></i></view>
            </view>
        </view>
        <!-- 发票 -->
        <view v-if="invoiceData.is_invoice_support && invoiceData.invoice_type != 0" class="rr-cell" @click="toInvoice">
            <view class="flex bor-top">
                <view style="margin-right: 120rpx;flex-shrink: 0;">
                    <text class="uni-text-color">发票信息</text>
                </view>
                <view class="invoice-info uni-text-color">
                    {{params.invoice_is_electronic == 1?'纸质、':''}}{{params.invoice_is_electronic == 2?'电子、':''}}{{params.invoice_is_company == 1?'个人、':''}}{{params.invoice_is_company == 2?'企业、':''}}{{params.invoice_title}}
                </view>
                <view class="more uni-text-color-grey"><i class="iconfont-m- icon-m-right"></i></view>
            </view>
        </view>
    </view>
</template>

<script>
    import {mapGetters, mapState} from "vuex";

    export default {
        name: "CreateMessage",
        components: {},
        props: {
            invoiceData: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {}
        },
        computed: {
            ...mapState('orderCreate', {
                params: state => state,
            }),
        },
        created() {},
        mounted() {
        },
        methods: {
            toInvoice() {
                this.$emit('toInvoice', {type: this.invoiceData.invoice_type})
            },
            toRemarkBuyer() {
                this.$emit('toRemarkBuyer')
            }
        },
    }
</script>

<style lang="scss">
    .create-message {
        border-bottom-left-radius: 12rpx;
        border-bottom-right-radius: 12rpx;
        overflow: hidden;
        .rr-cell {
            .flex1 {
                text-align: right;
                overflow: hidden;
                padding-left:120rpx ;
            }
            text {
                font-size: 28rpx;
            }
        }
        .invoice-info {
            width: 400rpx;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 28rpx;
            color: $uni-text-color;
            text-align: right;
        }
    }
</style>