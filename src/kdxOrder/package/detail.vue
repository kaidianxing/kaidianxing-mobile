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
        <view class="order-package-detail">
            <view class="container">
                <!-- 商品信息 -->
                <view class="goods-item" v-for="(item, index) in order_goods" :key="index">
                    <goods-card :goodsData="item"></goods-card>
                </view>
                <!-- 物流信息 -->
                <view class="express">
                    <package-express :expressData="expressData"></package-express>
                </view>
            </view>
        </view>
    </page-box>
</template>

<script>

    import goodsCard from '../components/GoodsInfo'
    import packageExpress from '../components/package/PackageExpress'
    import PageMixin from '@/common/PageMixin.js'
    export default {
        mixins: [PageMixin],
        name: "detail",
        components: {
            goodsCard, packageExpress
        },
        props: {},
        data() {
            return {
                package_id: '',
                order_id: '',
                expressData: {},
                order_goods: [],
            }
        },
        computed: {},
        created() {
        },
        mounted() {
            this.package_id = this.$Route.query.package_id;
            this.order_id = this.$Route.query.order_id;
            this.getData()
        },
        methods: {
            getData() {
                this.$api.orderApi.getPackage({package_id: this.package_id, order_id: this.order_id}).then(res => {
                    if (res.error == 0) {
                        this.expressData = res;
                        this.order_goods = res.order_goods
                    } else {
                        uni.showToast({
                            title: res.message
                        })
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .order-package-detail {
        .container {
            padding: 16rpx 24rpx;
            .goods-item {
                padding: 32rpx 24rpx;
                background-color: #fff;
                border-radius: 12rpx;
            }
        }
    }
</style>