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
<script>
    import {
        mapMutations,
        mapGetters,
        mapActions,
        mapState,
    } from 'vuex'
    import CustomRouter from '@/router/interceptors'
    import preloadDecorate from '@/router/beforeEach/preLoadDecorate.js'
    import settings from '@/static/settings.js'
    // #ifdef MP-WEIXIN
    import {
        liverPlayer
    } from '@/common/util'
    // #endif
    import globalGuard from './router/beforeEach/index'
    import axios from "./common/request/myAxios";
    export default {
        created(){
            // 加载loading之前的预制数据
            // this.$loading.setOtherData();
        },
        computed: {
            ...mapGetters('login', ['isLogin']),
            needUpdate(){
                let { pageInfo,isTop } = this.$store.state.decorate.indexPage
                return  pageInfo.followbar?.show =='1' && isTop?.some(v=>v.id === 'followbar')
            }
        },
        watch: {
            isLogin: {
                async handler(val) {
                    try {
                        // 获取系统设置和渠道
                        val && await globalGuard.getSysSetting()
                        val && await globalGuard.getChannelStatus()
                        val && this.getBindStatus()
                        //  登录后 关注条设置为关注后隐藏 更新首页装修
                        val && this.needUpdate && preloadDecorate('/pages/index/index',this.$Route.query,true)
                        // 登录后 重新设置 关注条
                        val && this.$decorator.getModule('diymenu').getCartNum(true);//获取购物车数量
                    }catch (err) {
                        console.error(err,'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
                    }
                },
                immediate: true
            },
        },
        async onLaunch(options) {
            this.init()
            CustomRouter.call(this); //重写路由跳转方法
            //#ifdef H5
           this.initVConsole()
            //#endif
            // uni.showLoading({
            //     title: '加载中'
            // });
            this.$store.commit('setFirstLoad', true)

            try {
                // #ifdef MP-WEIXIN || MP-TOUTIAO
                this.getUpdateManager()
                // #endif
                await this.$api.settingApi.runAsyncTask()
                this.$api.loginApi.viewRecord({
                    page: '/pages/index/index',
                })
                // 获取iphonex底部安全区域
                this.$store.commit('getDeviceSet')
                //  窗口改变重新获取
                uni.onWindowResize(() => {
                    this.$store.commit('getDeviceSet')
                })
                // 获取登录状态以及是否强制绑定手机号
                await this.$store.dispatch('login/checkLogin')
            } catch (e) {
                // 初始化顶部菜单的值
                // this.$decorator.getDecorateModel({
                //     pagePath: '/pages/index/index',
                //     noParams: true
                // })
                this.$api.loginApi.viewRecord({
                    page: '/pages/index/index',
                })
                // 获取iphonex底部安全区域
                this.$store.commit('getDeviceSet')
                //  窗口改变重新获取
                uni.onWindowResize(() => {
                    this.$store.commit('getDeviceSet')
                })
                // 获取登录状态以及是否强制绑定手机号
                this.$store.dispatch('login/checkLogin').catch(err=> {})
            }
        },
        // #ifdef MP-WEIXIN
        onShow(opt) {
            console.log(opt?.scene,'scene')
            if (opt ?.scene == 1007 || opt?.scene == 1008 || opt?.scene == 1044) {
                if (liverPlayer) {
                    liverPlayer.getShareParams()
                        .then(res => {
                            if (res.custom_params) {
                                this.sessionStorage.setItem("inviter-id", res.custom_params.inviter_id);
                            }
                        })
                }
            }

            // 视频号进入的
            if (new Set([1036, 1208, 1216, 1175, 1177, 1191, 1176, 1195, 1197, 1198]).has(opt?.scene)) {
                this.sessionStorage.setItem('wx-video', opt?.scene);
            } else {
                this.sessionStorage.setItem('wx-video', '')
            }
        },
        // #endif

        // #ifdef MP-TOUTIAO
        onShow(){},
        // #endif
        methods: {
            ...mapMutations('login', ['setBind', 'setUserInfo','setModal']),
            init(){
                /* 持久缓存导致需要手动设置一下 */
                if(this.$store.state.login.isLogin){
                    this.setModal(false)
                }
            },
            initVConsole(){
                if(process.env.NODE_ENV=='development'){
                    document.getElementById('__vconsole').style.display='block'
                }
                var time=0
                var bar =false;
                window.vconsolecallback = () =>{//vconsole
                    time=time+1
                    if(!bar){
                        bar=true;
                        setTimeout(() =>{
                            bar=false;
                            if(time>9){
                                document.getElementById('__vconsole').style.display='block'
                            }
                            time=0
                        },5000)
                    }
                }
            },
            getBindStatus() {
                // 获取绑定手机号状态
                this.$api.memberApi.getUserInfo().then(res => {
                    if (res.error === 0) {

                        this.setBind(res.data.mobile ? true : false);
                        this.setUserInfo(res.data)
                        this.$decorator.getModule('followbar').closeFollowbar(10)
                    }
                })
            },

            getSysSetting() {
                this.$store.dispatch('setting/getSysSetting')
            },
            // 获取小程序版本更新
            getUpdateManager() {
                const updateManager = uni.getUpdateManager();
                if (updateManager) {
                    updateManager.onCheckForUpdate(function(res) {
                        // 请求完新版本信息的回调
                        if (res.hasUpdate) {
                            updateManager.onUpdateReady(function() {
                                uni.showModal({
                                    title: '更新提示',
                                    content: '新版本已经准备好，是否重启应用？',
                                    success: function(res) {
                                        if (res.confirm) {
                                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                            updateManager.applyUpdate()
                                        }
                                    }
                                })
                            });
                        }
                    });
                    updateManager.onUpdateFailed(function(res) {
                        // 新的版本下载失败
                        uni.showModal({
                            title: '更新提示',
                            content: '新版本下载失败',
                            showCancel: false
                        })
                    });
                }
            },

        }
    }
</script>

<style lang="scss">
    /*每个页面公共css */
    /* #ifndef APP-PLUS-NVUE */
    @import './common/css/reset.scss';
     @import './common/css/theme.scss';
    uni-page-body {
        height: 100%;
    }
    /* #endif */

    .color-black {
        color: #333333;
    }
    .color-red {
        color: #ff0036;
    }
    .grace-title {
        color: #333333;
    }
    /* 可以利用条件编译编写不同平台的样式 如 : 修改导航组件 */
    /* #ifndef APP-PLUS-NVUE */
    navigator {
        opacity: 1;
        background: none;
    }
    .navigator-hover {
        background-color: none;
        opacity: 0.8;
    }
    /* #endif */
    page {
        background-color: #f5f5f5;
    }
</style>
