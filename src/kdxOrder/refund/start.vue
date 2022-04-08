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
        <view class="main">
            <!-- 维权商品 -->
            <refund-goods
                v-if="goods_info"
                :order-goods-id="query.order_goods_id"
                :goods-info="goods_info"
            ></refund-goods>

            <!-- 维权类型选择 -->
            <start-type :btn-role="btn_role" :query="query"/>
        </view>
    </page-box>
</template>

<script>
import RefundGoods from '../components/refund/RefundGoods'
import StartType from '../components/refund/start/StartType'
import PageMixin from '@/common/PageMixin.js'

export default {
    mixins: [PageMixin],
    components: {
        RefundGoods,
        StartType
    },
    data() {
        return {
            goods_info: null,
            btn_role: {},
            query: {
                order_id: ''
            },
        }
    },

    mounted() {
        this.initQuery()
        this.canRefund()
    },
    methods: {
        initQuery() {
            let {order_id, order_goods_id, need_platform} = this.$Route.query
            this.query.order_id = order_id
            if (order_goods_id) {
                this.query = {...this.query, order_goods_id}
            }
            if (need_platform) {
                this.query = {...this.query, need_platform}
            }
        },
        // 判断是否可以维权
        canRefund() {
            this.$api.orderApi.refundInfo(this.query).then(res => {
                if (res.error === 0) {
                    let {refund_type, goods_info} = res
                    this.btn_role = refund_type
                    this.goods_info = goods_info
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/ .gBody {
    background-color: #f5f5f5;
}

.main {
    padding: 0 24rpx;
}

/deep/ .main-content {
    .cell {
        margin-left: 12px;
        padding-left: 0;
        padding-right: 0;
    }

    .img-list {
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
                border-radius: 0px 0px 4 rpx 4 rpx;
                width: 100%;
                height: 32rpx;
                font-size: 16rpx;
                text-align: center;
                line-height: 32rpx;
                color: #fff;
                background: rgba(#212121, 0.7);
            }
        }
    }
}

/deep/ .action {
    &-list {
        .refund-action {
            &:last-child {
                .cell {
                    .cell-inner {
                        border-bottom: none;
                    }
                }
            }
        }

        .cell {
            height: 112rpx;

            .cell-inner {
                height: 112rpx;
            }
        }

        .refund-action:last-child {
            .cell:last-child {
                border-bottom: 0;
            }
        }

        .refund {
            .title,
            .prefix,
            .tip {
                color: $uni-color-primary;
            }
        }

        .refund-goods {
            .title,
            .prefix {
                color: #367bf5;
            }
        }

        .exchange-goods {
            .title,
            .prefix {
                color: #ff9900;
            }
        }
    }
}
</style>
