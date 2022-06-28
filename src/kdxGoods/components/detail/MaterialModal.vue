<template>
<theme-content>
    <view v-if="showMaterial">
        <pick-mask class='pick-mask' v-if="value" @mask-close="cancel" >
            <view class="container" @touchmove.stop.prevent>
                <view class="title" >立即分享给好友</view>
                <scroll-view scroll-y class="content" :style="{ height: type === 'share' ? '374px' : '354px' }">
                    <view class="text">
                        <view class="description">{{ goods.data.goods.material.description_type === "0" ? "📢 现在下单超划算，赶紧下单" : goods.data.goods.material.description }}</view>
                        <view class="goods" v-if="goods.data.goods.material.description_type == '0'">👍 {{ goods.data.goods.title || "" }}</view>
                        <view class="item">💰 {{ goodsPrice }}</view>
                        <view class="item">👉 购买链接：{{url}}</view>
                    </view>
                    <view v-if="goods.data.goods.material && goods.data.goods.material.material_type == 0" class="img-list">
                        <img class="img" v-for="(item, index) in thumbAll" :src="$utils.mediaUrl(item)" :key="index" alt="">
                    </view>
                    <view class="video" v-else>
                        <!-- #ifdef H5 || APP-PLUS -->
                        <div class='detail_video' @click='clickBtn'>
                            <my-video class='myvideo' ref='myvideo' :src='$utils.mediaUrl(goods.data.goods.material.video, "", "video")' @pause="pause" @stop='stop'></my-video>
                            <div class="modal" v-if='playing==0&&goods.data.goods.material.video_thumb'>
                                <p class='poster' :style="{backgroundImage:`url(${$utils.mediaUrl(goods.data.goods.material.video_thumb)})`}"></p>
                                <i class="iconfont-m- icon-m-shipinplay"></i>
                            </div>
                        </div>
                        <!-- #endif -->
                        <!-- #ifdef MP-WEIXIN || MP-TOUTIAO -->
                        <div class='detail_video' @click='clickBtn'>
                            <my-video class='myvideo' id="MyVideo" ref='myvideo'  :src='$utils.mediaUrl(goods.data.goods.material.video, "", "video")' @pause="pause" @stop='stop' ></my-video>
                            <!-- #ifdef MP-WEIXIN -->
                            <div class="modal" id='videoModal' v-if='playing==0&&goods.data.goods.material.video_thumb&&refreshKey==0'>
                                <p class='poster' :style="{backgroundImage:`url(${$utils.mediaUrl(goods.data.goods.material.video_thumb)})`}"></p>
                                <i class="iconfont-m- icon-m-shipinplay"></i>
                            </div>
                            <!-- #endif -->
                        </div>
                        <!-- #endif -->
                    </view>
                </scroll-view>
                <view class="save">
                    <view class="save-text">
                        <i class="sel-icon iconfont-m- icon-m-tuiguang"></i>
                        一键复制分享到微信、朋友圈
                    </view>
                    <view class="save-btn" @click="save">
				        <!-- #ifndef MP-WEIXIN -->
                        复制文字
				        <!-- #endif -->
				        <!-- #ifdef MP-WEIXIN -->
                        <i class="sel-icon iconfont-m- icon-m-xiazaitupian1"></i>
                        保存图文
				        <!-- #endif -->
                    </view>
                </view>
                <view class="cancel" @click="cancel">取消</view>
            </view>
        </pick-mask>
        <view class="ticket"
            v-if="visible"
            @touchmove.stop.prevent
            :style="{ height: windowHeight }">
            <view class="modal">
                <view class="bg">
                    <image v-if="success" class="img" :src="$utils.staticMediaUrl('material/success1.png')"></image>
                    <image v-else class="img" :src="$utils.staticMediaUrl('material/fail1.png')"></image>
                    <view class="know">
                        <view class="text">
                            <i class="iconfont-m- icon-m-danchuangqueren"></i>
                            文案已复制到剪切板
                        </view>
                        <view class="text" v-if="success">
                            <!-- #ifndef MP-WEIXIN -->
                            <i class="iconfont-m- icon-m-danchuangqueren"></i>
                            图片需逐个长按保存
                            <!-- #endif -->
                            <!-- #ifdef MP-WEIXIN -->
                            <i class="iconfont-m- icon-m-danchuangqueren"></i>
                            图片或视频已保存至相册
                            <!-- #endif -->
                        </view>
                        <view class="text" v-else>
                            <i class="iconfont-m- icon-m-danchuangcuowu"></i>
                            图片或视频保存失败
                        </view>
                        <view class="btn-confirm" @click="close">确认</view>
                    </view>
                </view>
                <view class="close">
                    <text
                        class="iconfont-m- icon-m-haibaoxieyi1 close-icon"
                        @click="close"
                    ></text>
                </view>
            </view>
        </view>
    </view>
</theme-content>
</template>

