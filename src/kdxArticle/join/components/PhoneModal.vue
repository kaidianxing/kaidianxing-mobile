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
    <view class="ticket"
        v-if="visible"
        @touchmove.stop.prevent
        :style="{ height: windowHeight }">
        <view class="container">
            <view class="bg">
                <view class="title">手机验证</view>
                <view class="info" @click="toMemberDetail">
                    {{model.mobile ? `将通过当前绑定的手机号码${mobile}` : '请通过当前已绑定的手机号码' }}进行报名验证，如未绑定手机号码请前往
                    <text class="to-page">【个人中心】</text>
                    进行绑定
                </view>
                <div class="row">
                    <div class="content">
                        <input
                            v-model="model.verify_code"
                            class="bind-input"
                            placeholder-class="bind-input-placeholder"
                            type="text"
                            placeholder="请输入图形验证码"
                        />
                        <vcode-img-btn  ref="imgCode" />
                    </div>
                </div>
                <div class="row">
                    <div class="content">
                        <input
                            v-model="model.code"
                            class="bind-input"
                            placeholder-class="bind-input-placeholder"
                            type="text"
                            :maxlength="6"
                            placeholder="请输入短信验证码"
                        />
                        <vcode-btn ref="code" @click="sendSms"></vcode-btn>
                    </div>
                </div>
                <view class="submit-btn" @click="submitData">确认</view>
                <view class="cancel-btn" @click="close">取消</view>
            </view>
        </view>
    </view>
</template>

<script>
import VcodeBtn from '@/components/button/GetVCodeButton'
import VcodeImgBtn from '@/components/button/GetVCodeButton-image'
import { mapState } from 'vuex'
import {
    validate,
    validMobile,
    validCode,
    validVerify
} from '@/kdxLogin/validate/index'
export default {
    components: {  
        VcodeBtn,
        VcodeImgBtn
    },
    options: { styleIsolation: "shared" }, //小程序样式穿透
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            model: {
                mobile: "",
                verify_code: "",
                code: "",
            },
            rules: {
                mobile: [{ validator: validMobile }],
                code: [{ validator: validCode }],
                verify_code: [{ validator: validVerify }]
            },
        }
    },
    computed: {
        ...mapState(['windowHeight']),
        ...mapState('member', {
            memberInfo: state => state.memberInfo,
        }),
        mobile() {
            let res = this.model.mobile || "";
            if(res.length) {
                res = res.substring(0, 3) + "****" + res.substring(7, 11)
            }
            return res
        } 
    },
    watch: {
        memberInfo: {
            immediate: true,
            deep: true,
            handler(val) {
                if(val.bindMobile.length && val.bindMobile[0]?.query?.mobile) {
                    this.model.mobile = val.bindMobile[0]?.query?.mobile
                }
            }
        }
    },
    methods: {
        sendSms() {
            validate(this.rules, this.model, field => {
                if (field && (field.mobile || field.verify_code)) {
                    uni.showToast({
                        title: field.mobile || field.verify_code,
                        icon: 'none'
                    })
                } else {
                    this.$api.articleApi.send({
                        mobile: this.model.mobile,
                        verify_code: this.model.verify_code,
                        type: 'article_activity_notice'
                    }).then(res => {
                        if (res.error === 0) {
                            this.$refs.code.start()
                            uni.showToast({
                                title: '发送成功',
                                icon: 'none'
                            })
                        } else {
                            this.$refs.imgCode.refresh()
                        }
                    })
                }
            })
        },
        submitData() {
            validate(this.rules, this.model, field => {
                if (field) {
                    uni.showToast({
                        title: field.mobile || field.verify_code || field.code ,
                        icon: 'none'
                    })
                } else {
                    this.$api.articleApi.checkSmsCode({
                        mobile: this.model.mobile,
                        code: this.model.code,
                        type: 'article_activity_notice'
                    }).then(res => {
                        if (res.error === 0) {
                            this.$emit("join");
                            this.close();
                        } else {
                            uni.showToast({
                                title: res.message,
                                icon: 'none'
                            })
                            this.$refs.imgCode.refresh()
                        }
                    })
                }
            })
        },
        close() {
            this.model.verify_code = "";
            this.model.code = "";
            this.$emit('close', false)
        },
        toMemberDetail() {
            this.$Router.auto({
                path: "/kdxMember/memberInfo/index"
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.ticket {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999999;
    width: 100vw;
    background: rgba(0, 0, 0, 0.87);
    .container {
        position: absolute;
        left: 50%;
        top: 50%;
        width: px2rpx(280);
        transform: translate(-50%, -72%);
        .bg {
            position: relative;
            width: px2rpx(280);
            border-radius: px2rpx(10);
            background: #fff;
            padding: px2rpx(16);
            color: #212121;
            .title {
                margin-bottom: px2rpx(16);
                font-size: px2rpx(14);
                line-height: px2rpx(20);
                text-align: center;
                font-weight: bold;
            }
            .info {
                margin-bottom: px2rpx(5);
                font-size: px2rpx(12);
                line-height: px2rpx(17);
                .to-page {
                    color: #FF3C29;
                    font-size: px2rpx(12);
                }
            }
        }
    }
}
.row {
    padding-right: 24rpx;
    height: px2rpx(48);
    display: flex;
    border-bottom: px2rpx(0.5) solid $uni-border-color;
}
.label,
.content {
    margin: auto 0;
    font-size: px2rpx(14);
    line-height: px2rpx(14);
    color: #212121;
}
.label {
    width: px2rpx(84);
}
.content {
    width: 0;
    flex: 1;
    display: flex;
    input {
        flex: 1;
        height: 100%;
        margin: auto;
    }
}

.bind-input {
    font-size: px2rpx(14);
    line-height: px2rpx(20);
    color: $uni-text-color;
    margin: 0;
    &-placeholder {
        color: $uni-text-color-grey;
        font-size: px2rpx(12);
    }
}
/deep/.renren-btn {
    border: none!important;
    padding: 0!important;
    line-height: px2rpx(28);
}
.submit-btn {
    height: px2rpx(38);
    line-height: px2rpx(38);
    color: #fff;
    text-align: center;
    font-size: px2rpx(14);
    border-radius: px2rpx(64);
    background: #FF3C29;
    margin: px2rpx(24) 0 px2rpx(8);
}
.cancel-btn {
    height: px2rpx(20);
    line-height: px2rpx(20);
    color: #969696;
    font-size: px2rpx(14);
    text-align: center;
}
/deep/.bind-input-placeholder {
    font-size: px2rpx(12);
}
</style>
