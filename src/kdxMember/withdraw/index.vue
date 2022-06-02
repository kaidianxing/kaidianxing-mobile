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
                <p class="title">请输入提现金额</p>
                <div class="money">
                    <span class="label">￥</span>
                    <div class="input-box">
                        <number-input
                            class="digit"
                            placeholder="请输入提现金额"
                            v-model="money"
                            :max="balance"
                            type="number"
                        ></number-input>
                    </div>
                </div>
                <div class="cash">
                    <span class="num">可提现金额：￥{{ balance }}</span>
                    <span class="btn theme-primary-color" @click="allWithdraw">全部提现</span>
                </div>
            </div>
            <div class="radio-group">
                <div class="type" @click="clickItem">
                    <div class="label">提现方式</div>
                    <div class="type-info">
                        <div
                            class="icon iconfont-m-"
                            :class="{
                                'icon-m-pay-wechatpay': payType === 'wechat',
                                'icon-m-zhifubao1': payType === 'alipay',
                            }"
                        ></div>
                        <div class="text">{{ payType|formatPayType }}</div>
                    </div>
                    <div class="icon icon-m-right iconfont-m-"></div>
                </div>
                <p style="height:16rpx;"></p>
                <input-list :list="inputList" @input="getValue"></input-list>
            </div>
            <div class="btn-wrap">
                <btn type="do" classNames="theme-primary-bgcolor" size="middle" @btn-click="sure">确认</btn>
                <subscribe v-if="showSubscribe && subTemplateId.length>0" :templates="subTemplateId"
                           :subStyle="`top:16rpx;left:0;padding:0 24rpx;width:calc(100% - 48rpx);`" @success="success"
                           @error="error"></subscribe>

            </div>
            <!-- 支付弹窗 -->
            <pay-picker
                title="请选择提现方式"
                :hasWeixin="true"
                ref="createOrderPay"
                :payList="list"
                @confirmPay="confirmPay"
            ></pay-picker>
        </div>
        <rr-modal
            :title="modalTips"
            v-model="showModal"
            @handlerOK="handlerOK"
            @handlerCancel="handlerCancel"
        ></rr-modal>
    </page-box>
</template>

<script>
import InputList from '../components/InputList'
import payPicker from '@/components/picker/payPicker'
import NumberInput from '@/components/input/NumberInput'
import PageMixin from '@/common/PageMixin.js'
import Subscribe from '@/components/wechat/Subscribe'

