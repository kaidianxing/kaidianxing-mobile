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
import $decorator from '@/common/decorator.js'

class Search {
    data={
        merchantGroups: [] // 用来收集商户组
    }
    watch= {

    }
    methods={
        dependMerchant(merchant) {
            this.merchantGroups.push(merchant)
        },
        notify(){
            this.merchantGroups.forEach(merchant=> {
                let {item,$Route,lazyloader,context} = merchant
                context.handleRequest.call(context, item,$Route,lazyloader)
            })
        },
        remove(merchant) {
            this.merchantGroups = this.merchantGroups.filter((item) => item!=merchant)
        },
        clear(){
            this.merchantGroups = []
        }

    }
    beforeCreate(item, $Route,lazyLoader) {

    }
}
export default new Search()