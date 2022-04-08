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
import store from '@/store'
import $decorator from '@/common/decorator'
import api from '@/api'
import * as utils from '@/common/util'
import { WHITE_BLANK } from '@/common/variable/route'
import {
    operationSystemType,
    getShareInfo,
    getRouteParams,
    deepCompare,
    is_weixin,
} from '@/common/util'
import Vue from 'vue'
import { hasBindBySence } from '@/common/helper/user'

function getCommisionSet() {
    if (store.state.commissionSet.commissionSetting) {
        return
    }
    if (store.state.login.isLogin  && !store.state.commissionSet.commissionSetting) {
        store.dispatch('commissionSet/getCommissionSetting') //获取分销文字设置
    }
}
class Dealer {
    isWeixin = -1
    inviter_id = -1
    curPath = '';
    cacheTopColor={}
    lastPageData={}
    async setNavigationBarColor(to) {
        let pageType = $decorator.getPageType(to.path)
        // 过滤非装修页面
        if(pageType == -1) return;

        let pageId= pageType+'?pageId='+to.query?.pageId??''
        if(this.cacheTopColor[pageId]){
            uni.setNavigationBarColor({
                frontColor: this.cacheTopColor[pageId].frontColor,
                backgroundColor: this.cacheTopColor[pageId].backgroundColor,
                animation: {
                    duration: 400,
                    timingFunc: 'easeIn'
                }
            })
        }else{
            let params= {
                type: pageType
            }

            if(to.query?.pageId) {
                params.id = to.query?.pageId
            }
            // 统一参数type数据类型,防止请求参数不一样缓存不成功
            if(typeof params.type == 'number') {
                params.type = params.type.toString()
            }
            let locParam = store.state.setting?.locationPosition
            if(locParam) {
                params = {
                    ...params,
                    ...locParam
                }
            }
            //装修数据预加载
            api.decorateApi.decorateNewIndex(params).then(res => {
                if (res.error == 0 && res.page ?.common ?.params ?.navbgcolor) {
                    this.cacheTopColor[pageId]={
                        frontColor: res.page ?.common ?.params ?.funbtncolor=='white'?'#ffffff':"#000000",
                        backgroundColor: res.page.common.params.navbgcolor||'#ffffff',
                    }
                    uni.setNavigationBarColor({
                        frontColor: this.cacheTopColor[pageId].frontColor,
                        backgroundColor: this.cacheTopColor[pageId].backgroundColor,
                        animation: {
                            duration: 400,
                            timingFunc: 'easeIn'
                        }
                    })
                }

            })
        }

    }
    viewRecord(to,recordGoodDetail=false) {
        if(to.path!='/kdxGoods/detail/index'||recordGoodDetail){//商品详情页需要加载商品详情后才能获取sub_shop_id

            let data= {
                page: to.path
            }
            if(Object.keys(to.query).length){
                data.params=to.query
            }
            if(to.query.sub_shop_id){
                data.sub_shop_id=to.query.sub_shop_id
            }
            if(!deepCompare(data,this.lastPageData)){
                this.lastPageData=data;
                api.loginApi.viewRecord({
                    ...data,
                    //#ifdef H5
                    url:window.location.href,
                    //#endif
                })
            }
        }

    }
    //获取分享人信息
    dealInviter() {
        if (this.inviter_id === -1) {
            let route = getRouteParams(location.href);
            let {
                inviter_id
            } = {
                ...route.query,
                ...route.hashQuery
            };
            if (inviter_id) {
                sessionStorage.setItem("inviter-id", inviter_id);
            }
            this.inviter_id = inviter_id
        }
    }

    /**ios -history模式分享
     *
     * https://www.jb51.net/article/150840.htm
     * */
    getWechatSignUrl() {
        if (is_weixin() && operationSystemType() == 'ios') {
            store.commit("setting/setWechatSignUrl", window.location.href);
        }
    }

    /**
     * 分享功能-分享处理勿动
     * */
    share(to) {
        if (this.isWeixin == -1) {
            this.isWeixin = is_weixin()
        }
        if (this.isWeixin && !to.meta?.customShareInfo) {
            this.curPath = to.path;
            setTimeout(() => {
                let share = store.state.setting.systemSetting ?.share ?? {};
                // 如果有基础分享设置
                if (share) {
                    share.sdkUrl = location.href;
                    getShareInfo(share, true)
                }
            })
        }
    }

    async isCommission(to) {
        let isLogin = false;
        if (to.path.indexOf('/kdxCommission') == 0) {
            try {
                isLogin = await store.dispatch('login/checkLogin')
            } catch (e) {
                isLogin = false
            }
        }

        let $Router = Vue.prototype.$Router
        let rej = null;

        if (to.path.indexOf('/kdxCommission') == 0) {
            if (!isLogin) {
                // #ifdef H5
                store.dispatch('login/checkLogin').then(res => {
                    if (!res) {
                        $Router.replace({
                            path: '/',
                        })
                    }
                }).catch(err => {
                    $Router.replace({
                        path: '/',
                    })
                })
                // #endif
            } else if (to.meta && to.meta.isUse) {

                getCommisionSet(); //获取分销设置
                try {
                    rej = await store.dispatch('commissionSet/getCommissionStatus', {})
                } catch (err) {
                    if (rej == 'noOpen') {
                        $Router.auto({
                            path: '/kdxCommission/default',
                            name: 'commission_default'
                        })
                    } else if (rej == 'noCommission') {
                        $Router.auto({
                            path: '/kdxCommission/apply/index',
                            name: 'commission_apply'
                        })
                    }
                }

            }

        }
    }
    /* 处理强制登录 */
    async checkLogin(to){
        let {coerce_auth_channel,coerce_auth} = store.state.setting.systemSetting?.registry_settings || {}
        let force=false
        if(coerce_auth=='1') {
            // #ifdef H5
            if(utils.is_weixin()){
                force= coerce_auth_channel?.wechat =='1'
            } else {
                force=  coerce_auth_channel?.h5=='1'
            }
            // #endif

            // #ifdef MP-TOUTIAO
            force =  coerce_auth_channel?.byte_dance=='1'
            // #endif
        }
        let {isLogin} = store.state.login
        if(isLogin== null) {
            isLogin = await store.dispatch('login/checkLogin')
        }
        // 强制登录 23068
        if(force && isLogin!== true) {
            store.commit('login/setModal', true);
            return
        } else if (to.meta && to.meta.needLogin && isLogin == false) {     // 触发登录
            store.commit('login/setModal', true);
        } else if (to.meta?.bindSence && hasBindBySence(to.meta?.bindSence)) {    // 触发登录
            store.commit('login/setModal', true)
        } else {
            store.commit('login/setModal', false);
        }
    }

    // 判断是否是白名单路由
    whiteBlankRoute(to) {
        return WHITE_BLANK.includes(to.path)
     }

}
export default new Dealer()
