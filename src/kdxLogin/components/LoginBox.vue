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
    <page-box no-login>
        <view class="login-box">
            <image :src="logo" @error="loadImg" class="logo" />
            <slot></slot>
        </view>
        <template v-slot:foot>
            <view class="agree" @click="readAgree" v-if="isLogin">
                <text class="agree-tip">登录即表示您已阅读并同意</text>
                <text class="agree-content">《用户使用协议》</text>
            </view>
        </template>
        <login-agree :visible.sync="showAgree" :content="content" :title="title"></login-agree>
    </page-box>
</template>

<script>
import LoginAgree from './login/LoginAgree'

export default {
    props: {
        isLogin: {
            type: Boolean,
            default: true
        }
    },
    components: {
        LoginAgree
    },
    data() {
        return {
            logo: '',
            title: '',
            content: '',
            showAgree: false
        }
    },
    mounted() {
        this.getSetting()
    },
    methods: {
        getSetting() {
            let {
                basic: { logo, agreement_content, agreement_name }
            } = this.$store.state.setting.systemSetting

            this.logo = this.$utils.mediaUrl(logo)
            this.title = agreement_name
            this.content = agreement_content
        },
        readAgree() {
            this.showAgree = true
        },
        loadImg() {
            this.logo = this.$utils.staticMediaUrl('decorate/logo_default.png')
        }
    }
}
</script>

<style lang="scss" scoped>
.login-box {
    margin: 80rpx auto 0;
    width: 588rpx;
    min-height: 100vh;
    .logo {
        display: block;
        margin: 0 auto 104rpx;
        height: 200rpx;
        width: 200rpx;
        border-radius: 50%;
    }
}

.agree {
    text-align: center;
    font-size: 24rpx;
    line-height: 34rpx;
    margin-bottom: 32rpx;

    &-tip {
        color: $uni-text-color-grey;
    }

    &-content {
        color: #518def;
    }
}
</style>
