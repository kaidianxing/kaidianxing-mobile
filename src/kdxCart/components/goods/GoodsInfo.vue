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
<theme-content>
    <view class="goods-info-box" :class="show_style ? 'two-lines flex' : ''">
        <view class="goods-card-item line" @click="toDetail(goodsData.id)">
            <view class="goods-card-inner" :class="show_style ? 'flex-column' : 'flex'">
                <view class="label-box">
                    <view class="label-icon">
                        <!-- 售罄 -->
                        <view v-if="goodsData.stock < 1" class="sale-img">
                            <image class="sale-img-soldout"  :src="getSoldOutIcon"></image>
                        </view>
                        <block v-else-if="getActName=='seckill'">
                              <view class="seckill-tag">
                                    <i class="iconfont-m- icon-m-shandian badge-icon"></i>
                                    <span class="badge-text">限时秒杀</span>
                                </view>
                        </block>
                        <block v-else-if="getActName=='groups'">
                            <view class="groups-tag" :style="{color: '#fff'}">
                                <i class="iconfont-m- icon-m-pintuan2-1 badge-icon"></i>
                                <span class="badge-text">多人拼团</span>
                            </view>
                        </block>
                        <block v-else>
                            <!-- 推荐 -->
                            <view class="recommend" v-if="goodsData.is_recommand == 1">
                                <image :src="$utils.staticMediaUrl('goods/3.png')"></image>
                                <span>推荐</span>
                            </view>
                            <view class="recommend" v-else-if="goodsData.is_new == 1">
                                <image :src="$utils.staticMediaUrl('goods/1.png')"></image>
                                <span>新品</span>
                            </view>
                            <view class="hot" v-else-if="goodsData.is_hot == 1">
                                <image :src="$utils.staticMediaUrl('goods/4.png')"></image>
                                <span>热卖</span>
                            </view>
                        </block>
                    </view>
                    <view class="commision-money" v-if="goodsData.activities &&goodsData.activities.commission">预计佣金￥{{goodsData.activities.commission}}</view>
                    <view class="goods-img" :style="backgroundImage">
                        <image class="goods-img-img preload" :src="getLoadingSrc" v-if='loading&&preloading'></image>
                        <image class="goods-img-img" @load='loaded' @error='loaded' :src="$utils.mediaUrl(goodsData.thumb)" :class='{loading:loading&&preloading}'></image>
                    </view>
                </view>
                <view class="goods-info flex1 flex-column flex-between">
                    <view class="goods-title">
                        <view class="title two-line-hide">{{goodsData.title}}</view>
                        <view class="sub-title line-hide" v-if="!show_style">{{ goodsData.sub_name }}</view>
                    </view>
                    <block>
                        <view class="price-box" @click.stop>
                            <view class="flex-between">
                                <view>
                                    <block>
                                        <view class="price" v-if="goodsData.activities && goodsData.activities.member_price!=null">￥<text class="primary-price">{{goodsData.activities.member_price}}</text></view>
                                        <view class="price" v-else-if="getActName=='seckill'">{{getSeckillPrice}}</view>
                                        <view class="price" v-else>￥<text class="primary-price">{{ goodsData.price }}</text></view>
                                    </block>
                                    <view class="original_price" v-if="goodsData.original_price && goodsData.original_price != 0">
                                        ￥{{ goodsData.original_price|formatMoney }}
                                    </view>
                                </view>
                                <block v-if="getActName">
                                    <view class="sales" v-if="goodsData.ext_field && goodsData.ext_field.show_sales == 1 && getActName!=='seckill'">
                                        销量:{{goodsData.sales}}
                                    </view>
                                    <div class="buy-btn-box" @click="toDetail(goodsData.id)">
                                        <div class="btn  theme-primary-border">
                                            <span class="buybtn theme-primary-color">去购买</span>
                                            <i class='iconfont-m- icon-m-right theme-primary-color'></i>
                                        </div>
                                    </div>
                                </block>
                                <block v-else>
                                    <view class="right">
                                        <view class="cart-icon" v-if="isAddIcon" @click.stop="addCart">
                                            <i class="iconfont-m- icon-m-buy1 theme-primary-color"></i>
                                        </view>
                                        <view class="sales" v-if="goodsData.ext_field && goodsData.ext_field.show_sales == 1">销量:{{ goodsData.sales}}</view>
                                    </view>
                                </block>
                            </view>
                        </view>
                    </block>
                </view>
            </view>
        </view>
    </view>
    </theme-content>
</template>

