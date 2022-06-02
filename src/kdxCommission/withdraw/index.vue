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
                <p class="title">请输入{{params.withdraw}}金额</p>
                <div class="money">
                    <span class="label">￥</span>
                    <input type="digit" v-model="withdrawInfo.balance" @input="changeNum" />
                </div>
                <div class="cash">
                    <span class="num">可{{params.withdraw}}金额：￥{{can_withdraw}}</span>
                    <span class="num" v-if="ladder_commission > 0">(含阶梯{{params.commission}}￥{{ladder_commission}})</span>
                    <span class="btn" @click="withdraw(can_withdraw)">全部{{params.withdraw}}</span>
                </div>
            </div>
            <div class="radio-group">
                <div class="my-picker">
                    <div class="_li" @click="clickItem">
                        <p class="label" :style="{width:`168rpx`}">提现方式</p>
                        <div class="content">
                            <p>
                                <i :class="payInfo.icon" :style="{color: payInfo.color}"></i>
                                {{payInfo.content||''}}
                            </p>
                        </div>
                        <i class="icon-m-right iconfont-m-"></i>
                    </div>
                </div>
                <input-list v-if="payInfo.content == '支付宝'" :list="inputList" @input="handleInput"></input-list>
            </div>
            <!--<div class="submit" @click="submit">{{params.withdraw}}</div>-->
            <!-- 支付弹窗 -->
            <pay-picker
                :hasWeixin="true"
                :title="`选择${params.withdraw}方式`"
                ref="createOrderPay"
                :payList="payList"
                @confirmPay="confirmPay"></pay-picker>
        </div>
        <template slot="foot">
            <view class="collectionBorder">
                <!--                <div class="submit" @click="submit">{{params.withdraw}}</div>-->

                <btn type="do" size="middle"  @btn-click="submit">{{params.withdraw}}</btn>
                <subscribe v-if="showSubscribe && subTemplateId.length>0" :templates="subTemplateId" :subStyle="`top:16rpx;left:0;padding:0 24rpx;width:calc(100% - 48rpx);`" @success="success" @error="error"></subscribe>
            </view>
        </template>
    </page-box>
</template>

<script>
    import InputList from '../components/InputList'
    import payPicker from '@/components/picker/payPicker'
    import PageMixin from '@/common/PageMixin.js'
    import Subscribe from '@/components/wechat/Subscribe'

    export default {
        mixins: [PageMixin],
        components: {
            InputList,
            payPicker,
            Subscribe
        },
        data() {
            let balance_text = this.$store.state.setting.systemSetting.balance_text || '余额'
            return {
                balance_text: '',
                withdrawInfo: {
                    balance: ''
                },
                ladder_commission:'',// 含阶梯佣金
                withdraw_limit: '', // 最低提现金额
                can_withdraw: 0, // 可提现佣金
                payInfo: {}, // 提现方式
                payList: [],
                inputList: [
                    {
                        label: '姓名',
                        content: '',
                        placeholder: '请输入姓名'
                    },
                    {
                        label: '支付宝账号',
                        content: '',
                        placeholder: '请输入支付宝账号'
                    },
                    {
                        label: '确认账号',
                        content: '',
                        placeholder: '再次输入支付宝账号'
                    }
                ],
                payTypes: {
                    balance: {
                        content: balance_text || '余额',
                        color: '#FF9900',
                        id: 1,
                        icon: 'icon-m-pay-def-pay iconfont-m-',
                        type: 10
                    },
                    wechat: {
                        content: '微信',
                        color: '#00AC1C',
                        id: 2,
                        icon: 'iconfont-m- icon-m-pay-wechatpay',
                        type: 20
                    },
                    alipay: {
                        content: '支付宝',
                        color: '#00A0EE',
                        id: 3,
                        icon: 'icon-m-zhifubao1 iconfont-m-',
                        type: 30
                    }
                },
                subTemplateId: [], //公众号订阅模板
                showSubscribe: true, //公众号订阅按钮
            }
        },
        computed: {
            params() {
                return this.$store.state.commissionSet.commissionSetting
            }
        },
        created() {
            // #ifdef H5
            if(this.$utils.is_weixin()) {
                let noticeIds = this.$store.state.setting?.noticeTemId;
                let type_code = ['commission_buyer_commission_pay', 'commission_buyer_withdraw_apply_fail', 'commission_buyer_child_pay'];
                if(noticeIds && type_code.length) {
                    type_code.map((item)=> {
                        if(noticeIds[item]) {
                            this.subTemplateId?.push(noticeIds[item])
                        }
                    })
                }
            }
            // #endif
        },
        methods: {
            clickItem(idx) {
                if (this.payList.length === 1) {
                    return
                }
                this.$refs.createOrderPay.showPayPicker()
            },
            // 输入金额
            changeNum(ev) {
                if (Number(ev.target.value) === +Number(ev.target.value)) {
                    if (+ev.target.value > +this.can_withdraw) {
                        ev.target.value = this.can_withdraw
                        this.withdrawInfo.balance = this.can_withdraw
                        return false
                    }
                    let value = ev.target.value
                    let _value_ = value.split('.')
                    let _value = _value_[1]
                    if (_value) {
                        _value = _value.slice(0, 2)
                    }
                    _value = _value ? _value : ''
                    let value__ =
                        _value_[0] + (value.includes('.') ? '.' : '') + _value
                    ev.target.value = value__
                    this.withdrawInfo.balance = value__
                } else {
                    if (
                        parseFloat(ev.target.value) === +parseFloat(ev.target.value)
                    ) {
                        ev.target.value = parseFloat(ev.target.value)
                        this.withdrawInfo.balance = parseFloat(ev.target.value)
                    } else {
                        ev.target.value = ''
                        this.withdrawInfo.balance = ''
                    }
                }
            },

            submit() {
                if (!this.withdrawInfo.balance || this.withdrawInfo.balance <= 0) {
                    return
                }
                if (this.withdrawInfo.balance < this.withdraw_limit) {
                    this.$toast('未达到最低提现额度')
                    return
                }
                // 如果是支付宝
                if (this.payInfo.content == '支付宝') {
                    if (!this.inputList[0].content) {
                        this.$toast('请填写姓名')
                        return
                    }
                    if (!this.inputList[1].content) {
                        this.$toast('请填写支付宝账号')
                        return
                    }
                    if (!this.inputList[2].content) {
                        this.$toast('请再次填写支付宝账号')
                        return
                    }
                    if (this.inputList[2].content != this.inputList[1].content) {
                        this.$toast('两次账号填写不一致')
                        return
                    }
                }
                let obj = {
                    type: this.payInfo.type,
                    price: this.withdrawInfo.balance,
                    realname: this.inputList[0].content || '',
                    alipay: this.inputList[1].content || ''
                }
                this.$api.commissionApi.submitWithdraw(obj).then(res => {
                    if (res.error == 0) {
                        this.$toast('提现申请成功')
                        setTimeout(() => {
                            // this.$Router.back(0)
                            this.$Router.back(1)
                        }, 1000)
                    } else {
                        this.$toast(res.message)
                    }
                })
            },
            withdraw(val) {
                this.withdrawInfo.balance = val
            },
            // 支付弹窗中的确认支付
            confirmPay(payType) {
                this.payInfo = this.payTypes[payType]
                this.$refs.createOrderPay.closePicker()
            },
            handleInput(data) {
                this.inputList[data.index].content = data.value
            },
            // 公众号订阅消息事件
            success() {
                this.showSubscribe = false;
                this.submit()
            },
            error() {
                this.showSubscribe = false;
                this.submit()
            },
        },
        beforeMount() {
            this.balance_text = this.$store.state.setting.systemSetting.balance_text || '余额'
            this.$api.commissionApi.getApplyWithdraw().then(res => {
                if (res.error == 0) {
                    let obj ={
                        '10': 'balance',
                        '20': 'wechat',
                        '30': 'alipay'
                    };
                    this.payList = res.data.type_list.map(item => {
                        return {
                            type_num: item.type,
                            name: item.name,
                            type: obj[item.type]
                        }
                    });
                    // 只有一种提现方式默认选中  多种不默认选中
                    this.payInfo = this.payList?.length==1?this.payTypes[this.payList?.[0]?.type]:{};
                    this.can_withdraw = res.data.can_withdraw_commission;
                    this.ladder_commission = res.data.ladder_commission
                    this.withdraw_limit = res.data.withdraw_limit
                }
            })
        }
    }
