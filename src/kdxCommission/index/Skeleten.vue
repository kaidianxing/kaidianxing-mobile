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
    <div class='pages-commission-skeleten'>
        <div class="memberInfo">
            <p class="img"></p>
            <div class="titleBox">
                <p class="title title1"></p>
                <p class="title title2"></p>
            </div>
        </div>
        <div class="otherInfo">
            <p class='p1'>
                <span class="span1"></span>
                <span class="span2"></span>
                <span class="span3"></span>
            </p>
            <p class='p2'>
                <span class="span1"></span>
                <span class="span2"></span>
                <span class="span1"></span>
                <span class="span2"></span>
            </p>
        </div>
        <div class="navList">
            <p></p>
        </div>
        <div class="iconblock">
            <p><i></i></p>
            <p><i></i></p>
            <p><i></i></p>
            <p><i></i></p>
            <p><i></i></p>
            <p><i></i></p>
        </div>
    </div>
</template>

<script>
    export default {}
</script>

<style lang="scss" scoped>
    .pages-commission-skeleten {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #F5F5F5;
        display: flex;
        flex-direction: column;
        z-index: 9999;
        .memberInfo {
            width: 100%;
            height: 200rpx;
            display: flex;
            flex-shrink: 0;
            .img {
                width: 120rpx;
                height: 120rpx;
                background: #E9E9E9;
                box-sizing: border-box;
                border-radius: 50%;
                margin: 48rpx 24rpx 0 52rpx;
            }
            .titleBox {
                width: 0;
                flex: 1;
                .title {
                    background: #E9E9E9;
                    border-radius: 4rpx;
                    height: 32rpx;
                    width: 320rpx;
                }
                .title1 {
                    margin: 52rpx 0 0 0;
                }
                .title2 {
                    margin: 16rpx 0 0 0;
                    width: 160rpx;
                    height: 30rpx;
                }
            }
        }
        .otherInfo {
            width: 702rpx;
            height: 294rpx;
            background: #fff;
            border-radius: 12rpx;
            display: flex;
            flex-wrap: nowrap;
            margin: 0 auto;
            box-sizing: border-box;
            padding: 48rpx;
            p {
                height: 100%;
                width: 50%;
                display: flex;
                flex-direction: column;
                &.p1 {
                    border-right: 1rpx solid #E6E7EB;
                    .span1 {
                        width: 140rpx;
                        height: 24rpx;
                        border-radius: 4rpx;
                        background: #F5F5F5;
                        margin: 4rpx 0 36rpx;
                    }
                    .span2 {
                        width: 200rpx;
                        height: 36rpx;
                        border-radius: 4rpx;
                        background: #FFD1CD;
                        margin: 0 0 48rpx;
                    }
                    .span3 {
                        width: 144rpx;
                        height: 50rpx;
                        border-radius: 50rpx;
                        background: #FF6F29;
                    }
                }
                &.p2 {
                    padding: 0 0 0 49rpx;
                    .span1 {
                        width: 240rpx;
                        height: 24rpx;
                        border-radius: 4rpx;
                        background: #F5F5F5;
                        margin: 4rpx 0 24rpx;
                        flex-shrink: 0;
                    }
                    .span2 {
                        width: 100rpx;
                        height: 32rpx;
                        flex-shrink: 0;
                        border-radius: 4rpx;
                        background: #F5F5F5;
                        margin: 0 0 34rpx;
                    }
                }
            }
        }
        .navList {
            background: #fff;
            flex-shrink: 0;
            width: 702rpx;
            border-radius: 12rpx;
            margin: 16rpx auto;
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
                border-bottom: 1rpx solid #f5f5f5;
                &::before,
                &::after {
                    content: '';
                    margin: auto 0;
                    border-radius: 4rpx;
                    background: #F5F5F5;
                }
                &::before {
                    width: 360rpx;
                    height: 28rpx;
                }
                &::after {
                    width: 44rpx;
                    height: 28rpx;
                }
            }
        }
        .iconblock {
            background: #fff;
            flex-shrink: 0;
            width: 702rpx;
            border-radius: 12rpx;
            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;
            box-sizing: border-box;
            justify-content: space-between;
            padding-bottom:30rpx;
            p {
                width: 33.3%;
                height: 220rpx;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                box-sizing: border-box;
                padding-top:30rpx;
                i {
                    width: 120rpx;
                    height: 28rpx;
                    margin: 0 auto;
                    background: #F5F5F5;
                }
                &::before,
                &::after {
                    content: '';
                    margin: 0 auto;
                    border-radius: 4rpx;
                    background: #F5F5F5;
                }
                &::before {
                    width: 88rpx;
                    border-radius: 12rpx;
                    height: 88rpx;
                }
                &::after {
                    width: 84rpx;
                    height: 28rpx;
                }
            }
        }
    }
</style>