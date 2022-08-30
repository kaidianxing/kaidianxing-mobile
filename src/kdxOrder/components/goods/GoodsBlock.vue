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
    <view class="goods-block-inner">
        <view class="flex">
            <view class="goods-image" :style="backgroundImage">
                <image class='grace-img-lazy' :src="getGoodsThumb" @click='detail(goodsData.id)'/>
            </view>
            <view class="goods-info flex1 flex-column">
                <view class="title-box">
                    <view class='title two-line-hide'>
                        {{goodsData.title}}
                    </view>
                    <view v-if="goodsOptionTitle" class='option-title two-line-hide'>{{goodsOptionTitle}}
                    </view>
                </view>
                <view class="price-box flex-between" v-if="goodsData.type != '3'" :class="{'credit-price': order&&goodsData.credit_unit}">
                        <view class="flex">
                            <span class="primary-price bold" v-if="order&&goodsData.credit_unit">{{Number(goodsData.credit_unit)}}{{credit_text}}+</span>
                            <div v-if="order" :class="{bold: order}" class="price">￥
                                <span class="primary-price" :class="{bold: order}">{{goodsData.price_unit}}</span>
                            </div>
                            <div class="price" v-else>￥
                                <span class="primary-price">{{goodsData.price}}</span>
                            </div>
                        </view>
                        <view class="add-num">
                            <text class="iconfont-m- icon-m-jianhao add-icon"
                                :class="{'uni-text-color-grey':( goodsData.total<=1 )}"
                                @click.stop="clickAdd(-1)"></text>
                            <input class="goods-total" type="number" v-model="goodsData.total" :disabled="activityType==1"
                                @input="handlerChangeNumber" @blur="handlerBlurNumber"/>
                            <text class="iconfont-m- icon-m-jiahao reduce-icon"
                                :class="{'uni-text-color-grey':(((maxBuyNum && goodsData.total >= maxBuyNum) || goodsData.stock == goodsData.total || (activityType=='')))}"
                                @click.stop="clickAdd(1)"></text>
                            <!--                    <div class="numLimit">

                                                </div>-->
                        </view>
                </view>
            </view>
        </view>
        <view class="limitBuy" v-if="activityType!=5 && maxBuyNum && goodsData.type !='3' ">
            <view class="uni-color-primary">
                <span>限购{{maxBuyNum}}件</span>
            </view>
        </view>
    </view>
</template>

<script>
    import {mapState} from "vuex";
    export default {
        name: "GoodsBlock",
        components: {},
        props: {
            goodsData: {
                type: Object,
                default: () => {
                }
            },
            order: { // 是否是下单
                type: Boolean,
                default: false
            },
            addGrayColor: {
                type: Boolean,
                default: false
            },
            reduceGrayColor: {
                type: Boolean,
                default: true
            },
            activityType: { // 订单类型
                type: [String, Number],
                default: ''
            },
            maxBuyNum: {
                type: [String, Number],
                default: ''
            },
        },
        data() {
            return {}
        },
        computed: {
            ...mapState('setting', {
                credit_text: state => state.systemSetting.credit_text,
            }),
            backgroundImage() {
                return `background-image:url(${this.$utils.staticMediaUrl('decorate/goods_col2.png')})`
            },
            isCreditCoupon(){
                return this.goodsData.ext_field?.is_credit_shop_coupon
            },
            goodsOptionTitle(){
                return this.goodsData?.option_id ? this.goodsData.option_title: ''
            },
            getGoodsThumb(){
                if(this.isCreditCoupon){
                    let name =  this.goodsData.ext_field?.coupon_sale_type == '2'? 'creditShop/discount.png': 'creditShop/full.png'
                    return this.$utils.staticMediaUrl(name)
                }
                return this.$utils.mediaUrl(this.goodsData.thumb)
            }
        },
        created() {
            console.log(this.goodsData, '>>>>')
        },
        mounted() {
        },
        methods: {
            detail(id) {
                this.$emit('detail', id)
            },
            clickAdd(data) {
                this.$emit('clickAdd', data)
            },
            handlerChangeNumber(e) {
                this.$emit('handlerChangeNumber', e)
            },
            handlerBlurNumber(e) {
                this.$emit('handlerBlurNumber', e)
            }
        },
    }
