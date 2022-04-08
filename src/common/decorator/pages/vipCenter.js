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
import store from '@/store' 
import $decorator from '@/common/decorator' 
import {PageMixin} from '../Mixin'
class VipCenterPage  extends PageMixin {
    _config={
        store:'decorate/vipcenterPage',
        pageType:12,
        route:'/kdxMember/index/index'
    }
    constructor(){
        super()
    }
    data={
        pageTopHeight: 0, //页面顶部高度
        pageBottomHeight : 0, //页面底部高度
        cachePagList : [],
        isBottom : [],
        isTop : [],
        isFixed : [],
        pageList : [], //装修后的页面模板数据,不包括置顶、置底、悬浮的装修组件
        pageInfo : {}, //各个页面的装修组件的对应页面实际的数据，包括置顶、置底、悬浮的装修组件
        pageLoading : true,
        pageListGetting : false, //节流
        onshowing : false,
        pageSettings : {},
        forClearFormData : {},
        
    }
    methods={
        clearAll() {
            this.onshowing = false;
            this.pageListGetting = false;
        },
        setPageLoading(loading) {
            if (this.pageLoading != loading) {
                this.pageLoading = loading
                this.setData(['pageLoading'])
            }
        },
    
        setPageList(list) {
            this._setPageList(list)
            if (!this.pageListGetting) {
                this.pageListGetting = true;
                this.setData(['pageListGetting']) 
                setTimeout(() => {
                    this.pageListGetting = false;
                    this.setData(['pageListGetting'])
                }, 3000)
            }
        },
        initMember() {
            this.setPageInfo({ //初始化会员信息
                member: {
                    info: {
                        avatar: '',
                        nickname: '',
                        levelname: '',
                        textmoney: store.state.setting.systemSetting.balance_text || '余额',
                        textcredit: store.state.setting.systemSetting.credit_text || '积分',
                        money: '',
                        credit: '',
                        cardnum: '-',
                    },
                    params: {}
                },
            },'initMember/vipCenter.js')
        },
        setPageSettings(settings) {
            this.pageSettings = settings
            this.setPageTitle()
            this.setData(['pageSettings'])
        },
        reqUserInfo(){
            return new Promise((resolve, reject) => {
                api.memberApi.getUserInfo().then(res=>{
                    resolve(res)
                    if(res.error==0&&res.StatusCode!=302){
                        store.commit('login/setUserInfo',res.data)
                    }
                }).catch(err=>{
                    reject(err)
                })
            })
        },
        getUserInfo() {
            this.initMember(); //在接口请求到数据之前先清空不必要的参数
            return new Promise((resolve, reject) => {
                if (store.state.login.isLogin) {
                    this.reqUserInfo().then(res => {
                        if (res.error == 0) {
                            let data = res.data
                            let member = {
                                info: {
                                    avatar: data.avatar,
                                    nickname: data.nickname || data.mobile || '-',
                                    levelname: data.level_name,
                                    textmoney: store.state.setting.systemSetting.balance_text || '余额',
                                    textcredit: store.state.setting.systemSetting.credit_text || '积分',
                                    money: data.balance,
                                    credit: data.credit,
                                    cardnum: 0,
                                    coupon: data.coupon_total + '',
                                },
                                params: {
                                    enterMyShop:false,
                                }
                            }
                            let bindmobile = {}
                            if (data.mobile) {
                                bindmobile = {
                                    params: {
                                        title: '已绑定手机' + data.mobile,
                                        mobile: data.mobile,
                                        show: false
                                    }
                                }
                            } else {
                                bindmobile = {
                                    params: {
                                        mobile: data.mobile,
                                    }
                                }
                            }
                            member.params.enterMyShop =res.merchant?.is_settled||false; //显示商户入驻‘我的店铺’的进入按钮
                            member.params.wxapp_auth_token=res.merchant?.wxapp_auth_token||'';//管理端小程序的token
                            member.params.wxappid=res.merchant?.app_id||'';//管理端小程序的token
                          
                            this.setPageInfo({
                                member,
                                bindmobile
                            },'getUserInfo/vipCenter.js')
                        }
                        resolve(res)
                    })
    
                }
            })
    
        }
    }
    onLoad() {
        this.setPageTitle()
        $decorator.getModule('gotop').onPageOnload(12)
        if(store.state.login.isLogin && !this.pageInfo.diymenu){
            $decorator.getModule('diymenu').getCartNum();//获取购物车数量
        }
    } 
    onShow() {
        if (!this.onshowing && this.pageList.length) {
            this.onshowing = true;
            this.setData(['onshowing'])
            setTimeout(() => {
                this.onshowing = false;
                this.setData(['onshowing'])
            }, 3000)
        }
    }
    onUnload() {
        this.clearAll()
    }
   
}
export default new VipCenterPage();