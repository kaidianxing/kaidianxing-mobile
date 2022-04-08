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
import api from '@/api'
let params = { //获取商品组列表
}
import $decorator from '@/common/decorator'
import {ModuleMixin} from '../Mixin'
const goodsdata = [{
    label: '手动选择',
    id: '0'
}, {
    label: '选择分类',
    id: '1'
}, {
    label: '选择分组',
    id: '2'
}, {
    label: '新品商品',
    id: 'is_new', //3
}, {
    label: '热卖商品',
    id: 'is_hot', //4
}, {
    label: '推荐商品',
    id: 'is_recommand', //5
}];

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

function getParams(tmp) {
    params = { //获取商品组列表
        label_field: '',
        sort: sort[tmp.params.goodssort].key,
        by: sort[tmp.params.goodssort].by,
    }
    switch (tmp.params.goodsdata + '') {
        case '0': //手动选择
            let id = tmp.data.filter(item=>item.gid).map(item => item.gid)
            params = id ? {
                id: id,
                sort: '',
                by: '',
                pagesize: id.length
            } : null
            break;
        case '1': //选择分类
            params = tmp.params.cateid ? {
                ...params,
                category_id: tmp.params.cateid,
                pagesize: tmp.params.goodsnum
            } : null
            break;
        case '2': //选择分组
            params = tmp.params.groupid ? {
                ...params,
                group_id: tmp.params.groupid,
                pagesize: tmp.params.goodsnum
            } : null
            break;
        case '3': //新品商品
        case 'is_new':
            params = {
                ...params,
                is_new: 1,
                pagesize: tmp.params.goodsnum
            }
            break;
        case '4': //热卖商品
        case 'is_hot':
            params = {
                ...params,
                is_hot: 1,
                pagesize: tmp.params.goodsnum
            }
            break;
        case '5': //推荐商品
        case 'is_recommand':
            params = {
                ...params,
                is_recommand: 1,
                pagesize: tmp.params.goodsnum
            }
            break;
    }
    if (params) {
        params.get_activity = 1
    }
    return params
}
class Tabbar extends ModuleMixin{
    constructor() {
        super()
    }
    cacheCurIndex={}
    beforeCreate(data,$Route,lazyLoader){
        data.params.current = this.cacheCurIndex[data._comIndex_]||0
        this.getTabGoods(data,$Route).then(res=>{
            lazyLoader.checkPageList();
        })
    }
    methods={
        setCurIndex(data,idx=0){
            data.params.current = idx;
            this.cacheCurIndex[data._comIndex_]=idx
        },
        getTabGoods(item ,$Route) {
            return new Promise((resolve,reject) =>{
                let currentItem = item.data[item.params.current]
                let params = getParams(currentItem.goods);
                if(!params) {
                    reject()
                    return
                }
                params && api.goodApi.goodList(params).then(res => {
                    if (res.error == 0) {
                        resolve(res)
                        item.data[item.params.current].goods.data = res.list.map(item => {
                            let tmp = {
                                thumb: utils.mediaUrl(item.thumb),
                                price: parseFloat(item.activities ?.member_price ? item.activities ?.member_price : item.price),
                                productprice:parseFloat(item.original_price),
                                title: item.title,
                                sales: item.sales,
                                gid: item.id,
                                credit: 0,
                                ctype: 1,
                                stock: item.stock,
                                sub_name: item.sub_name,
                                commission: item.activities ?.commission || null,
                                type: item.type,
                                plugin_account: item.plugin_account,//权限问题
                            }
                            return tmp;
                        });
                    }else{ 
                        reject(res)
                    }
                    $decorator.getPage($Route).setPageInfo({
                        [item._comIndex_]: {
                            data: item.data
                        }
                    },'getTabGoods/tabbar.js');
                }).catch(err =>{
                    reject(err)
                })
            })
        }

    }
}

export default new Tabbar()