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
    <view>
        <view class="refund-proofs">
            <refund-cell
                title="上传凭证"
                label="(选填，最多可上传5张)"
            ></refund-cell>
            <view class="proofs">
                <select-img
                    ref="selectImg"
                    :maxFileNumber="5"
                    @change="imgChange"
                    :items="imgList"
                ></select-img>
            </view>
        </view>
        <view class="freight">
            运费结算规则：订单中所有商品均未发货的情况下，运费会随着订单里的最后一件商品退款退回，若订单中有商品发货，则运费不退回
        </view>
    </view>
</template>
<script>
import SelectImg from '../../SelectImg'
import RefundCell from '../RefundCell'

export default {
    props: {
        imgList: {
            type: Array,
            default: () => [],
        },
    },
    components: {
        SelectImg,
        RefundCell,
    },
    methods: {
        imgChange(e) {
            this.$emit('change', e)
        },
    },
}
</script>
<style lang="scss" scoped>
.refund-proofs {
    overflow: hidden;
    border-radius: 12rpx;
    margin-bottom: 16rpx;
    background-color: #fff;

    .proofs {
        padding: 32rpx 23rpx;
    }
}

.freight {
    font-weight: 300;
    padding: 0 24rpx;
    margin-bottom: 16rpx;
    font-size: 24rpx;
    line-height: 34rpx;
    color: $uni-text-color-grey;
}
</style>
