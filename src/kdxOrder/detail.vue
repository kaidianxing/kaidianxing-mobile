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
    <page-box navbarBg v-if="loaded">
        <view class="order-detail">
            <view class="bg theme-primary-bgcolor"></view>
            <view class="container">
                <!-- 订单状态 -->
                <detail-order-status :orderData="orderData"></detail-order-status>
                <!-- 商品信息 -->

                <detail-order-goods :order_id="order_id"
                                    :countTime="countTime"
                                    :orderGoods="orderData.orderGoods"
                                    :orderData="orderData"></detail-order-goods>
                <!-- 系统订单表单 -->
                <form-info v-if="form.content" :data="form.content"></form-info>
                <!-- 订单信息 -->
                <detail-order-info :orderData="orderData"></detail-order-info>
            </view>
            <list-modal ref="modals"
                        :title="getTitle"
                        @cancelOrderOk="cancelOrderOk"
                        @sendOrderOk="sendOrderOk"
                        @deleteOrderOk="deleteOrderOk"></list-modal>
            <order-pay ref="orderPay" type="orderDetail" :orderId="order_id" :orderData="orderData"></order-pay>
        </view>
        <template v-slot:foot>
            <!-- 底部按钮 -->
            <detail-order-footer :is_comment="is_comment" :order_id="order_id" :orderData="orderData" :status="orderData.status" @btnClick="btnClick"></detail-order-footer>
        </template>
        <!-- 消费奖励弹窗 -->
        <modalReward :visible="visible" :activityType="activityType" :activityData="activityData" @update:visible="changeShowReward" ></modalReward>
        <!-- 购物奖励弹窗 -->
        <modalReward :visible="showShoppingRewardFlag" :activityType="shoppingReward" :activityData="shoppingRewardData" @update:visible="changeShowShoppingRewardFlag" ></modalReward>
        <!-- 消费奖励红包弹窗 -->
        <redpacket :isShow="customVisible" :activityType="activityType" :activityData="customActivityData"
                   @update:visible="changeCloseCustom"></redpacket>
        <!-- 购物奖励红包弹窗 -->
        <redpacket :isShow="showShoppingVisible" :activityType="shoppingReward" :activityData="showShoppingActivityData"
                   @update:visible="changeCloseShopping"></redpacket>
    </page-box>

</template>

