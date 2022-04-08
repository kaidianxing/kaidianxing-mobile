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
import api from '@/api'
import * as utils from '@/common/util.js'
import {
    deepCompare
} from '@/common/objectTools.js'
import $decorator from '@/common/decorator'
import store from '@/store'
import {ModuleMixin} from '../Mixin'

function getOrderStatus(path) {
    switch (path) {
        case '/kdxOrder/list?status=pay': //代付款
            return 'wait_pay'
        case '/kdxOrder/list?status=send': //代发货
            return 'wait_send'
        case '/kdxOrder/list?status=pick': //待收货
            return 'wait_receive'
        case '/kdxOrder/refund/list': //维权
            return 'refund'
        case '/kdxOrder/list': //全部
            return 'all'
        case '/kdxOrder/list?status=finish': //已完成
            return 'finish'
    }
    return
}
let thrttoleIcongroup = false
class Icongroup extends ModuleMixin{
    constructor() {
        super()
    }
    beforeCreate(res,$Route,lazyLoader){
        this.getOrderNum(res, $Route)
    }
    methods={
        async getOrderNum(item,$Route) {
        
            let icongroups = {}
            let res = {}
            if (store.state.login.isLogin == true) {
                res = await api.orderApi.getTotal()
            } else {
                // 未登录时收集起来,登录时触发更新
                store.commit('login/setSubscriber', {
                    name: 'icongroup_getOrderNum_' + $Route,
                    fun: () => {
                        thrttoleIcongroup = false
                        this.getOrderNum(item,$Route)
                    }
                })
            }
            icongroups[item._comIndex_] = {
                data: item.data.map(item => {
                     // 适配云智服，防止链接字段是一个对象
                    if(!/^https?/.test(item.linkurl)&& typeof item.linkurl === 'string') {
                        if (store.state.login.isLogin) {
                            item[item.linkurl] = res[getOrderStatus(item.linkurl)] || ''
                        } else {
                            item[item.linkurl] = 0
                        }
                    }

                    return item;
                })
            }
            if (!thrttoleIcongroup) {
                thrttoleIcongroup = true
                $decorator.getPage($Route).setPageInfo({
                    ...icongroups
                },'getOrderNum/icongroup.js')
                setTimeout(() => {
                    thrttoleIcongroup = false
                }, 1000)
            }
        }
    }
}
export default new Icongroup();