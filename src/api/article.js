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
/**
 * @date 2021-10-28 13:48
 * @describe 签到页
 */
export const articleApi = {
    /*文章营销*/
    cancelFavorite: {
        method: 'post',
        api: '/article/favorite/cancel',
    },
    favoriteList: {
        method: 'get',
        api: '/article/favorite/list',
    },
    getCommissionPosterIndex: {
        method: 'get',
        api: '/merchant/commission/poster/index',
    },
    // 获取文章列表
    getArticleList: {
        method: 'get',
        api: '/article/list/list',
    },
    // 获取文章分组
    getGroupList: {
        method: 'get',
        api: '/article/group/list',
    },
    // 点赞状态
    articleThumpsUp: {
        method: 'post',
        api: '/article/article/thumps-up',
    },
    // 获取文章详情
    getArticleDetail: {
        method: 'get',
        api: '/article/article/detail',
    },
    // 点赞状态
    sendReward: {
        method: 'post',
        api: '/article/article/send-reward',
    },
    // 二维码
    getWxappQrcode: {
        method: 'get',
        api: '/article/article/get-wxapp-qrcode',
    },
    // 增加分享数
    increaseShare: {
        method: 'post',
        api: '/article/article/increase-share',
    },
    // 添加收藏
    addFavorite: {
        method: 'post',
        api: '/article/favorite/add',
    },
    // 报名
    join: {
        method: 'post',
        api: '/article/article/registration-activity',
    },
    // 签到
    sign: {
        method: 'post',
        api: '/article/article/sign-activity',
    },
    // 取消报名
    cancelJoin: {
        method: 'post',
        api: '/article/article/cancel-activity',
    },
    // 发送短信
    send: {
        method: 'post',
        api: '/article/article/send-sms',
    },
    // 校验手机号
    checkSmsCode: {
        method: 'post',
        api: '/article/article/check-sms-code',
    },
}




