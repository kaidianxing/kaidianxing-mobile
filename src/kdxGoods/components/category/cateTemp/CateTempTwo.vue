/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="temp-two">
        <scroll-view
            class="scroll-box"
            scroll-y
        >
            <div
                class="menu-list"
                v-for="(item, index) in list"
                :key="index"
                :class="{
                    'active': active == index
                }"
                @click="clickItem(item.id,index)"
            >
                <div
                    class="menu-title"
                    :class="{
                        'active theme-primary-color': active == index
                    }"
                >{{$utils.showCategoryName(item.name)}}</div>
                <div class="rect theme-primary-bgcolor"></div>
            </div>
        </scroll-view>
    </div>
</template>


<script>
export default {
    props: {
        list: {
            type: Array,
            default: () => []
        },
        active: {
            type: Number,
            default: 0
        }
    },
    methods: {
        clickItem(id, index) {
            if(this.active == index) return;
            this.$emit('on-choose', {
                id, index
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.temp-two {
    width: px2rpx(88);
    height: 100%;

    .scroll-box {
        height: 100%;
    }

    .menu-list {
        position: relative;
        padding-left: px2rpx(6);
        display: flex;
        align-items: center;
        flex-shrink: 0;
        width: px2rpx(88);
        height: px2rpx(48);
        line-height: px2rpx(20);
        background: #f5f5f5;
        text-align: center;

        .rect {
            display: none;
        }

        .menu-title {
            width: 100%;
            font-size: px2rpx(12);
            color: #212121;
            white-space: pre-line;
        }

        &.active {
            background: #fff;
            .menu-title {
                font-size: px2rpx(14);
                font-weight: 600;
                color: #ff3c29;
            }

            .rect {
                position: absolute;
                left: 0;
                top: 50%;
                transform: translate(0, -50%);
                width: px2rpx(5);
                height: px2rpx(18);
                display: block;
                background: linear-gradient(
                    104.32deg,
                    #ff3c29 0%,
                    #ff6f29 94.38%
                );
            }
        }
    }
}
</style>