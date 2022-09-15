export default async function (e) {
    if (e.target == "goods/clickBuyBtn") {
        // 判断登录
        await this.$store.dispatch('quickPurchase/checkLoginStatus')
        // 获取商品详情
        this.cartAdder.getGoodDetail(e.data.value.gid,'...pagesC/eventHandlerustom').then((res) => {
            if (res.error === 0) {
                // 打开goodsPicker
                this.cartAdder.callback({
                    type: 'toggle',
                    data: { 
                        type: 'spec'
                    },
                })
            }
        })
    } else if (e.target=='noticeModules/toIndex') {
        if(e.data.type=="login"){
            this.$store.commit('login/setModal',true)
            return
        }
        // #ifdef H5
        this.$Router.replaceAll({
            path: '/',
        })
        // #endif
        // #ifndef H5
        this.$Router.replaceAll({
            path: '/pages/index/index',
        })
        // #endif
    }
}