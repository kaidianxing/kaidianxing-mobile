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
    <view class="detail-order-goods">
        <div>
            <!-- 商品 -->
            <div class="goods-item" v-for="(item, index) in orderGoods" :key="index" @click="toGoodsDetail(item.goods_id, orderData.activity_type)">
                <goods-card :goodsData="item" :status="orderData.status" :orderData="orderData">
                    <template slot="btn">
                        <view class="refund-btn" :class="{'mBottom': showRefund(item) || showDetail(item)}">
                            <block v-if="orderGoods[0].type != '2'">
                                <view v-if="showRefund(item)" @click.stop="canRefund(item.id)">申请售后</view>
                                <view v-if="showDetail(item)" @click.stop="goRefundDetail(item.id)">售后详情</view>
                            </block>
                        </view>
                    </template>
                </goods-card>
            </div>
        </div>
        <div v-if="orderData.status == '30' && orderGoods && orderGoods[0].type == '2'">
            <!-- 虚拟卡密商品 - 卡密信息且已完成状态显示 -->
            <account-info :orderData="orderData" :orderGoods="orderGoods"></account-info>
        </div>
        <!-- 发货信息 -->
        <div class="delivery-information" v-if="orderData.status === '30' && orderGoods[0].type === '1' && orderGoods[0].auto_deliver === '1' && orderGoods[0].auto_deliver_content">
            <div class="delivery-information-tit">发货信息</div>
            <div class="delivery-information-info">
                <div class="left">{{ orderGoods[0].auto_deliver_content }}</div>
                <div class="right theme-primary-color" @click="handleCopy">复制</div>
            </div>
        </div>
    </view>
</template>

<script>
    import goodsCard from '../GoodsInfo'
    import FormInfo from "../FormInfo";
    import AccountInfo from "../AccountInfo";

    export default {
        name: 'DetailOrderGoods',
        components: {
            goodsCard,
            FormInfo,
            AccountInfo
        },
        props: {
            orderGoods: {
                type: Array,
                default: () => []
            },
            orderData: {
                type: Object,
                default: () => {}
            },
            order_id: [Number, String]
        },
        data() {
            return {
                isRefund: '0',
                info: {},
                refund_type: ''
            }
        },
        computed: {
            // 是否支持单品维权
            allowSingle() {
                return this.info.refund_setting?.single_refund_enable === '1'
            },
            // 订单完成时时检测维权时间是否在范围内
            allowFinish() {
                return this.info.refund_setting?.refund_time_status === 1
            },
            backgroundImage() {
                return `background-image:url(${this.$utils.staticMediaUrl('decorate/logo_default.png')})`
            },
        },
        watch: {
            orderData: {
                handler(val) {
                    let { is_refund, refund_type, ...info } = val
                    this.info = info
                    this.refund_type = refund_type
                    this.isRefund = is_refund
                },
                immediate: true
            }
        },
        methods: {
            checkOrderSts({ status }) {
                let flag = true
                // 状态为30时检测维权时间是否在范围内
                if (status === '30') {
                    flag = this.allowFinish
                } else if( status == '-1') {
                    flag = false
                } else {
                    let pass = ['10', '11', '20']
                    flag = pass.indexOf(status) > -1
                }
                return flag
            },
            isSingle({ is_single_refund }, status) {
                return this.refund_type !== '1' && is_single_refund === status
            },
            hasAccord({ refund_rule }) {
                return Object.values(refund_rule).some(v => v === '1')
            },
            showRefund(item) {
                return (
                    (this.isRefund === '0' || this.isRefund == '1') &&
                    this.hasAccord(item) &&
                    this.isSingle(item, '0') &&
                    this.checkOrderSts(item) &&
                    this.allowSingle &&
                    !(this.orderData.status === '20' && this.orderData.dispatch_type === '30')
                )
            },
            showDetail(item) {
                return (
                    this.isRefund === '1' &&
                    this.isSingle(item, '1')
                )
            },
            canRefund(order_goods_id) {
                let query = { order_id: this.order_id }

                if (order_goods_id) {
                    query.order_goods_id = order_goods_id
                }

                this.$api.orderApi.refundInfo(query).then(res => {
                    if (res.error === 0) {
                        this.$Router.auto({
                            path: '/kdxOrder/refund/start',
                            query
                        })
                    }
                })
            },
            goRefundDetail(order_goods_id) {
                let query = { order_id: this.order_id }

                if (order_goods_id) {
                    query.order_goods_id = order_goods_id
                }

                this.$Router.auto({
                    path: '/kdxOrder/refund/detail',
                    query
                })
            },
            toGoodsDetail(id, type) {
                let path, query = ''
                path = '/kdxGoods/detail/index'
                query = {goods_id :id}
                this.$Router.auto({
                    path,
                    query
                })
            },
            // 复制发货内容
            handleCopy() {
                if (!this.orderGoods[0].auto_deliver_content) {
                    return
                }
                uni.setClipboardData({
                    data: this.orderGoods[0].auto_deliver_content,
                    success: () => {
                        this.$toast('复制成功')
                    }
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
.detail-order-goods {
    margin: 16rpx 0;
    overflow: hidden;

 

    .goods-item {
        background-color: #fff;
        padding: px2rpx(16) 24rpx px2rpx(8);
        .goods-form-info {
            border-top: 1rpx solid #E6E7EB;
            border-radius: 0;
            padding-left: 0;
        }
        &:first-child {
            border-top-left-radius: 12rpx;
            border-top-right-radius: 12rpx;
        }
        &:last-child {
            border-bottom: none;
            border-bottom-left-radius: 12rpx;
            border-bottom-right-radius: 12rpx;
        }
    }
    .shop-item {
        padding-left: px2rpx(12);
        display: flex;
        align-items: center;
        font-size: px2rpx(14);
        .shop-logo {
            margin-right: px2rpx(8);
            width: px2rpx(24);
            height: px2rpx(24);
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
    .refund-btn {
        margin-top: px2rpx(8);
        display: flex;
        justify-content: flex-end;
        &.mBottom {
            margin-top: px2rpx(16);
        }
        > view {
            font-size: 24rpx;
            line-height: 34rpx;
            padding: 10rpx 28rpx;
            border: 1px solid $uni-border-color;
            border-radius: 40rpx;
            color: $uni-text-color;
        }
    }
    .delivery-information {
        background-color: #fff;
        margin-top: 16rpx;
        border-radius: 12rpx;
        padding-left: 24rpx;
        .delivery-information-tit {
            padding-top: 20rpx;
            padding-bottom: 20rpx;
            border-bottom: 1rpx solid #E6E7EB;
            font-size: 28rpx;
            line-height: 40rpx;
            color: #212121;
        }
        .delivery-information-info {
            display: flex;
            padding-top: 32rpx;
            padding-bottom: 32rpx;
            padding-right: 24rpx;
            .left {
                flex: 1;
                padding-right: 32rpx;
                font-size: 28rpx;
                line-height: 40rpx;
                color: #212121;
                word-break: break-all;
            }
            .right {
                font-size: 24rpx;
                line-height: 34rpx;
            }
        }
    }
}
</style>
