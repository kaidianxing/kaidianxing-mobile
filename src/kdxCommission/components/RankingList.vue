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
    <view class="ranking-list-list">
        <view class="list-item" v-for="(item, index) in list" :key="index">
            <view class="left">
                <view class="ranking">{{item.top}}</view>
                <view class="avatar" :style="{'background-image': `url(${$utils.staticMediaUrl('decorate/avatar_mobile.png')})`,}">
                    <image :src="$utils.mediaUrl(item.avatar)"></image>
                </view>
                <view class="name">{{item.nickname}}</view>
            </view>
            <view class="right">
                <view class="count">￥{{item.commission_total || ''}}</view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "RankingList",
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
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {},
    }
</script>

<style lang="scss" scoped>
    .ranking-list-list {
        padding-left: 24rpx;
        .list-item {
            padding-top: 16rpx;
            padding-bottom: 16rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1rpx solid #e6e7eb;
            font-weight: bold;
            font-size: 28rpx;
            line-height: 40rpx;
            color: #212121;
            .left {
                display: flex;
                align-items: center;
                .avatar {
                    width: 96rpx;
                    height: 96rpx;
                    border-radius: 50%;
                    background-color: #f5f5f5;
                    margin-left: 24rpx;
                    margin-right: 24rpx;
                    background-size: contain;
                    image {
                        width: 96rpx;
                        height: 96rpx;
                        border-radius: 50%;
                    }
                }
            }
            .right {
                display: flex;
                align-items: center;
                margin-right: 24rpx;
                .count {
                    margin-right: 12rpx;
                }
            }
            &:last-child {
                border-bottom: none;
            }
        }
    }
</style>