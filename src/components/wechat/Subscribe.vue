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