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
import * as util from './util'
import getSessionId from './request/getSessionId.js'
let settings = require('@/static/settings.js').config
import { localStorage } from 'mp-storage'
/**
 * 实现类似axios的请求方法
 */
import axios from './request/myAxios'
import { client_type } from './variable/channel'
let request = {}
/**
 *  post 请求
 * @param apiPath 路由
 * @param params 参数
 */
request.post = (apiPath = '', params = {}, needSession = true) => {
    let url = util.getFullPath(apiPath)
    if (
        process.env.NODE_ENV == 'development' &&
        process.env.VUE_APP_PLATFORM == 'h5'
    ) {
        url = url.replace(settings.base_url, '')
    }
    return new Promise(async (resolve, reject) => {
        // 获取sessionId，在./request/myAxios.js中将sessionId写入请求头
        try {
            if (needSession) {
                await getSessionId()
            }
            axios.post(url, params)
                .then(result => {
                    resolve(result.data)
                })
                .catch(res => {
                    reject(res)
                })
        } catch (e) {
            reject(e)
        }
    })
}

/**
 *  get 请求
 * @param apiPath 路由
 * @param params 参数
 */
request.get = (apiPath = '', params = {}, needSession = true) => {
    let url = util.getFullPath(apiPath, params)
    if (
        process.env.NODE_ENV == 'development' &&
        process.env.VUE_APP_PLATFORM == 'h5'
    ) {
        url = url.replace(settings.base_url, '')
    }
    return new Promise(async (resolve, reject) => {
        try {
            // 获取sessionId，在./request/myAxios.js中将sessionId写入请求头
            if (needSession) {
                await getSessionId()
            }
            axios.get(url)
                .then(result => {
                    resolve(result.data)
                })
                .catch(res => {
                    reject(res)
                })
        } catch (e) {
            reject(e)
        }
    })
}
request.upload = (apiPath, file) => {
    let url = util.getFullPath(apiPath, file)

    if (
        process.env.NODE_ENV == 'development' &&
        process.env.VUE_APP_PLATFORM == 'h5'
    ) {
        url = url.replace(settings.base_url, '')
        url = 'api/' + url
    }
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: url,
            name: 'file',
            header: {
                'Session-Id': localStorage.getItem('session-id') || '',
                'Client-Type': client_type,
            },
            filePath: file,
            formData: {
                type: 10 // 10 图片 20 视频 30 音频
            }
        }).then(res => {
            resolve(JSON.parse(res[1].data))
        }).catch(res => {
            console.log(res);
        })
    })
}

request.file = (apiPath, { fileData, formData }) => {
    let url = util.getFullPath(apiPath)
    if (
        process.env.NODE_ENV == 'development' &&
        process.env.VUE_APP_PLATFORM == 'h5'
    ) {
        url = url.replace(settings.base_url, '')
        url = 'api/' + url
    }
    for (let k in fileData) {
        return uni.uploadFile({
            url: url,
            name: k,
            header: {
                'session-id': localStorage.getItem('session-id') || ''
            },
            filePath: fileData[k],
            formData
        })
    }
}
request.download = (apiPath, params = {}) => {
    let url = util.getFullPath(apiPath, params)

    if (
        process.env.NODE_ENV == 'development' &&
        process.env.VUE_APP_PLATFORM == 'h5'
    ) {
        url = url.replace(settings.base_url, '')
        url = 'api/' + url
    }
   
    return uni.downloadFile({
        url: url,
        header: {
            'session-id': localStorage.getItem('session-id') || '',
            'client-type': client_type
        }
    })
}
export default request
