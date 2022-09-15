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
import {
    createPageList,
} from '@/store/decorate/tools/Global'
import $decorator from '@/common/decorator'
import { PageMixin } from '../Mixin'
class IndexPage extends PageMixin {
    _config = {
        store: 'decorate/indexPage',
        pageType: 10,
        route: '/pages/index/index'
    }
    constructor() {
        super()
    }
    data = {
        topmenuActive: 0,
        pageTopHeight: 0, //页面顶部高度
        pageBottomHeight: 0, //页面底部高度
        cachePagList: [],
        isBottom: [],
        isTop: [],
        isFixed: [],
        pageList: [], //装修后的页面模板数据,不包括置顶、置底、悬浮的装修组件
        pageInfo: {}, //各个页面的装修组件的对应页面实际的数据，包括置顶、置底、悬浮的装修组件
        pageLoading: true,
        pageListGetting: false, //节流
        onshowing: false,
        pageSettings: {},
        forClearFormData: {},
        showSkeleten: true,
        customPageList: {
            0: [],
        },
        customPageSettings: {
            0: {
                title: '',
                background_color: ''
            }
        },
        turnStatus: false
    }
    methods = {
        clearAll() {
            // this.turnTab({key: 0}); // 切换页面初始化顶部菜单
            this.onshowing = false;
            this.pageListGetting = false;
            // this.topmenuActive =0
            this.setData(['topmenuActive', 'pageList', 'onshowing', 'pageListGetting'])
        },
        setPageSettings(settings) {
            this.customPageSettings[0] = {
                ...settings
            };
            this.pageSettings = settings
            this.setPageTitle()
            this.setData(['pageSettings', 'customPageSettings'])
        },
        setPageLoading(loading) {
            if (this.pageLoading != loading) {
                this.pageLoading = loading
                this.setData(['pageLoading'])
            }
        },

        setPageList(list, from, tabIndex = 0) {
            try {
                uni.setNavigationBarTitle({
                    title: this.pageSettings?.title || '首页',
                });
                this._setPageList(list).then(() => {
                    this.customPageList[tabIndex] = list
                }).finally(() => {
                    if (!this.pageListGetting) {
                        this.pageListGetting = true;
                        this.setData(['pageListGetting'])
                        setTimeout(() => {
                            this.pageListGetting = false;
                            this.setData(['pageListGetting'])
                        }, 1000)
                    }
                })
            } catch (e) {
                console.log(e, '?????')
            }
        },
        setTopmenuActive(index) {
            this.topmenuActive = index
            this.setData(['topmenuActive'])
        },
        // 存储自定义页面的配置
        saveCustomPageSettings({
            key,
            settings
        }) {
            if (key == 0) return
            this.customPageSettings[key] = settings
            this.setData(['customPageSettings'])
        },
        // 修改自定义页面的背景色
        setPageBackground(bgColor) {
            this.pageSettings.background_color = bgColor || '#f5f5f5'
            this.setData(['pageSettings'])
        },
        turnTab({
            key,
            pageId,
            forceRefresh = false
        }) {
            if (!this.customPageList[key]) {
                this.customPageList[key] = []
            } else if (this.customPageList[key].length && [...this.customPageList[key]].pop().id == 'notice_modules') {
                this.customPageList[key] = []
            }
            this.setData(['customPageList'])
            if (this.customPageList[key].length && !forceRefresh) {
                // 同步顶部菜单
                if (key != 0) {
                    let topmenu = this.customPageList[0].filter(item => item.id == 'topmenu')[0]
                    this.customPageList[key].forEach(val => {
                        if (val.id == 'topmenu') {
                            Object.assign(val.data, topmenu.data)
                        }
                    })
                    this.setData(['customPageList'])
                }
                this.setPageBackground(this.customPageSettings[key]?.background_color)
                this.setPageList(this.customPageList[key], 'turnTab1', key)
                this.setTopmenuActive(key)
            } else {
                // uni.showLoading({title:'加载中'})
                this.getCustomPage(pageId, key).then((res) => {
                    this.saveCustomPageSettings({
                        key,
                        settings: res.page.common
                    })
                    this.setPageBackground(res.page.common?.background_color)
                    this.setPageList(createPageList(res), 'turnTab2', key)
                }).catch((err) => {
                    if (err instanceof Array) {
                        let notice = err[err.length - 1]
                        this.setPageList(err, 'turnTab', key)
                        this.setPageInfo({
                            notice_modules: {
                                content: '登录',
                                showBtn: notice.error == 321000,
                                type: 'login'
                            },
                        }, 'turntab/index.js')
                    }
                }).finally(() => {
                    this.setTopmenuActive(key)
                    uni.hideLoading()
                })
            }
        },
        getCustomPage(id, key = 0) {
            return new Promise((resolve, reject) => {
                let params = {
                    type: '10'
                }
                if (id) {
                    params = {
                        id,
                        type: '0'
                    }
                }
                let locParam = store.state.setting?.locationPosition
                if (locParam) {
                    params = {
                        ...params,
                        ...locParam
                    }
                }
                api.decorateApi.decorateNewIndex(params).then(res => {
                    if (res.error === 0) {
                        if (!res.page) {
                            uni.showToast({
                                title: '当前页面不存在',
                                icon: 'none'
                            })
                            res.page = {
                                content: []
                            }
                            // 处理tab页面删除
                            this.turnTab(0,id)
                        }
                        if (key > 0) {
                            let defaultItem = this.customPageList[0] || this.isTop
                            let arr = defaultItem.filter(v => v.istop > 0)
                            res.page.content = res.page.content.filter(v => !v.istop || v.istop == '0');// 解决之前数据携带顶部菜单的bug
                            res.page.content.push(...arr);
                        }
                        // 解决之前数据携带自定义菜单的bug
                        res.page.content = res.page.content.filter(item => item.type != 'diymenu')
                        let diymenu = this.isBottom.filter(v => v.id == 'diymenu')[0]
                        res.menu = diymenu
                        resolve(res)
                    } else if (res.error == 321001) {
                        let defaultItem = this.customPageList[0] || this.isTop
                        let arr = defaultItem.filter(v => v.id == 'topmenu' || v.id == 'followbar')
                        reject([...arr, {
                            id: 'notice_modules',
                            imgName: 'have_no_browse_perm.png',
                            tip: '暂无浏览权限，请联系商城管理员',
                            showBtn: false,
                            error: 321001
                        }])

                    } else if (res.error === 321000) {
                        store.commit('login/setModal', true)
                        let defaultItem = this.customPageList[0] || this.isTop
                        let arr = defaultItem.filter(v => v.id == 'topmenu' || v.id == 'followbar')
                        reject([...arr, {
                            id: 'notice_modules',
                            imgName: 'have_no_browse_perm.png',
                            tip: '请登录后查看',
                            error: 321000
                        }])
                    }
                })
            })
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
    onUnload(type) {
        //#ifdef H5
        let query = utils.getRouteParams(location.href).query
        if (query.previewId) {//预览时的首次加载，from与to相同导致onUnload运行
            return
        }
        //#endif
    }
    onLoad() {
        this.setPageTitle()
        $decorator.getModule('gotop').onPageOnload(10)
        const FLG = store.state?.decorate?.indexPage?.topmenuActive || 0;
        this.topmenuActive = FLG;
        this.pageListGetting = false
        this.setData(['topmenuActive', 'pageListGetting'])

        if (store.state.login.isLogin && !this.pageInfo.diymenu) {
            $decorator.getModule('diymenu').getCartNum();//获取购物车数量
        }
        if (this.customPageList[FLG]?.length) {
            this.setPageList(createPageList({
                page: {
                    content: this.customPageList[FLG]
                }
            }), 'onLoad', FLG)
        } else {
            this.customPageList = {}
            this.setData(['customPageList'])
        }
    }


}
export default new IndexPage()