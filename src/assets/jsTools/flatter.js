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
export default function flatten(obj) {//扁平化对象
    var result = {};

    function recurse(src, prop) {
        var toString = Object.prototype.toString;
        if (toString.call(src) == '[object Object]') {
            var isEmpty = true;
            for (var p in src) {
                isEmpty = false;
                recurse(src[p], prop ? prop + '[' + p + ']' : p)
            }
            if (isEmpty && prop) {
                result[prop] = {};
            }
        } else if (toString.call(src) == '[object Array]') {
            var len = src.length;
            if (len > 0) {
                src.forEach(function (item, index) {
                    recurse(item, prop ? prop + '[' + index + ']' : '[' + index + ']');
                })
            } else {
                result[prop] = [];
            }
        } else {
            result[prop] = src;
        }
    }
    recurse(obj, '');

    return result;
}