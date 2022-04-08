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
    <div class="container">
        <div class="title">{{ title }}</div>
        <div class="time">{{ time }}</div>
        <div class="content" v-html="formatHtml(detail)"></div>
    </div>
</template>
<script>
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    data() {
        return {
            id: '',
            title: '',
            time: '',
            detail: '',
        }
    },
    mounted() {
        this.id = this.$Route.query.id
        this.getNoticeDetail()
    },
    methods: {
        // 获取公告详情
        getNoticeDetail() {
            this.$api.othersApi
                .getNoticeDetail({
                    id: this.id,
                })
                .then((res) => {
                    if (res.error === 0) {
                        this.title = res.data.title
                        this.time = res.data.created_at
                        this.detail = res.data.detail
                    }
                })
        },
        formatHtml(content) {
            // #ifdef MP-TOUTIAO
            // 字节跳动小程序不识别 引号 特殊字符， 需要转一下
            content = content.replace(/&ldquo;/g, '“')
            return content.replace(/&rdquo;/g, '”')
            // #endif
            // #ifndef MP-TOUTIAO
            return content
            // #endif
        },
    },
}
</script>
<style lang="scss" scoped>
.container {
    padding: 32rpx 24rpx;
    background-color: #fff;
    color: #212121;
    font-size: 32rpx;
    line-height: 56rpx;
    .title {
        font-weight: bold;
        font-size: 40rpx;
        line-height: 56rpx;
        color: #212121;
    }
    .time {
        padding-top: 16rpx;
        padding-bottom: 32rpx;
        font-size: 24rpx;
        line-height: 34rpx;
        color: #969696;
    }
}
</style>
