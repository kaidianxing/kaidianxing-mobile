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
export default {
    namespaced: true,
    state: {
        commissionSetting: null,//分销设置项
        status: false
    },
    mutations: {
        setCommissionSetting(state, res) {
            state.commissionSetting = res;
        },
        setCommissionStatus(state, res) {
            state.status = res;
        },
    },
    actions: {
        getCommissionSetting(ctx) {
            return new Promise((resolve, reject) => {
                api.commissionApi.commissionSet().then(res => {
                    resolve(res)
                    if (res.error == 0) {
                        ctx.commit('setCommissionSetting', res)
                    }
                }).catch(err=>{
                    resolve(res)
                })
            })
        },
        getCommissionStatus(ctx) {
            return new Promise((resolve, reject) => {
                api.commissionApi.getCommissionStatus().then(res => {
                    if (res.error == 0) {
                        if (res.is_open == 0) {
                            // 是否开启分销
                            reject('noOpen')
                        } else {
                            api.commissionApi.allCommissionOrder({}, {errorToast: false}).then(res => {

                                if (res.error == 331200) {
                                    reject('noCommission')
                                } else {
                                    resolve(res)
                                }
                            })
                        }
                    } else {
                        reject('noOpen')
                    }
                })
            });
        }

    }
}