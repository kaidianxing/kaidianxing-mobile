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