<script>
    import detailOrderStatus from './components/detail/DetailOrderStatus'
    import detailOrderGoods from './components/detail/DetailOrderGoods'
    import detailOrderInfo from './components/detail/DetailOrderInfo'
    import detailOrderFooter from './components/detail/DetailOrderFooter'
    import listModal from './components/list/ListModal'
    import orderPay from "./components/OrderPay";
    import modalReward from '@/components/modal-reward/ModalReward'
    import FormInfo from "./components/FormInfo";
    import PageMixin from '@/common/PageMixin.js';
    import redpacket from '@/components/modal-reward/Redpacket'
    import bus from "./bus";

    export default {
        mixins: [PageMixin],
        name: 'detail',
        components: {
            detailOrderStatus,
            detailOrderGoods,
            detailOrderInfo,
            detailOrderFooter,
            listModal,
            orderPay,
            modalReward,
            FormInfo,
            redpacket,
        },
        props: {},
        data() {
            return {
                order_id: '', // 订单id
                is_comment: 0, // 是否开启评价
                orderData: {},
                countTime: [],
                visible: false,
                activityType: 'consumeReward',
                shoppingReward: 'shoppingReward',
                activityData: {
                    couponList: [],
                    credit: {
                        title: '消费奖励',
                        number: '',
                    },
                    balance: {
                        title: '消费奖励',
                        number: '',
                    },
                    red_package: {
                        title: '消费奖励',
                        number: '',
                    },
                    popup_type: '0'
                },
                form: {},
                shoppingRewardData: {
                    couponList: [],
                    credit: {
                        title: '购物奖励',
                        number: '',
                    },
                    balance: {
                        title: '购物奖励',
                        number: '',
                    },
                    red_package: {
                        title: '购物奖励',
                        number: '',
                    },
                    popup_type: '0'
                },
                showShoppingRewardFlag: false,
                loaded: false,
                customVisible: false, //消费奖励红包弹窗
                customActivityData: {}, //消费奖励红包内容
                showShoppingActivityData: {}, //购物奖励红包弹窗
                showShoppingVisible: false, //购物奖励红包弹窗
            }
        },
        computed: {
            getTitle(){
                return ''
            },
        },
        created() {
            // #ifdef MP-TOUTIAO
            bus.$off("orderPay");
            bus.$on("orderPay", (child) => {
                this.$refs.orderPay = child;
            });
            bus.$off('list-modal')
            bus.$on('list-modal', instance=> {
                this.$refs.modals = instance
            })
            // #endif
        },
        mounted() {
            this.order_id = this.$Route.query.order_id;
            this.getData()
        },
        onShow() {
            if(this.loaded || this.order_id) {
                this.getData();
            }
        },
        methods: {
            getData() {
                this.$api.orderApi.orderDetail({ order_id: this.order_id }).then(res => {
                    if (res.error == 0) {
                        this.orderData = res;
                        this.is_comment = res.comment_setting.order_comment;
                        this.form = {
                            id: res.form?.id,
                            content: res.form?.content ? JSON.parse(res.form.content) : ''
                        }
                        this.loaded = true;
                        // if (this.form.content) {
                        //     this.form.content.forEach(item => {
                        //         if (item.id === 'checkboxes') {
                        //             item.params.value = item.params.value.join(',')
                        //         }
                        //     })
                        // }
                    } else {
                        this.$toast(res.message)
                    }
                })
            },
            btnClick(data) {
                let cache = {}
                switch (data.name) {
                    // 取消订单
                    case 'cancelOrder':
                        this.cancelOrder();
                        break;
                    // 去支付
                    case 'payOrder':
                        this.payOrder();
                        break;
                    // 查看物流
                    case 'express':
                        this.orderData.orderGoods.forEach(item=>{cache[item.package_id]=item.package_id})
                        let package_ids=Object.keys(cache);
                        if(package_ids.length==1){
                            this.express(package_ids[0])
                        }else{
                            this.express()
                        }
                        break;
                    // 确认收货
                    case 'sendOrder':
                        this.sendOrder();
                        break;
                    // 删除订单
                    case 'deleteOrder':
                        this.deleteOrder();
                        break;
                    // 评价
                    case 'comment':
                        this.orderData.orderGoods.forEach(item=>{cache[item.id]=item.id})
                        let ids=Object.keys(cache);
                        if(ids.length==1){
                            this.comment(ids[0])
                        }else{
                            this.comment()
                        }
                        break;
                }
            },
            cancelOrder() {
                this.$refs.modals.showCancelModal()
            },
            // 取消订单
            cancelOrderOk() {
                this.$api.orderApi.cancelOrder({id: this.order_id}).then(res => {
                    if (res.error == 0) {
                        this.getData()
                    } else {
                        uni.showToast({
                            title: res.message,
                            icon: 'none'
                        })
                    }
                })
            },
            // 支付
            payOrder() {
                // 打开支付弹窗
                this.$refs.orderPay.showPayPicker()
            },
            // 查看物流
            express(package_id) {
                // 如果有包裹id, 则进包裹详情
                if (package_id) {
                    this.$Router.auto({
                        path: '/kdxOrder/package/detail',
                        query: {
                            package_id: package_id,
                            order_id: this.order_id
                        }
                    })
                } else {
                    this.$Router.auto({
                        path: '/kdxOrder/package/list',
                        query: {
                            id: this.order_id
                        }
                    })
                }
            },
            // 确认收货
            sendOrder() {
                this.$refs.modals.showSendModal()
            },
            // 确认收货
            sendOrderOk() {
                this.$api.orderApi.finishOrder({id: this.order_id}).then(res => {
                    if (res.error == 0) {
                        this.getData();

                        // 消费奖励弹窗
                        this.getActivityData()
                        // 购物奖励弹窗
                        this.sendShoppingReward()
                    } else {
                        uni.showToast({
                            title: res.message,
                            icon: 'none'
                        })
                    }
                })
            },
            deleteOrder() {
                this.$refs.modals.showDeleteModal()
            },
            // 删除订单
            deleteOrderOk() {
                this.$api.orderApi.deleteOrder({id: this.order_id}).then(res => {
                    if (res.error == 0) {
                        this.$toast('删除成功');
                        // this.$Router.back(0);
                        this.$Router.back(1)
                    } else {
                        this.$toast(res.message)
                    }
                })
            },
            comment(id) {
                if(id){
                    this.$Router.auto({
                        path: '/kdxOrder/comment/index',
                        query: {
                            id: id
                        }
                    })
                }else{
                    this.$Router.auto({
                        path: '/kdxOrder/comment/list',
                        query: {
                            order_id: this.order_id
                        }
                    })
                }
            },
            changeShowReward(value) {
                this.visible = value
                if( JSON.stringify( this.customActivityData ) !== "{}" ) {
                    this.customVisible = true;
                }
            },
            // 消费奖励红包弹窗关闭
            changeCloseCustom(value) {
                this.customVisible = value.update;
            },
            // 消费奖励数据
            getActivityData() {
                    this.$api.memberApi.getConsumeRewardActivity({order_id: this.order_id},{ errorToast: false }).then(res => {
                        if (res.error === 0) {
                            this.activityData.popup_type = res.popup_type
                            if (res?.coupon_info?.length > 0) {
                                this.activityData.couponList = [...res.coupon_info]
                            }
                            if (res.credit && parseFloat(res.credit) !== 0) {
                                this.activityData.credit.number = res.credit
                            }
                            if (res.balance && parseFloat(res.balance) !== 0) {
                                this.activityData.balance.number = res.balance
                            }
                            if (new Set(res.reward_array).has('4') && res.red_package && res.red_package?.money && parseFloat(res.red_package.money) !== 0) {
                                this.activityData.red_package.number = res.red_package.money
                            }else {
                                this.activityData.red_package = {}
                            }
                            if(new Set(res?.reward_array).has('4')) {
                                this.getCustomeReward(res.log_id)
                            }
                            this.visible = true;
                        }
                    })
            },
            // 获取消费奖励红包信息
            getCustomeReward(log_id) {
                this.$api.memberApi
                    .getNoRedpacket({
                        scene_id: log_id,
                        scene: 12
                    }).then(result => {
                    if(result.error == 0 && result.list.length) {
                        let item = result.list[0];
                        this.customActivityData = {
                            blessing: item.extend.blessing,
                            created_at: item.created_at,
                            expire_time: item.expire_time,
                            limit: item.extend.limit,
                            money: item.money,
                            id: item.id
                        }
                    }
                })
            },
            // 购物奖励数据
            async sendShoppingReward() {
                    const res = await this.$store.dispatch('member/sendShoppingReward', this.order_id)
                    if (res.send_type && res.send_type === '1') {
                        this.shoppingRewardData.popup_type = res.popup_type
                        // 订单完成时 触发
                        if (res.coupon_info && res.coupon_info.length) {
                            this.shoppingRewardData.couponList = [...res.coupon_info]
                        }
                        if (res.credit && parseFloat(res.credit) !== 0) {
                            this.shoppingRewardData.credit.number = res.credit
                        }
                        if (res.balance && parseFloat(res.balance) !== 0) {
                            this.shoppingRewardData.balance.number = res.balance
                        }
                        if (new Set(res.reward_array).has('4') && res.red_package && res.red_package?.money && parseFloat(res.red_package.money) !== 0) {
                            this.shoppingRewardData.red_package.number = res.red_package.money
                        }else {
                            this.activityData.red_package = {}
                        }
                        if(new Set(res?.reward_array).has('4')) {
                            this.getShoppingReward(res.log_id)
                        }
                        this.showShoppingRewardFlag = true
                    }
            },
            // 获取消费奖励红包信息
            getShoppingReward(log_id) {
                this.$api.memberApi
                    .getNoRedpacket({
                        scene_id: log_id,
                        scene: 11
                    }).then(result => {
                    if(result.error == 0 && result.list.length) {
                        let item = result.list[0];
                        this.showShoppingActivityData = {
                            blessing: item.extend.blessing,
                            created_at: item.created_at,
                            expire_time: item.expire_time,
                            limit: item.extend.limit,
                            money: item.money,
                            id: item.id
                        }
                    }
                })
            },
            changeShowShoppingRewardFlag(value) {
                this.showShoppingRewardFlag = value;
                if( JSON.stringify( this.showShoppingActivityData ) !== "{}" ) {
                    this.showShoppingVisible = true;
                }
            },
            // 消费奖励红包弹窗关闭
            changeCloseShopping(value) {
                this.showShoppingVisible = value.update;
            },
        },
    }
</script>

<style lang="scss">
    .order-detail {
        position: relative;
        .bg {
            width: 100%;
            height: 232rpx;
            background: linear-gradient(to bottom, #ff3c29 0%, #ff6f29 96.87%);
        }
        .container {
            margin-top: -232rpx;
            padding: 32rpx 24rpx 128rpx;
            box-sizing: border-box;
            .none {
                position: fixed;
                top: -99999rpx;
                left: -99999rpx;
                z-index: -99999;
            }
        }
        .qrcode {
            position: fixed!important;
            width: px2rpx(160);
            height: px2rpx(160);
            opacity: 0;
            z-index: -9999;
        }
    }
    /deep/ .account-info {
       .kdx-cell-wrap .left-icon  {
            margin-right: 8px;
            padding-right: 0;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            width: 24px;
            height: 24px;
            color: #fff;
        }
    }
</style>
