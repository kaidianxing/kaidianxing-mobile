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
    <wx-open-subscribe
        id="wechatSubscribe"
        style="position: absolute;width: 100%; height: 100%;opacity: 0; z-index: 100;"
        :style="subStyle"
        :template="templates.join(',')"
        @success="wechatSubscribeSuccess"
        @error="wechatSubscribeError"
    >
        <script type="text/wxtag-template">
            <style>
                .subscribe-btn {
                    width: 100%;
                    display: block;
                    height: 42px;
                    border-radius: 24px
                }
            </style>
            <button class="subscribe-btn" ></button>
        </script>
    </wx-open-subscribe>
</template>


<script>
// 给嵌套它的父级设置 position: relative 等。
export default {
    props: {
        templates: {
            type: Array,
            default: () => [],
        },
        radius: {
            type: String,
            default: '24px'
        },
        width: {
            type: String,
            default: '100%',
        },
        height: {
            type: String,
            default: '100%',
        },
        top: {
            type: String,
            default: '0',
        },
        left: {
            type: String,
            default: '0',
        },
        subStyle: {
            type: String,
            default: '',
        },
    },
    methods: {
        wechatSubscribeSuccess() {
            this.$emit('success');
        },
        wechatSubscribeError() {
            this.$emit('error');
        },
    },
}
</script>