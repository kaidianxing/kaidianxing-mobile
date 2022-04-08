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
const commission = [
    {
        path: '/kdxCommission/default',
        name: 'commission_default',
        meta: {
            title: '分销中心',
            needLogin: true
        }
    },
    {
        path: '/kdxCommission/index/index',
        name: 'commission_index',
        meta: {
            title: '分销中心',
            needLogin: true,
            isUse: true,
        },
        beforeEnter: (to, from, next) => {
            $decorator.getPage('/kdxCommission/index/index')?.beforeEnter?.(to,from)
            next();
        }
    },
    {
        path: '/kdxCommission/apply/index',
        name: 'commission_apply',
        meta: {
            // title: '成为分销商',
            needLogin: true,
        }
    },
    {
        path: '/kdxCommission/withdraw/index',
        name: 'commission_withdraw',
        meta: {
            title: '佣金提现',
            needLogin: true,
            isUse: true,
        }
    },
    {
        path: '/kdxCommission/withdraw/list',
        name: 'commission_list',
        meta: {
            title: '提现明细',
            needLogin: true,
            isUse: true,
        }
    },
    {
        path: '/kdxCommission/order/list',
        name: 'commission_order',
        meta: {
            title: '分销订单',
            needLogin: true,
            isUse: true,
        }
    },
    {
        path: '/kdxCommission/downLine',
        name: 'commission_downLine',
        meta: {
            title: '我的下线',
            needLogin: true,
            isUse: true,
        }
    },
    {
        path: '/kdxCommission/statistics',
        name: 'commission_statistics',
        meta: {
            title: '分销佣金',
            needLogin: true,
            isUse: true,
        }
    },
    {
        path: '/kdxCommission/ranking',
        name: 'commission_ranking',
        meta: {
            title: '累计佣金排行',
            needLogin: true,
            isUse: true,
        }
    },
    {
        path: '/kdxCommission/toAccount',
        name: 'commission_toAccount',
        meta: {
            title: '待入账佣金',
            needLogin: true,
            isUse: true,
        }
    },
    {
        path: '/kdxCommission/level',
        name: 'commission_level',
        meta: {
            title: '分销等级说明',
            needLogin: true,
            isUse: true,
        }
    },
];
export default commission
