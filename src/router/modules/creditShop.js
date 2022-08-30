const creditShop = [
    {
        path: '/kdxCreditShop/index',
        name: 'creditShop',
        meta: {
            title: '积分商城'
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
    {
        path: '/kdxCreditShop/detail',
        name: 'detail',
        meta: {
            title: '商品详情',
			customShareInfo:true,//自定义分享信息
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    },
    {
        path: '/kdxCreditShop/list',
        name: 'list',
        meta: {
            title: '积分商品列表',
        },
        beforeEnter: (to, from, next) => {
            next();
        }
    }
]

export default creditShop
