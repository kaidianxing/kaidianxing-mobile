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
    <div class='notice-swiper'>
        <swiper vertical class='notice-container' :interval='speed*1000' :key='speed' autoplay circular>
            <swiper-item class='notice-item' style='width:100%;height:64rpx!important;' v-for='(item,index) in list' :key='index' @click='clickItem(item)'>
               <span class='info' :style='{color:item.color}'>{{item.title}}</span>
            </swiper-item>
        </swiper>
    </div>
</template>

<script>
    export default {
        props: {
            speed: {
                type: [Number, String],
                default: 2
            },
            list: {
                type: Array,
                default: () => [{
                    title: '新闻1'
                }]
            }
        },
        methods: {
            clickItem(item) {
                this.$emit('click-notice', item)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .notice-swiper,
    .notice-container,
    .notice-item {
        height: 64rpx!important;
        line-height: 52rpx;
        font-size: 24rpx;
        color: rgb(102, 102, 102);
    }
</style>