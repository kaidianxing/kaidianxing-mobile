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
    <view class="guide-index" v-if="value">
        <view class="guide-content flex">
            <view class="guide-text">点击 “ <i class="iconfont-m- icon-m-xiaochengxugengduo"></i> ” 添加到我的小程序</view>
            <view class="close" @click="closeGuide">知道了</view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "Guide",
        components: {},
        props: {
            value: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {}
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            closeGuide() {
                this.$emit('input', false)
            }
        },
    }
</script>

<style lang="scss" scoped>
    .guide-index {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 9999999;
        width: 100%;
        .guide-content {
            position: absolute;
            right: 24rpx;
            top: 18rpx;
            align-items: baseline;
            padding: 24rpx 32rpx;
            width: 508rpx;
            /*height: 112rpx;*/
            background: rgba(0,0,0,.7);
            border-radius: 6rpx;
            &:after {
                content: '';
                position: absolute;
                right: 20%;
                top: -13rpx;
                border: 13rpx solid rgba(0,0,0,.7);
                transform: rotate(45deg);
                border-radius: 4rpx;
                border-right-color: transparent;
                border-bottom-color: transparent;
            }
            .close {
                width: 72rpx;
                flex-shrink: 0;
                margin-left: 10rpx;
                color: $uni-color-primary;
                font-size: 24rpx;
            }
            .guide-text {
                flex: 1;
                font-size: 24rpx;
                color: #fff;
                .iconfont-m- {
                    font-size: 40rpx;
                    vertical-align: bottom;
                }
            }
        }
    }
</style>