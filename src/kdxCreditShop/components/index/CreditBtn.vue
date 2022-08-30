<template>
    <div class="credit-btn flex">
        <div class="btn-item flex-column flex1" v-for="(item, index) in getLink" :key="index" @click="jumpLink(item.path)">
            <img class="btn-img" :src="$utils.staticMediaUrl(item.icon)" alt="">
            <div class="title bold">{{item.title}}</div>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "CreditBtn",
        components: {},
        props: {},
        data() {
            return {}
        },
        computed: {
            ...mapState('setting', {
                credit_text: state => state.systemSetting.credit_text,
            }),
            getLink() {
                return [
                    {
                        icon: 'creditShop/credit-shop.png',
                        title: `${this.credit_text}商品`,
                        path: '/kdxCreditShop/list'
                    },
                    {
                        icon: 'creditShop/hot.png',
                        title: `我的${this.credit_text}`,
                        path: '/kdxMember/credit/index'
                    },
                    {
                        icon: 'creditShop/reward.png',
                        title: '我的订单',
                        path: '/kdxOrder/list'
                    },
                    {
                        icon: 'creditShop/oversea.png',
                        title: '个人中心',
                        path: '/kdxMember/index/index'
                    }
                ]
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            jumpLink(path) {
                this.$Router.push({
                    path,
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .credit-btn {
        margin: px2rpx(16) 0 px2rpx(8);
        padding: px2rpx(4) 0 px2rpx(12);
        align-items: center;
        justify-content: center;
        .btn-item {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .btn-img {
            width: px2rpx(80);
            height: px2rpx(80);
            margin-bottom: px2rpx(4);
        }
        .title {
            position: absolute;
            width: 100%;
            left: 0;
            bottom: 0;
            line-height: px2rpx(17);
            font-size: px2rpx(12);
            color: #565656;
            text-align: center;
        }
    }
</style>