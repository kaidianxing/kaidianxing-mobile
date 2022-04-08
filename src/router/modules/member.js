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

const member = [
    {
        path: '/kdxMember/address/list',
        name: 'member_address',
        meta: {
            title: '地址管理',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/address/index',
        name: 'member_add',
        meta: {
            title: '新建收货地址',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/index/index',
        name: 'member_vipCenter',
        meta: {
            title: '会员中心'
        },
        beforeEnter: (to, from, next) => {
            $decorator.getPage('/kdxMember/index/index')?.beforeEnter?.(to, from)
            next();
        }
    },
    {
        path: '/kdxMember/memberInfo/index',
        name: 'member_memberInfo_index',
        meta: {
            title: '会员资料',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/memberInfo/changeNickname',
        name: 'member_memberInfo_changename',
        meta: {
            title: '会员资料'
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/level/index',
        name: 'member_level',
        meta: {
            title: '等级说明'
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/balance/index',
        name: 'member_balance',
        meta: {
            title: '账户余额',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/record/index',
        name: 'member_record',
        meta: {
            title: '提现记录',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/recharge/index',
        name: 'member_recharge',
        meta: {
            title: '账户充值',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/withdraw/index',
        name: 'member_withdraw',
        meta: {
            title: '余额提现',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/ranking/consumption/index',
        name: 'member_consumptionRanking',
        meta: {
            title: '消费排行',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/password/index',
        name: 'member_password',
        meta: {
            title: '修改密码',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/bindTel/index',
        name: 'member_bindTel',
        meta: {
            title: '修改绑定手机',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/bindTel/mobile',
        name: 'member_bindTelMobile',
        meta: {
            title: '绑定手机号',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/bindTel/change',
        name: 'member_changeTel',
        meta: {
            title: '更换绑定手机',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/bindTel/hadBound',
        name: 'member_hadBound',
        meta: {
            title: '绑定手机号',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/ranking/integral/index',
        name: 'member_integralRanking',
        meta: {
            title: '积分排行',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/mine/collection/index',
        name: 'member_collection',
        meta: {
            title: '我的收藏',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/mine/pug/index',
        name: 'member_pug',
        meta: {
            title: '我的足迹',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/coupon/list/index',
        name: 'member_coupon',
        meta: {
            title: '优惠券领取中心',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/coupon/detail/index',
        name: 'member_couponDetail',
        meta: {
            title: '优惠券详情',
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/detail/index',
        name: 'member_detail',
        meta: {
            title: '余额明细',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/detail/redpacketDetail',
        name: 'member_redpacketDetail',
        meta: {
            title: '红包明细',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/coupon/goods/index',
        name: 'member_couponGoodsList',
        meta: {
            title: '商品列表'
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/kdxMember/coupon/paySuccess/index',
        name: 'member_couponPaySuccess',
        meta: {
            title: '领取成功'
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    // 积分明细
    {
        path: '/kdxMember/credit/index',
        name: 'credit_detail',
        meta: {
            title: '积分明细',
            needLogin: true
        }
    },
    // 规则说明
    {
        path: '/kdxMember/rules/index',
        name: 'credit_rules',
        meta: {
            title: '规则说明'
        }
    }
]
export default member
