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
export const goodApi = {
    categoryList: {//分类列表
        method: 'post',
        api: '/product/category/get-list',
        needCache: true,
    },
    goodList: {//商品列表
        method: 'get',
        api: '/product/list/get-list',
    },
    goodDetail: {//商品详情
        method: 'get',
        api: '/product/detail/get-detail',
    },
    cartList: {//购物车列表
        method: 'get',
        api: '/product/cart/get-list',
        needLogin: true
    },
    changeCartNum: {//修改购物车数量
        method: 'post',
        api: '/product/cart/change-total',
        needLogin: true,
        bindSence: 'add_cart'
    },
    selectCart: {//选中
        method: 'post',
        api: '/product/cart/select'
    },
    getCartNum: {//获取购物车数量
        method: 'get',
        api: '/product/cart/get-count',
    },
    delCart: {//删除购物车
        method: 'post',
        api: '/product/cart/delete'
    },
    changeFavor: {//改变收藏状态
        method: 'post',
        api: '/product/detail/change-favorite'
    },
    getComments: {//评价列表
        method: 'get',
        api: '/order/comment/list'
    },
    getGoodOptions: { //获取商品规格
        method: 'get',
        api: '/product/detail/get-option',
    },
    getWxPoster: { //获取微信海报
        method: 'get',
        api: '/product/detail/get-wxapp-qrcode'
    },
    getGoodsLiver: { // 获取商品直播状态
        method: 'get',
        api: '/broadcast/room/get-goods-broadcast'
    },
    getActivity: { // 获取商城活动状态
        method: 'get',
        api: '/product/list/get-activity'
    },
    removeLose: { // 移除购物车失效商品
        method: 'post',
        api: '/product/cart/clean-lose-goods'
    },
    getActivityGoods: { // 获取活动商品
        method: 'get',
        api: '/product/list/get-activity-goods'
    },
    getShortLink: {
        method: "post",
        api: '/product/detail/get-short-link'
    }

}
