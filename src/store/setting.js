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
import api from '@/api'
let config = require('../static/settings').config

import * as utils from '@/common/util.js'
import Vue from 'vue'
import ThemeContext from '../components/theme/theme.js'
export default {
    namespaced: true,
    state: {
        systemSetting: {},
        cacheLoadingImg: '',
        channelStatus: {},
        closeStatus: false,
        avatar: '',
        configSettings: config,
        shopStorage: {
            attachmentUrl: '',
            attachmentSuffix: ''
        },
        login_bg_path: '',
        locationPosition: '', //获取定位经纬度
        showCity: '', // 用户选中自己位置
        wapUrl: '', // h5地址
        theme_color: 'default', // 主题色
        wxSignUrl: '',
        noticeTemId: []
    },
    mutations: {
        setAvatar(state, url) {
            state.avatar = url
        },
        setSystemSetting(state, res) {
            state.systemSetting = {
                ...res,
                credit_text: "积分",
                balance_text: "余额"
            };
            state.wapUrl = res.shop_domain;
            state.theme_color = res.theme_color
        },
        setCacheLoadingImg(state, src) {
            state.cacheLoadingImg = src
        },
        setChannelStatus(state, res) {
            state.channelStatus = res
        },
        setCloseStatus(state, status) {
            state.closeStatus = status
        },
        setShopStorage(state, res) {
            let { storage } = res;
            // 店铺时独立存储20时赋值
            state.shopStorage.attachmentUrl = 20 === +storage?.storage_model ? res?.shop_attachment_url : '';
            if (storage?.type !== 'local' && 20 === +storage?.storage_model && 1 === +storage?.[storage.type]?.image_compression) {
                state.shopStorage.attachmentSuffix = storage?.[storage.type]?.image_compression_rule?.rule;
            } else {
                state.shopStorage.attachmentSuffix = '';
            }
        },
        // 登录图片临时缓存地址
        setPath(state, res) {
            state.login_bg_path = res
        },
        // 用户经纬度设置
        setLocationPosition(state, res) {
            state.locationPosition = res
        },
        // 用户地址修改
        setShowCity(state, res) {
            state.showCity = res
        },
        setWechatSignUrl(state, wxSignUrl) {
            // 关键点
            // IOS仅记录第一次进入页面时的URL
            // IOS微信切换路由实际URL不变，只能使用第一进入页面的URL进行签名
            if (state.wxSignUrl !== '') {
                return;
            }
            state.wxSignUrl = wxSignUrl;
        },
        // 设置消息提醒模板
        setNoticeTemId(state, data) {
            state.noticeTemId = data ?? []
        },
    },
    actions: {
        getSysSetting(ctx) {
            // 获取登录弹窗图片
            ctx.dispatch('getLoginImg')
            return new Promise((resolve, reject) => {
                api.settingApi.getSysSetting().then(res => {
                    if (res.error == 0) {
                        // 获取懒加载图片
                        ctx.dispatch('getLoadingImg', res.basic.loading)
                        ctx.commit('setSystemSetting', res);
                        // 店铺独立存储
                        ctx.commit('setShopStorage', res)
                        resolve(res)
                    } else {
                        // 当渠道没有权限时
                        let path = Vue.prototype.$Route.path;
                        if (res.error === -10004) {
                            ctx.commit('setSystemSetting', { plugins: '' });
                            if (path !== '/kdxOthers/close/close') {
                                //#ifdef H5
                                Vue.prototype.$Router.replaceAll({
                                    path: '/kdxOthers/close/close'
                                })
                                //#endif
                                //#ifndef H5
                                Vue.prototype.$Router.replaceAll({
                                    path: '/kdxOthers/close/close',
                                })
                                //#endif
                            }
                        }
                        reject(res)
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        },
        getLoginImg(ctx) { // 获取登录弹窗图片
            // 登录图片处理
            // #ifndef H5
            uni.downloadFile({
                url: utils.staticMediaUrl('login/style1.png'),
                success: (res) => {
                    if (res.statusCode == 200) {
                        ctx.commit('setPath', res.tempFilePath)
                    }
                }
            });
            // #endif
            // #ifdef H5
            uni.getImageInfo({
                src: utils.staticMediaUrl('login/style1.png'),
            });
            // #endif
        },
        getLoadingImg(ctx, imgSrc) {  // 获取懒加载图
            let loadingSrc;
            if (imgSrc) {
                loadingSrc = utils.mediaUrl(imgSrc)
            } else {
                loadingSrc = utils.staticMediaUrl('decorate/goods_col2.png')
            }
            uni.downloadFile({
                url: loadingSrc, //图片地址
                success: (res) => {
                    if (res.statusCode == 200) {
                        ctx.commit('setCacheLoadingImg', res.tempFilePath)
                    }
                }
            })
        },

        getChannelStatus(ctx) {
            return new Promise((resolve, reject) => {
                api.settingApi.getChannelStatus().then(res => {
                    if (res.error == 0) {
                        ctx.commit('setChannelStatus', res)
                        resolve(res)
                    } else {
                        reject(res.message)
                    }
                }).catch((err) => {
                    reject(err)
                })
            })
        },
        // 获取消息订阅模板信息
        getWxappIds(ctx) {
            return new Promise((resolve, reject) => {

                api.othersApi.getWxappNoticeTemId({errorToast: false}).then(res => {
                    if (res.error == 0) {
                        ctx.commit('setNoticeTemId', res.data)
                        resolve(res)
                    } else {
                        resolve(res.message)
                    }
                }).catch((err) => {
                    reject(err)
                })
            })
        }
    },
    getters: {
        // 判断上传小程序时是否勾选了插件
        hasConfigSetting: state => (pluginName) => {
            // #ifdef MP-WEIXIN
            return state.configSettings[pluginName] === true
            // #endif
            // #ifndef MP-WEIXIN
            return true
            // #endif
        },
        getThemeColor: state => ThemeContext[state.theme_color || 'default'] ||{}
    }
}
