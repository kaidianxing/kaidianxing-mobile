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
    <view class="goods-image-swiper">
        <!-- 视频封面>视频>商品主图>轮播图 -->
        <!-- 视频-->
        <view class="goods-video" v-if="thumbMsg.video">
            <video v-if="!thumbMsg.video_thumb" id="video" :src="thumbMsg.video"
                   :muted="false" controls
                   :autoplay="true"
                   :show-mute-btn='true'
                   :auto-pause-if-navigate='true'>
            </video>
            <view v-if="thumbMsg.video_thumb"
                  class='video-thumb' :style="'background-image:url('+(thumbMsg.video_thumb)+')'">
                <i class="iconfont-m- icon-m-shangpinxiangqing-play"></i>
            </view>
        </view>
        <!-- 轮播 -->
        <view class="goods-swiper" v-else>
            <swiper v-if="thumbMsg.thumb_all.length > 0" :indicator-dots="true" :circular="true">
                <swiper-item v-for="(item, index) in thumbMsg.thumb_all" :key="index">
                    <view class="thumb-image" :style="'background-image:url('+(item)+')'" @click="previewImage(item)"></view>
                </swiper-item>
            </swiper>
        </view>
    </view>
</template>

<script>
    export default {
        components: {},
        props: {
            thumbMsg: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {

            }
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            previewImage(item) {
                uni.previewImage({
                    current: item,
                    urls: this.thumbMsg.thumb_all
                })
            }
        },
    }
</script>

<style lang="scss">
    .goods-image-swiper {
        width: 100%;
        height: 750rpx;
        background-color: #fff;
        .goods-video {
            position: relative;
            height: 100%;
            overflow: hidden;
            video {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
            }
            .video-thumb {
                position: relative;
                height:100%;
                background-size: cover;
                background-repeat:no-repeat;
                background-position:center;
                .iconfont-m-i {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    font-size: 120rpx;
                    opacity: .7;
                    transform: translate(-50%, -50%);
                    cursor: pointer;
                }
            }
        }
        .goods-swiper {
            width: 100%;
            height: 750rpx;
            swiper {
                width: 100%;
                height: 750rpx;
            }
            .thumb-image {
                height:100%;
                background-size: cover;
                background-repeat:no-repeat;
                background-position:center;
            }
        }
    }
</style>
