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
import {ModuleMixin} from '../Mixin'

class Seckill extends ModuleMixin {
    constructor() {
        super()
    }
    beforeCreate(data,$Route,lazyLoader){
        $decorator.getPage($Route).setPageInfo({
            [data._comIndex_]: {
                data: []
            }
        });//防止闪现
        this.getGoodsList(data,$Route).then(res=>{
            lazyLoader?.checkPageList();
        })
    }
    methods={
        getGoodsList(item,$Route) { //获取商品组
            return new Promise((resolve, reject) => {
                let params = {
                    id: item ?.data.map(val => val.id),
                    get_activity: 1,
                    activity_type: 'seckill'
                };
                // 活动来源商户--不需要活动id
                if (!(item?.params?.activityGoodsType === '0')) {
                    params.activity_id = item ?.params ?.activityData.id;
                    if (params.activity_id) {
                        this.getSeckillActivity(item,$Route)
                    }
                }
                if (!params) {
                    reject()
                    return
                };
                api.goodApi[item?.params?.activityGoodsType === '0'?'getActivityGoods':'goodList'](params, {
                    errorToast: false
                }).then(res => {
                    if (res.error == 200705) {
                        resolve([]); 
                        $decorator.getPage($Route).setPageInfo({
                            [item._comIndex_]: {
                                data: []
                            }
                        },'getGoodsList/seckill.js') 
                    } else if (res.error == 0) {
                        let list = res.list.map(item => {
                            let tmp = {
                                thumb: utils.mediaUrl(item.thumb),
                                price: parseFloat(item.price),
                                productprice: parseFloat(item.original_price),
                                title: item.title,
                                sales: item.sales,
                                gid: item.id,
                                credit: 0,
                                ctype: 1,
                                stock: item.stock,
                                sub_name: item.sub_name,
                                commission: item.activities ?.commission || null,
                                has_option: item.has_option,
                                id: item.id,
                                type: item.type,
                                seckillData: item ?.activities ?.seckill || item ?.activities ?.preheat_activity || null
                            };
                            return tmp;
                        });
                        $decorator.getPage($Route).setPageInfo({
                            [item._comIndex_]: {
                                data: list
                            }
                        },'getGoodsList/seckill.js')
                        resolve();
                    }
                })

                
            })
        },
        getSeckillActivity(item,$Route) {
            return new Promise((resolve, reject) => {
                let params = {
                    activity_id: item ?.params ?.activityData.id,
                };
                if (!params.activity_id) return;
                api.goodApi.getActivity(params, {
                    errorToast: false
                }).then(res => {
                    if (res.error == 0) {
                        $decorator.getPage($Route).setPageInfo({
                            [item._comIndex_]: {
                                params: {
                                    activeInfo: res
                                },
                            }
                        },'getSeckillActivity/seckill.js')
                        
                        resolve();
                    }
                })
            })
        }
    }
}
export default new Seckill()