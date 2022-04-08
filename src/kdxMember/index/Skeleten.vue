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
    <div class='pages-memeber-skeleten'>
        <div class="memberInfo">
            <div class="info">
                <p class="img anim1"></p>
                <div class="titleBox">
                    <p class="title title1 anim2"></p>
                    <p class="title title2 anim3"></p>
                </div>
            </div>
            <div class="otherInfo">
                <p class='p1 anim1'></p>
                <p class='anim2'></p>
                <p class='anim2'></p>
            </div>
        </div>
        <div class="orderInfo">
            <div class="title-bar">
                <span class="title anim1"></span>
                <span class="subtitle anim3"></span>
            </div>
            <div class="orders">
                <p class='anim1'></p>
                <p class='anim2'></p>
                <p class='anim3'></p>
                <p class='anim2'></p>
                <p class='anim1'></p>
            </div>
        </div>
        <div class="navList">
            <p v-for='(item,index) in 10' :class='"anim"+(index%3+1)'></p>
        </div>
        <div class="box"></div>
    </div>
</template>

<script>
    export default {}
</script>

<style lang="scss" scoped>
    .pages-memeber-skeleten {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        display: flex;
        flex-direction: column;
        z-index: 9999;
        @keyframes blink {
            0% {
                opacity: 1;
            }
            100% {
                opacity: 0.3;
            }
        }
        .anim1 {
            animation: blink 1s linear 0s alternate infinite;
        }
        .anim2 {
            animation: blink 1s linear 0.5s alternate infinite;
        }
        .anim3 {
            animation: blink 1s linear 1s alternate infinite;
        }
        .memberInfo {
            background: #fff;
            width: 100%;
            height: 280rpx;
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
            .info {
                width: 100%;
                height: 180rpx;
                display: flex;
                .img {
                    width: 100rpx;
                    height: 100rpx;
                    left: 24rpx;
                    bottom: 148rpx;
                    background: #F5F5F5;
                    // border: 1rpx solid #E6E7EB;
                    box-sizing: border-box;
                    border-radius: 50%;
                    margin: 32rpx 20rpx 0 24rpx;
                }
                .titleBox {
                    width: 0;
                    flex: 1;
                    .title {
                        background: #f8f8f8;
                        border-radius: 4rpx;
                        height: 32rpx;
                        width: 320rpx;
                        ;
                    }
                    .title1 {
                        margin: 44rpx 0 0 0;
                    }
                    .title2 {
                        margin: 16rpx 0 0 0;
                        width: 160rpx;
                        height: 30rpx;
                    }
                }
            }
            .otherInfo {
                width: 100%;
                height: 0;
                flex: 1;
                display: flex;
                flex-wrap: nowrap;
                padding: 0 24rpx;
                p {
                    height: 68rpx;
                    width: 50%;
                    margin-right: 24rpx;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    &::after {
                       background: #f8f8f8;
                       &:last-child {
                         margin-right: 0;
                       }
                    }
                }
            }
        }
        .orderInfo {
            background: #fff;
            width: 702rpx;
            height: 260rpx;
            border-radius: 12rpx;
            margin: 16rpx auto;
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
            .title-bar {
                width: 100%;
                height: 80rpx;
                box-sizing: border-box;
                padding: 26rpx 28rpx;
                display: flex;
                justify-content: space-between;
                span {
                    height: 100%;
                    width: 128rpx;
                    border-radius: 4rpx;
                    background: #f8f8f8;
                }
                .subtitle {
                    width: 44rpx;
                }
            }
            .orders {
                display: flex;
                flex-wrap: nowrap;
                width: 100%;
                height: 0;
                flex: 1;
                p {
                    width: 20%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    box-sizing: border-box;
                    padding: 24rpx 0;
                    &::before,
                    &::after {
                        content: '';
                        margin: 0 auto;
                        border-radius: 4rpx;
                        background: #f8f8f8;
                    }
                    &::before {
                        width: 88rpx;
                        height: 88rpx;
                        border-radius: 50%;
                    }
                    &::after {
                        width: 68rpx;
                        height: 24rpx;
                    }
                }
            }
        }
        .navList {
            background: #fff;
            flex-shrink: 0;
            width: 702rpx;
            border-radius: 12rpx;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            padding: 0 24rpx;
            p {
                width: 100%;
                height: 96rpx;
                display: flex;
                justify-content: space-between;
                box-sizing: border-box;
                // border-bottom: 1rpx solid #f5f5f5;
                &::before,
                &::after {
                    content: '';
                    margin: auto 0;
                    border-radius: 4rpx;
                    background: #f8f8f8;
                }
                &::before {
                    width: 128rpx;
                    height: 28rpx;
                }
                &::after {
                    width: 44rpx;
                    height: 28rpx;
                }
            }
        }
        .box {
             background-image: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5) 50%, transparent 100%), linear-gradient(#DDD 74px, transparent 0), linear-gradient(#DDD 16px, transparent 0), linear-gradient(#DDD 24px, transparent 0);
             background-repeat: no-repeat;
             background-size: 50px 170px, 100% 74px, 100% 16px, 100% 32px;
             background-position: 0 0, 0 0, 0 85px, 0 110px;
         }
    }
</style>