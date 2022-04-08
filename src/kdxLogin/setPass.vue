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
    <page-box noLogin>
        <view class="set-box">
            <view class="title">设置登录密码</view>
            <view class="desc">密码长度8~16位，数字、字母、字符至少包含两种</view>
            <login-input
                placeholder="请输入密码"
                :maxlength="16"
                v-model="model.password"
                :error-text.sync="errStatus.password"
                type="password"
            />
            <login-input
                placeholder="请再次输入密码"
                :maxlength="16"
                v-model="model.confirmPass"
                :error-text.sync="errStatus.confirmPass"
                @on-blur="blurHandler"
                type="password"
                @confirm="confirmHandler"
                confirm-type="go"
            />
            <view class="err-msg">{{msg}}</view>
            <long-btn @click="submitData">确认</long-btn>
        </view>
        <login-tip v-model="show" title="注册成功" type="success"></login-tip>
    </page-box>
</template>
<script>
import LoginInput from './components/LoginInput'
import LoginTip from './components/LoginTip'
import LongBtn from '@/components/button/LongButton'

import { mapGetters, mapMutations } from 'vuex'
import { validate, validPass } from './validate'
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    components: {
        LoginInput,
        LoginTip,
        LongBtn
    },
    data() {
        let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,16}$/
        let validConfirmPass = (rule, value, callback) => {
            if (value === '') {
                callback('请再次输入密码')
            } else if (!reg.test(value)) {
                callback('请输入正确格式的密码')
            } else if (value !== this.model.password) {
                this.sameStatus = true
                callback('两次输入密码不一致!')
            } else {
                callback()
            }
        }

        return {
            model: {
                password: '',
                confirmPass: ''
            },
            rules: {
                password: [{ validator: validPass }],
                confirmPass: [{ validator: validConfirmPass }]
            },
            show: false,
            errStatus: {},
            sameStatus: false,
            msg: ''
        }
    },
    computed: {
        ...mapGetters('login', ['registForm'])
    },
    mounted() {
        if (!this.registForm) {
            this.$Router.replace('/kdxLogin/index')
        }
    },
    methods: {
        ...mapMutations('login', ['clearRegistData']),
        submitData() {
            this.blurHandler()
            validate(this.rules, this.model, filed => {
                if (filed) {
                    let { password, confirmPass } = filed
                    // 密码不一样单独显示错误信息
                    if (this.sameStatus) {
                        this.errStatus = { password }
                        this.msg = confirmPass
                    } else {
                        this.errStatus = { password, confirmPass }
                    }
                } else {
                    this.postData()
                }
            })
        },
        postData() {
            this.$api.loginApi
                .toRegister({
                    ...this.registForm,
                    password: this.model.password
                })
                .then(res => {
                    if (res.error === 0) {
                        this.show = true
                        let pages = getCurrentPages()
                       
                        setTimeout(() => {
                            if (pages.length > 2) {
                                if (
                                    pages[pages.length - 3].route ==
                                    'kdxLogin/index' || pages[pages.length - 2].route ==
                                    'kdxLogin/index'
                                ) {
                                    uni.navigateBack({
                                        delta: 2
                                    })
                                } else {
                                    this.$Router.replace('/kdxLogin/index')
                                }
                            } else {
                                this.$Router.replaceAll('/kdxLogin/index')
                            }
                        }, 500)
                    }
                })
        },
        blurHandler() {
            this.sameStatus = false
            this.msg = ''
        },
        confirmHandler() {
            if (this.model.password && this.model.confirmPass) {
                this.submitData()
                uni.hideKeyboard()
            }
        }
    },
    beforeDestroy() {
        this.clearRegistData()
    }
}
</script>

<style lang="scss" scoped>
/deep/ .grace-page-body {
    background-color: #fff;
}

.set-box {
    margin: 80rpx auto 0;
    min-height: 100vh;
    width: 588rpx;

    .title {
        margin-bottom: 16rpx;
        font-size: 48rpx;
        line-height: 68rpx;
        text-align: center;
        color: $uni-text-color;
    }

    .desc {
        margin-bottom: 70rpx;
        font-size: 24rpx;
        line-height: 34rpx;
        color: $uni-text-color-grey;
        text-align: center;
    }

    .err-msg {
        box-sizing: border-box;
        padding: 16rpx 0 52rpx;
        height: 96rpx;
        color: $uni-color-primary;
        font-size: 20rpx;
        line-height: 28rpx;
    }

    /deep/ .my-long-button {
        width: 590rpx;
        margin-left: 0;
        margin-right: 0;
    }
}
</style>