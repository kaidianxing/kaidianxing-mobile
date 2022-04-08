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
        <div class="password-index">
            <ul class="input-group">
                 <li class="_li" v-if="isSet">
                    <p class="label">
                        原密码
                    </p>
                    <div class="content">
                        <input
                            class="password"
                            v-model="old_password"
                            type="password"
                            placeholder="请输入密码"
                        />
                        <view class="flex align-center pass-icon" @click="clearHandler('old_password')">
                            <icon
                                v-if="old_password"
                                type="clear"
                                color="#969696"
                                size="26rpx"
                            />
                        </view>
                    </div>
                </li>
                <li class="_li">
                    <p class="label">
                        新密码
                    </p>
                    <div class="content">
                        <input
                            class="password"
                            v-model="firstInput"
                            type="password"
                            placeholder="请输入密码"
                        />
                        <view class="flex align-center pass-icon" @click="clearHandler('firstInput')">
                            <icon
                                v-if="firstInput"
                                type="clear"
                                color="#969696"
                                size="26rpx"
                            />
                        </view>
                    </div>
                </li>
                <li class="_li">
                    <p class="label">
                        确认密码
                    </p>
                    <div class="content">
                        <input
                            class="password"
                            v-model="secondInput"
                            type="password"
                            placeholder="请输入密码"
                        />
                        <view class="flex align-center pass-icon" @click="clearHandler('secondInput')">
                            <icon
                                v-if="secondInput"
                                type="clear"
                                color="#969696"
                                size="26rpx"
                            />
                        </view>
                    </div>
                </li>
            </ul>
            <long-btn @click="clickBtn" :disable="disable">确认</long-btn>
        </div>
    </page-box>
</template>

<script>
import LongBtn from '@/components/button/LongButton'
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    components: {
        LongBtn
    },
    computed: {
        disable() {
            let status = this.firstInput === '' || this.secondInput === ''
            if(this.isSet) {
                return status || this.old_password === ''
            }
            return status
        },
        formater() {
            return /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/.test(
                this.firstInput
            )
        },
    },
    data() {
        return {
            firstInput: '',
            secondInput: '',
            old_password: '',
            isSet: false, // 是否设置过密码
        }
    },
    mounted(){
        let {type} = this.$Route.query || {}
        this.isSet = (type == 1)
    },
    methods: {
        clickBtn() {
            
            if(!this.old_password&& this.isSet) {
                return this.$toast('请输入原密码')
            }
                       
            if (this.firstInput != this.secondInput) {
                this.$toast('两次密码输入不一致')
                return
            }

            if (this.formater) {
                let params = {
                    password: this.firstInput,
                    confirm_password: this.secondInput,
                }

                if(this.isSet){
                    params.old_password = this.old_password
                }
                this.$api.loginApi
                    .changePW(params)
                    .then(res => {
                        if (res.error == 0) {
                            this.$toast('修改成功')
                            setTimeout(() => {
                                this.$Router.back()
                            }, 1000)
                        }
                    })
            } else {
                this.$toast('密码长度6~18位，数字、字母、字符至少包含两种')
            }
        },
        clearHandler(key){
            this[key] = ''
        }
    }
}
</script>

<style lang="scss" scoped>
.input-group {
    margin: 16rpx 24rpx 32rpx;
    border-radius: px2rpx(6);
    padding-left: px2rpx(12);
    box-sizing: border-box;
    background: #fff;
    ._li {
        width: 100%;
        min-height: px2rpx(48);
        display: flex;
        flex-wrap: nowrap;
        padding: px2rpx(8) px2rpx(12) px2rpx(8) 0;
        border-bottom: 1rpx solid #e6e7eb;
        &:last-child {
            border: none;
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
            color: #212121;
        }
    }
    .password {
        font-size: px2rpx(14);
        line-height: px2rpx(20);
    }
}
</style>