<script>
import { mapState } from 'vuex'
import MyVideo from '@/components/decorate/templates-shim/MyVideo.vue'
import PickMask from '@/components/picker/PickMask'
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: ''
        },
        goods: {
            type: Object,
            default: ()=> {}
        }
    },
    components: {
        MyVideo,
        PickMask
    },
    data() {
        return {
            playing: 0, //0没开始 1正在播放 2暂停
            refreshKey: "",
            visible: false,
            success: false,
            url: ""
        }
    },
    computed: {
        ...mapState('decorate/goodDetailPage', {
            goodsData: state => state.detailInfo?.data?.goods ?? {}
        }),
        ...mapState(['windowHeight']),
        isWeixin() {
            return this.$utils.is_weixin()
        },
        credit_text() {
            if (this.$isPC) {
                return '积分'
            }
            return this.$store.state.setting.systemSetting?.credit_text || '积分'
        },
        goodsPrice() {
            if(!this.goods?.data?.goods) {
                return ""
            }
            let res = `￥${this.formatMoney(this.goods?.data?.goods?.price)}`;
            if(this.goods.data.goods.has_option == 1 && (this.goods.data.goods.min_price !== this.goods.data.goods.max_price)) {
                res = `￥${this.formatMoney(this.goods?.data?.goods?.min_price)}-${this.formatMoney(this.goods?.data?.goods?.max_price)}`
            }
            let activity = this.goods.activity
            let price_actives = ['presell', 'seckill','groups'];
            let is_active = activity && price_actives.some(key=> activity[key]);
            if(!is_active && this.goods.data.goods?.buy_button_status && this.goods.data.goods?.ext_field?.buy_button_settings?.price_text) {
                res = this.goods.data.goods?.ext_field?.buy_button_settings?.price_text;
            }
            return res
        },
        thumbAll() {
            let res = [];
            if(!this.goods?.data?.goods) {
                return []
            }
            if(this.goods.data.goods.material?.default_config != 1) {
                res = JSON.parse(this.goods.data.goods.material?.thumb_all || "[]")
                return res
            }
            if(this.goods.data.goods.thumb_all.length === 0) {
                res.push(this.goods.data.goods.thumb)
                return res
            }
            if(this.goods.data.goods.thumb_all.includes(this.goods.data.goods.thumb)) {
                res = [ ...this.goods.data.goods.thumb_all ]
                return res
            }
            res = [ this.goods.data.goods.thumb, ...this.goods.data.goods.thumb_all ]
            return res
        },
        showMaterial() {
            return this.goods?.data?.goods?.material && this.goods?.data?.goods?.material?.length !== 0
        }
    },
    watch: {
        value: {
            immediate: true,
            handler(newValue) {
                if (newValue) {
                    this.getShortLink();
                    this.playing=0
                }
            }
        }
    },
    methods: {
        getShortLink() {
            // #ifdef H5
            this.url = this.goods.poster_url
			// #endif
            // #ifdef MP-WEIXIN
            this.$api.goodApi.getShortLink({
                path: `kdxGoods/detail/index?goods_id=${this.goods.data.goods.id}&inviter_id=${this.$store.state.login.userInfo.id}`
            }).then((res) =>{
                if(res.error === 0) {
                    this.url = res.link
                }
            })
			// #endif
        },
        clickBtn() {
            this.$refs.myvideo?.click();
            this.playing = 1;
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
        cancel() {
            this.$emit('input', false)
        },
        formatMoney(money) {
            if (typeof money === 'number' || (typeof money === 'string' && money.trim() !== '')) {
                return parseFloat(money)
            } else {
                return money
            }
        },
        save() {
            let text = `📢 现在下单超划算，赶紧下单
👍 ${this.goods.data.goods.title || ""}
💰 ${this.goodsPrice}
👉 购买链接：${this.url}`;
            if(this.goods.data.goods.material.description_type == "1") {
                text = `${ this.goods.data.goods.material.description || "" }
💰 ${this.goodsPrice}
👉 购买链接：${this.url}`;
            }
            uni.setClipboardData({
                data: text,
                showToast: false,
                success: () => {
			        // #ifndef MP-WEIXIN
                    this.complete(true)
                    // #endif
                },
                fail: err => {
                    console.log(err)
                }
            })
            // #ifdef MP-WEIXIN
            if(this.goods.data.goods.material?.material_type == 0) {
                this.saveAllImage()
            }else {
                this.saveVideo()
            }
            // #endif
        },
        saveVideo() {
            uni.downloadFile({
                url: this.$utils.mediaUrl(this.goods.data.goods.material.video),
                success: res => {
                    uni.saveVideoToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: () => {
                            this.complete(true)
                        },
                        fail: (e) => {
                            console.log(e, "-----downloadFile")
                            this.complete(false)
                        }
                    })
                },
                fail: (e) => {
                    console.log(e, "-----downloadFile")
                    this.complete(false)
                }
            })
        },
        async saveAllImage() {
            for(let i = 0; i < this.thumbAll.length; i++) {
                await this.saveImage(this.$utils.mediaUrl(this.thumbAll[i]))
            }
            this.complete(true)
        },
        saveImage(url) {
            return new Promise((resolve) => {
                uni.downloadFile({
                    url: url,
                    success: res => {
                        uni.saveImageToPhotosAlbum({
                            filePath: res.tempFilePath,
                            success: () => {
                                resolve()
                            },
                            fail: (e) => {
                                console.log(e, "-----saveImageToPhotosAlbum")
                                this.complete(false)
                            }
                        })
                    },
                    fail: (e) => {
                        console.log(e, "-----downloadFile")
                        this.complete(false)
                    }
                })
            })
        },
        complete(status) {
            this.$emit("complete")
            this.success = status;
            this.visible = true;
        },
        close() {
            this.visible = false;
        },
    }
}
</script>

