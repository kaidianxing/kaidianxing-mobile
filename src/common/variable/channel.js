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
import { isWx } from '@/common/util'

/* Client-type */

// #ifdef H5
export let client_type = isWx?'20': '10'
export const setClientType = (type) => {
    client_type = type
}
// #endif

// #ifdef MP-WEIXIN
export const client_type =  21
// #endif

// #ifdef MP-TOUTIAO
let platfrom = uni.getSystemInfoSync()
const platfromObj = {
    devtools: 31,
    toutiao: 30,
    douyin: 31,
    news_article_lite: 32, // 头条极速版
}
export const client_type = platfromObj[platfrom.appName.toLowerCase()]
// #endif
