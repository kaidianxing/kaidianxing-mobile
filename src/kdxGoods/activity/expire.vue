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
        <view class="expire">
            <image :src="$utils.staticMediaUrl('default/expire.png')" class="expire-img" />
            <view class="expire-desc">当前活动已结束</view>
            <view class="expire-btn theme-primary-color theme-primary-border" @click="toIndex">去首页</view>
        </view> 
    </page-box>
</template>


<script>
export default {
    methods: {
        toIndex() {
            // #ifdef H5
            this.$Router.replaceAll({
                path: '/',
            })
            // #endif
            // #ifndef H5
            this.$Router.replaceAll({
                path: '/pages/index/index',
            })
            // #endif
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/ .page-bg {
 height: 100%;
    background: #fff;
}
.expire {
    padding-top: px2rpx(90);
   
    text-align: center;

    .expire-img {
        margin-bottom: px2rpx(24);
        width: px2rpx(145);
        height: px2rpx(160);
    }

    .expire-desc {
        margin-bottom: px2rpx(24);
        font-size: px2rpx(14);
        line-height: px2rpx(20);
        color: #969696;
    }

    .expire-btn {
        margin: 0 auto;
        box-sizing: border-box;
        border-radius: px2rpx(20);
        width: px2rpx(100);
        height: px2rpx(32);
        font-size: px2rpx(14);
        text-align: center;
        line-height: px2rpx(32);
        font-weight: 600;
        border: px2rpx(1) solid;
    }
}
</style>