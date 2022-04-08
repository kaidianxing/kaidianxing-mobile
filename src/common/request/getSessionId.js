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
 * 实现类似axios的请求方法
 */
import axios from './myAxios';
import store from 'store/index.js'
import * as util from '../util.js';
import {router} from "@/router";
import { localStorage, sessionStorage } from 'mp-storage'
import { MALL_CLOSE_CODE } from '@/common/variable/statusCode'
let bar = null;
/**
 * 专门用于处理sessionId的请求与处理
 */
const getSessionId = () => new Promise((resolve, reject) => {
    let sessionId = localStorage.getItem('session-id');
    //所属店铺数据不存在就重新请求 
    if (!sessionId) {
        store.commit('login/setLogin', false)
        // 判断是否正在请求sessionId,false是没有正在请求
        if (!store.state.isRequestingSessionId) {
            // 设为正在请求sessionId,
            store.commit('setIsRequestingSessionId', true);
            //获取完整的请求路由
            let url = util.getFullPath('/member/index/get-session-id');

            if (process.env.NODE_ENV == "development" && process.env.VUE_APP_PLATFORM == "h5") {
                url='/member/index/get-session-id'
            } 
            axios.post(url).then(res => {
                // 请求sessionId完毕
                let { error,data,message } = res.data
                if (error === 0) {
                    localStorage.setItem('session-id', data['session-id'])
                    resolve(data['session-id']);
                } else {
                   if (MALL_CLOSE_CODE.includes(error)) {
                    message && uni.showToast({icon:'none',title:message})
                    store.commit('setting/setCloseStatus',true)
                   
                    router.replace({
                        path: '/kdxOthers/close/close',
                        query:{
                            from:'getSessionId',
                            error
                        }
                    })
                   }
                    reject(res.data)
                }
                
                store.commit('setIsRequestingSessionId', false);
            }).catch(err => {
                reject(err); 
            })
        } else {
            clearTimeout(bar);
            bar = setTimeout(() => {
                store.commit('setIsRequestingSessionId', false);
                if (!store.state.sessionId) {
                    reject({
                        error: '请求超时'
                    });
                } else {
                    resolve('')
                }
            }, 5000)
        }

    } else {
        resolve(sessionId);
    }

})

let promiser = null;
function getPromiser() {
    let sessionId = localStorage.getItem('session-id');
    let hasPromise = sessionStorage.getItem('promiser')

    if (sessionId) {
        return
    }
    
    if (hasPromise != '1') {
        sessionStorage.setItem('promiser',1)
        promiser = getSessionId()
    }
    return promiser;
}
export default getPromiser