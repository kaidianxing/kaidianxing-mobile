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
    <view class="detail-order-modal" v-show="showModal">
        <view class="v-modal"></view>
        <view class="pay-cover">
            <view class="flex1 flex-column inner">
                <view class="title uni-text-color">{{title}}</view>
                <view class="desc uni-text-color-grey">
                    <slot name="content"></slot>
                </view>
            </view>
            <view class="flex">
                <view class="red-bg theme-primary-color" @click="handlerCancel">关闭</view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "DetailOrderModal",
        components: {},
        props: {
            value: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                showModal: false
            }
        },
        watch: {
            value(newValue) {
                this.showModal = newValue
            }
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            handlerCancel() {
                this.$emit('handlerCancel')
            }
        },
    }
</script>

<style lang="scss" scoped>
    .detail-order-modal {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.6);
        z-index: 9999;
        .v-modal {
            position: absolute;
        }
        .pay-cover {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 644rpx;
            min-height: 300rpx;
            background-color: #fff;
            text-align: center;
            border-radius: 12rpx;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: 2;
            transform: translate(-50%, -50%);
            .title {
                margin: 32rpx 0;
                font-size: 28rpx;
                font-weight: bold;
                line-height: 40rpx;
            }
            .desc {
                font-size: 24rpx;
                line-height: 34rpx;
            }
            .flex {
                width: 100%;
                border-top: 1px solid $uni-border-color;
                >view {
                    width: 100%;
                    height: 80rpx;
                    line-height: 80rpx;
                    box-sizing: border-box;
                    font-size: 30rpx;
                    &.red-bg {
                        border-left: 1px solid $uni-border-color;
                        color: $uni-color-primary;
                    }
                }
            }
        }
    }
</style>