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
/**
 *子页面模块
 * */
import goodDetailPage from './decorate/pages/goodDetail.js'; //商品详情页
import indexPage from './decorate/pages/index.js'; //商城首页
import othersPage from './decorate/pages/others.js'; //非装修页
import vipcenterPage from './decorate/pages/vipCenter.js'; //会员中心页
import commissionPage from './decorate/pages/commission.js'; //分销中心页
import customPage from './decorate/pages/custom.js'; //分销中心页
import merchantPage from './decorate/pages/merchant.js'; //分销中心页
/**
 * 子组件模块
 */
 
export default {
    namespaced: true,
    modules: {
        goodDetailPage,
        indexPage,
        othersPage,
        vipcenterPage,
        commissionPage,
        customPage,
        merchantPage
    },
    state: {
        /* 其他功能默认模板数据 */
        diymenu: [], //自定义底部菜单
        /* 通用装修动态数据模板 */
        curPageType: 10, //当前页面的类型缓存
        tabbarPages: {}, //作为tabbar页面的页面
        pagePath: '', //当前页面路由
        pageQuery: {},
        pageInfo: {}, //当前页面的数据
        maskStatus: false,
        loaded: false,
        formData:{},
    },
    mutations: {
        updateState(state, data) {
            if (typeof data == "object") {
                for (var key in data) {
                    state[key] = data[key];
                }
            }
        }
    },
}
