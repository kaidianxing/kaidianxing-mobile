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
    <!-- #ifndef MP-TOUTIAO -->
    <view class="pick-mask" :style="{height:windowHeight}" @touchmove.stop.prevent>
    <!-- #endif -->
    <!-- #ifdef MP-TOUTIAO -->
    <view class="pick-mask" :style="{height:windowHeight}">
    <!-- #endif -->
        <view class="mask" @click="maskClose" v-if="mask" :style="{height:windowHeight}"></view>
        <view class="slot-content" :style="{bottom: areaBottom + 'px'}">
            <slot></slot>
        </view>
        <view class="safe-area" :style="{height: areaBottom + 'px'}"></view>
    </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
    props: {
        mask: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        ...mapState(['windowHeight', 'areaBottom'])
    },
    methods: {
        maskClose(){
            this.$emit('mask-close')
        },
    }
}
</script>

<style lang="scss" scoped>
.pick-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 10000001;

    .mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        background: rgba(0, 0, 0, 0.6);
        z-index: 10000002;
    }

    .slot-content {
        position: absolute;
        left: 0;
        width: 100vw;
        z-index: 10000003;
    }

    .safe-area {
        position: absolute;
        width: 100vw;
        left: 0;
        bottom: 0;
        z-index: 10000003;
        background-color: #fff;
    }
}
</style>