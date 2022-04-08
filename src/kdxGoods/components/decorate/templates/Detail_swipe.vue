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
    <div class='detail_swipe decorate' v-if='componentData&&componentData.id=="detail_swipe"'>
        <MySwiper :list='getList' @refresh='refresh' :refreshKey='key' @change='change' @click='click' ref='myswiper'></MySwiper>
        <ul class='dots'
        :class='[componentData.style.dotstyle]'
        :style='{
            justifyContent:getAlign,
            margin:`${px2rpx(componentData.style.bottom)} ${px2rpx(componentData.style.leftright)}`,
            opacity:componentData.style.opacity}'
            v-if='componentData.style&&componentData.style.dotstyle!="number" && getList.length>1'
            >
            <li class="dot"
            :style='{background:getBg(index)}'
            :class='{active:activeIndex==index,video:getList[index].video}'  v-for='(item,index) in getList' :key='index'>
                <i class="dot-img icon-m-shipin iconfont-m-" :style="{color:getIconClass(index)}"   v-if='getList[index].video&&componentData.style.dotstyle=="round"'></i>
            </li>
        </ul>
        <p class='number' :style="{background: componentData.style.background}" :class='[componentData.style.dotalign]' v-if='componentData.style&&componentData.style.dotstyle=="number"'>
            {{`${activeIndex+1}/${getList.length}`}}
        </p>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    import MySwiper from '@/components/decorate/templates-shim/GoodSwiper.vue'
    export default {
        mixins: [mixin],
        name: 'detail_swipe',
        components: {
            MySwiper,
        },
        data() {
            return {
                activeIndex: 0,
                key:''
            }
        },
        computed: {
            getAlign() {
                let align = {
                    left: "flex-start!important",
                    center: 'center!important',
                    right: 'flex-end!important'
                }
                return align[this.componentData.style.dotalign]
            },
            getList() {
                let list = [];
                if (this.componentData.data instanceof Array) {
                    list = this.componentData.data.map(item => {
                        return {
                            img: item.imgurl
                        }
                    })
                }
                if (this.componentData.params.video) {
                    list = [this.componentData.params, ...list]
                }
                return list;
            }
        },
        methods: {
            refresh(k){
                this.key=k;
            },
            change(val) {
                this.activeIndex = val;
            },
            click(index) {
                if(this.componentData.params.video) {
                    index = index - 1
                }
                this.$emit('custom-event', {
                    target: 'detail_swipe/clickImg',
                    data: {
                        items:this.componentData.data.map(v=>v.imgurl),
                        index,
                    }
                })
            },
            getBg(index) {
                if(this.activeIndex==index){
                    return this.componentData.style.background
                }
                return '#212121'
            },
            getIconClass(index){
                if(this.componentData.style.dotstyle!=="number"  &&this.activeIndex==index){
                    return this.componentData.style.background
                }
                return '#c4c4c4'
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import './decorate.scss';
</style>
<style lang="scss">
    .detail_swipe.decorate,
    .detail_swipe.decorate .content-box {
        -webkit-overflow-scrolling: touch;
        position: relative;
        width: px2rpx(375);
        height: px2rpx(375);
        margin: 0 auto;
        overflow: hidden;
        swiper {
            width: 100%;
            height: px2rpx(375)!important;
            view,
            swiper,
            swiper-item,
            image {
                width: 100%!important;
                height: 100%!important;
                display: block;
            }
        }
        .swiper {
            width: 100%;
            height: px2rpx(375)!important;
            view,
            swiper,
            swiper-item,
            img {
                width: 100%!important;
                height: 100%!important;
            }
        }
        .dots {
            position: absolute;
            display: flex;
            bottom: px2rpx(16);
            box-sizing: border-box;
            padding: 0 0;
            left: 0;
            right: 0;
            padding:0 px2rpx(24);
            justify-content: center!important;
            text-align: center;
            .dot {
                width: px2rpx(6);
                height: px2rpx(6);
                background: $uni-text-color;
                margin: auto px2rpx(3);
                opacity: 0.34;
                border-radius: 50%;
                position: relative;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            .dot-img {
                width: px2rpx(12);
                height: px2rpx(12);
                font-size: px2rpx(12);
                line-height: px2rpx(12);
                text-align: center;
                margin: auto;
            }
            .dot.active {
                opacity: 1;
            }
            &.round {
                .dot.video {
                    width: px2rpx(12);
                    height: px2rpx(12);
                    background: rgba(0, 0, 0, 0) !important;
                    color: #c4c4c4;
                    opacity: 1;
                    transform: scale(.9);
                }
                .dot.video.active {
                    background: #c4c4c4!important;
                    color: #212121;
                    opacity: 1;
                }
            }
            &.rectangle {

                .dot {
                    width: px2rpx(10);
                    height: px2rpx(4);
                    border-radius: px2rpx(2);
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
            }
        }
        .detail_video {
            width: px2rpx(375);
            height: px2rpx(375);
            display: flex;
            position: relative;
            &.ratio-0 {
                height: rpx(345);
            } // 4:3
            &.ratio-1 {
                height: rpx(459);
            } // 1:1
            &.ratio-2 {
                height: rpx(612);
            }
            .myvideo {
                width: 100%;
                height: 100%;
                border-radius: px2rpx(6);
            }
            .modal {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                flex-direction: column;
                z-index: 10;
                .poster {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    width: 100%;
                    height: 100%;
                }
                .pause {
                    display: block;
                    width: rpx(120);
                    margin: auto;
                    position: relative;
                    z-index: 100;
                }
            }
        }
        .number {
            position: absolute;
            display: flex;
            bottom: px2rpx(16);
            box-sizing: border-box;
            justify-content: center;
            color: #fff;
            background: rgba(0, 0, 0, 0.54);
            border-radius: px2rpx(22);
            flex-direction: column;
            text-align: center;
            width: fit-content;
            min-width: 60rpx;
            font-size: px2rpx(9);
            line-height: px2rpx(9);
            padding: px2rpx(3) px2rpx(5);
            left: 50%;
            transform: translate(-50%, 0);
            &.left {
                left: px2rpx(24);
                transform: translate(0, 0);
            }
            &.right {
                left: auto;
                right: px2rpx(24);
                transform: translate(0, 0);
            }
        }
    }
</style>
