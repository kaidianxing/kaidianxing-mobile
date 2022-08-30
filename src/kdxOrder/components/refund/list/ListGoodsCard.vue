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
        <view class="card-item" v-for="(item, index) in orderList" :key="index">
            <view class="create-time flex" >
                <view class="uni-text-color-grey refund-status">
                    <view
                        class="iconfont-m- status-icon"
                        :class="[getClass(item.refund_type)]"
                    ></view>
                    <view class="refund-type">
                        {{ item.refund_type | getType }}
                    </view>
                </view>
                <block >
                    <view class="uni-text-color-grey order-time">
                        {{ item.created_at }}
                    </view>
                </block>
            </view>
            <!-- 商品 -->
            <view class="refund-goods">
                <goods-info
                    isRefund
                    v-if="item.order_goods.length == 1"
                    :goods-data="item.order_goods[0]"
                    @detail="goGoodsDetail($event, item)"
                />
                <refund-goods-list
                    v-else
                    :items="item.order_goods"
                ></refund-goods-list>
            </view>
            <view class="card-btn flex">
                <block>
                    <view
                        v-if="item.status == -1"
                        class="btn-default"
                        @click.stop="toDetail(item)"
                        >售后失败</view
                    >
                    <view
                        v-if="item.status >= 0 && item.status <= 9"
                        class="btn-primary theme-primary-border theme-primary-color"
                        @click.stop="toDetail(item)"
                        >申请售后中</view
                    >
                    <view
                        v-if="item.status == 10 || item.status == 11"
                        class="btn-success"
                        @click.stop="toDetail(item)"
                        >售后完成</view
                    >
                </block>
            </view>
        </view>
    </view>
</template>

<script>
import RefundGoodsList from '../RefundGoodsList'
import GoodsInfo from '../../GoodsInfo'

export default {
    name: 'ListGoodCard',
    components: {
        RefundGoodsList,
        GoodsInfo
    },
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            orderList: [],
            cancelModal: false
        }
    },
    watch: {
        list: {
            handler(newValue) {
                this.orderList = newValue
            }
        }
    },
    computed: {
        backgroundImage() {
            return `background-image:url(${this.$utils.staticMediaUrl('decorate/logo_default.png')})`
        }
    },
    methods: {
        toDetail({ order_id, order_goods_id }) {
            let query = {
                order_id
            }

            if (order_goods_id !== '0') {
                query.order_goods_id = order_goods_id
            }

            this.$Router.auto({
                path: '/kdxOrder/refund/detail',
                query
            })
        },

        goGoodsDetail(e, params) {
            let path, query = ''
            if (params.activity_type === '5'){
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
        getClass(refund_type) {
            let classes = {
                '1': 'icon-m-jintuikuan1 refund',
                '2': 'icon-m-tuihuotuikuan return',
                '3': 'icon-m-huanhuo1 exchange'
            }

            return classes[refund_type]
        }
    },
    filters: {
        getType(refund_type) {
            let typeList = {
                '1': '退款',
                '2': '退货退款',
                '3': '换货'
            }

            return typeList[refund_type]
        }
    }
}
</script>

<style lang="scss" scoped>
.list-goods-card {
    .card-item {
        padding: 16rpx 24rpx;
        margin-bottom: 16rpx;
        background-color: #fff;
        border-radius: 12rpx;
        .create-time {
            justify-content: space-between;
            padding-bottom: 16rpx;
            .status-icon {
                display: inline-block;
                margin-right: 8rpx;
                font-size: 36rpx;
                width: 36rpx;
                height: 36rpx;
                transform: translateY(-2rpx);
                &.refund {
                    color: $uni-color-primary;
                }

                &.return {
                    color: #367bf5;
                }

                &.exchange {
                    color: #ff9900;
                }
            }
            .shop-item {
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
            .refund-status {
                display: flex;
                align-items: center;
                .refund-type {
                    color: $uni-text-color;
                    font-size: 28rpx;
                    line-height: 40rpx;
                }
            }

            .order-time {
                line-height: 40rpx;
            }

            > view {
                font-size: 24rpx;
            }
            .status {
                color: $uni-text-color-grey;
                font-size: 28rpx;
                font-weight: 700;
            }
        }
        .goods-item {
            padding: 32rpx 24rpx;
        }
        .refund-goods {
            padding: 32rpx 0;
            background-color: #fff;
        }

        .card-footer {
            text-align: right;
            > view {
                line-height: 34rpx;
                font-size: 24rpx;
                &:last-child {
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
            > view {
                padding: 11rpx 30rpx;
                line-height: 34rpx;
                font-size: 24rpx;
                text-align: center;
                border-radius: 30rpx;
                border: 1px solid $uni-border-color;
                &:last-child {
                    margin-left: 24rpx;
                }
            }
            .btn-primary {
                border: 1px solid $uni-color-primary;
                color: $uni-color-primary;
            }

            .btn-success {
                border: 1px solid #09c15f;
                color: #09c15f;
            }

            .btn-default {
                border: 1px solid $uni-border-color;
                color: $uni-text-color;
            }
        }
    }
}
</style>
