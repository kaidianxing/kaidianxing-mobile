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
    <view class="register-code">
        <login-input
            v-model="model.mobile"
            type="number"
            :maxlength="11"
            placeholder="请输入手机号"
            clearable
            :error-text.sync="errStatus.mobile"
        ></login-input>
        <login-input
            v-model="model.verify_code"
            placeholder="请输入图形验证码"
            required
            :maxlength="4"
            :error-text.sync="errStatus.verify_code"
        >
            <template v-slot:append>
                <vcode-img-btn  ref="imgCode"/>
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
                <vcode-btn ref="code" @click="sendSms" />
            </template>
        </login-input>
        <long-btn @click="submitData">下一步</long-btn>
    </view>
</template>

<script>
import LongBtn from '@/components/button/LongButton'
import VcodeBtn from '@/components/button/GetVCodeButton'
import LoginInput from '../LoginInput'
import VcodeImgBtn from '@/components/button/GetVCodeButton-image'

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
        ...mapMutations('login', ['setRegistData']),
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
                            type: 'user_reg'
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
                    this.validCode()
                }
            })
        },
        // 校验验证码
        validCode() {
            this.$api.loginApi
                .validateCode({
                    mobile: this.model.mobile,
                    code: this.model.code,
                    type: 'user_reg'
                })
                .then(res => {
                    if (res.error === 0) {
                        this.setRegistData(this.model)
                        let pages = getCurrentPages()
                        let len = pages.length
                        if(pages.length>1 && pages[len - 1].route!=='/kdxLogin/index') {
                           this.$Router.replace('/kdxLogin/setPass')
                        } else {
                           this.$Router.auto('/kdxLogin/setPass')
                        }
                    } else {
                        this.$refs.imgCode.refresh()
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
