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
    reqCacher
} from '@/common/request/cacheRequest'
import PromiseDecorator from "@/common/PromiseDecorator";

/**
 * 本目录下的其他js文件导出的对象合并为这里的allApis，
 * 具体用法:
 *  this.$api.goodApi.editGood({}).then().catch()
 *  errorToast: false
 */
let paths = require.context('./', false, /\/.*\.js$/) //获取当前全部js文件
let allApis = {} //各个模块的路由配置集合
paths.keys().forEach(item => {
    let def = paths(item)
    if (def && item != './add.js') {
        Object.keys(def).forEach(item => {
            def[item] && (allApis[item] = def[item])
        })
    }
})
import interceptor from '../interceptors'

/**
 * 请求前调用该方法，
 *
 * @param {Object} requestObj
 */
const beforeRequest = requestObj => {
    let {
        requestParams,
        data,
        resolve,
        reject,
        requestInfo
    } = requestObj
    let resultObj = {
        next: resolve,
        result: null
    }
    requestInfo.settings = {
        ...requestInfo.settings
    };
    reqCacher
        .isRequesting(requestObj)
        .then(res => {
            resultObj.next = fakeRes => {
                resolve(fakeRes || res)
                reqCacher.clearRequesting(requestObj)
            }
            resultObj.fail = fakeRes => {
                reject(fakeRes || res)
                reqCacher.clearRequesting(requestObj)
            }
            resultObj.result = res
            resultObj.requestInfo = requestInfo
            // 请求后调用该方法
            interceptor.afterRequest(resultObj)
        })
        .catch(res => {
            resultObj.next = fakeRes => {
                reject(fakeRes || res)
                reqCacher.clearRequesting(requestObj)
            }
            resultObj.result = res
            resultObj.requestInfo = requestInfo
            // 请求后调用该方法
            interceptor.afterRequest(resultObj)
        })

}
/**
 * 自定义接口请求方法
 * 最终调用者使用方法为
 * apiModuleName.apiName(data).then().catch()
 * requestId 只是一个请求的标识，没用其他用处，会在afterRequest的返回对象中返回；主要用来区分请求的来源
 */
const axios = function () {
    let that = this
    //获取key值数组
    let keys = Object.keys(allApis)
    //遍历allApis一级属性
    keys.forEach(item => {
        //降属性值付给this
        that[item] = {}
        //一整个模块的全部api信息
        let childApiObject = allApis[item]
        //获取二级属性
        let childApiObjectKeys = Object.keys(childApiObject)
        //遍历二级属性
        childApiObjectKeys.forEach(key => {
            that[item][key] = (data, settings) => {
                let requestParams = childApiObject[key] ?
                    childApiObject[key] : {}
                return new PromiseDecorator(
                    new Promise((resolve, reject) => {
                        //获取请求参数对象
                        if (
                            requestParams.method == "get" ||
                            requestParams.method == "post" ||
                            requestParams.method == "upload" ||
                            requestParams.method == "download" ||
                            requestParams.method == "file"
                        ) {
                            if (typeof interceptor.beforeRequest == "function") {
                                interceptor.beforeRequest({
                                    next: () => {
                                        beforeRequest({
                                            requestParams,
                                            data,
                                            resolve,
                                            reject,
                                            requestInfo: {
                                                moduleName: item,
                                                apiName: key,
                                                data: requestParams,
                                                settings,
                                            },
                                        });
                                    },
                                    requestParams,
                                    data,
                                });
                            } else {
                                beforeRequest({
                                    requestParams,
                                    data,
                                    resolve,
                                    reject,
                                    requestInfo: {
                                        moduleName: item,
                                        apiName: key,
                                        data: requestParams,
                                        settings,
                                    },
                                });
                            }
                        } else {
                            reject(new Error("请求方式有误"));
                        }
                    }),
                    {setting: {...requestParams, data: {...data}}}
                );
            }
        })
    })
}
export default new axios()