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
    <pick-mask class="pay-picker show" @mask-close="closePicker(true)" v-if="pickerShow" @click.stop>
        <view class="inner flex-column">
            <div class="picker-close" @click="closePicker(true)">
                <img class="close-img" :src="$utils.staticMediaUrl('verify/close.png')" alt="">
            </div>
            <view class="title">{{ title }}</view>
            <view class="cell-group flex1">
                <block>
                    <view class="rr-cell" v-for="(item, index) in payList" :key="index" @click="chooseType(item)">
                        <view class="flex">
                            <view class="label flex1">
                                <block>
                                    <i v-if="item.type == 'balance'" class="iconfont-m- icon-m-pay-def-pay"></i>
                                    <i v-if="item.type == 'wechat'" class="iconfont-m- icon-m-pay-wechatpay"></i>
                                    <i v-if="item.type == 'alipay'" class="iconfont-m- icon-m-pay-alipay"></i>
                                    <i v-if="item.type == 'delivery'" class="iconfont-m- icon-m-huodaofukuan"></i>
                                </block>
                                <block>
                                    <span v-if="item.type == 'balance'">
                                        {{ balance_text }}
                                        <span v-if="!hasWeixin">支付</span>
                                        <span class="uni-color-primary balance" v-if="!hasWeixin">(当前{{ balance_text }}：￥{{member_balance }})</span>
                                    </span>
                                    <span v-if="item.type == 'wechat'">
                                        {{item.withdraw ? item.withdrawText : '微信' }}
                                        <span v-if="!hasWeixin">支付</span>
                                    </span>
                                    <span v-if="item.type == 'alipay'">
                                        {{item.withdraw ? item.withdrawText : '支付宝' }}
                                        <span v-if="!hasWeixin">支付</span>
                                    </span>
                                    <span v-if="item.type == 'delivery'">货到付款</span>
                                </block>
                            </view>
                            <!--<view class="flex radio-box">
                                <i class="icon-m-yes iconfont-m-" v-if="item.type == payType"></i>
                                <i class="icon-m-no iconfont-m-" v-else></i>
                            </view>-->
                        </view>
                    </view>
                </block>
            </view>
            <!--<view>
                <view class="rr-btn pay-btn" @click="confirmPay">确认</view>
            </view>-->
        </view>
    </pick-mask>
</template>

<script>
    import PickMask from './PickMask'
    import {mapState} from "vuex";

    export default {
        components: {
            PickMask
        },
        props: {
            title: {
                type: String,
                default: '选择支付方式'
            },
            hasWeixin: {
                type: Boolean,
                default: false
            },
            payList: {
                type: Array,
                default: () => []
            },
        },
        data() {
            return {
                paymentList: [],
                pickerShow: false,
                // payType: '', // 选中的支付方式
                is_weixin: false,
                member_balance: 0
            }
        },
        watch: {
            // payList: {
            //     handler(value) {
            //         if (value && value.length) {
            //             // 默认选中支付方式
            //             // this.payType = value[0].type
            //         }
            //     },
            //     deep: true,
            //     immediate: true,
            // }
        },
        computed: {
            ...mapState('setting', {
                balance_text: state => state.systemSetting?.balance_text || '余额',
            }),
        },
        beforeMount() {
        },
        mounted() {
            this.is_weixin = this.$utils.is_weixin();
        },
        methods: {
            showPayPicker() {
                this.pickerShow = true;
                this.getBalance()
            },
            getBalance() {
                this.$api.memberApi.getUserInfo().then(res => {
                    this.member_balance = res.data.balance
                })
            },
            closePicker(data) {
                this.pickerShow = false;
                if (data) {
                    this.$emit('closePicker')
                }
            },
            chooseType(data) {
                // 选择支付方式
                // this.payType = data.type
                this.$emit('confirmPay', data.type)
            },
            // confirmPay() {
            //     // 确认支付
            //     if (this.payType === '') {
            //         this.$toast('请' + this.title)
            //     } else {
            //         this.$emit('confirmPay', this.payType)
            //     }
            // }
        }
    }
</script>

<style lang="scss" scoped>
    /* picker弹窗  */
    .pay-picker {
        display: flex;
        flex-direction: column;
        .picker-close {
            position: absolute;
            top: px2rpx(12);
            right: px2rpx(12);
            width: px2rpx(24);
            height: px2rpx(24);
            .close-img {
                width: px2rpx(24);
                height: px2rpx(24);
            }
        }
        &.show {
            .inner {
                background: #fff;
                border-radius: 20rpx 20rpx 0 0;
                height: 668rpx;
                padding: 32rpx 0 16rpx 24rpx;
                overflow-y: scroll;
            }
            .rr-cell {
                padding-left: 0;
                height: 100rpx;
                border-bottom: 1px solid $uni-border-color;
                .flex {
                    align-items: center;
                    height: 100rpx;
                }
                .label {
                    display: flex;
                    align-items: center;
                    i {
                        margin-right: 16rpx;
                        font-size: 40rpx;
                        display: flex;
                        align-items: center;
                    }
                    span {
                        font-size: 28rpx;
                        color: $uni-text-color;
                        &.balance {
                            padding-left: 8rpx;
                        }
                    }
                }
            }
            .title {
                text-align: center;
                color: $uni-text-color;
                font-size: 32rpx;
                line-height: 44rpx;
                margin-bottom: 48rpx;
            }
            .radio-box {
                padding-right: 24rpx;
                align-items: center;
                .iconfont-m- {
                    font-size: px2rpx(20);
                    color: $uni-border-color;
                }
                .icon-m-yes {
                    font-size: px2rpx(20);
                    line-height: px2rpx(20);
                    text-align: center;
                    border-radius: 50%;
                    color: $uni-color-primary;
                }
            }
            .icon-m-pay-def-pay {
                color: #ff9900;
            }
            .icon-m-pay-wechatpay {
                color: #00ac1c;
            }
            .icon-m-pay-alipay {
                color: #00a0ee;
            }
            .icon-m-huodaofukuan {
                color: #fbdc0b;
            }
            .pay-btn {
                width: 97%;
                background: linear-gradient(
                    172.93deg,
                    $uni-color-primary 0%,
                    #ff6f29 94.38%
                );
            }
        }
    }
</style>
