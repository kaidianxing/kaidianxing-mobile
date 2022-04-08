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
import store from '@/store'
import {localStorage} from 'mp-storage'
import $decorator from '@/common/decorator'
import {ModuleMixin} from '../Mixin'

class Followbar extends ModuleMixin{
    constructor() {
        super()
    }
    beforeCreate(data,$Route,lazyLoader) {
         this.initFollowbar($Route)
    }
    methods={
        // 关注条关闭后七天 
        closeFollowbar ($Route) {
            // 防止本次关闭后再次打开
            try {
                if(store.state.decorate.indexPage.pageInfo.followbar?.show === false) return
                let close_time = 0;
                let userId = store.state.login.userInfo.id
                if(userId){
                    close_time = localStorage.getItem(`bar_closetime${userId}`) -0 
                }
                let show=true;
                let time = new Date().getTime()
                let followbar = $decorator.getPage($Route).isTop.filter(v => v.id == 'followbar')[0];
                if((followbar && followbar.params.showtype == '2') && close_time>time){
                    show = false
                }
                $decorator.getPage($Route).setPageInfo({
                    followbar: {
                        show
                    },
                },'closeFollowbar/followbar.js')
            }catch(err) {
                console.error(err,'closeFollowbar')
            }

        },
        initFollowbar ($Route) {
            // 防止本次关闭后再次打开
            try{
                if(store.state.decorate.indexPage.pageInfo.followbar?.show === false) return
                let followbar = $decorator.getPage($Route).isTop.filter(v => v.id == 'followbar')[0];
                if(followbar && followbar.params.showtype != '2') {
                    let userId = store.state.login.userInfo.id
                    localStorage.removeItem(`bar_closetime${userId}`) 
                    $decorator.getPage($Route).setPageInfo({
                        followbar: {
                            show:true
                        },
                    },'initFollowbar/followbar.js')
                }
            }catch(err){
                console.error(err,'initFollowbar')
            }
        }
    }
}
export default new Followbar();