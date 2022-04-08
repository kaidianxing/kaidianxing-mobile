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
    <div>
        <pick-mask v-if="value" @mask-close="cancel" @touchmove.stop.prevent>
            <div
                class="container"
                :style="{ paddingBottom: areaBottom + 'px' }"
                @touchmove.stop.prevent
            >
                <div class="title">购物奖励</div>
                <scroll-view
                    class="scroll-view"
                    scroll-y
                    :show-scrollbar="false"
                >
                    <div class="reward-content">
                        <ul class="coupon-list" v-if="reward.coupon_title">
                            <li
                                class="item"
                                v-for="(item, index) in reward.coupon_title"
                                :key="index"
                            >
                                <!-- <div class="coupon-bg">
                                    <img
                                        :src="
                                            $utils.staticMediaUrl(
                                                'ticket/coupon-bg.png'
                                            )
                                        "
                                        alt=""
                                    />
                                </div> -->
                                <div class="item-left">
                                    <span
                                        class="unit"
                                        v-if="item.coupon_sale_type === '1'"
                                    >
                                        ￥
                                    </span>
                                    <span class="price">
                                        {{ parseFloat(item.discount_price) }}
                                    </span>
                                    <span
                                        class="unit"
                                        v-if="item.coupon_sale_type === '2'"
                                    >
                                        折
                                    </span>
                                    <div class="dot dot-t"></div>
                                    <div class="dot dot-b"></div>
                                </div>
                                <div class="item-right">
                                    <div class="tit">
                                        {{ item.coupon_name }}
                                    </div>
                                    <div class="desc">
                                        {{ item.content }}
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div
                            class="other"
                            v-if="reward.credit && !!parseInt(reward.credit)"
                        >
                            <div class="item">
                                <!-- <div class="coupon-bg">
                                    <img
                                        :src="
                                            $utils.staticMediaUrl(
                                                'ticket/coupon-bg.png'
                                            )
                                        "
                                        alt=""
                                    />
                                </div> -->
                                <div class="item-left">
                                    <span class="price">
                                        {{ reward.credit }}
                                    </span>
                                    <span class="unit">{{ credit_text }}</span>
                                    <div class="dot dot-t"></div>
                                    <div class="dot dot-b"></div>
                                </div>
                                <div class="item-right">
                                    <div class="tit">
                                        购物奖励{{ credit_text }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="other"
                            v-if="reward.balance && !!parseInt(reward.balance)"
                        >
                            <div class="item">
                                <!-- <div class="coupon-bg">
                                    <img
                                        :src="
                                            $utils.staticMediaUrl(
                                                'ticket/coupon-bg.png'
                                            )
                                        "
                                        alt=""
                                    />
                                </div> -->
                                <div class="item-left">
                                    <span class="unit">￥</span>
                                    <span class="price">
                                        {{ parseFloat(reward.balance) }}
                                    </span>
                                    <div class="dot dot-t"></div>
                                    <div class="dot dot-b"></div>
                                </div>
                                <div class="item-right">
                                    <div class="tit">
                                        购物奖励{{ balance_text }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="other"
                            v-if="reward.red_package"
                        >
                            <div class="item">
                                <!-- <div class="coupon-bg">
                                    <img
                                        :src="
                                            $utils.staticMediaUrl(
                                                'ticket/coupon-bg.png'
                                            )
                                        "
                                        alt=""
                                    />
                                </div> -->
                                <div class="item-left">
                                    <span class="unit">￥</span>
                                    <span class="price">
                                        {{ parseFloat(reward.red_package.money) }}
                                    </span>
                                    <div class="dot dot-t"></div>
                                    <div class="dot dot-b"></div>
                                </div>
                                <div class="item-right">
                                    <div class="tit">
                                        购物奖励红包
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </scroll-view>
                <div class="cancel" @click="cancel">关闭</div>
            </div>
        </pick-mask>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import PickMask from '@/components/picker/PickMask'
export default {
    props: {
        value: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        PickMask,
    },
    data() {
        return {}
    },
    computed: {
        ...mapState('decorate/goodDetailPage', {
            reward: (state) =>
                state.detailInfo?.activity?.shoppingReward?.reward ?? {},
        }),
        ...mapState(['windowHeight', 'areaBottom']),
        credit_text() {
            return this.$store.state.setting.systemSetting.credit_text || '积分'
        },
        balance_text() {
            return (
                this.$store.state.setting.systemSetting.balance_text || '余额'
            )
        },
    },
    methods: {
        cancel() {
            this.$emit('input', false)
        },
    },
}
</script>

<style lang="scss" scoped>
.container {
    position: absolute;
    bottom: 0;
    left: 0;
    border-radius: 20rpx 20rpx 0px 0px;
    padding: 32rpx 24rpx 0;
    width: 100vw;
    background-color: #fff;
    .title {
        font-size: 32rpx;
        font-weight: bold;
        text-align: center;
        line-height: 44rpx;
        color: #000000;
        font-size: 32rpx;
        margin-bottom: 48rpx;
    }
    .scroll-view {
        max-height: 440rpx;
    }
    .reward-content {
        .item {
            position: relative;
            height: 136rpx;
            border-radius: 8rpx;
            display: flex;
            overflow: hidden;
            margin-bottom: 16rpx;
            background-color: #ffebdf;
            &:last-child {
                margin-bottom: 0;
            }
            .coupon-bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .item-left {
                position: relative;
                display: flex;
                justify-content: center;
                width: 240rpx;
                border-right: 4rpx dashed #fff;
                flex-shrink: 0;
                position: relative;
                .unit {
                    font-size: 24rpx;
                    line-height: 136rpx;
                    color: #ff3c29;
                    transform: translateY(6rpx);
                }
                .price {
                    padding-left: 8rpx;
                    padding-right: 8rpx;
                    font-weight: bold;
                    font-size: 48rpx;
                    line-height: 136rpx;
                    color: #ff3c29;
                }
                .dot {
                    position: absolute;
                    right: -8rpx;
                    width: 12rpx;
                    height: 12rpx;
                    border-radius: 50%;
                    background-color: #fff;
                    &.dot-t {
                        top: -6rpx;
                    }
                    &.dot-b {
                        bottom: -6rpx;
                    }
                }
            }
            .item-right {
                position: relative;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding-left: 28rpx;
                .tit {
                    width: 400rpx;
                    font-size: 24rpx;
                    line-height: 34rpx;
                    color: #212121;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .desc {
                    width: 400rpx;
                    margin-top: 4rpx;
                    font-size: 24rpx;
                    line-height: 34rpx;
                    color: #969696;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
        .other {
            margin-top: 16rpx;
        }
    }
    .cancel {
        margin-top: 16rpx;
        margin-bottom: 16rpx;
        background: linear-gradient(172.93deg, #ff3c29 0%, #ff6f29 94.38%);
        color: #fff;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        border-radius: 40rpx;
        font-size: 28rpx;
    }
}
</style>
