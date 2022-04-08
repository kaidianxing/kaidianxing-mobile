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
    <pick-mask @mask-close="handleCancel">
        <!-- #ifdef MP-TOUTIAO -->
        <view class="inner flex-column">
            <!-- #endif -->
            <!-- #ifndef MP-TOUTIAO -->
        <view class="inner flex-column" @touchmove.stop.prevent>
            <!-- #endif -->
            <view class="title-box">
                <view class="title">{{title}}</view>
                <view class="picker-close" @click="handleCancel"><img
                        class="close-img"
                        :src="$utils.staticMediaUrl('verify/close.png')"
                        alt=""
                    ></view>
            </view>
            <view class="tip">提示：选中商品存在不同配送方式，请分开下单</view>
            <scroll-view
                scroll-y
                class="content-box"
            >
                <view class="content">
                    <slot></slot>
                </view>
            </scroll-view>
        </view>
    </pick-mask>
</template>

<script>
import PickMask from '@/components/picker/PickMask'
export default {
    props: {
        title: {
            type: String,
        }
    },
    components: {
        PickMask
    },
    methods: {
        handleCancel() {
            this.$emit('on-close')
        }
    }
}
</script>

<style lang="scss" scoped>
.inner {
    position: relative;
    background: #fff;
    border-radius: 20rpx 20rpx 0 0;
    height: 1100rpx;
    padding: 0 24rpx 16rpx;
    justify-content: space-between;
    box-sizing: border-box;
    .content-box {
        flex: 1;
        height: 348rpx;
        box-sizing: border-box;
    }

    .title {
        padding: 32rpx 0 24rpx;
        text-align: center;
        color: $uni-text-color;
        font-size: px2rpx(16);
        font-weight: bold;
        line-height: px2rpx(22);
    }

    .title-box {
        position: relative;
        height: px2rpx(50);
        .picker-close {
            position: absolute;
            top: px2rpx(15);
            right: px2rpx(0);
            width: px2rpx(24);
            height: px2rpx(24);
            .close-img {
                width: px2rpx(24);
                height: px2rpx(24);
            }
        }
    }

    .tip {
        font-size: px2rpx(12);
        line-height: px2rpx(17);
        color: $uni-text-color-grey;
    }
}
</style>