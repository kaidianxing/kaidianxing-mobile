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
 * 路由导航守卫各种权限判断
 */
import {
    localStorage
} from "mp-storage";

import store from '@/store'
import $decorator from '@/common/decorator'
import {WHITE_BLANK} from '@/common/variable/route'
import {setClientType} from "../../common/variable/channel";
import {isWx} from '@/common/util'

// 正式路由导航跳转前的各种检测
class Guard {
    sessionId = '';
    systemSetting = {}
    channelStatus = {}
    isClosed = null;
    sdkUrl = '';

    constructor() {
        this.sessionId = localStorage.getItem('session-id')
    }

    // 判断是否是白名单路由
    whiteBlankRoute(to) {
        return WHITE_BLANK.includes(to.path)
    }

    haveSessionId() { //是否有session-id
        if (!this.sessionId) { //用来减少查找时间localStorage.getItem;减少查询操作
            if (!localStorage.getItem('session-id')) {
                store.commit('login/setLogin', false)
            } else {
                this.sessionId = localStorage.getItem('session-id')
            }
        }
        return this.sessionId
    }

    //获取系统设置
    getSysSetting(to) {
        return new Promise(async (resolve, reject) => {
            if (!this.systemSetting?.basic) {
                store.dispatch('setting/getSysSetting').then(config => {
                    this.systemSetting = config;
                    resolve()
                }).catch(err => {
                    if (err.then || err instanceof Promise) {
                        err.catch(error => {
                            if (error?.errMsg?.includes('in domain list')) {
                                uni.showToast({
                                    title: '小程序域名配置错误',
                                    icon: 'none'
                                })
                            }
                        })
                        resolve()
                    } else {
                        resolve()
                        uni.showToast({
                            title: '系统设置错误',
                            icon: 'none'
                        })
                    }
                })
            } else {
                resolve()
            }
        })

    }

    // 管理端是否关闭
    isAdminClose(to,from, next, store) {
        let admin_status = store.state.setting.systemSetting.admin_status
        let mall_status = store.state.setting.systemSetting.basic.mall_status
        console.log(store.state.setting.systemSetting,'store.state.setting.systemSetting')
        if (admin_status == '0' || mall_status == '0') {
            if (to.path == '/kdxOthers/close/close' && from.path === '/kdxOthers/close/close') {
                next(false)
                return true
            }
            else if (to.path == '/kdxOthers/close/close') {
                next()
                return true
            } else {
                next('/kdxOthers/close/close')
                return true
            }
        } else {
            // 开启渠道H5,关闭商城 打开H5会循环调用卡死
            return false
        }
    }

    getChannelStatus() { // 获取渠道设置
        return new Promise((resolve, reject) => {
            if (!this.channelStatus?.wxapp_setting) {
                store.dispatch('setting/getChannelStatus').then(res => {
                    // #ifdef H5
                    let {wechat, h5} = res
                    let status;
                    if (isWx && (wechat == 1 || (wechat == 0 && h5 == 0))) {
                        status = '20'
                    } else if (h5 == 1) {
                        status = '10'
                    }
                    setClientType(status)
                    // #endif
                    this.channelStatus = res
                    if (0 === +res.error) {
                        resolve(res)
                    } else {
                        reject(res)
                    }

                }).catch(err => {
                    uni.showToast({
                        title: err,
                        icon: 'none'
                    })
                })
            } else {
                resolve(this.channelStatus)
            }
        })
    }


}

export default new Guard();
