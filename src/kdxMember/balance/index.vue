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
        <div class="balance-index">
            <div class="balance">
                <div class="icon iconfont-m- icon-m-pay-def-pay"></div>
                <p class="title">账户{{ userInfo.textmoney }}（元）</p>
                <p class="money">
                    {{ userInfo.money || "0.00" }}
                </p>
            </div>
            <div class="btns" v-if="withdrawShow || rechargeShow">
                <div class="cash btn" @click="getCash" v-if="withdrawShow">提现</div>
                <div class="recharge btn" @click="goRechage" v-if="rechargeShow">
                    充值
                </div>
            </div>
            <simple-picker
                    :label-width="600"
                    :info="list"
                    @click="clickItem"
            ></simple-picker>
        </div>
    </page-box>
</template>

<script>
import settings from "@/static/settings.js";
import SimplePicker from "../components/SimplePicker";
import PageMixin from "@/common/PageMixin.js";

export default {
    mixins: [PageMixin],
    components: {
        SimplePicker,
    },
    data() {
        return {
            userInfo: {},
            list: [],
        };
    },
    computed: {
        balance_text() {
            return this.$store.state.setting.systemSetting.balance_text || "余额";
        },
        // 提现是否显示
        withdrawShow() {
            let withdraw_state =
                    this.$store.state.setting.systemSetting.withdraw_state || "";

            // #ifdef MP-WEIXIN
            // 微信小程序上传时没有 充值提现 时不显示
            return settings?.config?.with_recharge === true && withdraw_state !== "0";
            // #endif
            // #ifndef MP-WEIXIN
            return withdraw_state !== "0";
            // #endif
        },
        // 充值是否显示
        rechargeShow() {
            let recharge_state =
                    this.$store.state.setting.systemSetting.recharge_state;
            // #ifdef MP-WEIXIN
            // 微信小程序上传时没有 充值提现 时不显示
            return settings?.config?.with_recharge === true && recharge_state !== "0";
            // #endif
            // #ifndef MP-WEIXIN
            return recharge_state !== "0";
            // #endif
        },
    },
    watch: {
        // recharge_state: {
        //     handler(value) {
        //         if (value === '1') {
        //             this.list.push({
        //                 label: `${this.balance_text}明细`,
        //                 path: '/kdxMember/detail/index',
        //                 query: {
        //                     page: 'balance',
        //                 },
        //                 content: '',
        //                 type: 'nav', //nav：路由跳转，''：无功能
        //             })
        //         }
        //     },
        //     immediate: true,
        // },
        withdrawShow: {
            handler(value) {
                if (value === true) {
                    this.list.push({
                        label: "提现记录",
                        content: "",
                        path: "/kdxMember/record/index",
                        query: {
                            page: "",
                        },
                        type: "nav", //nav：路由跳转，''无功能
                    });
                }
            },
            immediate: true,
        },
    },
    mounted() {
        this.list.push({
            label: `${this.balance_text}明细`,
            path: "/kdxMember/detail/index",
            query: {
                page: "balance",
            },
            content: "",
            type: "nav", //nav：路由跳转，''：无功能
        });
        uni.setNavigationBarTitle({
            title: this.balance_text + "明细",
        });
    },
    onShow() {
        this.getUserInfo();
    },
    methods: {
        getUserInfo() {
            this.$api.memberApi.getUserInfo().then((res) => {
                if (res.error == 0) {
                    let data = res.data;
                    this.userInfo = {
                        textmoney: this.balance_text || "余额",
                        money: data.balance,
                        credit: data.credit,
                    };
                }
            });
        },
        getCash() {
            //提现
            if (!this.withdrawShow) {
                this.$toast("提现关闭");
                return;
            }
            this.$Router.auto({
                path: "/kdxMember/withdraw/index",
            });
        },
        goRechage() {
            //充值
            if (!this.rechargeShow) {
                this.$toast("充值关闭");
                return;
            }
            this.$Router.auto({
                path: "/kdxMember/recharge/index",
            });
        },
        clickItem(item) {
            this.$Router.auto({
                path: item.path,
                query: item?.query || {},
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.balance-index {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .balance {
        height: px2rpx(124);
        border-radius: px2rpx(6);
        background: #367bf5;
        margin: px2rpx(8) px2rpx(12);
        padding: px2rpx(16) px2rpx(12);
        color: #fff;
        position: relative;
        overflow: hidden;

        .icon {
            position: absolute;
            right: -80rpx;
            top: -68rpx;
            color: rgba(255, 255, 255, 0.2);
            font-size: 280rpx;
            transform: rotate(-33.75deg);
        }

        .title {
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            margin-bottom: px2rpx(8);
        }

        .money {
            font-size: px2rpx(48);
            line-height: px2rpx(67);
        }
    }

    .btns {
        display: flex;
        flex-wrap: nowrap;
        padding: 0 px2rpx(12);
        margin-bottom: px2rpx(8);

        .btn {
            flex: 1;
            height: px2rpx(36);
            font-size: px2rpx(14);
            line-height: px2rpx(14);
            flex-shrink: 0;
            text-align: center;
            border-radius: px2rpx(6);
            background: #565656;
            padding: px2rpx(11);
            color: #fff;

            &:nth-child(2) {
                margin-left: px2rpx(10);
            }
        }

        .recharge {
            background: #ff3c29;
        }
    }
}
</style>
