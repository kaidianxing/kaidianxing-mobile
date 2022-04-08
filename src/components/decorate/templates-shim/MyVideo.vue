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
    <video :id="videoId" class='myVideo' :style='[{borderRadius: `${px2rpx(borderRadius.topradius)} ${px2rpx(borderRadius.topradius)} ${px2rpx(borderRadius.bottomradius)} ${px2rpx(borderRadius.bottomradius)}`}]' :src="src" :ref="videoId" :enable-progress-gesture="false" controls :key='videoId' @play="playHandler" @ended='stop'  x5-video-player-type="h5"
 x5-video-player-fullscreen="true"
 x5-video-orientation="portrait"></video>
</template>

<script>
    //#ifdef MP-TOUTIAO
    import bus from './bus.js'
    //#endif
   import mixin from "../templates/mixin";
    export default {
        mixins: [mixin],
        props: {
            width: {
                type: Number,
                default: 750
            },
            src: {
                type: String,
                default: ''
            },
            videoId:{
                type: String,
                default: 'myVideo'
            },
            loop: {},
            /*修改视频radius*/
            borderRadius: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        data() {
            return {
                playing: 0, //0没开始 1暂停 2结束
                video: null,
                long: 0, //视频长度
                left: 0, //剩余视频时间
                bar: null,
                isLoaded: false
            }
        },
        onReady() {
            // #ifndef MP-ALIPAY
            this.video = uni.createVideoContext(this.videoId);
            // #endif
            //#ifdef MP-TOUTIAO
            bus.$emit('videomounted',this)
            //#endif
            this.$decorator.$on('refreshMyVideo',() =>{
                this.stop()
            })
        },
        beforeDestroy(){
            clearInterval(this.bar)
        },
        methods: {
            playHandler(){
                if(!this.isLoaded && this.playing==0){
                    this.$emit('on-play')
                   this.isLoaded = false
                }
            },
            click() {
                if (this.playing != 1) {
                    this.play();
                } else {
                    this.pause();
                }
            },
            play() {
                this.playing = 1;
                //#ifdef MP-WEIXIN
                this.video = uni.createVideoContext(this.videoId,this);
                //#endif
                //#ifdef MP-TOUTIAO
                bus.$emit('videoplay',this.playing)
                //#endif
                if (!this.video) {
                    this.video =  uni.createVideoContext(this.videoId);
                    this.video.play();
                } else {
                    this.video.play();
                    //#ifndef MP-TOUTIAO
                    this.bar = setInterval(() => {
                        this.long = this.video.duration || this.video.durationTime;//头条小程序没有这些属性
                        this.left = this.video.currentTime;
                        if (this.left >= this.long) {
                            this.stop();
                        }
                    }, 500)
                    //#endif
                }
            },
            pause() {
                clearInterval(this.bar)
                this.playing = 2;
                //#ifdef MP-TOUTIAO
                bus.$emit('videoplay',this.playing)
                //#endif
                this.video.pause();
                this.$emit("pause");
            },
            stop() {
                clearInterval(this.bar)
                this.playing = 3;
                //#ifdef MP-TOUTIAO
                bus.$emit('videoplay',this.playing)
                //#endif
                this.video?.stop();
                this.$emit("stop");
            }
        }
    }
</script>

<style lang="scss">
    video {
        width:100%;
        height: 100%;
        display:block;
    }
</style>