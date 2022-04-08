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
    <btn @btn-click="clickBuntton" :classNames="classes" type="text" :disabled="status" :ghost="status">{{ getText }}</btn>
</template>

<script>
export default {
    data() {
        return {
            timer: 60,
            bar: '',
            status: false,
            isFirst: true,
        }
    },
    computed: {
        classes(){
            return ['ptb']
        },
        getText() {
            return this.status
                ? this.timer + 's后重新发送'
                : this.isFirst
                ? '获取验证码'
                : '重新获取'
        },
    },
    methods: {
        clickBuntton() {
            if (!this.status) {
                this.refresh()
                this.$emit('click', false)
            }
        },
        start() {
            if (!this.status) {
                this.status = true
                this.isFirst = false

                this.bar = setInterval(() => {
                    if (this.timer > 1) {
                        this.timer--
                    } else {
                        this.refresh()
                    }
                }, 1000)
            }
        },
        refresh() {
            this.timer = 60
            this.status = false
            clearInterval(this.bar)
            this.$emit('refresh')
        },
    },
    beforeMount() {
        this.refresh()
    },
}
</script>

<style lang="scss" scoped>
.my-round-button {
    min-width: 180rpx;
    height: 54rpx;
    border-radius: 27rpx;
    text-align: center;
    font-size: 24rpx;
    color: #ff3c29;
    overflow: visible;
    padding: 0 20rpx;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    &.timing {
        color: #ccc;
        &:after {
            border: 1rpx solid #ccc;
            border-radius: 54rpx;
            bottom: -47%;
        }
    }
    &:after {
        border: 1rpx solid #ff3c29;
        border-radius: 54rpx;
        bottom: -47%;
    }
}
.imgCode {
    width: 150rpx;
    height: 54rpx;
    margin: auto 10rpx auto 0;
}
.password-code {
    display: flex;
    flex-wrap: nowrap;
}
</style>
