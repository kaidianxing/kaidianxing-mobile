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
/*
 * @Description: 导出
 * @Autor: 青岛开店星信息技术有限公司
 */
import "./assets/reset.scss";
import Vue from "vue";

const install = (Vue) => {
    /**
     * public observer
     * @type {{add(*=): void, list: [], emit(*=): void}}
     */
    const list = []
    Vue.prototype.$pushTarget = function (observer) {
        list.push(observer)
    }
    Vue.prototype.$message = function (obj) {
        for (let i = list.length - 1; i > -1; i--) {
            list[i](obj)
        }
    }
    Vue.prototype.$popTarget = function () {
        list.pop()
    }
// 小程序挂载有问题,直接外边导入,这里只负责把样式挂出去。
console.error("installing========>>>>>", Vue);
}
;

export default {
    install,
};
