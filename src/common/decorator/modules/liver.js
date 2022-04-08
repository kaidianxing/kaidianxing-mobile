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
import $decorator from '@/common/decorator'
import {ModuleMixin} from '../Mixin'
const getParams = (item) => {
    if (item.params.addtype == '0') {
        return {
            pagesize: item.params.livernum || 6
        }
    } else {
        let room_id = item.data.map(v => v.id)
        if (room_id.length) {
            return {
                room_id: item.data.map(v => v.id)
            }
        } else {
            return ''
        }

    }
}
class Liver extends ModuleMixin{
    constructor() {
        super()
    }
    
    beforeCreate(res, $Route, lazyLoader) {
         this.getLiverList(res, $Route).then(res=>{
            lazyLoader.checkPageList();
         })
    }
    methods={
        getLiverList(item,$Route) {
            return new Promise((resolve, reject) => {
                let params = getParams(item);
                if (!params) return
                params && api.liverApi.liverList(params).then(res => {
                    if (res.error == 0) {
                        let list = res.list.map(item => {
                            return item;
                        });
                        resolve(list)
                        $decorator.getPage($Route).setPageInfo({
                            [item._comIndex_]: {
                                data: list
                            }
                        },'getLiverList/liver.js');
                    } else {
                        resolve([])
                        $decorator.getPage($Route).setPageInfo({
                            [item._comIndex_]: {
                                data: []
                            }
                        },'getLiverList/liver.js');
                    }
                })
            })
        }
    }
}
export default new Liver();