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
    <view
        class="my-long-button theme-primary-bgcolor"
        :class="tappingClass"
        @click="clickBuntton"
        @touchstart="clickStart"
        @touchend="cancelTap"
        @touchcancel="cancelTap"
        :style="fontStyle"
    >
        <slot></slot>
    </view>
</template>

<script>
export default {
    props: {
        disable: {
            type: Boolean,
            default: false
        },
        fontStyle: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            disabled: this.disable,
            tapping: false
        }
    },
    computed: {
        tappingClass() {
            return this.disable ? 'disable' : this.tapping ? 'tapping' : ''
        }
    },

    methods: {
        clickBuntton() {
            !this.disable && this.$emit('click', this.content)
        },
        clickStart() {
            this.tapping = true
        },
        cancelTap() {
            this.tapping = false
        },
        changeDisabled(e) {
            this.disable = e
        }
    }
}
</script>

<style lang="scss" scoped>
.my-long-button {
    margin-left: 24rpx;
    margin-right: 24rpx;
    height: 80rpx;
    background: linear-gradient(172.93deg, #ff3c29 0%, #ff6f29 94.38%);
    border-radius: 40rpx;
    line-height: 80rpx;
    text-align: center;
    font-size: 28rpx;
    color: #fff;
    font-weight: normal;
    &.tapping {
        color: #eee;
        background: #ec673e;
    }

    &.disable {
        background: #ccc;
        color: #fff !important;
    }
}
</style>
