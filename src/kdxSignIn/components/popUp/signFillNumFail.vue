/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <signMask v-if="popupShow.fillNumFailShow">
        <view class="fill-main">
            <view>
                <img class="fill-main_bg" :src="fillPopup" alt="">
            </view>
            <view class="fill-main_msg">
                <view>暂无补签次数</view>
                <view>无法补签～</view>
            </view>
            <view class="fill-main_tip">
                <text>你若不离我则不弃</text>
                <text>签到好礼等你来拿</text>
            </view>
            <view class="fill-main_bt flex align-center">
                <sButton :diyStyle="diyBt" @onclick="cancel"> 确定</sButton>
            </view>
            <view class="fill-main_close" @click="cancel">
                <i class="iconfont-m- icon-m-haibaoxieyi1" style="color: #ffffff"></i>
            </view>
        </view>
    </signMask>
</template>

<script>
import signMask from "./mask";
import sButton from "./sButton";

export default {
    name: "signFill",
    components: {signMask, sButton},
    props: {
        popupShow: Object,
    },
    data() {
        return {
            fillPopup:this.$utils.staticMediaUrl( 'SignIn/fillNumFail.png'),
            diyBt: {'font-size': 14, 'width': 200, 'height': 38}

        }
    },
    methods: {
        cancel() {
            this.$emit('cancel', false)
        },
        fillClick() {
            console.log('签到111')
            this.$emit('fillClick')
        },

    }
}
</script>

<style scoped lang="scss">
.fill-main {
    position: absolute;
    border-radius: px2rpx(10);
    background: #FFFFFF;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: px2rpx(238);
    height: px2rpx(288);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    padding-top: px2rpx(8);

    &_ {
        &bg {
            width: px2rpx(89);
            height: px2rpx(98);
            display: block;

        }

        &msg {
            padding-top: px2rpx(16);

            > view {
                display: block;
                text-align: center;
                font-weight: bold;
                font-size: px2rpx(16);
                line-height: px2rpx(22);
                text-align: center;
                color: #FF5C00;
            }
        }

        &tip {
            padding-top: px2rpx(16);

            text {
                display: block;
                color: #969696;
                font-size: px2rpx(14);
                transform: scale(0.7, 0.7);
                line-height: px2rpx(14);
            }
        }

        &bt {
            position: absolute;
            bottom: px2rpx(24);
            width: px2rpx(238);
            justify-content: center;
            padding: 0 px2rpx(13)
        }
        &close{
            position: absolute;
            bottom: px2rpx(-50);
            padding: px2rpx(5);
            i{
                font-size: px2rpx(24);
                color: #ffffff;


            }
        }
    }
}

</style>
