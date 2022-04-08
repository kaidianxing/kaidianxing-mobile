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
    <view class="down-line-item">
        <view class="item flex" v-for="(item, index) in list" :key="index">
            <view class="image" :style="{'background-image': `url(${$utils.staticMediaUrl('decorate/avatar.png')})`,}">
                <image class="avatar" :src="$utils.mediaUrl(item.avatar)"></image>
                <image v-if="item.status == 1" class="commission-icon" :src="$utils.staticMediaUrl('commission/commission-level.png')"></image>
            </view>
            <view class="flex1">
                <view>{{item.nickname}}</view>
                <view class="sub-title uni-text-color-grey" v-if="item.status == 1">成为{{params.agent_name}}：{{item.become_time}}</view>
                <view class="sub-title uni-text-color-grey" v-else>成为下线时间：{{item.child_time}}</view>
            </view>
            <view style="text-align: right;">
                <block v-if="item.status == 1">
                    <view><text class="uni-color-primary">+{{item.commission_total}}</text>元</view>
                    <view class="sub-title">下级({{item.commission_child}})</view>
                </block>
                <block v-else>
                    <view>成交订单</view>
                    <view class="sub-title"><text class="uni-color-primary">{{item.order_count}}</text>笔</view>
                </block>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "DownLineItem",
        components: {},
        props: {
            list: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {}
        },
        computed: {
            params() {
                return this.$store.state.commissionSet.commissionSetting
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {},
    }
</script>

<style lang="scss" scoped>
    .down-line-item {
        .item {
            align-items: center;
            margin-bottom: 16rpx;
            padding: 16rpx 24rpx;
            background-color: #fff;
            border-radius: 12rpx;
            color: $uni-text-color;
            .image {
                position: relative;
                width: 80rpx;
                height: 80rpx;
                margin-right: 24rpx;
                background-repeat: no-repeat;
                background-size: cover;
            }
            .avatar {
                width: 80rpx;
                height: 80rpx;
                border: 1px solid $uni-border-color;
                border-radius: 50%;
            }
            .commission-icon {
                position: absolute;
                width: 28rpx;
                height: 28rpx;
                right: 0;
                bottom: 0;
            }
            .sub-title {
                margin-top: 6rpx;
                line-height: 34rpx;
                font-size: 24rpx;
            }
        }
    }
</style>