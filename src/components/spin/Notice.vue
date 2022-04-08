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
    <div class='notice-page'>
        <view class="img-box">
            <img class="close-img" :style='imgStyle' :src="$utils.staticMediaUrl(componentData.imgName)" />
            <view class="close-text">{{componentData.tip}}</view>
        </view>
        <div class="wrap">
            <btn :classNames="['w100']" :ghost="true" type="do" v-if='componentData.showBtn!==false' size="middle" @btn-click="toIndex">{{componentData.content||'去首页'}}</btn>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            imgStyle:{
                type:String,
                default: ''
            },
            componentData:{
                type:Object,
                default: () => ({
                    imgName:'shop_app_expire.png',
                    tip:'该功能已下架，暂不能访问'
                })
            },
        },
        methods: {
            toIndex() {
                this.$emit('custom-event', {
                    target: 'noticeModules/toIndex',
                    data: this.componentData
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .notice-page {
        width: 100%;
        height: 100%;
        position: relative;
        .img-box {
            padding-top: px2rpx(90);
            .close-img {
                display: block;
                margin: 0 auto;
                width: px2rpx(145);
                height: px2rpx(160);
            }
            .close-text {
                margin-top: px2rpx(16);
                font-size: px2rpx(12);
                text-align: center;
                line-height: px2rpx(20);
                color: #969696;
            }
        }
        .btn {
            margin: px2rpx(30) auto;
            border-radius: px2rpx(64);
            width: px2rpx(100);
            height: px2rpx(32);
            font-size: px2rpx(14);
            line-height: px2rpx(30);
            font-weight: px2rpx(600);
            text-align: center;
            color: #ff3c29;
            /*background: #ffffff;*/
            border: 1rpx solid #ff3c29;
        }
    }
    .wrap{
        padding-top:px2rpx(24);
        text-align: center;
    }
</style>