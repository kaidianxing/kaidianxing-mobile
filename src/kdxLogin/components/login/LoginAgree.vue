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
    <view class="login-agree" v-if="visible" :style="{
        height: windowHeight
    }">
        <view class="container">
            <view class="box">
                <view class="title">{{ title }}</view>
                <scroll-view class="content" scroll-y>
                    <view v-html="formatHtml(content)"></view>
                </scroll-view>
            </view>
            <view class="foot">
                <text
                    class="iconfont-m- icon-m-haibaoxieyi1 close-icon"
                    @click="closeAgree"
                ></text>
            </view>
        </view>
    </view>
</template>
<script>
import {mapState} from 'vuex'
export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: '标题',
        },
        content: {
            type: String,
            default: '<p>内容</p>',
        },
    },
    computed: {
        ...mapState(['windowHeight']),
    },
    methods: {
        closeAgree() {
            this.$emit('update:visible', false)
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
.login-agree {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999999;
    width: 100vw;
    background: rgba(#000, 0.6);

    .container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 488rpx;

        .box {
            border-radius: 12rpx;
            width: 100%;
            padding: 32rpx 24rpx;
            background-color: #fff;

            .title {
                margin-bottom: 24rpx;
                font-size: 32rpx;
                line-height: 44rpx;
                text-align: center;
                color: #212121;
                font-weight: bold;
            }

            .content {
                height: 500rpx;
                font-size: 24rpx;
                /deep/ uni-view {
                    font-size: 24rpx;
                }
            }
        }

        .foot {
            margin-top: 48rpx;
            text-align: center;
            height: 48rpx;
            line-height: 48rpx;
            .close-icon {
                font-size: 48rpx;
                color: #fff;
            }
        }
    }
}
</style>
