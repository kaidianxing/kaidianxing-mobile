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
import * as utils from '@/common/util.js'
import store from '@/store'
import api from '@/api'
import $decorator from '@/common/decorator'
import {
    ModuleMixin
} from '../Mixin'
class Updater {
    getGoodsList() {
        throw new Error('Please implement it in a subclass')
    }
}
class GoodsUpdater extends Updater {
    constructor(props) {
        super(props)
    }
    getParams = (tmp) => {
        let sort = {
            0: {
                key: '',
                by: 'desc'
            },
            1: {
                key: 'sales',
                by: 'desc'
            },
            2: {
                key: 'price',
                by: 'desc'
            },
            3: {
                key: 'price',
                by: 'asc'
            }
        }
        let params = { //获取商品组列表
            label_field: '',
            sort: sort[tmp.params.goodssort].key,
            by: sort[tmp.params.goodssort].by,
        }
        let id = [];
        switch (tmp.params.goodsdata + '') {
            case '0': //手动选择

                tmp.data.forEach(item => {
                    if (item.gid) {
                        id.push(item.gid)
                    }
                })

                params = id.length ? {
                    id: id, // 传值错误
                    sort: '',
                    by: '',
                    page: 1,
                    pagesize: tmp.data.length
                } : null
                break;
            case '1': //选择分类
                params = tmp.params.cateid ? {
                    ...params,
                    category_id: tmp.params.cateid,
                    page: 1,
                    pagesize: tmp.data.length
                } : null
                break;
            case '2': //选择分组
                params = tmp.params.groupid ? {
                    ...params,
                    group_id: tmp.params.groupid,
                    page: 1,
                    pagesize: tmp.data.length
                } : null
                break;
            case '3': //新品商品
            case 'is_new':
                params = {
                    ...params,
                    is_new: 1,
                    page: 1,
                    pagesize: tmp.data.length
                }
                break;
            case '4': //热卖商品
            case 'is_hot':
                params = {
                    ...params,
                    is_hot: 1,
                    page: 1,
                    pagesize: tmp.data.length
                }
                break;
            case '5': //推荐商品
            case 'is_recommand':
                params = {
                    ...params,
                    is_recommand: 1,
                    page: 1,
                    pagesize: tmp.data.length
                }
                break;
        }
        if (params) {
            params.get_activity = 1
        }
        return params
    }

    getGoodsList = (res) => { //获取商品组
        return new Promise((resolve) => {
            let list = res.data
            if (list && list.length) {
                let params = this.getParams(res);
                if (!params) return
                api.goodApi.goodList(params).then(res => {
                    if (res.error == 0) {
                        let list = res.list.filter(item => item).map(item => {
                            let tmp = {
                                thumb: utils.mediaUrl(item.thumb),
                                price: parseFloat(item.activities?.member_price ? item.activities?.member_price : item.price),
                                productprice: parseFloat(item.original_price),
                                title: item.title,
                                sales: item.sales,
                                gid: item.id,
                                credit: 0,
                                ctype: 1,
                                stock: item.stock,
                                sub_name: item.sub_name,
                                commission: item.activities?.commission || null,
                                has_option: item.has_option,
                                goodstype: item.type,
                                plugin_account: item?.plugin_account, //处理卡密
                                activities: item?.activities,
                                type: item.type
                            }
                            return tmp;
                        });
                        resolve(list)
                    } else {
                        resolve([])
                    }
                })
            }
        })
    }
}



class Goods extends ModuleMixin {
    beforeCreate(item, $Route, lazyLoader) {
        $decorator.getPage($Route).setPageInfo({
            [item._comIndex_]: {
                data: []
            }
        });//防止闪现


        let updater;
        if (item.params.goodstype == '0') {
            updater = new GoodsUpdater()
        }


        updater.getGoodsList(item).then(list=>{
            $decorator.getPage($Route).setPageInfo({
                [item._comIndex_]: {
                    data: list
                }
            }, 'goods/getGoodsList1')
            lazyLoader?.checkPageList();
        })
    }
    methods={}

}
export default new Goods();
