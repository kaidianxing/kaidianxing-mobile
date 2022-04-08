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
import * as utils from '@/common/util.js'
export default {
    namespaced: true,
    state: {
        memberInfo: {
            basicInfo: [
                {
                    label: '头像',
                    img: ''
                },
                {
                    label: '昵称',
                    content: ''
                }
            ],
            bindMobile: [
                {
                    label: '手机号',
                    content: ''
                },
                {
                    label: '登录密码',
                    content: ''
                }
            ],
            otherInfo: [
                {
                    label: '出生日期',
                    content: ''
                },
                {
                    label: '所在城市',
                    content: ''
                }
            ]
        }
    },
    actions: {
        getBasicInfo(ctx) {
            api.memberApi.getUserInfo().then(res => {
                if (res.error == 0) {
                    let data = res.data
                    let basicInfo = [
                        {
                            label: '头像',
                            content: '未设置',
                            img: utils.mediaUrl(data.avatar),
                            type: 'nav', //nav：路由跳转，''：无功能
                            id: 'changeAvart',
                            path: ''
                        },
                        {
                            label: '昵称',
                            content: data.nickname,
                            type: 'nav', //nav：路由跳转，''无功能
                            id: 'changeNickname',
                            path: '/kdxMember/memberInfo/changeNickname',
                            query: {
                                nickname: data.nickname
                            }
                        }
                    ]
                    // 处理绑定手机号逻辑
                    let params = {}
                    if(data.mobile){
                        params = {
                            path: '/kdxMember/bindTel/index',
                            query: {mobile:data.mobile}
                        }
                    } else {
                        params.event = 'clickMobile'
                    }

                    let bindMobile = [
                        {
                            label: '手机号',
                            type: 'nav',
                            content: !data.mobile ? '未设置' : data.mobile,
                            color: !data.mobile ? '#FF3C29' : '#212121',
                           ...params
                        },
                        {
                            label: '登录密码',
                            type: 'nav',
                            content: data.has_password==1 ? '已设置' : '未设置',
                            color: data.has_password==1 ? '#09C15F' : '#FF3C29',
                            event: 'clickPass', //nav：路由跳转，''无功能
                        }
                    ]

                    let otherInfo = [
                        {
                            label: '出生日期',
                            content: data.birth_year
                                ? `${data.birth_year}-${data.birth_month}-${data.birth_day}`
                                : '',
                            type: 'nav', //nav：路由跳转，''：无功能
                            id: 'changeBirthday'
                        },
                        {
                            label: '所在城市',
                            content: data.province
                                ? `${data.province || ''} ${data.city ||
                                      ''} ${data.area || ''}`
                                : '',
                            type: 'nav', //nav：路由跳转，''无功能
                            id: 'changeCity'
                        }
                    ]
                    let form = {
                        id: data.form?.id,
                        content: data.form?.content ? JSON.parse(data.form.content) : ''
                    }
                    ctx.commit('setMemberInfo', {
                        basicInfo,
                        bindMobile,
                        otherInfo,
                        user:data
                    })
                    // 当不是选择图片时进行刷新
                    if (!ctx.rootState.form.isChooseImage) {
                        ctx.commit('form/setForm', form, {root: true})
                        ctx.commit('form/setIsChooseImage', false, {root: true})
                    }
                }
            })
        },
        async changeUserInfo(ctx) {
            let { basicInfo, bindMobile, otherInfo } = ctx.state.memberInfo
            let [year, month, day] = otherInfo[0].content.split('-')
            let [province, city] = otherInfo[1].content.split(' ')

            return api.memberApi.changeUserInfo({
                avatar: basicInfo[0].img,
                nickname: basicInfo[1].content,
                birth_year: year || '',
                birth_month: month || '',
                birth_day: day || '', //
                province: province, //
                city: city || '' //
            })
        },
        // 发送购物奖励
        sendShoppingReward({ commit }, order_id) {
            return new Promise((resolve, reject) => {
                api.memberApi.sendShoppingReward({
                    order_id,
                }, {
                    errorToast: false
                }).then(res => {
                    if (res.error == 0) {
                        const { send_type, coupon_info, credit, balance, log_id, reward_array, popup_type } = res
                        if(res.red_package) {
                            const red_package = JSON.parse(res.red_package)
                            resolve({ send_type, coupon_info, credit, balance, red_package, log_id, reward_array, popup_type})
                        } else {
                            resolve({ send_type, coupon_info, credit, balance, log_id, reward_array, popup_type })
                        }

                    } else {
                        resolve({})
                    }
                })
            })
        },
    },
    mutations: {
        setMemberInfo(state, data) {
            state.memberInfo = data
        },
    },
    getters: {}
}
