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
import store from '@/store'
import * as $utils from '@/common/util.js'
import $api from '@/api'
import $decorator from '@/common/decorator'
import {config} from '@/static/settings'

import {SINGLE_BUY_ACTIVE} from '@/common/variable/activity'
import {getActivityName} from '@/common/helper/goods'

function $toast(info, icon = 'none') {
    info && uni.showToast({
        title: info,
        icon: icon
    })
}

export function getLiverStatus(goods_id) {
    return new Promise((resolve, reject) => {
        if (!goods_id) {
            resolve({
                room_id: '',
                broadcast_room_id: ''
            })
            return
        }
        $api.goodApi.getGoodsLiver({goods_id}, {errorToast: false}).then(res => {
            if (res.error == 0) {
                resolve(res)
            } else {
                resolve({
                    room_id: '',
                    broadcast_room_id: ''
                })
            }
        })
    })
}

export function setShareInfo(res) { //修改公众号分享信息
    if (!$utils.is_weixin()) {
        return
    }
    let shareBase = store.state.setting.systemSetting?.share,
            shareInfo = {};
    let description, logo, title
    if (this.goodDetail.ext_field.title_type == '1') {
        description = this.goodDetail.ext_field.share_description || shareBase.description
        logo = this.goodDetail.ext_field.logo
        title = this.goodDetail.ext_field.title
    } else {
        description = this.goodDetail.sub_name || shareBase.description,
                logo = $utils.mediaUrl(this.goodDetail.thumb),
                title = this.goodDetail.title
    }
    shareInfo = {
        description, logo, title,
        link: res.poster_url,
        sdkUrl: location.href,
    };
    $utils.getShareInfo(shareInfo);
}

/**
 *
 * @param {*} param0
 * @param {*} status
 */
export function tipBeforeOper({
                                  goodsData,
                                  option_id,
                                  type,
                                  is_origin,
                                  ...restOpt
                              }, status) {
    return new Promise((resolve, reject) => {
        // 单规格存在表单时会打开快速购买弹窗加购
        if (goodsData.has_option == 0 && (!goodsData.form_data || status)) {
            resolve()
        } else if (goodsData.has_option == 1 && option_id && status) {
            resolve()
        } else {
            reject({
                errorInfo: "请选择商品规格",
                errorId: 'openPicker',
                type
            })
        }

    })
}

export async function addCart({
                                  goods_id,
                                  option_id,
                                  goodDetail,
                                  total,
                                  buy_num,
                                  activityInfo,
                                  is_origin
                              }) {
    // uni.showLoading({
    //     title: '加载中',
    // })
    try {
        total = await handleLimit.call(this, {
            goodDetail,
            total,
            buy_num,
            activityInfo,
            is_origin
        });

    } catch (err) {
        console.log('addCart???', err)
    }
    // 存在商品表情时校验表单
    let resultParams;
    if (goodDetail?.form_data) {
        try {
            resultParams = await store.dispatch('quickPurchase/validForm')
        } catch (err) {
            console(err)
        }

    }

    return new Promise((resolve, reject) => {
        let cartParams = {
            goods_id,
            option_id,
            total,
            mode: 1,
            is_activity_goods: goodDetail?.is_activity_goods ? goodDetail.is_activity_goods : 0,
        }
        // 补充购物车表单
        if (goodDetail?.form_data && resultParams) {
            cartParams = {
                ...cartParams,
                form_data: resultParams
            }
        }
        $api.goodApi.changeCartNum(cartParams).then(res => {
            uni.hideLoading()
            if (res.error == 0) {
                $toast('成功添加购物车', 'success')
                $decorator.getModule('diymenu').getCartNum(true) //更新购物车数量

            } else {
                uni.showToast({
                    title: res.message || '加入购物车失败',
                    icon: 'none'
                });
            }
            resolve(res)
        }).catch(err => {
            reject(err)
            uni.hideLoading()
        })
    })
}

function isDisabled(value) {
    return typeof value === 'undefined' || value == '0' || value == ''
}

