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
/**
 * 这里是页面跳转前预处理请求等操作的处理函数
 * 由于get请求的缓存功能可以提高页面展示速度
 * 这里不会影响页面加载的性能
 * 不会发生统一接口频繁请求的问题
 */
import $decorator from '@/common/decorator'
let isRequestingDetail=null
/**
 * 商品详情数据预加载预处理
 * @param {} $Route 
 */
function getGoodDetail($Route){
    let {
        goods_id,
        liverId
    } = $decorator.getPage('goodDetail').getUrlParams($Route);
    if(isRequestingDetail==goods_id){
        return
    }
    $decorator.getPage('goodDetail').getDetail(goods_id, liverId).then(res => {
        isRequestingDetail=null;//等待登录刷新的标识
    });
}
export default function($Route){
    switch($Route.path){
        case '/kdxGoods/detail/index': 
            getGoodDetail($Route)
        break;

    }
}