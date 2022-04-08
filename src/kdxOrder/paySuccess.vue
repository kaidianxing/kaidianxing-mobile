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
    <theme-content navbarBg>
        <view class="pay-success">
        <!-- 支付成功 -->
        <view class="header flex-column theme-primary-bgcolor">
            <view class="title">
                <i class="iconfont-m- icon-m-yes1"></i>{{title}}
            </view>
            <view class="subtitle" v-if="isComment">谢谢您的用心评价，期待您的下次惠顾</view>
            <view class="flex">
                <block v-if="!isComment">
                    <view  class="btn" @click="toOrderDetail">订单详情</view>
                </block>
                <view class="btn" @click="toIndex">返回首页</view>
            </view>
        </view>
        <!-- 推荐商品 -->
        <goods-like></goods-like>
        <!-- 消费奖励弹窗 -->
        <modalReward :visible="visible" :activityType="activityType" :activityData="activityData" @update:visible="changeShowReward" ></modalReward>
        <!-- 消费奖励红包弹窗 -->
        <redpacket :isShow="customVisible" :activityType="activityType" :activityData="customActivityData"
                   @update:visible="changeCloseCustom"></redpacket>
        <!-- 购物奖励弹窗 -->
        <modalReward :visible="showShoppingRewardFlag" :activityType="shoppingReward" :activityData="shoppingRewardData" @update:visible="changeShowShoppingRewardFlag" ></modalReward>
        <!-- 购物奖励红包弹窗 -->
        <redpacket :isShow="showShoppingVisible" :activityType="shoppingReward" :activityData="showShoppingActivityData"
                   @update:visible="changeCloseShopping"></redpacket>
    </view>
    </theme-content>
</template>

<script>

    import goodsLike from './components/goods/GoodsLike'
    import modalReward from '@/components/modal-reward/ModalReward'
    import PageMixin from '@/common/PageMixin.js'
    import redpacket from '@/components/modal-reward/Redpacket'

    import {mapState} from "vuex";
    export default {
        mixins: [PageMixin],
        components: {
            goodsLike, modalReward, redpacket
        },
        props: {},
        data() {
            return {
                title: '支付成功',
                isComment: false,
                order_id: '',
                visible: false,
                customVisible: false, //消费奖励红包弹窗
                activityType: 'consumeReward',
                shoppingReward: 'shoppingReward',
                customActivityData: {}, //消费奖励红包内容
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
                showShoppingActivityData: {}, //购物奖励红包弹窗
                showShoppingVisible: false, //购物奖励红包弹窗
            }
        },
        computed: {
            ...mapState('orderCreate', ['dispatch_type']),
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.$Route.query.isComment) {
                    this.title = '评价成功';
                    this.isComment = true
                }
                uni.setNavigationBarTitle({
                    title: this.title
                });
                if (this.$Route.query.id) {
                    this.order_id = this.$Route.query.id
                }
                this.getActivityData();
                this.sendShoppingReward();
            },
            toOrderDetail() {
                let order_id = this.order_id
                // 处理多商户传的id是个数组
                if(Array.isArray(order_id)){
                   order_id = order_id[0]
                }
                this.$Router.replace({
                    path: '/kdxOrder/detail',
                    query: {
                        order_id
                    }
                })
            },
            toIndex() {
                this.$Router.replaceAll({
                    //#ifndef H5
                    path: '/pages/index/index',
                    //#endif
                    //#ifdef H5
                    path: '/'
                    //#endif
                })
            },
            toOrderlist() {
                this.$Router.replace({
                    path: '/kdxOrder/list',
                })
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
                    if (res.send_type && res.send_type === '0') {
                        this.shoppingRewardData.popup_type = res.popup_type
                        // 下单支付成功时 触发
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
                        this.showShoppingRewardFlag = true;
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
            // 消费奖励弹窗关闭
            changeShowReward(value) {
                this.visible = value;
                if( JSON.stringify( this.customActivityData ) !== "{}" ) {
                    this.customVisible = true;
                }
            },
            // 消费奖励红包弹窗关闭
            changeCloseCustom(value) {
                this.customVisible = value.close;
                this.customVisible = false;
            },
            // 购物奖励弹窗关闭
            changeShowShoppingRewardFlag(value) {
                this.showShoppingRewardFlag = value;
                if( JSON.stringify( this.showShoppingActivityData ) !== "{}" ) {
                    this.showShoppingVisible = true;
                }
            },
            // 消费奖励红包弹窗关闭
            changeCloseShopping(value) {
                this.showShoppingVisible = value.update;
                this.showShoppingVisible = false;
            },
        },
    }
</script>

<style lang="scss" scoped>
    .pay-success {
        min-height: 100%;
        background-color: $uni-bg-color-grey;
        .none {
            position: fixed;
            top: -99999rpx;
            left: -99999rpx;
            z-index: -99999;
        }
        .header {
            width: 100%;
            padding: 64rpx 0;
            margin-bottom: 48rpx;
            align-items: center;
            background: linear-gradient(to bottom, $uni-color-primary 0%, #FF6F29 94.38%);
            color: #fff;
            box-sizing: border-box;
            .title {
                font-size: 40rpx;
                line-height: 56rpx;
                i {
                    font-size: 48rpx;
                    margin-right: 10rpx;
                    vertical-align: middle;
                }
            }
            .subtitle {
                margin-top: 8rpx;
                font-size: 24rpx;
            }
            .btn {
                margin-top: 32rpx;
                width: 180rpx;
                height: 54rpx;
                line-height: 46rpx;
                color: #fff;
                font-size: 24rpx;
                text-align: center;
                border: 1px solid #fff;
                box-sizing: border-box;
                border-radius: 30rpx;
                &:first-child {
                    margin-right: 80rpx;
                }
                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
</style>