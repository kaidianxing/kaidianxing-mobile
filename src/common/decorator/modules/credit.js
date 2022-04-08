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
import store from '@/store'
import * as utils from '@/common/util.js'
import $decorator from '@/common/decorator.js'
import {ModuleMixin} from '../Mixin'
class Credit extends ModuleMixin{
    constructor() {
        super()
    }
    // beforeCreate(res, $Route, lazyLoader) {
    //     $decorator.getPage($Route).setPageInfo({
    //         [res._comIndex_]: {
    //             data: []
    //         }
    //     });//防止闪现
    //     // this.getGoodsList(res,$Route).then(res=>{
    //     //     lazyLoader.checkPageList();
    //     // })
    // }

    beforeCreate(res,$Route,lazyLoader){
        this.getUserInfo($Route).then(res=>{
            lazyLoader?.checkPageList();
        }).catch(()=> {

        })
    }
    methods={
        reqUserInfo(){
            return new Promise((resolve, reject) => {
                api.memberApi.getUserInfo().then(res=>{
                    resolve(res);
                    if(res.error==0&&res.StatusCode!=302){
                        store.commit('login/setUserInfo',res.data)
                    }
                }).catch(err=>{
                    reject(err)
                })
            })
        },
        getUserInfo($Route) {
            console.log(333);
            // this.initMember(); //在接口请求到数据之前先清空不必要的参数
            return new Promise((resolve, reject) => {
                if (store.state.login.isLogin) {
                    this.reqUserInfo().then(res => {
                        if (res.error == 0) {
                            let data = res.data
                            let info = {
                                avatar: data.avatar,
                                nickname: data.nickname || data.mobile || '-',
                                textcredit: store.state.setting.systemSetting.credit_text || '积分',
                                credit: data.credit,
                            };
                            $decorator.getPage($Route).setPageInfo({
                                credit: {
                                    info
                                }
                            },'getUserInfo/credit.js')
                        }
                        resolve(res)
                    })

                }
            })

        }
    }
}
export default new Credit()