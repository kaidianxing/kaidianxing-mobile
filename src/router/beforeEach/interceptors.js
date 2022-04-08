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
let cacheNavPage = {};//跳转过的页面的缓存
let interceptors = []; //路由重定向拦截
import store from '@/store'
import settings from '@/static/settings.js'
import {deepCopy} from '@/common/objectTools.js'
import * as utils from '@/common/util.js'
import {client_type} from "@/common/variable/channel";
import {hasBindBySence} from '@/common/helper/user';

//判断是否打烊
function shopIsClosed(to, from) {
    //判断是否打烊
    if (store.state.setting?.closeStatus) {
        if (to.path != '/kdxOthers/close/close') {
            return {
                path: '/kdxOthers/close/close',
                NAVTYPE: 'replace',
                query: {
                    from: 'shopIsClosed'
                }
            }
        } else {
            return to
        }
    }
    return to
}

//判断商城是否关闭
function mallIsClosed(to) {
    let isClosed = false;
    let from = 'mallIsClosed'
    let mall_status = store.state.setting.systemSetting?.basic?.mall_status;
    // #ifdef H5
    let {
        h5,
        wechat
    } = store.state.setting.channelStatus
    let is_wechat = utils.is_weixin();
    // h5
    if ((mall_status == '0' || (!is_wechat &&  h5 == 0)) && to.path !== '/kdxOthers/close/close') {
        isClosed = true
    }
    // wechat
    if (mall_status == '0' || (is_wechat && wechat == 0) && to.path !== '/kdxOthers/close/close') {
        isClosed = true
    }
    // #endif

    //判断商城是否已经关闭
    console.log(isClosed,'isClosed')
    if (isClosed) {
        if (to.path == '/kdxOthers/close/close') {
            return to
        } else {
            return {
                path: '/kdxOthers/close/close',
                NAVTYPE: 'replace',
                query: {
                    from,
                }
            }
        }
    }
    return to
}
function needRedirectToIndex(to) {
    // 判断是否关闭充值
    let recharge_state = store.state.setting.systemSetting.recharge_state
    let rechargeFlag
    // #ifdef MP-WEIXIN
    // 微信小程序上传没有 充值提现
    rechargeFlag = settings?.config?.with_recharge === true && recharge_state !== '0'
    // #endif
    // #ifndef MP-WEIXIN
    rechargeFlag = recharge_state !== '0'
    // #endif
    if (!rechargeFlag) {
        // 充值关闭， 不能进入 充值/余额明细 页面,跳转商城首页
        if (to?.path === '/kdxMember/recharge/index') {
            return {
                path: '/pages/index/index',
                NAVTYPE: 'replace'
            }
        }
        // if (to?.path === '/kdxMember/recharge/index' || (to?.path === '/kdxMember/detail/index' && to?.query?.page === 'balance')) {
        //     reject()
        //     return
        // }
    }
    // 判断是否关闭提现
    let withdraw_state = store.state.setting.systemSetting.withdraw_state
    let withdrawFlag
    // #ifdef MP-WEIXIN
    // 微信小程序上传没有 充值提现
    withdrawFlag = settings?.config?.with_recharge === true && withdraw_state !== '0'
    // #endif
    // #ifndef MP-WEIXIN
    withdrawFlag = withdraw_state !== '0'
    // #endif
    if (!withdrawFlag) {
        // 提现关闭， 不能进入 提现/提现明细 页面,跳转商城首页
        if (to?.path === '/kdxMember/withdraw/index' || to?.path === '/kdxMember/record/index') {
            return {
                path: '/pages/index/index',
                NAVTYPE: 'replace'
            }
        }
    }
    return to
}

function canRoute(to) {
    let {
        isLogin,
    } = store.state.login;
    let len = getCurrentPages().length;
    if (len && to.meta && to.meta.needLogin && isLogin == false) { //需要先登录的页面
        store.commit('login/setModal', true);
        return
    } else if (to.meta?.bindSence && hasBindBySence(to.meta.bindSence)) { //需要先绑定手机的页面
        store.commit('login/setModal', true);
        return
    } else {
        return to
    }
}


/**
 * 页面跳转前会依次检查以下函数的返回值，
 * 函数返回值为空值不会跳转
 * 如需重定向只需要返回{path:'url',query:{data:'xxx'}，NAVTYPE: 'xxx'}格式的对象即可
 *
 * ！！！！！！这里的函数只处理同步函数，异步操作请加到afterEach中！！！！！！
 *
 */
interceptors = {
    0: shopIsClosed,
    1: mallIsClosed,
    2: needRedirectToIndex,
    3: canRoute,
}

/**
 * 递归检验以上函数的结果，直到返回的路由对象不再变化
 * 如果其中一个函数返回了空值就不会继续向下检测
 * @param {} to
 * @param {*} from
 */
function recursor(to, from) {
    let routeFun = null;
    let newTo = deepCopy(to);
    try {
        for (let i in interceptors) {
            routeFun = interceptors[i];
            if (typeof routeFun === 'function') {
                newTo = routeFun(newTo, from);
                if (!newTo || !newTo.path) {
                    break;
                } else if (newTo.path == '/kdxOthers/close/close') {
                }
            }
        }
    } catch (e) {
        console.log(e, '?????????')
    }

    if (newTo && newTo.path != to.path) {
        return recursor(newTo, from)
    } else {
        return newTo
    }
}

export default function (to, from) {
    return new Promise((resolve, reject) => {

        if (cacheNavPage[to.path]) {//已跳转过的页面不再检测
            resolve()
            return
        }
        let route = recursor(to, from);
        // console.log(route,'uuuuuuuuuuuuuuu')
        if (to.path == route.path) {//经过检测，无需重定向
            cacheNavPage[route.path] = route
            resolve()
        } else if (route && route.path) {
            cacheNavPage[route.path] = route
            resolve(route)
        } else {
            reject(route)
        }
    })

}
