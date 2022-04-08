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
    <view class="content">
        <div class="icon">
            <img :src="$utils.staticMediaUrl('default/coupon.png')" alt="" />
        </div>
        <div class="tips">{{ tips }}</div>
        
        <btn v-if="couponFrom === '2'" styles="width:312rpx;margin:32rpx 0 66rpx 0;"  classNames="theme-primary-border theme-primary-color" :ghost="true" size="middle" @btn-click="jumpCouponCenter">前往领取中心</btn>
    </view>
</template>

<script>
export default {
    props: ['couponFrom'],
    data() {
        return {
            tips: '暂时还没有优惠券哦，快去领取吧'
        }
    },
    onLoad() {},
    methods: {
        jumpCouponCenter() {
            this.$emit('jumpCouponCenter')
        }
    },
    watch: {
        couponFrom: {
            handler(val) {
                if (val === '1') {
                    this.tips = '暂时还没有优惠券'
                } else if (val === '2') {
                    this.tips = '暂时还没有优惠券哦，快去领取吧'
                }
            },
            immediate: true
        }
    }
}
</script>

<style lang="scss" scoped>
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .icon {
        padding-top: 96rpx;
        width: 200rpx;
        height: 200rpx;
        box-sizing: content-box;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .tips {
        font-size: 24rpx;
        line-height: 34rpx;
        color: #969696;
        margin-top: 32rpx;
        font-weight: 500;
    }
    .btn {
        width: 284rpx;
        height: 64rpx;
        box-sizing: border-box;
        border-radius: 32rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2rpx solid #ff3c29;
        font-weight: bold;
        font-size: 28rpx;
        line-height: 40rpx;
        color: #ff3c29;
        margin-top: 32rpx;
    }
}
</style>
