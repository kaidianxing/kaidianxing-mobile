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
    <view class="goods-info-index">
        <!-- 商品价格 -->
        <view class="goods-price-box flex-between">
            <view class="left flex align-center">
                <view class="goods-price">￥<text style="font-size: 32rpx;">{{goodsMsg.price}}</text></view>
                <view class="line-price-box">
                    <view class="member-label">
                        <i class="iconfont-m- icon-m-huangguan"></i>
                        白金会员
                    </view>
                    <view class="line-price">￥{{goodsMsg.original_price}}</view>
                </view>
            </view>
            <view class="right flex align-center">
                <view class="commission flex-column">
                    <view>￥35</view>
                    <view>预计佣金</view>
            </view>
                <view class="share flex-column">
                    <i class="iconfont-m- icon-m-shangpinxiangqing-fenxiang"></i>
                    <view>分享</view>
                </view>
            </view>
        </view>
        <!-- 商品标题 -->
        <view class="goods-title three-line-hide">{{goodsMsg.title}}</view>
        <!-- 商品副标题 -->
        <view class="goods-subtitle">
            <!--<view class="subtitle">
                <text>{{goodsMsg.sub_name}}</text>
            </view>
            <i class="iconfont-m- icon-m-down"></i>-->
            <view :class="!allWords?'subtitle two-line-hide':'subtitle'">
                {{goodsMsg.sub_name}}
                <text v-if="!allWords" class="iconfont-m- icon-m-down" @click="more"></text>
                <text v-if="allWords" class="iconfont-m- icon-m-up" @click="handleUp"></text>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        components: {},
        props: {
            goodsMsg: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                allWords: false
            }
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            more() {
                this.allWords = true
            },
            handleUp() {
                this.allWords = false
            }
        },
    }
</script>

<style lang="scss">
    .goods-info-index {
        background-color: #fff;
        padding: 0 24rpx;
        overflow: hidden;
        .goods-price-box {
            padding: 34rpx 0;
            height: 66rpx;
            .goods-price {
                color: $uni-color-primary;
                margin-right: 20rpx;
            }
            .line-price-box {
                .member-label {
                    height: 22rpx;
                    padding: 4rpx;
                    line-height: 22rpx;
                    text-align: center;
                    background-color: #565656;
                    border-radius: 4rpx;
                    color: #FFE382;
                    font-size: 16rpx;
                    .iconfont-m- {
                        width: 26rpx;
                        height: 26rpx;
                        vertical-align: middle;
                    }
                }
                .line-price {
                    text-decoration: line-through;
                    color: $uni-text-color-grey;
                    font-size: 24rpx;
                }
            }
            .commission,.share {
                height: 66rpx;
                border-radius: 12rpx;
                justify-content: center;
                align-items: center;
                font-size: 20rpx;
            }
            .commission {
                padding: 0 22rpx;
                background: linear-gradient(149.91deg, $uni-color-primary 0%, #FF6F29 94.38%);
                color: #fff;
            }
            .share {
                width: 68rpx;
                background-color: $uni-bg-color-grey;
                color: $uni-text-color-grey;
                margin-left: 24rpx;
            }
        }
        .goods-title {
            font-weight: bold;
            font-size: 28rpx;
            line-height: 40rpx;
            color: $uni-text-color;
        }
        .goods-subtitle {
            padding: 16rpx 0;
            font-size: 24rpx;
            line-height: 34rpx;
            color: #565656;
            .subtitle {
                position: relative;
            }
            .icon-m-down {
                color: $uni-text-color-grey;
                font-size: 24rpx;
                position: absolute;
                right: 0;
                bottom: 0;
            }
            .icon-m-up {
                font-size: 40rpx;
                vertical-align: middle;
                color: $uni-text-color-grey;
            }
        }
    }
</style>
