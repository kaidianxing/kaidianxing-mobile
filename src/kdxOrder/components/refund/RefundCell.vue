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
    <view class="cell" :class="[customClass]">
        <div class="flex flex-between align-center cell-inner">
            <view>
                <view class="left">
                    <text
                        v-if="prefixIcon"
                        class="iconfont-m- prefix"
                        :class="[prefixIcon,prefixClass]"
                    />
                    <text class="title" v-if="title">{{ title }}</text>
                    <text class="label" v-if="label">{{ label }}</text>
                </view>
                <view v-if="$slots.bottom">
                    <slot name="bottom"></slot>
                </view>
            </view>
            <slot name="append"></slot>
            <view
                v-if="!$slots.append"
                class="flex align-center"
                @click="iconClick"
            >
                <view class="value-box" v-if="value">
                    <view class="value">{{ value }}</view>
                    <view class="tip" v-if="tip">{{ tip }}</view>
                </view>
                <text
                    v-if="rightIcon"
                    class="cell-icon iconfont-m-"
                    :class="[rightIcon]"
                ></text>
            </view>
        </div>
    </view>
</template>
<script>
export default {
    props: {
        label: String,
        prefixIcon: String,
        title: String,
        value: String,
        tip: String,
        rightIcon: String,
        customClass: String,
        prefixClass: String
    },
    methods: {
        iconClick(e) {
            this.$emit('icon-click', e)
        },
    },
}
</script>

<style lang="scss" scoped>
.cell {
    position: relative;
    padding-left: 24rpx;
    background-color: #fff;
    .cell-inner {
        padding-right: 24rpx;
        min-height: 96rpx;
        border-bottom: 1px solid $uni-border-color;
    }

    &:last-child {
        border-bottom: 0;
    }
    .left {
        display: flex;
        align-items: center;
    }
    .prefix {
        margin-right: 8rpx;
        font-size: 40rpx;
    }

    .title {
        font-size: 28rpx;
        line-height: 40rpx;
        color: $uni-text-color;
    }

    .label {
        margin-left: 12rpx;
        font-size: 24rpx;
        line-height: 34rpx;
        color: $uni-text-color-grey;
    }

    .tip {
        margin-top: 10rpx;
        font-size: 20rpx;
        line-height: 28rpx;
    }

    .value {
        font-size: 20rpx;
        text-align: right;
        line-height: 28rpx;
        color: $uni-text-color-grey;
    }

    .value-box {
        
    }

    .cell-icon {
        font-size: 32rpx;
        color: $uni-text-color-grey;
    }
}
</style>
