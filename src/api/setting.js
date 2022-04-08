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
export const settingApi = {
    getSysSetting: {
        method: 'get',
        api: '/index/get-set',
        needSession: false
    },
    getAddress: {
        method: 'get',
        api:'/index/get-address'
    },
    // 获取渠道状态
    getChannelStatus: {
        method: 'get',
        api: '/index/get-channel-status',
        needSession: false,
    },
    getWxCode: {
        method: 'get',
        api: '/wxapp/qr-code/get'
    },
    // 执行异步任务
    runAsyncTask: {
        method: 'get',
        api: '/utility/asyncTask/execute'
    },
}