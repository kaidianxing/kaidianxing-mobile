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
    <view class="order-pay">
        <!-- 支付弹窗 -->
        <pay-picker ref="createOrderPay" :payList="payList" @confirmPay="confirmPay" @closePicker="closePicker"></pay-picker>

        <!-- 货到付款弹窗 -->
        <rr-modal v-model="showDelivery" title="确定货到付款？" @handlerOK="delivery" @handlerCancel="cancelDelivery"></rr-modal>
        <!-- 余额支付不足弹窗 -->
        <rr-modal v-model="showRecharge"
                  :showOkBtn="showOkBtn"
                  title="提示"
                  :subtitle="`对不起，您的${balance_text}不足请立即进行充值`"
                  cancelText="取消支付"
                  okText="立即充值"
                  @handlerOK="recharge"
                  @handlerCancel="cancelRecharge">
        </rr-modal>
        <!-- 余额支付确认弹窗 -->
        <rr-modal v-model="showBalance" :title="`确定用${balance_text}支付吗？`" @handlerOK="balancePay" @handlerCancel="cancelBalance"></rr-modal>

        <!-- 放弃支付弹窗 -->
        <rr-modal v-model="showGiveup" title="确定取消订单吗？" ok-text="我再想想" cancel-text="去意已决" @handlerOK="payment" @handlerCancel="optionsLeave">
            <template slot="content" v-if="close_type == 2">
                <view class="pay-modal-content">
                    您的订单在{{orderData.auto_close_time}}分钟内未支付将被取消，请尽快完成支付
                </view>
            </template>
        </rr-modal>
    </view>
</template>

<script>

import payPicker from '@/components/picker/payPicker'
import {mapState} from "vuex";
import { requestPayment, wapWechatPay, wapAliPay, requestOrderPayment } from '@/common/payment'
import { config } from '@/static/settings'
//#ifdef MP-TOUTIAO
import bus from "../bus.js";
//#endif

