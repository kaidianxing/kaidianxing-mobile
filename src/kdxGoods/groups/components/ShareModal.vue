<template>
    <div>
        <view class="share-notice" v-if="shareNotice">
            <image :src="$utils.staticMediaUrl('decorate/share@2x.png')" alt=''/>
            <p>{{ shareMsg }}</p>
            <view class="button" @click="closeAll">知道了</view>
        </view>
        <pick-mask class='pick-mask' v-if="value" @mask-close="cancel">
            <view
                class="container"
                :style="{paddingBottom:areaBottom+'px'}"
                v-if="shareContent"
                @touchmove.stop.prevent>
                <view class="title">分享到</view>
                <view class="flex channel">
                    <!--#ifdef H5-->
                    <view class="channel-list" @click="shareNoticeShow">
                        <img class='img' :src="$utils.staticMediaUrl('share/weixin.png')" alt="">
                        <view class="channel-text">微信</view>
                    </view>
                    <!--#endif-->
                    <!--#ifdef MP-WEIXIN-->
                    <button class="channel-list" v-if="isWeixin" open-type="share" hover-class="none">
                        <img class='img' :src="$utils.staticMediaUrl('share/weixin.png')" alt="">
                        <view class="channel-text">微信</view>
                    </button>
                    <!--#endif-->
                    <view class="channel-list" @click="materialHandler">
                        <view v-if="showMaterial" class="channel-list" @click="materialHandler">
                            <view class="channel-text">一键发圈</view>
                        </view>
                        <!--#ifndef MP-TOUTIAO||APP-PLUS -->
                        <view class="channel-list" @click="shareHandler">
                            <img class='img' :src="$utils.staticMediaUrl('share/poster.png')" alt="">
                            <view class="channel-text">生成海报</view>
                        </view>
                        <!--#endif-->
                        <view class="channel-list" v-if="isShowLink" @click="copyLink">
                            <img class='img' :src="$utils.staticMediaUrl('share/copy.png')" alt="">
                            <view class="channel-text">复制链接</view>
                        </view>
                    </view>
                    <view class="cancel" @click="cancel">取消</view>
                </view>
            </view>
        </pick-mask>
    </div>
</template>

