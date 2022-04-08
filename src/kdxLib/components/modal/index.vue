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
            <div class="btn-text ok" :class="btnClass" @click="onOk">{{okText}}</div>
        </div>
        <div class="footer flex" :class="type" v-else>
            <btn v-if="!hiddenCancel" class="cancel-btn" size="middle" ghost @btn-click="onCancel">取消</btn>
            <btn size="middle" :classNames="btnClass" @btn-click="onOk">确定</btn>
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
            },
            btnClass: { // 确认按钮颜色
                type: String
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