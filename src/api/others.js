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
export const othersApi = {
    // 获取公告详情
    getNoticeDetail: {
        method: 'get',
        api: '/notice/get-notice'
    },
    // 获取小程序获取订阅消息pri_tmp_id
    getNoticeTemId: {
        method: 'post',
        api: '/notice/index'
    },
    // 获取微信小程序跳转链接
    getWxAppLink: {
        method: 'get',
        api: '/wxappSkip/index'
    },
    getWxappNoticeTemId: {
        method: 'get',
        api: '/index/get-notice-template'
    }
}
