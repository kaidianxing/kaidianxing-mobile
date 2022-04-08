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

export default {
    namespaced: true,
    state: {
        pageTopHeight: 0, //页面顶部高度
        pageBottomHeight: 0, //页面底部高度
        cachePagList: [],
        isBottom: [],
        isTop: [],
        isFixed: [],
        pageList: [], //装修后的页面模板数据,不包括置顶、置底、悬浮的装修组件
        pageInfo: {}, //各个页面的装修组件的对应页面实际的数据，包括置顶、置底、悬浮的装修组件
        pageLoading: true,
        pageListGetting: false,//节流
        onshowing: false,
        pageSettings: {},
        forClearFormData:{}
    },
    mutations: {
        updateState(state, data) {
            if (typeof data == "object") {
                for (var key in data) {
                    state[key] = data[key];
                }
            }
        },
    },
}
