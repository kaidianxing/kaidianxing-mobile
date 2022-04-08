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
    <view class="goods-info">
        <!-- 维权商品 -->
        <refund-goods
            :order-goods-id="orderGoodsId"
            :goods-info="goodsInfo"
        ></refund-goods>
        <view class="content">
            <view class="refund-cell" v-for="cell in cells" :key="cell.id">
                <span class="refund-cell-title">{{ cell.title }}</span>
                <span
                    class="refund-cell-label"
                    :class="{
                        'theme-primary-color': cell.refund,
                        'theme-primary-price': cell.money,
                        'refund-cell-credit theme-primary-price': cell.credit,
                    }"
                >
                    {{ cell.money ? '¥' + refund[cell.key] : refund[cell.key] }}
                </span>
            </view>
            <view class="proofs" v-if="imgList">
                <select-img :items="imgList" readonly></select-img>
            </view>
        </view>
    </view>
</template>

<script>
import RefundGoods from '../RefundGoods'
import SelectImg from '../../SelectImg'

export default {
    props: {
        orderGoodsId: String,
        goodsInfo: {
            type: Array,
            default: () => [],
        },
        refund: {
            type: Object,
            default: () => {},
        },
        imgList: {
            type: Array,
            default: () => [],
        },
    },
    components: {
        RefundGoods,
        SelectImg,
    },
    data() {
        return {
            cells: [
                {
                    title: '处理方式：',
                    key: 'refund_type_text',
                    refund: true,
                },

                {
                    title: '退款说明：',
                    key: 'content',
                },
                {
                    title: '申请时间：',
                    key: 'created_at',
                },
            ],
        }
    },
    computed: {
        credit_text() {
            return (this.$store.state.setting?.systemSetting?.credit_text || '积分')
        }
    },
    mounted() {
        if (this.refund.refund_type !== 3) {
            this.cells.splice(1, 0, {
                title: '退款金额：',
                key: 'price',
                money: true,
            })
            if (this.refund.credit > 0) {
                this.cells.splice(2, 0, {
                    title: `退款${this.credit_text}：`,
                    key: 'credit',
                    credit: true
                })
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.goods-info {
    overflow: hidden;
    border-radius: 12rpx;
    background-color: #fff;

    .content {
        margin-left: 24rpx;
        padding-right: 24rpx;
        padding-bottom: 16rpx;
        border-top: 2rpx dashed #e6e7eb;
    }

    .proofs {
        margin-top: 16rpx;
    }

    .refund-cell {
        margin-top: 16rpx;
        display: flex;

        &-title {
            // width: 120rpx;
            min-width: 60px;
            font-size: 24rpx;
            line-height: 34rpx;
            color: $uni-text-color-grey;
        }

        &-label {
            width: 120rpx;
            font-size: 24rpx;
            line-height: 34rpx;
            color: $uni-text-color;
            word-break: break-all;
            flex: 1;
        }

        &-money, &-credit {
            color: $uni-color-primary;
        }
    }
}
</style>
