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
    <view class="apply-goods">
        <view class="apply-title border-b">
            <text>成为</text>
            <text class="uni-color-primary">{{basicData.name}}</text>
            <text class="uni-color-primary">{{commissionSetting.agent_name}}</text>
        </view>
        <view class="content">
            <view class="info">
                <view>任意选购<text class="uni-color-primary">1</text>件商品即可成为<text class="uni-color-primary">{{commissionSetting.agent_name}}</text></view>
            </view>
            <view class="goods-content">
                <view class="item" v-for="item in goodsList" :key="item.id">
                    <goods-info :goodsData="item" :isAddIcon="true" @custom-event='eventHandler' :quickPurchase="true"></goods-info>
                </view>
            </view>
        </view>
    </view>
</template>

<script>

    import goodsInfo from '../goods/GoodsInfo'
    import {mapState} from "vuex";

    export default {
        name: "ApplyGoods",
        components: {
            goodsInfo
        },
        props: {
            goodsList: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
            }
        },
        computed: {
            ...mapState('commissionSet', {
                commissionSetting: state => state.commissionSetting,
            }),
            ...mapState('setting', {
                basicData: state => state.systemSetting?.basic,
            }),
        },
        created() {
        },
        mounted() {
        },
        methods: {
            eventHandler(e){
                this.$emit('custom-event',e)
            },
        },
    }
</script>

<style lang="scss" scoped>
    .apply-goods {
        background-color: #fff;
        border-radius: 12rpx;
        .apply-title {
            height: 80rpx;
            line-height: 80rpx;
            text-align: center;
            color: $uni-text-color;
            font-size: 28rpx;
        }
        .border-b {
            border-bottom: 1px solid $uni-border-color;
        }
        .content {
            .info {
                padding: 64rpx 100rpx;
                line-height: 44rpx;
                text-align: center;
            }
            .goods-content {
                .item {
                    padding: 16rpx 24rpx;
                }
                /deep/ .item:last-child {
                    .goods-card-item::after {
                        border: 0;
                    }
                }
            }
        }
    }
</style>