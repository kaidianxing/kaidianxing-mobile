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
    <view class="action">
        <view class="action-list">
            <view class="refund-action" v-if="btnRole.refund">
                <refund-cell
                    prefixIcon="icon-m-jintuikuan1"
                    title="仅退款"
                    rightIcon="icon-m-right"
                    custom-class="refund"
                    @click.native="submitRefund('1')"
                />
            </view>
            <view class="refund-action" v-if="btnRole.exchange">
                <refund-cell
                    prefixIcon="icon-m-huanhuo1"
                    title="换货"
                    rightIcon="icon-m-right"
                    custom-class="exchange-goods"
                    @click.native="submitRefund('3')"
                />
            </view>
            <view class="refund-action" v-if="btnRole.return">
                <refund-cell
                    prefixIcon="icon-m-tuihuotuikuan"
                    title="退货退款"
                    rightIcon="icon-m-right"
                    custom-class="refund-goods"
                    @click.native="submitRefund('2')"
                />
            </view>
        </view>
    </view>
</template>

<script>
import RefundCell from '../RefundCell'
export default {
    props: {
        btnRole: {
            type: Object,
            default: () => {},
        },
        query: {
            type: Object,
            default: () => {},
        },
    },
    components: {
        RefundCell,
    },
    methods: {
        submitRefund(refund_type) {
            let query = { ...this.query, refund_type }

            this.$Router.auto({
                path: '/kdxOrder/refund/action',
                query,
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.action {
    border-radius: 12rpx;
    overflow: hidden;

    &-list {
        background-color: #fff;
    }
}
</style>
