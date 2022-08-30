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
    <page-box navbarBg>
        <view class="order-create flex-column">
            <div class="bg theme-primary-bgcolor"></div>
            <view class="container">
                <!-- 配送方式 -->
                <delivery-type v-if="hasDeliveryHead" v-model="dispatch_type" :goodsType="goodsType" ></delivery-type>
                <!-- 选择地址 (虚拟商品不显示地址) -->
                <create-address :addressData="orderData" v-if="goodsType && goodsType === '0'"></create-address>
                <!-- 不在配送范围提示 -->
                <delivery-area :orderData="orderData" v-if="dispatch_type === '30' && (orderData.dispatch_intracity_error && (orderData.dispatch_intracity_error.code === 230132 || orderData.dispatch_intracity_error.code === 230135 || orderData.address_province==='国外'))" />
                <!-- 商品优惠信息 -->
                <create-info :orderData="orderData" :invoiceData="invoiceData" @getData="getData" :dispatch_type="dispatch_type"></create-info>
                <!-- 卡密商品 -接收邮箱地址 -->
                <create-email v-if="isVirtualEmail"></create-email>
             <!--系统表单-->
                <div class="order-create-form" v-if="form.content ">
                    <SystemformItems class="order-create-form-items" :items="form.content" @on-change="changeForm"></SystemformItems>
                </div>
                <!-- 营销活动 -->
                <create-activity :orderData="orderData" @getData="getData"></create-activity>
                <!-- 价格信息 -->
                <create-price :orderData="orderData"></create-price>
            </view>
            <!-- 支付 -->
            <order-pay ref="orderPay" :orderId="payOrderID" :create="true" :orderData="orderData" @handlePayStatus="payStatus"></order-pay>
        </view>
        <!-- 底部结算  -->
        <create-submit slot="foot" :orderData="orderData" :payPrice="payPrice" :noticePayIds="subTemplateId"  @pay="createConditions"></create-submit>
    </page-box>
</template>

