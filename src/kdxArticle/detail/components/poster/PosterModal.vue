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
    <view class="community-poster-modal" v-if='show' :class="{'loading':loading}">
        <!--#ifdef H5-->
        <view class="modal" :class="{'create-poster':!url}"></view>
        <!--#endif-->
        <!--#ifndef H5-->
        <view class="modal"></view>
        <!--#endif-->
        <view class='poster-container'>
            <!--#ifdef H5-->
            <view class='close' style='background:rgba(0,0,0,0)' :class="{'create-poster':!url}" @click='toggle'><i class="iconfont-m- icon-m-close"></i></view>
            <div :class="{'create-poster':!url}">
                <create-poster ref='posterCreate' :painting='painterData' :img-src='url'></create-poster>
            </div>
            <canvas class="none" canvas-id="qrcode" :style="{width: getSize+ 'px', height: getSize+ 'px'}" />
            <!--#endif-->
            <!--#ifndef H5-->
            <view class='poster-top' style='padding-bottom:329rpx;'>
                 <view v-if="imagePath" class="content-img" @touchmove>
                    <image :src="imagePath" class="img-preview" mode="scaleToFill"></image>
                </view>
                <view v-if="!imagePath" class="canvas-box">
                    <painter :palette="painterData" :widthPixels="1000" @imgErr="imgErr" @imgOK="onImgOK" />
                </view >
            </view>
            <!--#endif-->
            <!-- 链接 -->
            <!--#ifndef H5-->
            <view class="link-content-wxapp flex" style="position:absolute;bottom:0;left:0;right:0;">
                <div class='share-btns' style="background:rgba(255,255,255,0.96)">
                    <button class="btn" open-type="share" hover-class="none">
                        <img class='img' :src="$utils.staticMediaUrl('share/weixin.png')" alt="">
                        <view>微信</view>
                    </button>
                    <view class="btn" v-if="isShowLink" @click="copyLink">
                        <img class='img' :src="$utils.staticMediaUrl('share/copy.png')" alt="">
                        <view>复制链接</view>
                    </view>
                    <view class="btn" @click="download">
                        <img class='img' :src="$utils.staticMediaUrl('share/download.png')" alt="">
                        <view>保存图片</view>
                    </view>
                </div>
                <view class='close' @click='toggle'>取消</view>
            </view>
            <!--#endif-->
            <!--#ifdef H5-->
            <view class="link-content-h5 flex">
                <view :class="{'create-poster':!url}">
                    <view>长按保存图片</view>
                </view>
            </view>
            <!--#endif-->
        </view>
    </view>
</template>

