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
<theme-content>
    <view class="order-invoice">
        <view class="container">
            <view class="rr-cell">
                <view class="flex">
                    <view class="label">
                        <text>发票类型</text>
                    </view>
                    <view class="flex1 flex">
                        <view class="flex radio-box" @click='changeType(2)' v-if="invoice_type == 2 || invoice_type == 3">
                            <i class="icon-m-yes iconfont-m-" v-if="invoice.invoice_is_electronic == 2"></i>
                            <i class="icon-m-no iconfont-m-" v-else></i>
                            <text class="uni-text-color-grey">电子发票</text>
                        </view>
                        <view class="flex radio-box" @click='changeType(1)' v-if="invoice_type == 1 || invoice_type == 3">
                            <i class="icon-m-yes iconfont-m-" v-if="invoice.invoice_is_electronic == 1"></i>
                            <i class="icon-m-no iconfont-m-" v-else></i>
                            <text class="uni-text-color-grey">纸质发票</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="rr-cell">
                <view class="flex bor-top">
                    <view class="label">
                        <text>抬头类型</text>
                    </view>
                    <view class="flex1 flex">

                        <view class="flex radio-box" @click='changeTitleType(1)'>
                            <i class="icon-m-yes iconfont-m-" v-if="invoice.invoice_is_company == 1"></i>
                            <i class="icon-m-no iconfont-m-" v-else></i>
                            <text class="uni-text-color-grey">个人或事业单位</text>
                        </view>
                        <view class="flex radio-box" @click='changeTitleType(2)'>
                            <i class="icon-m-yes iconfont-m-" v-if="invoice.invoice_is_company == 2"></i>
                            <i class="icon-m-no iconfont-m-" v-else></i>
                            <text class="uni-text-color-grey">企业</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="rr-cell">
                <view class="flex bor-top">
                    <view class="label">
                        <text>发票抬头</text>
                    </view>
                    <view class="flex1">
                        <input v-model="invoice.invoice_title" class="rr-input" type="text" placeholder="请填写抬头名称" placeholder-class="input-placeholder" />
                    </view>
                </view>
            </view>
            <view class="rr-cell" v-if="invoice.invoice_is_company == 2">
                <view class="flex bor-top">
                    <view class="label">
                        <text>税号</text>
                    </view>
                    <view class="flex1">
                        <input v-model="invoice.invoice_number" class="rr-input" type="text" placeholder="请填写纳税人识别号" placeholder-class="input-placeholder" />
                    </view>
                </view>
            </view>
            <view class="rr-cell" v-if="invoice.invoice_is_electronic == 2">
                <view class="flex bor-top">
                    <view class="label">
                        <text>电子邮箱</text>
                    </view>
                    <view class="flex1">
                        <input v-model="invoice.invoice_address" class="rr-input" type="text" placeholder="请填写电子邮箱" placeholder-class="input-placeholder" />
                    </view>
                </view>
            </view>
        </view>
        <btn styles="margin:32rpx 0;" type="do" classNames="theme-primary-bgcolor" size="middle" @btn-click="submit">完成</btn>
        <text class="no-invoice uni-text-color-grey" @click="back">本次不开具发票</text>
    </view>
    </theme-content>
</template>

<script>
    import PageMixin from '@/common/PageMixin.js'
    export default {
        mixins: [PageMixin],
        name: "invoice",
        components: {},
        props: {},
        data() {
            return {
                invoice_type: '', // 发票类型
                invoice: {
                    invoice_title: '', // 发票抬头
                    invoice_is_electronic: '', // 发票材料类型 1纸质2电子
                    invoice_is_company: '', // 是否是个人发票 1是个人 2是企业
                    invoice_number: '', // 纳税人识别号
                    invoice_address: '', // 邮寄地址/电子邮箱
                },
                sub_shop_id: '',
                invoiceData: {}, // 多商户发票信息
            }
        },
        computed: {},
        created() {
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                // 商城设置发票类型 0 不支持 1 纸质 2 电子 3 全选
                // this.invoice_type = 1;
                this.invoice_type = this.$Route.query.invoice_type;
                let invoiceData = this.$store.state.orderCreate;
                if (invoiceData?.invoice_title) {
                    let {invoice_title, invoice_is_electronic, invoice_is_company, invoice_number, invoice_address} = invoiceData;
                    this.invoice = {
                        invoice_title,
                        invoice_is_electronic,
                        invoice_is_company,
                        invoice_number,
                        invoice_address
                    }
                }
            },
            changeType(data) {
                this.invoice.invoice_is_electronic = data;
            },
            changeTitleType(data) {
                this.invoice.invoice_is_company = data
            },
            submit() {
                let result = this.invoice;
                // store中存储发票信息
                this.$store.commit('orderCreate/setOrderCreateInfo', result);
                // this.$Router.back(0)
                this.$Router.back(1)
            },
            back() {
                let result = {};
                // store中清除发票信息
                this.$store.commit('orderCreate/clearInvoiceInfo');
                // this.$Router.back(0)
                this.$Router.back(1)
            }
        },
    }
</script>

<style lang="scss">
    .order-invoice {
        padding: 16rpx 24rpx;
        height: 100%;
        background-color: $uni-bg-color-grey;
        text-align: center;
        .container {
            background-color: #fff;
            border-radius: 12rpx;
            overflow: hidden;
            .rr-cell {
                height: 96rpx;
                line-height: 96rpx;
                .label {
                    width: 168rpx;
                    text {
                        color: $uni-text-color;
                        font-size: 28rpx;
                    }
                }
                .flex1 {
                    text {
                        font-size: 28rpx;
                    }
                    .rr-input {
                        font-size: 28rpx;
                    }
                }
                .item {
                    margin-right: 28rpx;
                }
                .radio-box {
                    padding-right: 24rpx;
                    align-items: center;
                    .iconfont-m- {
                        margin-right: 8rpx;
                        font-size: px2rpx(18);
                        color: $uni-border-color;
                    }
                    .icon-m-yes {
                        font-size: px2rpx(18);
                        line-height: px2rpx(18);
                        text-align: center;
                        border-radius: 50%;
                        color: $uni-color-primary;
                    }
                }
            }
        }
        .submit-btn {
            margin: 32rpx 0;
            background: linear-gradient(to right, $uni-color-primary, #FF6F29);
        }
        .no-invoice {
            font-size: 24rpx;
            line-height: 34rpx;
        }
    }
</style>