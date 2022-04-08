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
        <view class="to-account">
            <view class="commission-price">
                <i class="iconfont-m- icon-m-pay-def-pay"></i>
                <view class="title">{{params.wait_account_commission}}（元）</view>
                <view class="price">{{commissionTotal}}</view>
            </view>
            <!-- 列表 -->
            <view class="container">
                <view class="order-goods-card">
                    <view class="order-item" v-for="item in list" :key="item.id">
                        <view class="member flex">
                            <view style="font-size: 24rpx;">
                                <text class="uni-text-color-grey">{{item.created_at}}</text>
                            </view>
                            <view class="status uni-text-color-grey">
                                {{params.commission}}：<text class="uni-color-primary">￥<text class="primary-price">{{item.commission}}</text></text>
                            </view>
                        </view>
                        <view class="goods">
                            <view class="goods-card-item" @click="toDetail(item.goods_id)">
                                <view class="goods-card-inner flex">
                                    <image class="goods-img" :src="$utils.mediaUrl(item.thumb)" :style="goodsImg"></image>
                                    <view class="goods-info flex1 flex-column flex-between">
                                        <view class="goods-title">
                                            <view class="title two-line-hide">{{item.title}}</view>
                                            <view v-if="item.option_title" class="option-title line-hide">{{item.option_title}}</view>
                                        </view>
                                        <view class="content">
                                            <text class="price uni-text-color">￥<text style="font-size: 28rpx;">{{item | handlePrice}}</text></text>
                                            <text class="goods-count uni-text-color-grey">X{{item.total}}</text>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <!--加载更多  -->
                <page-loading v-if="list.length != count" :loadingType="loadingType"></page-loading>
            </view>
        </view>
    </page-box>
</template>

<script>
    import goodsInfo from './components/goods/GoodsInfo'
    import PageMixin from '@/common/PageMixin.js'
    export default {
        mixins: [PageMixin],
        name: "toAccount",
        components: {
            goodsInfo
        },
        props: {},
        data() {
            return {
                commissionTotal: '',
                list: [],
                page: 1,
                loading: false,
                count: 0,
                goodsImg: {
                    width: '160rpx',
                    height: '160rpx'
                },
            }
        },
        computed: {
            params() {
                return this.$store.state.commissionSet.commissionSetting
            },
            loadingType() {
                let loadingType = 0;
                if (this.loading) {
                    loadingType = 1
                } else if (this.list.length == this.count && this.count > 0 && this.loading == false && this.list.length > 20) {
                    loadingType = 2
                }
                return loadingType
            }
        },
        created() {
        },
        beforeMount() {
            uni.setNavigationBarTitle({
                title: this.params?.wait_account_commission
            })
        },
        mounted() {
            this.getCommissionTotal()
        },
        methods: {
            getCommissionTotal() {
                // uni.showLoading({title:'加载中'})
                this.loading = true;
                this.$api.commissionApi.getWaitSettlementTotal({}).then(res => {
                    if (res.error == 0) {
                        this.commissionTotal = res.total;
                        this.getList();
                    }
                })
            },
            getList() {
                this.$api.commissionApi.getWaitSettlement({page: this.page}).then(res => {
                    if (res.error == 0) {
                        if (res.list.length > 0) {
                            this.list = this.list.concat(res.list);
                            this.page = this.page + 1;
                        }
                        this.loading = false;
                        this.count = res.total;
                    } else {
                        this.$toast(res.message)
                    }
                    this.graceLazyload.load(0, this);
                }).finally(rej => {
                    uni.hideLoading()
                })
            },
            toDetail(id) {
                this.$Router.auto({
                    path: '/kdxGoods/detail/index',
                    query: {
                        goods_id: id
                    }
                })
            },
        },
        filters: {
            handlePrice(data) {
                return data.price
            }
        }
    }
</script>

<style lang="scss" scoped>
    .to-account {
        position: relative;
        padding: 16rpx 24rpx;
        min-height: 100vh;
        overflow: auto;
        box-sizing: border-box;
        .commission-price {
            position: relative;
            margin-bottom: 16rpx;
            background-color: #367BF5;
            border-radius: 12rpx;
            color: #fff;
            overflow: hidden;
            .icon-m-pay-def-pay {
                position: absolute;
                right: -106rpx;
                top: -96rpx;
                font-size: 274rpx;
                color: #fff;
                transform: rotate(-33.75deg);
                opacity: 0.3;
            }
            .title {
                padding: 24rpx 0 16rpx 24rpx;
                line-height: 40rpx;
            }
            .price {
                padding: 0 0 16rpx 24rpx;
                font-size: 96rpx;
                line-height: 134rpx;
            }
        }
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
                    .status {
                        padding-right: 24rpx;
                        font-size: 24rpx;
                    }
                }
                .goods {
                    padding: 32rpx 24rpx 32rpx 0;
                    .goods-count {
                        margin-left: 24rpx;
                        font-size: 20rpx;
                    }
                }
                .goods-num {
                    padding: 16rpx 24rpx;
                    line-height: 34rpx;
                    font-size: 24rpx;
                    text-align: right;
                }
            }
        }
        .goods-card-item {
            position: relative;
            .label-icon {
                position: absolute;
                .hot,
                .recommend{
                    font-size: 24rpx;
                    color: #fff;
                }
            }
            .goods-card-inner {
                .goods-img {
                    width: 240rpx;
                    height: 240rpx;
                    margin-right: 24rpx;
                    border-radius: 12rpx;
                }
                .goods-info {
                    .title {
                        line-height: 38rpx;
                        color: $uni-text-color;
                        font-size: 24rpx;
                    }
                    .option-title {
                        width: fit-content;
                        margin-top: 1px;
                        padding: 1px 16rpx;
                        color: $uni-text-color-grey;
                        font-size: 20rpx;
                        background: $uni-bg-color-grey;
                        border-radius: 22rpx;
                    }
                    .price {
                        color: $uni-text-color;
                    }
                }
            }
            .goods-card-inner.flex-column {
                .goods-img {
                    width: 344rpx;
                    height: 344rpx;
                    border-radius: 12rpx 12rpx 0 0;
                }
            }
        }
    }
</style>