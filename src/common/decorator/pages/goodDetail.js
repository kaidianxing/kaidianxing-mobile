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
import {
    deepCopy,
    deepMerge,
    deepCompare
} from '@/common/objectTools.js'
import $decorator from '@/common/decorator'
import {PageMixin} from '../Mixin'
import {
    clearAllData,
    detail_spec,
    detail_sale,
    detail_swipe,
    detail_info,
    detail_navbar,
    detail_pullup,
} from '@/store/decorate/tools/goodDetail.js'

let cacheActivePagList = [],
    cacheNormalPageList = [];
let isActiveGood = false;
let onshowing = null;
let pageListGetting = null;
import {sessionStorage} from 'mp-storage'
import store from '@/store'

import { GOODS_ACTIVIYIES, SINGLE_BUY_ACTIVE } from '@/common/variable/activity'
import afterEacher from '@/router/afterEach/index.js'

import LoadingFun from "@/common/LoadingBox/loading";
import { INVALID_GOODS_CODE } from '@/common/variable/statusCode'

class GoodDetailPage extends PageMixin {
    _config = {
        store: 'decorate/goodDetailPage',
        pageType: 11,
        route: '/kdxGoods/detail/index'
    }

    constructor() {
        super()
    }

    data = {
        pageTopHeight: 0, //页面顶部高度
        pageBottomHeight: 0, //页面底部高度
        cachePagList: [],
        isBottom: [],
        isTop: [],
        isFixed: [],
        pageList: [], //装修后的页面模板数据,不包括置顶、置底、悬浮的装修组件
        pageInfo: {}, //各个页面的装修组件的对应页面实际的数据，包括置顶、置底、悬浮的装修组件
        detailInfo: {},
        optionsInfo: {},
        serviceList: [],
        activityList: [],
        areaList: [],
        pageListGetting: false, //节流
        onshowing: false,
        showSkeleten: true,
        pageSettings: {},
        goodId: null,
        forClearFormData: {},
        hasOnLoad: false,//页面是否已经加载完毕
        activeOptInfo: {},
    }
    methods = {
        getUrlParams($Route) {
            $decorator.setCurPagePath($Route);//缓存当前路由信息
            store.commit('setCurRoute', $Route);//缓存当前路由信息
            let obj = {}
            //#ifdef H5
            let route = utils.getRouteParams(location.href);
            let {
                goods_id,
                inviter_id
            } = {
                ...route.query,
                ...route.hashQuery
            };
            obj.goods_id = goods_id;
            if (inviter_id) {
                sessionStorage.setItem("inviter-id", inviter_id);
            }
            //#endif
            //#ifndef H5
            if ($Route.query.scene) {//扫码进入

                let arr = decodeURIComponent(decodeURIComponent($Route.query.scene)).split('&');
                for (let i = 0; i < arr.length; i++) {
                    let arr2 = arr[i].split('=');
                    obj[arr2[0]] = arr2[1];
                }
                if (obj?.inviter_id) {
                    sessionStorage.setItem("inviter-id", obj.inviter_id);
                }

                if (obj.custom_params) {
                    obj.liverId = JSON.parse(decodeURIComponent(obj.custom_params)).liverId
                }
            }
            if ($Route.query?.goods_id) {
                obj.goods_id = $Route.query.goods_id
            }
            // 小程序直播房间id
            if ($Route.query?.custom_params) {
                obj.liverId = JSON.parse(decodeURIComponent($Route.query.custom_params)).liverId
            }
            if ($Route.query?.inviter_id) {
                sessionStorage.setItem("inviter-id", $Route.query?.inviter_id);
            }
            //#endif
            return obj
        },

        getDetail(goods_id, liverId) {
            return new Promise(async (resolve, reject) => {
                if (!goods_id) {
                    resolve()
                    return
                }
                //  获取直播状态
                let isLogin = store.state.login.isLogin
                if (isLogin) {
                    try {
                        await $decorator.getPage('vipCenter').getUserInfo()
                    } catch (e) {

                    }
                }
                let query = {
                    goodId: goods_id
                }
                if (liverId) {
                    query.room_id = liverId
                }
                this.getGoodDetail(query).then(res => {
                    if (res.error == 0) {
                        this.toggleSkeleton(false, 'getDetail')
                        resolve(res)
                    } else {
                        reject()
                    }
                }).catch(() => {
                    resolve()
                });
            })
        },
        clearForm() {
            this.setData(['pageList'])
        },
        cacheGoodId(id) {
            this.goodId = id;
            this.setData(['goodId'])
        },

        setPageSettings(settings) {
            if (settings.title) {
                this.setPageTitle()
            }
            this.pageSettings = settings
            this.setData(['pageSettings'])
        },
        setPageLoading(loading) {
            if (this.pageLoading != loading) {
                this.pageLoading = loading
                this.setData(['pageLoading'])
            }
        },

        cacheActivePagList(list) {
            cacheActivePagList = deepCopy(list);
        },
        cacheNormalPageList(list) {
            cacheNormalPageList = deepCopy(list);
        },
        setPageList(list) {
            if (isActiveGood && !cacheActivePagList.length) {
                cacheActivePagList = deepCopy(list);
            } else if (!cacheNormalPageList.length) {
                cacheNormalPageList = deepCopy(list);
            }
            this._setPageList(list).then(() => {
                this.isBottom = this.isBottom.filter(item => item.id != 'diymenu')
                this.setData(['isBottom'])
            }).finally(() => {
                if (!this.pageListGetting) {
                    this.pageListGetting = true;
                    this.setData(['pageListGetting'])

                    pageListGetting = setTimeout(() => {
                        this.pageListGetting = false;
                        this.setData(['pageListGetting'])
                    }, 3000)
                }
            })
        },
        toggleSkeleton(bool = true, from) {
            // #ifdef H5
            if (!bool) {
                if (!this.hasOnLoad) {//防止接口返回比页面加载快造成闪屏的问题
                    setTimeout(() => {
                        this.toggleSkeleton(bool, from)
                    }, 60)
                    return
                }
            }
            // #endif
            if (this.showSkeleten != bool) {
                this.showSkeleten = bool
                this.setData(['showSkeleten'])
            }
        },
        clearAll(from) {
            this.toggleSkeleton(true, 'clearAll')
            this.goodId = '';
            isActiveGood = false;
            onshowing = null;
            pageListGetting = null;
            this.pageInfo = {
                ...this.pageInfo, 
                detail_info: {
                    params: {}
                },
                detail_navbar: {
                    params: {
                        badge: this.pageInfo?.detail_navbar?.params.badge
                    }
                },
                detail_sale: {
                    params: {}
                }
            }
            this.setPageInfo(clearAllData(), from + 'clearAll');
            this.setData(['pageList', 'goodId', 'showSkeleten', 'pageInfo'], true)
        },
        setGoodDetail(info) {

            this.detailInfo = {
                ...this.detailInfo,
                ...info
            }
            this.setData(['detailInfo'])
        },
        setOptionsInfo(res) {
            this.optionsInfo = res
            this.setData(['optionsInfo'])
        },
        getComments(goods_id) { //获取商品评价
            api.goodApi.getComments({
                goods_id: goods_id
            }).then(res => {

                if (res.error == 0) {
                    let params = {
                        total: res.total || 0,
                        praise: res.total || 0,
                    }
                    let data = res.list.map(item => {
                        let images = item.images
                        if (typeof item.images === 'string') {
                            images = JSON.parse(item.images)
                        }
                        /*if (images.length>4) {
                            images = images.slice(0,4)
                        }*/
                        return {
                            avart: item.avatar,
                            starnum: item.level, //星星数
                            username: item.nickname, //用户名
                            time: item.created_at,
                            content: item.content,
                            praise: 1, //1好评，0差评
                            spec: item.option_title,
                            images,
                            levelname: item.member_level_name
                        }
                    })
                    this.setPageInfo({
                        detail_comment: {
                            params,
                            data
                        }
                    }, 'getComments');
                }
            })
        },
        getGoodDetail(data, from) { //获取商品详情
            if (!data.goodId) {
                return Promise.reject('no gooid')
            }
            
            return new Promise((resolve, reject) => {
                let query = {
                    id: data.goodId * 1
                }
                

                if (data.room_id) {
                    query.room_id = data.room_id
                }
                api.goodApi
                    .goodDetail(query)
                    .then(res => {
                        // if (this.goodId != data.goodId&&this.goodId) { //防止接口过慢，页面切换过快；导致更新错误
                        //     reject(this.goodId)
                        //     return
                        // }
                        this.pageInfo={
                            ...this.pageInfo,
                            detail_navbar:{
                                params: {
                                    badge:this.pageInfo?.detail_navbar?.params.badge
                                }
                            }
                        }  
                        let activeName;
                        let hasOption = false;
                        let goodsType ;
                        if (res.error == 0) {
                            hasOption = res.data.goods.has_option == '1'
                            goodsType = res.data.goods.type;
                            isActiveGood = GOODS_ACTIVIYIES.some(key => {
                                if (res.activity && !!res.activity[key]) {
                                    activeName = key
                                }
                                return res.activity && !!res.activity[key]
                            }); //是否活动商品
                            
                        }

                        // 秒杀获取单独规格
                        if (activeName == 'seckill' && hasOption) {
                            this.getActiveGoodsOption({
                                goods_id: data.goodId,
                                activeName: 'seckill'
                            })
                        } else if(activeName == 'groups' && hasOption) {
                            this.getActiveGoodsOption({
                                goods_id: data.goodId,
                                activeName: 'groups'
                            })
                        } else {
                            this.activeOptInfo = {
                                options: [],
                                spec: [],
                                activeName
                            };
                            this.setData(['activeOptInfo'])
                        }
                        

                        if (hasOption) {
                            this.getGoodsOption({
                                goods_id: data.goodId,
                                is_original_buy: SINGLE_BUY_ACTIVE.includes(activeName),
                                type: goodsType
                            })
                        } else {
                            this.setOptionsInfo({
                                options: [],
                                spec: [],
                            });
                        }

                        if (isActiveGood && cacheActivePagList.length) {
                            this.setPageList(deepCopy(cacheActivePagList))
                        } else if (!isActiveGood && cacheNormalPageList.length) {
                            this.setPageList(deepCopy(cacheNormalPageList))
                        }
                        resolve(res)
                        if (res.error == 0) {
                            this.setGoodDetail(res)
                            let goods = res?.data?.goods;
                            let activity = res?.activity;
                            let info = {
                                detail_spec: detail_spec(goods, activity,res),
                                detail_sale: detail_sale(goods, res),
                                detail_swipe: detail_swipe(goods),
                                detail_info: detail_info(goods, activity, res.data?.dispatch_template, res.intracity),
                                detail_navbar: detail_navbar(res),
                                detail_pullup: detail_pullup(goods),
                            }
                            this.setPageInfo(info, 'getGoodDetail');
                            this.toggleSkeleton(false, 'getGoodDetail')
                        } else {
                            uni.showToast({
                                title: res.message ? res.message : '请求错误',
                                icon: 'none',
                            })
                            
                            // 商品不存在跳转失效页面
                            if(res.error === INVALID_GOODS_CODE){
                                LoadingFun.hideLoading()
                                uni.redirectTo({url: '/kdxGoods/invalid/index'})
                            }
                        }
                    }).catch((err) => {
                        reject(err)
                        uni.showToast({
                            title: '网络错误',
                            icon: 'none',
                        })
                    });

                this.getComments(data.goodId)
            })
        },
        getGoodsOption({
            goods_id,
            is_original_buy,
            type
        }) {
            let params = {
                goods_id
            }
            if (is_original_buy) {
                params.is_original_buy = '1'
            }
            return new Promise((resolve, reject) => {
                api.goodApi
                    .getGoodOptions(params)
                    .then(res => {
                        if (res.error == 0) {
                            this.setOptionsInfo(res);
                            resolve(res)
                        }
                    }).catch(err => {
                        reject(err)
                    });
            })
        },
        getActiveGoodsOption({
            goods_id,
            activeName,
            team_id
        }) {
            let params = {
                goods_id
            }

            return new Promise((resolve, reject) => {
                api.goodApi
                    .getGoodOptions(params)
                    .then(res => {
                        if (res.error == 0) {
                            this.activeOptInfo = {
                                ...res,
                                activeName
                            };
                            this.setData(['activeOptInfo'])
                            resolve(res)
                        }
                    }).catch(err => {
                        reject(err)
                    });
            })
        },
        // 存储活动规格信息
        setActiveOptInfo(data) {
            this.activeOptInfo = data;
            this.setData(['activeOptInfo'])
        }
    }

