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
    <view class="my-search-input" :style="bgStyle">
        <view class="grace-items" :style="inputStyle">
            <input
                type="text"
                confirm-type="search"
                class="input"
                :class="noSearch ? 'noSearch' : ''"
                name="name"
                :maxlength="maxlength"
                :value="val"
                :disabled="disabled"
                :placeholder="placeholder"
                @input="getInput"
                @focus="getFocus"
                @blur="getBlur"
            />
            <view
                class="iconfont-m- icon-m-Closewithcircle  icon-close"
                @click.stop="getInput('clear')"
                v-show="showClear && !disabled"
            ></view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        placeholder: {
            type: String,
            default: '请输入昵称'
        },
        bgStyle: {
            type: String,
            default: ''
        },
        inputStyle: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        value: {
            type: String,
            default: ''
        },
        noSearch: {
            type: Boolean,
            default: false
        },
        maxlength: {
            type: Number
        }
    },
    watch: {
        value: {
            immediate: true,
            handler() {
                this.val = this.value
            }
        }
    },
    data() {
        return {
            val: ''
        }
    },
    computed: {
        showClear() {
            return this.val !== ''
        }
    },
    methods: {
        getBlur(val) {
            this.val = val.detail.value
            this.$emit('input', val.detail)
        },
        getFocus(val) {
            this.val = val.detail.value
            this.$emit('input', val.detail)
        },
        getInput(val) {
            if (val == 'clear') {
                this.val = ''
                this.$emit('clear')
                this.$emit('input', '')
            } else {
                this.val = val.detail.value
                this.$emit(val.type, val.detail)
                this.$emit('input', val.detail)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.my-search-input {
    background: #fff;
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 80rpx;
    .grace-items {
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        background: #f5f7fa;
        width: 100%;
        height: 100%;
        border-radius: 12rpx;
        .icon-close {
            width: 50rpx;
            height: 50rpx;
            line-height: 50rpx;
            text-align: center;
            margin: auto;
            font-size: 24rpx;
            color: #ccc;
        }
        .input {
            width: 0;
            flex: 1;
            height: 100%;
            line-height: 66upx;
            padding: 0 10upx;
            color: #999;
            font-size: 28rpx;
            color: #212121;
            &.noSearch {
                width: 680upx;
            }
        }
    }
}
</style>
