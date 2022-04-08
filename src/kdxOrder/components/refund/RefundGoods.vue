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
    <view class="main-content">
        <view class="main-layout">
            <refund-cell title="申请售后的商品" />
            <view class="refund-goods">
                <goods-info
                    v-if="goodsInfo.length == 1"
                    :goods-data="goods"
                    @detail="goDetail"
                />
                <refund-goods-list
                    v-else
                    :items="goodsInfo"
                    @detail="goDetail"
                ></refund-goods-list>
            </view>
        </view>
    </view>
</template>

<script>
import RefundCell from './RefundCell'
import RefundGoodsList from './RefundGoodsList'
import GoodsInfo from '../GoodsInfo'
export default {
    props: {
        orderGoodsId: String,
        goodsInfo: {
            type: Array,
            default: () => [],
        },
    },
    components: {
        RefundCell,
        RefundGoodsList,
        GoodsInfo,
    },
    data() {
        return {
            goods: {}
        }
    },
    watch: {
        goodsInfo: {
            handler() {
                this.goods = this.goodsInfo[0]
            },
            immediate: true,
        },
    },
    computed: {
        backgroundImage() {
            return `background-image:url(${this.$utils.staticMediaUrl('decorate/logo_default.png')})`
        }
    },
    methods: {
        goDetail(params) {
            let id, goodsData
            if(params.goodsData){//单品售后
                goodsData = params.params
                id = params.id
            }else{//整单售后
                goodsData = params.plugin_identification
                id = params.goods_id
            }
            let path, query = ''
            path = '/kdxGoods/detail/index'
            query = { goods_id :id }
            this.$Router.auto({
                path,
                query
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.main-content {
    margin: 16rpx 0;
    border-radius: 12rpx;
    overflow: hidden;
    background-color: #fff;

    .main-layout {
        background-color: #fff;
    }
    .shop-item {
        display: flex;
        align-items: center;
        margin-bottom: px2rpx(16);
        font-size: px2rpx(14);
        .shop-logo {
            margin-right: px2rpx(8);
            width: px2rpx(24);
            height: px2rpx(24);
            background-size: 100% 100%;
            background-repeat: no-repeat;
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
        .shop-img {
            width: px2rpx(24);
            height: px2rpx(24);
            border-radius: 50%;
        }
        .shop-name {
            line-height: 20px;
        }
    }
    .refund-goods {
        padding: 32rpx 24rpx 16rpx;
        background-color: #fff;
        /deep/ .goods-block-inner {
            margin-bottom: 16rpx;
        }
    }

    /deep/ .img-list {
        &-items {
            margin-right: 24rpx;
            margin-bottom: 16rpx;
            height: 140rpx;
            width: 140rpx;
            border: 0;

            &:nth-child(4n) {
                margin-right: 0;
            }

            .price {
                position: absolute;
                bottom: 0;
                left: 0;
                border-radius: 0px 0px 4rpx 4rpx;
                width: 100%;
                height: 32rpx;
                font-size: 20rpx;
                text-align: center;
                line-height: 32rpx;
                color: #fff;
                background: rgba(#212121, 0.7);
            }
        }
    }
}
</style>
