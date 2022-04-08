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
import {mapState,mapGetters} from "vuex";
import afterEacher from '@/router/afterEach/index.js'
import CustomRouter from '@/router/interceptors'

import {
    sessionStorage
} from 'mp-storage'
export default {
    
    created() {
        this.startTime = +new Date();
    },
    data() {
        return {
            loadingFlg: 0,
        }
    },
    watch: {
        isSkeleton(e) {
            if (!e) {
                ++this.loadingFlg
            }
        }  
    },
    mounted() {
        console.error(
          "组建的渲染时间：" +
            this.__route__ +
            "：" +
            (+new Date() - this.startTime)
        );
    },
    computed: {
        ...mapGetters("loading", ["isSkeleton"]),
        ...mapState('setting', {
            shareTitle: state => state.systemSetting?.share?.title || '',
            shareDesc: state => state.systemSetting?.share?.description || '',
            shareLogo: state => state.systemSetting?.share?.logo,
        }),
    },
    methods: {
        handlerOptions(opt) {
            if (opt ?.scene) {
                let arr = decodeURIComponent(decodeURIComponent(opt ?.scene)).split('&'),
                    obj = {};
                for (let i = 0; i < arr.length; i++) {
                    let arr2 = arr[i].split('=');
                    obj[arr2[0]] = arr2[1];
                }
                if (obj ?.inviter_id) {
                    sessionStorage.setItem("inviter-id", obj.inviter_id);
                }
            }
        }
    },

    // #ifndef H5
    onShareAppMessage() {
        let shareParams = {
            ...this.$Route.query,
        }

        if(this.$store.state.login.userInfo.id) {
            shareParams.inviter_id = this.$store.state.login.userInfo.id
        }

        let url = this.$Route.path+'?'+this.$utils.createRouteParams(shareParams);
        if (this.$Route.meta?.needLogin || this.$Route.meta?.bindSence) {
            url = '/pages/index/index?'+ this.$utils.createRouteParams(shareParams)
        }
        return {
            title: this.shareTitle || this.$Route.meta.title,
            imageUrl: this.$utils.mediaUrl(this.shareLogo),
            path: url,
            success: function() {},
            fail: function() {}
        }
    },
    onShareTimeline(){
        let shareParams = {
            ...this.$Route.query,
        }

        if(this.$store.state.login.userInfo.id) {
            shareParams.inviter_id = this.$store.state.login.userInfo.id
        }
        return {
            title: this.shareTitle || this.$Route.meta.title,
            imageUrl:this.$utils.mediaUrl(this.shareLogo),
            query: this.$utils.createRouteParams(shareParams)
        }
    },
    // #endif
    onPullDownRefresh() {
        if(typeof this.pullDownRefresh=='function'){
            this.pullDownRefresh()
        }
        setTimeout(() => {
            this.$closePageLoading()
        },2000)
    },
    onLoad(opt) {
        
        //  #ifndef H5
        //  解决小程序分享进来不走onLaunch 处理路由方法
        if(typeof this.$Router?.auto !=='function'){
            CustomRouter.call(this); //重写路由跳转方法
        }
        uni.showShareMenu({
            withShareTicket: false,
            menus: ['shareAppMessage', 'shareTimeline']
        });
        this.handlerOptions(opt);
        if(this.$store.state.isFirst&&opt?.broadcast_room_id && this.$Route.path=='/pages/index/index') {
            this.$store.commit('setFirstLoad', false)
            this.$utils.openLiver({
                liverId: opt.room_id,
                broadId: opt.broadcast_room_id
            })
            return
        }
        // #endif
        this.showTabbar = true;
        // console.log('onLoad111',this.$Route.path)
    }, 
    onShow() {
        uni.hideLoading()
        afterEacher.setNavigationBarColor(this.$Route);
        this.$decorator.getPage(this.$Route.path).onLoad();
        let query = this.$Route.query;
        if(query?.inviter_id){
            sessionStorage.setItem("inviter-id", query.inviter_id);
        }
       
        this.$decorator.getDecorateModel({ //路由导航守卫中也有，这里是为了解决某些情况下路由导航守卫触发失败的情况的；
            pagePath: this.$Route.path, 
            otherdata:query
        })
        if (this.pageInfo ?.gotop && this.pageInfo.gotop.params ?.scrollTop) {
            this.$decorator.getPage(this.$Route).setPageInfo({
                gotop: {
                    show: this.pageInfo.gotop ?.params ?.scrollTop >= this.pageInfo.gotop ?.params ?.gotopheight
                }
            },'pagemixin/onshow1')
        } else if (this.pageInfo ?.gotop) {
            this.$decorator.getPage(this.$Route).setPageInfo({
                gotop: {
                    show: false,
                    params: {
                        scrolltop: 0
                    }
                }
            },'pagemixin/onshow2') 
        }
    }, 
    onHide() {
        this.$decorator.getPage(this.$Route).setPageInfo({
            gotop: {
                show: false
            }
        },'pagemixin/onhide')
        this.$closePageLoading()
    },
    onPageScroll(e) {
        this.$decorator.getModule('gotop').onPageScroll(e,this.$Route)
    }
}
