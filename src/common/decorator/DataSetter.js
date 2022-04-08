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
import {
    deepCopy,
    deepCompare,
    deepMerge
} from '@/common/objectTools.js'
import store from '@/store'

import $decorator from '@/common/decorator'

export default class {
    newData = {}
    updating=null;
    state={}
    constructor(state){
        this.state=state
    }
    updateStore(data) { //更新store.state
        if (typeof data == "object") {
            if (data instanceof Array) {
                data.forEach(item => {
                    this.newData[item] = this.state[item]
                })
            } else {
                for(let k in data) {
                    this.state[k]=data[k]
                    this.newData[k]=data[k]
                }
            }
        } else {
            let tmp = null
            for (var key in this.state) {
                tmp = this.state[key]
                if (typeof tmp !== 'function') {
                    this.newData[key] = tmp;
                }
            }
        } 
    }
    
    updateState(storePath, data,forceUpdate=false) { //更新store.state
        this.updateStore(data);
        clearTimeout(this.updating)
        // console.log(data,this.newData,'kkkkkkkkkk',deepCopy(this.newData))
        if(forceUpdate){
            this.newData && store.commit(storePath, deepCopy(this.newData));
            this.newData = {}
        }else{
            this.updating=setTimeout(() => {
                this.newData && store.commit(storePath, deepCopy(this.newData));
                this.newData = {}
            })
        }
    }
    
    updatePageInfo(info, pageType) { //更新页面数据用的函数state.pageInfo
        return new Promise((resolve, reject) => {
            let tmp = null
            let pageInfo = $decorator.getPage(pageType).pageInfo; //获取该pageType页的store.state.pageInfo
            try{
                for (let k in info) {
                    if(!pageInfo[k]){
                        pageInfo[k]=info[k]
                    }else if (deepCompare(tmp, info[k])) {
                        continue;
                    }
                    tmp = pageInfo[k] || {}
                    if (info[k] ?.data) {
                        //data要直接替换
                        tmp.data = info[k].data
                    }
                    if (info[k] ?.items) {
                        tmp.items = info[k].items
                    }
                    let tmpMerge = deepMerge(tmp, info[k])
                    pageInfo[k] = tmpMerge;
                }
                if (deepCompare($decorator.getPage(pageType).getStore().pageInfo, pageInfo)) { //对比新旧值，相同就不在进行下一步操作
                    // 处理启动广告
                    reject(false)
                    return
                }

            }catch(err){
                reject(err)
                console.log('err',err,pageType)
                return
            }
            resolve(pageInfo)
        });
    };
    
    createPageInfo(pageInfoData, $Route) {
        let curPageType = 10;
        if (typeof $Route == 'object') {
            curPageType =  $decorator.getPageType($Route.path);
        } else if (typeof $Route == 'number') {
            curPageType = $Route;
        } else if (typeof $Route == 'string' && $Route.indexOf('/pages' == 0)) {
            curPageType =  $decorator.getPageType($Route);
        }
        return this.updatePageInfo(pageInfoData, curPageType)
    }
}