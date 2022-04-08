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
    <div class="coupon-choose" v-if="coupon.length>0">
        <!-- 优惠券 -->
        <view class="rr-cell" @click="showCoupon">
            <view class="flex">
                <view>
                    <text class="uni-text-color" >优惠券</text>
                    <text v-if="defaultCoupon_id == select_coupon_id && select_coupon_id != -1" class="coupon-text theme-primary-border theme-primary-color">已选最大优惠</text>
                </view>
                <view class="flex1">
                    <text v-if="select_coupon_id != -1" class="theme-primary-price">-￥{{couponPrice}}</text>
                    <text v-else class="uni-text-color ">不使用优惠券</text>
                </view>
                <view class="more uni-text-color-grey"><i class="iconfont-m- icon-m-right"></i></view>
            </view>
        </view>

        <pick-mask  v-if="activityModal" @mask-close="handlerClose">
            <view class="inner flex-column">
                <view class="title">优惠券</view>
                <view class="content-box">
                    <scroll-view scroll-y class="content">
                        <view class="coupon-content flex" v-for="(item,index) in coupon" :key="index" @click="chooseCoupon(item.id)">
                            <view style="position: relative">
                                <view class="left flex-column" :class="{'blueBg':item.coupon_sale_type == 2}">
                                    <view v-if="item.coupon_sale_type == 1">￥<text style="font-size: 52rpx;">{{Number(item.discount_price)}}</text></view>
                                    <view v-if="item.coupon_sale_type == 2"><text style="font-size: 52rpx;">{{Number(item.discount_price)}}</text>折</view>
                                    <view style="font-size: 24rpx;">满{{Number(item.enough)}}可用</view>
                                </view>
                                <ul class="dot-list">
                                    <li v-for="dotIndex of 11" :key="dotIndex"></li>
                                </ul>
                            </view>
                            <view class="right flex flex1" :class="{'blueBg':item.coupon_sale_type == 2}">
                                <view class="flex1">
                                    <view class="uni-text-color">{{item.title}}</view>
                                    <view class="uni-text-color-grey">有效期：{{item.show_end_time}}</view>
                                </view>
                                <view class="rr-btn" v-if="select_coupon_id != item.id">立即使用</view>
                                <view v-else>
                                    <i class="iconfont-m- icon-m-yixuanze"></i>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
                <view class="close-btn flex">
                    <view class="not-user" @click="notUse">不使用优惠券</view>
                    <view class="btn theme-primary-bgcolor" @click="handlerClose">关闭</view>
                </view>
            </view>
        </pick-mask>
    </div>
</template>

<script>
    import PickMask from '@/components/picker/PickMask'
    export default {
        name: "CreateCounp",
        components: {
            PickMask
        },
        props: ['coupon','type','orderData'],
        data() {
            return {
                activityModal: 0,
                // coupon: [],
                select_coupon_id: '',
                defaultCoupon_id: ''
            }
        },
        computed: {
            couponPrice() {
                return  this.orderData?.extra_price_package?.coupon

            },
            params() {
                return this.$store.state.orderCreate
            }
        },
        watch: {
            orderData: {
                handler(newValue) {
                    if (newValue?.select_coupon_id) {
                        this.select_coupon_id = newValue.select_coupon_id;
                        this.defaultCoupon_id = newValue?.activity_return_data?.coupon?.[0].id;
                    }
                },
                immediate: true
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            showCoupon() {
                this.activityModal++
            },
            handlerClose() {
                this.activityModal = 0
            },
            notUse() {
                this.select_coupon_id = -1;
                this.activityModal = 0;
                this.handleChooseID(-1);
                this.getData()
            },
            chooseCoupon(id) {
                this.select_coupon_id = id;
                this.activityModal = 0;
                this.handleChooseID(id);
                this.getData()
            },
            getData() {
                this.$emit('getData')
            },
            handleChooseID(id) {
                if (this.type === 'merchant') {
                    let obj = {
                        merchant_select_coupon_id: {
                            ...this.params.merchant_select_coupon_id,
                            [this.orderData.sub_shop_id]: id,
                        }
                    };
                    this.$store.commit('orderCreate/setOrderCreateInfo', obj);
                } else {
                    this.$store.commit('orderCreate/setOrderCreateInfo', {select_coupon_id: id});
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    .coupon-choose {
        .rr-cell {
            .flex1 {
                text-align: right;
            }
            text {
                font-size: 28rpx;
            }
            .coupon-text {
                margin-left: 16rpx;
                padding: 0 16rpx;
                line-height: 28rpx;
                font-size: 20rpx;
                border-radius: 16rpx;
                border: 1px solid $uni-color-primary;
            }
        }
    }
</style>