/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div>
        <view class="share-notice" v-if="shareNotice">
            <image :src="$utils.staticMediaUrl('decorate/share@2x.png')" alt='' />
            <p>{{shareMsg}}</p>
            <view class="button" @click="closeAll">知道了</view>
        </view>
        <pick-mask class='pick-mask' v-if="value" @mask-close="cancel" >
            <view
                    class="container"
                    :style="{paddingBottom:areaBottom+'px'}"
                    v-if="shareContent"
                    @touchmove.stop.prevent>
                <view class="title">分享到</view>
                <view class="flex channel">
                    <!--#ifdef H5-->
                    <view class="channel-list" @click="shareNoticeShow">
                        <view class="iconfont-m- icon-m-qudao-weixin channel-icon" />
                        <view class="channel-text">微信</view>
                    </view>
                    <!--#endif-->
                    <!--#ifdef MP-WEIXIN-->
                    <button class="channel-list" v-if="isWeixin" open-type="share" hover-class="none">
                        <view class="iconfont-m- icon-m-qudao-weixin channel-icon" />
                        <view class="channel-text">微信</view>
                    </button>
                    <!--#endif-->
                    <!--#ifndef MP-TOUTIAO-->
                    <view class="channel-list" @click="shareHandler">
                        <view class="iconfont-m- icon-m-shengchenghaibao channel-icon" />
                        <view class="channel-text">生成海报</view>
                    </view>
                    <!--#endif-->
                    <view class="channel-list" v-if="isShowLink" @click="copyLink">
                        <view class="iconfont-m- icon-m-fuzhilianjie channel-icon" />
                        <view class="channel-text">复制链接</view>
                    </view>
                </view>
                <view class="cancel" @click="cancel">取消</view>
            </view>
        </pick-mask>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

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
            posterUrl: {
                type: String,
                default: ''
            },
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
                isShowLink: false, //是否显示复制链接按钮
            }
        },
        computed: {
            ...mapState('groups', ['groupPosterData']),
            ...mapState(['windowHeight', 'areaBottom']),
            isWeixin() {
                return this.$utils.is_weixin()
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
                this.shareNotice= false
                this.$emit('input', false)
                this.showVideoModal = false
            },
            shareHandler(type) {
                this.$emit('share', type)
            },
            copyLink() {
                let copy_url = this.posterUrl;
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
            getUrl(){
                this.shareContent = false;
            },
            // 获取渠道
            getChannel() {
                this.$api.settingApi.getChannelStatus({}).then(res => {
                    if (res.error == 0) {
                        this.isShowLink = res?.h5 == 1 || res?.wechat == 1;
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .share-notice {
        position: fixed;
        top: 400rpx;
        left: 0;
        width: 100%;
        z-index: 10000006;
        color: #fff;
        text-align: center;
        image {
            width: 104rpx;
            height: 104rpx;
        }
        p {
            font-size: 30rpx;
            padding-top: 40rpx;
        }
        .button {
            display: inline-block;
            width: 334rpx;
            height: 80rpx;
            margin-top: 40rpx;
            line-height: 80rpx;
            border: 1px solid #fff;
            border-radius: 40rpx;
        }
    }
    .container {
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 20rpx 20rpx 0px 0px;
        padding: 32rpx 24rpx 0;
        width: 100vw;
        height: 440rpx;
        background-color: #fff;

        .title {
            font-size: 32rpx;
            font-weight: bold;
            text-align: center;
            line-height: 44rpx;
            color: #000000;
            font-size: 32rpx;
            margin-bottom: 48rpx;
        }

        .channel {
            padding-bottom: 24rpx;
            &-list {
                width: 140rpx;
                height: 188rpx;
                margin-right: 28rpx;
                background-color: transparent;
                line-height: 1;

                &::after {
                    border: none;
                }
            }

            &-icon {
                margin: 0 10rpx 4rpx;
                font-size: 120rpx;
                height: 120rpx;
                width: 120rpx;

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
                margin-bottom: 17rpx;
                font-size: 28rpx;
                text-align: center;
                line-height: 40rpx;
                color: #969696;
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
            border-radius: 12rpx;
            padding: 48rpx 24rpx 22rpx;
            width: 512rpx;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            .video-title {
                height: 40rpx;
                line-height: 40rpx;
                font-size: 28rpx;
                text-align: center;
                color: #212121;
            }
            .video-link {
                margin: 16rpx 0 72rpx;
                background: #F5F5F5;
                border-radius: 20rpx;
                padding: 24rpx 16rpx;
                line-height: 34rpx;
                font-size: 24rpx;
                overflow-wrap: break-word;
            }
            .video-copy {
                text-align: center;
                color: #fff;
                font-size: 28rpx;
                width: 100%;
                height: 80rpx;
                line-height: 80rpx;
                border-radius: 128rpx;
                background: linear-gradient(132.57deg, #FF3C29 0%, #FF6F29 94.38%);
            }
        }
    }
</style>