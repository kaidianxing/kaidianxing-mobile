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

import $decorator from '@/common/decorator'
import api from '@/api'
export default {
    namespaced: true,
    state: {
        registForm: null,
        user: {},
        bind_user: {},
        bind_mobile: null,
        isSkip: false,
        isLogin: null,
        isBind: null,
        isNeedBind: null,
        pendingApis: [],
        userInfo: {},
        subcriber:{},//
        oldLength: null, // 跳转前路由栈数量
        loginVisible: false,
        phoneVisible: false,
        mobileSubs: {}
    },
    mutations: {
        setOldLength(state, len) {
            state.oldLength = len
        },
        setPendings(state, api) {
            state.pendingApis.push(api)
        },
        checkApis(state, api) {
            state.pendingApis.forEach(next => {
                next && next();
            })
            state.pendingApis = [];
        },
        // 设置注册表单填写信息
        setRegistData(state, data) {
            state.registForm = {
                ...data
            }
        },
        clearRegistData(state) {
            state.registForm = null
        },
        // 设置绑定冲突用户信息
        setBindUser(state, info) {
            ['user', 'bind_mobile', 'bind_user'].forEach(k => {
                state[k] = info[k]
            })
        },
        // 设置用户信息
        setUserInfo(state, info) {
            if(state.userInfo != info){
                state.userInfo = {...state.userInfo,...info}
            }
        },
        clearBindUser(state) {
            let emptyObj = {
                user: {},
                bind_user: {},
                bind_mobile: null
            }
            state = {
                ...state,
                ...emptyObj
            }
        },
        startSkip(state, status) {
            if(state.isSkip != status){
                state.isSkip = status
            }
        },
        setSubscriber(state,{name,fun}){
            state.subcriber[name]=fun
        },
        setPhoneSub(state, {name,fun}){
            state.mobileSubs[name] = fun
        },
        // 设置登录状态
        setLogin(state, isLogin) {
            if (state.isLogin != isLogin) {
                state.isLogin = isLogin;
                if (isLogin) {
                    for(let k in state.subcriber){
                        if(typeof state.subcriber[k]=='function'){
                            state.subcriber[k]()
                            this.commit('login/setSubscriber', {name:k,fun:null})
                        }
                    }
                    this.commit('login/checkApis')
                }
            }
            
            if(isLogin && state.loginVisible ){
                state.loginVisible = false
            }
        },
        // 设置手机绑定状态
        setBind(state, isBind) {
            if(state.isBind != isBind){
                state.isBind = isBind

                if(isBind){
                    for(let k in state.mobileSubs){
                        if(typeof state.mobileSubs[k]=='function'){
                            state.mobileSubs[k]()
                            this.commit('login/setPhoneSub', {name:k,fun:null})
                        }
                    }
                }
            }
            
        },
        // 设置是否强制绑定手机号
        setNeedBind(state, needBind) {
            if(state.isNeedBind != needBind){
                state.isNeedBind = needBind
            }
            
        },
        // 设置模态框状态
        setModal(state, status) {
            if(status === true) {
                if(!state.isLogin){
                    state.loginVisible = true
                } else {
                    state.phoneVisible = true
                }
            } else {
                state.loginVisible = false;
                state.phoneVisible = false
            }
        }
    },
    actions: {
        checkLogin({ commit,state }) {
            //  防止session-id丢失，导致登录状态不能更新，所以每次请求
            return new Promise((resolve, reject) => {
               
                api.loginApi.checkLogin().then(res => {
                    if (res.error === 0) {
                        if (res.success == 0) {
                            resolve(false)
                            $decorator.getModule('followbar').closeFollowbar(10)
                        } else {
                            resolve(true)
                            if(!this.userInfo?.id) {
                                commit('setUserInfo',{
                                    id: res.member_id
                                })
                                $decorator.getModule('followbar').closeFollowbar(10)
                            } 
                        }

                        commit('setLogin', res.success == 0 ? false : true)
                        commit('setNeedBind', res.bind_method == 2 ? true : false)
                    } else {
                        reject(false)
                    }
                }).finally(()=> {
                    uni.hideLoading()
                })
            })
        }
    },
    getters: {
        registForm: state => state.registForm,
        user: state => state.user,
        bind_user: state => state.bind_user,
        bind_mobile: state => state.bind_mobile,
        isSkip: state => state.isSkip,
        isLogin: state => state.isLogin,
        isBind: state => state.isBind,
        userInfo: state => state.userInfo,
        loginVisible: state => state.loginVisible,
        phoneVisible: state => state.phoneVisible
    }
}