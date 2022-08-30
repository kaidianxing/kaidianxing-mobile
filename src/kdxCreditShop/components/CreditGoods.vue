<template>
    <div class="credit-good flex">
        <div class="goods-card-item" v-for="item in goodsList" :key="item.id" @click="toDetail(item.id)">
            <div class="goods-card-inner flex-column">
                <div class="label-box">
                    <div class="label-icon">
                        <!-- 售罄 -->
                        <div v-if="item.credit_shop_stock < 1" class="sale-img">
                            <img class="sale-img-soldout" :src="getSoldOutIcon" />
                        </div>
                    </div>
                    <div class="goods-img">
                        <img class="goods-img-img" :src="handleImg(item)"/>
                    </div>
                </div>
                <div class="goods-info flex-column">
                    <div class="goods-title two-line-hide">{{item|handleTitle}}</div>
                    <div class="price-box flex">
                        <div class="price bold">{{item.min_price_credit}}{{credit_text}}+￥{{item.min_price}}</div>
                        <div class="cart-icon" @click.stop="addCart(item)">
                            <i class="iconfont-m- icon-m-buy1"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "CreditGoods",
        components: {},
        props: {
            goodsList: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
            }
        },
        computed: {
            ...mapState('setting', {
                sale_out: state => state.systemSetting?.basic?.sale_out || '',
                credit_text: state => state.systemSetting.credit_text,
            }),
            getSoldOutIcon() {
                if (this.sale_out) {
                    return this.$utils.mediaUrl(this.sale_out)
                }
                return this.$utils.staticMediaUrl('decorate/sale_out.png')
            },
            backgroundImage() {
                return `background-image:url(${this.$utils.staticMediaUrl('decorate/goods_col2.png')})`
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            toDetail(id) {
                this.$Router.auto({
                    path: '/kdxCreditShop/detail',
                    query: {
                        id
                    }
                })
            },
            handleImg(item) {
                if (+item.type === 1) {
                    return this.$utils.staticMediaUrl(`creditShop/${+item.shop_coupon.coupon_sale_type === 1?'full.png':'discount.png'}`)
                }
                return this.$utils.mediaUrl(item.shop_goods.thumb) || this.$utils.staticMediaUrl('decorate/goods_col2.png')
            },
            addCart(item) {
                // 快速购买
                this.$emit('addCart', {goods_id: item.id})
            },
        },
        filters: {
            handleTitle(item) {
                if (+item.type === 1) {
                    return item.shop_coupon.coupon_name
                }
                return item.shop_goods.title
            },
        }
    }
</script>

<style lang="scss" scoped>
    .credit-good {
        flex-wrap: wrap;
        justify-content: space-between;
        .goods-card-item {
            width: px2rpx(174);
            margin-bottom: px2rpx(16);
            background-color: #fff;
            border-radius: px2rpx(12);
            .label-box {
                position: relative;
            }
            .goods-img {
                width: px2rpx(174);
                height: px2rpx(174);
                background-repeat: no-repeat;
                background-size: cover;
                .goods-img-img {
                    width: px2rpx(174);
                    height: px2rpx(174);
                }
            }
            .goods-info {
                padding: px2rpx(8);
                box-sizing: border-box;
            }
            .goods-title {
                height: px2rpx(32);
                line-height: px2rpx(16);
            }
            .price-box {
                margin-top: px2rpx(4);
                justify-content: space-between;
                align-items: center;
                .price {
                    font-size: px2rpx(14);
                }
                .icon-m-buy1 {
                    font-size: px2rpx(24);
                }
            }
        }
    }
</style>