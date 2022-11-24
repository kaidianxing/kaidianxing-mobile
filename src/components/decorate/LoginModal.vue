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
    <div class="login-modal" @touchmove.stop.prevent :style="{height: windowHeight}">
        <div class="login-container">
            <!--<div class="main">
                <img :src="$utils.staticMediaUrl('login/no-login.png')" class="login-img"/>
                <div class="title">请先登录再进行此操作</div>
                &lt;!&ndash;#ifdef H5 &ndash;&gt;
                <btn type="do" :classNames="['w436']" @btn-click="btnClick" size="middle">立即登录</btn>
                &lt;!&ndash;#endif &ndash;&gt;

                &lt;!&ndash;#ifdef MP-WEIXIN &ndash;&gt;
                <button class="btn"
                        lang="zh_CN"
                        open-type="getUserInfo"
                        @getuserinfo="getUserInfo($event,'weixin')">立即登录
                </button>
                &lt;!&ndash;#endif &ndash;&gt;

                &lt;!&ndash;#ifdef MP-TOUTIAO &ndash;&gt;
                <div class="btn" @click="getUserInfo($event,channer)">立即登录</div>
                &lt;!&ndash;#endif &ndash;&gt;
                <div class="cancel-btn" @click="closeModal('no')">暂不登录</div>
            </div>-->

            <block v-if="login_auth_setting.type == 0">
                <div class="style" :class="'style'+login_auth_setting.style">
                    <!--#ifdef H5 -->
                 <image class="login-img" mode="widthFix"  v-if="login_auth_setting.style=='1'" :src="$utils.themeMediaUrl('theme/login/login.png')" alt=""></image>
                    <image class="login-img" mode="widthFix" v-else :src="$utils.staticMediaUrl('login/style'+ login_auth_setting.style +'.png')" alt=""></image>
                    <!--#endif -->
                    <!--#ifndef H5 -->
                    <image class="login-img" mode="widthFix" v-if="login_auth_setting.style=='1'" :src="$utils.themeMediaUrl('theme/login/login.png')" alt=""></image>
                    <image class="login-img" mode="widthFix" v-else :src="login_bg_path || $utils.staticMediaUrl('login/style'+ login_auth_setting.style +'.png')" alt=""></image>
                    <!--#endif -->
                    <!--#ifdef H5 -->
                    <button class="btn" :class="{force: isForce, 'theme-primary-bgcolor': login_auth_setting.style=='1'}" @click="btnClick">立即登录</button>
                    <!--#endif -->
                    <!--#ifdef MP-WEIXIN -->
                    <button class="btn" :class="{force: isForce, 'theme-primary-bgcolor': login_auth_setting.style=='1'}"
                            lang="zh_CN"
                            open-type="getUserInfo"
                            @getuserinfo="getUserInfo($event.detail,'weixin')">立即登录
                    </button>
                    <!-- <button v-else class="btn" :class="{'theme-primary-bgcolor': login_auth_setting.style=='1'}" @click="getWxUserInfo">立即登录</button> -->
                    <!--#endif -->
                    <!--#ifdef MP-TOUTIAO -->
                    <button class="btn" :class="{force: isForce, 'theme-primary-bgcolor': login_auth_setting.style=='1'}" @click="getUserInfo($event,channer)">立即登录</button>
                    <!--#endif -->
                    <button class="cancel-btn" @click="closeModal('no')" v-if="!isForce">暂不登录</button>
                </div>
            </block>
        </div>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex'
    import {is_weixin} from '@/common/util'
    import {mapState} from 'vuex'

    export default {
        computed: {
            ...mapState(['windowHeight']),
            ...mapState('setting', {
                login_bg_path: state => state.login_bg_path
            }),
            // #ifdef MP-TOUTIAO
            channer() {
                const res = uni.getSystemInfoSync();
                return res.appName.toLowerCase()
            },
            // #endif
            ...mapState('setting',{
                isForce: function(state)  { // 是否强制登录
                    let {coerce_auth_channel,coerce_auth} = state.systemSetting?.registry_settings || {}
                    if(coerce_auth=='1') {
                        // #ifdef H5
                        if(this.$utils.is_weixin()){
                            return coerce_auth_channel?.wechat =='1'
                        } else {
                            return coerce_auth_channel?.h5=='1'
                        }
                        // #endif

                        // #ifdef MP-TOUTIAO
                         return coerce_auth_channel?.byte_dance=='1'
                        // #endif 
                    }
                }
            })
        },
        data() {
            return {
                type: {
                    'weixin': 'wxapp', // 微信小程序
                    'toutiao': 'toutiao', // 头条小程序
                    'douyin': 'douyin', // 抖音小程序
                    'news_article_lite': 'toutiaoLite', // 头条极速版
                    'devtools': 'toutiao', // 字节跳动开发者工具适配
                },
                btnLoad: false,
                hasProfileApi: false,
                login_auth_setting: {
                    diy_data: [],
                    style: "1",
                    type: "0"
                }
            }
        },
        // #ifdef MP-WEIXIN
        created(){
            // 当前基础库版本
            const sdkVersion  = uni.getSystemInfoSync().SDKVersion
            // 支持最低基础库版本
            // const apiMinVersion = '2.16.0';
            // const canIUse = this.$utils.compareVersion(sdkVersion, apiMinVersion)> -1
            this.hasProfileApi = false
            this.advanceWeiXinLogin()//窗口显示时预先激活一次登录状态
        },
        // #endif
        methods: {
            ...mapMutations('login', ['setLogin', 'setModal','setOldLength']),
            getPoint(item) {
                return {
                    left: item.x + '%',
                    top: item.y + '%',
                    width: item.w + '%',
                    height: item.h + '%',
                    zIndex: 9999
                }
            },
            btnClick() {
                if (!is_weixin()) {
                    this.$Router.auto({
                        path: '/kdxLogin/index'
                    })
                } else {
                    let {path, query} = this.$Route
                    let params = {
                        target_url: path,
                        type: 'wechat'
                    };
                    if (Object.keys(query).length) {
                        params.target_params = JSON.stringify(query)
                    }
                    this.$api.loginApi.postAuth(params).then(res => {
                        if (res) {
                            this.setOldLength(history.length)
                            location.href = res.message
                        }
                    })
                }
                this.closeModal('yes')
            },
            getWxUserInfo(){
                uni.getUserProfile({
                    lang: 'zh_CN',
                    desc: '需要获取您的用户信息',
                    success: res=> {
                        this.getUserInfo(res,'weixin')
                    },
                    fail:err=> {
                        console.log(err)
                    }
                })
            },
            advanceWeiXinLogin() {
                let _this = this
                uni.login({
                    provider: 'weixin',
                    success: res => {
                        _this.onceCode = res.code
                    },
                    complete: () => {
                    }
                })
            },
            getUserInfo(e, type) {
                // #ifdef MP-WEIXIN
                let {iv,encryptedData} = e
                // 授权被取消
                if(!iv || !encryptedData) {
                    return
                }
                // #endif

                this.$emit('custom-event',{target:'loginModal/getUserInfo'})
                if(this.btnLoad) return
                this.btnLoad = true
                uni.login({
                    provider: type,
                    success: res => {
                        let data = {
                            type: this.type[type],
                            code: res.code,
                        };
                        // #ifdef MP-TOUTIAO
                        data.anonymousCode = res.anonymousCode;
                        // #endif
                        this.$api.loginApi.postAuth(data).then(newRes => {
                            // #ifdef MP-WEIXIN
                            const message = newRes.message?.toLowerCase()||''
                            if(newRes.errcode === 40029) {
                                this.loginAlign(type)
                            } else if(newRes.error==0 ||message?.indexOf('app')==-1) {
                                 let data = {
                                    iv,
                                    session_key: newRes.session_key,
                                    encryptedData,
                                };

                                /* 是否是通过UserProfile获取的 */
                                if(this.hasProfileApi){
                                    if(newRes.openid){
                                       data.open_id = newRes.openid
                                    }

                                   if(newRes.unionid){
                                       data.union_id = newRes.unionid
                                   }
                                }
                                this.postData(data, type);
                            }

                            // #endif
                            // #ifdef MP-TOUTIAO
                            this.ttGetAuthorize(newRes.session_key, type);
                            // #endif
                        }).catch(err=> {
                            console.log(err,'error')
                        })
                    },
                    complete:()=> {
                        this.btnLoad = false
                    }
                })
            },
            // 小程序登录
            postData(data, type) {
                this.$api.loginApi.getLogin({...data, type: this.type[type]}, {errorToast: false}).then(res => {
                     const message = res.message?.toLowerCase() ||''
                    if (res.error === 0) {
                        // 设置登录状态
                        this.$toast('登录成功');
                        this.setLogin(true);
                        this.closeModal('yes');
                        this.$api.memberApi.getUserInfo().then(res => {
                            this.$store.commit('login/setUserInfo',res.data)
                        })
                    } else if (res.error === -1 || message?.indexOf('app')==-1) {
                        this.$message('授权信息已过期，请重新授权')
                    }
                })
            },
            closeModal(btn) {
                this.$emit('custom-event',{target:'loginModal/closeModal',data:{btn}})
                this.setModal(false);
            },
            ttGetAuthorize(session_key, type) {
                uni.getSetting({
                    success: res => {
                        if (res.authSetting['scope.userInfo']) {
                            this.ttGetUserInfo(session_key, type);
                        } else {
                            uni.authorize({
                                scope: 'scope.userInfo',
                                success: () => {
                                    this.ttGetUserInfo(session_key, type);
                                },
                                fail: (data) => {
                                    uni.showModal({
                                        title: '是否授权用户信息',
                                        success: tip => {
                                            if (tip.confirm) {
                                                this.ttOpenAuth(session_key, type);
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            },
            ttOpenAuth(session_key, type) {
                uni.openSetting({
                    success: res => {
                        if (res.authSetting['scope.userInfo']) {
                            this.ttGetUserInfo(session_key, type);
                        }
                    }
                })
            },
            ttGetUserInfo(session_key, type) {
                uni.getUserInfo({
                    provider: 'toutiao',
                    withCredentials: true,
                    success: res => {
                        let data = {
                            iv: res.iv,
                            session_key: session_key,
                            encryptedData: res.encryptedData,
                            rawData: res.rawData,
                            signature: res.signature
                        };
                        this.postData(data, type);
                    },
                    fail: err => {
                        this.$toast('获取信息失败');
                    }
                });
            }
        },
        beforeDestroy(){
            // 非强制登录页面销毁关闭弹窗
            !this.isForce && this.setModal(false)
        }
    }
</script>

<style lang="scss" scoped>
.login-modal {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999999;
    width: 100vw;
    background: rgba(#000, 0.6);

    .login-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        .btn,
        .cancel-btn{
            &:after {
                border: 0;
            }
        }

        .style {
            position: absolute;
            left: 0;
            top: 50%;
            width: 100%;
            transform: translateY(-50%);
            .login-img {
                width: 100%;
            }
            .btn {
                position: absolute;
                left: 20%;
                top: 57%;
                width: px2rpx(218);
                height: px2rpx(40);
                line-height: px2rpx(40);
                font-size: px2rpx(16);
                color: #fff;
                font-weight: 600;
                background: linear-gradient(168.71deg, $uni-color-primary 0%, #ff6f29 94.38%);
                border-radius: px2rpx(64);
            }
        }

        .style1 {
            .btn {
                font-weight: 500;
                
                &.force {
                    top: 61%;
                }
            }
            .cancel-btn {
                position: absolute;
                left: 20%;
                top: 68%;
                width: px2rpx(218);
                height: px2rpx(40);
                line-height: px2rpx(40);
                color: $uni-text-color-grey;
                font-size: px2rpx(14);
                background-color: transparent;

            }
        }

        .style2 {
            .btn {
                top: 70%;
                width: 452rpx;
                background: linear-gradient(180deg, #FEDA7C 0%, #FEAE2B 100%);
                box-shadow: 0 3px 0 #F88D11, inset 0 4px 5px rgba(255, 255, 255, 0.5);
                color: #DC1F0C;
                
                &.force {
                    top: 76%;
                }
            }
            .cancel-btn {
                position: absolute;
                left: 20%;
                top: 83%;
                border-radius: 128rpx;
                width: 452rpx;
                height: 80rpx;
                color: #fff;
                font-weight: 600;
                font-size: 32rpx;
                line-height: 80rpx;
                border: 1px solid #fff;
                background-color: transparent;
                opacity: 0.7;
            }
        }

        .style3 {
            .btn {
                top: 67%;
                width: 452rpx;
                background: #EDD29D;
                color: #671F00;
                
                 &.force {
                    top: 74%;
                }
            }
            .cancel-btn {
                position: absolute;
                left: 20%;
                top: 81%;
                border-radius: 128rpx;
                width: 452rpx;
                height: 80rpx;
                color: #fff;
                font-weight: 600;
                font-size: 32rpx;
                line-height: 80rpx;
                border: 1px solid #fff;
                background-color: transparent;
                opacity: 0.7;
            }
        }

        .style-custom {
            position: absolute;
            left: 0;
            top: 50%;
            width: 100%;
            max-height: 100%;
            transform: translateY(-50%);
            .custom-img {
                width: 100%;
                height: 100%;
            }
            .hot_item {
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .btn {
                width: 100%;
                height: 100%;
                color: transparent;
                background-color: transparent;
                border: 0;
                &:after {
                    border: 0;
                }
            }
        }
    }
}
.w436{
    width: 436rpx;
    margin:0 auto;
}
</style>