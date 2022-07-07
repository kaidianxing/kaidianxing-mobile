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
            <view class="user-desc">{{item.create_time}} {{isLeader?'开团':'参团'}}</view>
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
