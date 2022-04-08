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
    <div class="good-skeleten">
        <div class="good-img"></div>
        <div class="good-info">
            <p class="title">
                <span class="word1 anim1"></span>
                <span class="word2 anim2"></span>
            </p>
            <p class="subtitle">
                <span class='anim3'></span>
                <span class='anim1' style="width: 70%"></span>
                <span class='anim2' style="width:60%;   background-color: #ffffff"></span>
            </p>
            <p class="info" style="background-color: #ffffff"></p>
            <p class="otherInfo">
                <span class='anim1'></span>
                <span class='anim2'></span>
                <span class='anim3'></span>
            </p>
        </div>
        <div class="good-spec">
            <span class='anim3' style="width: 100rpx"></span>
            <span class='anim2' style="width:50%;"></span>
        </div>
        <div class="good-active">
            <p class="label">
                <span class='anim3'></span>
            </p>
            <p class="content">
                <span v-for="item in 3" :key="item" :style='{width:(8-item)*10+"%"}'></span>
            </p>
        </div>
        <div class="good-navbar">
            <p class="icon anim1"></p>
            <p class="icon anim2"></p>
            <p class="icon anim3"></p>
            <p class="btn"></p>
        </div>
    </div>
</template>

<script>
    export default {};
</script>

<style lang="scss" scoped>
    @keyframes blink {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0.3;
        }
    }
    .good-skeleten {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        z-index: 999999;
        background: #ffffff;
        .anim1 {
            animation: blink 1s linear 0s alternate infinite;
        }
        .anim2 {
            animation: blink 1s linear 0.5s alternate infinite;
        }
        .anim3 {
            animation: blink 1s linear 1s alternate infinite;
        }
        .good-img {
            width: 100%;
            height: 100vw;
            background: #f8f8f8;
        }
        .good-info {
            box-sizing: border-box;
            padding: 24rpx 24rpx;
            background: #fff;
            .title {
                width: 100%;
                height: 36rpx;
                display: flex;
                justify-content: space-between;
                margin: 4rpx 0;
                .word1 {
                    background: #FFF2F1;
                    height: 100%;
                    width: 298rpx;
                    border-radius: 4rpx;
                }
                .word2 {
                    height: 100%;
                    width: 74rpx;
                    background: #f8f8f8;
                    border-radius: 4rpx;
                }
            }
            .subtitle {
                width: 100%;
                display: flex;
                flex-direction: column;
                span {
                    background: #f8f8f8;
                    border-radius: 4rpx;
                    height: 24rpx;
                    margin: 16rpx 0 0;
                }
            }
            .info {
                background: #f8f8f8;
                border-radius: 4rpx;
                height: 20rpx;
                margin: 16rpx 0 0;
                width: 40%;
            }
            .otherInfo {
                display: flex;
                justify-content: space-between;
                margin: 24rpx 0 6rpx;
                span {
                    width: 120rpx;
                    height: 24rpx;
                    background: #f8f8f8;
                    border-radius: 4rpx;
                }
            }
        }
        .good-spec {
            width: 100%;
            box-sizing: border-box;
            padding: 24rpx 24rpx;
            background: #fff;
            margin: 20rpx auto;
            display: flex;
            position: relative;
            span {
                width: 10%;
                height: 25rpx;
                background: #f8f8f8;
                border-radius: 4rpx;
                margin-right: 20rpx;
            }
        }
        .good-active {
            background: #fff;
            margin: 0 auto 20rpx;
            height: 0;
            width: 100%;
            flex: 1;
            display: flex;
            flex-wrap: nowrap;
            padding: 0 24rpx;
            box-sizing: border-box;
            p {
                display: flex;
                flex-direction: column;
                justify-content: center;
                span {
                    width: 10%;
                    height: 25rpx;
                    background: #f8f8f8;
                    border-radius: 4rpx;
                }
            }
            .label {
                height: 100%;
                width: 100rpx;
                flex-shrink: 0;
                span {
                    width: 90%;
                }
            }
            .content {
                width: 0;
                flex: 1;
                height: 100%;
                span {
                    width: 30%;
                    margin: 10rpx;
                }
            }
        }
        .good-navbar {
            width: 100%;
            height: 96rpx;
            bottom: 0;
            left: 0;
            background: #fff;
            display: flex;
            flex-wrap: nowrap;
            p {
                height: 100%;
                &::after,
                &::before {
                    content: "";
                }
            }
            .icon {
                width: 14%;
                flex-shrink: 0;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                box-sizing: border-box;
                padding: 10rpx 0;
                &::after,
                &::before {
                    background: #f8f8f8;
                    border-radius: 4rpx;
                    margin: auto;
                }
                &::after {
                    width: 40rpx;
                    height: 20rpx;
                }
                &::before {
                    width: 40rpx;
                    height: 40rpx;
                }
            }
            .btn {
                width: 0;
                flex: 1;
                display: flex;
                justify-content: center;
                &::after,
                &::before {
                    height: 100%;
                    width: 45%;
                    height: 68rpx;
                    background: #f8f8f8;
                    border-radius: 4rpx;
                    margin: auto 0;
                }
                &::after {
                    background: #f8f8f8;
                    //background: linear-gradient(159.88deg, #FF3C29 0%, #FF6F29 94.38%);
                    border-radius: 0 40rpx 40rpx 0;
                }
                &::before {
                    background: #f8f8f8;
                    border-radius: 40rpx 0 0 40rpx;
                }
            }
        }
    }
</style>