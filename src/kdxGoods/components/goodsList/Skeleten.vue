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
    <div class='good-list-skeleten'>
        <div class="search"></div>
        <ul class='list'>
            <li v-for='(item,index) in 6' class='item' :key='item'>
                <p class="img " :class='"anim"+(index%3+1)'></p>
                <div class="info">
                    <p class="title">
                        <span class='tit anim1'></span>
                        <span class='tit anim2'></span>
                        <span class='subtit anim3'></span>
                    </p>
                    <p class="others">
                        <span class="left anim1"></span>
                        <span class="right anim3"></span>
                    </p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {}
</script>

<style lang="scss" scoped>
    .good-list-skeleten {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #ffffff;
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
        .search {
            width: 100%;
            height: 12.2vw;
            display: flex;
            background: #fff;
            flex-shrink: 0;
            margin: 0 0 16rpx;
            &::after {
                content: '';
                width: 93.6vw;
                height: 8vw;
                background: #f8f8f8;
                border-radius: 5vw;
                margin: auto;
            }
        }
        .list {
            width: 100%;
            margin: 0 auto;
            background: #fff;
            .item {
                width: 100%;
                height: 272rpx;
                box-sizing: border-box;
                padding: 0 20rpx;
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-between;
                .img {
                    width: 240rpx;
                    height: 240rpx;
                    background: #f8f8f8;
                    border-radius: 12rpx;
                    margin: auto 0;
                }
                .info {
                    display: flex;
                    width: 390rpx;
                    height: 100%;
                    flex-direction: column;
                    padding: 15rpx 0;
                    justify-content: space-between;
                    // border-bottom: 1rpx solid #f5f5f5;
                    .title {
                        display: flex;
                        flex-direction: column;
                        span {
                            width: 100%;
                            height: 28rpx;
                            background: #f8f8f8;
                            border-radius: 4rpx;
                        }
                        .tit {
                            margin-bottom: 12rpx;
                            ;
                        }
                        .subtit {
                            width: 290rpx;
                            height: 22rpx;
                            background-color: #ffffff;
                        }
                    }
                }
            }
            .others {
                display: flex;
                justify-content: space-between;
                span {
                    height: 100%;
                    display: flex;
                    justify-content: space-between;
                    flex-direction: column;
                    &::after,
                    &::before {
                        content: '';
                        background: #f8f8f8;
                        border-radius: 4rpx;
                    }
                    &::after {
                        width: 64rpx;
                        height: 20rpx;
                        background-color: #ffffff;
                    }
                    &::before {
                        width: 94rpx;
                        height: 32rpx;
                        margin: 0 0 12rpx 0;
                    }
                }
                .right {
                    &::before {
                        width: 36rpx;
                        height: 36rpx;
                        border-radius: 50%;
                        margin: 0 0 10rpx auto;
                    }
                }
            }
        }
    }
</style>