export default {
    mixins: [PageMixin],
    components: {
        InputList,
        payPicker,
        NumberInput,
        Subscribe

    },
    data() {
        return {
            alipay_account: '', // 上次提现支付宝号
            alipay_account_repeat: '', // 上次提现支付宝号(确认)
            realname: '', // 上次提现支付宝名称
            withdraw_fee: '', // 提现手续费
            free_fee_start: '', // 免手续费区间 开始
            free_fee_end: '', // 免手续费区间 结束
            withdraw_limit_money: '', // 最小提现金额
            balance: '0.00', // 余额
            money: '', // 提现金额
            payType: '', // 提现方式
            list: [],
            showModal: false,
            modalTips: '',
            submitFlag: false, // 控制提现按钮， 防止多点
            subTemplateId: [], //公众号订阅模板
            showSubscribe: true, //公众号订阅按钮
        }
    },
    filters: {
        formatPayType(value) {
            console.log(value, 'value>>>>>');
            return value === 'wechat'
                ? '微信钱包'
                : value === 'alipay'
                    ? '支付宝账户'
                    : ''
        },
    },
    watch: {
        balance(value) {
            this.balance = value || '0.00'
        },
    },
    created() {
        // #ifdef H5
        if (this.$utils.is_weixin()) {
            let noticeIds = this.$store.state.setting?.noticeTemId;
            let type_code = ['buyer_pay_withdraw'];
            if (noticeIds && type_code.length) {
                type_code.map((item) => {
                    if (noticeIds[item]) {
                        this.subTemplateId?.push(noticeIds[item])
                    }
                })
            }
        }
        // #endif
    },
    computed: {
        balance_text() {
            return (
                this.$store.state.setting.systemSetting.balance_text || '余额'
            )
        },
        inputList() {
            return this.payType === 'alipay' ? [
                    {
                        label: '姓名',
                        content: this.realname || '',
                        placeholder: '请输入姓名',
                    },
                    {
                        label: '支付宝账号',
                        content: this.alipay_account || '',
                        placeholder: '请输入支付宝账号',
                    },
                    {
                        label: '确认账号',
                        content: this.alipay_account_repeat || '',
                        placeholder: '再次输入支付宝账号',
                    },
                ]
                : []
        },
    },
    mounted() {
        uni.setNavigationBarTitle({
            title: this.balance_text + '提现',
        })
        this.withDrawInfo()
    },
    methods: {
        // 提现申请初始化
        withDrawInfo() {
            this.$api.memberApi.withDrawInfo().then((res) => {
                if (res.error == 0) {
                    this.balance = res.data.balance
                    this.withdraw_limit_money = res.data.withdraw_limit_money
                    // 手续费相关
                    this.withdraw_fee = res.data.withdraw_fee / 100
                    this.free_fee_start = res.data.free_fee_start
                    this.free_fee_end = res.data.free_fee_end
                    // 支付宝提现相关
                    this.alipay_account = res.data.alipay_account
                    this.realname = res.data.realname
                    if (this.alipay_account) {
                        this.alipay_account_repeat = this.alipay_account
                    }

                    let ways = res.data.withdraw_type.map((item) => {
                        let type = item === '20' ? 'wechat' : 'alipay'
                        let withdrawText =
                            item === '20' ? '微信钱包' : '支付宝账户'
                        return {
                            type: type,
                            withdraw: true,
                            withdrawText: withdrawText,
                        }
                    })
                    this.list = ways.filter((item) => item.type);
                    // 只有一种提现方式默认选中  多种不默认选中
                    this.payType = this.list?.length == 1 ? this.list?.[0]?.type : '';
                } else {
                    this.$toast(res.message)
                }
            })
        },
        allWithdraw() {
            // 延时解决不同步问题
            setTimeout(() => {
                this.money = this.balance
            }, 300)
        },
        // 确认提现
        sure() {
            if (!parseFloat(this.money)) {
                this.$toast('请输入提现金额')
                return
            }
            if (parseFloat(this.money) > parseFloat(this.balance)) {
                this.$toast('账户余额不足')
                return
            }
            if (
                parseFloat(this.money) < parseFloat(this.withdraw_limit_money)
            ) {
                this.$toast(`最低提现${this.withdraw_limit_money}元`)
                return
            }
            if (!this.payType) {
                this.$toast('请选择提现方式')
                return
            }
            if (this.payType === 'alipay') {
                if (!this.realname) {
                    this.$toast('请输入姓名')
                    return
                }
                if (!this.alipay_account) {
                    this.$toast('请输入支付宝账号')
                    return
                }
                if (!this.alipay_account_repeat) {
                    this.$toast('请确认支付宝账号')
                    return
                }
                let reg = /^(?:\w+\.?)*\w+@(?:\w+\.)+\w+|[1][3,4,5,6,7,8,9][0-9]{9}$/
                if (!reg.test(this.alipay_account)) {
                    this.$toast('请输入正确的支付宝账号')
                    return
                }
            }
            if (this.withdraw_fee) {
                let _showModal = false
                if (this.free_fee_end || this.free_fee_start) {
                    // 有提现免手续费区间
                    if (
                        parseFloat(this.money) >
                        parseFloat(this.free_fee_end) ||
                        parseFloat(this.money) < parseFloat(this.free_fee_start)
                    ) {
                        _showModal = true
                    } else {
                        _showModal = false
                        this.submitWithdraw()
                    }
                } else {
                    _showModal = true
                }
                if (!_showModal) {
                    return
                }
                let _payType =
                    this.payType === 'wechat' ? '微信钱包' : '支付宝账户'
                let _withdraw_fee = (this.money * this.withdraw_fee).toFixed(2)
                let _money = (this.money - _withdraw_fee).toFixed(2)
                this.modalTips = `确认要提现到${_payType}?扣除手续费${_withdraw_fee}元,实际到账金额${_money}元`
                // 显示提示弹窗
                this.showModal = true
            } else {
                this.submitWithdraw()
            }
        },
        handlerOK() {
            this.showModal = false
            // this.money =
            //     parseFloat(this.money) -
            //     (this.money * this.withdraw_fee).toFixed(2)
            this.submitWithdraw()
        },
        handlerCancel() {
            this.showModal = false
        },
        submitWithdraw() {
            if (this.submitFlag) {
                return
            }
            this.submitFlag = true
            // #ifndef H5
            let type_code = ['buyer_pay_withdraw'];
            this.$utils.sendWxappMsg(type_code, this.handleSubmit)
            // #endif
            // #ifdef H5 || APP-PLUS
            this.handleSubmit()
            // #endif
        },
        handleSubmit() {
            let _param = {
                money: this.money,
                pay_type: this.payType === 'wechat' ? '20' : '30',
            }
            if (this.payType === 'alipay') {
                _param = {
                    ..._param,
                    realname: this.realname,
                    alipay_account: this.alipay_account,
                    alipay_account_repeat: this.alipay_account_repeat,
                }
            }
            this.$api.memberApi.submitWithdraw(_param).then((res) => {
                if (res.error == 0) {
                    this.$toast('提现成功')
                    // 返回上一页
                    setTimeout(() => {
                        this.submitFlag = false
                        this.$Router.back(1)
                    }, 1500)
                } else {
                    this.submitFlag = false
                    this.$toast(res.message)
                }
            })
        },
        getValue(data) {
            if (data.index === 0) {
                this.realname = data.value
            } else if (data.index === 1) {
                this.alipay_account = data.value
            } else if (data.index === 2) {
                this.alipay_account_repeat = data.value
            }
        },
        clickItem() {
            if (this.list.length === 0) {
                this.$toast('没有可用提现方式')
                return
            }
            if (this.list.length === 1) {
                return
            }
            this.$refs.createOrderPay.showPayPicker()
        },
        // 选择支付方式
        confirmPay(payType) {
            this.payType = payType
            this.$refs.createOrderPay.closePicker()
        },
        sendMsg() {
            this.$api.othersApi
                .getNoticeTemId({type_code: ['buyer_pay_withdraw']})
                .then((res) => {
                    if (res.error == 0) {
                        wx.requestSubscribeMessage({
                            tmplIds: res.data,
                            success(res) {
                                console.log(res)
                            },
                            fail(rej) {
                                console.log(rej)
                            },
                            complete: (res) => {
                                this.handleSubmit()
                            },
                        })
                    } else {
                        this.$toast(res.message)
                    }
                })
        },
        // 公众号订阅消息事件
        success() {
            this.showSubscribe = false;
            this.sure()
        },
        error() {
            this.showSubscribe = false;
            this.sure()
        }
    },
}
</script>

