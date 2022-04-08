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
        <view class="order-list">
            <!-- tab切换 -->
            <list-tab :current="status"></list-tab>
            <!-- 商品列表 -->
            <view class="container">
                <block v-if="list.length > 0">
                    <list-goods-card :list="list" :is_comment="is_comment" @btnClick="btnClick"></list-goods-card>
                    <!--加载更多  -->
                    <page-loading v-if="list.length != count" :loadingType="loadingType"></page-loading>
                </block>
            </view>
            <block v-if="!loading && count <= 0">
                <!-- 缺省页 -->
                <view class='default-page flex-column'>
                    <view class="bg">
                        <image :src="$utils.staticMediaUrl('default/bill.png')"></image>
                    </view>
                    <view class='default-text'>您暂时还没有订单哦</view>
                    <div class="ib">
                    <btn styles="padding:0 60rpx;margin-top:32rpx" :ghost="true" classNames="theme-primary-color theme-primary-border" size="middle" @btn-click="toIndex">去逛逛</btn>
                    </div>
                </view>
                <!-- 猜你喜欢 -->
                <goods-like></goods-like>
            </block>
            <list-modal ref="modals"
                        :title="getTitle"
                        @cancelOrderOk="cancelOrderOk"
                        @sendOrderOk="sendOrderOk"
                        @deleteOrderOk="deleteOrderOk"
                        ></list-modal>
            <order-pay ref="orderPay" type="orderList" :orderId='orderData.id' :orderData="orderData"></order-pay>
        </view>

        <!-- 消费奖励弹窗 -->
        <modalReward :visible="visible" :activityType="activityType" :activityData="activityData" @update:visible="changeShowReward" ></modalReward>
        <!-- 购物奖励弹窗 -->
        <modalReward :visible="showShoppingRewardFlag" activityType="shoppingReward" :activityData="shoppingRewardData" @update:visible="changeShowShoppingRewardFlag" ></modalReward>
        <!-- 消费奖励红包弹窗 -->
        <redpacket :isShow="customVisible" :activityType="activityType" :activityData="customActivityData"
                   @update:visible="changeCloseCustom"></redpacket>
        <!-- 购物奖励红包弹窗 -->
        <redpacket :isShow="showShoppingVisible" :activityType="shoppingRewardData" :activityData="showShoppingActivityData"
                   @update:visible="changeCloseShopping"></redpacket>

    </page-box>
</template>

