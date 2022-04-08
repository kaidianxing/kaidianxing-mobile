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
        <div class="recharge-index">
            <div class="input">
                <p class="title">请输入充值金额</p>
                <div class="money">
                    <span class="label">￥</span>
                    <div class="input-box">
                        <number-input
                            class="digit"
                            :placeholder="`最低充值${recharge_money_low}元`"
                            v-model="balance"
                            type="number"
                        ></number-input>
                    </div>
                </div>
            </div>
            <!--  #ifndef MP-TOUTIAO -->
            <div class="radio-group">
                <my-radio-group style="margin-bottom:16rpx;" :list="list" @change="changeRadio"></my-radio-group>
            </div>
            <!-- #endif -->
            <div class="reward-box" v-if="isShowActivity ">
                <div class="reward-title">
                    <div class="name">充值奖励</div>
                </div>
                <div v-for="(child, index) in rechargeReward.rules.award" :key="index" class="levelCont">
                    <div class="desc">
                        {{ rechargeReward.type === '0' ? '累计' : '单次' }}充值满
                        <span class="theme-primary-color">{{ child.money }}元</span> 享受以下奖励
                    </div>
                    <div class="reward-content">
                        <ul
                            class="coupon-list"
                            v-if="
                                    getReward(child,'1') &&
                                        child.coupon_info.length > 0
                                "
                        >
                            <li
                                class="item"
                                v-for="(item, index) in child.coupon_info"
                                :key="index"
                            >
                                <div class="coupon-bg">
                                    <img
                                        :src="
                                                $utils.staticMediaUrl('ticket/coupon-bg.png')
                                            "
                                        alt
                                    />
                                </div>
                                <div class="item-left">
                                    <span class="unit theme-primary-color" v-if="item.coupon_sale_type === '1'">￥</span>
                                    <span class="price theme-primary-color">{{ parseFloat(item.discount_price) }}</span>
                                    <span class="unit theme-primary-color" v-if="item.coupon_sale_type === '2'">折</span>
                                </div>
                                <div class="item-right">
                                    <div class="tit">{{ item.coupon_name }}</div>
                                    <div class="desc">{{ item.content }}</div>
                                </div>
                            </li>
                        </ul>
                        <div class="other" v-if="getReward(child,'2')">
                            <div class="item">
                                <div class="coupon-bg">
                                    <img
                                        :src="
                                                $utils.staticMediaUrl('ticket/coupon-bg.png')
                                            "
                                        alt
                                    />
                                </div>
                                <div class="item-left">
                                    <span class="price theme-primary-color">{{ child.credit }}</span>
                                    <span class="unit theme-primary-color">{{ credit_text }}</span>
                                </div>
                                <div class="item-right">
                                    <div class="tit">充值奖励{{ credit_text }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="other" v-if="getReward(child,'3')">
                            <div class="item">
                                <div class="coupon-bg">
                                    <img
                                        :src="
                                                $utils.staticMediaUrl('ticket/coupon-bg.png')
                                            "
                                        alt
                                    />
                                </div>
                                <div class="item-left">
                                    <span class="unit  theme-primary-color">￥</span>
                                    <span class="price theme-primary-color">{{ parseFloat(child.balance) }}</span>
                                </div>
                                <div class="item-right">
                                    <div class="tit">充值奖励金额</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <template v-slot:foot>
            <btn styles="border-radius:0!important;" classNames="theme-primary-bgcolor" type="do" size="middle" @btn-click="recharge">充值</btn>
        </template>
    </page-box>
</template>

<script>
import MyRadioGroup from "../components/RadioGroup";
import NumberInput from "@/components/input/NumberInput";
import { requestPayment, wapWechatPay, wapAliPay } from "@/common/payment";
import PageMixin from '@/common/PageMixin.js'
import { config } from '@/static/settings'
export default {
    mixins: [PageMixin],
    components: {
        MyRadioGroup,
        NumberInput,
    },
    data() {
        let balance_text =
            this.$store.state.setting.systemSetting.balance_text || "余额";
        return {
            pageId: "",
            balance: "",
            payType: "",
            recharge_money_low: 1,
            info: [
                {
                    label: balance_text + "明细",
                    content: "123",
                    type: "nav", //nav：路由跳转，''：无功能
                },
            ],
            list: [],
            inputList: [
                {
                    label: "姓名",
                    content: "",
                    placeholder: "请输入姓名",
                },
                {
                    label: "支付宝账号",
                    content: "",
                    placeholder: "请输入支付宝账号",
                },
                {
                    label: "确认账号",
                    content: "",
                    placeholder: "再次输入支付宝账号",
                },
            ],
            rechargeReward: {
                type: "", // 活动类型
                money: "", // 满多少钱
                coupon_info: [], // 奖励优惠券
                credit: "", // 奖励积分
                balance: "", // 奖励余额
                rules: {}, // 奖励内容
            },
            award: [],
            timer: null,
            isShowActivity: false, //是否有充值奖励活动
        };
    },
    computed: {
        is_weixin() {
            return this.$utils.is_weixin()
        },
        credit_text() {
            return (
                this.$store.state.setting.systemSetting.credit_text || "积分"
            );
        },
        balance_text() {
            return (
                this.$store.state.setting.systemSetting.balance_text || "余额"
            );
        },
        return_url() {
            let url = ''
            if (this.is_weixin) {
                url = `${config.wap_url}/kdxOthers/paySuccess`
            } else {
                url = `${config.wap_url}/kdxMember/balance/index`
            }
            return url
        },
    },
    watch: {
        recharge_money_low(value) {
            this.recharge_money_low = value || "0.1";
        },
    },
    mounted() {
        uni.setNavigationBarTitle({
            title: this.balance_text + "充值",
        });
        this.rechargeWays();
        this.getRechargeRewardActivity();
    },
    methods: {
        // 获取充值奖励活动
        getRechargeRewardActivity() {
            this.$api.memberApi
                .getRechargeRewardActivity(
                    {},
                    {
                        errorToast: false,
                    }
                )
                .then((res) => {
                    if (res.error === 0) {
                        this.isShowActivity = true;
                        if (res.data) {
                            this.rechargeReward = {
                                ...this.rechargeReward,
                                ...res.data,
                            };
                        }
                    }else if(res.error === 390200) {
                        this.isShowActivity = false;
                    }
                });
        },
        // 充值初始化
        rechargeWays() {
            this.$api.memberApi
                .rechargeWays()
                .then((res) => {
                    if (res.error == 0) {
                        this.recharge_money_low = res.data.recharge_money_low;
                        res.data.pay_list = res.data.pay_list || [];
                        let ways = res.data.pay_list.map((item) => {
                            let preIcon =
                                item === "wechat"
                                    ? "icon-m-pay-wechatpay iconfont-m-"
                                    : "icon-m-zhifubao1 iconfont-m-";
                            let content =
                                item === "wechat" ? "微信支付" : "支付宝支付";
                            let iconColor =
                                item === "wechat" ? "#00AC1C" : "#00A0EE";
                            return {
                                preIcon: preIcon,
                                content: content,
                                iconColor: iconColor,
                                id: item,
                                label: "nav", //nav：路由跳转，''：无功能
                            };
                        });
                        // #ifdef H5
                        if (!this.$utils.is_weixin()) {
                            ways = ways.filter((item) => item.id == "alipay");
                        }
                        // #endif
                        this.list = ways;
                        this.payType = ways.length > 0 ? ways[0].id : "";
                    }
                })
        },
        changeRadio(index) {
            this.payType = this.list[index].id;
        },
        recharge() {
            if (+this.balance >= +this.recharge_money_low) {
                // #ifdef MP-WEIXIN
                this.sendMsg();
                // #endif
                // #ifdef H5 || MP-TOUTIAO
                this.handlerRecharge();
                // #endif
            } else {
                this.$toast(`最低充值${this.recharge_money_low}元`);
            }
        },
        handlerRecharge() {
            let params = {}
            // #ifdef H5
            params['return_url'] = this.return_url
            // #endif
            this.$api.memberApi
                .rechargeSubmit({
                    pay_type: this.payType,
                    money: this.balance,
                    ...params,
                })
                .then(async (res) => {
                    if (res.error === 0) {
                        this.orderId = res.order_id;
                        if (this.payType == "alipay") {
                            // #ifdef H5
                            wapAliPay({
                                url: res.result.data,
                                order_id: res.order_id,
                                pageFrom: "recharge",
                            });
                            // #endif
                        } else if (this.payType == "wechat") {
                            let payStatus = "";
                            // #ifdef MP-WEIXIN || MP-TOUTIAO
                            payStatus = await requestPayment({
                                provider: this.payType,
                                ...res.result.data,
                            });
                            // #endif
                            // #ifdef H5
                            payStatus = await wapWechatPay({
                                ...res.result.data,
                            });
                            // #endif
                            if (payStatus === "ok") {
                                this.timer =  setTimeout(() => {
                                    this.checkPayStatus();
                                }, 1000);
                            }
                        } else if (this.payType == 'byte_dance') {
                            // #ifdef MP-TOUTIAO
                            let payStatus = '';
                            payStatus = await requestPayment({
                                provider: this.payType,
                                orderInfo: res.result.data,
                            });
                            if (payStatus === "ok") {
                                this.timer =  setTimeout(() => {
                                    this.checkPayStatus();
                                }, 1000);
                            }
                            // #endif
                        }
                    } else {
                        this.$toast("支付失败");
                    }
                });
        },
        sendMsg() {
            this.$api.othersApi
                .getNoticeTemId({
                    type_code: ["buyer_pay_recharge"],
                })
                .then((res) => {
                    if (res.error == 0) {
                        wx.requestSubscribeMessage({
                            tmplIds: res.data,
                            success(res) {
                                console.log(res);
                            },
                            fail(rej) {
                                console.log(rej);
                            },
                            complete: (res) => {
                                this.handlerRecharge();
                            },
                        });
                    } else {
                        this.$toast(res.message);
                    }
                });
        },
        // 检查支付状态
        checkPayStatus() {
            let obj = {
                id: this.orderId,
            };
            this.$api.memberApi.checkFinancePayStatus(obj).then((res) => {
                if (res.error == 0) {
                    uni.hideLoading();
                    uni.showToast({
                        title: "支付成功",
                    });
                    this.timer =  setTimeout(() => {
                        this.$Router.back(1);
                    }, 1000);
                } else {
                    this.timer =  setTimeout(() => {
                        this.checkPayStatus();
                    }, 2000);
                }
            });
        },
        // 判断奖励项
        getReward(child, item) {
            return new Set(child.reward).has(item)
        }
    },
    beforeDestroy(){
        clearTimeout(this.timer)
    }
};
</script>

<style lang="scss" scoped>
.recharge-index {
    width: 100%;
    min-height: 100vh;
    box-sizing: border-box;
    padding-top: px2rpx(8);
    display: flex;
    flex-direction: column;
    .input {
        background: #fff;
        border-radius: px2rpx(6);
        display: flex;
        flex-direction: column;
        margin: px2rpx(8) px2rpx(12);
        margin-top: 0;
        padding: px2rpx(16) px2rpx(12);
        .title {
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            color: #969696;
            margin-bottom: px2rpx(12);
        }
        .money {
            width: 100%;
            height: px2rpx(50);
            display: flex;
            flex-wrap: nowrap;
            border-bottom: 1rpx solid #e6e7eb;
            .label {
                width: px2rpx(36);
                height: 100%;
                font-size: px2rpx(36);
                text-align: center;
                line-height: px2rpx(36);
                padding: px2rpx(7) 0;
                color: #212121;
                flex-shrink: 0;
            }
            .input-box {
                width: 0;
                flex: 1;
                /deep/ input {
                    font-size: px2rpx(36);
                    line-height: px2rpx(36);
                    height: 100%;
                    color: #212121;
                }
            }
        }

    }
    .radio-group {
        width: 100%;
        padding: 0 px2rpx(12);
    }
    .reward-box {
        flex: 1;
        background-color: #fff;
        margin-left: 24rpx;
        margin-right: 24rpx;
        border-radius: 12rpx;
        padding: 0 24rpx 112rpx;
        overflow-y: auto;
        z-index: 1;
        &::-webkit-scrollbar {
            display: none;
        }
        .reward-title {
            padding-top: 16rpx;
            .name {
                font-weight: 500;
                font-size: 28rpx;
                line-height: 48rpx;
                color: #212121;
                padding-right: 20rpx;
            }
        }
        .levelCont {
            margin: 8px 0 16px;
        }
        .desc {
            font-size: 24rpx;
            line-height: 34rpx;
            color: #969696;
            display: flex;
            span {
                font-weight: bold;
                padding-left: 8rpx;
                padding-right: 8rpx;
            }
        }
        .reward-content {
            .item {
                position: relative;
                height: 136rpx;
                border-radius: 8rpx;
                display: flex;
                overflow: hidden;
                margin-top: 16rpx;
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
                    width: 200rpx;
                    flex-shrink: 0;
                    .unit {
                        font-size: 24rpx;
                        line-height: 136rpx;
                        transform: translateY(6rpx);
                    }
                    .price {
                        padding-left: 8rpx;
                        padding-right: 8rpx;
                        font-weight: bold;
                        font-size: 48rpx;
                        line-height: 136rpx;
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
    }
}

</style>
