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
    <view class="order-goods-card">
        <view class="order-item" v-for="(item, index) in list" :key="item.id">
            <view class="member flex">
                <view class="flex align-center">
                    <view class="avatar" :style="{'background-image': `url(${$utils.staticMediaUrl('decorate/avatar_mobile.png')})`}">
                        <image :src="$utils.mediaUrl(item.avatar)" alt="" mode="widthFix"></image>
                    </view>
                    <text class="nickname">{{item.nickname}}</text>
                </view>
                <block>
                    <view v-if="item.status == 0" class="status uni-color-primary">待付款</view>
                    <view v-if="item.status == 10" class="status">
                        <span class="orange">待发货</span>
                    </view>
                    <view v-if="item.status == 11" class="status orange">部分发货</view>
                    <view v-if="item.status == 20" class="status blue">待收货</view>
                    <view v-if="item.status == 30" class="status success">已完成</view>
                    <view v-if="item.status == -1" class="status">已关闭</view>
                </block>
            </view>
            <view class="goods" v-for="(goodsItem, goodsIndex) in item.orderGoods" :key="goodsIndex">
                <view class="goods-card-item">
                    <view class="goods-card-inner flex">
                        <view class="goods-img-box" :style="{'background-image': `url(${$utils.staticMediaUrl('decorate/goods_col2.png')})`}">
                            <image class='grace-img-lazy goods-img' :src="$utils.mediaUrl(goodsItem.thumb)" :style="goodsImg"/>
                        </view>
                        <view class="goods-info flex1 flex-column flex-between">
                            <view class="goods-title">
                                <view class="title two-line-hide">{{goodsItem.title}}</view>
                                <view v-if="goodsItem.option_title" class="option-title line-hide">{{goodsItem.option_title}}</view>
                            </view>
                            <view class="price-slot">
                                <view class="flex flex-between">
                                    <view>
                                        <text class="price uni-text-color">￥<text style="font-size: 28rpx;">{{goodsItem.price}}</text></text>
                                        <text class="goods-count uni-text-color-grey">X{{goodsItem.total}}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="commission-price">预计佣金：<span :class="{'uni-color-primary':item.orderGoods.length < 2}">+{{goodsItem.commission || 0}}元</span>
                    <span class="commission-price color" v-if="goodsItem.ladder_commission > 0 && goodsItem.has_changed == 0">(含阶梯{{params.commission}}￥{{goodsItem.ladder_commission}})</span>
                    <span class="commission-price color" v-if="goodsItem.ladder_commission > 0 && goodsItem.has_changed == 1">(含阶梯{{params.commission}})</span>
                </view>
            </view>
            <!-- 商品数量 -->
            <view class="goods-num" v-if="item.orderGoods.length > 1">
                共{{item.orderGoods.length}}件商品，预计佣金<span class="uni-color-primary">+<span style="font-size: 32rpx">{{item.commission}}元</span></span>
            </view>
            <view class="more" v-if="!active[index]" @click="clickItem(index)">
                <text class="uni-text-color-grey">查看更多信息</text>
                <i class="iconfont-m- icon-m-down uni-text-color-grey"></i>
            </view>
            <!-- 订单信息 -->
            <view class="order-more-info" v-if="active[index]">
                <view>分销等级：{{item.level}}级</view>
                <view>订单编号：{{item.order_no}}</view>
                <view>下单时间：{{item.created_at}}</view>
            </view>
        </view>
    </view>
</template>

<script>

    import goodsInfo from '../goods/GoodsInfo'

    export default {
        name: "OrderGoodsCard",
        components: {
            goodsInfo
        },
        props: {
            list: {
                type: Array
            }
        },
        data() {
            return {
                goodsImg: {
                    width: '160rpx',
                    height: '160rpx'
                },
                active: {}
            }
        },
        computed: {
            params() {
                return this.$store.state.commissionSet.commissionSetting
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            clickItem(index) {
                this.active[index] = !this.active[index];
                this.active = { ...this.active}
            },
            // toOrderDetail(id) {
            //     this.$Router.auto({
            //         path: '/kdxOrder/detail',
            //         query: {
            //             order_id: id,
            //         },
            //     })
            // },
        },
    }
</script>

<style lang="scss" scoped>
    .order-goods-card {
        .order-item {
            padding-left: 24rpx;
            margin-bottom: 16rpx;
            background-color: #fff;
            border-radius: 12rpx;
            .member {
                justify-content: space-between;
                align-items: center;
                height: 80rpx;
                line-height: 80rpx;
                border-bottom: 1px solid $uni-border-color;
                .avatar {
                    width: 52rpx;
                    height: 52rpx;
                    margin-right: 16rpx;
                    border-radius: 50%;
                    background-size: contain;
                    image {
                        width: 52rpx;
                        height: 52rpx;
                        margin-right: 16rpx;
                        border-radius: 50%;
                    }
                }
                .nickname {
                    font-weight: 700;
                    color: $uni-text-color;
                }
                .status {
                    padding-right: 24rpx;
                    font-size: 28rpx;
                }
                 .primary {
                    color: #ff3c29;
                    font-size: 28rpx;
                    font-weight: 700;
                }
                .orange {
                    color: #FF9900;
                }
                .blue {
                    color: #367BF5;
                }
                .success {
                    color: #09C15F;
                }
            }
            .goods {
                padding: 32rpx 24rpx 32rpx 0;
                .commission-price {
                    margin-top: 16rpx;
                    font-size: 24rpx;
                    text-align: right;
                    color: $uni-text-color;
                    .uni-color-primary {
                        font-weight: 700;
                    }
                    &.color {
                        color: #939799;
                        margin-left: px2rpx(10);
                    }
                }
            }
            .goods-num {
                padding: 16rpx 24rpx;
                line-height: 34rpx;
                font-size: 24rpx;
                text-align: right;
                span {
                    font-weight: 700;
                }
            }
            .more {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 16rpx 0;
                font-size: 20rpx;
                line-height: 28rpx;
                text-align: center;
                border-top: 1px solid $uni-border-color;
            }
            .order-more-info {
                padding: 16rpx 0;
                border-top: 1px solid $uni-border-color;
                >view {
                    margin-bottom: 16rpx;
                    line-height: 34rpx;
                    font-size: 24rpx;
                    color: $uni-text-color-grey;
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
        }
        .goods-card-item {
            position: relative;
            .option-title {
                width: fit-content;
                margin-top: 1px;
                padding: 1px 16rpx;
                color: $uni-text-color-grey;
                font-size: 20rpx;
                background: $uni-bg-color-grey;
                border-radius: 22rpx;
            }
            .price-slot {
                .price {
                    color: $uni-text-color;
                }
            }
            .goods-count {
                margin-left: 24rpx;
                font-size: 20rpx;
            }
            &::after {
                border: 0;
            }
            .goods-card-inner {
                .goods-img-box {
                    width: 160rpx;
                    height: 160rpx;
                    margin-right: 24rpx;
                    border-radius: 12rpx;
                    background-position: 0% 0%;
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                    .goods-img {
                        width: 160rpx;
                        height: 160rpx;
                        border-radius: 12rpx;
                    }
                }
            }
        }
    }
</style>