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
    <!--自定义首页与会员中心页面版权设置-->
    <div class="diyCopyright" >
        <div >
            <span></span>
            <p>开店星提供技术支持</p>
        </div>
    </div>
</template>

<script>

    import MyRichText from "../templates-shim/RichText";
    import {mapState} from "vuex";

    export default {
        name: "CopyRight",
        components: {
            MyRichText
        },
        computed: {
            ...mapState('setting',{
                logo: state => state.systemSetting?.basic?.logo
            }),
        },
        created() {
        },
        mounted() {
        },
        methods: {
            toCopyRightUrl() {
                let plat;
                // #ifdef H5
                plat = this.copyright.h5
                // #endif
                // #ifdef MP-WEIXIN
                plat = this.copyright.wxapp
                // #endif

                if(plat.url_type == '1'){
                    let src = plat.url
                    // #ifdef H5
                    if (src.indexOf('http://') == -1 && src.indexOf('https://') == -1 && src.indexOf('wxfile://') == -1) {
                        src = 'http://' + src
                    }
                    window.location.href = src;
                    // #endif
                    // #ifdef MP-WEIXIN
                    uni.navigateTo({
                        url: '/kdxOthers/webview?link=' + src
                    })
                    // #endif
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    .diyCopyright {
        font-size: px2rpx(12);
        padding: 30rpx 0 0;
        span{
            display: block;
            margin: 0 auto;
            width: 116rpx;

            height: 40rpx;
            margin-bottom: 4rpx;
            background-image: url("data:image/png;base64,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");
            background-size: 116rpx 40rpx;
            background-repeat: no-repeat;

        }
        image{
            margin: 0 auto;
            width: 116rpx;
            height: 40rpx;
            display: block;
            margin-bottom: 4rpx;

        }
       p{
           color: #cccccc;
           font-size: px2rpx(12);
       }
    }
</style>
