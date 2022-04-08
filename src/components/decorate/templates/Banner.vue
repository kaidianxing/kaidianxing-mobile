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
    <div class='swiper decorate' :style="{
        padding:`${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`
    }"  v-if='componentData&&componentData.id=="banner"'>
        <div class="container" :style="{
            height:imgHeight,
            borderRadius: getBorderRadius
        }">
            <MySwiper :key="componentData.style.marginleft" :startLoadImg='startLoadImg' :borderRadius="getBorderRadius" ref="swiper" :height='imgHeight' :list='getImgs' :imgStyle='imgStyle' @change='change' @click='click' :setting='setting'></MySwiper>
            <div v-if="getList.length>1">
                    <ul class='dots' :class='[componentData.style.dotstyle]' :style='{justifyContent:getAlign}' v-if='componentData.style&&componentData.style.dotstyle!="number"'>
                        <li class="dot" :style='{background:activeIndex==index?componentData.style.background:"#fff"}' :class='{active:activeIndex==index}' v-for='(item,index) in getList' :key='index'></li>
                    </ul>
                    <p class='number' :class='[getAlign]' v-else>
                        {{`${activeIndex+1}/${getList.length}`}}
                    </p>
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    import MySwiper from '../templates-shim/Swiper.vue'
    export default {
        mixins: [mixin],
        name: 'banner',
        components: {
            MySwiper
        },
        data() {
            return {
                activeIndex: 0,
                setting: {
                    autoplaySpeed: 3000,
                    autoplay: true,
                    loop: true
                },
                imgStyle:{
                    height:'100%',
                    width:'750rpx'
                },
                imgHeight: 0
            }
        },
        computed: {
            getAlign() {
                let align = {
                    left: "flex-start",
                    center: 'center',
                    right: 'flex-end'
                }
                return align[this.componentData.style.dotalign]
            },
            getList() {
                if (this.componentData.data instanceof Array) {
                    return this.componentData.data.map(item => {
                        let img;
                        if(item.imgurl) {
                            img = this.$utils.mediaUrl(item.imgurl)
                        } else {
                            img = this.$utils.staticMediaUrl('decorate/banner.png')
                        }
                        return {
                            img
                        }
                    })
                }
                return [];
            },
            getImgs(){
                return this.getList.map(v=>v.img)
            },
            getBorderRadius(){
                return `${this.px2rpx(this.componentData.style.topradius)} ${this.px2rpx(this.componentData.style.topradius)} ${this.px2rpx(this.componentData.style.bottomradius)} ${this.px2rpx(this.componentData.style.bottomradius)}`
            }
        },
        watch: {
           getList:{
                handler(){
                    if(!this.getList[0])return
                    if(!this.$isPC) {
                        let width = 750 - (this.componentData.style.marginleft*2)
                        this.imgStyle.width = width +'rpx'
                        this.imgHeight = this.px2rpx(this.componentData.style.imgheight || 180, 2)
                    } else {
                        // #ifdef H5
                        this.$utils.getImgInfo(this.getList[0].img).then(img=>{
                            let width = 750 - this.componentData.style.marginleft
                            let ratio = parseInt(this.px2rpx(width)) /img.width
                            this.imgHeight = img.height * ratio + 'px'
                        })
                        // #endif
                    }
                },
                immediate: true
            },
            'componentData.style.marginleft':{
                handler(){
                   if(!this.getList[0])return
                    if(!this.$isPC) {
                        this.imgHeight = this.px2rpx(this.componentData.style.imgheight || 136.75, 2)
                    } else {
                        // #ifdef H5
                        this.$utils.getImgInfo(this.getList[0].img).then(img=>{
                            let width = 700 - this.componentData.style.marginleft
                            let ratio = parseInt(this.px2rpx(width)) /img.width
                            this.imgHeight = img.height * ratio + 'px'
                        })
                        // #endif
                    }
                },
                immediate: true
            }
        },
        methods: {
            change(val) {
                this.activeIndex = val;
            },
            setSettings(settings) {
                this.setting = settings;
            },
            click(index) {
                this.$emit('custom-event', {
                    target: 'banner/clickImg',
                    data: {
                        items:this.componentData.data.map(v=>v.imgurl),
                        index,
                        linkurl: this.componentData.data[index]?.linkurl,
                        wxappid: this.componentData.data[index]?.wxappid,
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    @import './decorate.scss';
    .swiper.decorate {
        margin: 0 auto;
        overflow: hidden;
        min-height: px2rpx(96);

        .container {
            overflow: hidden;
            position: relative;
        }
        swiper,
        swiper-item,
        ._div,
        .swiper-img {
            height: 100%;
        }
        .swiper {
            height: 100%;
            /deep/ .ivu-carousel,
            .ivu-carousel-item,
            .ivu-carousel-list,
            .ivu-carousel-track {
                height: 100%!important;
            }
        }
        .dots {
            position: absolute;
            display: flex;
            bottom:rpx(16);
            box-sizing: border-box;
            padding: 0rpx(24);
            left: 0;
            right: 0;
            justify-content: center;
            .dot {
                width: px2rpx(6);
                height: px2rpx(6);
                background: #fff;
                margin: 0 px2rpx(3);
                opacity: 0.54;
            }
            .dot.active {
                opacity: 1;
            }
            &.round {
                .dot {
                    border-radius: 50%;
                }
            }
            &.rectangle {
                .dot {
                    width: px2rpx(8);
                    height: px2rpx(4);
                    border-radius: px2rpx(4);
                    margin: 0 px2rpx(3);
                }
            }
        }
        .number {
            position: absolute;
            display: flex;
            bottom:rpx(16);
            box-sizing: border-box;
            justify-content: center;
            color: #fff;
            background: rgba(0, 0, 0, 0.54);
            border-radius: px2rpx(22);
            flex-direction: column;
            flex-direction: column;
            text-align: center;
            width: fit-content;
            min-width: 60rpx;
            font-size: px2rpx(9);
            line-height: px2rpx(9);
            padding: px2rpx(3) px2rpx(5);
            right: px2rpx(12);
            &.flex-start{
                left: px2rpx(12);
            }
            &.flex-end {
                right: px2rpx(12);
            }
        }
    }
</style>
