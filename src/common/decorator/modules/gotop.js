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
import {ModuleMixin} from '../Mixin'
import {deepCopy} from '@/common/objectTools.js'
let gotopBar = null;
let showGotop = false
class Gotop extends ModuleMixin{
    constructor() {
        super()
    }

    beforeCreate(res,$Route,lazyLoader){
        $decorator.getPage($Route).setPageInfo({
            gotop: {
                ...res,
                params: {
                    ...res.params,
                    scrolltop: 0
                }
            }
        },'beforeCreate/gotop')
    }
    methods={
        onPageScroll(e,$Route){
            // if($Route.path!='/pages/index/index'){
            //     return
            // }
            if(!this.pageInfo){
                this.pageInfo=deepCopy($decorator.getPage($Route).pageInfo)
            }
            if (
                this.pageInfo ?.gotop && this.pageInfo.gotop ?.params ?.gotopheight >= 0
            ) {
                clearTimeout(gotopBar);
                gotopBar = setTimeout(() => {
                    showGotop = e.scrollTop > this.pageInfo.gotop.params.gotopheight;
                    if (showGotop != this.pageInfo.gotop.show) {
                        this.pageInfo.gotop.show=showGotop;
                        this.pageInfo.gotop.params.scrolltop = e.scrollTop;
                        $decorator.getPage($Route).setPageInfo({
                            gotop: {
                                show: showGotop,
                                params: {
                                    scrolltop: e.scrollTop
                                }
                            }
                        },'onPageScroll/gotop.js') 
                    }
                }, 50)
            }
        },
        onPageOnload(pageType){
            showGotop = false;
            this.pageInfo=null;
            $decorator.getPage(pageType).setPageInfo({
                gotop: {
                    show: false,
                    params: {
                        scrolltop: 0
                    }
                }
            },'onPageOnload/gotop.js')
        },
    }
}

export default new Gotop()