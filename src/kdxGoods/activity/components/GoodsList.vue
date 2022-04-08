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
    <view class="goods-list-template">
        <view class="card-list single"  :class="{
            'seckill': type=='seckill'
        }">
            <view class="goods-card-item" :class="{
                'line': !is_seckill(item),
                'container': is_seckill(item)
            }" v-for="(item,index) in getList" :key="index" @click="todetail(item.id)">
                <view class="goods-card-inner flex">
                    <view class="label-box">
                        <view class="label-icon">
                            <!-- 售罄 -->
                            <view v-if="item.stock < 1" class="sale-img">
                                <image class="sale-img-soldout"  :src="getSoldOutIcon"></image>
                            </view>

                            <block v-if="is_seckill(item)">
                                <view class="seckill-tag">
                                    <i class="iconfont-m- icon-m-shandian badge-icon"></i>
                                    <span class="badge-text">限时秒杀</span>
                                </view>
                            </block>
                        </view>
                        <!-- 分销 -->
                        <view class="commision-money" v-if="item.activities &&item.activities.commission">
                            预计佣金￥{{item.activities.commission|formatMoney}}
                        </view>
                        <!-- 预加载图 -->
                        <image mode='widthFix' class="goods-img preload" lazy-load :src="getLoadingSrc" alt=""
                               v-if='item.preloading&&preloading'></image>
                        <image class="goods-img" :src="$utils.mediaUrl(item.thumb)" @load='loaded(item.thumb)'
                               @error='loaded(item.thumb)' :class='{loading:item.preloading&&preloading}'></image>
                    </view>
                    <view class="goods-info flex1 flex-column flex-between">
                        <view class="goods-title">
                            <view class="title " :class="{
                                'two-line-hide': !item.sub_name,
                                'line-hide': item.sub_name
                            }">{{item.title}}</view>
                            <view v-if="item.sub_name" class="sub-title line-hide">{{item.sub_name}}</view>
                            <view class="seckill-box" v-if="is_seckill(item)">
                                <!-- 秒杀倒计时 -->
                                <slot name="seckillCountdown" :data='item'></slot>
                                <div class="goods-price-info">
                                    <div class="goods-price-box">
                                        <div class="goods-seckill-tag">秒杀价</div>
                                        <span class="goods-price-unit">¥</span>
                                        <span class="goods-price-num">{{item|getSeckillPrice|formatMoney}}</span>
                                        <span class="orginal-price" v-if="item.original_price && item.original_price != 0">¥{{item.original_price|formatMoney}}</span>
                                    </div>
                                </div>
                            </view>
                        </view>
                        
                        <view class="price-box">
                            <view class="flex-between">
                                <view>
                                    <block>
                                        <!-- 非秒杀活动 -->
                                       <block v-if="!is_seckill(item)">
                                            <view class="price" v-if="item.activities && item.activities.member_price!=null">￥
                                                <span class="primary-price">{{item.activities.member_price}}</span>
                                            </view>
                                            <view class="price theme-primary-price" v-else>￥<span class="primary-price theme-primary-price">{{item.price}}</span></view>
                                            <block>
                                                <view class="original_price" v-if="item.original_price && item.original_price != 0">
                                                    ￥{{item.original_price|formatMoney}}
                                                </view>
                                            </block>
                                       </block>
                                        <block v-if="is_seckill(item)">
                                            <view class="sales" v-if="item.ext_field && item.ext_field.show_sales == 1">
                                                销量:{{item.sales}}
                                            </view>
                                        </block>
                                    </block>
                                </view>
                                <block v-if="is_seckill(item)">
                                    <div class="seckill-btn-box" @click="todetail(item.id)">
                                        马上抢
                                    </div>
                                </block>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
    </theme-content>
</template>

<script>
    import {mapState} from "vuex";

    let throttleImageLoad = null;
    export default {
        props: {
            list: {
                type: Array,
                default: () => []
            },
            type: {
                type: String,
                default: 'goods'
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
        created() {
        },
        methods: {
            is_seckill(item) {
                return item.activities && (item.activities.seckill || item.activities.preheat_activity) && this.type == 'seckill'
            },

            clickAdd(item) {
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
                this.$Router.push({
                    path: '/kdxGoods/detail/index',
                    query: {
                        goods_id: id
                    }
                })
            }
        },
        filters: {
            getSeckillPrice(item) {
                let info = item.activities?.seckill || item.activities?.preheat_activity || {}
                if (item.has_option == '1') {
                    return info?.price_range?.min_price || 0
                } else {
                    return info?.activity_price

                }
            },
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
        position: relative;
        box-sizing: border-box;
        .loading {
            display: block;
            height: 0;
            opacity: 0;
        }
        .card-list.single {
            background-color: #fff;
            border-radius: 12rpx;
            .goods-card-item {
                padding: 16rpx 24rpx;
            }
        }
      
        .btn-box{
            display: flex;
            flex-direction: column;
            height: 100%;
            margin:auto 0;
        }
        .icon-m-buy1{
            color: #ff3c29;
            font-size: px2rpx(20);
            width: px2rpx(20);
            height: px2rpx(20);
            text-align: center;
            line-height: px2rpx(20);
            margin: auto 0 auto auto;
        }

         .goods-card-inner {
            .sub-title {
                margin-top: px2rpx(4);
                font-size: px2rpx(12);
                line-height: px2rpx(17);
                color: #969696;
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

        .seckill-btn-box {
            height: px2rpx(27);
            border-radius: px2rpx(24);
            padding: 0 px2rpx(14);
            font-size: px2rpx(12);
            font-weight: bold;
            line-height: px2rpx(27);
            text-align: center;
            color: #fff;
            background: linear-gradient(132.57deg, #FF3C29 0%, #FF6F29 94.38%);
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


        // 秒杀

        .card-list.seckill {
            background: transparent;
        }
        .container {
            margin-bottom: px2rpx(8);
            border-radius: px2rpx(6);
            background: #ffffff;
        }

        .seckill {
            .goods-price-info,.goods-seckill-tag {
                .goods-price-unit {
                    font-size: px2rpx(12);
                    line-height: px2rpx(14);
                    color: #ff3c29;
                }

                .goods-price-num {
                    font-size: px2rpx(16);
                    font-weight: bold;
                    color: #ff3c29;
                }
            }
        }

        .goods-price-box {
            display: flex;
            align-items: center;
        }
        .goods-price-info {
             margin-top: px2rpx(12);
            .goods-seckill-tag {
                display: inline-block;
                margin-right: px2rpx(4);
                border-radius: px2rpx(2);
                padding: 0 px2rpx(4);
                min-width: px2rpx(24);
                font-size: px2rpx(10);
                text-align: center;
                line-height: px2rpx(14);
                color: #ff3c29;
                border: 1px solid #ff3c29;
            }


            .goods-price-unit {
                font-size: px2rpx(10);
                line-height: px2rpx(14);
                color: #ff3c29;
            }

            .goods-price-num {
                font-size: px2rpx(12);
                color: #ff3c29;
            }

            .orginal-price {
                margin-left: px2rpx(4);
                text-decoration: line-through;  
                font-size: px2rpx(10);
                line-height: px2rpx(14);
                color: #969696;
            }
        }


        
    }
</style>