<style lang="scss" scoped>
.btn-wrap {
    position: relative;
    margin-top: px2rpx(16);
    padding: 0 24rpx;
}

.recharge-index {
    width: 100%;
    height: 100%;

    .input {
        min-height: px2rpx(112);
        background: #fff;
        border-radius: px2rpx(6);
        display: flex;
        flex-direction: column;
        margin: px2rpx(8) px2rpx(12);
        padding: px2rpx(16) px2rpx(12) 0;

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
                    // height: 100%;
                    color: #212121;
                }
            }
        }

        .cash {
            width: 100%;
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            color: #969696;
            padding: px2rpx(8) 0;
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;

        }
    }

    .radio-group {
        width: 100%;
        padding: 0 px2rpx(12);

        .type {
            border-radius: px2rpx(6);
            width: 100%;
            min-height: px2rpx(48);
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            padding: px2rpx(8) px2rpx(12);
            background: #fff;

            .label {
                font-size: px2rpx(14);
                line-height: px2rpx(14);
                color: #212121;
                width: px2rpx(84);
            }

            .type-info {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: flex-end;

                .icon {
                    line-height: 24rpx;
                    height: 24rpx;
                    margin-right: 12rpx;
                    padding-top: 4rpx;

                    &.icon-m-pay-wechatpay {
                        color: #00ac1c;
                    }

                    &.icon-m-zhifubao1 {
                        color: #00a0ee;
                    }
                }

                .text {
                    font-weight: 500;
                    font-size: 24rpx;
                    line-height: 34rpx;
                    color: #212121;
                }
            }

            .icon-m-right {
                width: px2rpx(18);
                height: px2rpx(18);
                font-size: px2rpx(18);
                line-height: px2rpx(18);
                text-align: center;
                padding-top: px2rpx(2);
            }
        }
    }

    .submit {
        width: px2rpx(351);
        height: px2rpx(40);
        background: linear-gradient(172.93deg, #ff3c29 0%, #ff6f29 94.38%);
        border-radius: px2rpx(40);
        font-size: px2rpx(14);
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: px2rpx(16) auto 0;
        color: #fff;
    }
}
</style>
