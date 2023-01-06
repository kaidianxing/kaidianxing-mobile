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
    <view class="user">
        <view class="user-avatar">
            <img
                class="user-avatar-img"
                :src="$utils.mediaUrl(item.avatar)||$utils.staticMediaUrl('decorate/avatar_mobile.png')"
            />
            <view class="user-tag" v-if="isLeader">团长</view>
        </view>
        <view class="user-info">
            <view class="user-name">{{item.nickname}}</view>
            <view class="user-desc">{{item.created_at}} {{isLeader?'开团':'参团'}}</view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            default: () => { }
        },
        isLeader: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
.user {
    display: flex;
    align-items: center;
    padding: px2rpx(12) 0;
    height: px2rpx(63);

    &.van-hairline--bottom:after {
        border-bottom-color: $uni-border-color;
        border-style: solid;
    }

    &:last-child.van-hairline--bottom:after {
        border-width: 0;
    }

    &-avatar,
    &-avatar-img {
        border-radius: 50%;
        height: px2rpx(38);
        width: px2rpx(38);
    }

    &-avatar {
        position: relative;
        margin-right: px2rpx(18);
    }

    &-tag {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
        border-radius: px2rpx(12);
        padding: px2rpx(1) px2rpx(4);
        font-size: px2rpx(10);
        text-align: center;
        line-height: px2rpx(12);
        color: #ffffff;
        white-space: nowrap;
        background: linear-gradient(114.57deg, #ff8a00 19.05%, #ff4c14 87.67%);
    }

    &-name,
    &-desc {
        font-size: 12px;
        line-height: 17px;
    }

    &-name {
        color: #212121;
    }

    &-desc {
        color: #565656;
    }
}
</style>
