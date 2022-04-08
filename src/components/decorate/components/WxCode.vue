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
    <div
        class="code-modal"
        v-if="visible"
        @touchmove.stop.prevent
        :style="{
        height: windowHeight
    }"
    >
        <div class="main">
            <div class="main-content">
                <div>
                    <img
                        :src="shopWxCode"
                        class="main-content-code"
                        v-if='shopWxCode'
                    />
                </div>
                <div class="main-content-title" v-if="showWxcodeType=='wx_service'">请使用小程序端联系客服</div>
                <div class="main-content-title" v-else-if="showWxcodeType == 'app_skip'">请使用小程序端跳转第三方App</div>
            </div>
            <div
                class="main-footer"
                @click="closeWxCode"
            >
                <i class="iconfont-m- icon-m-haibaoxieyi1 close-icon"></i>
            </div>
        </div>
    </div>
</template>


<script>
import { mapState, mapMutations } from 'vuex';
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            codeImg: ''
        }
    },
    computed: {
        ...mapState(['windowHeight','shopWxCode','showWxcodeType']),
    },
    methods: {
        ...mapMutations(['changeWxCode']),
        closeWxCode(){
            this.changeWxCode({status: false})
        }
    }
}
</script>

<style lang="scss" scoped>
.code-modal {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999999;
    width: 100vw;
    background: rgba(#000, 0.6);

    .main {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: px2rpx(220);
        height: px2rpx(274);

        &-content {
            border-radius: px2rpx(6);
            width: px2rpx(220);
            height: px2rpx(241);
            padding: px2rpx(24) px2rpx(24) px2rpx(13);
            background: #fff;

            &-code {
                width: px2rpx(172);
                height: px2rpx(172);
            }

            &-title {
                margin-top: px2rpx(14);
                font-size: px2rpx(12);
                line-height: px2rpx(17);
                color: #969696;
                text-align: center;
            }
        }

        &-footer {
            margin-top: px2rpx(24);
            text-align: center;

            .close-icon {
                font-size: px2rpx(30);
                color: #fff;
            }
        }
    }
}
</style>