<style lang="scss" scoped>
.container {
    position: absolute;
    bottom: 0;
    left: 0;
    border-radius: 20rpx 20rpx 0px 0px;
    padding: 32rpx 24rpx 0;
    width: 100vw;
    height: px2rpx(530);
    box-sizing: border-box;
    background-color: #fff;
    .title {
        font-size: 32rpx;
        font-weight: bold;
        text-align: center;
        line-height: 44rpx;
        color: #000000;
        font-size: 32rpx;
        span {
            color: #FF3C29;
            font-weight: bold;
        }
    }
    .hint {
        margin-top: px2rpx(4);
        height: px2rpx(16);
        line-height: px2rpx(16);
        font-size: px2rpx(12);
        text-align: center;
        color: rgba(0, 0, 0, 0.4);
    }
    .content {
        margin-top: px2rpx(16);
        .text {
            padding: px2rpx(16) px2rpx(12);
            background: #F5F5F5;
            border-radius: px2rpx(6);
            line-height: px2rpx(20);
            word-break: break-all;
            .goods {
                text-overflow: ellipsis;
                word-break: break-all;
                white-space: nowrap;
                overflow: hidden;
            }
        }
        .img-list {
            display: flex;
            flex-wrap: wrap;
            margin-top: px2rpx(8);
            .img {
                width: px2rpx(109);
                height: px2rpx(109);
                margin: 0 px2rpx(12) px2rpx(12) 0;
                border-radius: px2rpx(6);
                &:nth-child(3n) {
                    margin-right: 0;
                }
            }
        }
    }
    .save {
        height: px2rpx(52);
        display: flex;
        align-items: center;
        justify-content: space-between;
        .save-text {
            display: flex;
            .iconfont-m- {
                color: #FF3C29;
                font-size: px2rpx(20);
            }
        }
        .save-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: px2rpx(100);
            height: px2rpx(28);
            color: #fff;
            border-radius: px2rpx(60);
            background: #FF3C29;
            .iconfont-m- {
                color: #fff;
                font-size: px2rpx(20);
            }
        }
    }
    .cancel {
        border-top: 1px solid #e6e7eb;
        height: 100rpx;
        font-size: 28rpx;
        text-align: center;
        line-height: 100rpx;
        color: #969696;
    }
}
.video {
    margin-top: px2rpx(8);
}
.detail_video {
    width: px2rpx(350);
    height: px2rpx(197);
    border-radius: px2rpx(6);
    overflow: hidden;
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

.ticket {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999999;
    width: 100vw;
    background: rgba(0, 0, 0, 0.87);
    .modal {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -60%);
        width: px2rpx(280);;
        background: #fff;
        border-radius: px2rpx(10);
        .bg {
            position: relative;
            .img {
                position: absolute;
                top: 0;
                left: 50%;
                z-index: 0;
                width: px2rpx(95);
                height: px2rpx(74);
                transform: translate(-50%, -50%);
            }
            .know {
                position: relative;
                z-index: 1;
                overflow: hidden;
                width: px2rpx(280);
                padding: px2rpx(53) px2rpx(30) px2rpx(24) px2rpx(40);
                text-align: center;
                .text {
                    display: flex;
                    height: px2rpx(24);
                    line-height: px2rpx(24);
                    font-size: px2rpx(16);
                    font-weight: bold;
                    margin-bottom: px2rpx(4);
                    .iconfont-m- {
                        font-weight: normal;
                        font-size: px2rpx(20);
                        margin-right: px2rpx(8);
                    }
                    .icon-m-danchuangqueren {
                        color: #09C15F;
                    }
                    .icon-m-danchuangcuowu {
                        color: #FF3C29;
                    }
                }
                .btn-confirm {
                    margin: px2rpx(20) auto 0;
                    width: px2rpx(200);
                    height: px2rpx(40);
                    line-height: px2rpx(40);
                    color: #fff;
                    background: #FF3C29;
                    border-radius: px2rpx(20);
                }
            }
        }
        .close {
            position: absolute;
            bottom: -96rpx;
            left: 50%;
            transform: translate(-50%);
            margin-top: 4rpx;
            text-align: center;
            height: 48rpx;
            line-height: 48rpx;
            &.closePosition {
                position: absolute;
                top: px2rpx(-50);
                right: px2rpx(40);
            }
            &-icon {
                font-size: 48rpx;
                color: #fff;
            }
        }
    }
}
</style>
