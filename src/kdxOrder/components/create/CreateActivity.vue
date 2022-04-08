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
    <view class="create-activity" :class="{
        'no-activity': !hasActivity
    }">
        <!-- 优惠券 -->
        <create-counp v-if="coupon.length>0"
                      type="platform"
                      :coupon="coupon"
                      :orderData="orderData" @getData="getData">
        </create-counp>

        <!-- 积分抵扣 -->
        <view class="rr-cell" v-if="max_deduction_credit > 0">
            <view class="flex align-center">
                <view>
                    <text class="uni-text-color">{{`${Number(max_deduction_credit)}${credit_text}`}}可抵扣</text>
                    <text class="uni-color-primary">￥{{orderData.max_deduction_credit_money}}</text>
                </view>
                <view class="flex1">
                    <text></text>
                </view>
                <view class="more flex radio-box" @click='changeCredit'>
                    <i class="icon-m-yes iconfont-m-" v-if="deduct_credit == 1"></i>
                    <i class="icon-m-no iconfont-m-" v-else></i>
                </view>
            </view>
        </view>
        <!-- 余额可抵扣 -->
        <view class="rr-cell" v-if="max_deduction_balance > 0">
            <view class="flex align-center">
                <view>
                    <text class="uni-text-color">{{balance_text}}可抵扣</text>
                    <text class="uni-color-primary">￥{{max_deduction_balance}}</text>
                </view>
                <view class="flex1">
                    <text></text>
                </view>
                <view class="more flex radio-box" @click='changeBalance'>
                    <i class="icon-m-yes iconfont-m-" v-if="deduct_balance == 1"></i>
                    <i class="icon-m-no iconfont-m-" v-else></i>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import {mapState} from "vuex";
    import createCounp from './CreateCounp'

    export default {
        name: "CreateActivity",
        components: {
            // PickMask
            createCounp,
        },
        props: {
            orderData: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                coupon: [],
                max_deduction_balance: 0, // 余额
                max_deduction_credit: 0, // 积分
                deduct_balance: 1, // 是否选中
                deduct_credit: 1, // 是否选中
            }
        },
        watch: {
            orderData: {
                handler(newValue) {
                    let {coupon} = newValue?.activity_return_data|| {}
                    this.coupon = coupon || [];
                    this.max_deduction_balance = newValue?.max_deduction_balance || 0;
                    this.max_deduction_credit = newValue?.max_deduction_credit || 0;
                }
            }
        },
        computed: {
            ...mapState('setting', {
                balance_text: state => state.systemSetting?.balance_text || '余额',
                credit_text: state => state.systemSetting?.credit_text || '积分',
            }),
            hasActivity(){
                return this.coupon.length>0 || this.max_deduction_credit > 0|| this.max_deduction_balance > 0
            }
        },
        onShow() {},
        created() {},
        mounted() {
            this.init()
        },
        methods: {
            init() {
                this.deduct_credit = this.$store.state.orderCreate.deduct_credit;
                this.deduct_balance = this.$store.state.orderCreate.deduct_balance
            },
            changeCredit() {
                if (this.deduct_credit) {
                    this.deduct_credit = 0
                } else {
                    this.deduct_credit = 1
                }
                this.$store.commit('orderCreate/setOrderCreateInfo', {deduct_credit: this.deduct_credit})
                this.getData()
            },
            changeBalance() {
                if (this.deduct_balance) {
                    this.deduct_balance = 0
                } else {
                    this.deduct_balance = 1
                }
                this.$store.commit('orderCreate/setOrderCreateInfo', {deduct_balance: this.deduct_balance})
                this.getData()
            },
            getData() {
                this.$emit('getData')
            }
        },
    }
</script>

<style lang="scss">
    .create-activity {
        margin: px2rpx(8) 0;
        background-color: #fff;
        border-radius: 12rpx;
        overflow: hidden;

        &.no-activity {
            margin: 0 0 px2rpx(8) 0;
        }
        .rr-cell {
            >view {
                border-top: 1px solid #E6E7EB;
            }
            &:first-child {
                >view {
                    border-top: 0;
                }
            }
            .flex1 {
                text-align: right;
            }
            text {
                font-size: 28rpx;
            }
            .coupon-text {
                margin-left: 16rpx;
                padding: 0 16rpx;
                line-height: 28rpx;
                font-size: 20rpx;
                border-radius: 16rpx;
                border: 1px solid $uni-color-primary;
            }
        }
        .radio-box {
            align-items: center;
            .iconfont-m- {
                font-size: px2rpx(20);
                color: $uni-border-color;
            }
            .icon-m-yes {
                font-size: px2rpx(20);
                line-height: px2rpx(20);
                text-align: center;
                border-radius: 50%;
                color: $uni-color-primary;
            }
        }
    }
</style>