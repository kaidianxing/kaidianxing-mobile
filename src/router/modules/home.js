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
import $decorator from '@/common/decorator'
const home = [
    {
        path: '/pages/index/index',
        aliasPath: '/',  //对于h5端你必须在首页加上aliasPath并设置为/
        name: 'home_index',
        meta: {
            title: '首页',
        },
        beforeEnter: (to, from, next) => {
            $decorator.getPage('/pages/index/index')?.beforeEnter?.(to,from)
            next();
        }
    }
]
export default home