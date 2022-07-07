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
    <view class="goods-list-template">
        <view class="card-list" :class="show_style?'single':'two-lines flex'">
            <view class="goods-card-item line" v-for="(item,index) in getList" :key="index" @click="todetail(item.id)">
                <view class="goods-card-inner" :class="show_style?'flex':'flex-column'">
                    <view class="label-box">
                        <view class="label-icon">
                            <!-- 售罄 -->
                            <view v-if="item.stock < 1" class="sale-img">
                                <image class="sale-img-soldout"  :src="getSoldOutIcon"></image>
                            </view>
                             <block v-else-if="getActName(item)=='seckill'">
                                <view class="seckill-tag">
                                    <i class="iconfont-m- icon-m-shandian badge-icon"></i>
                                    <span class="badge-text">限时秒杀</span>
                                </view>
                            </block>
                            <block v-else-if="getActName(item)=='groups'">
                                <view class="groups-tag" :style="{color: '#fff'}">
                                    <i class="iconfont-m- icon-m-pintuan2-1 badge-icon"></i>
                                    <span class="badge-text">多人拼团</span>
                                </view>
                            </block>
                            <block v-else>
                                <!-- 推荐 -->
                                <view class="recommend" v-if="item.is_recommand == 1">
                                    <image :src="$utils.staticMediaUrl('goods/3.png')"></image>
                                    <span>推荐</span>
                                </view>
                                <view class="recommend" v-else-if="item.is_new == 1">
                                    <image :src="$utils.staticMediaUrl('goods/1.png')"></image>
                                    <span>新品</span>
                                </view>
                                <view class="hot" v-else-if="item.is_hot == 1">
                                    <image :src="$utils.staticMediaUrl('goods/4.png')"></image>
                                    <span>热卖</span>
                                </view>
                            </block>
                        </view>
                        <!-- 分销 -->
                        <view class="commision-money" v-if="item.activities &&item.activities.commission">
                            预计佣金￥{{item.activities.commission}}
                        </view>
                        <!-- 预加载图 -->
                        <image mode='widthFix' class="goods-img preload" lazy-load :src="getLoadingSrc" alt=""
                               v-if='item.preloading&&preloading'></image>
                        <image class="goods-img" :src="$utils.mediaUrl(item.thumb)" @load='loaded(item.thumb)'
                               @error='loaded(item.thumb)' :class='{loading:item.preloading&&preloading}'></image>
                    </view>
                    <view class="goods-info flex1 flex-column flex-between">
                        <view class="goods-title">
                            <view class="title two-line-hide">{{item.title}}</view>
                            <view v-if="show_style" class="sub-title line-hide">{{item.sub_name}}</view>
                        </view>
                        <view class="price-box">
                            <view class="flex-between">
                                <view>
                                    <block>
                                        <view class="price is_seckill theme-primary-price" v-if="getActPrice(item)">
                                            <span class="primary-price theme-primary-price">{{getActPrice(item) |formatMoney}}</span>
                                        </view>

                                        <view class="price theme-primary-price" v-else-if="item.activities && item.activities.member_price!=null">￥
                                            <text class="primary-price theme-primary-price">{{item.activities.member_price}}</text>
                                        </view>
                                        <view class="price theme-primary-price" v-else>￥<span class="primary-price theme-primary-price">{{item.price}}</span></view>
                                        <block>
                                            <view class="original_price" v-if="item.original_price && item.original_price != 0">
                                                ￥{{item.original_price}}
                                            </view>
                                        </block>
                                    </block>
                                </view>
                                <div class='btn-box' >
                                    <i class="iconfont-m- icon-m-buy1 theme-primary-color" v-if="!getActName(item)" @click.stop='clickAdd(item)'></i>
                                    <view class="sales" v-if="item.ext_field && item.ext_field.show_sales == 1">销量:{{item.sales}}</view>
                                </div>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import {mapState} from "vuex";
    import { getActivityName } from '@/common/helper/goods'
    let throttleImageLoad = null;
    export default {
        components: {},
        props: {
            list: {
                type: Array,
                default: () => []
            },
            show_style: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                loading: {},
                preloading: true,
            }
        },
        mounted() {
            setTimeout(() => {
                this.preloading = false;//强行终止图片加载效果
            }, 3000)
        },
        computed: {
            ...mapState('setting', {
                sale_out: state => state.systemSetting?.basic?.sale_out || ''
            }),
            getSoldOutIcon() {
                if (this.sale_out) {
                    return this.$utils.mediaUrl(this.sale_out)
                }
                return this.$utils.staticMediaUrl('decorate/sale_out.png')
            },
            getList() {
                return this.list.map(item => {
                    let src = item.thumb?.replace(/\./g, '_')
                    item.preloading = this.loading[src] === undefined || this.loading[src];
                    return item;
                })
            },
            getLoadingSrc() {
                if (this.$store.state.setting.systemSetting?.basic?.loading) {
                    return this.$store.state.setting.cacheLoadingImg || this.$utils.mediaUrl(this.$store.state.setting.systemSetting.basic.loading)
                } else {
                    return this.$utils.staticMediaUrl('decorate/goods_col2.png')
                }
            },
        },
        methods: {
            clickAdd(item){
                if((item.goodstype == '2' || item.type == '2') && !item?.plugin_account?.virtualAccount) {
                    //卡密权限适配
                    this.$toast('商品暂时无法购买')
                    return
                }
                this.$emit('custom-event', {
                    type: 'addCart',
                    data: {
                        goods_id: item.id,
                        option_id: item.has_option,
                    }
                })
            },
            loaded(url) {
                if (url) {
                    let src = url.replace(/\./g, '_');
                    this.loading[src] = false;
                    clearTimeout(throttleImageLoad)
                    throttleImageLoad = setTimeout(() => {
                        this.loading = {
                            ...this.loading
                        }
                    }, 100)
                }
            },
            todetail(id) {
                this.$Router.auto({
                    path: '/kdxGoods/detail/index',
                    query: {
                        goods_id: id
                    }
                })
            },
            // 获取当前活动名称
            getActName(item){
                if(item.activities) {
                    return getActivityName(item.activities)
                }
                return ''
            },
            // 获取活动价格
            getActPrice(item) {
                let fns = {
                    'seckill': this.getSeckillPrice,

                }
                let fn = fns[this.getActName(item)]
                if(fn){
                  return  fn.call(this,item)
                }
                return ''
            },
            // 获取秒杀价格
            getSeckillPrice(item){
                let info = item.activities?.seckill
                if(!info) return;
                if(item.has_option=='1') {
                    let {min_price } =info?.price_range
                    return min_price
                } else {
                    return info?.activity_price
                }
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
    .goods-list-template {
        box-sizing: border-box;
        .loading {
            display: block;
            height: 0;
            opacity: 0;
        }
        .primary-price {
            font-size: 28rpx;
            &.bargaining {
                font-size: 24rpx;
            }
        }
        .card-list.single {
            background-color: #fff;
            border-radius: 12rpx;
            .goods-card-item {
                padding: 16rpx 24rpx;
            }
        }
        .is_seckill{
            .primary-price::before{
                content: '￥';
                line-height: 20px;
                color: #ff3c29;
                font-size: 12px;
                font-weight: normal;
            }
        }
        .card-list.two-lines {
            flex-wrap: wrap;
            justify-content: space-between;

            .goods-card-item {
                width: 344rpx;
                margin-bottom: 16rpx;
                background-color: #fff;
                border-radius: 12rpx;
                box-sizing: border-box;

                &::after {
                    content: '';
                    border: 0;
                    width: 0;
                    height: 0;
                }

                .goods-info {
                    position: relative;
                    padding: 16rpx 8rpx;
                }
            }
        }
        .btn-box{
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .icon-m-buy1{
            color: #ff3c29;
            font-size: px2rpx(24);
            width: px2rpx(24);
            height: px2rpx(24);
            text-align: center;
            line-height: px2rpx(24);
            margin: auto 0 auto auto;
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
                padding: 0 px2rpx(8) 0 px2rpx(4);
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
        .commision-money {
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 99;
            width: 100%;
            height: px2rpx(21);
            font-size: px2rpx(10);
            line-height: px2rpx(21);
            text-align: center;
            color: #fff;
            background: linear-gradient(171.66deg, #ff3c29 0%, #ff6f29 94.38%);
        }

    }
</style>
