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
    <div class='detail_swipe swiper' :style='"height:"+height+";"'>
        <swiper :current='value' touchable :autoplay="!setting.autoplay===false" :circular="!setting.loop===false" :interval="setting.autoplaySpeed" :duration="setting.duration||500" @change='change' :key='key'>
            <swiper-item v-for="(data,index) in getList" :key='index' :style='"height:"+height'>
                <!-- #ifdef H5 -->
                <div class='content-box'>
                    <div class='detail_video' v-if="data.video" @click='data.clickBtn'>
                        <my-video class='myvideo' ref='myvideo' :src='$utils.mediaUrl(data.video, "", "video")' @pause="data.pause" @stop='data.stop' :key='data.video'></my-video>
                        <div class="modal" v-if='playing==0&&data.video_thumb'>
                            <p class='poster' :style="{backgroundImage:`url(${$utils.mediaUrl(data.video_thumb)})`}"></p>
                            <i class="iconfont-m- icon-m-shipinplay"></i>
                        </div>
                    </div>
                    <div class='img-box' v-else>
                        <img @click="click(index)" :src="$utils.mediaUrl(data.img)" alt="">
                    </div>
                </div>
                <!-- #endif -->
                 <!-- #ifdef MP-WEIXIN || MP-TOUTIAO -->
                <div class='content-box'> 
                    <div class='detail_video' v-if="data.video" @click='clickBtn'> 
                        <my-video class='myvideo' :id="'MyVideo'+ index" ref='myvideo'  :src='$utils.mediaUrl(data.video, "", "video")' @pause="pause" @stop='stop' ></my-video>
                        <!-- #ifdef MP-WEIXIN -->
                        <div class="modal" id='videoModal' v-if='data.playing==0&&data.video_thumb&&refreshKey==0'>
                            <p class='poster' :style="{backgroundImage:`url(${$utils.mediaUrl(data.video_thumb)})`}"></p>
                            <i class="iconfont-m- icon-m-shipinplay"></i>
                        </div>
                        <!-- #endif -->
                    </div>
                    <div class='img-box' v-else>
                        <img @click="click(index)" :src="$utils.mediaUrl(data.img)" alt="">
                    </div>
                </div>
                <!-- #endif -->
            </swiper-item>
        </swiper>
    </div>
</template>

<script>
    import MyVideo from './MyVideo.vue'
    export default {
        components: {
            MyVideo
        },
        props: {
            refreshKey:{//头条小程序有bug，只能用这个属性填坑
                type: [String,Number],
                default: ''
            },
            height: {
                type: String,
                default: ''
            },
            list: {
                type: Array,
                default: () => []
            },
            startIndex: {
                type: Number,
                default: 0
            },
        },
        watch: {
            list: {
                immediate: true,
                deep: true,
                handler() {
                    this.key = Math.random();
                    this.value = this.startIndex
                }
            }
        },
        computed: {
            getList() {
                return this.list.map(item => {
                    if (item.video) {
                        item = {
                            ...item,
                            clickBtn:this.clickBtn.bind(this),
                            pause:this.pause.bind(this),
                            stop:this.stop.bind(this),
                            playing:this.playing,
                        }
                    }
                    return item
                })
            }
        },
        data() {
            return {
                id:'goodswiper',
                video: null,
                $myvideo: null,
                playing: 0, //0没开始 1正在播放 2暂停
                key: '',
                value: 0,
                setting: {
                    autoplay: false,
                    loop: false
                },
            }
        },
        mounted() {
            
            this.$decorator.$on('refreshMyVideo',() =>{
                this.playing=0
                this.$emit('refresh',this.playing)
            })
        },
        methods: {
            clickBtn() {
                this.$refs.myvideo[0]?.click();
                this.playing = 1;
                this.$emit('custom-event', {
                    target: 'video/clickBtn',
                });
            },
            stop() {
                this.$nextTick(()=>{
                    this.playing = 0;
                })
            },
            pause() {
                this.$nextTick(()=>{
                    this.playing = 2;
                })
            },
            change(val) {
                let {
                    detail: {
                        current
                    }
                } = val;
                this.$emit('change', current)
            },
            click(val) {
                this.$emit('click', val)
            }
        }
    }
</script>

<style lang="scss" scoped>

.img-box {
    height: 100%;

    img {
       object-fit: contain; 
       object-position: center;
        background: #000;
    }
}
    swiper {
        height: 100%;
    }
    .swiper-img {
        text-align: center;
        width: 100%;
        display: block;
        height: px2rpx(142);
    }
    .swiper {
        height: px2rpx(142);
        overflow: hidden;
    }
    .detail_swipe,
    .detail_swipe .content-box {
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
            padding: 0 px2rpx(24);
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
            }
            .modal {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                display: flex;
                flex-direction: column;
                z-index: 10;
                color: #fff;
                .poster {
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
                    display: inline-block;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: px2rpx(72);
                    width: px2rpx(72)!important;
                    height: px2rpx(72)!important;
                    text-align: center;
                    line-height: px2rpx(72);
                    color: #fff;
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