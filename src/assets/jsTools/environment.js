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
/* eslint-disable */
export function getSystemInfo() {
    new Promise((resolve, reject) => {
        if (uni) {
            uni.getSystemInfo({
                success: function (res) {
                    resolve(res)
                }
            });
        } else {
            resolve({
                pixelRatio: window.devicePixelRatio
            })

        }
    })

}

function isApp() {//判断小程序类型
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf('AlipayClient') > -1) {// 支付宝小程序的 
        return 'aliApp'
    } else if (/QQ/i.test(userAgent) && /miniProgram/i.test(userAgent)) {// QQ 小程序
        return 'qqApp'
    } else if (/miniProgram/i.test(userAgent)) {// 微信小程序
        return 'wxApp'
    } else if (/toutiaomicroapp/i.test(userAgent)) {// 头条小程序
        return 'ttApp'
    } else if (/swan/i.test(userAgent)) {// 百度小程序
        return 'swanApp'
    }
}

function isH5() {//判断移动端或PC端
    var is_mobi = navigator.userAgent.toLowerCase().match(/(ipod|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i) != null;
    if (is_mobi) {
        return 'isMobile'
    } else {
        return 'isPC'
    }
}
 
export function px2rpx(px, rate = 1, defVal=0) {
    if(px===undefined){
        px=defVal
    }
    if(!px){
        px=0
    }
    return px * rate + 'rpx'
}