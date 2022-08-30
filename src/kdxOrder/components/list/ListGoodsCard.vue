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
    <view class="list-goods-card">
        <view class="card-item" v-for="(item, index) in orderList" :key="index" @click="toDetail(item.id)">
            <view class="create-time flex">
                <!-- 创建时间 -->
                <block>
                    <!-- 单店铺 -->
                    <div class="uni-text-color-grey">{{item.created_at}}</div>
                </block>
                <!-- 订单状态 -->
                <block>
                    <view class="status success" v-if="item.refund_finish && item.refund_finish=='1'">售后完成</view>
                    <view v-else>
                        <view v-if="item.status == 0" class="status uni-color-primary">待付款</view>
                        <view v-if="item.status == 10" class="status">
                            <span class="primary" v-if="isLoadGroups(item)">待成团</span>
                            <span class="orange" v-else>待发货</span>
                        </view>
                        <view v-if="item.status == 11" class="status orange">部分发货</view>
                        <view v-if="item.status == 20" class="status blue">待收货</view>
                        <view v-if="item.status == 30" class="status success">已完成</view>
                        <view v-if="item.status == -1" class="status">已关闭</view>
                    </view>
                </block>
            </view>
            <!-- 商品信息 -->
            <view class="goods-item" v-for="(goodsItem, goodsIndex) in item.orderGoods" :key="goodsIndex">
                <goods-card :goodsData="goodsItem" :status="item.status" :orderData="item" @detail="toGoodsDetail($event, item.activity_type)"></goods-card>
            </view>
            <!-- 订单合计 -->
            <view class="card-footer">
                <div>共{{item.orderGoods.length}}件商品，{{item.format_text}}
                    <span class="price">
                        <span v-if="item.pay_credit" class="price theme-primary-colo">
                            {{ item.pay_credit+credit_text }}+
                        </span>
                        ￥{{item.pay_price}}
                    </span>
                </div>
                <div v-if="item.status == 0 && item.countTime.length > 0" class="uni-color-primary">
                    <span>{{item.countTime[0]}}天</span>
                    <span>{{item.countTime[1]}}小时</span>
                    <span>{{item.countTime[2]}}分</span>
                    <span>{{item.countTime[3]}}秒</span>
                    <span>{{item.count_text}}</span>
                </div>
            </view>
            <!-- 操作按钮 -->
            <view class="card-btn flex" v-if="showFooterBtn(item)">
                <block v-if="item.refund_finish && item.refund_finish=='1'">
                    <view @click.stop="btnClick('deleteOrder', item)">删除订单</view>
                </block>
                <block v-else>
                    <block v-if="item.status == 0">
                        <view @click.stop="btnClick('cancelOrder', item)">取消订单</view>
                    </block>
                    <view v-if="item.status == 0"
                          :class="item.is_buy?'disabled':'border-primary theme-primary-color theme-primary-border'"
                          @click.stop="btnClick('payOrder', item, item.is_buy)">去支付</view>
                     <!-- 待发货实体商品显示查看物流 -->
                    <view v-if="((item.status == 20 && item.orderGoods[0].type === '0') || (item.status == 11 || item.status == 30)) && item.dispatch_type === '10'"
                          @click.stop="btnClick('express', item)">查看物流</view>
                    <view v-if="item.status == 20"
                            class="border-primary theme-primary-color theme-primary-border"
                            @click.stop="btnClick('sendOrder', item)">确认收货</view>
                    <block v-if="item.activity_type ==3 && item.status ==10">
                        <view class="border-primary theme-primary-color theme-primary-border" @click.stop="btnClick('toGroups', item)">查看团详情</view>
                    </block>
                    <view v-if="item.status == 30 || item.status == -1"
                          @click.stop="btnClick('deleteOrder', item)">删除订单</view>
                    <!-- 订单状态为已完成并且后台开启订单评价显示 -->
                    <view v-if="item.status == 30 && is_comment == 1 && item.comment_status == 0 && item.activity_type !== '5'"
                          class="border-primary theme-primary-color theme-primary-border"
                          @click.stop="btnClick('comment', item)">评价</view>
                </block>
            </view>
        </view>
    </view>
</template>

