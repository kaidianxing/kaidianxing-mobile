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
    <view class="login-pass">
        <login-input
            type="number"
            v-model="model.mobile"
            placeholder="请输入手机号"
            :error-text.sync="errStatus.mobile"
            maxlength="11"
            clearable
        ></login-input>
        <login-input
            v-model="model.password"
            :error-text.sync="errStatus.password"
            type="password"
            placeholder="请输入密码"
            confirm-type="go"
            password
            clearable
            @confirm="confirmHandler"
        ></login-input>
        <view class="forget-pas" @click="toForget">忘记密码?</view>
        <btn size="middle" @btn-click="toLogin" classNames="theme-primary-bgcolor">登录</btn>
        
        
        <view class="flex login-foot">
            <text @click="switchCode">短信验证码登录</text>
            <text @click="toRegister">注册账号</text>
        </view>
    </view>
</template>

<script>
import LoginInput from '../LoginInput'
import LongBtn from '@/components/button/LongButton'

import { mapMutations } from 'vuex'
import { validate, validMobile } from '@/kdxLogin/validate/index'

export default {
    components: {
        LongBtn,
        LoginInput
    },
    data() {
        return {
            model: {
                mobile: '',
                password: ''
            },
            rules: {
                mobile: [{ validator: validMobile }],
                password: [{ required: true, message: '密码不能为空' }]
            },
            errStatus: {}
        }
    },
    methods: {
        ...mapMutations('login', ['setLogin', 'setModal', 'setBind']),
        toRegister() {
            this.$Router.auto('/kdxLogin/register')
        },
        switchCode() {
            this.$emit('switch', '1')
        },
        toForget() {
            this.$Router.auto('/kdxLogin/forget')
        },
        toLogin() {
            validate(this.rules, this.model, field => {
                if (!field) {
                    this.$api.loginApi
                        .getLogin({ ...this.model, type: 'wap' })
                        .then(async res => {
                            if (res.error === 0) {
                                // 设置登录状态
                                this.setLogin(true)
                                this.setBind(true)
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
                                this.$toast(res.message)
                            }
                        })
                } else {
                    this.errStatus = { ...field }
                }
            })
        },
        confirmHandler() {
            if (this.model.mobile && this.model.password) {
                this.toLogin()
                uni.hideKeyboard()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.forget-pas {
    margin: 16rpx 0 46rpx;
    font-size: 24rpx;
    text-align: right;
    line-height: 34rpx;
    color: #518def;
}

.login-foot {
    justify-content: space-between;
    align-items: center;
    margin-top: 16rpx;
    font-size: 24rpx;
    line-height: 34rpx;
    color: $uni-text-color-grey;
}
</style>
