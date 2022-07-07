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
                    <text class="uni-text-color">{{item.title}}</text>
                    <text class="uni-text-color-grey" v-if="item.desc">{{item.desc}}</text>
                </view>
                <view class="flex1 more">{{item.price}}</view>
            </view>
        </view>
    </view>
</template>

<script>
    import {mapState} from "vuex";
    export default {
        name: "CreatePrice",
        components: {},
        props: {
            orderData: {
                type: Object,
                default: () => {}
            },
        },
        data() {
            return {}
        },
        computed: {
            ...mapState('setting',{
                systemSetting: state=> state.systemSetting,
            }),
            dispatchName() {
                return this.systemSetting?.dispatch_name
            },
            balance_text() {
                return (this.$store.state.setting?.systemSetting?.balance_text || '余额')
            },
            credit_text() {
                return (this.$store.state.setting?.systemSetting?.credit_text || '积分')
            },
            params() {
                return this.$store.state.orderCreate
            },
            seckillPrice() {
                return this.orderData.extra_price_package?.seckill
            },
            price() {
                return this.orderData?.extra_price_package || {}
            },
            // 价格规格
            priceRules() {
                let priceRules = {}
                if (this.orderData?.extra_price_package) {
                    for (let key in this.orderData.extra_price_package) {
                        this.orderData.extra_discount_rules_package.forEach(
                            (item) => {
                                if (item[key]) {
                                    priceRules = {
                                        ...priceRules,
                                        [key]: item[key],
                                    }
                                }
                            }
                        )
                    }
                }
                return priceRules
            },
            priceList() {
                let result = []
                let goodsInfo =  this.orderData.goods_info;
                let goods_type
                /* --------单商户------------------------ */
                    let {pay_credit,activity_type,goods_price} = this.orderData
                    let priceText = `￥${parseFloat(this.orderData.goods_price).toFixed(2)}`
                    if(pay_credit){
                        priceText = `${this.orderData.pay_credit}${this.credit_text}+${priceText}`
                    }
                    if(goodsInfo && goodsInfo.length > 0) {
                        goods_type = goodsInfo[0].type
                    }
                    result = [
                        {
                            title: '商品小计',
                            price: priceText,
                            show: this.orderData && (this.orderData.goods_price || pay_credit)
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
                            desc: `（满￥${this?.priceRules?.coupon?.enough}${this?.priceRules?.coupon?.coupon_sale_type == 1?'减￥':'享'}${this?.priceRules?.coupon?.discount_price}${this?.priceRules?.coupon?.coupon_sale_type == 1?'':'折'}）`,
                            show: this.price && this.price.coupon
                        },
                        {
                            title: '商城优惠',
                            price: `-￥${this.price?.full_deduct}`,
                            desc: `（单笔满￥${this?.priceRules?.full_deduct?.enough}立减￥${this?.priceRules?.full_deduct?.deduct}）`,
                            show: this.price && this.price.full_deduct
                        },
                        {
                            title: `${this.credit_text}抵扣`, // 积分抵扣
                            price: `-￥${this.orderData?.max_deduction_credit_money}`,
                            show: this.orderData?.max_deduction_credit>0 && this.params?.deduct_credit == 1
                        },
                        {
                            title: `${this.balance_text}抵扣`, // 余额抵扣
                            price: `-￥${this.orderData?.max_deduction_balance}`,
                            show: this.orderData?.max_deduction_balance>0 && this.params?.deduct_balance == 1
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
                            show: goods_type == 0
                        },
                        {
                            title: '合计',
                            price: `￥${parseFloat(Number(this.orderData.pay_price)).toFixed(2)}`,
                            show: true
                        },
                    ];

                result = result.filter(item=>item.show);
                // console.log(result, 'priceList', this.price);
                return result
            }
        },
        created() {
        },
        mounted() {},
        methods: {},
    }
</script>

<style lang="scss">
    .create-price {
        margin: 0 0 px2rpx(8);
        padding: 16rpx 0;
        background-color: #fff;
        border-radius: 12rpx;
        overflow: hidden;
        .more {
            text-align: right;
            font-size: 28rpx;
            color: $uni-text-color;
        }
        .rr-cell {
            height: 66rpx;
            line-height: 66rpx;
            text {
                font-size: px2rpx(14);
            }
        }
    }
</style>