export async function createOrder({
                                      goods_id,
                                      option_id,
                                      total,
                                      liverId,
                                      goodDetail,
                                      detailInfo,
                                      canBuy,
                                      buy_num,
                                      activityInfo,
                                      is_origin,
                                      free_goods_code,
                                      ...restOpt
                                  }) {

    try {
        total = await handleLimit.call(this, {
            goodDetail,
            total,
            buy_num,
            activityInfo,
            is_origin,
            ...restOpt
        });
    } catch (e) {
        // 弹窗限购提示，禁止跳转下单页面
        $toast(e);
        return
    }

    if (goodDetail.stock == 0) {
        $toast('商品已售罄');
        return
    }

    if (store.state.login.isLogin) {
        if (!canBuy) {
            return $toast('您暂时没有购买权限!')
        }
    } else {
        return store.commit('login/setModal', true)
    }

    return new Promise(async (resolve, reject) => {
        // 存储商品、店铺 普通快递/同城配送状态/自提
        let {
            dispatch_intracity,
            dispatch_express,
            dispatch_verify,
            type,
            form_data
        } = detailInfo.data.goods;
        let {
            express_enable,
            intracity_enable,
            verify_enable
        } = detailInfo.intracity;
        let dispatchStatus = {
            dispatch_intracity,
            dispatch_express,
            dispatch_verify,
            express_enable,
            intracity_enable,
            verify_enable
        };
        store.commit('orderCreate/setDispatchStatus', dispatchStatus);
        store.commit('orderCreate/setGoodsInfo', [{
            goods_id,
            option_id: option_id || 0,
            total,
        }]);
        if (type === '0') {
            // 实体商品，校验配送方式
            if ((isDisabled(express_enable) || isDisabled(dispatch_express)) && (isDisabled(intracity_enable) || isDisabled(dispatch_intracity)) && (isDisabled(verify_enable) || isDisabled(dispatch_verify))) {
                $toast('没有可用的配送方式');
                return
            }
        }

        let query = {
            goods_id,
            option_id: option_id || 0,
            total: total || 1,
            type
        }
        // 活动原价购买
        if (is_origin) {
            query.is_origin = '1'
        }

        if (liverId) {
            query.room_id = liverId
        }
        // 判断没有拼团信息清除拼团活动参数
        if (restOpt.extend_params) {
            store.commit('orderCreate/setGroupsInfo', restOpt.extend_params)
        } else {
            store.commit('orderCreate/setGroupsInfo', null)
        }
        // 商品存在表单时，存取商品表单信息
        if (form_data) {
            let resultParams = await store.dispatch('quickPurchase/validForm')
            resultParams.goods_id = goods_id;
            resultParams.option_id = option_id || 0;
            if (this.$utils.is_merchant) {
                resultParams.sub_shop_id = detailInfo?.data?.sub_shop_info?.id
            }
            if (resultParams.form_id) {
                store.dispatch('quickPurchase/sendFormData', resultParams).then((res) => {
                    if (res.error == 0) {
                        resolve()
                        // 跳转订单页面清空表单信息
                        store.commit('form/resetForm')
                        this.$Router.auto({
                            path: '/kdxOrder/create',
                            query
                        })
                    }
                });
            } else {
                resolve()
                // 跳转订单页面清空表单信息
                store.commit('form/resetForm')
                this.$Router.auto({
                    path: '/kdxOrder/create',
                    query
                })
            }
        } else {
            resolve()
            store.commit('form/resetForm')
            this.$Router.auto({
                path: '/kdxOrder/create',
                query
            })
        }
    })
}

// 活动公共单规格限购
const handleActCommonLimit = ({activityInfo, goodDetail, total}, resolve, reject) => {
    let stock = Math.min(activityInfo.activity_stock || 0, goodDetail.stock)
    let {rules: {limit_type, limit_num}, buy_count} = activityInfo
    if (!buy_count) {
        buy_count = 0
    }
    // 判断限购
    if (limit_type != '0') {
        let canbuy = limit_num - buy_count
        if (canbuy - total < 0) {
            reject('购买超过限制')
            return
        }
    }
    // 判断库存
    if (stock > 0) {
        resolve(total)
    } else {
        reject('库存不足')
    }
}

// 拼团活动限购
const handleGroupsLimit = ({activityInfo, goodDetail, total, restOpt}, resolve, reject) => {
    if (activityInfo.has_open && restOpt?.extend_params?.is_join != '1') {
        reject('您已有正在进行的拼团')
        return
    }
    handleActCommonLimit({
        activityInfo,
        goodDetail,
        total
    }, resolve, reject)
}

/**
 * total: 选中的数量
 * max_buy: 总共购买数量
 * buy_num：已经购买数量
 * stock：库存数量
 * */
// 补充拼团下单参数
export const handleGroupParams = (optionsInfo) => {
    let is_join = optionsInfo.is_join == '1' ? '1' : '0'

    let extend_params = {
        is_join,
        is_ladder: '0'
    }

    if (optionsInfo.ladder) {
        extend_params.ladder = params.ladder
    }
    // 参团加入team_id
    if (optionsInfo.team_id) {
        extend_params.team_id = optionsInfo.team_id
    }
    // 活动过期订单
    if (optionsInfo.activity_id) {
        extend_params.activity_id = optionsInfo.activity_id
    }
    return extend_params
}

// 补充拼团下单参数
export const handleGroupFissionParams = (optionsInfo) => {
    let is_join = optionsInfo.is_join == '1' ? '1' : '0'

    let extend_params = {
        is_join
    }

    // 参团加入team_id
    if (optionsInfo.team_id) {
        extend_params.team_id = optionsInfo.team_id
    }
    // 活动过期订单
    // if(optionsInfo.activity_id){
    //     extend_params.activity_id = optionsInfo.activity_id
    // }
    return extend_params
}


export function handleLimit({
                                goodDetail,
                                total,
                                buy_num,
                                activityInfo,
                                is_origin,
                                ...restOpt
                            }) {
    return new Promise((resolve, reject) => {
        // 秒杀不走正常商品限制
        let actName = getActivityName(activityInfo)
        let isActive = SINGLE_BUY_ACTIVE.includes(actName);
        if (isActive && is_origin != '1') {
            let activityFns = {
                seckill: handleActCommonLimit,
                groups: handleGroupsLimit,

            }

            let activityFn = activityFns[actName]
            if (activityFn) {
                activityFn({
                    activityInfo: activityInfo[actName],
                    goodDetail,
                    total,
                    restOpt
                }, resolve, reject)
            }
            return
        }
        resolve(total)
    })
}
