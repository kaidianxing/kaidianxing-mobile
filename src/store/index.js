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
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
import api from '@/api'
import { sessionStorage } from 'mp-storage'
let paths = require.context('./', false, /\/.*\.js$/); //获取当前全部路由
let modules = {}; //各个模块的集合
let moduleName = [];
paths.keys().map(item => { //获取本级目录下的全部配置参数
    if (item != './index.js') {
        moduleName.push(item.replace(/(\.\/|\.js)/g, ''));
        return paths(item).default;
    }
    return '';
}).filter(item => item).forEach((item, index) => {
    modules[moduleName[index]] = item;
});
Vue.use(Vuex);
const store = new Vuex.Store({
    plugins: [createPersistedState({
        storage: sessionStorage,
    })],
    modules: {
        ...modules, //文件名即为模块名
    },
    state: {
        requestInfo: {
            error: 0,
            message: ''
        },
        curRoute: {
            path: '',
            query: {}
        },
        sessionId: '',
        isRequestingSessionId: false,
        shopSession: {},
        areaBottom: 0,
        windowHeight: '100%',
        showNewGiftsFlag: false, // 首页是否显示过新人送礼弹窗
        liverCode: {
            visible: false,
            liverId: '',
            broadId: ''
        },
        isFirst: true,
        shopWxCode: '',
        showWxCode: false,
        showWxcodeType: '',
        topmenuPageID: null, // 顶部菜单分享tab页面ID缓存
    },
    mutations: {
        setRequestInfo(state, info) {
            state.requestInfo = info;
        },
        setCurRoute(state, route) {
            state.curRoute = route;
        },
        setIsRequestingSessionId(state, val) {
            state.isRequestingSessionId = val;
        },
        setSessionId(state, val) {
            state.sessionId = val;
        },
        setShopSession(state, val) {
            state.shopSession = val;
        },
        getDeviceSet(state) {
            let res = uni.getSystemInfoSync();
            // #ifndef H5
            let {
                model,
                screenHeight,
                safeArea: {
                    bottom
                }
            } = res
            model = model.replace(' ', '').toLowerCase();
            let isIphone=/iphone(\d+)/i.exec(model); //iphone11以上
            if (model.indexOf('iphonex') != -1 || isIphone?.[1]>=11) {
                state.areaBottom = screenHeight-bottom-6;
            }
            if (model.indexOf('iphonexs max') != -1) {
                state.areaBottom = screenHeight-bottom-6;
            }
            // #endif

            // #ifdef H5
            let {
                safeAreaInsets: {
                    bottom
                }
            } = res
            state.areaBottom = bottom;
            // #endif

        },
        setShowNewGiftsFlag(state, val) {
            state.showNewGiftsFlag = val;
        },
        setLiverCode(state, { liverId, broadId }) {
            state.liverCode = {
                visible: true,
                liverId,
                broadId
            }
        },
        closeLiverCode(state) {
            state.liverCode = {
                visible: false,
                liverId: '', broadId: ''
            }
        },
        setFirstLoad(state, status) {
            state.isFirst = status
        },
        changeWxCode(state, {status,type="wx_service"}) {
            state.showWxCode = status
            state.showWxcodeType = type
        },
        setWxCode(state, img) {
            state.shopWxCode = img
        },
        setTopmenuPageID(state, data) {
            state.topmenuPageID = data
        },
    },
    actions: {
        getWxCode(ctx) {
            if(this.shopWxCode) {
                return Promise.resolve(this.shopWxCode)
            }
            return new Promise((resolve, reject) => {
                api.settingApi.getWxCode().then(res => {
                    if (res.error === 0) {
                        ctx.commit('setWxCode', res.url)
                        resolve(res.url)
                    } else {
                        reject()
                    }
                }).catch(err=>{
                    reject(err)
                })
            })

        }
    },
    getters: {
        getRequestInfo(state) {
            return {
                routeInfo: state.curRoute,
                ...state.requestInfo
            }
        },
        showNewGiftsFlag: state => state.showNewGiftsFlag,
        liverCode: state => state.liverCode,
        shopWxCode: state => state.shopWxCode,
        showWxCode: state => state.showWxCode,
        showWxcodeType: state => state.showWxcodeType,
    }
})

export default store
