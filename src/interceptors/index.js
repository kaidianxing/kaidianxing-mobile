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

import store from '../store';
import eventBus from '@/common/eventBus.js'
import { hasBindBySence } from '@/common/helper/user';
let needPending = false;
/**
 * 请求拦截;
 * beforeRequest 请求前拦截
 * afterRequest  请求后拦截
 */
const interceptor = {
    beforeRequest: null,
    afterRequest: null
}
/**
 * 请求前拦截，调用next方法继续下一步请求
 * requestParams接口信息
 * data 请求的参数
 */
interceptor.beforeRequest = ({
    next, requestParams, data
}) => {
    new Promise((resolve, reject) => {
        let { isLogin } = store.state.login
        // 获取
        let sence = requestParams.bindSence 
        // 判断api是否登录
        if (requestParams.needLogin && isLogin == false) {
            store.commit('login/setModal', true)
            store.commit('login/setPendings', resolve)
        }
        // 判断api是否需要绑定手机号
        else if (hasBindBySence(sence)) {
            store.dispatch('login/checkLogin').then(res => {
                if (res) {
                    store.commit('login/setModal', true)
                    store.commit('login/setPendings', resolve)
                }
            })
        } else {
            resolve()
        }
    }).then(() => {
        next()
    })
}
/**
 * 请求后拦截，调用next方法继续返回值
 * result 请求的结果
 * requestId 只是一个请求的标识，没用其他用处，会在afterRequest的返回对象中返回；
 * requestId 主要用来区分请求的来源,可以拼接页面路由上去
 */
interceptor.afterRequest = ({ next, result, requestInfo }) => {
    if (result?.error != '0') {
        store.commit('setRequestInfo', { result, requestInfo })
    } else if (result?.error == '0') {
        store.commit('setRequestInfo', { result: { error: 0 }, requestInfo })
    }
    next()
};
export default interceptor;