<script>
import {mapState} from 'vuex'

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
            default: () => {
            }
        }
    },
    components: {
        PickMask
    },
    data() {
        return {
            shareContent: true, // 分享弹窗
            shareNotice: false, // 公众号分享提示弹窗
            shareMsg: '请点击右上角的"..."按钮，分享给好友', // 分享好友
            channels: [
                {
                    type: 'wechat',
                    icon: 'icon-m-qudao-weixin',
                    color: '#1BB723',
                    text: '微信'
                },
                {
                    type: 'poster',
                    icon: 'icon-m-shengchenghaibao',
                    color: '#FF6F29',
                    text: '生成海报'
                },
                {
                    type: 'copy',
                    icon: 'icon-m-fuzhilianjie',
                    color: '#518DEF',
                    text: '复制链接'
                },
                {
                    type: 'video',
                    icon: 'icon-m-yingyong-shipinhao-zhuanhuan',
                    color: '#FF901B',
                    text: '视频号链接'
                }
            ],
            videoCopyLink: '', // 视频链接
            timer: null,
            times: 0, //接口轮询次数
            isShowLink: false, //是否显示复制链接按钮
        }
    },
    computed: {
        ...mapState('decorate/goodDetailPage', {
            posterUrl: state => state.detailInfo?.poster_url,
            goodsData: state => state.detailInfo?.data?.goods ?? {}
        }),
        ...mapState(['windowHeight', 'areaBottom']),
        isWeixin() {
            return this.$utils.is_weixin()
        },
        showMaterial() {
            return this.goods?.data?.goods?.material && this.goods?.data?.goods?.material?.length !== 0
        }
    },
    watch: {
        value(newValue) {
            if (newValue) {
                this.shareContent = true
            }
        }
    },
    mounted() {
        this.getChannel()
    },
    methods: {
        cancel() {
            this.shareNotice = false
            this.$emit('input', false)
        },
        materialHandler() {
            this.$emit('material', 'share')
        },
        shareHandler(type) {
            this.$emit('share', type)
        },
        copyLink() {
            let copy_url = this.posterUrl;
            if (this.type === 'group') {
                copy_url = this?.posterData?.invite_url
            }
            uni.setClipboardData({
                data: copy_url,
                success: () => {
                    this.$toast('复制成功')
                    this.cancel()
                },
                fail: err => {
                    console.log(err)
                }
            })
        },
        closeAll() {
            this.shareContent = false
            this.shareNotice = false
            this.cancel()
        },
        shareNoticeShow() {
            this.shareContent = false
            this.shareNotice = true
        },
        // 复制链接
        videoCopy() {
            uni.setClipboardData({
                data: this.videoCopyLink,
                success: () => {
                    this.$toast('复制成功')
                    setTimeout(() => {
                        this.$emit('input', false)
                    }, 500)
                },
                fail: err => {
                    console.log(err)
                }
            })
        },
        // 获取渠道
        getChannel() {
            this.$api.settingApi.getChannelStatus({}).then(res => {
                if (res.error == 0) {
                    this.isShowLink = res?.h5 == 1 || res?.wechat == 1;
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.share-notice {
    position: fixed;
    top: 400 rpx;
    left: 0;
    width: 100%;
    z-index: 10000006;
    color: #fff;
    text-align: center;

    image {
        width: 104 rpx;
        height: 104 rpx;
    }

    p {
        font-size: 30 rpx;
        padding-top: 40 rpx;
    }

    .button {
        display: inline-block;
        width: 334 rpx;
        height: 80 rpx;
        margin-top: 40 rpx;
        line-height: 80 rpx;
        border: 1px solid #fff;
        border-radius: 40 rpx;
    }
}

.container {
    position: absolute;
    bottom: 0;
    left: 0;
    border-radius: 20 rpx 20 rpx 0px 0px;
    padding: 32 rpx 24 rpx 0;
    width: 100vw;
    height: 440 rpx;
    background-color: #fff;

    .title {
        font-size: 32 rpx;
        font-weight: bold;
        text-align: center;
        line-height: 44 rpx;
        color: #000000;
        font-size: 32 rpx;
        margin-bottom: 48 rpx;
    }

    .channel {
        padding-bottom: 24 rpx;

        &-list {
            width: px2rpx(60);
            height: 188 rpx;
            margin-right: px2rpx(12);
            background-color: transparent;
            line-height: 1;

            .img {
                width: px2rpx(60);
                height: px2rpx(60);
            }

            &::after {
                border: none;
            }

            &:last-child {
                margin-right: 0;
            }
        }

        &-icon {
            margin: 0 10 rpx 4 rpx;
            font-size: 120 rpx;
            height: 120 rpx;
            width: 120 rpx;

            &.icon-m-qudao-weixin {
                color: #1bb723;
            }

            &.icon-m-shengchenghaibao {
                color: #ff6f29;
            }

            &.icon-m-fuzhilianjie {
                color: #518def;
            }

            &.icon-m-yingyong-shipinhao-zhuanhuan {
                color: #FF901B;
            }
        }

        &-text {
            margin-bottom: 17 rpx;
            font-size: px2rpx(12);
            text-align: center;
            line-height: 40 rpx;
            color: #212121;
        }
    }

    .cancel {
        border-top: 1px solid #e6e7eb;
        height: 100 rpx;
        font-size: 28 rpx;
        text-align: center;
        line-height: 100 rpx;
        color: #969696;
    }
}

.modal {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;

    .video-container {
        position: absolute;
        display: flex;
        flex-direction: column;
        background: #fff;
        border-radius: 12 rpx;
        padding: 48 rpx 24 rpx 22 rpx;
        width: 512 rpx;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        .video-title {
            height: 40 rpx;
            line-height: 40 rpx;
            font-size: 28 rpx;
            text-align: center;
            color: #212121;
        }

        .video-link {
            margin: 16 rpx 0 72 rpx;
            background: #F5F5F5;
            border-radius: 20 rpx;
            padding: 24 rpx 16 rpx;
            line-height: 34 rpx;
            font-size: 24 rpx;
            overflow-wrap: break-word;
        }

        .video-copy {
            text-align: center;
            color: #fff;
            font-size: 28 rpx;
            width: 100%;
            height: 80 rpx;
            line-height: 80 rpx;
            border-radius: 128 rpx;
            background: linear-gradient(132.57deg, #FF3C29 0%, #FF6F29 94.38%);
        }
    }
}
</style>
