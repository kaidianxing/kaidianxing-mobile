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
        <view class="modal" :class="{'create-poster':!url}"></view>
        <view class='poster-container'>
            <view class='close' style='background:rgba(0,0,0,0)' :class="{'create-poster':!url}" @click='toggle'><i class="iconfont-m- icon-m-close"></i></view>
            <scroll-view scroll-y class="url-wrap" :class="{'create-poster':!url}">
                <img :src="url" alt="">
            </scroll-view>
            <canvas class="none" canvas-id="qrcode" :style="{width: getSize+ 'px', height: getSize+ 'px'}" />
            <view class="link-content-h5 flex">
                <view :class="{'create-poster':!url}">
                    <view>长按保存图片</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import html2canvas from './html2canvas'
    import {
        mapState
    } from "vuex";
    export default {
        data() {
            return {
                loading: true,
                show: false,
                callback: null,
                info: null,
                url: '',
                showPoster:'',
            }
        },
        mounted() {
            this.$emit('mounted')
        },
        computed: {
            ...mapState('setting', {
                name: state => state.systemSetting ?.basic ?.name
            }),
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
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 0
                })
                if (this.show) {
                    this.loading = true;
                    uni.showLoading({
                        title: "快照生成中...",
                        mask: true,
                    });
                    setTimeout(() => {
                        this.$nextTick(() => {
                            var dom = document.querySelector('#article-shot'); // 获取dom元素
                            html2canvas(dom, {
                                width: dom.clientWidth, //dom 原始宽度
                                height: dom.clientHeight,
                                scrollY: 0, // html2canvas默认绘制视图内的页面，需要把scrollY，scrollX设置为0
                                scrollX: 0,
                                allowTaint: true,
                                useCORS: true, //支持跨域，但好像没什么用
                            }).then((canvas) => {
                                // 将生产的canvas转为base64图片
                                this.url = canvas.toDataURL('image/png')
                                this.loading = false;
                                uni.hideLoading()
                                if (typeof callback == 'function') {
                                    this.callback = callback;
                                }
                                if (this.callback) { //两种回调监听方式
                                    this.callback(this.show);
                                }
                                this.$emit('toggle', this.show); //两种回调监听方式
                                this.$emit('shotComplete'); //两种回调监听方式
                            });
                        })
                    }, 100)
                }
            },
            imgErr(e) {
                uni.hideLoading();
                uni.showModal({
                    title: '提示',
                    content: "生成快照失败",
                    showCancel: false,
                });
            },
            saveImage() { //长按保存
                let _this = this;
                uni.authorize({
                    scope: "scope.writePhotosAlbum",
                    success() {
                        uni.saveImageToPhotosAlbum({
                            filePath: _this.url,
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
            height:80%;
            top: 53%;
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
            .url-wrap {
                flex: 1;
                border-radius: px2rpx(6);
                overflow-y: auto;
                img {
                    display: block;
                    width: px2rpx(303);
                }
            }
            .link-content-h5 {
                justify-content: space-around;
                color: #fff;
                font-size: 20rpx;
                text-align: center;
                height: 5%;
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
