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
 * 这里是改造uni-simple-router的方法，添加了函数节流
 * throttleNav用来限制路由操作的频率
 */
let throttleNav = false

let MY_ROUTER = {
    push: null,
    replace: null,
    replaceAll: null,
    back: null,
}
import store from '@/store'
import {
    formatWapPath,
    openLiver,
    goWxApp
} from '@/common/util'
import {
    deepCompare
} from '@/common/objectTools.js'

let cacheDiyMenuPages = []
let currentNavInfo = {}

/**
 * 预加载装修数据
 * @param {} to
 */
import preloadDecorate from './beforeEach/preLoadDecorate.js'

function isOrNotTabbars(path) { //判断是否tabbar页面
    let tabbarPages = store.state.decorate.tabbarPages;
    let tabbars = Object.keys(tabbarPages)
    if (!tabbars.length) {
        return false
    }
    if (tabbarPages[path]) {
        return true
    } else {
        return false
    }
}

function isPreviewModel() {//预览模式
    // #ifdef H5
    if (store.state.decorate.pageQuery.previewId) {//预览状态
        uni.showToast({
            title: '预览模式',
            icon: 'none'
        })
        return true
    }
    // #endif
    return false
}

function throttle(type, data) {
    let route = null
    if (typeof data == 'string') {
        route = {
            path: data
        }
    } else if (typeof data == 'object') {
        route = data
    }

    if (route && deepCompare({type, route}, currentNavInfo)) {
        return true
    }
    currentNavInfo = {type, route}
    clearTimeout(throttleNav)
    throttleNav = setTimeout(() => {
        currentNavInfo = {}
        throttleNav = null;
    }, 1000)
    return false
}

export default function () {
    if (!MY_ROUTER.push) {
        MY_ROUTER.push = this.$Router.push;
        MY_ROUTER.replace = this.$Router.replace;
        MY_ROUTER.replaceAll = this.$Router.replaceAll
        MY_ROUTER.back = this.$Router.back
        this.$Router.push = async (data) => {
            if (isPreviewModel()) {//预览状态
                return
            }
            let pathInfo = formatWapPath(data);//格式化路由参数
            preloadDecorate(pathInfo.path, pathInfo.query);

            if (throttle('push', data)) {
                return
            }
            pathInfo.params = {
                ...pathInfo.params,
                nav_type: 'push'
            }
            MY_ROUTER.push.call(this.$Router, pathInfo)
        }
        this.$Router.back = (data) => {
            if (isPreviewModel()) {//预览状态
                return
            }
            let pathInfo = formatWapPath(data);//格式化路由参数
            if (typeof pathInfo === 'object') {
                pathInfo.params = {
                    ...pathInfo.params,
                    nav_type: 'back'
                }
            }
            MY_ROUTER.back.call(this.$Router, pathInfo)
        }
        this.$Router.replace = (data) => {
            if (isPreviewModel()) {//预览状态
                return
            }
            let pathInfo = formatWapPath(data);//格式化路由参数
            preloadDecorate(data.path, data.query);
            if (throttle('replace', data)) {
                return
            }
            pathInfo.params = {
                ...pathInfo.params,
                nav_type: 'replace'
            }

            MY_ROUTER.replace.call(this.$Router, pathInfo)
        }
        this.$Router.replaceAll = (data) => {
            if (isPreviewModel()) {//预览状态
                return
            }
            let pathInfo = formatWapPath(data);//格式化路由参数
            preloadDecorate(data.path, data.query);
            if (throttle('replaceAll', data)) {
                return
            }
            pathInfo.params = {
                ...pathInfo.params,
                nav_type: 'replaceAll'
            }
            MY_ROUTER.replaceAll.call(this.$Router, pathInfo)
        }

        this.$Router.auto = (data, optQuery = {}, extraData = {}, callback) => {
            if (isPreviewModel()) {//预览状态
                return
            }
            if (throttle('auto', data)) {
                return
            }

            let pathInfo = formatWapPath(data);//格式化路由参数
            if (pathInfo && typeof pathInfo == 'string') {
                if (pathInfo.indexOf('tel:') > -1) {//打电话
                    let mobile = pathInfo.replace('tel:', '')
                    mobile && uni.makePhoneCall({
                        phoneNumber: mobile
                    })
                    return
                }

                if (pathInfo.indexOf('wxapp:') > -1) { //小程序跳转
                    goWxApp(pathInfo, optQuery?.wxappid, extraData, callback)
                    return
                }
                // #ifndef H5

                // 小程序判断微信客服
                if(pathInfo.indexOf("work.weixin.qq.com") !== -1) {
					let queryArr,corpId
                   if(pathInfo.indexOf('?') != -1) {
					    queryArr = pathInfo.split("?")
					    corpId = queryArr[1].substring(queryArr[1].indexOf("=") + 1)
				   }
				   console.log('wx  info----------',pathInfo,corpId)
                    wx.openCustomerServiceChat({
                        extInfo: {
                            url: queryArr ? queryArr[0] : pathInfo
                        },
                        corpId: corpId||'',//ww57027b488e24380b
						fail: (err) => {
							console.error(err)
						}
                    })
                    return
                }
                MY_ROUTER.push.call(this.$Router, { //外部链接http://
                    path: '/kdxOthers/webview',
                    query: {
                        link: pathInfo
                    }
                })
                // #endif
                // #ifdef H5
                window.location.href = pathInfo.indexOf('http') == 0 ? pathInfo : ('http://' + pathInfo)
                // #endif
                return
            }
            //  小程序直播跳转
            if (pathInfo.path == '/pages/liver/liver') {
                openLiver({
                    liverId: pathInfo.query.liverId,
                    broadId: pathInfo.query.broadId
                })
                return
            }

            // #ifdef MP-WEIXIN
            let isGoodsDetail = this.$Route?.path === '/kdxGoods/detail/index' ? 1 : 0,
                    goods_id = isGoodsDetail ? this.$Route?.query?.goods_id : 0;
            // #endif
            if (pathInfo.path == this.$Route.path) { //要跳转的页面路径与当前相同，
                if (pathInfo.query && deepCompare(pathInfo.query, this.$Route.query)) {//如果传参相同
                    return
                } else if (!pathInfo.query && deepCompare(this.$Route.query, {})) {//如果传参相同(无传参)
                    return
                }
                MY_ROUTER.replace.call(this.$Router, pathInfo);
                return
            } else {
                let navtype = 'push'
                preloadDecorate(pathInfo.path, pathInfo.query);//预加载装修数据
                // #ifndef H5
                cacheDiyMenuPages = getCurrentPages();//页面栈
                // #endif
                if (isOrNotTabbars(pathInfo.path) && deepCompare(pathInfo.query, {})) {//是底部导航页面并且无传参
                    // #ifndef H5
                    let length = cacheDiyMenuPages.length;
                    if (length > 1) {//页面栈中已有多个页面
                        navtype = 'replaceAll'
                    } else {
                        navtype = 'replace'
                    }
                    // #endif
                }
                // #ifndef H5
                if (navtype == 'push' && cacheDiyMenuPages.length > 9) {//小程序的10层跳转限制
                    navtype = 'replace'
                }
                // #endif
                MY_ROUTER[navtype].call(this.$Router, pathInfo);
            }
        }
        this.$Router.init = () => {
            clearTimeout(throttleNav)
            currentNavInfo = {}
        }
    }

}
