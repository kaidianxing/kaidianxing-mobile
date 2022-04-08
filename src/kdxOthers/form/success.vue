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
        <view class="success">
            <view class="success-box">
                <image :src="$utils.staticMediaUrl('submit_success.png')" class="success-img" />
                <view class="success-text">提交成功</view>
            </view>
            <view class="back-btn" @click="toIndex">返回首页</view>
        </view>
    </page-box>
</template>


<script>
export default {
    methods: {
         toIndex() {
            this.$Router.replaceAll({
                //#ifndef H5
                path: '/pages/index/index',
                //#endif
                //#ifdef H5
                path: '/'
                //#endif
            })
        },
    }
}
</script>


<style lang="scss" scoped>

.success {
    height: 100vh;
    background:#fff;
    padding-top: px2rpx(167);

    .success-box {
        text-align: center;
    }
    .success-img {
        display:block;
        margin: 0 auto;
        height: px2rpx(56);
        width: px2rpx(56);
    }

    .success-text {
        margin-top: px2rpx(16);
        font-size: px2rpx(16);
        line-height: px2rpx(22);
        color: #212121;
    }

    .back-btn {
        margin: px2rpx(32) auto 0;
        border: px2rpx(1) solid #FF3C29;
        border-radius: px2rpx(32);
        height: px2rpx(40);
        width: px2rpx(167);
        text-align: center;
        line-height: px2rpx(40);
        color: #ff3c29;
    }
}


</style>