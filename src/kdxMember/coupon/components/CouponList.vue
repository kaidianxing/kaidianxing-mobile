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
    <view class="coupon-list-content">
        <ul>
            <li
                class="list-item"
                v-for="(item, index) in couponList"
                :key="index"
            >
                <div
                    class="left"
                    :class="{
                        'coupon-type1': item.coupon_sale_type === '1',
                        'coupon-type2': item.coupon_sale_type === '2',
                        yiguoqi: couponStatus === 3,
                    }"
                >
                    <div class="box">
                        <div class="price">
                            <span
                                style="font-size:24rpx;"
                                v-if="item.coupon_sale_type === '1'"
                                >¥</span
                            >
                            <span class="num">
                                {{ item.discount_price | formatPrice }}
                            </span>
                            <span v-if="item.coupon_sale_type === '2'">折</span>
                        </div>
                        <div class="rule">
                            满{{ item.enough | formatPrice }}可用
                        </div>
                    </div>
                    <ul class="dot-list">
                        <li v-for="dotIndex of 11" :key="dotIndex"></li>
                    </ul>
                </div>
                <div class="right">
                    <div class="r-left">
                        <div class="name">
                            <p class="coupon-name">{{ item.title }}</p>
                        </div>
                        <div class='merchant_shop_name' v-if='item.sub_shop_name'>[<span class='shop_name'>{{ item.sub_shop_name }}</span>]</div>
                        <div class="time">{{ item.time_content }}</div>
                    </div>
                    <div class="r-right">
                        <div
                            class="use btn"
                            :class="{
                                'coupon-type1': item.coupon_sale_type === '1',
                                'coupon-type2': item.coupon_sale_type === '2',
                            }"
                            v-if="couponStatus === 1"
                            @click.stop="jumpIndex"
                        >
                            去使用
                        </div>
                        <div
                            class="iconfont-m-"
                            v-else
                            :class="{
                                'icon-m-yishiyong': couponStatus === 2,
                                'icon-m-yiguoqi': couponStatus === 3,
                            }"
                        ></div>
                    </div>
                </div>
            </li>
        </ul>
    </view>
</template>
<script>
export default {
    props: ['couponList', 'couponStatus'],
    data() {
        return {}
    },
    filters: {
        formatPrice(value) {
            return parseFloat(value)
        },
    },
    methods: {
        // 返回商城首页
        jumpIndex() {
            this.$Router.replace({
                //#ifndef H5
                path: '/pages/index/index',
                //#endif
                //#ifdef H5
                path: '/'
                //#endif
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.coupon-list-content {
    ul {
        overflow: hidden;
    }
    .list-item {
        margin-top: 16rpx;
        display: flex;
        align-items: center;
        background-color: #fff;
        border-radius: 8rpx;
        overflow: hidden;
        .left {
            width: 204rpx;
            height: 200rpx;
            flex-shrink: 0;
            position: relative;
            font-weight: 500;
            font-size: 24rpx;
            line-height: 34rpx;
            color: #ffffff;
            background-color: #ff3c29;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            .box {
                margin-top: -16rpx;
                .price {
                    font-size: 28rpx;
                    .num {
                        font-size: 48rpx;
                        line-height: 100rpx;
                    }
                }
                .rule {
                    font-size: 24rpx;
                    margin-top: -8rpx;
                }
            }
            &.coupon-type1 {
                background-color: #ff3c29;
            }
            &.coupon-type2 {
                background-color: #518def;
            }
            &.yiguoqi {
                background-color: #969696;
            }
            .dot-list {
                position: absolute;
                right: -6rpx;
                top: -6rpx;
                li {
                    width: 12rpx;
                    height: 12rpx;
                    border-radius: 50%;
                    background-color: #f5f5f5;
                    margin-bottom: 8rpx;
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
        }
        .right {
            flex: 1;
            height: 200rpx;
            display: flex;
            align-items: center;
            padding-left: 24rpx;
            padding-right: 24rpx;
            .r-left {
                font-weight: 500;
                flex: 1;
                margin-right: 24rpx;
                position: relative;
                .name {
                    margin-bottom: 50rpx;
                    display: flex;
                    align-items: center;
                    .plat_form_type{
                        flex-shrink: 0;
                        height: 28rpx;
                        box-sizing: border-box;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(132.57deg, #FF3C29 0%, #FF6F29 94.38%);
                        border-radius: 4rpx;
                        font-size: 18rpx;
                        line-height: 24rpx;
                        text-align: center;
                        color: #fff;
                        margin-right: 8rpx;
                        padding: 4rpx 6rpx;
                        &.sub_shop{
                            background: #367BF5;
                        }
                    }
                    .coupon-name {
                        font-size: 24rpx;
                        line-height: 34rpx;
                        color: #212121;
                        font-weight: bold;
                        flex: 1;
                        white-space: nowrap; 
                        overflow: hidden;
                        text-overflow:ellipsis;
                    }
                }
                .merchant_shop_name{
                    font-size: 24rpx;
                    line-height: 34rpx;
                    color: #969696;
                    position: absolute;
                    top: 44rpx;
                    left: 0;
                    display: flex;
                    align-items: center;
                    .shop_name{
                        max-width: 204rpx;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
                .time {
                    font-size: 24rpx;
                    line-height: 34rpx;
                    color: #969696;
                    div {
                        font-size: 24rpx;
                        line-height: 34rpx;
                        color: #969696;
                    }
                }
            }
            .r-right {
                flex-shrink: 0;
                .btn {
                    height: 54rpx;
                    background: linear-gradient(
                        158.86deg,
                        #ff3c29 0%,
                        #ff6f29 94.38%
                    );
                    border-radius: 27rpx;
                    font-size: 24rpx;
                    line-height: 34rpx;
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    &.coupon-type1 {
                        background: linear-gradient(132.57deg, #FF3C29 0%, #FF6F29 94.38%)
                    }
                    &.coupon-type2 {
                        background: linear-gradient(309.84deg, #379FFF 7.21%, #2F82FF 92.67%);
                    }
                    &.receive {
                        width: 152rpx;
                    }
                    &.use {
                        width: 128rpx;
                    }
                }
                .iconfont-m- {
                    font-size: 120rpx;
                    &.icon-m-yishiyong {
                        // color: #09c15f;
                        color: #969696;
                    }
                    &.icon-m-yiguoqi {
                        color: #969696;
                    }
                }
            }
        }
        &:last-child {
            border-bottom: none;
        }
    }
}
</style>
