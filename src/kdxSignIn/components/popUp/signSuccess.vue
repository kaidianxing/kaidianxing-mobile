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
    <signMask v-if="popupShow.onceShow || popupShow.retroactiveSign">
    <page-box>
            <view class="popup-success">
                <view class="popup-success_close" @click="change(false)">
                    <i class="iconfont-m- icon-m-haibaoxieyi1" style="color: #ffffff"></i>
                </view>

                <view>
                    <img class="popup-success_pp" :src="signSuccess" alt="">
                    <view class="popup-success_msg">
                        <img class="popup-success_icon" :src="point" alt="">
                        <text v-if="popupShow.onceShow" class="popup-success_text">{{credit_text}}+{{ ponitNum || '' }}</text>
                        <text v-if="popupShow.retroactiveSign" class="popup-success_text">{{credit_text}}+{{ dayReward || '' }}</text>
                    </view>
                </view>
                <!-- #ifdef MP-WEIXIN -->
                <view class="popup-success_bt" @click="sendMsg">明日继续得奖励</view>
                <!-- #endif -->
                <!-- #ifdef H5 -->
                <view class="popup-success_bt" @click="change(false)">关闭</view>
                <!-- #endif -->
            </view>
        </page-box>
    </signMask>
</template>

<script>
import signMask from "./mask";

export default {
    name: "signSuccess",
    components: {signMask},
    props: {
        popupShow: Object,
        noticeInfo:Object,
        ponitNum: String | Number,//包含递增积分
        dayReward:String | Number//基础积分

    },
    data() {
        return {
            signSuccess:this.$utils.staticMediaUrl( 'SignIn/signSuccess.png'),
            point:this.$utils.staticMediaUrl( 'SignIn/point.png'),//积分
            discount:this.$utils.staticMediaUrl( 'SignIn/discount.png'),//优惠券
            templateId: ''
        }
    },
    computed:{
        credit_text() {
            return (this.$store.state.setting?.systemSetting?.credit_text || '积分')
        },
    },
    mounted() {
        // #ifdef MP-WEIXIN
        let type_code = ['credit_sign_notice'];
        this.$utils.sendWxappMsg(type_code)
        // #endif
    },
    methods: {
        change() {
            let reload = true //重新请求签到结果
            this.$emit('cancel',reload)
        },
        // 小程序订阅消息
        sendMsg() {
            let _this = this
            if (this.templateId != '' ) {
                wx.requestSubscribeMessage({
                    tmplIds:  this.templateId,
                    success(res) {
                        console.log(res);
                    },
                    fail(rej) {
                        console.log(rej);
                    },
                    complete: (res) => {
                        _this.change()
                    }
                })
            } else {
                    // 没有权限不显示模板
                    console.log('没订阅通知权限')
                    _this.change()
            }
        },
    }
}
</script>

<style scoped lang="scss">
.popup-success {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: px2rpx(321);
    height: px2rpx(397);
    padding-top: px2rpx(40);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;

    &_ {
        &close {
            position: absolute;
            right: px2rpx(-10);
            top: px2rpx(-5);
            padding: px2rpx(5);

            i {
                font-size: px2rpx(24);
                color: #ffffff;
            }
        }

        &pp {
            display: block;
            width: px2rpx(305);
            height: px2rpx(296);
        }

        &msg {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            position: absolute;
            left: 0;
            top: px2rpx(215);
        }

        &icon {
            width: px2rpx(56);
            height: px2rpx(56);
            display: block;
        }

        &text {
            margin-top: px2rpx(10);
            font-size: px2rpx(14);
            font-weight: 500;
            color: $uni-color-primary;
        }

        &bt {
            width: px2rpx(140);
            height: px2rpx(38);
            display: flex;
            align-items: center;
            justify-content: center;
            background: #FF5C00;
            border-radius: px2rpx(20);
            color: #FFFFFF;
            font-size: px2rpx(14);
            font-weight: bold;
        }
    }
}
</style>