<script>
    import listTab from './components/list/ListTab'
    import listGoodsCard from './components/list/ListGoodsCard'
    import listModal from './components/list/ListModal'
    import orderPay from './components/OrderPay'
    import goodsLike from './components/goods/GoodsLike'
    import modalReward from '@/components/modal-reward/ModalReward'
    import PageMixin from '@/common/PageMixin.js'
    import PageLoadingMixin from "@/common/LoadingBox/PageLoadingMixin"
    import redpacket from '@/components/modal-reward/Redpacket';
    import bus from "./bus";
    export default {
        mixins: [PageMixin,PageLoadingMixin],
        name: 'list',
        components: {
            listTab, listGoodsCard, listModal, orderPay, goodsLike, modalReward, redpacket,
        },
        props: {},
        data() {
            return {
                status: 'all',
                list: [],
                page: 1,
                loading: false,
                count: 0,
                apiObj: {
                    all: 'allOrderList',
                    pay: 'payOrderList',
                    send: 'sendOrderList',
                    pick: 'pickOrderList',
                    finish: 'finishOrderList',
                    delete: 'deleteOrderList'
                },
                orderData: {},
                is_comment: 0, // 是否开启评价
                reqesting: false,
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
                // timeInterval: ''
                customVisible: false, //消费奖励红包弹窗
                customActivityData: {}, //消费奖励红包内容
                showShoppingActivityData: {}, //购物奖励红包弹窗
                showShoppingVisible: false, //购物奖励红包弹窗
            }
        },
        computed: {
            loadingType() {
                let loadingType = 0;
                if (this.loading) {
                    loadingType = 1
                } else if (this.list.length == this.count && this.count > 0 && this.loading == false) {
                    loadingType = 2
                }
                return loadingType
            },

            getTitle(){
                return ''
            }
        },
        onShow() {
            if (this.$Route.query.status) {
                this.status = this.$Route.query.status;
            }
            this.page = 1;
            this.list = [];
            this.getList()
        },
        created(){
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
        methods: { 
            getList() {
                this.loading = true;
                this.$api.orderApi[this.apiObj[this.status]]({page: this.page})
                    .then(res => {
                        if (res.error == 0) {
                            if (res.list.length > 0) {
                                for (let i in res.list) {
                                    res.list[i] = {
                                        ...res.list[i],
                                        countTime: []
                                    };
                                    if (res.list[i].status == 0) {
                                        //待付款倒计时
                                        let endTime = new Date(Date.parse(res.list[i].auto_close_time.replace(/-/g, "/"))).getTime();
                                        let time = parseInt(endTime / 1000);
                                        let timer = setInterval(() => {
                                            res.list[i].countTime = this.$utils.countDown(time, false);
                                            if (!res.list[i].countTime) {
                                                clearInterval(timer)
                                            }
                                        }, 1000)
                                    }
                                }
                                this.list = this.list.concat(res.list);
                            }
                            this.page = this.page + 1;
                            this.is_comment = res.comment_setting.order_comment;
                            this.count = res.total
                        } else {
                            this.$toast(res.message)
                        }
                        this.loading = false;
                        this.graceLazyload.load(0, this)
                        this.reqesting = false
                    }).catch(res=>{
                        this.reqesting = false
                    }).finally(rej => {
                        this.$loading.hideLoading();
                        setTimeout(() => { //解决loading关不掉的bug
                            this.$loading.hideLoading();
                            uni.hideLoading()
                        }, 100)
                    })
            },
            btnClick(data) {
                
                let cache = {}
                switch (data.name) {
                    // 取消订单
                    case 'cancelOrder':
                        this.orderData = data.item;
                        this.cancelOrder()
                        break
                    // 去支付
                    case 'payOrder':
                        this.orderData = data.item;
                        setTimeout(() => {
                            this.payOrder()
                        }, 100)
                        break
                    // 查看物流
                    case 'express':
                        this.orderData = data.item; 
                        data.item.orderGoods.forEach(item=>{cache[item.package_id]=item.package_id})
                        let package_ids=Object.keys(cache);
                        if(package_ids.length==1){
                            this.express(package_ids[0])
                        }else{
                            this.express()
                        }
                        
                        break
                    // 确认收货
                    case 'sendOrder':
                        this.orderData = data.item;
                        this.sendOrder()
                        break
                    // 删除订单
                    case 'deleteOrder':
                        this.orderData = data.item;
                        this.deleteOrder()
                        break
                    // 评价
                    case 'comment':
                        this.orderData = data.item;
                        data.item.orderGoods.forEach(item=>{cache[item.id]=item.id})
                        let ids=Object.keys(cache);
                        if(ids.length==1){
                            this.comment(ids[0])
                        }else{
                            this.comment()
                        }
                        break
                }
            },
            cancelOrder() {
                this.$refs.modals.showCancelModal()
            },
            // 取消订单
            cancelOrderOk() {
                this.$api.orderApi.cancelOrder({id: this.orderData.id}).then(res => {
                    if (res.error == 0) {
                        this.page = 1
                        this.list = []
                        this.getList()
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
                this.$refs.orderPay.showPayPicker();
            },
            // 查看物流
            express(package_id) {
                // 如果有包裹id, 则进包裹详情
                console.log(package_id,'uuuuuuuuuuuuuu')
                if (package_id) {
                    this.$Router.auto({
                        path: '/kdxOrder/package/detail',
                        query: {
                            package_id: package_id,
                            order_id: this.orderData.id
                        }
                    })
                } else {
                    this.$Router.auto({
                        path: '/kdxOrder/package/list',
                        query: {
                            id: this.orderData.id
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
                this.$api.orderApi.finishOrder({id: this.orderData.id}, {errorToast: false}).then(res => {
                    if (res.error == 0) {
                        this.page = 1
                        this.list = []
                        this.getList();

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
            // 消费奖励数据
            getActivityData() {
                    this.$api.memberApi.getConsumeRewardActivity({order_id: this.orderData.id},{ errorToast: false }).then(res => {
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
                            this.visible = true
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
            deleteOrder() {
                this.$refs.modals.showDeleteModal()
            },
            // 删除订单
            deleteOrderOk() {
                this.$api.orderApi.deleteOrder({id: this.orderData.id}).then(res => {
                    if (res.error == 0) {
                        this.page = 1
                        this.list = []
                        this.getList()
                    } else {
                        uni.showToast({
                            title: res.message,
                            icon: 'none'
                        })
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
                            order_id: this.orderData.id
                        }
                    })
                }
            },
            toIndex() {
                this.$Router.auto({
                    //#ifndef H5
                    path: '/pages/index/index',
                    //#endif
                    //#ifdef H5
                    path: '/'
                    //#endif
                })
            },
            // 购物奖励数据
            async sendShoppingReward() {
                    const res = await this.$store.dispatch('member/sendShoppingReward', this.orderData.id)
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
                this.showShoppingRewardFlag = value
                if( JSON.stringify( this.showShoppingActivityData ) !== "{}" ) {
                    this.showShoppingVisible = true;
                }
            },
            // 消费奖励红包弹窗关闭
            changeCloseShopping(value) {
                this.showShoppingVisible = value.update;
            },
        },
        onReachBottom() {
            if (this.list.length == this.count && this.page > 1) return;
            this.getList()
        },
        //页面滚动时启动懒加载
        //此处如果图片在滚动区域内则监听滚动区域事件并传递 滚动区域的 scrollTop 值给 load函数
        onPageScroll(e) {
            this.graceLazyload.load(e.scrollTop, this);
        },
        // beforeDestroy() {
        //     clearInterval(this.timeInterval)
        // }
    }
</script>

<style lang="scss" scoped>
    .order-list {
        position: relative;
        min-height: 100vh;
        overflow: auto;
        background-color: $uni-bg-color-grey;

        .none {
            position: fixed;
            top: -99999rpx;
            left: -99999rpx;
            z-index: -99999;
        }
        .container {
            padding: 102rpx 24rpx 16rpx;
        }
    }
    /deep/ canvas{
        position: fixed;
        top: -99999rpx;
        left: -99999rpx;
        z-index: -99999;
    }
</style>