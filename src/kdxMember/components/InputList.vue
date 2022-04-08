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
    <div class="input-list">
        <div class="_li" v-for="(item, index) in list" :key="index">
            <p class="label">{{ item.label }}</p>
            <input
                type="text"
                class="input"
                :value="item.content"
                :placeholder="item.placeholder"
                @input="getInput(index, $event)"
            />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        list: {
            type: Array,
            default: () => [
                {
                    label: 'label',
                    content: '',
                    placeholder: 'placeholder'
                }
            ]
        }
    },
    methods: {
        getInput(index, { detail: { value } }) {
            this.$emit('input', {
                value,
                index
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.input-list {
    width: 100%;
    padding-left: px2rpx(12);
    background: #fff;
    border-radius: px2rpx(6);
    ._li {
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        height: px2rpx(48);
        border-bottom: 1rpx solid #e6e7eb;
        &:last-child {
            border: none;
        }
        .label {
            width: px2rpx(84);
            font-size: px2rpx(14);
            line-height: px2rpx(14);
            @include vertical-align-center(left);
            color: #212121;
        }
        .input {
            width: 0;
            flex: 1;
            font-size: px2rpx(14);
            height: 100%;
            @include vertical-align-center(left);
            color: #212121;
        }
    }
}
</style>
