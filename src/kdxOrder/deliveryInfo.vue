/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <!-- #ifndef APP-PLUS -->
    <page-box>
        <div class="info-box" :style="{ paddingBottom: areaBottom + 'px' }">
            <div class="map-box" v-if="new Set(['20']).has(status)">
                <map
                    class="map"
                    :scale="13"
                    :markers="markers"
                    :include-points="includePoints"
                >
                </map>
                <div class="refresh" @click.stop="refresh">
                    <i class="iconfont-m- icon-m-shuaxin"></i>
                </div>
            </div>
            <div class="track">
                <div class="title">订单追踪</div>
                <scroll-view
                    class="scroll-view"
                    :class="{ height: !dispatch.transporter_phone }"
                    :scroll-y="true"
                    :show-scrollbar="false"
                >
                    <ul class="track-list">
                        <li
                            class="track-item van-hairline--left active"
                            v-for="(item, index) in order_trace"
                            :key="index"
                        >
                            <div class="line"></div>
                            <div class="left">
                                <div class="dot"></div>
                                <div class="text">{{ item.status_text }}</div>
                            </div>
                            <div class="right">
                                {{ item.status_time | formatTime }}
                            </div>
                        </li>
                    </ul>
                </scroll-view>
                <div
                    class="contcat van-hairline--top"
                    @click="makePhoneCall"
                    v-if="dispatch.transporter_phone"
                >
                    <i class="iconfont-m- icon-m-dianhua-2"></i>
                    <div class="text">致电骑手</div>
                </div>
            </div>
        </div>
    </page-box>
    <!-- #endif -->
    <!-- #ifdef APP-PLUS -->
    <web-view :src="wapUrl"></web-view>
    <!-- #endif -->
</template>

<script>
import { mapState } from 'vuex'
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    data() {
        return {
            order_id: '', // 订单id
            status: '', // 订单状态
            dispatch_type: '', // 三方配送方式 1.dada 2.make
            dispatch: {}, // 配送信息
            order_trace: [], // 订单跟踪信息
            timeId: null, // 定时器
        }
    },
    computed: {
        ...mapState(['areaBottom']),
        buyer() {
            // 买家
            return {
                latitude: this.dispatch?.buyer_lat,
                longitude: this.dispatch?.buyer_lng,
                title: '买家',
            }
        },
        shop() {
            // 商家
            return {
                latitude: this.dispatch?.shop_lat,
                longitude: this.dispatch?.shop_lng,
                title: '商家',
            }
        },
        transporter() {
            // 骑手
            return {
                latitude: this.dispatch?.transporter_lat,
                longitude: this.dispatch?.transporter_lng,
                title: '骑手',
            }
        },
        includePoints() {
            // 缩放视野以包含所有给定的坐标点
            if (this.transporter.latitude) {
                // 骑手已接单
                return [this.buyer, this.shop, this.transporter]
            } else {
                return [this.buyer, this.shop]
            }
        },
        markers() {
            let _iconPath = [
                this.$utils.staticMediaUrl('order/map/icon-buyer.png'),
                this.$utils.staticMediaUrl('order/map/icon-shop.png'),
                this.$utils.staticMediaUrl('order/map/icon-transporter.png'),
            ]
            let _markers = this.includePoints.map((item, index) => {
                return {
                    id: index,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    title: item.title,
                    iconPath: _iconPath[index],
                    width: 36,
                    height: 36,
                }
            })
            return _markers
        },

        // #ifdef APP-PLUS
        wapUrl(){
            return `${this.$utils.getWapUrl()}/kdxOrder/deliveryInfo?order_id=${this.order_id}&status=${this.status}&dispatch_type=${this.dispatch_type}`
        }
        // #endif
    },
    filters: {
        formatTime(value) {
            // 处理时间，去掉年月日
            return value.split(' ')[1]
        },
    },
    mounted() {
        // 订单id
        this.order_id = this.$Route.query.order_id
        // 订单状态
        this.status = this.$Route.query.status
        // 三方配送配送方式
        this.dispatch_type = this.$Route.query.dispatch_type
        this.queryOrderStatus()
        this.timeId = setInterval(() => {
            this.queryOrderStatus()
        }, 10000)
    },
    beforeDestroy() {
        clearInterval(this.timeId)
    },
    methods: {
        // 获取同城配送区域
        queryOrderStatus() {
            this.$api.orderApi
                .queryOrderStatus({
                    order_id: this.order_id,
                    dispatch_type: this.dispatch_type,
                })
                .then((res) => {
                    if (res.error == 0) {
                        // 订单状态
                        this.status = res.data.order_status
                        if (res.data.order_trace) {
                            this.order_trace = [...res.data.order_trace]
                        }
                        this.dispatch = {
                            ...res.data.dispatch,
                        }
                    }
                }).finally(() => {
                uni.hideLoading()
            })
        },
        // 致电骑手
        makePhoneCall() {
            if (this.dispatch.transporter_phone) {
                uni.makePhoneCall({
                    phoneNumber: this.dispatch.transporter_phone,
                })
            } else {
                this.$toast('骑手未接单，获取骑手电话失败')
            }
        },
        // 刷新
        refresh() {
            // uni.showLoading({title:'加载中'})
            this.queryOrderStatus()
        },
    },
}
</script>

