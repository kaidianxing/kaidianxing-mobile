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
    <theme-content>
    <view class="content">
        <div class="icon">
            <img :src="icon" alt="" />
        </div>
        <div class="tips">{{ tips }}</div>
        
        <btn styles="width:312rpx;margin: 34rpx 0 52rpx 0;" classNames="theme-primary-color theme-primary-border" :ghost="true" size="middle" @btn-click="jumpIndex">去逛逛</btn>
        <!-- 猜你喜欢 -->
        <goods-like ></goods-like>
    </view>
    </theme-content>
</template>

<script>
import goodsLike from '../../components/goods/GoodsLike'
export default {
    props: ['from'],
    components: {
        goodsLike,
    },
    data() {
        return {
            icon: '',
            tips: '',
        }
    },
    methods: {
        // 返回商城首页
        jumpIndex() {
            this.$Router.replace({
                //#ifndef H5
                path: '/pages/index/index',
                //#endif
                //#ifdef H5
                path: '/'
                //#endif
            })
        }
    },
    watch: {
        from: {
            handler(val) {
                if (val === 'collection') {
                    this.icon = this.$utils.staticMediaUrl('default/collection.png')
                    this.tips = '暂时没有收藏的商品哦'
                } else if (val === 'pug') {
                    this.icon = this.$utils.staticMediaUrl('default/footprint.png')
                    this.tips = '暂时没有浏览过的商品哦'
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
        margin-bottom: 48rpx;
    }
}
</style>