<script>
    import { getActivityName } from '@/common/helper/goods'
    import {
        mapState
    } from "vuex";
    export default {
        name: 'GoodsInfo',
        props: {
            goodsData: {
                type: Object,
                default: () => {},
            },
            show_style: {
                type: Boolean,
                default: false,
            },
            isAddIcon: {
                type: Boolean,
                default: false,
            },
            // 快速购买标识
            quickPurchase: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                loading: true,
                preloading: true
            }
        },
        computed: {
            ...mapState('setting', {
                sale_out: state => state.systemSetting ?.basic ?.sale_out || ''
            }),
            getSoldOutIcon() {
                if (this.sale_out) {
                    return this.$utils.mediaUrl(this.sale_out)
                }
                return this.$utils.staticMediaUrl('decorate/sale_out.png')
            },
            getLoadingSrc() {
                if (this.$store.state.setting.systemSetting ?.basic ?.loading) {
                    return this.$store.state.setting.cacheLoadingImg || this.$utils.mediaUrl(this.$store.state.setting.systemSetting.basic.loading)
                } else {
                    return this.$utils.staticMediaUrl('decorate/goods_col2.png')
                }
            },
            getActName(){
                if(this.goodsData.activities) {
                    return getActivityName(this.goodsData.activities)
                }
                return ''
            },
            getSeckillPrice(){
                // 小程序方法调用太多次
                // #ifndef H5
                if(!this.goodsData.activities?.seckill)return
                 // #endif
                if(this.goodsData.has_option=='1') {
                    let {min_price } = this.goodsData.activities?.seckill?.price_range || {}
                    return `${min_price}`
                } else {
                    return this.goodsData?.activities?.seckill?.goods_info[0]?.activity_price
                }
            },
            backgroundImage() {
                return `background-image:url(${this.$utils.staticMediaUrl('decorate/goods_col2.png')})`
            }
        },
        mounted() {
            setTimeout(() => {
                this.preloading = false
            }, 3000)
        },
        methods: {
            loaded(url) {
                this.loading = false;
            },
            addCart() {
                if (this.quickPurchase) {
                    // 快速购买
                    this.$emit('custom-event', {
                        type: 'addCart',
                        data: {
                            goods_id: this.goodsData.id,
                        }
                    })
                } else {
                    // 猜你喜欢 点击加购 统一跳转商品详情
                    this.toDetail(this.goodsData.id)
                }
            },
            toDetail(id) {
                this.$Router.auto({
                    path: '/kdxGoods/detail/index',
                    query: {
                        goods_id: id,
                    },
                })
            },
        },
        filters: {
            formatMoney(money) {
                if (typeof money === 'number' || (typeof money === 'string' && money.trim() !== '')) {
                    if (money >= 10000) {
                        return parseFloat(money / 10000) + '万'
                    } else {
                        return parseFloat(money)
                    }
                } else {
                    return 0
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .goods-info-box .loading {
        display: block;
        height: 0;
        opacity: 0;
    }
    .goods-info-box.two-lines {
        flex-wrap: wrap;
        justify-content: space-between;
        .goods-card-item {
            width: 344rpx;
            margin-bottom: 16rpx;
            background-color: #fff;
            border-radius: 12rpx;
            box-sizing: border-box;
            .label-box {
                position: relative;
            }
            &.line::after {
                content: "";
                border: 0;
            }
            .goods-info {
                padding: 16rpx;
                height: 204rpx;
                box-sizing: border-box;
                .goods-title {
                    height: 130rpx;
                }
            }
            .goods-img {
                width: 344rpx;
                height: 344rpx;
                background-repeat: no-repeat;
                background-size: cover;
                .goods-img-img {
                    width: 344rpx;
                    height: 344rpx;
                }
            }
            .deposit {
                display: flex;
                align-items: center;
                margin-top: px2rpx(4);

                .deposit-text {
                    width: px2rpx(37);
                    height: px2rpx(19);
                    font-size: px2rpx(12);
                    border-radius: px2rpx(10) 0 0 px2rpx(10);
                    background-color: $uni-color-primary;
                    color: #fff;
                    text-align: center;
                }

                .deposit-price {
                    padding: 0 px2rpx(8);
                    height: px2rpx(19);
                    font-size: px2rpx(12);
                    border-radius: 0 px2rpx(10) px2rpx(10) 0;
                    background-color: #fff;
                    color: $uni-color-primary;
                    border: 1px solid $uni-color-primary;
                }
            }
            .buy-btn-box {
                display: flex;
                align-items: flex-end;

                .btn {
                    display: flex;
                    align-items: center;
                    padding: 0 px2rpx(8);
                    height: px2rpx(27);
                    margin: 0;
                    border-radius: px2rpx(15);
                    border: 1px solid $uni-color-primary;

                    .buybtn {
                        margin-right: px2rpx(4);
                        font-size: px2rpx(12);
                        line-height: px2rpx(17);
                        color: $uni-color-primary;
                    }

                    .iconfont-m- {
                        font-size: px2rpx(12);
                        color: $uni-color-primary;
                    }
                }
            }
            .sub-title {
                height: 50rpx;
            }
        }
    }
    .commision-money {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 999;
        width: 100%;
        height: px2rpx(21);
        font-size: px2rpx(10);
        line-height: px2rpx(21);
        text-align: center;
        color: #fff;
        background: linear-gradient(171.66deg, #ff3c29 0%, #ff6f29 94.38%);
    }
    .goods-card-item .goods-card-inner .goods-info .price.bargaining {
        font-size: px2rpx(14);
    }
</style>