<style lang="scss" scoped>
.iconfont-m- {
    font-size: 48rpx;
}
.info-box {
    height: 100vh;
    display: flex;
    flex-direction: column;
    .map-box {
        flex: 1;
        position: relative;
        .map {
            height: 100%;
            width: 100%;
        }
        .refresh {
            background-color: #fff;
            position: absolute;
            z-index: 9999;
            left: 24rpx;
            bottom: 16rpx;
            width: 64rpx;
            height: 64rpx;
            border-radius: 12rpx;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .track {
        background-color: #fff;
        height: 720rpx;
        border-radius: 20rpx 20rpx 0px 0px;
        box-sizing: border-box;
        padding-top: 32rpx;
        .title {
            text-align: center;
            font-weight: bold;
            font-size: 32rpx;
            line-height: 44rpx;
            color: #212121;
            padding-bottom: 24rpx;
        }
        .scroll-view {
            height: 540rpx;
            &.height {
                height: 620rpx;
            }
        }
        .track-list {
            padding: 48rpx;
            padding-top: 24rpx;
            .track-item {
                margin-left: 8rpx;
                display: flex;
                font-size: 24rpx;
                line-height: 34rpx;
                color: #565656;
                padding-bottom: 48rpx;
                // border-left: 1rpx solid #e6e7eb;
                position: relative;
                &.van-hairline--left:after {
                    border-left-color: $uni-border-color;
                    border-style: solid;
                }
                &:first-child {
                    .line {
                        display: block;
                        top: 0;
                    }
                }
                &:last-child {
                    padding-bottom: 0;
                    &.active {
                        color: #09c15f;
                        .left {
                            .dot {
                                width: 16rpx;
                                height: 16rpx;
                                background-color: #fff;
                                border: 4rpx solid #09c15f;
                                transform: translateX(-8rpx);
                            }
                            .text {
                                font-weight: bold;
                            }
                        }
                        .right {
                            font-weight: bold;
                        }
                    }
                    .line {
                        display: block;
                        bottom: 0;
                    }
                }
                .line {
                    display: none;
                    position: absolute;
                    left: -2rpx;
                    background-color: #fff;
                    width: 1rpx;
                    height: 18rpx;
                }
                .left {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    .dot {
                        width: 12rpx;
                        height: 12rpx;
                        box-sizing: border-box;
                        background-color: #c4c4c4;
                        border-radius: 50%;
                        transform: translateX(-7rpx);
                        position: relative;
                        z-index: 1;
                    }
                    .text {
                        padding-left: 18rpx;
                        padding-right: 24rpx;
                    }
                }
            }
        }
        .contcat {
            box-sizing: border-box;
            height: 80rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28rpx;
            line-height: 40rpx;
            color: #212121;
            &.van-hairline--top:after {
                border-top-color: $uni-border-color;
                border-style: solid;
            }
        }
    }
}
</style>
