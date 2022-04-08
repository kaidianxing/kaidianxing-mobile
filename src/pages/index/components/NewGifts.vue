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
    <view
        class="ticket"
        v-if="visible"
        @touchmove.stop.prevent
        :style="{
            height: windowHeight,
        }"
    >
        <view class="container" :class="newGiftsData.popup_type == '1' ? 'newBg':''">
            <view class="bg">
                <image
                    :src="newGiftsData.popup_type == '1' ? $utils.staticMediaUrl('ticket/new-people-bg.png') : $utils.staticMediaUrl('ticket/will-receive-bg.png')"
                    class="bg-img" :class="newGiftsData.popup_type == '1' ? 'newBg':''"
                />
                <div class="activity-name" v-if="newGiftsData.popup_type == '0'">新人专享</div>
                <view class="bg-content" :class="newGiftsData.popup_type == '1' ? 'newBg':''">
                    <view class="ticket-content" :class="newGiftsData.popup_type == '1' ? 'newBg':''">
                        <image
                                v-if="newGiftsData.popup_type == '0'"
                            :src="$utils.staticMediaUrl('ticket/ticket-open.png')"
                            class="ticket-open"
                        />
                        <view class="ticket-list">
                            <view class="ticket-linear" v-if="newGiftsData.popup_type == '0'"></view>
                            <scroll-view
                                class="ticket-detail"
                                scroll-y
                                :show-scrollbar="false"
                                :class="newGiftsData.popup_type == '1' ? 'newBg':''"
                            >
                                <div
                                    class="coupon-list"
                                    v-if="
                                        newGiftsData.couponList &&
                                            newGiftsData.couponList.length
                                    "
                                >
                                    <view
                                        class="ticket-item"
                                        v-for="item in newGiftsData.couponList"
                                        :key="item.id"
                                    >
                                        <image
                                            :src="
                                                $utils.staticMediaUrl(
                                                    'ticket/ticket.png'
                                                )
                                            "
                                            class="ticket-bg"
                                        />
                                        <view class="ticket-item-content">
                                            <view
                                                class="flex align-center ticket-layout"
                                            >
                                                <view class="flex left-layout">
                                                    <view
                                                        class="flex align-center"
                                                    >
                                                        <text
                                                            class="ticket-money-unit"
                                                            v-if="
                                                                item.coupon_sale_type ===
                                                                    '1'
                                                            "
                                                        >
                                                            ¥
                                                        </text>
                                                        <text
                                                            class="ticket-money"
                                                            v-if="
                                                                item.coupon_sale_type ===
                                                                    '1'
                                                            "
                                                        >
                                                            {{
                                                                item.discount_price
                                                            }}
                                                        </text>
                                                        <text
                                                            class="ticket-money"
                                                            v-if="
                                                                item.coupon_sale_type ===
                                                                    '2'
                                                            "
                                                        >
                                                            {{
                                                                parseFloat(
                                                                    item.discount_price
                                                                )
                                                            }}
                                                        </text>
                                                        <text
                                                            class="ticket-money-unit"
                                                            v-if="
                                                                item.coupon_sale_type ===
                                                                    '2'
                                                            "
                                                        >
                                                            折
                                                        </text>
                                                    </view>
                                                </view>
                                                <view class="right-layout">
                                                    <view
                                                        class="line-hide ticket-title"
                                                    >
                                                        {{ item.coupon_name }}
                                                    </view>
                                                    <view class="ticket-desc">
                                                        {{ item.content }}
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </div>
                                <div
                                    class="other"
                                    v-if="
                                        newGiftsData.credit &&
                                            !!parseInt(
                                                newGiftsData.credit.number
                                            )
                                    "
                                >
                                    <div class="other-tit" :class="newGiftsData.popup_type == '1' ? 'newBg':''">
                                        <div class="line" v-if="newGiftsData.popup_type == '0'">
                                            <div
                                                class="line-item"
                                                v-for="index of 10"
                                                :key="index"
                                            ></div>
                                        </div>
                                        <div class="text" v-if="newGiftsData.popup_type == '0'">
                                            {{ credit_text }}奖励
                                        </div>
                                        <div class="line" v-if="newGiftsData.popup_type == '0'">
                                            <div
                                                class="line-item"
                                                v-for="index of 10"
                                                :key="index"
                                            ></div>
                                        </div>
                                    </div>
                                    <view class="ticket-item">
                                        <image
                                            :src="
                                                $utils.staticMediaUrl(
                                                    'ticket/ticket.png'
                                                )
                                            "
                                            class="ticket-bg"
                                        />
                                        <view class="ticket-item-content">
                                            <view
                                                class="flex align-center ticket-layout"
                                            >
                                                <view class="flex left-layout">
                                                    <view
                                                        class="flex align-center"
                                                    >
                                                        <text
                                                            class="ticket-money"
                                                        >
                                                            {{
                                                                newGiftsData
                                                                    .credit
                                                                    .number
                                                            }}
                                                        </text>
                                                        <text
                                                            class="ticket-money-unit"
                                                        >
                                                            {{ credit_text }}
                                                        </text>
                                                    </view>
                                                </view>
                                                <view class="right-layout">
                                                    <view
                                                        class="line-hide ticket-title"
                                                    >
                                                        {{
                                                            newGiftsData.credit
                                                                .title
                                                        }}{{ credit_text }}
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </div>
                                <div
                                    class="other"
                                    v-if="
                                        newGiftsData.balance &&
                                            !!parseInt(
                                                newGiftsData.balance.number
                                            )
                                    "
                                >
                                    <div class="other-tit" :class="newGiftsData.popup_type == '1' ? 'newBg':''">
                                        <div class="line" v-if="newGiftsData.popup_type == '0'">
                                            <div
                                                class="line-item"
                                                v-for="index of 10"
                                                :key="index"
                                            ></div>
                                        </div>
                                        <div class="text" v-if="newGiftsData.popup_type == '0'">
                                            {{ balance_text }}奖励
                                        </div>
                                        <div class="line" v-if="newGiftsData.popup_type == '0'">
                                            <div
                                                class="line-item"
                                                v-for="index of 10"
                                                :key="index"
                                            ></div>
                                        </div>
                                    </div>
                                    <view class="ticket-item">
                                        <image
                                            :src="
                                                $utils.staticMediaUrl(
                                                    'ticket/ticket.png'
                                                )
                                            "
                                            class="ticket-bg"
                                        />
                                        <view class="ticket-item-content">
                                            <view
                                                class="flex align-center ticket-layout"
                                            >
                                                <view class="flex left-layout">
                                                    <view
                                                        class="flex align-center"
                                                    >
                                                        <text
                                                            class="ticket-money"
                                                        >
                                                            {{
                                                                parseFloat(
                                                                    newGiftsData
                                                                        .balance
                                                                        .number
                                                                )
                                                            }}
                                                        </text>
                                                        <text
                                                            class="ticket-money-unit"
                                                        >
                                                            元
                                                        </text>
                                                    </view>
                                                </view>
                                                <view class="right-layout">
                                                    <view
                                                        class="line-hide ticket-title"
                                                    >
                                                        {{
                                                            newGiftsData.balance
                                                                .title
                                                        }}{{ balance_text }}
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </div>
                            </scroll-view>
                        </view>
                    </view>
                    <btn v-if="newGiftsData.popup_type == '0'" type="know" size="middle" @btn-click="goReceive" >{{ isLogin ? '我知道了' : '立即领取' }}</btn>
                </view>
            </view>
            <div v-if="newGiftsData.popup_type == '1'" class="know-btn" @click="goReceive" >
                <image class="img" :src="$utils.staticMediaUrl('ticket/new-people-button.png')"></image>
                <div class="text">{{ isLogin ? '我知道了' : '立即领取' }}</div>
            </div>
            <view class="close" :class="newGiftsData.popup_type == '1' ? 'newBg':''">
                <text
                    class="iconfont-m- icon-m-haibaoxieyi1 close-icon"
                    @click="close"
                ></text>
            </view>
        </view>
    </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
    props: {
        newGiftsData: {
            type: Object,
            default: () => {},
        },
        visible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            items: [],
        }
    },
    computed: {
        ...mapState(['windowHeight']),
        ...mapGetters('login', ['isLogin']),
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
        goReceive() {
            // 关闭弹窗
            this.$emit('update:visible', false)
            if (!this.isLogin) {
                // 显示登录弹窗
                this.$store.commit('login/setModal', true)
            }
        },
        close() {
            this.$emit('update:visible', false)
        },
    },
}
</script>

