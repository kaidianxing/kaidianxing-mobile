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
    <view class="tip" v-if="value" :style="{
        height: windowHeight
    }">
        <view class="flex align-center tip-content">
            <text v-if="type ==='success'" class="iconfont-m- icon-m-yes success-icon"></text>
            <text v-if="type==='error'" class="iconfont-m- icon-m-no1 fail-icon"></text>
            <text class="tip-title">{{title}}</text>
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
    props: {
        title: String,
        value: Boolean,
        type: {
            type: String,
            default: 'success'
        },
        delay: {
            type: Number,
            default: 3000
        }
    },
    computed: {
        ...mapState(['windowHeight']),
    },
    watch: {
        value(val) {
            if (val) {
                setTimeout(() => {
                    this.$emit('input', false)
                }, this.delay)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.tip {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1001;
    width: 100vw;
    background: rgba(#000, 0.6);

    &-content {
        position: absolute;
        left: 50%;
        top: 50%;
        border-radius: 54rpx;
        padding: 0 24rpx;
        height: 72rpx;
        transform: translate(-50%, calc(-50% - 40rpx));
        background: #fff;
    }

    &-title {
        margin-left: 8rpx;
        font-size: 28rpx;
        color: $uni-text-color;
    }

    .success-icon,
    .fail-icon {
        font-size: 32rpx;
    }

    .success-icon {
        color: #09c15f;
    }

    .fail-icon {
        color: $uni-color-primary;
    }
}
</style>