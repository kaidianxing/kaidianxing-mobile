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
                <image class="grace-img-lazy" :src="handleThumb()" @click.stop="detail(goodsData.goods_id, goodsData)"/>
                <block v-if="status == 11">
                    <view class="send-icon" v-if="goodsData.status == 20">已发货</view>
                    <view class="send-icon" v-if="goodsData.status == 10">未发货</view>
                </block>
            </view>
            <view class="flex1">
                <view class="goods-info flex-column">
                    <view class="title-box">
                        <view class="title two-line-hide">
                            {{goodsData.title}}
                        </view>
                        <view class="option-title line-hide" v-if="handleOptionTitle()">{{handleOptionTitle()}}</view>
                    </view>
                    <view class="flex align-center" v-if="isRefund">
                        <view class="refund-money-label">退款金额：</view>
                        <view class="refund-money-value" v-if="goodsData.price === '0.00' && goodsData.credit !== '0'">{{ goodsData.credit }}{{ credit_text }}</view>
                        <view class="refund-money-value" v-if="goodsData.price !== '0.00' && goodsData.credit === '0'">￥{{ goodsData.price }}</view>
                        <view class="refund-money-value" v-if="goodsData.price !== '0.00' && goodsData.credit !== '0'">{{ goodsData.credit }}{{ credit_text }}+￥{{ goodsData.price }}</view>
                    </view>
                    <view class="price-box flex-between" v-if="!isRefund && goodsData.type != '3'">
                        <!-- 积分商城订单适配 -->
                        <view class="credit-price price" v-if="goodsData.credit_unit">
                            <span class="primary-price theme-primary-price">{{ goodsData.credit_unit }}{{credit_text}}</span>
                            <span v-if="goodsData.price_unit !== '0.00'" class="primary-price theme-primary-price">+￥{{ goodsData.price_unit }}</span>
                        </view>
                        <!-- 标准订单 -->
                        <view class="price theme-primary-price" v-else>
                            ￥<span class="primary-price theme-primary-price">{{goodsData.price_unit || goodsData.price}}</span> 
                        </view>
                        <view class="add-num">
                            <text>x{{goodsData.total}}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view v-if="$slots.btn" class="flex flex-end btn">
            <slot name="btn"></slot>
        </view>
    </view>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: 'GoodsInfo',
    components: {},
    props: {
        goodsData: {
            type: Object,
            default: () => {}
        },
        isRefund: {
            type: Boolean,
            default: false
        },
        status: {
            type: [String, Number]
        },
        orderData: {
            type: Object,
            default: () => {}
        },
        orderType: {
            type: [String, Number]
        }
    },
    data() {
        return {}
    },
    watch: {
        goodsData: {
            immediate: true,
            handler(val) {
                if (val&&val.ext_field&&val.ext_field.is_credit_shop_coupon) {
                    val.option_title = val?.ext_field?.content || ''
                    if(val?.ext_field?.coupon_sale_type == 1) {
                        val.thumb = `${this.$utils.staticMediaUrl('creditShop/full.png')}`
                    }
                    if(val?.ext_field?.coupon_sale_type == 2) {
                        val.thumb =  `${this.$utils.staticMediaUrl('creditShop/discount.png')}`
                    }
                } else if (val&&val.thumb) {
                    val.thumb = `${this.$utils.mediaUrl(val.thumb)}`
                }
                this.goodsData = val
            }
        }
    },
    computed: {
        ...mapState('setting', {
            credit_text: state => state.systemSetting?.credit_text || '积分',
        }),
        backgroundImage() {
            return `background-image:url(${this.$utils.staticMediaUrl('decorate/goods_col2.png')})`
        },
        order_id() {
          if(this.$Route.query?.order_id || this.$Route.query?.order_goods_id){
            return true
          }else {
            return false
          }
        },
        chooseType() {
            if (!this.orderData) return 
            return this.orderData.activity_type
        }
    },
    methods: {
        detail(id, goodsData) {
            this.$emit('detail', {id, goodsData})
        },
        handleThumb() {
            if (this.goodsData&&this.goodsData.ext_field&&this.goodsData.ext_field.is_credit_shop_coupon) {
                if(this.goodsData?.ext_field?.coupon_sale_type == 1) {
                    return `${this.$utils.staticMediaUrl('creditShop/full.png')}`
                }
                if(this.goodsData?.ext_field?.coupon_sale_type == 2) {
                    return `${this.$utils.staticMediaUrl('creditShop/discount.png')}`
                }
            } else if (this.goodsData&&this.goodsData.thumb) {
                return `${this.$utils.mediaUrl(this.goodsData.thumb)}`
            }
        },
        handleOptionTitle() {
            if (this.goodsData&&this.goodsData.ext_field&&this.goodsData.ext_field.is_credit_shop_coupon) {
                return this.goodsData?.ext_field?.content || ''
            } else {
                return this.goodsData?.option_title || ''
            }
        }
    }
}
</script>

<style lang="scss">
.goods-block-inner {
    position: relative;
    overflow: hidden;
    .goods-image {
        flex-shrink: 0;
        position: relative;
        width: 160rpx;
        height: 160rpx;
        margin-right: 24rpx;
        border-radius: 4rpx;
        background-color: #fff;
        background-position: 0% 0%;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        overflow: hidden;

        image {
            width: 160rpx;
            height: 160rpx;
            border-radius: 4rpx;
            display: block;
        }
        .send-icon {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 32rpx;
            line-height: 32rpx;
            color: #fff;
            font-size: 20rpx;
            text-align: center;
            background: #212121;
            opacity: 0.7;
        }
    }
    .goods-info {
        overflow: hidden;
        justify-content: space-between;
        color: $uni-text-color;
        height: 160rpx;
        .goods-type {
            margin-right: px2rpx(5);
            padding: 0 px2rpx(8);
            height: px2rpx(19);
            line-height: px2rpx(19);
            border-radius: px2rpx(10);
            background-color: $uni-color-primary;
            font-size: px2rpx(12);
            color: #fff;

            &.activity {
                margin-right: px2rpx(4);
                border-radius: px2rpx(2);
                padding: px2rpx(1) px2rpx(4);
                font-size: px2rpx(10);
                line-height: px2rpx(14);
                background: linear-gradient(114.57deg, #FF8A00 19.05%, #FF4C14 87.67%);
            }
        }
        .title {
            line-height: 40rpx;
            font-size: 28rpx;
        }
        .option-title {
            width: fit-content;
            margin-top: 4rpx;
            padding: 1px 16rpx;
            max-width: 390rpx;
            height: 32rpx;
            color: $uni-text-color-grey;
            font-size: 20rpx;
            background: $uni-bg-color-grey;
            border-radius: 22rpx;
        }

        .refund-money-label {
            font-size: 24rpx;
            color: #212121;
        }

        .refund-money-value {
            font-size: 24rpx;
            font-weight: bold;
            color: #ff3c29;
        }
        .price-box {
            align-items: center;
        }
        .price {
            color: $uni-color-primary;
            font-size: 24rpx;

            &.refund {
                color: $uni-text-color;
            }
        }
        .add-num {
            text:nth-of-type(2) {
                height: 38rpx;
                line-height: 38rpx;
                background: $uni-bg-color-grey;
                border-radius: 22rpx;
                color: #000;
                text-align: center;
                padding: 0 32rpx;
            }
        }
    }
}
</style>