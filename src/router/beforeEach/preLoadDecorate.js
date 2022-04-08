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
let cacheRequesting = {} //正在请求的接口不再重复请求
let cacheUpdating = '' //重定向的页面只更新一次
import $decorator from '@/common/decorator'
import preloader from './preLoadData'
import * as utils from '@/common/util.js'

/**
 * 预加载装修数据
 * @param {} to
 */
let cacheQueryParams = {}

export default function(path, query = {}, forceRefresh = false) {
    preloader({//用于装修页面的数据预请求
        path,
        query,
    })
    let status = false
    // #ifdef H5
    status = cacheUpdating == path
    // #endif

    if (status && !forceRefresh) return
    cacheUpdating = path;

    $decorator.setCurPagePath({
        path,
        query
    })
    let pathType = $decorator.getPageType(path);
    return new Promise((resolve, reject) => {
        if (cacheRequesting[pathType] !== true || forceRefresh||pathType==0) { 
            cacheRequesting[pathType] = true;
            //装修数据预加载 
            $decorator.getDecorateModel({
                pagePath: path,
                otherdata:query,
                forceRefresh
            }).then(res => {
                resolve(res)
            }).catch(() => { //如果请求失败了就再次可以请求
                cacheRequesting[pathType] = false;
                resolve()
            })
        } else {
            resolve()
        }
    })


}