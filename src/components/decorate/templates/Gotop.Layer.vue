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
        <!-- 返回顶部 -->
        <div class='gotop isfixed' :class='[componentData.params.iconposition]' :style="{bottom: getBottom,width:px2rpx(componentData.style.width),borderRadius:componentData.params.gotoptype=='0'?'50%':'0',background:componentData.params.gotoptype=='0'?componentData.style.background:'',opacity:componentData.params.gotoptype==1?1:componentData.style.opacity,margin:getMargin}" @click='clickGoTop' v-if='(componentData&&componentData.id=="gotop"&&componentData.show)||$isPC'>
            <img mode='widthFix' lazy-load :src="$utils.mediaUrl(componentData.params.imgurl)" alt="" class='img' v-if='componentData.params.gotoptype==1'>
            <i :class='[componentData.params.iconclass]' class='iconfont-icon' :style="{fontSize:px2rpx(componentData.style.width/1.5),lineHeight:px2rpx(componentData.style.width),color:componentData.style.iconcolor}" v-else></i>
        </div>
        <!-- 悬浮按钮 -->
        <div class="layerBody">
            <div class="fullscreen qrcode-img-box" v-if='showImg'>
                <div class="bg"></div>
                <div class='imgbox'>
                    <img mode='widthFix' class='qrcode-img' show-menu-by-longpress="true" lazy-load :src="$utils.mediaUrl(componentData.qrcodeurl)" alt="">
                </div>
                <i class="icon-m-haibaoxieyi1 iconfont-m-" @click.stop='closeQrcode'></i>
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'

    export default {
        mixins: [mixin],
        name: 'blockgroup',
        computed: {
            getMargin(){
                return `${this.px2rpx(this.componentData.style.top*1+100)} ${this.px2rpx(this.componentData.style.left*1+30)}`
            },
            getBottom() {//苹果X以上手机底部安全区
                if(!this.$isPC && this.componentData.params){
                    //position => right bottom
                    let position = this.componentData.params.iconposition ? this.componentData.params.iconposition : this.componentData.position
                    if(position.indexOf('bottom')>-1){
                        return  this.$store.state.areaBottom + 'px'
                    }else{
                        return 0
                    }
                }
                return 0
            },
        },
        data() {
            return {
                showImg: false,
                errorImg:''
            }
        },
        methods: {
            clickGoTop() {
                this.$emit('custom-event', {
                    target: 'gotop/clickGoTop',
                    data: this.componentData,
                })
            },
            closeQrcode() {
                this.showImg = false;
                if(!this.$isPC){
                    this.$decorator.setMaskStatus(false);
                }
                this.$emit('custom-event', {
                    target: 'layer/clickItem',
                    data: {
                        showImg: this.showImg
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    @import '../templates-shim/followbar.scss';
    .gotop {
        position: absolute;
        bottom: rpx(10);
        display: flex;
        flex-direction: column;
        text-align: center;
        z-index: 99999;
        border-radius: px2rpx(6);
        &.top {
            top: 0;
        }
        &.bottom {
            bottom: 0;
        }
        &.left {
            left: 0;
        }
        &.right {
            right: 0;
        }
        .iconfont-icon {
            width: 100%;
            text-align: center;
            margin: auto;
            display: block;
            height: 100%;
        }
        .img {
            width: 100%;
            height: auto;
            display: block;
            margin: auto;
        }
    }
    .layerBody {
        width: 100%;
        .layer {

            background: none;
            &::after {
                border: 0;
            }
            position: absolute;
            &.top {
                top: 0;
            }
            &.left {
                left: 0;
            }
            &.right {
                right: 0;
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
                overflow: scroll;
            }
            .icon-m-haibaoxieyi1 {
                color: #fff;
                width: px2rpx(30);
                height: px2rpx(30);
                font-size: px2rpx(30);
                position: absolute;
                left: 0;
                right: 0;
                top: calc( 50% + 164px );
                margin: auto;
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
