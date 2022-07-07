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
    usePersionId: '',
    refund_checkEx: {},
    groupsUser: [],
    groupLeader: null,
    payInfo: {
      payType:'',
      order_id:''
    }
  },
  mutations: {
    setUsePersionId(state,id) {
      state.usePersionId = id
    },
    setPayInfo(state,data) {
      state.payInfo = data
    },
    setRefundCheckEx(state, checkEx) {
      state.refund_checkEx = checkEx
    },
    // 设置拼团团队信息
    setGroupsUser(state, info){
      state.groupLeader = info.id
      state.groupsUser = info.list
    }
  },
  getters:{
    refund_checkEx: state=> state.refund_checkEx,
    payInfo: state=> state.payInfo

  }
}