<script>
    import DeliveryType from './components/create/DeliveryType'
    import createAddress from './components/create/CreateAddress'
    import createMessage from './components/create/CreateMessage'
    import createActivity from './components/create/CreateActivity'
    import createInfo from './components/create/CreateInfo'
    import createPrice from './components/create/CreatePrice'
    import createSubmit from './components/create/CreateSubmit'
    import orderPay from "./components/OrderPay";
    import DeliveryArea from './components/create/DeliveryArea'


    import SystemformItems from "@/components/decorate/templates-shim/SystemformItems";

    import {mapActions, mapState, mapGetters} from 'vuex'
    import saveSystemForm from '@/components/decorate/templates-shim/formSubmit.js'
    import PageMixin from '@/common/PageMixin.js'
    import CreateEmail from "./components/create/CreateEmail";
    import bus from "./bus.js";

    export default {
        mixins: [PageMixin],
        name: "creat",
        components: {
            DeliveryType,
            createAddress,
            createMessage,
            createActivity,
            createInfo,
            createPrice,
            createSubmit,
            orderPay,
            SystemformItems,
            CreateEmail,
            DeliveryArea

        },
        props: {},
        data() {
            return {
                setting: {
                    background: '#f5f5f5'
                },
                goodsType: '0', // 商品类型 （0、实体商品 1、虚拟商品）
                goodsData: [], // 商品信息
                invoiceData: {}, // 发票留言
                payPrice: 0, // 支付金额
                orderData: {}, // 全部信息
                payOrderID: '', // 支付订单id
                mearchantOrderIds: [], // 多商户多个订单id
                isCan: false, // 是否可以下单
                select_coupon_id: 0,
                timer: {},
                dispatch_type: '', // 配送方式
                requestedFlag: false,
                seckillData: {}, // 秒杀信息
                isContact: false, // 是否显示联系人
                isVirtualEmail: false, //是否显示卡密商品接收邮箱地址输入框
                isShowRefresh: false, // 在show请求数据后是否需要重新获取数据
                pendingActiveName: '', // 进行中的活动
                subTemplateId: [], // 立即支付订阅消息模板id-公众号
                noticePay: [],//立即支付订阅场景值-小程序
            }
        },
        computed: {
            ...mapState('orderCreate', {
                params: state => state,
            }),
            ...mapState('setting', {
                verifySetting:  state => state.verifySetting,
                remind: state => state?.systemSetting?.appointment_setting?.remind || 2,
                dropSettings: state => state.dropSettings,
                wareSetting: state => state.wareSetting
            }),
            ...mapGetters('form', ['form']),
            hasDeliveryHead(){ // 是否有配送标题
               return (this.goodsType == '0')||  // 实体商品
               (this.goodsType=='1')  // 虚拟
            }
        },
        watch: {
            dispatch_type: {
                handler(value) {
                    this.$store.commit('orderCreate/setOrderCreateInfo', {dispatch_type:value});
                    if (value && this.requestedFlag) {
                        this.getData()
                    }
                },
            },
        },
        created() {
            this.requestedFlag = false;
            this.dispatch_type = this.params.dispatch_type || '10';

            // #ifdef MP-TOUTIAO
            bus.$off("orderPay");
            bus.$on("orderPay", (child) => {
                this.$refs.orderPay = child;
            });
            // #endif

            console.log(this.params.dispatch_type,'配送方式')
        },
        onLoad(){
            // #ifdef MP-WEIXIN
            // 视频号有bug暂时留着 23870
            setTimeout(() => {
                this.$loading.hideLoading();
            }, 1000);
            // #endif
        },
        onShow() {
            if (this.params.changeAddress) {
                this.getData()
            }
        },
        mounted() {
            this.isShowRefresh = true;
            let query = this.$Route.query|| {}
            let {goods_id,type, plugin} = query;

            if (goods_id) {
                this.params.goods_info = [{
                    goods_id,
                    option_id: query.option_id,
                    total: query.total
                }]
            }

            if (type === '1' || type === '2') {
                this.dispatch_type = '0';
                this.goodsType = '1'
            }

            if(plugin == 'creditShop'){
                this.pendingActiveName = plugin

                if(query.credit_good_type == 1){
                    this.dispatch_type = '0'
                }
            }
            this.getData();
            // #ifdef MP-WEIXIN
            this.getMsgIds()
            // #endif
            // #ifdef H5
            if(this.$utils.is_weixin()) {
                this.getMsgIds()
            }
            // #endif
        },
        methods: {
            getData() {
                // 清除配送、自提时间
                this.isShowRefresh && (this.$store.commit('orderCreate/setOrderCreateInfo',{
                    deliveryTime: '',
                    merchant_delivery_time: {}
                }))
                // 读取缓存
                let {address_id, cacheAddressId, ...params} = this.params
                let cacheId = cacheAddressId[this.dispatch_type]
                address_id = cacheId || 0
                let obj = {
                    ...params,
                    address_id,
                    dispatch_type: this.dispatch_type,
                    is_cart: this.$Route.query?.is_cart || 0
                };
                // 适配-原价购买
                let is_origin = this.$Route.query.is_origin;
                if (is_origin == '1') {
                    obj.is_original_buy = '1'
                }

                // 优惠券补充参数
                if(this.pendingActiveName){
                    obj.app_name = this.pendingActiveName
                }
                // 小程序添加直播间id
                // #ifdef MP-WEIXIN
                if (this.$Route.query.room_id) {
                    obj = {...obj, scene: 10, scene_value: this.$Route.query.room_id}
                }
                // 视频号
                let wxVideo = this.sessionStorage.getItem('wx-video');
                if (wxVideo) {
                    obj = {...obj, scene: 20}
                }
                // #endif
                delete obj.changeAddress;
                delete obj.dispatch_status;
                delete obj.dispatch_express;
                delete obj.express_enable;
                delete obj.intracity_enable;
                delete obj.deliveryTime;
                delete obj.virtual_email;
                this.$api.orderApi.confirmOrder(obj).then(res => {
                    this.requestedFlag = true;
                    if (res.error == 0) {

                            /* 单 */
                            // 卡密商品是否开启邮件填写
                            this.isVirtualEmail = res.order.goods_info[0].type == '2' && res.order.goods_info[0].virtual_account_mailer_setting == 1
                            this.goodsData = res.order.goods_info; // 商品信息
                            this.goodsType = res.order.goods_info[0].type // 商品类型 （0、实体商品 1、虚拟商品）
                            this.invoiceData = {
                                remark_buyer: res.order.remark_buyer,
                                is_invoice_support: res.order.is_invoice_support, // 商品是否支持发票
                                invoice_type: res.order.invoice_type // 商城设置发票类型 0 不支持 1 纸质 2 电子 3 全选
                            };
                        this.payPrice = res.order.pay_price;
                        this.orderData = res.order;
                        // 同城可选时间段
                        if(res.order.dispatch_type == 30) {
                            this.$api.orderApi.getDeliveryTime().then((res) => {
                                console.log(res,'getDeliveryTime')
                                if(res.error === 0) {
                                    this.$store.commit('orderCreate/setOrderCreateInfo',{
                                        span_detail: res.data?.span_detail || [],
                                        span_detail_now: res.data?.span_detail_now || []
                                    })
                                }
                            })
                        }
                        this.$decorator.getModule('diymenu').getCartNum();
                        this.$store.commit('orderCreate/setOrderCreateInfo', {changeAddress: false,address_id: res.order.address_id||0});
                        // 进行表单的判断，如果是不是新进入的页面就不刷新
                        if (this.isShowRefresh) {
                            let form = {
                                id: res.form?.id,
                                content: res.form?.content ? JSON.parse(res.form.content) : ''
                            }
                            this.$store.commit('form/setForm', form);
                        }
                    } else if(res.error !== 211222 && res.error !== 211223) {
                        this.$toast(res.message);
                        setTimeout(() => {
                            // this.$Router.back(0)
                            this.$Router.back(1)
                        }, 1000)
                    }
                }).finally(() => {
                    this.isShowRefresh = false;
                    // #ifdef MP-WEIXIN
                    this.getMsgIds()
                    // #endif
                    // #ifdef H5
                    if(this.$utils.is_weixin()) {
                        this.getMsgIds()
                    }
                    // #endif
                })
            },
            // 处理创建订单条件
            async createConditions() {
                if (this.isCan) {
                    return;
                }
                if (this.goodsType === '0') {
                    // 判断地址
                    if (!this.orderData.address_id) {
                        this.$toast('请添加地址');
                        return
                    }

                    let somecityname = this.$store.state.setting?.systemSetting?.dispatch_name['30'] ? this.$store.state.setting?.systemSetting?.dispatch_name['30'] : '同城配送'
                    if (this.dispatch_type === '30' && (this.orderData.dispatch_intracity_error?.code === 230132 || this.orderData.dispatch_intracity_error?.code === 230135 || this.orderData.address_province == '国外')) {
                        // 同城配送不在范围内
                        if (this.orderData.over_scope === 0) {
                            // 不使用快递
                            this.$toast(`超出${somecityname}范围`)
                        } else {
                            // 使用快递
                            this.$toast(`超出${somecityname}范围，请选择快递`)
                        }
                        return
                    }
                }
                if (this.dispatch_type == 30) {
                    if (this.goodsType!=5) {
                        // 同城配送时校验配送时间
                        if (1 === +this.orderData.delivery_time && !this.params.deliveryTime) {
                            this.$toast('请选择配送时间');
                            return;
                        }
                    }
                }
                // #ifdef MP-WEIXIN
                    this.$utils.sendWxappMsg(this.noticePay,this.createOrder)
                // #endif
                // #ifndef MP-WEIXIN
                this.createOrder()
                // #endif
            },
            // 创建订单
            async createOrder() {
                let paramsForm = {};
                if ( this.form.content) {
                    paramsForm = await saveSystemForm(this.form);
                    paramsForm.type = '1';
                }
                this.isCan = true;
                this.handlerCreateOrder(paramsForm)
            },
            async handlerCreateOrder(paramsForm) {
                try {
                    let paramsOrder = this.handlerParams();
                    // 提交订单
                    let orderRes = await this.$api.orderApi.createOrder(paramsOrder);
                    if (orderRes.error === 0) {
                        this.payOrderID = orderRes.order.id;
                        this.mearchantOrderIds = orderRes.order.id

                        // 表单提交
                        let formRes = {error: 0};
                            this.form.content && (formRes = await this.$api.decorateApi.saveSettingForm({
                                ...paramsForm,
                                order_id: this.payOrderID
                            }));
                        if (formRes.error === 0) {
                            // 0元订单不用支付的订单直接跳转支付成功页面

                            if (orderRes.order.pay_price == 0) {
                                this.toCreateResult();
                                this.isCan = false;
                                return;
                            }
                            // #ifndef MP-TOUTIAO
                            setTimeout(() => {
                                // 打开支付弹窗
                                this.$refs.orderPay.showPayPicker();
                            }, 0);
                            // #endif
                            // #ifdef MP-TOUTIAO
                            setTimeout(() => {
                                // 打开支付弹窗
                                this.$refs.orderPay.showPayPicker();
                            }, 100);
                            // #endif
                            this.$decorator.getModule('diymenu').getCartNum()
                        } else {
                            this.isCan = false;
                            this.$toast(formRes.message);
                        }
                        // this.$store.commit('form/resetForm'); // 未支付-页面未跳转清空
                    }  else if(orderRes.error === 510117) {
                        this.$toast(orderRes.message);
                        setTimeout(() => {
                            this.$Router.back(1)
                        }, 1000)
                    } else {
                        this.$toast(orderRes.message);
                        this.isCan = false
                    }
                } catch (e) {
                    this.isCan = false;
                }
            },
            handlerParams() {
                let paramsOrder = {
                    ...this.params,
                    dispatch_type: this.dispatch_type,
                    goods_info: this.$Route.query?.is_cart == 1?[]:this.params.goods_info
                };
                    // 配送、自提时间
                    this.params.deliveryTime && (paramsOrder.delivery_time = this.params.deliveryTime);

                // 优惠券补充参数
                if(this.pendingActiveName) {
                    paramsOrder.app_name = this.pendingActiveName
                }
                // 小程序添加直播间id
                // #ifdef MP-WEIXIN
                if (this.$Route.query.room_id) {
                    paramsOrder = {...paramsOrder, scene: 10, scene_value: this.$Route.query.room_id}
                }
                // 视频号
                let wxVideo = this.sessionStorage.getItem('wx-video');
                if (wxVideo) {
                    paramsOrder = {...paramsOrder, scene: 20}
                }
                // #endif
                // 秒杀适配-原价购买
                let is_origin = this.$Route.query.is_origin;
                if (is_origin == '1') {
                    paramsOrder.is_original_buy = '1'
                }
                delete paramsOrder.dispatch_status;
                delete paramsOrder.dispatch_express;
                delete paramsOrder.express_enable;
                delete paramsOrder.merchant_buyer_remark;
                delete paramsOrder.intracity_enable;
                delete paramsOrder.deliveryTime;
                console.log('params-order', paramsOrder)
                return paramsOrder
            },
            // 清除下单缓存
            clearCache() {
                let obj = {
                    changeAddress: false, // 是否切换地址
                    dispatch_type: '10', // 快递类型  10:快递
                    address_id: 0, // 地址id  0默认
                    buyer_remark: '', // 留言
                    invoice_title: '', // 发票抬头
                    invoice_is_electronic: '', // 发票材料类型 1纸质2电子
                    invoice_is_company: '', // 是否是个人发票 1是个人 2是企业
                    invoice_number: '', // 纳税人识别号
                    invoice_address: '', // 邮寄地址/电子邮箱
                    select_coupon_id: '', // 优惠券
                    deduct_balance: 1, // 是否开启余额抵扣
                    deduct_credit: 1, // 是否开启积分抵扣
                    virtual_email: '', //卡密邮箱
                };
                this.$store.commit('orderCreate/setOrderCreateInfo', obj);
            },
            // 跳转下单成功页面
            toCreateResult() {
                this.$Router.replace({
                    path: '/kdxOrder/paySuccess',
                    query: {
                        id: this.mearchantOrderIds, // 订单id
                        dispatch_type: this.dispatch_type
                    }
                })
            },
            getMsgIds() {
                let type_code = ['buyer_order_pay', 'buyer_order_send'];
                // #ifdef H5
                if(this.$utils.is_weixin()) {
                    let noticeIds = this.$store.state.setting?.noticeTemId;
                    if(noticeIds && type_code.length) {
                        type_code.map((item)=> {
                            if(noticeIds[item]) {
                                this.subTemplateId?.push(noticeIds[item])
                            }
                        })
                    }
                }
                // #endif
                // #ifdef MP-WEIXIN
                this.noticePre = ['buyer_order_pay', 'buyer_order_send'];
                this.noticePay = type_code;
                // #endif
            },
            payStatus(data) {
                this.isCan = data
            },
            // 修改form-content的值
            changeForm(data) {
                this.$store.commit('form/setFormContent', data);
            },
        },
        beforeDestroy() {
            // 清除缓存
            this.clearCache();
            this.$store.commit('form/resetForm');
        },
    }
</script>

<style lang="scss" scoped>
    .order-create {
        height: 100%;
        background-color: $uni-bg-color-grey;
        box-sizing: border-box;
        position: relative;
        .bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 232rpx;
            background: linear-gradient(180deg, #FF3C29 0%, #FF6F29 96.87%);
        }
        .container {
            position: relative;
            flex: 1;
            padding: 16rpx 24rpx 96rpx;
            overflow: auto;
            box-sizing: border-box;
            .order-create-form {
                margin-top: 16rpx;
                .order-create-form-items {
                    // #ifdef H5
                    border-radius: 12rpx;
                    // #endif
                    // #ifndef H5
                    /deep/ .diyform-item {
                        border-radius: 12rpx;
                    }
                    // #endif
                }
            }
        }
        .pay-modal-content {
            font-size: 24rpx;
        }

        .order-tip {
             padding-bottom: px2rpx(2);

            &.van-hairline--top:after {
                border-top-color: $uni-border-color;
                border-style: solid;
            }
        }

    }
    /deep/ .grace-page-footer{
        z-index: 1!important;
    }
</style>
