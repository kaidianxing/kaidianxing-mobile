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
    <view class="detail-order-status">
        <!-- 状态 -->
        <view class="order-status flex" @click="jumpDeliveryInfo">
            <view class="address-icon " :class="{
                'theme-primary-bgcolor': orderData.status != -1
            }">
                <block>
                    <i v-if="orderData.status == 0" class="iconfont-m- icon-m-fukuan2 order-icon" />
                    <i class="iconfont-m- icon-m-pintuan21 order-icon" v-if="(orderData.status == 10 || orderData.status == 11) && isGroupOrder&& !isSucGroups"></i>
                    <i v-if="(orderData.status == 10 || orderData.status == 11) && !(isGroupOrder&& !isSucGroups)" class="iconfont-m- icon-m-daifahuo2 order-icon" />
                    <i v-if="orderData.status == 20" class="iconfont-m- icon-m-daishouhuo2 order-icon" />
                    <i v-if="orderData.status == 30" class="iconfont-m- icon-m-yiwancheng2 order-icon" />
                    <i v-if="orderData.status == -1" class="iconfont-m- icon-m-Closewithcircle"></i>
                </block>
            </view>
            <view class="address flex1">
                <block>
                    <view v-if="isRefundSuc" class="name">售后完成</view>
                    <view v-else>
                        <view v-if="orderData.status == 0" class="name">待付款</view>
                        <view v-if="orderData.status == 10" class="name">
                            <span v-if="isGroupOrder && !isSucGroups">待成团</span>
                            <span v-else>待发货</span>
                        </view>
                        <view v-if="orderData.status == 11" class="name">部分发货</view>
                        <view v-if="orderData.status == 20" class="name">待收货</view>
                        <view v-if="orderData.status == 30" class="name">已完成</view>
                        <view v-if="orderData.status == -1" class="name">已关闭</view>
                    </view>
                </block>
                <block>
                    <view class="subtitle uni-text-color-grey" v-if="isRefundSuc">订单申请售后完成，订单关闭</view>
                    <view v-else>
                        <view class="subtitle two-line-hide uni-text-color-grey" v-if="orderData.status == 0 && countTime.length > 0">
                            <text>{{count_text == '后结束，请尽快支付'?'活动将于':'请在'}}</text>
                            <text class="theme-primary-color" v-if="countTime[0]>0">{{countTime[0]}}天</text>
                            <text class="theme-primary-color" v-if="countTime[1]>0">{{countTime[1]}}小时</text>
                            <text class="theme-primary-color">{{countTime[2]}}分</text>
                            <text class="theme-primary-color">{{countTime[3]}}秒</text>
                            <text>{{count_text}}</text>
                        </view>
                        <!-- 已取消/已关闭 -->
                        <view class="subtitle uni-text-color-grey" v-else-if="orderData.status == -1 && (orderData.cancel_reason||orderData.refund_reason)">{{orderData.cancel_reason||orderData.refund_reason}}</view>
                        <!-- 待发货 -->
                        <view class="subtitle uni-text-color-grey" v-else-if="orderData.status == 10">
                            <span  v-if="isGroupOrder && !isSucGroups">订单已完成支付，等待成团</span>
                            <span  v-else-if="isGroupOrder && isSucGroups">拼团成功，等待发货</span>
                            <span v-else>订单支付完成，正在准备为您发货</span>
                        </view>
                        <!-- 同城配送 达达、待收货、已完成 -->
                        <!-- 商家配送类型  1. 待收货 预计送达时间  2. 已完成 展示 ‘商品已送达’ -->
                        <div class="flex space-between" v-else-if="dispatchIntracity">
                            <div class="subtitle nowrap uni-text-color-grey">
                                <div class="subtitle nowrap uni-text-color-grey">
                                    {{ orderData.intracity_status_text }}<span v-if="orderData.status === '20'">，预计送达时间：<span style="color: #FF3C29; font-weight: bold;">{{ orderData.expect_delivery_time }}</span></span>
                                </div>
                            </div>
                            <div class="iconfont-m- icon-m-right uni-text-color-grey" v-if="orderData.express.city_distribution_type!=0"></div>
                        </div>
                    </view>
                </block>
            </view>
        </view>
        <!-- 地址 (虚拟商品不显示收货地址) -->
        <block>
            <view class="address-box flex" v-if="orderData.orderGoods && orderData.orderGoods[0].type === '0'">
                <view class="address-icon theme-primary-bgcolor">
                    <i class="iconfont-m- icon-m-map2 order-icon"></i>
                </view>
                <view class="address flex1">
                    <view class="name">
                        <text style="margin-right: 20rpx;">{{orderData.buyer_name}}</text>
                        <text>{{orderData.buyer_mobile}}</text>
                    </view>
                    <view class="subtitle two-line-hide uni-text-color-grey">
                        {{orderData.address_state || ''}}{{orderData.address_city || ''}}{{orderData.address_area || ''}}{{orderData.address_detail || ''}}
                    </view>
                </view>
            </view>
        <div class="line-box flex">
            <div class="line-icon" v-for="(item, index) in 40" :key="index"></div>
        </div>
        </block>
    </view>
</template>