</script>

<style lang="scss" scoped>
.recharge-index {
    width: 100%;
    height: 100%;
    .input {
        width: px2rpx(351);
        min-height: px2rpx(112);
        background: #fff;
        border-radius: px2rpx(6);
        display: flex;
        flex-direction: column;
        margin: px2rpx(8) auto;
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
            input {
                width: 0;
                height: 100%;
                line-height: 1;
                flex: 1;
                font-size: px2rpx(36);
                color: #212121;
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
            .btn {
                color: #ff3c29;
            }
        }
    }
    .radio-group {
        width: 100%;
        padding: 0 px2rpx(12);
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
    .my-picker {
        width: px2rpx(351);
        margin: auto auto 16rpx;
        border-radius: px2rpx(6);
        padding-left: px2rpx(12);
        box-sizing: border-box;
        background: #fff;
        ._li {
            width: 100%;
            height: px2rpx(48);
            line-height: px2rpx(48);
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
        }
        &.list ._li {
            border-bottom: 1rpx solid #e6e7eb;
            &:last-child {
                border: none;
            }
        }
        .label {
            font-size: px2rpx(14);
            color: $uni-text-color;
        }
        .icon-m-right {
            margin: 0 24rpx 0 8rpx;
            font-size: px2rpx(12);
            line-height: px2rpx(12);
            color: #212121;
        }
        .label {
            width: px2rpx(84);
        }
        .content {
            width: 0;
            flex: 1;
            p {
                display: flex;
                font-size: px2rpx(14);
                justify-content: flex-end;
                align-items: center;
                i {
                    margin-top: 4rpx;
                    font-size: 40rpx;
                    margin-right: 4rpx;
                }
            }
        }
        .icon-m-right {
            width: px2rpx(16);
            height: px2rpx(16);
            font-size: px2rpx(16);
            line-height: px2rpx(16);
            text-align: center;
        }
    }
    /deep/ .input-list ._li .label {
        font-size: 28rpx;
    }
    /deep/ .input-list ._li .input {
        color: $uni-text-color;
        font-size: 28rpx;
    }
}
.collectionBorder {
    border-top: 1px solid #E6E7EB;
    padding: px2rpx(7) px2rpx(12);
    background: #fff;
    position: relative;
}
</style>
