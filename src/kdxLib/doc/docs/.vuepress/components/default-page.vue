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
                <button-sqx v-if="btn" class="w100" type="default" ghost @btn-click="btnClick">{{btn}}</button-sqx>
            </div>
        </div>
        <div v-if="type === 'custom'">
            <slot></slot>
        </div>
    </div>
</template>

<script>
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
            },
            handleImgUrl() {
                let imgUrl = this.imgUrl;
                if (imgUrl.indexOf('http') !== -1) {
                    imgUrl = mediaUrl(imgUrl)
                }
                return imgUrl || staticMediaUrl('kdxLib/defaultPage/default-page.png')
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            btnClick() {
                // 确定
                this.$emit('btnClick', false);
            }
        },
    }
</script>