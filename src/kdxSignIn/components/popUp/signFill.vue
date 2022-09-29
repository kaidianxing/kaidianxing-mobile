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
    <signMask v-if="popupShow.fillShow">
        <view class="fill-main">
            <view>
                <img class="fill-main_bg" :src="fillPopup" alt="">
            </view>
            <view class="fill-main_msg">
                <view>当前剩余
                    <text>{{supplementCount.num || ''}}次</text>
                    补签机会
                </view>
                <view>使用
                    <text>{{supplementCount.consume || ''}}{{credit_text}}</text>
                    补签
                </view>
            </view>
            <view class="fill-main_bt flex align-center">
                <sButton :diyStyle="diyBt"
                         type="info"
                         @onclick="cancel">
                    取消
                </sButton>
                <sButton :diyStyle="diyBt"
                         @onclick="fillClick">
                    补签
                </sButton>
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
        supplementCount:Object
    },
    computed:{
        credit_text() {
            return (this.$store.state.setting?.systemSetting?.credit_text || '积分')
        }
    },
    data() {
        return {
            fillPopup:this.$utils.staticMediaUrl( 'SignIn/fillPopupBg.png'),
            diyBt: {'font-size': 14, 'width': 100, 'height': 38}

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
    overflow: hidden;
    background: #FFFFFF;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: px2rpx(238);
    height: px2rpx(255);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    overflow: hidden;

    &_ {
        &bg {
            width: px2rpx(238);
            height: px2rpx(89);
            display: block;

        }

        &msg {
            padding-top: px2rpx(22);

            > view {
                display: block;
                text-align: center;
                font-weight: 500;
                font-size: px2rpx(16);
                line-height: px2rpx(28);
                text-align: center;
                color: #565656;

                text {
                    font-weight: 500;
                    color: #FF6F29;
                    font-size: px2rpx(16);
                    line-height: px2rpx(28);
                }
            }
        }
        &bt{
            position: absolute;
            bottom: px2rpx(24);
            width: px2rpx(238);
            justify-content: space-between;
            padding:0 px2rpx(13)
        }
    }
}

</style>
