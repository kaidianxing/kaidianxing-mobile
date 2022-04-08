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
    <view class="login">
        <view class="flex align-center login-input">
            <view
                class="label"
                :class="{
                    focus: value || isFocus,
                    error: errorText
                }"
                >{{ errorText || placeholder }}</view
            >
            <input
                class="input"
                :value="value"
                :type="password ? (passShow ? 'text' : 'password') : type"
                :maxlength="maxlength"
                :confirm-type="confirmType"
                @input="inputHandler"
                @focus="focusHandler"
                @blur="blurHandler"
                @confirm="confirmHandler"
            />
            <view class="flex align-center pass-icon" @click="clearHandler">
                <icon
                    v-if="value && clearable"
                    type="clear"
                    color="#969696"
                    size="26rpx"
                />
            </view>
            <text
                v-if="password && !passShow"
                @click="changePass(true)"
                class="iconfont-m- icon-m-denglu-yincang pass-icon"
            ></text>
            <text
                v-if="password && passShow"
                @click="changePass(false)"
                class="iconfont-m- icon-m-denglu-xianshi pass-icon"
            ></text>
            <slot name="append"></slot>
        </view>
    </view>
</template>

<script>
export default {
    name: 'LoginInput',
    props: {
        value: String,
        type: {
            type: String,
            default: 'text'
        },
        placeholder: String,
        clearable: {
            type: Boolean,
            default: false
        },
        password: Boolean,
        maxlength: {
            type: [String, Number],
            default: 140
        },
        errorText: String,
        confirmType: {
            type: String,
            default: 'done'
        }
    },
    data() {
        return {
            isFocus: false,
            passShow: false,
            text: ''
        }
    },
    watch: {
        value: {
            handler(val) {
                this.text = val
            },
            immediate: true
        }
    },
    computed: {
        getInputType() {
            return this.type === 'password'
        }
    },
    methods: {
        changePass(status) {
            this.passShow = status
        },
        inputHandler(e) {
            this.$emit('input', e.target.value)
        },
        focusHandler() {
            this.isFocus = true
        },
        blurHandler() {
            this.$emit('update:errorText', '')
            this.isFocus = false
            this.$emit('on-blur')
        },
        confirmHandler() {
            this.$emit('confirm')
        },
        clearHandler() {
            this.$emit('input', '')
        }
    }
}
</script>

<style lang="scss" scoped>
.login {
    box-sizing: border-box;
    height: 125rpx;
    padding: 56rpx 0 24rpx 0;
    border-bottom: 2rpx solid #e6e7eb;

    .login-input {
        position: relative;

        .label,
        .input {
            font-size: 32rpx;
            line-height: 44rpx;
        }

        .label {
            color: $uni-text-color-grey;
        }

        .input {
            flex: 1;
            color: $uni-text-color;
        }

        .pass-icon {
            // padding: 16rpx 0 16rpx 24rpx;
            padding-right: 24rpx;
            font-size: 26rpx;
            color: #969696;
            font-size: 32rpx;
        }

        .label {
            position: absolute;
            top: 0;
            left: 0;
            transition: transform 0.3s linear;

            &.focus,
            &.error {
                transform: translateY(-34rpx);
                font-size: 20rpx;
                line-height: 28rpx;
            }

            &.focus {
                color: $uni-text-color-grey;
            }

            &.error {
                color: $uni-color-primary;
            }
        }
    }
}
</style>
