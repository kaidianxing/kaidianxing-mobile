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
 * isRequesting & clearRequesting提供短时间内防止重复请求发送的功能；在本次请求完成前，如果再次请求则会复用第一次的请求最终结果；
 */
import request from '../request.js'

class CacheRequest {
    requesting = {};
    isRequesting(requestObj) {//防止短期重复请求
        let { requestParams, data, requestInfo } = requestObj;
        let key = {
            ...data, ...requestInfo, settings: undefined
        }
        let keyData = JSON.stringify(key);
        if (this.requesting[keyData]) {
            return this.requesting[keyData];
        } else {
            this.requesting[keyData] = request[requestParams.method](requestParams.api, data,requestParams.needSession)
            return this.requesting[keyData]
        }
    }
    clearRequesting(requestObj) {//清掉缓存
        let { data, requestInfo } = requestObj;

        let key = {
            ...data, ...requestInfo, settings: undefined
        }
        let keyData = JSON.stringify(key);
        if (this.requesting[keyData]) {
            delete this.requesting[keyData];
        }
    }
}
export const reqCacher = new CacheRequest