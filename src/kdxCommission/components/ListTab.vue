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
    <view class="list-tab">
        <view class="tab flex">
            <view class="item" :class="current === item.type?'active theme-primary-color':''"
                  v-for="(item, index) in status" :key="index" @click="changeTab(item.type)">
                {{item.text}}
                <span v-if="type=='downLine'">({{item.level_num}})</span>
                <span class="line  theme-primary-bgcolor"></span>
            </view>
        </view>
    </view>
   </theme-content>
</template>

<script>
    export default {
        name: "ListTab",
        components: {},
        props: {
            type: {
                type: String,
                default: ''
            },
            status: {
                type: Array
            },
            current: {
                type: [String, Number],
                default: ''
            },
            num: {
                type: [String, Number],
                default: 0
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
            changeTab(type) {
                this.$emit('changeTab', type)
            }
        },
    }
</script>

<style lang="scss" scoped>
    .list-tab {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 999;
        .tab {
            background-color: #fff;
            border-top: 1px solid $uni-border-color;
            .item {
                -webkit-box-flex: 1;
                -ms-flex: 1;
                -webkit-flex: 1;
                flex: 1;
                text-align: center;
                line-height: 80rpx;
                font-size: 28rpx;
                color: #565656;
                position: relative;
                .line {
                    width: 56rpx;
                    height: 4rpx;
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    display: none;
                    background-color: transparent;
                    transform: translateX(-50%);
                    border-radius: 4rpx !important;
                }
            }
            .item.active {
                font-size: 32rpx;
                font-weight: 600;
                .line {
                    display: block;
                }
            }
        }
    }
</style>