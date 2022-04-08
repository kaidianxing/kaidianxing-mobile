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
/**
 * 全局路由导航守卫
 * ./routeModules
 */
import {
    localStorage
} from "mp-storage";
import routeModules from './modules'
import Vue from 'vue'
//这里仅示范npm安装方式的引入，其它方式引入请看最上面【安装】部分
import beforeEacher from './beforeEach/index.js'
import afterEacher from './afterEach/index.js'
import interceptors from './beforeEach/interceptors.js'
/**
 * 预加载装修数据
 * @param {} to
 */
import preloadDecorate from './beforeEach/preLoadDecorate.js'
import {
    deepCopy
} from '@/common/objectTools'
import store from '@/store'
//初始化
// #ifdef H5
import {createRouter,RouterMount} from 'uni-simple-router-v2'
const router = createRouter({
    platform: process.env.VUE_APP_PLATFORM,
	encodeURI: false, //不编码传参
	routes: [...routeModules], //路由表
})
Vue.use(router)
// #endif

// #ifndef H5
import Router,{RouterMount} from 'uni-simple-router'
Vue.use(Router)
const router = new Router({
	encodeURI: false, //不编码传参
	routes: [...routeModules], //路由表
})
// #endif
import $decorator from '@/common/decorator'
import { isWx } from "../common/util";


// localStorage.setItem('session-id', '5798f6a827fd3a989f5f049e804bcfd4')
// localStorage.setItem('session-id', '8ea167d86cb1623cf63bd61ede559a27')
// localStorage.setItem('session-id', 'zhurunfeng');

// localStorage.setItem('session-id', 'dd2fb193a7f5aa8fdd5ea3cf62984f82')
// localStorage.setItem('session-id', '9d798288cd44532a18e64d537553c27e')


//全局路由前置守卫
router.beforeEach(async (to, from, next) => {

    try {
        // 白名单跳转
        const isWhiteBlank = beforeEacher.whiteBlankRoute(to)
        if(isWhiteBlank) {
            return next()
        }
        //获取系统设置
        await beforeEacher.getSysSetting(to);

        // 判断管理端是否关闭
        if(beforeEacher.isAdminClose(to,from,next,store)) {
            return
        };
        // 微信渠道获取渠道状态
        // #ifdef H5
        if(isWx) {
           await beforeEacher.getChannelStatus();
        }
        // #endif
         //处理缺少session-id
        beforeEacher.haveSessionId();
        // 初始化装修状态
        $decorator.getPageType(to.path)!=-1&&$decorator.initStatus();//只会运行一次，第一个装修页面触发
       
         /**
         * 先要判断是否能够跳转
         * 有些页面需要先登录后跳转，如：分销中心
         * 有的页面需要绑定手机号
         */
        // 打烊页面不请求装修
        if(to.path!=='/kdxOthers/close/close'){
            preloadDecorate(to.path, to.query)
        } else {
            return next()
        }
        interceptors(to,from).then(to=>{
            //通过检测，可以继续
            //跳轉tabbar頁面的处理
            next(to)
        }).catch(err =>{
            next(false)
        })
    } catch (err) {
        uni.showToast({
            title: '页面路由错误',
            icon: 'none'
        })
        next(false);
    }

})
// 全局路由后置守卫
router.afterEach((to, from) => {
    // 白名单不走以下接口处理
    const isWhiteBlank = afterEacher.whiteBlankRoute(to)
    if(isWhiteBlank) {
        return
    }
    // uni.showLoading({
    //     title: '加载中...'
    // });
    afterEacher.setNavigationBarColor(to);
     //#ifdef H5
    // 处理-history分享-ios
    afterEacher.getWechatSignUrl();
    // 处理邀请信息
    afterEacher.dealInviter();
    //商城分享功能
    afterEacher.share(to);
    //#endif
    // 分销上身份检查
    afterEacher.isCommission(to);
    //统计
    afterEacher.viewRecord(to);
    $decorator.setCurPagePath(to)
    $decorator.getPage(from.path).onUnload(1,to,from)
    // 判断登录信息和绑定信息
    afterEacher.checkLogin(to)

    // #ifndef H5
    beforeEacher.getChannelStatus()
    // #endif
  
    store.commit('setCurRoute', deepCopy(to))
})
export {
    router,
    RouterMount
}
