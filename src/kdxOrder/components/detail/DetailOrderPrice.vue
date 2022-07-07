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
    <view class="create-price">
        <view class="rr-cell" v-for="(item, index) in priceList" :key="index">
            <view class="flex">
                <view>
                    <span class="label">{{item.title}}</span>
                    <span class="uni-text-color-grey desc" v-if="item.desc">{{item.desc}}</span>
                </view>
                <view class="flex1 more">{{item.price}}</view>
            </view>
        </view>
        <view class="rr-cell pay_price">
            <view class="flex">
                <div>
                    <span>实付</span>
                </div>
                <!-- 积分商城订单价格 -->
                <block v-if="orderData.activity_type === '5'">
                    <view class="flex1 more">
                        <span class="uni-color-primary" v-if="orderData.pay_price != ''">{{ orderData.pay_credit+credit_text }} + </span>
                        <span class="uni-color-primary">￥{{ orderData.pay_price }}</span>
                    </view>
                </block>
                <!-- 普通 -->
                <block v-else>
                    <div class="flex1 more theme-primary-price">￥<span class="theme-primary-price">{{orderData.pay_price}}</span></div>
                </block>
            </view>
        </view>
    </view>
</template>

<script>
import {mapState} from "vuex";

export default {
    props: {
        orderData: {
            type: Object,
            default: () => {}
        },
    },
    data() {
        return {
        }
    },
    computed: {
        ...mapState('setting', ['systemSetting']),
        ...mapState('setting', {
            credit_text: state => state.systemSetting.credit_text,
            balance_text: state => state.systemSetting.balance_text,
        }),
        dispatchName() {
            return this.systemSetting?.dispatch_name
        },
        seckillPrice(){
            return this.orderData.extra_price_package?.seckill;
        },
        price() {
            return this.orderData?.extra_price_package
        },
        priceList() {
            let result = [];
            let goodsInfo = this.orderData.goods_info, goods_type;
            if(goodsInfo && goodsInfo.length > 0) {
                goods_type = goodsInfo[0].type
            }
                result = [
                    {
                        title: '商品小计',
                        price: this.adaptivePrice,
                        show: this.orderData && this.orderData.goods_price
                    },
                    {
                        title: '拼团优惠',
                        price: `-￥${parseFloat(this.price?.groups).toFixed(2)}`,
                        show: this.price?.groups>0
                    },
                    {
                        title: '会员优惠',
                        price: `-￥${this.price?.member_price}`,
                        show: this.price && this.price.member_price
                    },
                    {
                        title: '优惠券',
                        price: `-￥${this.price?.coupon}`,
                        show: this.price && this.price.coupon
                    },
                    {
                        title: '商城优惠',
                        price: `-￥${this.price?.full_deduct}`,
                        show: this.price && this.price.full_deduct
                    },
                    {
                        title: `${this.credit_text}抵扣`, // 积分抵扣
                        price: `-￥${this.price?.credit}`,
                        show: this.price && this.price.credit
                    },
                    {
                        title: `${this.balance_text}抵扣`, // 余额抵扣
                        price: `-￥${this.price?.balance}`,
                        show: this.price && this.price.balance
                    },
                    {
                        title: '秒杀优惠',
                        price: `-￥${this?.seckillPrice}`,
                        show: this?.seckillPrice>0
                    },

                    {
                        title: '运费',
                        price: `￥${parseFloat(this.orderData?.dispatch_price) || 0}`,
                        desc: this.orderData?.dispatch_type == '30'?` （${this.dispatchName[30] ? this.dispatchName[30] : '同城配送'}）`:'',
                        show: goods_type == 0 && this.orderData.dispatch_type != '20'
                    },
                    {
                        title: '订单改价',
                        price: `${this.orderData?.change_price>0?'':'-'}￥${this.orderData?.change_price>0?parseFloat(this.orderData?.change_price).toFixed(2):parseFloat(-this.orderData?.change_price).toFixed(2)}`,
                        show: this.orderData && this.orderData.change_price != 0
                    },
                ];

            result = result.filter(item=>item.show);
            return result
        },
        adaptivePrice() {
            if (this.orderData.activity_type === '5') {
                if (this.orderData.goods_price == '') {
                    return (`${this.orderData.pay_credit}${this.credit_text}`)
                } else {
                    return (`${this.orderData.pay_credit}${this.credit_text} + ￥${this.orderData.goods_price}`)
                }
            }
            return (`￥${this.orderData.goods_price}`)
        }
    },
    created() {},
    filters: {
        handlePrice(data) {
            return (Number(data.pay_price)).toFixed(2)
        }
    }
}
</script>

<style lang="scss" scoped>
.create-price {
    margin: 16rpx 0;
    background-color: #fff;
    border-radius: 12rpx;
    text {
        color: #565656;
    }
    .pay_price {
        span {
            font-size: 32rpx;
            font-weight: 700;
            color: $uni-text-color;
        }
        .more {
            font-size: 32rpx;
            font-weight: 700;
        }
    }
    .more {
        text-align: right;
        font-size: 28rpx;
        color: $uni-text-color;
    }
    .rr-cell {
        height: 33px;
        line-height: 33px;
        .label {
            color: #565656;
            font-size: px2rpx(12);
        }
        .more {
            font-size: px2rpx(12);
        }
        .desc {
            font-size: 24rpx;
        }
    }
}
</style>
