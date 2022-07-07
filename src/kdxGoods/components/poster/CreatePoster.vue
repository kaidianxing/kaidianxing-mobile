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
