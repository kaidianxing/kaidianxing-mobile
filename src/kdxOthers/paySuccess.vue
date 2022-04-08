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
    <view class="pay-success">
        <div class="iconfont-m- icon-m-alipay-zhifuchenggong"></div>
        <div class="status">支付成功</div>
        <div class="tips">请返回微信公众号商城</div>
    </view>
</template>

<script>
export default {
    data() {
        return {}
    },
    mounted() {},
    methods: {},
}
</script>

<style lang="scss" scoped>
.pay-success {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 144rpx;
    .iconfont-m- {
        width: 200rpx;
        height: 200rpx;
        font-size: 200rpx;
        display: flex;
        align-items: center;
        color: #1678ff;
    }
    .status {
        font-weight: bold;
        font-size: 32rpx;
        line-height: 44rpx;
        text-align: center;
        color: #1678ff;
        margin-top: 32rpx;
        margin-bottom: 16rpx;
    }
    .tips {
        font-size: 28rpx;
        line-height: 40rpx;
        color: #969696;
    }
}
</style>
