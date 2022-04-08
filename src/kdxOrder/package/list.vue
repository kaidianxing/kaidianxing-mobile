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
        <view class="package-list">
            <view class="container">
                <view class="package-item" v-for="(item, index) in list" :key="index" @click="toDetail(item.id)">
                    <view class="rr-cell">
                        <view class="flex">
                            <view class="label flex1">
                                <text class="uni-text-color">包裹{{index+1}}（共{{item.goods_count}}件商品）</text>
                            </view>
                            <view class="more uni-text-color-grey">
                                <text>已发货</text>
                                <i class="iconfont-m- icon-m-right"></i>
                            </view>
                        </view>
                    </view>
                    <!-- 商品信息 -->
                    <view class="goods-item" v-for="(goodsItem, goodsIndex) in item.goods_list" :key="goodsIndex">
                        <goods-card :goodsData="goodsItem"></goods-card>
                    </view>
                </view>
            </view>
        </view>
    </page-box>
</template>

<script>

    import goodsCard from '../components/GoodsInfo'
    import PageMixin from '@/common/PageMixin.js'
    export default {
        mixins: [PageMixin],
        name: "list",
        components: {
            goodsCard
        },
        props: {},
        data() {
            return {
                order_id: '',
                list: [],
            }
        },
        computed: {},
        created() {
        },
        mounted() {
            this.order_id = this.$Route.query.id;
            this.getList()
        },
        methods: {
            getList(){
                this.$api.orderApi.getPackageList({order_id: this.order_id}).then(res => {
                    if (res.error == 0) {
                        this.list = res.list
                    } else {
                        uni.showToast({
                            title: res.message
                        })
                    }
                })
            },
            toDetail(id) {
                this.$Router.auto({
                    path: '/kdxOrder/package/detail',
                    query: {
                        package_id: id,
                        order_id: this.order_id
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .package-list {
        .container {
            padding: 16rpx 24rpx;
        }
        .package-item {
            margin-bottom: 16rpx;
            background-color: #fff;
            border-radius: 12rpx;
            overflow: hidden;
            .rr-cell {
                height: 96rpx;
                line-height: 96rpx;
                .flex {
                    border-bottom: 1px solid $uni-border-color;
                }
                text {
                    font-size: 28rpx;
                }
                .more {
                    text {
                        color: #FF9900;
                    }
                    i {
                        vertical-align: middle;
                    }
                }
            }
            .goods-item {
                padding: 32rpx 24rpx;
            }
        }
    }
</style>