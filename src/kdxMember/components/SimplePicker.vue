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
    <ul class="my-picker" :class="getList.length > 1 ? 'list' : ''">
        <li
            class="_li"
            v-for="(item, index) in getList"
            :key="index"
            @click="clickItem(item)"
        >
            <p class="label" :style="{ width: `${labelWidth}rpx` }">
                {{ item.label }}
            </p>
            <div
                class="content"
                :class="{ 'fix-height': item.label === '头像' }"
                v-if="!item.mode"
            >
                <slot :data="item">
                    <p
                        v-if="!item.img"
                        :style="item.color ? `color:${item.color}` : ''"
                    >
                        {{ item.content }}
                    </p>
                    <img
                        class="avart"
                        lazy-load
                        mode="aspectFill"
                        :src="item.img"
                        alt=""
                        v-else
                    />
                </slot>
            </div>
            <div class="content" v-else>
                <picker :mode="item.mode" @change="change">
                    <p style="min-height:64rpx;line-height:64rpx;">
                        {{ item.content }}
                    </p>
                </picker>
            </div>
            <i class="icon-m-right iconfont-m-" v-if="item.type"></i>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        labelWidth: {
            type: [String, Number],
            default: 168
        },
        info: {
            type: [Object, Array],
            default: () => [
                // {
                //     label: 'label',
                //     content: 'content',
                //     img: require('@/assets/image/decorate/default/logo.jpg'),
                //     type: 'nav', //nav：路由跳转，col：展开
                // }, {
                //     label: 'label',
                //     content: 'content',
                //      color'',
                //     type: 'nav', //nav：路由跳转，col：展开
                // },
            ]
        }
    },
    computed: {
        getList() {
            if (this.info instanceof Array) {
                return this.info
            } else {
                return [this.info]
            }
        }
    },
    methods: {
        change(val) {
            this.$emit('change', val)
        },
        clickItem(item) {
            this.$emit('click', item)
        }
    }
}
</script>

<style lang="scss" scoped>
.my-picker {
    margin: 0 px2rpx(12);
    border-radius: px2rpx(6);
    padding-left: px2rpx(12);
    box-sizing: border-box;
    background: #fff;
    ._li {
        width: 100%;
        min-height: px2rpx(48);
        display: flex;
        flex-wrap: nowrap;
        padding: px2rpx(8) px2rpx(12) px2rpx(8) 0;
    }
    &.list ._li {
        border-bottom: 1rpx solid #e6e7eb;
        &:last-child {
            border: none;
        }
    }
    .label,
    .content,
    .icon-m-right {
        margin: auto 0;
        font-size: px2rpx(14);
        line-height: px2rpx(14);
        color: #212121;
    }
    .label {
        width: px2rpx(84);
    }
    .content {
        width: 0;
        flex: 1;
        &.fix-height {
            height: px2rpx(40);
            line-height: px2rpx(40);
        }
        .avart {
            width: px2rpx(40);
            height: px2rpx(40);
            display: block;
            border-radius: 50%;
        }
    }
    .icon-m-right {
        width: px2rpx(16);
        height: px2rpx(16);
        font-size: px2rpx(16);
        line-height: px2rpx(16);
        text-align: center;
    }
}
</style>
