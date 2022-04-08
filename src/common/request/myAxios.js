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
 * axios默认配置
 */
import {
    localStorage,
    sessionStorage
} from 'mp-storage'
let settings = require('@/static/settings.js').config
import flatten from '../../assets/jsTools/flatter'
import * as utils from '@/common/util.js'
import { client_type } from '../variable/channel'

/**
 * 实现类似axios的请求方法
 */
import Http from '../../components/luch-request_1.0.5/request'
let axios = new Http();
let inviter_id = '';
axios.setConfig((config) => {
    /* 设置全局配置 */
    //#ifdef H5
    let location = utils.getRouteParams(window.location.href);// 这里是PC端预览功能
    // 不需要修改base_url
    // if (location.query.id) {
    //     settings.base_url = utils.addRouteParams(settings.base_url, {
    //         id: location.query.id
    //     })
    // }
    if (location.query['inviter-id']) { //分销以及关注海报中的二维码链接包含inviter-id用于绑定上下线关系
        inviter_id = location.query['inviter-id']
        config.header = {
            ...config.header,
            'inviter-id': location.query['inviter-id']
        }
    }
    //#endif
    try {
        config.baseUrl = settings ?.base_url
        //#ifdef H5
        config.baseUrl = window.base_url || settings ?.base_url
        //#endif
    } catch (e) {
        config.baseUrl = settings ?.base_url
    }

    config.header = {
        ...config.header,
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }

    // config.custom = { auth: true }
    return config
});
// 请求拦截
//注意请求头中不能有null或undefined的存在，不然会报错
axios.interceptor.request(
    (config, cancel) => {
        inviter_id = sessionStorage.getItem('inviter-id') || inviter_id
        config.header['session-id'] = localStorage.getItem('session-id') || '';

        // 添加分销商邀请id
        if (inviter_id) {
            config.header['inviter-id'] = inviter_id
        }

        // if (localStorage.getItem('member_id') !== '') {
            /* config.header['inviter-id'] = localStorage.getItem('member_id') || ''*/
            /*config.header['activity-inviter-id'] = localStorage.getItem('member_id') || ''*/
        // }

        config.header['client-type'] = client_type
        // #ifdef H5 
        if (process.env.NODE_ENV == "development" && process.env.VUE_APP_PLATFORM == "h5") {
            // config.baseUrl = 'api/client'
            // config.baseUrl = '/api/shop'
            config.baseUrl = '/api'
        }

        // #endif
        config.data = flatten(config.data)
        return config
    },
    err => {
        //请求失败
        return Promise.reject(err);
    });

// 响应拦截
axios.interceptor.response((response) => {
    // 返回进入拦截成功
    return Promise.resolve(response);
}, function(error) {
    // 返回进入拦截失败
    return Promise.reject(error);
});

export default axios;