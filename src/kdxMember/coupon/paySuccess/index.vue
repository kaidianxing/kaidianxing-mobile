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
    <page-box>
        <div class="content">
            <view class="content-wrap">
                <img
                    class="bg"
                    mode="widthFix"
                    :src="$utils.staticMediaUrl('member/coupon-detail-bg.png')"
                    alt=""
                />

                <div class="content-info" v-if="requestFlag">
                    <img
                        class="content-info-bg"
                        :src="$utils.staticMediaUrl('member/receive-bg.png')"
                        alt=""
                    />
                    <div class="receive-info">
                        <div class="icon iconfont-m- icon-m-yes"></div>
                        <div class="congratulate">恭喜您领取成功</div>
                        <div
                            class="use"
                            :class="{ hidden: couponInfo.is_free === '1' }"
                        >
                            您购买优惠券共消耗
                            <span>
                                {{ couponInfo.credit }}{{ credit_text }}+{{
                                    couponInfo.balance
                                }}元
                            </span>
                        </div>
                    </div>
                    <div class="coupon-info">
                        <img
                            class="coupon-info-bg"
                            :src="
                                $utils.staticMediaUrl('member/receive-coupon-bg.png')
                            "
                            mode="widthFix"
                        />
                        <div class="coupon">
                            <div class="bg"></div>
                            <div class="info">
                                <div
                                    class="left"
                                    :class="{
                                        'coupon-type1':
                                            couponInfo.coupon_sale_type === '1',
                                        'coupon-type2':
                                            couponInfo.coupon_sale_type === '2',
                                    }"
                                >
                                    <div class="box">
                                        <div class="price">
                                            <span
                                                v-if="
                                                    couponInfo.coupon_sale_type ===
                                                        '1'
                                                "
                                            >
                                                ¥
                                            </span>
                                            <span class="num">
                                                {{
                                                    couponInfo.discount_price
                                                        | formatPrice
                                                }}
                                            </span>
                                            <span
                                                v-if="
                                                    couponInfo.coupon_sale_type ===
                                                        '2'
                                                "
                                            >
                                                折
                                            </span>
                                        </div>
                                        <div class="rule">
                                            满￥{{
                                                couponInfo.enough | formatPrice
                                            }}元可用
                                        </div>
                                    </div>
                                    <ul class="dot-list">
                                        <li
                                            v-for="dotIndex of 8"
                                            :key="dotIndex"
                                        ></li>
                                    </ul>
                                </div>
                                <div class="right">
                                    <div class="r-left">
                                        <div class="name">
                                            {{ couponInfo.coupon_name }}
                                        </div>
                                        <div
                                            class="time"
                                            v-if="
                                                (couponInfo.time_limit ===
                                                    '0' &&
                                                    (couponInfo.start_time ||
                                                        couponInfo.end_time)) ||
                                                    couponInfo.time_limit ===
                                                        '1'
                                            "
                                        >
                                            {{
                                                couponInfo.time_limit === '0'
                                                    ? `${couponInfo.start_time}~${couponInfo.end_time}`
                                                    : couponInfo.limit_day ===
                                                      '0'
                                                    ? '无限制'
                                                    : `即领取日内${couponInfo.limit_day}天有效`
                                            }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <btn styles="margin-top:96rpx;" type="do" size="middle" @btn-click="jumpIndex">去使用</btn>
                </div>
            </view>
            <!-- 猜你喜欢 -->
            <goods-like></goods-like>
        </div>
    </page-box>
</template>
<script>
import goodsLike from '../../components/goods/GoodsLike'
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    components: {
        goodsLike,
    },
    data() {
        return {
            couponId: '', // 优惠券id
            couponInfo: {}, // 优惠券信息
            requestFlag: false,
            credit_text: '',
        }
    },
    filters: {
        formatPrice(value) {
            return parseFloat(value)
        },
    },
    mounted() {
        this.credit_text =
            this.$store.state.setting.systemSetting.credit_text || '积分'
        this.couponId = this.$Route.query.id
        this.getCouponDetail()
    },
    methods: {
        // 获取优惠券详情
        getCouponDetail() {
            this.$api.memberApi
                .getCouponDetail({
                    id: this.couponId,
                })
                .then((res) => {
                    if (res.error === 0) {
                        this.couponInfo = { ...res.data }
                    } else {
                        uni.showToast({
                            title: res.message,
                            icon: 'none',
                        })
                    }
                    this.requestFlag = true
                })
        },
        // 返回商城首页
        jumpIndex() {
            this.$Router.replace({
                //#ifndef H5
                path: '/pages/index/index',
                //#endif
                //#ifdef H5
                path: '/',
                //#endif
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.content {
    .content-wrap {
        padding: 48rpx 24rpx 32rpx;
        padding-bottom: 0;
        margin-bottom: 48rpx;
    }
    position: relative;
    min-height: 100vh;
    /* #ifdef H5 */
    min-height: calc(100vh - 44px);
    /* #endif */
    img.bg {
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
    }
    .content-info {
        background-color: #fff;
        border-radius: 12rpx;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        position: relative;
        padding-left: 24rpx;
        padding-right: 24rpx;
        padding-bottom: 32rpx;
        img.content-info-bg {
            position: absolute;
            width: 488rpx;
            left: 88rpx;
            top: 0;
        }
        .receive-info {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-bottom: 52rpx;
            .icon {
                color: #ff3c29;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 140rpx;
                line-height: 1;
                margin-top: 32rpx;
                margin-bottom: 32rpx;
            }
            .congratulate {
                font-weight: bold;
                font-size: 36rpx;
                line-height: 50rpx;
                color: #ff3c29;
            }
            .use {
                margin-top: 8rpx;
                font-weight: 500;
                font-size: 24rpx;
                line-height: 34rpx;
                color: #969696;
                span {
                    color: #ff3c29;
                }
                &.hidden {
                    visibility: hidden;
                }
            }
        }
        .coupon-info {
            position: relative;
            box-sizing: border-box;
            padding-top: 14rpx;
            img.coupon-info-bg {
                position: absolute;
                width: 100%;
                top: 0;
                left: 0;
            }
            .coupon {
                padding-left: 24rpx;
                padding-right: 24rpx;
                position: relative;
                .bg {
                    position: absolute;
                    top: 0;
                    left: 24rpx;
                    z-index: 2;
                    width: calc(100% - 48rpx);
                    height: 20rpx;
                    background: linear-gradient(
                        180deg,
                        rgba(0, 0, 0, 0.3) 0%,
                        rgba(196, 196, 196, 0) 100%
                    );
                }
                .info {
                    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
                    position: relative;
                    display: flex;
                    align-items: center;
                    background-color: #fff;
                    border-bottom-right-radius: 8rpx;
                    border-bottom-left-radius: 8rpx;
                    overflow: hidden;
                    .left {
                        width: 204rpx;
                        height: 160rpx;
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
                                margin-bottom: 12rpx;
                                &:nth-child(1) {
                                    margin-bottom: 8rpx;
                                }
                                &:nth-child(7) {
                                    margin-bottom: 8rpx;
                                }
                                &:nth-child(8) {
                                    margin-bottom: 0;
                                }
                            }
                        }
                    }
                    .right {
                        flex: 1;
                        height: 160rpx;
                        display: flex;
                        align-items: center;
                        padding-left: 24rpx;
                        padding-right: 24rpx;
                        .r-left {
                            font-weight: 500;
                            flex: 1;
                            .name {
                                font-size: 24rpx;
                                line-height: 34rpx;
                                color: #212121;
                                margin-bottom: 16rpx;
                            }
                            .time {
                                font-size: 20rpx;
                                line-height: 28rpx;
                                color: #969696;
                            }
                        }
                    }
                    &:last-child {
                        border-bottom: none;
                    }
                }
            }
        }
        .btn {
            margin-top: 96rpx;
            font-weight: 500;
            font-size: 28rpx;
            line-height: 40rpx;
            color: #ffffff;
            background: linear-gradient(172.42deg, #ff3c29 0%, #ff6f29 94.38%);
            height: 80rpx;
            border-radius: 40rpx;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}
</style>
