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
    <page-box>
        <view class="statistics">
            <view class="commission-price">
                <i class="iconfont-m- icon-m-pay-def-pay"></i>
                <view class="title">{{params.count_commission}}（元）</view>
                <view class="price">{{withdrawData.commission_total}}</view>
                <view class="tit" v-if="withdrawData.ladder_commission_total > 0">含阶梯{{params.commission}}：￥{{withdrawData.ladder_commission_total}}</view>
                <view class="bg flex">
                    <view>{{params.can_withdraw_commission}}(元）：</view>
                    <view class="flex1">{{withdrawData.can_withdraw_commission}}</view>
                    <view class="btn" @click="applyWithdraw">申请{{params.withdraw}}</view>
                </view>
            </view>
            <view class="content">
                <view class="rr-cell">
                    <view class="flex">
                        <view class="label uni-text-color-grey">{{params.wait_audit_commission}}</view>
                        <view class="flex1">
                            <view class="uni-text-color">{{withdrawData.wait_check_commission}}元</view>
                        </view>
                    </view>
                </view>
                <view class="rr-cell">
                    <view class="flex bor-top">
                        <view class="label uni-text-color-grey">{{params.wait_pay_commission}}</view>
                        <view class="flex1">
                            <view class="uni-text-color">{{withdrawData.wait_remit_commission}}元</view>
                        </view>
                    </view>
                </view>
                <view class="rr-cell">
                    <view class="flex bor-top">
                        <view class="label uni-text-color-grey">{{params.wait_account_commission}}</view>
                        <view class="flex1">
                            <view class="uni-text-color">{{withdrawData.wait_settlement_commission}}元</view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 用户须知 -->
            <view class="user-notice">
                <view>用户须知：</view>
                <view>1.买家确认收货后，立即获得分销佣金 </view>
                <view>2.{{params.can_withdraw_commission}}满{{settings.withdraw_limit}}元才能申请{{params.withdraw}}</view>
            </view>
        </view>
    </page-box>
</template>

<script>
    import PageMixin from '@/common/PageMixin.js'
    export default {
        mixins: [PageMixin],
        name: "statistics",
        components: {},
        props: {},
        data() {
            return {
                withdrawData: {
                    commission_total: '', // 累计佣金
                    can_withdraw_commission: '',
                    wait_check_commission: '',
                    wait_remit_commission: '',
                    wait_settlement_commission: '',
                    ladder_commission_total:''
                },
                settings: {
                    withdraw_limit: ''
                }
            }
        },
        computed: {
            params() {
                return this.$store.state.commissionSet.commissionSetting
            }
        },
        created() {},
        beforeMount() {
            uni.setNavigationBarTitle({
                title: this.params?.count_commission
            })
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData() { 
                // uni.showLoading({title:'加载中'})
                this.$api.commissionApi.getCommissionWithdraw().then(res => {
                    this.withdrawData = res.data;
                    this.settings = res.settings;
                }).finally(rej => {
                    uni.hideLoading()
                })
            },
            applyWithdraw() {
                this.$Router.auto({
                    path: '/kdxCommission/withdraw/index'
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .statistics {
        padding: 16rpx 24rpx;
        .commission-price {
            position: relative;
            background-color: #FF6F29;
            border-radius: 12rpx;
            color: #fff;
            overflow: hidden;
            .icon-m-pay-def-pay {
                position: absolute;
                right: -114rpx;
                top: -100rpx;
                font-size: 276rpx;
                color: #fff;
                transform: rotate(-33.75deg);
                opacity: 0.3;
            }
            .title {
                padding: 24rpx 0 16rpx 24rpx;
                line-height: 40rpx;
            }
            .price {
                padding: 0 0 16rpx 24rpx;
                font-size: 96rpx;
                line-height: 134rpx;
            }
            .tit {
                font-size: px2rpx(12);
                margin: 0 0 px2rpx(8) px2rpx(12);
            }
            .bg {
                align-items: center;
                padding: 0 24rpx;
                height: 96rpx;
                line-height: 96rpx;
                background-color: rgba(255, 255, 255, .21);
                .btn {
                    width: 172rpx;
                    height: 50rpx;
                    line-height: 50rpx;
                    background-color: #fff;
                    font-size: 24rpx;
                    color: #FF6F29;
                    border-radius: 50rpx;
                    text-align: center;
                }
            }
        }
        .content {
            margin-top: 16rpx;
            border-radius: 12rpx;
            overflow: hidden;
            .rr-cell {
                height: 96rpx;
                line-height: 96rpx;
                .flex1 {
                    padding-right: 24rpx;
                    text-align: right;
                }
            }
        }
        .user-notice {
            padding: 16rpx 24rpx;
            color: $uni-text-color-grey;
            view {
                line-height: 34rpx;
                font-size: 24rpx;
            }
        }
    }
</style>