<script>
    export default {
        name: "DetailOrderStatus",
        components: {},
        props: {
            orderData: {
                type: Object,
                default: () => {}
            },
        },
        data() {
            return {
                countTime: [],
                count_text: '内完成支付，超时订单自动取消',
                isRefundSuc: false
            }
        },
        watch: {
            orderData: {
                handler(newValue) {
                    if(newValue.orderGoods) {
                        this.isRefundSuc = newValue.orderGoods.every(item=> item.refund_status =='10' || item.refund_status == '11') || false
                    }
                    this.handleCountTime(newValue)
                },
                immediate: true
            }
        },
        computed: {
            dispatchIntracity() {
                // return new Set(['20', '30']).has(this.orderData.status) && (this.orderData?.express && new Set(['1', '2', '3', '4']).has(this.orderData?.express?.city_distribution_type))
                return this.orderData.dispatch_type === '30' && new Set(['20', '30']).has(this.orderData.status) && (this.orderData?.express && new Set(['1', '2', '3', '4']).has(this.orderData?.express?.city_distribution_type))

            },
            // 是否是拼团订单
            isGroupOrder(){
                return this.orderData.activity_type=='3' ||  this.orderData.activity_type=='4' || this.orderData.activity_type == '6'
            },
            // 拼团成功
            isSucGroups(){
                return this.orderData.groups_data?.success =='1' || this.orderData.groups_rebate_data?.success =='1' || this.orderData.groups_fission_data?.success=='1'
            }
        },
        methods: {
            handleCountTime(newValue) {
                if (newValue.status != 0) {
                    return
                }
                //待付款倒计时
                let endTime = new Date(Date.parse(newValue.auto_close_time.replace(/-/g, "/"))).getTime();
                let time = parseInt(endTime / 1000);
                let timer = setInterval(() => {
                    this.countTime = this.$utils.countDown(time, false);
                    if (!this.countTime) {
                        clearInterval(timer)
                    }
                }, 1000)
            },
            // 跳转配送信息
            jumpDeliveryInfo() {
                if (this.orderData.dispatch_type === '30' && new Set(['20', '30']).has(this.orderData.status) && this.orderData?.express && new Set(['1', '2', '3', '4']).has(this.orderData?.express?.city_distribution_type)) {
                    // 同城配送 (待收货、已完成的 三方配送 订单可查看)
                    this.$Router.auto({
                        path: '/kdxOrder/deliveryInfo',
                        query: {
                            order_id: this.orderData.id, // 订单id
                            status: this.orderData.status, // 订单状态
                            dispatch_type: this.orderData?.express?.city_distribution_type, // 三方配送方式
                        },
                    })
                }
            },
        },
    }
</script>

<style lang="scss">
    .detail-order-status {
        position: relative;
        background-color: #fff;
        border-radius: 12rpx;
        overflow: hidden;

        .address-icon {
            width: 60rpx;
            height: 60rpx;
            line-height: 60rpx;
            text-align: center;
            border-radius: 50%;
            i {
                font-size: 60rpx;
                color: $uni-text-color-grey;

                 &.icon-m-pintuan2-1 {
                    color: #ff3c29;
                }
            }
            .order-icon {
                font-size: 44rpx;
                color: #fff;
            }
            image {
                width: 60rpx;
                height: 60rpx;
            }
        }
        .address {
            margin: 0 0 0 48rpx;
            .name{
                margin-bottom: 8rpx;
                font-size: 28rpx;
                line-height: 40rpx;
                color: $uni-text-color;
                text {
                    color: $uni-text-color;
                }
            }
            .subtitle {
                font-size: 24rpx;
                line-height: 34rpx;
            }
            .nowrap {
                white-space: nowrap;
            }
        }
        .order-status {
            align-items: center;
            height: 200rpx;
            padding: 0 24rpx 0 48rpx;
            border-bottom: 1px solid $uni-border-color;
            box-sizing: border-box;
            .name {
                font-size: 48rpx;
                color: $uni-text-color;
                line-height: 68rpx;
            }
        }
        .address-box {
            align-items: center;
            padding: 32rpx 24rpx 32rpx 48rpx;
        }
        .line-box {
            flex-wrap: nowrap;
            width: 100%;
            height: 4rpx;
            overflow: hidden;
            .line-icon {
                flex-shrink: 0;
                width: 16rpx;
                height: 4rpx;
                margin-right: 8rpx;
                background-color: #518DEF;
                transform: skewX(-45deg);
                &:nth-child(2n) {
                    background-color: #E42311;
                }
            }
        }

         .contact-info {
                display: flex;
                align-items: center;
                padding: px2rpx(16) px2rpx(12)  px2rpx(16) px2rpx(24);
                line-height: px2rpx(20);
                font-size: px2rpx(14);
                &.contact-status {
                    padding: px2rpx(26) px2rpx(12);
                }
                .contact-icon {
                    width: px2rpx(30);
                    height: px2rpx(30);
                    line-height: px2rpx(30);
                    background-color: $uni-primary-background;
                    text-align: center;
                    border-radius: 50%;
                }
                .iconfont-m- {
                    font-size: px2rpx(20);
                    color: $uni-color-primary;
                }
                .contact-name {
                    margin: 0 px2rpx(10) 0 px2rpx(24);
                }
            }
    }
</style>