<script>

    import goodsCard from '../GoodsInfo'
    import {mapState} from "vuex";

    export default {
        name: "ListGoodCard",
        components: {
            goodsCard
        },
        props: {
            list: {
                type: Array,
                default: () => []
            },
            is_comment: {
                type: [String, Number],
                default: 0
            }
        },
        data() {
            return {
                orderList: [],
                cancelModal: false,
            }
        },
        watch: {
            list: {
                handler(newValue) {
                    newValue = newValue.map(item => {
                        return {
                            ...item,
                            count_text: '后订单关闭',
                            format_text: this.formatText(item) || '总金额',
                            is_buy: false
                        }
                    });
                    this.orderList = newValue
                },
                deep: true,
                immediate: true
            }
        },
        computed: {
            ...mapState('setting', {
                credit_text: state => state.systemSetting.credit_text,
            }),
            backgroundImage() {
                return `background-image:url(${this.$utils.staticMediaUrl('decorate/logo_default.png')})`
            }
        },
        created() {},
        mounted() {},
        methods: {
            formatText(data) {
                return '总金额'
            },
            showFooterBtn(item){
               let showStaus = ['-1', '0', '10' ,'11', '20', '30'];
               return (item.refund_finish && item.refund_finish=='1') || showStaus.includes(item.status)
            },
            btnClick(name, item, type) {
                if (type) {
                    return
                }
                this.$emit('btnClick', {name, item})
            },
            isLoadGroups(item){
                return (item.activity_type=='3'&& item.groups_team_info?.success=='0') || (item.activity_type=='4'&& item.groups_rebate_team_info?.success=='0') || (item.activity_type=='6'&& item.groups_fission_team_info?.success=='0')
            },
            toDetail(id) {
                this.$Router.auto({
                    path: '/kdxOrder/detail',
                    query: {
                        order_id: id
                    }
                })
            },
            toGoodsDetail(e, type) {
                let path, query = ''
                if (type === '5'){
                    path = '/kdxCreditShop/detail',
                    query = {id: e.id}
                } else {
                    path = '/kdxGoods/detail/index'
                    query = {goods_id: e.id}
                }
                this.$Router.auto({
                    path,
                    query
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
    .list-goods-card {
        .card-item {
            padding: 0 24rpx;
            margin-bottom: 16rpx;
            background-color: #fff;
            border-radius: 12rpx;
            .create-time {
                height: 72rpx;
                margin-bottom: 16rpx;
                line-height: 72rpx;
                align-items: center;
                justify-content: space-between;
                > view {
                    font-size: 24rpx;
                }
                .shop-item {
                    display: flex;
                    align-items: center;
                    font-size: px2rpx(14);
                    .shop-logo {
                        margin-right: px2rpx(8);
                        width: px2rpx(24);
                        height: px2rpx(24);
                        font-size: px2rpx(14);
                        background-size: 100% 100%;
                        background-repeat: no-repeat;
                    }
                    .shop-img {
                        width: px2rpx(24);
                        height: px2rpx(24);
                        border-radius: 50%;
                    }
                    .self-label {
                        margin-right: px2rpx(4);
                        padding: px2rpx(1) px2rpx(3);
                        line-height: px2rpx(12);
                        background: linear-gradient(132.57deg, #FF3C29 0%, #FF6F29 94.38%);
                        color: #fff;
                        font-size: px2rpx(9);
                        font-weight: 600;
                        border-radius: px2rpx(2);
                    }
                    .shop-name {
                        line-height: 20px;
                    }
                }
                .status {
                    color: $uni-text-color-grey;
                    font-size: 28rpx;
                    font-weight: 700;
                }
                .primary {
                    color: #ff3c29;
                    font-size: 28rpx;
                    font-weight: 700;
                }
                .orange {
                    color: #FF9900;
                    font-size: 28rpx;
                    font-weight: 700;
                }
                .blue {
                    color: #367BF5;
                }
                .success {
                    color: #09C15F;
                }
            }
            .goods-item {
                padding-bottom: 32rpx;
                &:first-child {
                    padding-top: 32rpx;
                }
            }
            .card-footer {
                text-align: right;
                padding-bottom: 32rpx;
                >div {
                    line-height: 44rpx;
                    font-size: 24rpx;
                    color: $uni-text-color;
                    &.uni-color-primary {
                        font-family: PingFang SC;
                        font-variant-numeric: tabular-nums;
                        font-family: Helvetica Neue;
                        line-height: 34rpx;
                        margin-top: 8rpx;
                    }
                }
                .price {
                    font-weight: 700;
                    font-size: 32rpx;
                }
            }
            .card-btn {
                justify-content: flex-end;
                padding-bottom: 16rpx;

                >view {
                    padding: 11rpx 30rpx;
                    line-height: 34rpx;
                    font-size: 24rpx;
                    text-align: center;
                    border-radius: 28rpx;
                    color: $uni-text-color;
                    border: 1px solid $uni-border-color;
                        margin-right: 24rpx;
                    &:last-child {
                        margin-right: 0;
                    }
                }
                .border-primary {
                    border: 1px solid $uni-color-primary;
                }
                .disabled {
                    color: #ccc;
                    border: 1px solid #ccc;
                }
            }
        }
    }
</style>
