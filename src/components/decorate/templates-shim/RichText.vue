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
    <div class="rich-text-box">
        <mp-html :content="formatHtml(content)" :preview-img="isPreview"></mp-html>
    </div>
</template>

<script>
import mpHtml from '@/components/mp-html/mp-html'
import {mapState} from "vuex";
export default {
    props: {
        content: {
            type: [Number, String],
            default: ''
        }
    },
    components: {
        mpHtml
    },
    computed: {
        ...mapState('setting', ['systemSetting']),
        isPreview() {
            return this.systemSetting ?.basic ?.photo_preview == '1'
        }
    },
    methods: {
        formatHtml(content) {
            // #ifdef MP-TOUTIAO
            // 字节跳动小程序不识别 引号 特殊字符， 需要转一下
            content = content.replace(/&ldquo;/g, '“')
            return content.replace(/&rdquo;/g, '”')
            // #endif
            // 拼接富文本图片和视频url
            content = this.$utils.richMediaUrl(content);
            content = this.$utils.richVideo(content);
            return content;
        },
    },
}
</script>

<style lang="scss" scoped>
// #ifdef H5
.rich-text-box {
    width: 100%;
    height: 100%;
    white-space: pre-wrap;
    word-break: break-all;
    font-size: px2rpx(14);

    /deep/ img {
        max-width: 100%;
    }
    /deep/ ul {
        display: block;
        list-style-type: disc;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 40px;
        li {
            display: list-item;
            text-align: -webkit-match-parent;
            list-style-type: disc;
        }
    }
    /deep/ ol {
        display: block;
        list-style-type: disc;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 40px;
        li {
            display: list-item;
            text-align: -webkit-match-parent;
            list-style-type: decimal;
        }
    }
    /* #ifdef H5 */
    /deep/ uni-image {
        width: 100% !important;
    }
    /* #endif */
    /deep/ h1,
    /deep/ h1 span,
    /deep/ h2,
    /deep/ h2 span,
    /deep/ h3,
    /deep/ h3 span,
    /deep/ h4,
    /deep/ h4 span,
    /deep/ h5,
    /deep/ h5 span,
    /deep/ h6,
    /deep/ h6 span,
    /deep/ strong, /deep/ ._strong {
        font-weight: bold;
        span,em {
            font-weight: bold;
        }
    }
    /deep/ em,
    /deep/ ._em span,
    /deep/ em span {
        font-style: italic;
    }
    /deep/ table{
        width: 100%!important;
    }
}
// #endif
</style>