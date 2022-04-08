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

export default async function (e) {
    if (e.target=="goods/clickBuyBtn") {
        // 判断登录
        await this.$store.dispatch('quickPurchase/checkLoginStatus')
        // 获取商品详情
        this.cartAdder.getGoodDetail(e.data.value.gid).then((res) => {
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
    } else if (e.target === "member/clickToMyShop"){ // 进入我的店铺
        let value=e.data.value;
        let token=value.params.wxapp_auth_token; // 多商户管理端小程序token
        let wxappid = value.params.wxappid // 管理端小程序appid
        let path='/pages/index/index' // 管理端小程序页面路径,必须是/开头
        if(!wxappid){
            uni.showToast({
                title: '未能获取appid',
                icon: 'none',
            })
            return
        }
        this.$Router.auto(`wxapp:${path}`, { wxappid }, { token })
    }
}