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
    <div class="category-menu">
        <scroll-view class="scroll-view" :scroll-y="true">
            <view
                class="content-left-item"
                v-for="(item, index) in list"
                :key="index"
            >
                <view>
                    <div
                        :class="
                            menuChose == index
                                ? 'text text-bg text-overflow1 theme-primary-bgcolor'
                                : 'text text-overflow1'
                        "
                        @click="changeMenu(index)"
                    >{{ $utils.showCategoryName(item.name)}}
                    </div>
                </view>
            </view>
        </scroll-view>
    </div>
</template>

<script>
export default {
    components: {},
    props: {
        list: {
            type: Array,
            default: () => [],
        },
        menuChose: {
            type: [String, Number],
            default: 0,
        },
        template: {
            type: [String, Number],
            default: 1,
        },
    },
    data() {
        return {
            menuList: [],
        }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        // 切换左侧菜单
        changeMenu(index) {
            this.$emit('changeMenu', index)
        },
    },
}
</script>

<style lang="scss">
.category-menu {
    flex-shrink: 0;
    width: 184rpx;
    font-size: 24rpx;
    background-color: #fff;
    .scroll-view {
        width: 184rpx;
        height: calc(100vh - 92rpx - 100rpx - 16rpx);
        padding-top: 32rpx;
        box-sizing: border-box;
    }
    .content-left-item {
        width: 100%;
        height: 100rpx;
        text-align: center;
        box-sizing: border-box;

        button:after {
            display: none;
        }

        .text {
            width: 160rpx;
            display: block;
            line-height: 40rpx;
            border-radius: 8rpx;
            margin: 0 auto;
            font-size: 28rpx;
            background-color: #fff;
            text-align: center;
            color: #212121;
            white-space: pre-line;
        }
        .text-bg {
            color: #fff;
        }
    }
}
</style>