<script>
    // #ifdef H5
    import createPoster from './CreatePoster'
    // #endif
    import {
        mapState
    } from "vuex";
    import {
        getArticlePoster, // 文章海报
    } from './getUrl.js'
    import { config } from '@/static/settings'
    export default {
        // #ifdef H5
        components: {
            createPoster
        },
        // #endif
        props: {
            posterType: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                loading: true,
                show: false,
                callback: null,
                info: null,
                url: '',
                copyLinkUrl: '',
                qrcodeSrc: '',
                painterData: {},
                imagePath: '',
                showPoster:'',
                isShowLink: false, //复制链接是否显示
            }
        },
        mounted() {
            this.$emit('mounted')
            this.getChannel()
        },
        computed: {
            ...mapState('setting', {
                name: state => state.systemSetting ?.basic ?.name
            }),
            ...mapState('decorate/goodDetailPage', {
                goods: state => state.detailInfo ?.data ?.goods ?? {},
                posterUrl: state => state.detailInfo ?.poster_url,
                pageList: state => state.pageList
            }),
            ...mapState('groups', ['groupPosterData']),
            ...mapState('groupsRebate', {
                groupsRebatePosterData: state=> state.groupPosterData
            }),
            // 拼团免单
            ...mapState('groupsFission', {
                groupsFissionPosterData: state=> state.groupPosterData
            }),
            ...mapState('posterData', ['posterData']),
            ...mapState('creditShop', ['creditPosterData']),
            getSize() {
                return uni.upx2px(120) * 4
            }
        },
        methods: {
            clear(){
                this.url = '';
                return this;
            },
            toggle(callback) {
                this.show = !this.show;
                if (this.show) {
                    this.loading = true;
                    uni.showLoading({
                        title: "海报生成中...",
                        mask: true,
                    });

                    // #ifdef H5
                    this.$nextTick(()=>{
                        this.$refs.posterCreate && this.$refs.posterCreate.create(url=>{
                            this.url=url;
                        });
                    })
                    // #endif
                    this.getUrl()
                }
                if(this.imagePath){
                    uni.hideLoading()
                }
                if (typeof callback == 'function') {
                    this.callback = callback;
                }
                if (this.callback) { //两种回调监听方式
                    this.callback(this.show);
                }
                this.$emit('toggle', this.show); //两种回调监听方式
            },
            getUrl() {
                let that = this;
                if (this.posterType === 'article') {
                    // 文章海报
                    getArticlePoster(this.posterData.id).then(poster => {
                        that.loading = false;
                        that.painterData = poster;
                    }).catch((e) => {
                        console.log(e, 77665)
                        that.$toast('生成海报失败');
                    })
                }
            },
            copyLink() {
                if (this.posterType === 'join') {
                    // 推广管理 海报复制链接
                    // 微擎版-url处理 带 &_route
                    this.copyLinkUrl = this?.posterData?.wap_url                
                }
                uni.setClipboardData({
                    data: this.copyLinkUrl,
                    success: () => {
                        this.show = false;
                        this.$toast('复制成功');
                    }
                })
            },
            download() {
                this.saveImage();
            },
            onImgOK(e) {
                this.imagePath = e.detail.path;
                this.loading = false;
                uni.hideLoading();
            },
            imgErr(e) {
                uni.hideLoading();
                uni.showModal({
                    title: '提示',
                    content: "生成海报失败",
                    showCancel: false,
                });
            },
            saveImage() { //长按保存
                let _this = this;
                uni.authorize({
                    scope: "scope.writePhotosAlbum",
                    success() {
                        uni.saveImageToPhotosAlbum({
                            filePath: _this.imagePath,
                            success() {
                                uni.showModal({
                                    title: "保存成功",
                                    content: "图片已成功保存到相册，快去分享到您的圈子吧",
                                    showCancel: false
                                })
                            }
                        });
                    },
                    fail(){
                        uni.showToast({
                            title: "无相册读写权限",
                            icon:'none'
                        })
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
    .community-poster-modal {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 10000000;
        .modal {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.7);
        }
        .create-poster {
             opacity: 0;
        }
        &.loading {
            visibility: hidden;
        }
        .none {
            position: fixed;
            top: -99999rpx;
            left: -99999rpx;
            z-index: -99999;
        }
        .poster-container {
            position: absolute;
            display: flex;
            flex-direction: column;
            //#ifdef H5
            height:996rpx;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%); //#endif
            // #ifndef H5
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            display: flex;
            flex-direction: column; // #endif
            //#ifdef H5
            .close {
                position: absolute;
                left: 50%;
                top: -80rpx; // #ifdef MP-WEIXIN
                top: -30rpx; // #endif
                width: 48rpx;
                height: 48rpx;
                line-height: 40rpx;
                border: 1px solid #fff;
                text-align: center;
                border-radius: 50%;
                transform: translateX(-50%);
                box-sizing: border-box;
                background: #ffffff;
                i {
                    color: #fff;
                    font-size: 20rpx;
                }
            } //#endif
            //#ifndef H5
            .close {
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 68rpx;
                line-height: 68rpx;
                border-top: 1rpx solid #ccc;
                text-align: center;
                color: #333;
            }
            .poster-top {
                height: 0;
                flex: 1;
                overflow: auto;
                .content-img{
                    // #ifdef H5
                    width: 702rpx;
                    // #endif
                    // #ifndef H5
                    width: 606rpx;
                    // #endif
                    margin: 24rpx auto;
                    overflow: hidden;
                    border-radius: 18rpx;
                    height: px2rpx(539);
                    image{
                        width: 100%;
                        height: 100%;
                    }
                }
                .canvas-box {
                    width: 702rpx;
                    // margin: 100vh auto;
                    transform:scale(0.25);
                    overflow: hidden;
                    border-radius: 18rpx;
                }
            } //#endif
            .link-content-h5 {
                justify-content: space-around;
                color: #fff;
                font-size: 20rpx;
                text-align: center;
                height: 30%;
                flex-shrink: 0;
                padding: 40rpx 40rpx 0;
            }
            .link-content-wxapp {
                color: #333;
                font-size: 20rpx;
                text-align: center;
                height: 329rpx;
                flex-shrink: 0;
                position: relative;
                display: flex;
                flex-direction: column;
                .close{
                    border-top: 1rpx solid #e6e7eb;
                    height: 100rpx;
                    font-size: 28rpx;
                    text-align: center;
                    line-height: 100rpx;
                    color: #969696;
                    width: 100%;
                    padding: 0 24rpx;
                    background:#fff;
                }
                .share-btns{
                    display:flex;
                    padding: 0 px2rpx(12);
                    .btn{
                        width: px2rpx(60);
                        height: 229rpx;
                        display: flex;
                        justify-content:center;
                        flex-direction: column;
                        font-style: normal;
                        margin-right: px2rpx(12);
                        .img{
                            width: px2rpx(60);
                            height: px2rpx(60);
                        }
                        view{
                            font-size: px2rpx(12);
                            margin:0 auto;
                            text-align: center;
                            color:#212121;
                        }
                    }
                }
                image {
                    width: 120rpx;
                    height: 120rpx;
                }
                button {
                    background-color: transparent;
                    line-height: 1.25;
                    color: #333;
                    border-radius: 0;
                }
                button::after {
                    border: none;
                }
            }
        }
    }
</style>
