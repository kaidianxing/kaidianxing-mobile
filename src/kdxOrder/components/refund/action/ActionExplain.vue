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
    <view class="refund-explain">
        <refund-cell :title="`${title}说明`" label="(必填)"></refund-cell>
        <view>
            <textarea
                class="refund-text"
                :placeholder="`请输入${title}说明`"
                :value="value"
                @input="inputHandler"
                placeholder-class="refund-text-placeholder"
            ></textarea>
        </view>
    </view>
</template>
<script>
import RefundCell from '../RefundCell'
export default {
    props: {
        title: String,
        value: String,
    },
    components: {
        RefundCell,
    },
    methods: {
        inputHandler({ target: { value } }) {
            this.$emit('input', value)
        },
    },
}
</script>

<style lang="scss" scoped>
.refund-explain {
    overflow: hidden;
    margin-bottom: 16rpx;
    border-radius: 12rpx;
    background: #ffffff;

    .refund-text {
        box-sizing: border-box;
        padding: 16rpx 24rpx;
        height: 192rpx;
        font-size: 28rpx;
        line-height: 40rpx;
        color: $uni-text-color;

        &-placeholder {
            color: $uni-text-color-grey;
        }
    }
}
</style>
