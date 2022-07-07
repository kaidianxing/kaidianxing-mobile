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
const good = [
    {
        path: '/kdxGoods/goodList/index',
        name: 'good_list',
        meta: {
            title: '列表',
        }
    },
    {
        path: '/kdxGoods/categoryList/index',
        name: 'good_category',
        meta: {
            title: '分类',
        }
    },
    {
        path: '/kdxGoods/detail/index',
        name: 'good_detail',
        meta: {
            title: '商品详情',
            customShareInfo:true,//自定义分享信息
        },
        beforeEnter: (to, from, next) => {
            $decorator.getPage('/kdxGoods/detail/index')?.beforeEnter?.(to,from)
            next();
        }
    },
    {
        path: '/kdxGoods/search/index',
        name: 'good_search',
        meta: {
            title: '商品搜索',
        }
    },
    {
        path: '/kdxGoods/detail/allComments',
        name: 'good_allComments',
        meta: {
            title: '全部评价',
        }
    },
    {
        path: '/kdxGoods/activity/seckillList',
        name: 'seckillList',
        meta: {
            title: '秒杀'
        }
    },
    {
        path: '/kdxGoods/activity/expire',
        name: 'activity_expire',
        meta: {
            title: '限时秒杀'
        }
    },
    {
        path: '/kdxGoods/activity/groupsList',
        name: 'groupsList',
        meta: {
            title: '拼团'
        }
    },
    {
        path: '/kdxGoods/invalid/index',
        name: 'invalidGoods',
        meta: {
            title:'商品详情'
        }
    },
    {
        path: '/kdxGoods/groups/detail',
        name: 'groups_detail',
        meta: {
            title: '拼团详情'
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
    {
        path: '/kdxGoods/groups/user',
        name: 'groups_user',
        meta: {
            title: '团员列表',
            needLogin: true
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
]
export default good
