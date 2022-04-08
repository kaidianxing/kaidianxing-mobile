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
import $decorator from '@/common/decorator'
import saveSystemForm from '@/components/decorate/templates-shim/formSubmit.js'

function isDisabled(value) {
    return typeof value === 'undefined' || value == '0' || value == ''
}

export default {
    namespaced: true,
    state: {

        // 快速购买专用商品详情
        detailInfo: {},
        // 快速购买专用商品规格
        optionsInfo: {},
        cartChooseInfo: null,
    },
    mutations: {
        setGoodDetail(state, info) {
            state.detailInfo = {
                ...info,
            }
        },
        setOptionsInfo(state, info) {
            state.optionsInfo = {
                ...info,
            }
        },
        setFormContent(state,info){
        },
        setCartChooseInfo(state,info) { // 设置购物车快速购买信息
            state.cartChooseInfo = info
        },

    },
    actions: {
        // 获取快速购买商品数据
        getQuickPurchaseData({ commit, dispatch }, data) {
            if(!data?.goodId){
                return  Promise.reject('no gooid')
            }
            commit('setGoodDetail', {})
            commit('setOptionsInfo', {})
            if(!data.goodId){
                return Promise.reject('no goodId')
            }
            return new Promise((resolve, reject) => {
                api.goodApi
                    .goodDetail({
                        id: data.goodId,
                    })
                    .then((res) => {
                        resolve(res)
                        if (res.error === 0) {
                            if (res?.data?.goods?.has_option !== '0') {
                                // 单规格商品，不需要掉获取商品规格接口
                                dispatch('getGoodOptions', data.goodId)
                            }
                            commit('setGoodDetail', res)
                        } else {
                            uni.showToast({
                                title: res.message || '请求错误',
                                icon: 'none',
                            })
                        }
                    })
            })
        },
        // 获取商品规格
        getGoodOptions({ commit }, goods_id) {
            return new Promise((resolve) => {
                api.goodApi.getGoodOptions({  goods_id}).then((res) => {
                    if (res.error === 0) {
                        resolve()
                        commit('setOptionsInfo', res)
                    }
                })
            })
        },
        // 加购
        addCart(store, { option_id = 0, total }) {
            const { state, dispatch } = store
            // 商品详情
            const detailInfo = state.detailInfo

            return new Promise(async (resolve, reject) => {
                // 检测登录、绑定手机号
                // await dispatch('checkLoginStatus')
                // 单规格
                if (detailInfo?.data?.goods?.has_option === '0') {
                    option_id = 0
                }
                // 判断多规格
                if (detailInfo?.data?.goods?.has_option === '1' && !option_id) {
                    uni.showToast({
                        title: '请选择商品规格',
                        icon: 'none',
                    })
                    return
                }

                let resultParams;

                let cartParams = {
                    goods_id: detailInfo?.data?.goods?.id,
                    option_id,
                    total,
                    mode: 1,
                }

                 // 补充购物车表单
                if(detailInfo.data?.goods.form_data && resultParams) {
                    cartParams = {...cartParams,
                        form_data: resultParams
                    }
                }

                // 补充购物车 重选商品信息
                if(state.cartChooseInfo) {
                   cartParams = {...cartParams, ...state.cartChooseInfo}
                }

                api.goodApi
                    .changeCartNum(cartParams)
                    .then((res) => {
                        if (res.error === 0) {
                            uni.showToast({
                                title: '成功添加购物车',
                                icon: 'none',
                            })
                            $decorator.getModule('diymenu').getCartNum(true)// 更新购物车数量
                            // 判断有表单内容提交表单

                            resolve(res)
                        } else {
                            uni.showToast({
                                title: res.message || '加入购物车失败',
                                icon: 'none',
                            })
                        }
                    })
            })
        },
        // 下单
        createOrder(store, { option_id, total }) {
            let buyTotal = total
            const { state, commit, dispatch, rootState } = store
            // 商品详情
            const detailInfo = state.detailInfo
            const canBuy = detailInfo?.perm?.buy === 1

            return new Promise(async (resolve, reject) => {
                // 检测登录、绑定手机号
                // await dispatch('checkLoginStatus')
                // 单规格
                if (detailInfo?.data?.goods?.has_option === '0') {
                    option_id = 0
                }
                // 判断多规格
                if (detailInfo?.data?.goods?.has_option === '1' && !option_id && detailInfo?.data?.goods?.type != '3') {
                    uni.showToast({
                        title: '请选择商品规格',
                        icon: 'none',
                    })
                    return
                }
                total = await dispatch('handleLimit', { total })
                if (detailInfo?.data?.goods?.stock == 0) {
                    uni.showToast({
                        title: '商品已售罄',
                        icon: 'none',
                    })
                    return
                }
                if (rootState.login.isLogin) {
                    if (!canBuy) {
                        uni.showToast({
                            title: '您暂时没有购买权限',
                            icon: 'none',
                        })
                        return
                    }
                } else {
                    commit('login/setModal', true, { root: true })
                    return
                }
                // 存储商品、店铺 普通快递状态
                let {
                    dispatch_express,
                    type,
                    id,
                } = detailInfo.data.goods
                let { express_enable } = detailInfo.intracity
                let dispatchStatus = {
                    dispatch_express,
                    express_enable,
                }
                commit('orderCreate/setDispatchStatus', dispatchStatus, {
                    root: true,
                })
                store.commit(
                    'orderCreate/setGoodsInfo',
                    [
                        {
                            goods_id: id,
                            option_id: option_id || 0,
                            total,
                        },
                    ],
                    {
                        root: true,
                    }
                )
                if (type === '0') {
                    // 实体商品，校验配送方式
                    if((isDisabled(express_enable)||isDisabled(dispatch_express))) {
                        uni.showToast({
                            title: '没有可用的配送方式',
                            icon: 'none',
                        })
                        return
                    }
                }

                let resultParams;
                // 商品开启系统表单先提交系统表单
                if(detailInfo.data?.goods.form_data){
                  resultParams.goods_id =detailInfo?.data?.goods?.id
                } else {
                    let query = {
                        goods_id: id,
                        option_id: option_id || 0,
                        total : buyTotal || 1,
                        type,
                    }
                    resolve(query)
                }


            })
        },
        checkLoginStatus(store) {
            const { commit, dispatch, rootState } = store
            return new Promise(async (resolve, reject) => {
                // 需要绑定登录
                let isLogin = await dispatch(
                    'login/checkLogin',
                    {},
                    { root: true }
                )
                if (!isLogin) {
                    commit('login/setModal', true, { root: true })
                    return
                }
                resolve()
            })
        },
    },
}
