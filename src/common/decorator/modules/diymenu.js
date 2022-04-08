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
import store from '@/store'
import {ModuleMixin} from '../Mixin'
import {
    getPageType,
    getPageModuleName
} from '@/common/util.js'
const defaultDiymenu= {
    id: "diymenu",
    type: 'diymenu',
    name: '未命名自定义菜单',
    isbottom: 3,
    app_type: '0',
    cart_bgcolor: "#ff3c29",
    cart_number: "1",
    cart_num: 0,
    icon_position: "top",
    icon_type: "0",
    style: {
        'bgcolor': '#ffffff',
        bordercolor: '#eeeeee',
        'bgcoloron': '#ffffff',
        'iconcolor': '#565656',
        'iconcoloron': '#ff3c29',
        'textcolor': '#565656',
        'textcoloron': '#212121',
        'childtextcolor': '#212121',
        'childbgcolor': '#ffffff',
        'childactivebgcolor': '#e6e7eb',
    },
    items: [],
    params: {},
    data: []
}
class Diymenu extends ModuleMixin {
    constructor() {
        super()
        this.defaultDiymenu=defaultDiymenu
    }

    data={
        cacheCartNum:0, 
        isGettingNumber:null
    }
    beforeCreate(data,$Route,lazyLoader) {
       
    }
    methods={
        getDiymenu($Route) {
            //获取自定义菜单
            // 装修和非装修页都使用同一个菜单；只有自定义页面不同
            let type =  $decorator.getPageType($Route) == 0 ? 0 : 10;
            return new Promise((resolve,reject) => {
                this.getDecorateNewMenu({ //非装修页面请求商城默认菜单
                    type
                }).then(res => {
                    if (res.error == 0) {
                        res.menu.content.show = true
                        res.menu.content.cart_num = this.cacheCartNum
                        resolve(res.menu.content)
                        
                        $decorator.updateMenu(res.menu.content,type);
                        $decorator.getPage($Route).setPageInfo({
                            diymenu:res.menu.content
                        },'getDiymenu/diymenu.js')
                    } else {
                        reject()
                    }
                }).catch((err) => {
                    resolve({
                        id: 'diymenu',
                        err
                    })
                }).finally(() => {
                    $decorator.getPage($Route).setPageLoading(false)
                })
            })
        },
        getCartNum() { //获取购物车数量,入参为是否强制重新请求结果
    
            return  new Promise((resolve, reject) => {
                try{
                    if (!store.state.login.isLogin) {
                        resolve()
                        let detail_navbar = store.state.decorate.goodDetailPage.pageInfo['detail_navbar'] || {};
                        detail_navbar.params = Object.assign({}, detail_navbar.params, {
                            badge: 0
                        });
                        $decorator.getPage(11).setPageInfo({
                            detail_navbar
                        },'getCartNum/diymenu.js');
                    }else{
                        api.goodApi.getCartNum().then(res => {
                            if (res.error == 0) {
                                if (this.cacheCartNum != res.count) {
                                    this.cacheCartNum = res.count
                                    let detail_navbar = store.state.decorate.goodDetailPage.pageInfo['detail_navbar'] || {};
                                    detail_navbar.params = Object.assign({}, detail_navbar.params, {
                                        badge: res.count
                                    });
                                    $decorator.getPage(11).setPageInfo({
                                        detail_navbar
                                    },'getCartNum/diymenu.js');
            
                                    [0, 10, 11, 12, 20, -1].forEach((item) => { //同时更新全部页面的缓存
                                        $decorator.getPage(item).setPageInfo({
                                            diymenu: {
                                                cart_num: res.count
                                            }
                                        },'getCartNum/cart_num/diymenu.js')
                                    })
                                }
            
                            } else {
                                uni.showToast({
                                    title: res.message || '获取购物车信息失败',
                                    icon: 'none'
                                });
                            }
                            resolve(res);
                        }).catch((err) => {
                            reject()
                        })
                    }
                }catch(err){
                    reject(err)
                }
            }) 
        },
        getDecorateNewMenu({
            type
        }) {
            //获取自定义菜单
            return new Promise((resolve, reject) => {
                api.decorateApi.decorateNewMenu({
                            type
                        } //获取系统默认自定义菜单
                    ).then((res) => {
                        if (res.error === 0) {
                            let items = res.menu ?.content ?.items || []
                            if (items.length) {
                                items.forEach((item) => {
                                    if (item.target_url == '/kdxCart/index' && res.menu.content.cart_number == '1') {
                                        this.getCartNum()
                                    }
                                })
                            }
                            resolve(res)
                        } else {
                            res.show = false
                        }
    
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        }

    }
}
export default new Diymenu()