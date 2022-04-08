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
    <page-box>
        <div class="bind-tel">
            <p class="title">
                当前绑定手机号为
                <span class="tel theme-primary-color">{{ model.mobile | formatTel }}</span>
            </p>
            <div class="code-box">
                <div class="body">
                    <p class="label">图形验证码</p>
                    <div class="content">
                        <input
                            v-model="model.verify_code"
                            class="bind-input"
                            placeholder-class="bind-input-placeholder"
                            type="text"
                            placeholder="请输入图形验证码"
                        />
                        <vcode-img-btn ref="imgCode" />
                    </div>
                </div>
                <div class="body last">
                    <p class="label">验证码</p>
                    <div class="content">
                        <input
                            class="bind-input"
                            placeholder-class="bind-input-placeholder"
                            v-model="model.code"
                            :maxlength="6"
                            type="text"
                            placeholder="请输入验证码"
                        />
                        <vcode-btn ref="code" @click="sendSms"></vcode-btn>
                    </div>
                </div>
            </div>
            <long-btn @click="clickBtn">下一步</long-btn>
        </div>
    </page-box>
</template>

<script>
import VcodeImgBtn from '@/components/button/GetVCodeButton-image'
import VcodeBtn from '@/components/button/GetVCodeButton'
import LongBtn from '@/components/button/LongButton'

import {
    validate,
    validCode,
    validateField,
    validVerify
} from '@/kdxLogin/validate/index'

import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    components: {
        VcodeBtn,
        LongBtn,
        VcodeImgBtn
    },
    data() {
        return {
            model: {
                code: '',
                mobile: '',
                verify_code: ''
            },
            rules: {
                verify_code: [{ validator: validVerify }],
                code: [{ validator: validCode }]
            }
        }
    },
    filters: {
        formatTel(value) {
            return value ? `${value.slice(0, 3)}****${value.slice(7)}` : ''
        }
    },
    mounted() {
        this.model.mobile = this.$Route.query.mobile
    },
    methods: {
        sendSms() {
            validate(this.rules, this.model, field => {
                if (field && (field.mobile || field.verify_code)) {
                    this.$toast(field.mobile || field.verify_code)
                } else {
                    this.$api.loginApi
                        .sendSms({
                            mobile: this.model.mobile,
                            verify_code: this.model.verify_code,
                            type: 'bind'
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
        clickBtn(type) {
            validateField(this.rules, this.model)
                .then(filed => {
                    this.validateCode()
                })
                .catch(({ errors }) => {
                    this.$toast(errors[0].message)
                })
        },
        validateCode() {
            this.$api.loginApi.validateCode({...this.model,type: 'bind'}).then(res => {
                if (res.error === 0) {
                    let { mobile: old_mobile, code: old_code } = this.model

                    this.$Router.auto({
                        path: '/kdxMember/bindTel/change',
                        query: { old_mobile, old_code }
                    })
                } else {
                    this.$refs.imgCode.refresh()
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.bind-tel {
    .title {
        font-size: px2rpx(12);
        line-height: px2rpx(17);
        box-sizing: border-box;
        padding: px2rpx(16) px2rpx(24) px2rpx(8);
        color: #969696;
    }
    .code-box {
        overflow: hidden;
        margin: 0 px2rpx(12) px2rpx(18);
        border-radius: px2rpx(6);
    }

    .body {
        box-sizing: border-box;
        background: #fff;
        min-height: px2rpx(48);
        display: flex;
        flex-wrap: nowrap;
        padding: px2rpx(10) px2rpx(12);
        border-bottom: 1px solid $uni-border-color;

        &.last {
            border-bottom: 0;
        }
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

    .tel {
        padding-left: 8rpx;
        color: #ff3c29;
    }
    .bind-input {
        font-size: px2rpx(14);
        line-height: px2rpx(20);
        color: $uni-text-color;
        &-placeholder {
            color: $uni-text-color-grey;
        }
    }
}
</style>
