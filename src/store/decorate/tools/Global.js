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


import * as utils from '@/common/util.js'
import store from '@/store'
import $decorator from '@/common/decorator'
const isTop = {
    fixedsearch: 2,
    topmenu: 1,
    followbar: 3
} //置顶元素fixedsearch,topmenu
const isBottom = {
    detail_navbar: 1,
    diymenu: 1
} //置底元素 detail_navbar,diymenu
const isFixed = {
    gotop: 1,
    layer: 1
} //页面悬浮组件

export function setPageBottomHeight(list, pageInfo) {
    //页面底部高度
    let totalheight = 0
    try{
    list?.filter((item) => {
        return (
            pageInfo[item.id] ?.show !== false &&
            pageInfo[item._com_idx_] ?.show !== false
        )
    }).map((item) => {
        if (item.id == 'detail_navbar') {
            totalheight = 96 + totalheight
        } else if (
            item.id == 'diymenu'
        ) {
            totalheight = 100 + totalheight
        }
    })

    }catch(err){
        
    }
    return totalheight
}
export function setPageTopHeight(list=[], pageInfo) {
    //页面顶部高度
    delete pageInfo['undefined'];////////////
    let totalheight = 0
    try {
        let newList= list?.filter((item) => {
            return (
                pageInfo[item.id] ?.show !== false &&
                pageInfo[item._com_idx_] ?.show !== false
            )
        }) 
        
        newList?.map((item) => {
            if (item.id == 'fixedsearch') {
                totalheight = 92 + totalheight
            } else if (item.id == 'topmenu') {
                totalheight = 80 + totalheight
            } else if (item.id == 'followbar') {
                totalheight = 96 + totalheight
            }
        })

    }catch(err){
        
    }
   
    return totalheight;
}

export function createPageList(result, pageType) {
    //切换页面数据
    if (!result) {
        return []
    }
    if (result.error == 321001 || result.error == 321000) { //自定义页面的浏览权限
        return[{
            id: 'notice_modules',
            imgName: 'have_no_browse_perm.png',
            tip: result.error == 321000 ? '需要登录后浏览' : '暂无浏览权限，请联系商城管理员'
        }]
    }
    let decorateState = $decorator.getModule('diymenu'); //整个装修模块的state
    let pageInfoData = result.page ?.content; //装修页面的组件列表
    let pagelist = [];
    if (pageInfoData) {
        for (let k in pageInfoData) {
            if (!pageInfoData[k]._comIndex_) {
                pageInfoData[k]._comIndex_ = '_com_idx_' + pageType + '_' + pageInfoData[k].id + '_' + k+'_'+ new Date().getTime()//记录组件唯一标识，如果两次的的标识一致可以认为可复用该缓存
            }
            pagelist.push(pageInfoData[k]);
        }
    }
   
    let menuArr = pagelist.filter(v => v.type == 'diymenu');//没有添加自定义菜单的是非装修页
    if (!menuArr.length) {
        pagelist.push(decorateState.defaultDiymenu);//非装修页添加一个默认自定义菜单
    }
    
    pagelist = pagelist.map((item, index) => {
        if (item.type == 'gotop') {//默认返回顶部是隐藏状态
            item.show = false
        }
        if (item.data) {//处理页面装修组件列表数据
            item.data.forEach((val) => {
                //这里转换图片链接格式
                let tmp = []
                let children = val?.child
                if (val ?.imgurl) {
                    val.imgurl = utils.mediaUrl(val.imgurl)
                }
                if (val ?.thumb) {
                    val.thumb = utils.mediaUrl(val.thumb)
                }
                if (val ?.img_url) {
                    val.img_url = utils.mediaUrl(val.img_url)
                }
                if (
                    typeof children == 'object' &&
                    !(children instanceof Array)
                ) {//data中的对象型child转为数组型
                    for (let k in children) {
                        tmp.push(children[k])
                    }
                    val.child = tmp
                }
            })
        }
        /**
         * 下面将置顶置底悬浮组件进行标记
         */
        if (isTop[item.type]) {
            item.istop = isTop[item.type]
        } else if (isBottom[item.type]) {
            item.isbottom = isBottom[item.type]
        } else if (isFixed[item.type]) {
            item.isfixed = isFixed[item.type]
        }

        /* 上面完成模板数据合并 */
        /* 下面进行真实数据合并 */
        return item
    })
    return pagelist;
}


export function customPageViewPerm(custonPageParams,userInfo){//是否有自定义页面的浏览权限
    let hasViewPerm = -1;
    if(custonPageParams.limitlabel==1&&custonPageParams.browsepermlabels.length){ 
        hasViewPerm=0;
        let group={}
        userInfo.group_id.forEach(item=>{
            group[item]=true
        })
        for(let item of custonPageParams.browsepermlabels){
            if(group[item.id]){
                hasViewPerm=1;
                break;
            }
        }
    }
    if(custonPageParams.limitlevel==1&&custonPageParams.browsepermlevels.length){
        if(hasViewPerm<1){//如果
            hasViewPerm=0;
            for(let item of custonPageParams.browsepermlevels){
                if(item.id==userInfo.level_id){
                    hasViewPerm=1;
                    break;
                }
            }
        }
    }
    // #ifdef H5
    if(store.state.decorate.pageQuery.previewId){
        return true
    }
    // #endif
    return hasViewPerm!=0
}
