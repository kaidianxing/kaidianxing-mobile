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
    <view class="img-code">
        <image class="imgCode" :src="imgSrc" @click="refresh" />
    </view>
</template>

<script>
import { getFullPath } from '@/common/util'
const settings = require('@/static/settings.js').config

export default {
    props: {
        config: {
            type: String,
            default: '/member/index/get-capture'
        },
    },
    data() {
        return {
            imgSrc: '',
            sessionId: ''
        }
    },
    beforeMount() {
        this.sessionId = this.localStorage.getItem('session-id')
        this.refresh()
    },
    computed: {
        parseUrl() {
          let url = getFullPath(this.config);
          url = url.indexOf('?') > -1 ? url + '&' : url + '?'
            let src = `${url}Session-Id=${this.sessionId}`
            return src
        }
    },
    methods: {
        refresh() {
            this.imgSrc = `${this.parseUrl}&v=${Date.now()}`
        }
    }
}
</script>

<style lang="scss" scoped>
.img-code {
    display: flex;
    flex-wrap: nowrap;
}

.imgCode {
    width: 144rpx;
    height: 56rpx;
}
</style>
