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
import api from '@/api'
let isGettingDecorateModel = {}, //集中处理装修接口请求后续操作
    haveRequested = {}; //已经请求过的装修接口，如无错误就不再请求
import {
    defaultPageInfo,
} from './commission'
import {
    createPageList,
} from './Global.js'
import activeGoodPageList from '../modules/activeGoodsPageList'
import * as utils from '@/common/util.js'
import { ACTIVE_DECORATE_NAME } from '@/common/variable/activity'
let throttlePageId='';//因为不同商品活动的模板不同，特此处理
import $decorator from '@/common/decorator'

function getGoodActivity(activity){
    //判断商品活动类型
    let name = ACTIVE_DECORATE_NAME.filter(key => {return activity?.[key]})
    if(name){
        return name[0]
    } 
    return 11
}
 
const hasMenuRoute = ['/kdxGoods/categoryList/index','/kdxCart/index']; // 非装修页具有底部菜单
 
//普通页面（非装修）
function getUnDecoratePageList() {
    $decorator.getPage(-1).setPageList(createPageList({}, -1))
    $decorator.getModule('diymenu').getDiymenu(-1)
}

function pageListApi(type, params) {
    if (ACTIVE_DECORATE_NAME.includes(throttlePageId)) {
        return new Promise((resolve, reject) => {
            resolve(utils.deepCopy(activeGoodPageList(throttlePageId)))
        })
    }else{
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
        return api.decorateApi.decorateNewIndex(params, {
            errorToast:false
        })
    }
}

function getDecoratePageList({pagePath,type,query},noParams=false,forceRefresh=false ) {
    return new Promise((resolve, reject) => {
        let params = {
            type
        }
        let pageQuery = {...store.state.decorate.pageQuery,...$decorator.getRouteParams(query,pagePath)}
        if (pageQuery.previewId && !noParams) {
            try{
                params.id =  (pageQuery.id||pageQuery.previewId).replace('/','')
            }catch(e){
                console.log(e)
            }
        }
        // 非自定义页面去除pageId
        if (type == 0 && pageQuery.pageId && !noParams) {
            params.id = pageQuery.pageId
        }
        pageListApi(type,params,forceRefresh).then((res) => {
            if (res.error == 0 && res.page && type != 20) {
                $decorator.getPage(type).setPageList(createPageList(res, type),'firstLoad');
                $decorator.getPage(type).setPageSettings(res.page.common); //装修页面设置的参数
                $decorator.getModule('diymenu').getDiymenu(type)
            } else if (res.error === 0 && !res.page && type !== 20) {
                uni.showToast({
                    title: '当前页面不存在',
                    icon: 'none'
                })
            } else if (res.error == 0 && type == 20) { //*************临时分销 */
                $decorator.getPage(type).setPageList(createPageList(defaultPageInfo, 20));
                $decorator.getModule('diymenu').getDiymenu(type)
            } else if (res.error != 0) {
                if (res.error == 321001) {
                    $decorator.getPage(type).setPageInfo({
                        notice_modules: {
                            content: '去首页',
                            type: 'toIndex'
                        },
                    },'notice_modules/decorate.js')
                    $decorator.getPage(type).setPageList([{
                        id: 'notice_modules',
                        imgName: 'have_no_browse_perm.png',
                        tip: '暂无浏览权限，请联系商城管理员'
                    }], 'firstLoad')
                } else if (res.error == 321000) {
                    $decorator.getPage(type).setPageInfo( {
                        notice_modules: {
                            content: '登录',
                            type: 'login'
                        },
                    },'notice_modules/decorate.js');
                    $decorator.getPage(type).setPageList([{
                        id: 'notice_modules',
                        imgName: 'have_no_browse_perm.png',
                        tip: '需要登录后浏览'
                    }], 'firstLoad');
                }

                haveRequested[throttlePageId] = false; //本次请求失败，重新打开请求
            }
            resolve(res)
            isGettingDecorateModel[throttlePageId] = null;
        }).catch((err) => {
            haveRequested[throttlePageId] = false;
            isGettingDecorateModel[throttlePageId] = null;
            resolve(err)
        })
    })
}

function getPageList({pagePath,type,query,throttlePageId},gooddata,noParams,forceRefresh) {
    //设置商城装修模板
    return new Promise((resolve, reject) => {
        if (type == -1) { //普通页面（非装修）
            isGettingDecorateModel[throttlePageId] = null;
            // 具有底部菜单的非装修路由请求底部菜单
            if(hasMenuRoute.includes(pagePath)){
                getUnDecoratePageList()
            }
            resolve()
        } else { //type：10 商城首页 11 商品详情 12 会员中心 0 自定义 20 分销中心

            getDecoratePageList({pagePath,type,query},noParams,forceRefresh).then(res => {
                isGettingDecorateModel[throttlePageId] = null;
                if(type==0){
                    if(res.page.common.params.showmenu==1){
                        $decorator.getPage(0).setShowMenu(false,query.pageId)
                    }else{
                        $decorator.getPage(0).setShowMenu(true,query.pageId)
                    }
                }
                resolve(res)
            }).catch(res=>{
                reject()
                isGettingDecorateModel[throttlePageId] = null;
            })
        }
    }).catch(err=> {
        console.log(err)
    })
}
export async function getDecorateModel({ //获取页面装修模板数据
    pagePath = '', //页面路由
    noParams = false, //
    forceRefresh = false, //是否强制更新，
    otherdata = null
}) {

    if(otherdata.scene){//小程序扫码直接进入
        let data= $decorator.getPage('goodDetail').getUrlParams({
            path:pagePath,
            query:otherdata
        })
        otherdata=data;
    }
    let type = $decorator.getPageType(pagePath); //获取页面类型
    let gooddata = null;
    throttlePageId=type;//因为不同商品活动的模板不同，特此处理
    if (type == 11) { //活动商品另外请求模板
        gooddata = await $decorator.getPage(type).getGoodDetail({
            goodId: otherdata.goods_id,
        },'getDecorateModel')
        throttlePageId=getGoodActivity(gooddata.activity)
    }
    if (isGettingDecorateModel[throttlePageId]) { //这里是防止不同的地方同时访问该方法，合并操作的地方
        return isGettingDecorateModel[throttlePageId]
    }


    // 过滤掉商品详情,
    let filterTypes = [0, 11]
    forceRefresh=forceRefresh||type==0;//自定义页面强制更新
    if (!forceRefresh && haveRequested[throttlePageId] && !filterTypes.includes(type)) { //一个页面类型的装修接口请求完毕，就不在请求了；
        $decorator.getModule('diymenu').getDiymenu(type)
        return
    }
    haveRequested[throttlePageId] = throttlePageId; //该类型的页面装修接口不再请求
    $decorator.getPage(type).setPageLoading(true); //启动页面加载等待动画

    isGettingDecorateModel[throttlePageId] = getPageList({pagePath,type,query:otherdata,throttlePageId},gooddata,noParams,forceRefresh); //请求装修组件列表
    return isGettingDecorateModel[throttlePageId]

}
