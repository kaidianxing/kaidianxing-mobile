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
// 小程序中的/static/wxs/price.wxs

export const priceInt = function (value) {
    if (isNaN(parseInt(value))) {
        return ''
    } else {
        return parseInt(value)
    }
};
export const priceFloat = function (value) {
    if (isNaN(value)) {
        return ''
    } else {
        var newValue = parseFloat(value).toString()
        if (newValue.indexOf('.') != -1) {
            return newValue.slice(newValue.indexOf('.') + 1);
        } else {
            return ''
        }
    }
};
export const parseFloat = function (value) {
    if (isNaN(value)) {
        return ''
    } else {
        return parseFloat(value)
    }
};
export const toString = function (value) {
    if (isNaN(value)) {
        return ''
    } else {
        return value + '';
    }
};
export const esToFixed2 = function (value) {
    if (isNaN(value)) {
        return ''
    } else {
        var newValue = value.toString()
        if (newValue.indexOf('.') != -1) {
            var int = newValue.slice(0, newValue.indexOf('.'))
            var float = newValue.slice(newValue.indexOf('.') + 1);
            if (float.length == 1) {
                return int + '.' + float + '0'
            } else if (float.length == 2) {
                return int + '.' + float
            } else if (float > 2) {
                float = float.slice(0, 2)
                return int + '.' + float
            } else {
                return int + '.00'
            }
        } else {
            return value + '.00'
        }
    }
};
export const sliceString = function (value, lengths) {
    if (value.length != 0) {
        return value.slice(0, lengths);
    } else {
        return '';
    }
};
// 用于余额提现的手续费判断
export const withdraw_charge = function (value, withdraw_begin, withdraw_end) {
    var transformVal = parseFloat(value).toFixed(3)
    var realVal = transformVal.substring(0, transformVal.length - 1)
    if (withdraw_begin != 0 || withdraw_end != 0) {
        if ((+withdraw_begin) <= (+realVal) && (+realVal) <= (+withdraw_end)) {
            realVal = 0;
        }
    }
    return parseFloat(realVal)
}

export function splitMoney(money) {
    if (money === '' || typeof money == 'object') {
        money = 0
    }

    let [integer, decimal] = parseFloat(+money).toFixed(2).split('.')

    return { integer, decimal: '.' + decimal }
}

/**
 * @description 商城价格处理函数
 * @export formatMoney
 * @param {string,number} money
 * @returns {string}  
 */
export function formatMoney(money) {
    let num = parseFloat(money)
    if (Number.isNaN(num)) {
        return '0.00'
    }

    if (num > 10 ** 4) {
        num = parseFloat(num / 10 ** 4).toFixed(2) + '万'
    } else {
        num = parseFloat(num).toFixed(2)
    }
    return num
}