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
            <div class="body" style="margin:16rpx auto 28rpx;">
                <div class="row">
                    <p class="label">手机号码</p>
                    <div class="content">
                        <input
                            type="number"
                            maxlength="11"
                            class="bind-input"
                            placeholder-class="bind-input-placeholder"
                            v-model="model.mobile"
                            placeholder="请输入要绑定的手机号码"
                        />
                    </div>
                </div>
                <div class="row">
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
                <div class="row">
                    <p class="label">验证码</p>
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
            </div>

            <div style="padding:0 24rpx;">
                <btn type="do" size="middle" classNames="theme-primary-bgcolor" @btn-click="submitData">确认</btn>
            </div>
        </div>
    </page-box>
</template>

<script>
import VcodeBtn from '@/components/button/GetVCodeButton'
import VcodeImgBtn from '@/components/button/GetVCodeButton-image'
import LongBtn from '@/components/button/LongButton'

import { mapMutations } from 'vuex'
import {
    validate,
    validateField,
    validMobile,
    validCode,
    validVerify
} from '@/kdxLogin/validate/index'

import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    components: {
        LongBtn,
        VcodeBtn,
        VcodeImgBtn
    },
    data() {
        return {
            model: {
                mobile: '',
                verify_code: '',
                code: ''
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
        ...mapMutations('login', ['setBindUser', 'setBind']),
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
        submitData() {
            validateField(this.rules, this.model)
                .then(() => {
                    let routes = getCurrentPages()

                    let path = routes[routes.length - 2]
                        ? routes[routes.length - 2].route
                        : ''
                    this.$api.loginApi.bindMobile(this.model).then(res => {
                        if (res.error === 0) {
                            this.setBind(true)
                            this.$toast('绑定成功')
                            // 返回绑定之前页面
                            if (path == 'kdxMember/bindTel/hadBound') {
                                this.$Router.back(3)
                            } else {
                                this.$Router.back(1)
                            }
                        } else if (res.error === 211265) {
                            let { user, bind_user, bind_mobile } = res
                            this.setBindUser({ user, bind_user, bind_mobile })
                            // 用户已存在页面跳转过来的话,返回之前,否则去用户已存在页面
                            if (path == 'kdxMember/bindTel/hadBound') {
                                this.$Router.back(1)
                            } else {
                                this.$Router.auto(
                                    '/kdxMember/bindTel/hadBound'
                                )
                            }
                        }
                    })
                })
                .catch(({ errors }) => {
                    this.$toast(errors[0].message)
                })
        },
        clickVcodeBtn() {
            this.$refs.code.start()
        }
    },
}
</script>

<style lang="scss" scoped>
.bind-tel {
    .body {
        padding-left: px2rpx(12);
        width: px2rpx(351);
        margin: auto;
        border-radius: px2rpx(6);
        box-sizing: border-box;
        background: #fff;
        display: flex;
        flex-direction: column;
        margin-bottom: px2rpx(18);
        .row {
            padding-right: 24rpx;
            height: px2rpx(48);
            display: flex;
            border-bottom: 1px solid $uni-border-color;

            &:last-child {
                border-bottom: 0;
            }
        }
    }
    .label,
    .content {
        margin: auto 0;
        font-size: px2rpx(12);
        line-height: px2rpx(12);
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
        font-size: px2rpx(12);
        line-height: px2rpx(17);
        color: $uni-text-color;
        &-placeholder {
            color: $uni-text-color-grey;
        }
    }
}
</style>