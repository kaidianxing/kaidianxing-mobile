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
        <view class="default-page flex-column">
            <view class="bg">
                <image :src="$utils.staticMediaUrl('default/invalid_goods.png')"  class="invalid-img"></image>
            </view>
            <view class="default-text">商品过期不存在</view>
        </view>
        <!-- 猜你喜欢 -->
        <goods-like></goods-like>
    </view>
</template>

<script>
import goodsLike from "../components/goods/GoodsLike";
export default {
    components: {
        goodsLike,
    },
    methods: {
        toIndex() {},
    },
};
</script>

<style lang="scss" scoped>
.default-page {
    padding: px2rpx(48) 0 px2rpx(32);
    background-color: #ffffff;

    .bg,
    .bg .invalid-img {
        width: px2rpx(145);
        height: px2rpx(160);
        border-radius: 0;
    }

    .default-text {
        margin-top: px2rpx(16);
        font-size: px2rpx(14);
        line-height: px2rpx(20);
    }

}
</style>
