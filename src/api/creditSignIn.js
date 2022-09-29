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
export const signInApi = {
    /*积分签到*/
    getSignInfo:{
	    method: 'get',
	    api: '/creditSign/index/list'
	},
    getRewards: {//连签奖励及状态
        method: 'get',
        api: '/creditSign/index/calculate-rewards',
    },
    getActivity: {//获取当前进行中的活动详情 标题
        method: 'post',
        api: '/creditSign/index/activity-detail'
    },
    clickSignIn: {//日常签到
        method: 'post',
        api: '/creditSign/index/sign'
    },
    supplementSignIn: {//补签
        method: 'post',
        api: '/creditSign/index/supplement-sign'
    },
    receiveReward: {//领取连签礼包
        method: 'post',
        api: '/creditSign/index/receive-reward'
    },
    getSupplement: {//查询补签次数
        method: 'get',
        api: '/creditSign/index/get-supplement-count'
    },
    setDailyReminder: {//开启用户每日提醒接口
        method: 'post',
        api: '/creditSign/index/set-daily-reminder'
    },
    getDetail: {
        method: 'get',
        api: '/creditSign/index/member-sign-detail'
    }
}

