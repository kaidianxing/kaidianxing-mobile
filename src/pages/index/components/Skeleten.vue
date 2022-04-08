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
    <div>
        <div class='app-loading-skeleten'>
            <div class="search"></div>
            <div class="swiper">
                <div class='dots'>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p style="background:#fff"></p>
                </div>
            </div>
            <div class="btns">
                <p class="btn anim1"></p>
                <p class="btn anim2"></p>
                <p class="btn anim3"></p>
                <p class="btn anim1"></p>
                <p class="btn anim2"></p>
                <p class="btn anim3"></p>
                <p class="btn anim1"></p>
                <p class="btn anim2"></p>
                <p class="btn anim3"></p>
                <p class="btn anim1"></p>
            </div>
            <div class="title"></div>
            <div class="goods">
                <p class="good"></p>
                <p class="good"></p>
                <p class="good-info"></p>
                <p class="good-info"></p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {}
</script>

<style lang="scss" scoped>
    @keyframes blink {
        0%{
            opacity: 1;
        }
        100%{
            opacity: 0.3;
        }
    }
    .search {
        width: 100%;
        height: 12.2vw;
        display: flex;
        background: #fff;
        flex-shrink: 0;
        &::after {
            content: '';
            width: 93.6vw;
            height: 8vw;
            background: rgba(0, 0, 0, 0.12);
            opacity: 0.3;
            border-radius: 5vw;
            margin: auto;
        }
    }
    .app-loading-skeleten {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        display: flex;
        flex-direction: column;
        z-index: 9999;
    }
    .app-loading-skeleten .swiper {
        width: 93.6vw;
        height: 37.8vw;
        background: #f8f8f8;
        border-radius: 1vw;
        margin: 2vw auto;
        flex-shrink: 0;
        position: relative;
        .dots {
            position: absolute;
            width: 100%;
            height: 1vw;
            display: flex;
            justify-content: center;
            bottom: 2vw;
            left: 0;
        }
        p {
            width: 2vw;
            height: 100%;
            margin: 0 1vw;
            border-radius: 1vw;
            background: rgba(255, 255, 255, 0.54);
        }
    }
    .app-loading-skeleten .btns {
        width: 93.6vw;
        height: 47vw;
        border-radius: 1vw;
        background: #fff;
        margin: 2vw auto;
        box-sizing: border-box;
        padding: 0;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        flex-shrink: 0;
    }
    .app-loading-skeleten .btn {
        width: 20%;
        height: 23.5vw;
        margin: auto;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 12rpx 0;
        box-sizing: border-box;
        &::after,
        &::before {
            content: '';
            width: 12vw;
            background: #F5F5F5;
            margin: auto;
        }
        &::after {
            height: 4vw;
            border-radius: 0.6vw;
        }
        &::before {
            height: 12vw;
            border-radius: 50%;
        }
        &.anim1{
            animation: blink 1s linear 0s alternate infinite;
        }
        &.anim2{
            animation: blink 1s linear  0.5s alternate infinite;
        }
        &.anim3{
            animation: blink 1s linear 1s alternate infinite;
        }
    }
    .app-loading-skeleten .title {
        margin: 3vw auto;
        width: 40.5vw;
        height: 3vw;
        background: #f8f8f8;
        border-radius: 1vw;
        flex-shrink: 0;
    }
    .app-loading-skeleten .goods {
        width: 93.6vw;
        display: flex;
        flex-wrap: wrap;
        margin: auto;
        justify-content: space-between;
        .good {
            width: 46vw;
            height: 46vw;
            background: #f8f8f8;
            border-radius: 1vw 1vw 0px 0px;
        }
        .good-info {
            width: 46vw;
            height: 26vw;
            background: #fff;
            position: relative;
            box-sizing: border-box;
            padding: 2vw;
            &::after,
            &::before {
                content: '';
                display: inline-block;
                width: 32vw;
                background: #F5F5F5;
                margin: auto;
                height: 4vw;
                border-radius: 0.6vw;
            }
            &::after {
                content: '';
                display: inline-block;
                width: 12vw;
                background: #F5F5F5;
                margin: auto;
                height: 3vw;
                border-radius: 0.6vw;
            }
        }
    }
</style>