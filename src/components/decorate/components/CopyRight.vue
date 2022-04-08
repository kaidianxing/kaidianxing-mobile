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
    <div class="diyCopyright"  @click="toCopyRightUrl">
        <div style="padding: 16rpx 24rpx 0;" :class="{'diyCopyRow': copyright.style_model === '2', 'diyCopyCol': copyright.style_model === '3'}">
            <block v-if="copyright.style_model != '1'">
                <img class="logo" mode="heightFix" :src="$utils.mediaUrl(copyRightData.logo, '', logoType)" alt="">
            </block>
            <!--链接跳转-->
            <div>{{copyRightData.message}}</div>
            <!--富文本-->
            <div v-if="copyRightData.message_switch==='20' && copyright.advanced_copyright === '1'">
                <my-rich-text :content='copyRightData.message_vip'></my-rich-text>
            </div>
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
                copyright: state => state.systemSetting?.core_settings?.copyright,
                logo: state => state.systemSetting?.basic?.logo
            }),
            copyRightData() {
                let result = {},
                    key = `style${this.copyright.style_model}`;
                result = {
                    ...this.copyright[key],
                    logo: (this.copyright[key]?.logo_switch === '10' && this.copyright?.advanced_copyright === '0')?this.logo : (this.copyright[key]?.logo_switch === '20' && this.copyright?.advanced_copyright === '1' ? this.copyright[key]?.logo : this.logo)
                };
                return result
            },
            // 店铺独立存储时，logo拼接的类型
            logoType() {
                return 1 === +this.copyright?.advanced_copyright && 20 === +this.copyRightData?.logo_switch ? 'manage' : '';
            }
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
        .logo {
            min-width: 60rpx;
            width: 100rpx;
            height: 50rpx;
            margin-right: 16rpx;
        }
        .diyCopyRow {
            display: flex;
            justify-content: center;
            align-items: center;
            .logo {
                min-width: 60rpx;
                width: 100rpx;
                height: 50rpx;
                margin-right: 16rpx;
            }
        }
        .diyCopyCol {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .logo {
                width: 100rpx;
                height: 50rpx;
                margin: 16px 0 8px;
            }
        }
    }
</style>