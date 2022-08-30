export const creditShopApi = {
    // 积分商品列表
    getCreditShopList: {
        method: 'get',
        api: '/creditShop/index/list'
    },
    // 积分商品详情
    getCreditShopDetail: {
        method: 'get',
        api: '/creditShop/index/detail'
    },
    // 积分商品规格
    getCreditShopOption: {
        method: 'get',
        api: '/creditShop/index/get-option'
    },
    // 积分商城状态
    shopStatus: {
        method: 'get',
        api: '/creditShop/index/get-set'
    },
    // 获取微信小程序二维码
    getWxQrcode: {
        method: 'get',
        api: '/creditShop/index/get-wx-app'
    }
};