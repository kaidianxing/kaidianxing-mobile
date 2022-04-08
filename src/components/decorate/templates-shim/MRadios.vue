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
    <div class="m-radios">
        <div class="m-radios-box">
            <div class="radio-item" v-for="(item, index) in data" :key="index" @click="handleClick(item.name)">
                <p class="radio-box">
                    <span class="icon-m-yes iconfont-m-" v-if="value === item.name"></span>
                    <span class="icon-m-no iconfont-m-" v-else></span>
                </p>
                <span class="radio-label">{{item.name}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MRadios",
        props: {
            value: {
                type: [String, Number]
            },
            data: {
                type: Array,
                default: () => []
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                name: ''
            };
        },
        methods: {
            handleClick(value) {
                if(this.disabled) return
                if (this.value !== value) {
                    this.$emit('input', value)
                    this.$emit('on-change', value)
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .m-radios {
        border: px2rpx(1) solid #E6E7EB;
        margin-top: px2rpx(8);
        border-radius: px2rpx(2);
        /*margin-left: px2rpx(24);*/
        .m-radios-box {
            .radio-item {
                padding: px2rpx(14) 0 px2rpx(14) px2rpx(12);
                border-bottom: px2rpx(1) solid #E6E7EB;
                display: flex;
                align-items: center;
                &:last-child {
                    border-bottom: none;
                }
                .radio-label {
                    font-size: px2rpx(14);
                    line-height: px2rpx(20);
                    color: #212121;
                    padding-left: 8px;
                    vertical-align: top;
                }
                .radio-box {
                    line-height: px2rpx(20);
                    cursor: pointer;
                    > .iconfont-m- {
                        font-size: px2rpx(20);
                        line-height: px2rpx(20);
                        &.icon-m-no {
                            color: #E6E7EB;
                        }
                        &.icon-m-yes {
                            color: #FF3C29;
                        }
                    }
                }
            }
        }
    }
</style>
