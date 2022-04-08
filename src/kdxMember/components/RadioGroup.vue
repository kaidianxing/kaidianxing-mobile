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
<theme-content>
    <div class="my-radio-group">
        <view
            class="row"
            v-for="(item, index) in list"
            :key="index"
            @click="clickItem(index)"
        >
            <view class="label">
                <i
                    class="icon"
                    :class="item.preIcon"
                    :style="{ color: item.iconColor }"
                ></i>
            </view>
            <view class="body">
                {{ item.content }}
            </view>
            <i
                class="icon-m-yes iconfont-m-"
                :class="{ 'active theme-primary-color': activeIdx == index }"
            ></i>
        </view>
    </div>
    </theme-content>
</template>

<script>
export default {
    props: {
        active: {
            type: [Number, String],
            default: 0
        },
        list: {
            type: Array,
            default: () => [
                {
                    preIcon: 'icon-m-pay-wechatpay iconfont-m-',
                    label: 'label',
                    iconColor: '',
                    content: ''
                }
            ]
        }
    },
    watch: {
        active: {
            immediate: true,
            handler() {
                this.activeIdx = this.active
            }
        }
    },
    methods: {
        clickItem(index) {
            this.activeIdx = index
            this.$emit('change', index)
        }
    },
    data() {
        return {
            activeIdx: 0
        }
    }
}
</script>

<style lang="scss" scoped>
.my-radio-group {
    background: #fff;
    border-radius: px2rpx(6);
    overflow: hidden;
    padding-left: px2rpx(12);
    .row {
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        height: px2rpx(48);
        border-bottom: 1rpx solid #e6e7eb;
        &:last-child {
            border: none;
        }
        .label {
            height: 100%;
            width: px2rpx(28);
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex-shrink: 0;
            .icon {
                width: px2rpx(20);
                height: px2rpx(20);
                font-size: px2rpx(20);
            }
        }
        .body {
            width: 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: px2rpx(14);
            line-height: px2rpx(14);
            color: #212121;
        }
        .icon-m-yes {
            width: px2rpx(14);
            height: px2rpx(14);
            font-size: px2rpx(12);
            margin: auto px2rpx(14) auto px2rpx(10);
            line-height: px2rpx(18);
            text-align: center;
            background: #fff;
            color: rgba(0, 0, 0, 0);
            border: 1rpx solid #e6e7eb;
            border-radius: 50%;
            &.active {
                width: px2rpx(20);
                height: px2rpx(20);
                font-size: px2rpx(20);
                border: none;
                color: #ff3c29;
                margin: auto px2rpx(12);
            }
        }
    }
}
</style>
