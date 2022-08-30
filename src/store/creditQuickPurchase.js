import api from '@/api'
import $decorator from '@/common/decorator'
import saveSystemForm from '@/components/decorate/templates-shim/formSubmit.js'
import * as $utils from '@/common/util.js'

function isDisabled(value) {
    return typeof value === 'undefined' || value == '0' || value == ''
}
function $toast(info,icon='none') {
    info && uni.showToast({
        title: info,
        icon: icon
    })
}

export default {
    namespaced: true,
    state: {

        // 快速购买专用商品详情
        detailInfo: {},
        // 快速购买专用商品规格
        optionsInfo: {},
        cartChooseInfo: null,
        // 预约商品选中预约时间段
        appointList: '',
        // 预约商品会员价时间段对象
        appointMemberPrice: {},
        // 预约规格缓存
        chooseOption: []
    },
    mutations: {
        setGoodDetail(state, info) {
            // 设置商品表单数据
            let goodsData = info.data?.goods;
            if (goodsData?.form_data?.content) {
                let content = JSON.parse(goodsData.form_data?.content)
                // 先前填写的表单信息
                let formData = info.data.form_data;
                this.commit('form/setFormContent', formData ? formData : content);
            } else {
                this.commit('form/resetForm')
            }
            state.detailInfo = {
                ...info,
            }
        },
        setOptionsInfo(state, info) {
            state.optionsInfo = {
                ...info,
            }
        },
        setFormContent(state, info) {
        },
        setCartChooseInfo(state, info) { // 设置购物车快速购买信息
            state.cartChooseInfo = info
        },
        setAppointList(state, info) {
            state.appointList = []
            // 保存选中预约时段
            state.appointList = info
        },
        setAppointMemberPrice(state, info) {
            state.appointMemberPrice = []
            state.appointMemberPrice = info
        },
        setChooseOption(state, info) {
            state.chooseOption = info
        },

    },
    actions: {
        // 获取快速购买商品数据
        getQuickPurchaseData({commit, dispatch}, data) {
            if (!data?.goodId) {
                return Promise.reject('no gooid')
            }
            commit('setGoodDetail', {})
            commit('setOptionsInfo', {})
            if (!data.goodId) {
                return Promise.reject('no goodId')
            }
            return new Promise((resolve, reject) => {
                api.creditShopApi.getCreditShopDetail({
                    id: data.goodId,
                })
                    .then((res) => {
                        resolve(res)
                        if (res.error === 0) {
                            if (res?.data?.goods?.has_option === '1') {
                                // 单规格商品，不需要掉获取商品规格接口
                                dispatch('getGoodOptions', data.goodId)
                            }
                            if (+res?.credit_shop?.type === 1) {
                                res.data.goods.thumb = $utils.staticMediaUrl(`creditShop/${+res?.data?.goods?.coupon_sale_type === 1?'full.png':'discount.png'}`)
                                res.data.goods.ext_field = {
                                    show_stock: 1
                                }
                            }
                            commit('setGoodDetail', res)
                        } else {
                            $toast(res.message || '请求错误')
                        }
                    })
            })
        },
        // 获取商品规格
        getGoodOptions({commit}, goods_id) {
            return new Promise((resolve) => {
                api.creditShopApi.getCreditShopOption({id: goods_id}).then((res) => {
                    if (res.error === 0) {
                        resolve()
                        commit('setOptionsInfo', res)
                    }
                })
            })
        },
        // 加购
        addCart(store, {option_id = 0, total}) {
            const {state, dispatch} = store
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
                    $toast('请选择商品规格')
                    return
                }

                let resultParams;
                if (detailInfo.data?.goods.form_data) {
                    resultParams = await dispatch('validForm')
                }

                let cartParams = {
                    goods_id: detailInfo?.data?.goods?.id,
                    option_id,
                    total,
                    mode: 1,
                }

                // 补充购物车表单
                if (detailInfo.data?.goods.form_data && resultParams) {
                    cartParams = {
                        ...cartParams,
                        form_data: resultParams
                    }
                }

                // 补充购物车 重选商品信息
                if (state.cartChooseInfo) {
                    cartParams = {...cartParams, ...state.cartChooseInfo}
                }

                api.goodApi
                    .changeCartNum(cartParams)
                    .then((res) => {
                        if (res.error === 0) {
                            $toast('成功添加购物车')
                            $decorator.getModule('diymenu').getCartNum(true)// 更新购物车数量
                            // 判断有表单内容提交表单
                            resolve(res)
                        } else {
                            $toast(res.message || '加入购物车失败');
                        }
                    })
            })
        },
        // 下单
        createOrder(store, {option_id, total}) {
            const {state, commit, dispatch, rootState} = store
            // 商品详情
            const detailInfo = state.detailInfo
            const canBuy = detailInfo?.perm?.buy

            return new Promise(async (resolve, reject) => {

                if (detailInfo?.data?.goods?.has_option === '0' || +detailInfo?.credit_shop?.type === 1) {
                    option_id = 0
                } else if (detailInfo?.data?.goods?.has_option === '1' && !option_id && detailInfo?.data?.goods?.type != '3') {
                    // 判断多规格
                    $toast('请选择商品规格')
                    return
                }
                if (rootState.login.isLogin) {
                    if (!canBuy) {
                        $toast('您暂时没有购买权限')
                        return
                    }
                } else {
                    commit('login/setModal', true, {root: true})
                    return
                }
                if (detailInfo?.credit_shop?.credit_shop_stock == 0) {
                    $toast('商品已售罄')
                    return
                }

                // 商品类型存储快递方式
                if (+detailInfo?.credit_shop?.type === 0) {
                    // 存储商品、店铺 普通快递/同城配送状态
                    let {dispatch_intracity, dispatch_express, dispatch_verify, type} = detailInfo.data.goods
                    let {express_enable, intracity_enable, verify_enable} = detailInfo.intracity
                    let dispatchStatus = {
                        dispatch_intracity,
                        dispatch_express,
                        dispatch_verify,
                        express_enable,
                        intracity_enable,
                        verify_enable
                    }
                    commit('orderCreate/setDispatchStatus', dispatchStatus, {root: true});

                    if (type === '0') {
                        // 实体商品，校验配送方式
                        if ((isDisabled(express_enable) || isDisabled(dispatch_express)) && (isDisabled(intracity_enable) || isDisabled(dispatch_intracity)) && (isDisabled(verify_enable) || isDisabled(dispatch_verify))) {
                            $toast('没有可用的配送方式')
                            return
                        }
                    }
                }

                store.commit('orderCreate/setGoodsInfo',
                    [{goods_id: detailInfo.credit_shop.id, option_id: option_id || 0, total}],
                    {root: true}
                );

                let resultParams;
                let query = {
                    goods_id: detailInfo.credit_shop.id,
                    option_id: option_id || 0,
                    total: total || 1,
                    type:  detailInfo?.data?.goods?.type || '-1', // 原商品type，优惠券-1
                    credit_good_type: detailInfo.credit_shop.type,
                    plugin: 'creditShop'
                };
                // 商品开启系统表单先提交系统表单
                if (+detailInfo?.credit_shop?.type === 0&&detailInfo.data?.goods?.form_data) {
                    resultParams = await dispatch('validForm')
                    resultParams.goods_id = detailInfo.credit_shop.id;
                    dispatch('sendFormData', resultParams).then(() => {
                        resolve(query)
                    });
                } else {
                    resolve(query)
                }
            })
        },
        checkLoginStatus(store) {
            const {commit, dispatch, rootState} = store
            return new Promise(async (resolve, reject) => {
                // 需要绑定登录
                let isLogin = await dispatch(
                    'login/checkLogin',
                    {},
                    {root: true}
                )
                if (!isLogin) {
                    commit('login/setModal', true, {root: true})
                    return
                }
                resolve()
            })
        },
        // 校验商品表单数据
        validForm(store) {
            return new Promise(async (resolve, reject) => {


                console.log(store.state.detailInfo,'.......');

                let {id} = store.state.detailInfo?.data?.goods?.form_data;
                let content = store.rootState.form.form?.content || [];
                console.log(content)
                let paramsForm = await saveSystemForm({
                    id: id,
                    content
                });
                paramsForm.type = '4';
                paramsForm.old_content = store.state.detailInfo?.data?.goods?.form_data?.content || '';
                resolve(paramsForm)
            })
        },
        // 发送商品表单数据
        sendFormData(store, params) {
            return api.orderApi.submitGoodsForm(params)
        },
    },
}
