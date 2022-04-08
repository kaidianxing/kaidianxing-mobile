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
    <pick-mask
        @mask-close="handleCancel"
        v-if="value"
    >
        <view
            class="inner flex-column"
            :style="{
                height: height
            }"
            @touchmove.stop.prevent
        >
            <div class="title-box" :style="{
                padding: `0 ${padding}`
            }">
                <view class="title">{{title}}</view>
                <view class="picker-close" @click="handleCancel">
                    <img
                        class="close-img"
                        :src="$utils.staticMediaUrl('verify/close.png')"
                        alt="" />
                </view>
            </div>
            <scroll-view
                scroll-y
                class="content-box"
                :style="{
                    padding: `0 ${padding}  16rpx`
                }"
            >
                <view
                    class="content"
                    :style="{background: customStyle.background, color: customStyle.textcolor}"
                >
                    <slot></slot>
                </view>
            </scroll-view>
            <view class="slot_footer" v-if="$slots.footer">
                <slot name="footer"></slot>
            </view>
        </view>
    </pick-mask>
</template>

<script>
import { mapState } from 'vuex'

import PickMask from '@/components/picker/PickMask'
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        customStyle: {
            type: Object,
            default: () => {
                return {}
            }
        },
        title: {
            type: String,
            default: ''
        },
        height: {
            type: String
        },
        padding: {
            type: String,
            default: '24rpx'
        }
    },
    components: {
        PickMask
    },
    methods: {
        handleCancel() {
            this.$emit('input', false)
        }
    }
}
</script>

<style lang="scss">
.inner {
    background: #fff;
    border-radius: 20rpx 20rpx 0 0;
    height: 600rpx;
    justify-content: space-between;
    box-sizing: border-box;
    .content-box {
        flex: 1;
        padding-bottom: 16rpx;
        height: 348rpx;
        box-sizing: border-box;
    }

    .title-box {
        position: relative;
        .title {
            padding: 24rpx 0 32rpx;
            text-align: center;
            color: $uni-text-color;
            font-size: 32rpx;
            font-weight: bold;
            line-height: 44rpx;
        }

        .picker-close {
            position: absolute;
            top: px2rpx(12);
            right: px2rpx(12);
            width: px2rpx(24);
            height: px2rpx(24);
            .close-img {
                width: px2rpx(24);
                height: px2rpx(24);
            }
        }
    }

 

    .close-btn {
        margin-top: 16rpx;
        background: linear-gradient(
            172.93deg,
            $uni-color-primary 0%,
            #ff6f29 94.38%
        );
        color: #fff;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        border-radius: 40rpx;
    }
}
</style>