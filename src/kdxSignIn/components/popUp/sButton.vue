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
    <view class="popup-common_bt" :class="'popup-common_bt--' + type " :style="[comBtStyle]" @click="change">
        <slot></slot>
    </view>
</template>

<script>
import {px2rpx} from '@/assets/jsTools/environment'

export default {
    name: "sButton",
    props: {
        type: {
            type: String,
            default: 'normal'
        },
        diyStyle: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            ifClick: true
        }
    },
    computed: {
        comBtStyle() {
            let obj = {}
            for (let key in this.diyStyle) {
                obj[key] = this.px2rpx(this.diyStyle[key], 2)
            }
            return obj

        }
    },
    methods: {
        px2rpx,
        change() {
            if (this.ifClick) {
                this.ifClick = false
                this.$emit('onclick')
                setTimeout(() => {
                    this.ifClick = true
                }, 1000)
            }
        }
    }
}
</script>

<style scoped lang="scss">
.popup-common_bt {
    width: px2rpx(140);
    height: px2rpx(38);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: px2rpx(20);
    font-size: px2rpx(14);
    font-weight: bold;

    &-- {
        &normal {
            background: #FF5C00;
            color: #FFFFFF;
        }

        &info {
            border: 1px solid #FF6F29;
            background: #FFFFFF;
            color: #FF6F29;
        }
    }
}
</style>