<style lang="scss" scoped>
.ticket {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999999;
    width: 100vw;
    background: rgba(0, 0, 0, 0.87);

    .container {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -60%);
        &.newBg {
            transform: translate(-50%, -50%);
        }

        .bg {
            position: relative;
            .activity-name {
                position: absolute;
                top: 364rpx;
                left: 50%;
                transform: translateX(-50%);
                color: #ffdd2a;
                font-weight: 500;
                font-size: 60rpx;
                line-height: 1.4;
            }
        }

        .bg-img {
            width: 748rpx;
            height: 1018rpx;
            &.newBg {
                height: px2rpx(374);
            }
        }

        .bg-content {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 460rpx;
            width: 504rpx;
            &.newBg {
                height: px2rpx(244);
                top: px2rpx(115);
            }
        }

        .ticket-content {
            position: relative;
            height: 416rpx;
            &.newBg {
                height: px2rpx(244);
            }
        }
        .know-btn {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            margin-top: px2rpx(14);
            height: px2rpx(40);
            width: px2rpx(139);
            .img {
                width: px2rpx(139);
                height: px2rpx(40);
            }
            .text {
                color: #FF3C29;
                font-weight: 600;
                line-height: px2rpx(16);
                font-size: px2rpx(16);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
            }
        }
        .ticket-open {
            width: 504rpx;
            height: 28rpx;
        }

        .ticket-linear {
            position: absolute;
            top: -2rpx;
            left: 0;
            width: 480rpx;
            height: 20rpx;
            z-index: 1001;
            background: linear-gradient(
                            180deg,
                            rgba(0, 0, 0, 0.3) 0%,
                            rgba(196, 196, 196, 0) 100%
            );
        }

        .ticket-list {
            position: absolute;
            left: 12rpx;
            top: 14rpx;
            width: 480rpx;
            border-radius: px2rpx(4);
            overflow: hidden;
            .ticket-detail {
                height: 386rpx;
                &.newBg {
                    height: px2rpx(244);
                }

                &::-webkit-scrollbar {
                    width: 0;
                    display: none;
                }
                /deep/ .uni-scroll-view::-webkit-scrollbar {
                    width: 0;
                    display: none;
                }
                .ticket-item,
                .ticket-bg,
                .ticket-item-content {
                    border-radius: 0px 8rpx 8rpx 0px;
                    width: 480rpx;
                    height: 136rpx;
                }

                .ticket-item {
                    position: relative;
                    margin-bottom: 16rpx;
                    &:last-child {
                        margin-bottom: 0;
                    }

                    &-content {
                        position: absolute;
                        top: 0;
                        left: 0;

                        .ticket-layout {
                            height: 136rpx;
                        }

                        .left-layout {
                            box-sizing: border-box;
                            //padding-left: 18rpx;
                            width: 202rpx;
                            justify-content: center;

                            .ticket-money-unit {
                                margin-top: 14rpx;
                                font-size: 24rpx;
                                line-height: 34rpx;
                                color: #ff3c29;
                            }

                            .ticket-money {
                                font-size: 44rpx;
                                font-weight: bold;
                                line-height: 62rpx;
                                color: #ff3c29;
                            }
                        }

                        .right-layout {
                            margin-left: 4rpx;
                            box-sizing: border-box;
                            padding: 0 16rpx 0 16rpx;
                            width: 274rpx;

                            .ticket-title {
                                font-size: 24rpx;
                                line-height: 34rpx;
                                color: #212121;
                            }

                            .ticket-desc {
                                margin-top: 4rpx;
                                font-size: 24rpx;
                                line-height: 34rpx;
                                color: #969696;
                            }
                        }
                    }
                }

                .other {
                    .other-tit {
                        padding-top: 32rpx;
                        padding-bottom: 16rpx;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        &.newBg {
                            padding-top: 0;
                        }
                        .line {
                            display: flex;
                            align-items: center;
                            .line-item {
                                width: 8rpx;
                                height: 4rpx;
                                border-radius: 2rpx;
                                background-color: #ffdd2a;
                                margin-right: 8rpx;
                                &:first-child {
                                    width: 6rpx;
                                }
                                &:last-child {
                                    margin-right: 0;
                                    width: 6rpx;
                                }
                            }
                        }
                        .text {
                            padding-left: 20rpx;
                            padding-right: 20rpx;
                            font-weight: 500;
                            font-size: 28rpx;
                            line-height: 40rpx;
                            color: #ffdd2a;
                        }
                    }
                }
            }
        }

        .btn {
            margin-left: -4rpx;
            border-radius: 40rpx;
            width: 514rpx;
            height: 80rpx;
            font-size: 32rpx;
            line-height: 80rpx;
            text-align: center;
            color: #ff3c29;
            background-color: #ffd600;
        }
        .close {
            margin-top: 4rpx;
            text-align: center;
            height: 48rpx;
            line-height: 48rpx;
            &.newBg {
                position: absolute;
                top: px2rpx(-50);
                right: px2rpx(40);
            }
            &-icon {
                font-size: 48rpx;
                color: #fff;
            }
        }
    }
}
</style>
