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
    <view id='create-poster'>
        <block v-if='!imgUrl'>
            <!-- 海报模板 -->
            <vue-canvas-poster :widthPixels="1000" :painting="painting" @success="createPoster" @fail="fail"></vue-canvas-poster>
        </block>
        <!-- 防止a标签下载失败 -->
        <div class="preview"  @touchmove.stop v-else>
            <img :src="imgUrl" alt="" style='width:606rpx;'>
        </div>
    </view>
</template>

<script>
    // #ifdef H5
    import {VueCanvasPoster} from 'vue-canvas-poster'
    // #endif
    let posterLoadingImg = {}; //海报图片加载状态缓存；全部图片加载结束后才会进行海报生成
    let cacheData = null;
    export default {
        props: {
            painting: {
                type: Object,
                default: () => ({})
            },
            imgSrc: {
                type: String,
                default: ''
            }
        },
        components: {
            VueCanvasPoster
        },
        watch: {
            imgSrc: {
                immediate: true,
                handler() {
                    if (this.imgSrc) {
                        this.imgUrl = this.imgSrc
                        uni.hideLoading();
                    }
                }
            }
        },
        data() {
            return {
                imgUrl: '',
                callback: null,
                throttle: null,
            }
        },
        methods: {
            create(callback) {
                if (typeof callback == 'function') {
                    this.callback = callback
                }
            },
            fail(e){
                this.$toast('生成海报失败')
            },
            createPoster(img) {
                this.imgUrl = img 
                if (!this.throttle) {
                    this.throttle = new Promise((resolve, reject) => {
                        this.$nextTick(() => {
                            if (this.imgUrl) {
                                if (typeof this.callback == 'function') {
                                    this.callback(this.imgUrl);
                                }
                                resolve(this.imgUrl);
                                this.throttle = null
                                return
                            }
                           
                           
                        })
                    })
                }
                return this.throttle
            }
        }
    }
</script>

<style lang="scss" scoped>
    .preview {
        overflow: hidden;
        width: 100%;
        height: 100%;
        border-radius: 12rpx;
        z-index: 9999;
        img {
            display: block;
            margin: auto;
        }
    }
</style>