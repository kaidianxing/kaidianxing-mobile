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
        <view class="container" :class="popup_type == '1'?'new-position':''">
            <view class="bg">
                <image
                    :src="getImg"
                    class="bg-img" :class="popup_type == '1' ?
                    activityType == 'consumeReward'?'consumption':'shopping' : ''"
                />
                <div class="activity-name" v-if="popup_type == '0'">
                    {{ activityType | formatActivityType }}
                </div>
                <view class="bg-content" :class="popup_type == '1'?activityType == 'consumeReward' ?'consumption':'shopping':''">
                    <view class="ticket-content">
                        <image v-if="popup_type == '0'"
                            :src="$utils.staticMediaUrl('ticket/ticket-open.png')"
                            class="ticket-open"
                        />
                        <view class="ticket-list" :class="popup_type == '1'?activityType == 'consumeReward'?'':'titleBox':''">
                            <view class="ticket-linear" v-if="popup_type == '0'"></view>
                            <scroll-view
                                class="ticket-detail"
                                :class="popup_type == '1'?activityType == 'consumeReward' ?'consumption':'shopping':''"
                                scroll-y
                                :show-scrollbar="false"
                            >
                                <div
                                    class="coupon-list"
                                    v-if="
                                        activityData.couponList &&
                                            activityData.couponList.length
                                    "
                                >
                                    <view
                                        class="ticket-item"
                                        :class="popup_type == '1'&&activityType == 'shoppingReward'?'titleSize':''"
                                        v-for="item in activityData.couponList"
                                        :key="item.id"
                                    >
                                        <image
                                            :src="
                                                popup_type == '0'? $utils.staticMediaUrl('ticket/ticket.png'):
                                                $utils.staticMediaUrl('ticket/title.png')"
                                            class="ticket-bg" :class="popup_type == '1'&&activityType == 'shoppingReward'?'titleSize':''"
                                        />
                                        <view class="ticket-item-content" :class="popup_type == '1'?activityType == 'consumeReward'?'':'titleSize':''">
                                            <view
                                                class="flex align-center ticket-layout"
                                            >
                                                <view class="flex left-layout">
                                                    <view
                                                        class="flex align-center"
                                                    >
                                                        <text
                                                            class="ticket-money-unit"
                                                            :class="popup_type == '1'?'font-color':''"
                                                            v-if="
                                                                item.coupon_sale_type ===
                                                                    '1'
                                                            "
                                                        >
                                                            ¥
                                                        </text>
                                                        <text
                                                            class="ticket-money"
                                                            :class="popup_type == '1'?'font-color':''"
                                                        >
                                                            {{
                                                                parseFloat(
                                                                    item.discount_price
                                                                )
                                                            }}
                                                        </text>
                                                        <text
                                                            class="ticket-money-unit"
                                                            :class="popup_type == '1'?'font-color':''"
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
                                                        :class="popup_type == '1'?'font-color':''"
                                                    >
                                                        {{ item.coupon_name }}
                                                    </view>
                                                    <view class="ticket-desc" :class="popup_type == '1'?'font-color':''">
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
                                        activityData.credit &&
                                            !!parseInt(
                                                activityData.credit.number
                                            )
                                    "
                                >
                                    <div class="other-tit" :class="popup_type == '1'?'line-height':''">
                                        <div class="line" v-if="popup_type == '0'">
                                            <div
                                                class="line-item"
                                                v-for="index of 10"
                                                :key="index"
                                            ></div>
                                        </div>
                                        <div class="text" v-if="popup_type == '0'">
                                            {{ credit_text }}奖励
                                        </div>
                                        <div class="line" v-if="popup_type == '0'">
                                            <div
                                                class="line-item"
                                                v-for="index of 10"
                                                :key="index"
                                            ></div>
                                        </div>
                                    </div>
                                    <view class="ticket-item" :class="popup_type == '1'&&activityType == 'shoppingReward'?'titleSize':''">
                                        <image
                                                :src="
                                                popup_type == '0'? $utils.staticMediaUrl('ticket/ticket.png'):
                                                $utils.staticMediaUrl('ticket/title.png')"
                                            class="ticket-bg" :class="popup_type == '1'&&activityType == 'shoppingReward'?'titleSize':''"
                                        />
                                        <view class="ticket-item-content" :class="popup_type == '1'&&activityType == 'shoppingReward'?'titleSize':''">
                                            <view
                                                class="flex align-center ticket-layout"
                                            >
                                                <view class="flex left-layout">
                                                    <view
                                                        class="flex align-center"
                                                    >
                                                        <text
                                                            class="ticket-money"
                                                            :class="popup_type == '1'?'font-color':''"
                                                        >
                                                            {{
                                                                activityData
                                                                    .credit
                                                                    .number
                                                            }}
                                                        </text>
                                                        <text
                                                            class="ticket-money-unit"
                                                            :class="popup_type == '1'?'font-color':''"
                                                        >
                                                            {{ credit_text }}
                                                        </text>
                                                    </view>
                                                </view>
                                                <view class="right-layout">
                                                    <view
                                                        class="line-hide ticket-title"
                                                        :class="popup_type == '1'?'font-color':''"
                                                    >
                                                        {{
                                                            activityData.credit
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
                                        activityData.balance &&
                                            !!parseInt(
                                                activityData.balance.number
                                            )
                                    "
                                >
                                    <div class="other-tit" :class="popup_type == '1'?'line-height':''">
                                        <div class="line" v-if="popup_type == '0'">
                                            <div
                                                class="line-item"
                                                v-for="index of 10"
                                                :key="index"
                                            ></div>
                                        </div>
                                        <div class="text" v-if="popup_type == '0'">
                                            {{ balance_text }}奖励
                                        </div>
                                        <div class="line" v-if="popup_type == '0'">
                                            <div
                                                class="line-item"
                                                v-for="index of 10"
                                                :key="index"
                                            ></div>
                                        </div>
                                    </div>
                                    <view class="ticket-item" :class="popup_type == '1'&&activityType == 'shoppingReward'?'titleSize':''">
                                        <image
                                            :src="popup_type == '0'? $utils.staticMediaUrl('ticket/ticket.png'):
                                                $utils.staticMediaUrl('ticket/title.png')"
                                            class="ticket-bg" :class="popup_type == '1'&&activityType == 'shoppingReward'?'titleSize':''"
                                        />
                                        <view class="ticket-item-content" :class="popup_type == '1'&&activityType == 'shoppingReward'?'titleSize':''">
                                            <view
                                                class="flex align-center ticket-layout"
                                            >
                                                <view class="flex left-layout">
                                                    <view
                                                        class="flex align-center"
                                                    >
                                                        <text
                                                            class="ticket-money"
                                                            :class="popup_type == '1'?'font-color':''"
                                                        >
                                                            {{
                                                                parseFloat(
                                                                    activityData
                                                                        .balance
                                                                        .number
                                                                )
                                                            }}
                                                        </text>
                                                        <text
                                                            class="ticket-money-unit"
                                                            :class="popup_type == '1'?'font-color':''"
                                                        >
                                                            元
                                                        </text>
                                                    </view>
                                                </view>
                                                <view class="right-layout">
                                                    <view
                                                        class="line-hide ticket-title"
                                                        :class="popup_type == '1'?'font-color':''"
                                                    >
                                                        {{
                                                            activityData.balance
                                                                .title
                                                        }}{{ balance_text }}
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </div>
                                <div
                                    class="other"
                                    v-if="
                                        activityData.red_package && activityData.red_package.number
                                    "
                                >
                                    <div class="other-tit" :class="popup_type == '1'?'line-height':''">
                                        <div class="line" v-if="popup_type == '0'">
                                            <div
                                                class="line-item"
                                                v-for="index of 10"
                                                :key="index"
                                            ></div>
                                        </div>
                                        <div class="text" v-if="popup_type == '0'">
                                            红包奖励
                                        </div>
                                        <div class="line" v-if="popup_type == '0'">
                                            <div
                                                class="line-item"
                                                v-for="index of 10"
                                                :key="index"
                                            ></div>
                                        </div>
                                    </div>
                                    <view class="ticket-item" :class="popup_type == '1'&&activityType == 'shoppingReward'?'titleSize':''">
                                        <image
                                            :src="
                                                popup_type == '0'? $utils.staticMediaUrl('ticket/ticket.png'):
                                                $utils.staticMediaUrl('ticket/title.png')"
                                            class="ticket-bg" :class="popup_type == '1'&&activityType == 'shoppingReward'?'titleSize':''"
                                        />
                                        <view class="ticket-item-content" :class="popup_type == '1'&&activityType == 'shoppingReward'?'titleSize':''">
                                            <view
                                                class="flex align-center ticket-layout"
                                            >
                                                <view class="flex left-layout">
                                                    <view
                                                        class="flex align-center"
                                                    >
                                                        <text
                                                            class="ticket-money"
                                                            :class="popup_type == '1'?'font-color':''"
                                                        >
                                                            ￥{{
                                                                parseFloat(
                                                                    activityData
                                                                        .red_package
                                                                        .number
                                                                )
                                                            }}
                                                        </text>
                                                    </view>
                                                </view>
                                                <view class="right-layout">
                                                    <view
                                                        class="line-hide ticket-title"
                                                        :class="popup_type == '1'?'font-color':''"
                                                    >
                                                        {{
                                                            activityData.red_package.title
                                                        }}红包
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </div>
                            </scroll-view>
                        </view>
                    </view>
                    <view class="btn" @click="goReceive" v-if="popup_type == '0'">
                        {{ btnText }}
                    </view>
                </view>
            </view>
            <div class="know"  @click="goReceive" v-if="popup_type == '1'">
                <image v-if="popup_type == '1'&&activityType == 'consumeReward'" class="img" :src="$utils.staticMediaUrl('ticket/consumption-button.png')"></image>
                <div class="text" :class="activityType == 'consumeReward'? '' :'text-position'">{{ btnText }}</div>
            </div>
            <view class="close" :class="popup_type == '1'?'closePosition':''">
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
        activityType: {
            type: String,
            default: 'newGifts',
        },
        activityData: {
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
        popup_type() {
            return this.activityData?.popup_type
        },
        getImg() {
            if(this.popup_type == 0) {
                return this.$utils.staticMediaUrl('ticket/will-receive-bg.png')
            } else {
                if(this.activityType == 'consumeReward') {
                    return this.$utils.staticMediaUrl('ticket/consumption-new-bg.png')
                }else if(this.activityType == 'shoppingReward'){
                    return this.$utils.staticMediaUrl('ticket/shopping-new-bg.png')
                }
            }
        },
        btnText() {
            if (!this.isLogin) {
                return '立即领取'
            } else {
                if (this.activityType === 'shoppingReward') {
                    return '查看奖励'
                }
                return '我知道了'
            }
        },
    },
    filters: {
        formatActivityType(value) {
            let text = ''
            switch (value) {
                case 'newGifts':
                    text = '新人送礼'
                    break
                case 'rechargeReward':
                    text = '充值奖励'
                    break
                case 'consumeReward':
                    text = '消费奖励'
                    break
                case 'shoppingReward':
                    text = '购物奖励'
                    break
                default:
                    text = '新人送礼'
                    break
            }
            return text
        },
    },
    methods: {
        goReceive() {
            // 关闭弹窗
            this.$emit('update:visible', false)
            if (!this.isLogin) {
                // 显示登录弹窗
                this.$store.commit('login/setModal', true)
            } else if (this.activityType === 'shoppingReward') {
                // 查看奖励
                if(this.activityData.red_package) {
                    //如果含有红包奖励
                    return
                } else {
                    this.$Router.replaceAll({
                        path: '/kdxMember/index/index',
                    })
                }

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
        &.new-position {
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
            &.consumption {
                height: px2rpx(360);
            }
            &.shopping {
                height: px2rpx(407);
            }
        }

        .bg-content {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 460rpx;
            width: 504rpx;
            &.consumption {
                top: px2rpx(156);
                height: px2rpx(168);
            }
            &.shopping {
                top: px2rpx(130);
                width: px2rpx(220);
                height: px2rpx(210);
            }
        }

        .ticket-content {
            position: relative;
            height: 416rpx;
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
            &.titleBox {
                width: px2rpx(220);
                left: 0;
            }

            .ticket-detail {
                border-radius: px2rpx(4);
                height: 386rpx;
                &.consumption {
                    height: px2rpx(168);
                }
                &.shopping {
                    height: px2rpx(200);
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
                    &.titleSize {
                        width: px2rpx(220);
                    }
                }
                .ticket-item {
                    position: relative;
                    margin-bottom: 16rpx;
                    &.titleSize {
                        width: px2rpx(220);
                    }
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
                            /*padding-left: 18rpx;*/
                            width: 202rpx;

                            .flex.align-center {
                                width: 100%;
                                justify-content: center;
                            }

                            .ticket-money-unit {
                                margin-top: 14rpx;
                                font-size: 24rpx;
                                line-height: 34rpx;
                                color: #ff3c29;
                                &.font-color {
                                    color: #FFFFFF;
                                }
                            }

                            .ticket-money {
                                font-size: 44rpx;
                                font-weight: bold;
                                line-height: 62rpx;
                                color: #ff3c29;
                                &.font-color {
                                    color: #FFFFFF;
                                }
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
                                &.font-color {
                                    color: #FFFFFF;
                                }
                            }

                            .ticket-desc {
                                margin-top: 4rpx;
                                font-size: 24rpx;
                                line-height: 34rpx;
                                color: #969696;
                                &.font-color {
                                    color: #FFFFFF;
                                }
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
                        &.line-height {
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
        .know{
            height: px2rpx(40);
            width: px2rpx(140);
            position: absolute;
            top: px2rpx(376);
            left: 50%;
            transform: translateX(-50%);
            .img {
                width: 100%;
                height: 100%;
            }
            .text {
                line-height: px2rpx(16);
                text-align: center;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                color: #FFFFFF;
                font-size: px2rpx(16);
                font-weight: 600;
                &.text-position {
                    top:px2rpx(-2);
                    color: #FF3C29;
                }
            }
        }
        .close {
            margin-top: 4rpx;
            text-align: center;
            height: 48rpx;
            line-height: 48rpx;
            &.closePosition {
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