</script>

<style lang="scss">
    .goods-block-inner {
        position: relative;
        justify-content: space-between;

        .goods-image {
            flex-shrink: 0;
            width: 180rpx;
            height: 180rpx;
            margin-right: 24rpx;
            position: relative;
            border-radius: 6rpx;
            background-color: #fff;
            background-position: 0 0;
            background-size: 100% 100%;
            background-repeat: no-repeat;

            image {
                width: 180rpx;
                height: 180rpx;
                border-radius: 6rpx;
                display: block;
            }
        }

        .goods-info {
            justify-content: space-between;
            color: $uni-text-color;
            font-size: 28rpx;

            
            .price-box.credit-price {
                align-items: center;
                .primary-price {
                    font-size: 24rpx;
                    color: $uni-color-primary;
                }

                .add-num {
                    margin-top: 0;
                }
            }


            .goods-type {
                margin-right: px2rpx(5);
                padding: 0 px2rpx(8);
                height: px2rpx(19);
                line-height: px2rpx(19);
                border-radius: px2rpx(10);
                background-color: $uni-color-primary;
                font-size: px2rpx(12);
                color: #fff;
            }

            .title {
                line-height: 34rpx;
                color: $uni-text-color;
                font-size: 28rpx;
            }

            .option-title {
                width: fit-content;
                margin-top: 7px;
                padding: 1px 16rpx;
                color: $uni-text-color-grey;
                font-size: 20rpx;
                background: $uni-bg-color-grey;
                border-radius: 22rpx;
            }

            .price-box {
                align-items: flex-end;
                //align-items: center;
                //height: px2rpx(40);
            }

            .price {
                color: $uni-color-primary;
                font-size: 24rpx;
                //margin-top: -16px;
            }

            .add-num {
                display: flex;
                align-items: center;
                //flex-direction: column;
                height: px2rpx(24);
                margin-top: px2rpx(7);

                .goods-total {
                    display: inline-block;
                    width: px2rpx(36);
                    height: px2rpx(18);
                    line-height: px2rpx(18);
                    background: $uni-bg-color-grey;
                    border-radius: px2rpx(2);
                    font-size: px2rpx(12);
                    color: #212121;
                    text-align: center;
                }

                .add-icon, .reduce-icon {
                    /*display: block;*/
                    /*height: 40rpx;*/
                    /*width: 40rpx;*/
                    line-height: px2rpx(20);
                    box-sizing: content-box;
                    font-size: px2rpx(12);
                    padding: px2rpx(3) px2rpx(6) 0;
                    font-weight: bold;
                    position: relative;
                }

                .add-icon {
                    /*padding: px2rpx(6) 8rpx 0 px2rpx(6);*/
                    &:after {
                        content: '';
                        position: absolute;
                        width: px2rpx(32);
                        height: px2rpx(32);
                        left: -16rpx;
                        top: 50%;
                        margin-top: -32rpx;
                    }
                }

                .reduce-icon {
                    /*padding: 20rpx 0 0 8rpx;*/
                    &:after {
                        content: '';
                        position: absolute;
                        width: px2rpx(32);
                        height: px2rpx(32);
                        right: -16rpx;
                        top: 50%;
                        margin-top: -32rpx;
                    }
                }
            }
        }

        .limitBuy {
            display: flex;
            justify-content: flex-end;
            height: px2rpx(14);

            .uni-color-primary {
                line-height: 14px;
                font-size: 10px;
                font-weight: 400;
                width: px2rpx(84);
                text-align: center;
            }
        }
    }
</style>