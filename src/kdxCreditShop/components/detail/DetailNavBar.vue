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
    <div class="detail-navbar isbottom van-hairline--top">
        <div class='nav-icon' @click="clickBtn('jump')">
            <i class="myicon iconfont-m- icon-m-iconfontshop"></i>
            <span>首页</span>
        </div>
        <btn class="flex1" v-if="soldOut" type="finished" size="middle">已售罄</btn>
        <btn class="flex1" v-else type="do" size="middle" @btn-click="clickBtn('buy')">立即兑换</btn>
    </div>
</template>

<script>
    export default {
        name: "DetailNavBar",
        components: {},
        props: ['soldOut'],
        data() {
            return {}
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            clickBtn(type) {
                this.$emit('clickBtn', type)
            }
        },
    }
</script>

<style lang="scss" scoped>
    .detail-navbar {
        width: 100%;
        padding: px2rpx(7) px2rpx(3) px2rpx(5) px2rpx(3);
        height: px2rpx(48);
        display: flex;
        flex-wrap: nowrap;
        background-color: #fff;
        box-sizing: border-box;
        overflow: hidden;
        &.van-hairline--top:after {
            border-top-color: $uni-border-color;
            border-style: solid;
        }
        .nav-icon {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: px2rpx(54);
            flex-shrink: 0;
            position: relative;
            align-items: center;
            overflow: visible;
            .myicon {
                font-size: px2rpx(20);
                margin: 0 auto;
                text-align: center;
                height: px2rpx(20);
                width: px2rpx(20);
                line-height: px2rpx(20);
                font-style: normal;
                color: #565656;
            }
            span {
                font-size: px2rpx(10);
                line-height: px2rpx(10);
                margin: 0 auto px2rpx(3);
                color: #565656;
                text-align: center;
            }
        }
    }
</style>