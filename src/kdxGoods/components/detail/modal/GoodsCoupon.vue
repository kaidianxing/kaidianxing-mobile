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
    <div v-else-if="type == 'coupon'">
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
                        }"
                    >
                        <div class="box">
                            <div class="price">
                                <span
                                    style="font-size:24rpx;"
                                    v-if="item.coupon_sale_type === '1'"
                                >¥</span>
                                <span class="num">{{
                                    item.discount_price | formatPrice
                                }}</span>
                                <span v-if="item.coupon_sale_type === '2'">折</span>
                            </div>
                            <div class="rule">
                                满{{ item.enough | formatPrice }}可用
                            </div>
                        </div>
                        <ul class="dot-list">
                            <li
                                v-for="dotIndex of 11"
                                :key="dotIndex"
                            ></li>
                        </ul>
                    </div>
                    <div
                        class="right"
                        :class="{
                            'coupon-type1': item.coupon_sale_type === '1',
                            'coupon-type2': item.coupon_sale_type === '2',
                        }"
                    >
                        <span
                            class="iconfont-m- icon-m-yilingqu"
                            v-if="item.is_has == 1"
                        ></span>
                        <div class="r-left">
                            <div class="name">
                                <p class="coupon-name">
                                    {{ item.coupon_name }}
                                </p>
                            </div>
                            <div
                                class="time"
                                v-if="
                                    (item.time_limit === '0' &&
                                        (item.start_time || item.end_time)) ||
                                        item.time_limit === '1'
                                "
                            >
                                <div
                                    class="time-inner"
                                    v-if="item.time_limit === '0'"
                                >
                                    {{ item.start_time | formatTime }}~{{
                                        item.end_time | formatTime
                                    }}
                                </div>
                                <div
                                    class="time-inner"
                                    v-else
                                >
                                    {{
                                        item.limit_day === "0"
                                            ? "无限制"
                                            : `即领取日内${item.limit_day}天有效`
                                    }}
                                </div>
                                <!-- {{
                                item.time_limit === '0'
                                    ? `${item.start_time}~${item.end_time}`
                                    : item.limit_day === '0'
                                    ? '无限制'
                                    : `即领取日内${item.limit_day}天有效`
                                                }}-->
                            </div>
                        </div>
                        <div class="r-right">
                            <btn :classNames="[item.coupon_sale_type === '2' ? 'coupon-type2ac' : '']" styles="width:152rpx;"  @btn-click="getCoupon(item, index)">立即领取</btn>
                        </div>
                    </div>
                </li>
            </ul>
        </view>
    </div>
</template>

<script>
import { hasBindBySence } from '@/common/helper/user';
export default {
    props: {
        info: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            couponList: []
        }
    },
    options: { styleIsolation: 'shared' },
    watch: {
        'info.items': {
            handler(value) {
                this.couponList = value?.slice(0)
            },
            immediate: true,
            deep: true,
        }
    },
    methods: {
        getCoupon(item, index) {
            if(hasBindBySence('get_coupon')){
                this.$store.commit('login/setModal', true)
                this.$emit('on-input',false)
                return
            }
            let params = {
                    id: item.id,
                };
            this.$api.memberApi.getCoupon(params).then(res => {
                if (res.error === 0) {
                    this.couponList[index].is_has = 1
                    this.couponList = this.couponList.slice(0)
                    this.$toast('领取成功')
                    this.$emit('on-refresh')
                }
            })
        }
    },
    filters: {
        formatPrice(value) {
            return parseFloat(value)
        },
        formatTime(value) {
            if (value) {
                return value.split(' ')[0].replace(/-/g, '/')
            } else {
                return ''
            }
        },
    }
};
</script>

<style lang="scss" scoped>
/deep/.coupon-type2ac{
    background-color: #518def !important;
}
.coupon-list-content {
    ul {
        overflow: hidden;
    }
    .list-item {
        margin-bottom: 16rpx;
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
            position: relative;
            border-radius: px2rpx(6);
            &.coupon-type1 {
                background-color: #fff3f5;
            }
            &.coupon-type2 {
                background-color: #e6efff;
            }

            .icon-m-yilingqu {
                position: absolute;
                bottom: px2rpx(-25);
                right: px2rpx(-7);
                font-size: 126rpx;
                color: #ffaca0;
                z-index: 0;
            }
            .r-left {
                font-weight: 500;
                flex: 1;
                margin-right: 24rpx;
                height: 120rpx;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .name {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    .plat_form_type {
                        background: linear-gradient(
                            132.57deg,
                            #ff3c29 0%,
                            #ff6f29 94.38%
                        );
                        border-radius: 4rpx;
                        font-size: 18rpx;
                        line-height: 24rpx;
                        text-align: center;
                        color: #fff;
                        margin-right: 8rpx;
                        padding: 4rpx 6rpx;
                        display: inline;
                        &.sub_shop {
                            background: #367bf5;
                        }
                    }
                    .coupon-name {
                        display: inline;
                        font-size: 24rpx;
                        line-height: 34rpx;
                        color: #212121;
                        font-weight: bold;
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
                position: relative;
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

                    &.coupon-type2 {
                        background: linear-gradient(
                            336.94deg,
                            #379fff 7.21%,
                            #2f82ff 92.67%
                        );
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
                        color: #09c15f;
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
