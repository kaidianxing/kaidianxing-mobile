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
    <div :class="classes" :style="style">
        <div :class="type">
            <!-- 普通 -->
            <div class="container">
                <div class="img">
                    <img v-if="imgUrl" class="default-img" :src="imgUrl" />
                    <i v-if="icon" class="icon" :class="icon"></i>
                </div>
                <div class="title line-hide" v-if="title">{{title}}</div>
                <div class="desc two-line-hide">{{desc}}</div>
                <btn v-if="btn" class="w100" :classNames="btnClass" type="default" ghost @btn-click="btnClick">{{btn}}</btn>
            </div>
        </div>
        <div v-if="type === 'custom'">
            <slot></slot>
        </div>
    </div>
</template>

<script>

    // 工具类
    import { mediaUrl, staticMediaUrl } from "../../utils";

    // 工具
    import PublicMixin from "../../lib/PublicMixin.js";

    const NAME = "DefaultPage";

    export default {
        name: NAME,
        mixins: [PublicMixin],
        components: {},
        props: {
            type: { // default custom
                type: String,
                default: 'default'
            },
            imgUrl: {
                type: String,
                default: ''
            },
            icon: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            },
            desc: { // 简介
                type: String,
                default: ''
            },
            btn: { // 按钮文字
                type: String,
                default: ''
            },
            // 按钮样式
            btnClass: {
                type: [String,Array]
            }
        },
        data() {
            return {}
        },
        computed: {
            // 样式计算
            classes() {
                return ["kdx-default-page-wrap", ...this.classNames].join(" ");
            },
            style() {
                return `${this.styles}`;
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            btnClick() {
                // 确定
                this.$emit('btnClick');
            }
        },
    }
</script>