export default {
    name: "OrderPay",
    components: {
        payPicker
    },
    props: {
        orderId: {
            type: [String, Number, Array]
        },
        create: {
            type: Boolean, // 从创建订单进来
            default: false
        },
        orderData: {
            type: Object,
            default: () => {}
        },
        type: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            close_type: 0,
            showOkBtn: true, // 立即充值按钮
            showRecharge: false, // 余额不足充值弹窗
            showGiveup: false, // 放弃支付弹窗
            showDelivery: false,
            showBalance: false,
            payType: '', // 支付方式
            payParams: {},
            payList: [],
            stop: false,
        }
    },
    watch: {
        orderData: {
            handler(newValue) {
                this.close_type = newValue?.auto_close_type || 0
            }
        },
    },
    computed: {
        ...mapState('setting', {
            balance_text: state => state.systemSetting?.balance_text || '余额'
        }),
        is_weixin() {
            return this.$utils.is_weixin()
        },
        return_url() {
            let url = '';
            if (this.is_weixin) {
                url = `${this.$utils.getPhoneUrl()}/kdxOthers/paySuccess`
            } else {
                url = `${this.$utils.getPhoneUrl()}/kdxOrder/paySuccess?id=${this.orderId}&dispatch_type=${this.orderData?.dispatch_type}`
            }
            return url
        },
    },
    created() {
        //#ifdef MP-TOUTIAO
        bus.$emit('orderPay', this)
        //#endif
    },
    methods: {
        //谈起选择支付方式弹窗
        showPayPicker() {
            if (this.orderId) {
                this.getPayList()
            }
        },
        getPayList() {
            console.log(123);
            let params = {
                order_id: this.orderId
            };

            // 获取支付列表添加活动类型字段
            if(this.orderData.activity_type){
                params.activity_type = this.orderData.activity_type
            }

            this.$api.orderApi.getPayList(params).then(res => {
                if (res.error == 0) {
                    this.payList = [];
                    for (let i in res.payList) {
                        if (res.payList[i].enable == 1) {
                            this.payList.push({type: i})
                        }
                    }
                    let is_xiaochengxu = false;
                    // #ifdef MP-WEIXIN
                    is_xiaochengxu = true;
                    // #endif
                    if (!this.$utils.is_weixin() && !is_xiaochengxu) {
                        this.payList = this.payList.filter(item => item.type != 'wechat')
                    } else if (this.is_weixin && is_xiaochengxu) {
                        this.payList = this.payList.filter(item => item.type != 'alipay')
                    }
                    /**
                     * 未开启支付方式
                     * 只有一种支付方式-禁止弹窗
                     * 多种支付方式-调起弹窗
                     * */
                    if (this.payList?.length === 0) {
                        this.$toast('未开启支付方式');
                        this.$emit('handlePayStatus', false)
                    } else if (this.payList?.length === 1) {
                        this.confirmPay(this.payList?.[0]?.type)
                    } else {
                        // 打开支付弹窗
                        this.$refs.createOrderPay.showPayPicker()
                    }
                } else {
                    this.$toast(res.message);
                    this.$emit('handlePayStatus', false)
                }
            })
        },
        // 支付弹窗中的确认支付
        confirmPay(payType) {
            if (this.stop) {
                return
            }
            this.stop = true;
            this.payType = payType;
            // 余额支付
            if (payType == 'balance') {
                // 二次弹窗确认使用余额支付
                this.showBalance = true
            } else if (payType == 'delivery') {
                // 货到付款
                this.$refs.createOrderPay.closePicker();
                this.showDelivery = true
            } else {
                this.handlePay();
            }
        },
        // 关闭支付picker
        closePicker() {
            // 从确认订单来的
            if (this.create) {
                // 弹出取消订单弹窗
                this.showGiveup = true
            }
        },
        // 继续支付
        payment() {
            this.showGiveup = false;
            this.$refs.createOrderPay.showPayPicker()
        },
        // 确认离开支付
        optionsLeave() {
            // 生成待付款订单
            this.$Router.replace({
                path: '/kdxOrder/list',
                query: {
                    status: 'all'
                }
            })
        },
        // 确认货到付款
        delivery() {
            this.showDelivery = false;
            this.handlePay()
        },
        // 取消货到付款
        cancelDelivery() {
            this.showDelivery = false;
            this.stop = false
            this.$emit('handlePayStatus', false)
        },
        // 取消余额支付
        cancelBalance() {
            this.showBalance = false;
            this.stop = false;
            // 只有一种方式，并且取消余额支付
            if (this.payList?.length === 1 && this.payType == 'balance' && this.create) {
                this.optionsLeave();
            }
        },
        recharge() {
            // 立即充值
            this.showRecharge = false;
            this.$Router.replace({
                path: '/kdxMember/recharge/index',
            })
        },
        // 取消充值
        cancelRecharge() {
            this.showRecharge = false;
            this.$refs.createOrderPay.showPayPicker();
        },
        balancePay() {
            this.showBalance = false;
            // 确认余额支付
            this.$refs.createOrderPay.closePicker();
            uni.showLoading({
                title: '支付中',
            });
            this.handlePay()
        },
        handlePay() {
            console.log(Date.now(),'start')
            let params = {}
            // #ifdef H5
            params['return_url'] = this.return_url
            console.log(this.return_url,'this.return_url------')
            // #endif
            this.$api.orderApi.pay({
                    order_id: this.$utils.is_merchant&&!Array.isArray(this.orderId)?[this.orderId]:this.orderId,
                    pay_type: this.payType,
                    ...params,
                },
                {errorToast: false}
            ).then( async res => {
                if (res.error == 211258 && this.payType == 'balance') {
                    this.changeRechargeState();
                    return
                }
                if (res.error == 0) {
                    // 余额支付
                    if (this.payType == 'balance') {
                        uni.hideLoading();
                        this.checkPayStatus()
                    } else if (this.payType == 'delivery') {
                        // 货到付款
                        this.checkPayStatus()
                    } else if (this.payType == 'alipay') {
                        // #ifdef H5
                        wapAliPay({
                            url: res.data,
                            order_id: this.orderId,
                            dispatch_type: this.orderData.dispatch_type,
                        })
                        // #endif
                        // #ifdef MP-TOUTIAO
                        let payStatus = ''
                        payStatus = await requestPayment({
                            provider: this.payType,
                            orderInfo: res.orderInfo,
                        })
                        if (payStatus === 'ok') {
                            setTimeout(() => {
                                this.checkPayStatus()
                            }, 1000)
                        } else {
                            this.stop = false;
                        }
                        // #endif
                    } else if (this.payType == 'wechat') {
                        let payStatus = ''
                        // #ifdef MP-WEIXIN
                        let wxVideo = this.sessionStorage.getItem('wx-video');;
                        console.log(wxVideo,'wxVdideo')
                        if (wxVideo) {
                            // 校验是否需要进行ticket支付校验
                            let orderInfo = await this.$api.orderApi.checkScene({
                                scene: wxVideo,
                                pay_info: res.data,
                                order_id: this.$utils.is_merchant&&!Array.isArray(this.orderId)?[this.orderId]:this.orderId,
                            });
                            if (orderInfo.error === 0) {
                                let params = {
                                    provider: this.payType,
                                    ...res.data,
                                    orderInfo: orderInfo?.order_info
                                }
                                payStatus = await requestOrderPayment(params);
                            }
                        } else {
                            payStatus = await requestPayment({
                                provider: this.payType,
                                ...res.data,
                            });
                        }
                        // #endif
                        // #ifdef MP-TOUTIAO
                        payStatus = await requestPayment({
                            provider: this.payType,
                            ...res.data,
                        });
                        // #endif

                        // #ifdef H5
                        payStatus = await wapWechatPay({
                            ...res.data,
                        });
                        // #endif
                        if (this.payList?.length === 1 && this.payType == 'wechat' && this.create && payStatus !== 'ok') {
                            this.optionsLeave();
                            return
                        }
                        console.log(Date.now(),'start5')
                        if (payStatus === 'ok') {
                            setTimeout(() => {
                                this.checkPayStatus()
                            }, 1000)
                        } else {
                            this.stop = false;
                        }
                    }  else if (this.payType == 'byte_dance') {
                        // #ifdef MP-TOUTIAO
                        let payStatus = '';
                        payStatus = await requestPayment({
                            provider: this.payType,
                            orderInfo: res.data,
                        });
                        if (payStatus === 'ok') {
                            setTimeout(() => {
                                this.checkPayStatus()
                            }, 1000)
                        } else {
                            this.stop = false;
                            this.optionsLeave();
                        }
                        // #endif
                    }
                } else {
                    uni.hideLoading();
                    setTimeout(() => {
                        this.$message(res.message|| '支付失败');
                    }, 300);
                    this.$emit('handlePayStatus', false);
                    this.stop = false;
                }
            })
        },
        checkPayStatus() {
            let obj = {
                order_id:  this.orderId,
                pay_type: this.payType
            };

            this.$api.orderApi.orderPayResult(obj).then(res => {
                if (res.error == 0) {
                    uni.hideLoading();
                    this.$toast('支付成功');
                    this.toCreateResult();
                    this.stop = false;
                    this.$emit('handlePayStatus', false)
                } else {
                    setTimeout(()=>{
                        this.checkPayStatus();
                    },2000)
                }
            });
        },
        // 跳转下单成功页面
        toCreateResult() {
            this.$Router.replace({
                path: '/kdxOrder/paySuccess',
                query: {
                    id: this.orderId, // 订单id
                    dispatch_type: this.orderData?.dispatch_type
                }
            })
        },
        // 获取充值状态
        changeRechargeState() {
            // 请求接口判断立即充值是否开启
            this.$api.settingApi.getSysSetting().then(res => {
                if (res.error == 0) {
                    this.showOkBtn = res.recharge_state == 1 ? true : false;
                }
            });
            uni.hideLoading();
            // 用户余额不足弹窗
            this.showRecharge = true;
            this.stop = false;
        }
    },
}
</script>

<style lang="scss" scoped>
.order-pay {
    .pay-modal-content {
        font-size: 24rpx;
    }
}
</style>
