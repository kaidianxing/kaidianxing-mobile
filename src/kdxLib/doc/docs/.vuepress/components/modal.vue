<!--
 * @Description:模态框
 * @Autor: 青岛开店星信息技术有限公司
-->
<template>
    <div v-if="value" class="flex" :class="classes" :style="style">
        <div class="modal-main flex">
            <div v-if="title" class="title">{{title}}</div>
            <div v-if="content" class="content">{{content}}</div>
        </div>
        <div v-if="type !== 'radius'" class="footer flex van-hairline--top" :class="type">
            <div v-if="!hiddenCancel" class="btn-text van-hairline--right" @click="onCancel">{{cancelText}}</div>
            <div class="btn-text ok" @click="onOk">{{okText}}</div>
        </div>
        <div class="footer flex" :class="type" v-else>
            <button-sqx v-if="!hiddenCancel" class="cancel-btn" size="middle" ghost @btn-click="onCancel">取消</button-sqx>
            <button-sqx size="middle" @btn-click="onOk">确定</button-sqx>
        </div>
    </div>
</template>
<script>
    // 工具
    import PublicMixin from "../../lib/PublicMixin.js";

    const NAME = "Modal";

    export default{
        name: NAME,
        mixins: [PublicMixin],
        props: {
            // 是否显示dialog
            value: {
                type: Boolean,
                default: false,
            },
            type: { // 类型  default // 普通  radius // 圆角
                type: String,
                default: 'default'
            },
            title: { // 标题
                type: String,
                default: ''
            },
            content: { // 内容
                type: String,
                default: ''
            },
            okText: { // 确定按钮文字
                type: String,
                default: '确定'
            },
            cancelText: { // 取消按钮文字
                type: String,
                default: '取消'
            },
            hiddenCancel: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            // 样式计算
            classes() {
                return ["kdx-modal-wrap", ...this.classNames].join(" ");
            },
            style() {
                return `${this.styles}`;
            }
        },
        methods: {
            onCancel() {
                // 取消
                this.$emit('onCancel');
                this.$emit('input', false);
            },
            onOk() {
                // 确定
                this.$emit('onOK', false);
                this.$emit('input', false);
            }
        }
    }
</script>