    onShow() {
        if (!this.onshowing && this.pageList.length) {
            this.onshowing = true;
            this.setData(['onshowing'])
            onshowing = setTimeout(() => {
                this.onshowing = false;
                this.setData(['onshowing']);
            }, 3000)
        }
        if (store.state.login.isLogin && !this.pageInfo.diymenu) {
            $decorator.getModule('diymenu').getCartNum();//获取购物车数量
        }
    }

    onLoad() {
        this.hasOnLoad = true;
        this.pageInfo = {
            ...this.pageInfo,
            detail_navbar: {
                params: {
                    badge: this.pageInfo?.detail_navbar?.params.badge
                }
            }
        }
        $decorator.getModule('gotop').onPageOnload(11)

        this.setData(['pageInfo', 'showSkeleten', 'hasOnLoad'])
    }
    onUnload(e) {
        clearTimeout(onshowing);
        clearTimeout(pageListGetting);
        this.hasOnLoad = false;
        this.onshowing = false;
        this.pageListGetting = false;
        this.detailInfo = {}
        this.clearAll('onUnload')
        this.clearForm()
        // console.log('onUnload!!!!!!')
        this.setData(['onshowing', 'pageListGetting', 'hasOnLoad', 'detailInfo'])
    }

}

export default new GoodDetailPage()