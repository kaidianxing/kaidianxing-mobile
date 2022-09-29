/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
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