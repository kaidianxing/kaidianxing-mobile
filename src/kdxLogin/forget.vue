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
    <page-box noLogin>
        <view class="forget-box">
            <view class="title">密码找回</view>
            <forget-code></forget-code>
        </view>
    </page-box>
</template>
<script>
import ForgetCode from './components/forget/ForgetCode'
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    components: {
        ForgetCode
    },
}
</script>

<style lang="scss" scoped>
/deep/ .grace-page-body {
    background-color: #fff;
}

.forget-box {
    margin: 80rpx auto 0;
    width: 588rpx;
    min-height: 100vh;

    .title {
        margin-bottom: 104rpx;
        font-size: 48rpx;
        line-height: 68rpx;
        text-align: center;
        color: $uni-text-color;
    }

    /deep/ .my-long-button {
        margin: 96rpx auto 0;
        width: 590rpx;
    }
}
</style>