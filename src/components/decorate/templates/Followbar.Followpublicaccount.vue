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
    <div>
        <!-- 关注条 -->
        <div class='followbar' v-if='componentData&&componentData.id=="followbar"&&(componentData.show===true || $isPC)'>
            <div class="container" :style="{background:componentData.style.background}">
                <div class="imgbox" :class='[componentData.params.iconstyle]'>
                    <img mode='widthFix' lazy-load :src="getImgUrl" alt="" class="logo">
                </div>
                <div class="body two-line-hide" :style="{color:componentData.style.textcolor}">
                    {{getContent}}
                </div>
                <div class="btn" :style="{color:componentData.style.btncolor,background:componentData.style.btnbgcolor}" @click='clickBtn'>
                    <span class='text'><i class='_i' style='margin-right:2px;' :class="[componentData.params.btnicon]" v-if="componentData.params.btnicon"></i>{{componentData.params.btntext}}</span>
                </div>
                <i class="icon-m-close iconfont-m-" :style="{color:componentData.style.highlight}" @click='close'></i>
            </div>
            <div class="fullscreen qrcode-img-box" v-if='showImg'>
                <div class="bg"></div>
                <div class='imgbox'>
                    <img mode='widthFix' class='qrcode-img' lazy-load show-menu-by-longpress="true" :src="$utils.mediaUrl(componentData.params?componentData.params.qrcodeurl:'')" alt="">
                    <i class="icon-m-haibaoxieyi1 iconfont-m-" @click.stop='closeQrcode'></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'followbar',
        data() {
            return {
                showImg: false,
                errorImg:''
            }
        },
        computed: {
            getContent() {
                return this.componentData.params.sharetext||this.componentData.params.defaulttext;
            },
            getImgUrl(){
                if(this.errorImg){
                    return this.errorImg
                }
                if(this.componentData.params?.icontype=='1') {
                    return  this.componentData.params?.imgurl_share
                } else if(this.componentData.params?.icontype=='2') {
                    if(this.$isPC) {
                        return  this.$utils.mediaUrl(this.componentData.params?.imgurl_logo)
                    } else {
                        return this.$utils.mediaUrl(this.$store.state.setting?.systemSetting?.basic?.logo)
                    }
                } else {
                    return  this.$utils.mediaUrl(this.componentData.params?.imgurl_icon)
                }
            }
        },
        methods: {
            replaceImage(){
                this.errorImg= this.$utils.staticMediaUrl('decorate/avatar_mobile.png')
            },
            closeQrcode() {
                this.showImg = false;
                if(!this.$isPC){
                    this.$decorator.setMaskStatus(false);
                }
                this.$emit('custom-event', {
                    target: 'followbar/clickBtn',
                    data: {
                        showImg: this.showImg
                    }
                })
            },
            clickBtn() {
                // pc 阻止点击事件
                if(this.$isPC){
                    return;
                }  else {
                    this.$decorator.setMaskStatus(true);
                }
                if (this.componentData.params.btnclick == 1 && this.componentData.params.qrcodeurl) {//展示二维码
                    this.showImg = true;
                    this.$emit('custom-event', {
                        target: 'followbar/clickBtn',
                        data: {
                            showImg: this.showImg,
                        }
                    })
                }else if(this.componentData.params.btnclick == 0 && this.componentData.params.linkurl){//跳转链接
                    this.$emit('custom-event', {
                        target: 'followbar/clickBtn',
                        data: {
                            linkurl: this.componentData.params.linkurl,
                        }
                    })

                }
            },
            close() {
                this.$emit('custom-event', {
                    target: 'followbar/close',
                    data: {
                        showtype: this.componentData.params?.showtype
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    @import '../templates-shim/followbar.scss';
    .followbar {
        width: 100%;
        .container {
            display: flex;
            flex-wrap: nowrap;
            height: px2rpx(48);
            padding: px2rpx(8) px2rpx(16);
            box-sizing: border-box;
            .imgbox {
                width: px2rpx(32);
                height: px2rpx(32);
                display: flex;
                align-items: center;
                flex-shrink: 0;
                overflow: hidden;
                .logo {
                    width: 100%;
                }
                &.radius {
                    border-radius: px2rpx(4);
                }
                &.circle {
                    border-radius: 50%;
                }
            }
            .body {
                width: 0;
                flex: 1;
                margin: auto 0;
                line-height: px2rpx(14);
                word-break: break-all;
                padding: 0 px2rpx(6);
                font-size: px2rpx(14);
            }
            .btn {
                height: px2rpx(24);
                border-radius: px2rpx(2);
                margin: auto 0;
                display: flex;
                flex-direction: column;
                text-align: center;
                font-size: px2rpx(12);
                .text {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    line-height: px2rpx(12);
                    font-size: px2rpx(12);
                    margin: auto;
                    padding: 0 px2rpx(4);
                }
                ._i {
                    line-height: px2rpx(12);
                    font-size: px2rpx(12);
                    text-align: center;
                    width: px2rpx(12);
                    height: px2rpx(12);
                    margin-right: px2rpx(2);
                }
            }
            .icon-m-close {
                width: px2rpx(12);
                height: px2rpx(12);
                font-size: px2rpx(12);
                text-align: center;
                line-height: px2rpx(12);
                margin: auto 0 auto px2rpx(8);
            }
        }
        .fullscreen {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            .bg {
                position: absolute;
                width: 100%;
                height: 100%;
                background: rgba(#212121,0.7);
            }
            .imgbox {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: px2rpx(256);
                height: px2rpx(256);
                box-sizing: content-box;
                padding: px2rpx(12);
                background: #fff;
                border-radius: px2rpx(6);
                .icon-m-haibaoxieyi1 {
                    color: #fff;
                    width: px2rpx(30);
                    height: px2rpx(30);
                    font-size: px2rpx(30);
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: px2rpx(-54);
                    margin: auto;
                }
            }
            .qrcode-img {
                width: px2rpx(256);
                height: px2rpx(256);
                border: 1px solid #E6E7EB;
                box-sizing: border-box;
                border-radius: px2rpx(6);
            }
        }
    }
</style>