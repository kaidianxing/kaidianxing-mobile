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
class Notice extends ModuleMixin{
    constructor() {
        super()
    }

    beforeCreate(res,$Route,lazyLoader){
        this.getNotice(res,$Route).then(res=>{
            lazyLoader?.checkPageList();
        }).catch(()=> {
        })
    }
    methods={
        getNotice(item, $Route) {
            return new Promise((resolve,reject) => {
                let {
                    noticedata = 0, noticenum = 5
                } = item.params;
                if (noticedata == 0) {
                    api.decorateApi.getNotice({
                        limit: noticenum
                    }).then(res => {
                        resolve()
                        if (res.error === 0) {
                            $decorator.getPage($Route).setPageInfo({
                                [item._comIndex_]: {
                                    data: res.list.map(listItem => {
                                        let tmp = {
                                            id: listItem.id,
                                            linkurl: listItem.link,
                                            title: listItem.title
                                        }
                                        return tmp
                                    })
                                }
                            },'getNotice/notice.js');
                        } else {
                            $decorator.getPage($Route).setPageInfo({
                                [item._comIndex_]: {
                                    data: []
                                }
                            },'getNotice/notice.js');
                        }
                    })
                } else {
                    reject()
                    $decorator.getPage($Route).setPageInfo({
                        [item._comIndex_]: {
                            data: item.data
                        }
                    },'getNotice/notice.js')
                }
            })
        
        }
    }
}
export default new Notice() 
