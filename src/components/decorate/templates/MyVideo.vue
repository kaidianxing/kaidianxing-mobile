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
    <div class='video' v-if='componentData&&componentData.id=="video"' :style="{
        padding:`${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`
    }" >
        <!-- wap端 -->
        <div class="video-container" :class='["ratio-"+componentData.style.ratio]' @click.stop='clickBtn' :style="{
            borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`
        }">
            <my-video class='myvideo' :videoId='getRef || "myvideo"' :width='702' :src='storeVideo' :ref='getRef|| "myvideo"' @on-play="clickBtn" v-if=' componentData.params.videourl&&startLoadImg' @pause="pause" @stop='stop' :key='componentData.params.videourl.type' :borderRadius="componentData.style"></my-video>
            <img class='default-poster' :src="defaultImg" alt="" v-else>
            <!--#ifndef MP-TOUTIAO-->
            <div class="modal" v-if='playing==0&&(componentData.params.poster||$isPC)'>
                <p class='poster'  :style="{backgroundImage:`url(${$utils.mediaUrl(componentData.params.poster)})`}"></p>
                <i class="iconfont-m- icon-m-shipinplay"></i>
            </div>
            <!--#endif-->
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    import MyVideo from '../templates-shim/MyVideo'
    export default {
        components: {
            MyVideo
        },
        mixins: [mixin],
        name: 'myvideo',
        computed: {
            defaultImg() {
                
                switch (this.componentData.style.ratio+'') {
                    case '0':
                        return this.$utils.staticMediaUrl('decorate/video16_9.png')
                    case '1':
                        return this.$utils.staticMediaUrl('decorate/video4_3.png')
                    case '2':
                        return this.$utils.staticMediaUrl('decorate/video1_1.png')
                }
                return this.$utils.staticMediaUrl('decorate/video16_9.png')
            },
            getRef(){
                return this.componentData._comIndex_
            },
            storeVideo() {
                // #21828 兼容之前数据
                let path = ''
                if(typeof this.componentData.params.videourl == "string") {
                    path = this.componentData.params.videourl
                }else if(typeof this.componentData.params.videourl == "object") {
                    path = this.componentData.params.videourl.path
                }
                if(this.$isPC) {
                    return this.$utils.mediaUrl(path, "video")
                }else {
                    return this.$utils.mediaUrl(path, "", "video")
                }
            }
        },
        watch: {
            'componentData.params.videourl': {
                immediate: true,
                handler() {
                    if (this.componentData.params.videourl) {
                        this.playing = 0;
                    }
                }
            }
        },
        data() {
            return {
                playing: 0, //0没开始 1正在播放 2暂停
                video: null
            }
        },
        mounted() {
            if (!this.$isPC) {
                this.$decorator.$on('refreshMyVideo',() =>{
                    this.playing=0
                })
            }
        },
        methods: {
            stop() {
                this.playing = 0;
            },
            pause() {
                this.playing = 2;
            },
            clickBtn() {
                this.$nextTick(()=>{
                    if(!this.$isPC){
                        this.$decorator.getModule('video').clickVideo(this)
                        this.$emit('custom-event', {
                            target: 'video/clickBtn',
                        });
                    }else{
                        if (this.componentData.params.videourl) {
                            this.playing = 1;
                            this.$refs[this.getRef|| "myvideo"].click();
                            this.$emit('custom-event', {
                                target: 'video/clickBtn',
                            });
                        }
                    }
                    
                })
               
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .video {
        display: flex;
        position: relative;
        margin: auto;
        padding: px2rpx(8) px2rpx(12) px2rpx(0);
        font-size: 0;

        &-container {
            width: 100%;
            position: relative;
            border-radius: px2rpx(6);
            overflow: hidden;

            &.ratio-0 {
                height: px2rpx(197);
            } // 4:3
            &.ratio-1 {
                height: px2rpx(263);
            } // 1:1
            &.ratio-2 {
                height: px2rpx(351);
            }
        }
        .myvideo {
            width: 100%;
            height: 100%;
        }
        .default-poster { 
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            height: 100%;
            width: 100%;
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
                display:block;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                width: 100%;
                height: 100%;
                background-repeat: no-repeat;
                background-position: center center;
                background-size: cover;
            }
            .pause {
                display: block;
                width: rpx(120);
                margin: auto;
                position: relative;
                z-index: 100;
            }
            .iconfont-m- {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: px2rpx(72);
                width: px2rpx(72);
                height: px2rpx(72);
                text-align: center;
                line-height: px2rpx(72);
                color: #fff;
                opacity: .8;
                &::after {
                    content: "";
                    position: absolute;
                    background:rgba(0,0,0,0.32);
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    margin:auto;
                    width: 82%;
                    height: 82%;
                    border-radius:50%;
                    z-index: -1;
                }
            }
        }
    }
</style>