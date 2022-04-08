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
    <div class='line_blank'>
        <div class='line' :style='{padding:`${px2rpx(componentData.style.padding)} 0`}' v-if='componentData&&componentData.id=="line"'> 
            <p class='line-line' :style='{borderTop:`${px2rpx(componentData.style.height)} ${componentData.style.linestyle} ${componentData.style.bordercolor}`}'></p>
        </div>
        <div class='blank' v-if='componentData&&componentData.id=="blank"'>
            <p class="bg" :style='{height:px2rpx(componentData.style.height)}'></p>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .line {
        width: 100%;
        background-color: transparent;
        .line-line {
            height: 0;
            width: 100%;
        }
    }
    .blank {
        width: 100%;
        .bg {
            background-color: transparent;
        }
    }
</style>