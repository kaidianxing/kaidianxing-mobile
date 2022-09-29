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
    <view class="login-code">
        <login-input
            type="number"
            v-model="model.mobile"
            placeholder="请输入手机号"
            :error-text.sync="errStatus.mobile"
            maxlength="11"
            clearable
        ></login-input>
        <login-input
            v-model="model.verify_code"
            placeholder="请输入图形验证码"
            required
            :maxlength="4"
            :error-text.sync="errStatus.verify_code"
        >
            <template v-slot:append>
                <vcode-img-btn ref="imgCode" />
            </template>
        </login-input>
        <login-input
            type="number"
            :maxlength="6"
            v-model="model.code"
            :error-text.sync="errStatus.code"
            placeholder="请输入短信验证码"
            @confirm="confirmHandler"
            confirm-type="go"
        >
            <template v-slot:append>
                <vcode-btn ref="code" @click="sendSms"></vcode-btn>
            </template>
        </login-input>
        <long-btn @click="submitData">登录</long-btn>
        <view class="login-foot" @click="switchPass">账号密码登录</view>
    </view>
</template>

<script>
import LongBtn from '@/components/button/LongButton'
import VcodeBtn from '@/components/button/GetVCodeButton'
import VcodeImgBtn from '@/components/button/GetVCodeButton-image'
import LoginInput from '../LoginInput'

import { mapMutations } from 'vuex'
import {
    validate,
    validMobile,
    validCode,
    validVerify
} from '@/kdxLogin/validate/index'

export default {
    components: {
        LongBtn,
        VcodeBtn,
        LoginInput,
        VcodeImgBtn
    },
    data() {
        return {
            model: {
                mobile: '',
                code: '',
                verify_code: ''
            },
            rules: {
                mobile: [{ validator: validMobile }],
                code: [{ validator: validCode }],
                verify_code: [{ validator: validVerify }]
            },
            errStatus: {}
        }
    },
    methods: {
        ...mapMutations('login', ['setLogin', 'setBind']),
        switchPass() {
            this.$emit('switch', '0')
        },
        sendSms() {
            validate(this.rules, this.model, field => {
                if (field && (field.mobile || field.verify_code)) {
                    this.errStatus = {
                        mobile: field.mobile,
                        verify_code: field.verify_code
                    }
                } else {
                    this.$api.loginApi
                        .sendSms({
                            mobile: this.model.mobile,
                            verify_code: this.model.verify_code,
                            type: 'login_code'
                        })
                        .then(res => {
                            if (res.error === 0) {
                                this.$refs.code.start()
                                uni.showToast({
                                    title: '发送成功',
                                    icon: 'none'
                                })
                            } else {
                                this.$refs.imgCode.refresh()
                                this.$toast(res.message)
                            }
                        })
                }
            })
        },
        submitData() {
            validate(this.rules, this.model, field => {
                if (field) {
                    this.errStatus = { ...field }
                } else {
                    this.$api.loginApi.loginByCode(this.model).then(async res => {
                        if (res.error === 0) {
                            // 设置登录状态
                            this.setLogin(true)
                            this.setBind(true)
                            this.$api.signInApi.getSignInfo({//先请求一个积分签到接口判断渠道
                                uid: this.$store.state.login.userInfo.id || ''
                            }, {errorToast: false}).then(res => {
                                if (res.error === 0) {
                                    this.$store.commit("setting/signModelShow", true)
                                }
                            })
                            await this.$api.memberApi.getUserInfo().then(res => {
                                this.$store.commit('login/setUserInfo',res.data)
                            })
                            if (getCurrentPages().length > 1) {
                                this.$Router.back(1)
                            } else {
                                this.$Router.auto({
                                    //#ifndef H5
                                    path: '/pages/index/index',
                                    //#endif
                                    //#ifdef H5
                                    path: '/'
                                    //#endif
                                })
                            }
                        } else {
                            this.$refs.imgCode.refresh()
                            this.$toast(res.message)
                        }
                    })
                }
            })
        },
        confirmHandler() {
            if (
                this.model.mobile &&
                this.model.code &&
                this.model.verify_code
            ) {
                this.submitData()
                uni.hideKeyboard()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.login-code {
    .login-foot {
        margin-top: 16rpx;
        font-size: 24rpx;
        text-align: center;
        line-height: 34rpx;
        color: $uni-text-color-grey;
    }
}
</style>
