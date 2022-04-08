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
    <view class="rr-modal" v-show="showModal">
    <theme-content>
        <view class="v-modal"></view>
        <view class="pay-cover">
            <view class="flex-column inner">
                <view class="title uni-text-color">{{title}}</view>
                <view class="desc uni-text-color-grey" v-if="$slots && $slots.content">
                    <slot name="content"></slot>
                </view>
                <view class="desc uni-text-color-grey" v-if="subtitle">{{subtitle}}</view>
            </view>
            <view class="flex">
                <!-- #ifdef H5 -->
                <view class="flex-item btn" @click="handlerCancel">{{cancelText}}</view>
                <!-- #endif -->
                <!-- #ifndef H5 -->
                <cover-view class="flex-item " @click="handlerCancel">
                    <button class="btn">{{cancelText}}</button>
                </cover-view>
                <!-- #endif -->
                <view class="flex-item red-bg btn theme-primary-color" v-if="showOkBtn" @click="handlerOK">{{okText}}</view>
            </view>
        </view>
    </theme-content>

    </view>
</template>

<script>
import ThemeContent from 'components/theme/ThemeContent.vue'
export default {
    name: 'Modal',
    components: {ThemeContent},
    props: {
        value: {
            type: Boolean,
            default: false
        },
        okText: {
            type: String,
            default: '确定'
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        title: {
            type: String,
            default: '确定用余额支付吗？'
        },
        subtitle: {
            type: String,
            default: ''
        },
        showOkBtn: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            showModal: false
        }
    },
    watch: {
        value(newValue) {
            this.showModal = newValue
        },
    },
    created() {},
    methods: {
        handlerOK() {
            this.$emit('handlerOK')
        },
        handlerCancel() {
            this.$emit('handlerCancel')
        }
    }
}
</script>

<style lang="scss" scoped>
.rr-modal {
    .v-modal {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0.6;
        background: #000;
        z-index: 99999999;
    }
    .pay-cover {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 490rpx;
        background: #fff;
        text-align: center;
        border-radius: 12rpx;
        margin: auto;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 99999999;
        .inner {
            justify-content: center;
            align-items: center;
            padding: 32rpx 50rpx;
            min-height: 185rpx;
        }
        .title {
            font-size: 32rpx;
            /*font-weight: bold;*/
        }
        .desc {
            padding-top: 16rpx;
            font-size: 24rpx;
            line-height: 34rpx;
        }
        .flex {
            width: 100%;
            border-top: 1px solid $uni-border-color;

            .btn {
                height: 80rpx;
                line-height: 80rpx;
                box-sizing: border-box;
                font-size: 28rpx;
                &.red-bg {
                    border-left: 1px solid $uni-border-color;
                    color: $uni-color-primary;
                }

                
            }

            button {
                background-color:#fff;
                font-size: 28rpx;
                color: #212121;

                &::after {
                    border: 0;
                    border-radius: 0;
                }
            }

            .flex-item {
                flex: 1;
            }
        }
    }
}
</style>