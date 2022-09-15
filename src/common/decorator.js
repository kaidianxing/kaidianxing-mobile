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
/**
 * 工具函数
 */
import {
    getDecorateModel
} from '@/store/decorate/tools/decorate.js'

import {
    watch,
    computed
} from './decorator/WatchComputed.js'
import eventBus from './eventBus.js'
import DataSetter from './decorator/DataSetter.js';

let paths = require.context('./decorator/modules', false, /\/.*\.js$/); //获取当前全部路由
let modules = {}; //各个模块的集合
let moduleName = '';
import * as utils from '@/common/util.js'

let pageType = {}
let pageModuleName = {}

function mixin(obj) {
    if (obj.data) {
        for (let key in obj.data) {

            obj[key] = obj.data[key]
        }
    }
    if (obj.methods) {
        for (let key in obj.methods) {
            obj[key] = obj.methods[key]
        }
    }

    computed(obj, obj.computed)
    watch(obj, obj.watch)
}

paths.keys().map(item => { //获取本级目录下的全部配置参数
    moduleName = item.replace(/(\.\/|\.js)/g, '')
    let module = paths(item);
    modules[moduleName] = module.default ? module.default : module;
    modules[moduleName] && mixin(modules[moduleName])
});
paths = require.context('./decorator/pages', false, /\/.*\.js$/); //获取当前全部路由
let pages = {}; //各个模块的集合
let pagesName = '';
paths.keys().map(item => { //获取本级目录下的全部配置参数
    pagesName = item.replace(/(\.\/|\.js)/g, '')
    let module = paths(item);
    pages[pagesName] = module.default ? module.default : module;
    pages[pagesName] && mixin(pages[pagesName])
    let config = pages[pagesName]._config
    if (config) {
        pageType[pagesName] = config.pageType
        pageModuleName[pagesName] = pagesName
        for (let k in config) {
            pageType[config[k]] = config.pageType
            pageModuleName[config[k]] = pagesName
        }
    }
});
let throttle = {}
let isGettingDecorateModel = {}, //集中处理装修接口请求后续操作
    haveRequested = {}; //已经请求过的装修接口，如无错误就不再请求

class Decorator {
    /* 其他功能默认模板数据 */
    diymenu = null //自定义底部菜单
    /* 通用装修动态数据模板 */
    curPageType = 10 //当前页面的类型缓存
    tabbarPages = {} //作为tabbar页面的页面
    pagePath = '' //当前页面路由
    pageQuery = {}
    pageInfo = {} //当前页面的数据
    maskStatus = false
    loaded = false
    formData = {}
    mixin = null;
    pageModuleName = null
    pageType = null;
    fixedsearch = null;
    search = null;
    constructor() {
        this.pageModuleName = pageModuleName
        this.pageType = pageType

        this.mixin = new DataSetter(this)
    }

    getPageModuleName(page) {
        return this.pageModuleName[page] || 'others'
    }

    getPageType(page) {
        if (typeof page == 'object') {
            page = page.path
        }
        return this.pageType[page] ?? -1
    }

    setData(data) {
        this.mixin.updateState('decorate/updateState', data)
    }

    initStatus() {
        if (this.loaded) return
        this.loaded = true
        this.getPage('index').setTopmenuActive(0)
        this.setData(['loaded'])
    }

    refreshForm(val) {
        this.formData = {
            val
        }
        this.setData(['formData'])
    }

    setMaskStatus(status) {
        this.maskStatus = status
        this.setData(['maskStatus'])
    }

    getModule(name) {
        return modules[name]
    }

    getPage(name) {
        if (typeof name == 'object' && name.path) {
            name = name.path
        }
        let pageName = this.getPageModuleName(name)
        return pages[pageName]
    }

    getRouteParams(query, pagePath) {
        let pageQuery = query
        try {
            // #ifdef H5
            let route = utils.getRouteParams(location.href);
            let routeQuery = {
                ...route.query,
                ...query,
            }
            if (pagePath != '/kdxCustom/index/index') {
                delete routeQuery.pageId
            }
            pageQuery = routeQuery
            // #endif
        } catch (e) {
            console.log(e, 'ooo')
        }
        return pageQuery
    }

    setCurPagePath({
        path: pagePath,
        query
    }) {
        this.pagePath = pagePath; //本次请求的页面路径
        this.pageQuery = this.getRouteParams(query, pagePath);
        this.curPageType = this.getPageType(pagePath); //保存当前页面类型
        this.setData(['pagePath', 'pageQuery', 'curPageType'])
        if (!throttle[pagePath + '_onshow']) { //触发onShow事件
            throttle[pagePath + '_onshow'] = true;
            this.getPage(this.curPageType).onShow()
            setTimeout(() => {
                throttle[pagePath + '_onshow'] = null;
            }, 1000)
        } else {
            return
        }
    }

    updateMenu(menu, pageType) {
        this.diymenu = menu
        this.tabbarPages = {}
        let key = ''
        menu.items.map(item => {
            if (item.child.length) {
                item.child.forEach(child => {
                    // 适配云智服，防止链接字段是一个对象
                    if (typeof child.target_url !== 'string') {
                        return
                    }

                    key = child.target_url.trim().replace(/\./g, '^')
                    if (key.indexOf('/') == 0) {
                        this.tabbarPages[key] = key
                    }


                })
            } else {
                // 适配云智服，防止链接字段是一个对象
                if (typeof item.target_url !== 'string') {
                    return
                }

                key = item.target_url.trim().replace(/\./g, '^')
                if (key.indexOf('/') == 0) {
                    this.tabbarPages[key] = key
                }
            }
        });
        if (pageType == 10) {
            this.getPage(-1).setPageList([menu]);
        }
        this.setData(['diymenu', 'tabbarPages'])
    }

    /**
     * ##################################这是装修功能的起点######################################
     */
    getDecorateModel({
        pagePath = '', //页面路由
        noParams = false, //
        forceRefresh = false, //是否强制更新，
        otherdata = null
    }) {
        return getDecorateModel({
            pagePath, //页面路由
            noParams, //
            forceRefresh, //是否强制更新，
            otherdata
        })
    }
    onGetMorePageList(newAdd, lazyLoader, $Route) {
        if (!this.fixedsearch) {
            setTimeout(() => {
                for (let k in newAdd) {
                    let tmp = newAdd[k];
                    let module = this.getModule(tmp.id)
                    if (tmp.id == 'fixedsearch') {
                        this.fixedsearch = module
                        break;
                    }
                }
            })
        }
        if (!this.search) {
            setTimeout(() => {
                for (let k in newAdd) {
                    let tmp = newAdd[k];
                    let module = this.getModule(tmp.id)
                    if (tmp.id == 'search') {
                        this.search = module
                        break;
                    }
                }
            })
        }
        setTimeout(() => {
            for (let k in newAdd) {
                let tmp = newAdd[k];
                let module = this.getModule(tmp.id)
                if (module && typeof module.beforeCreate == 'function') {
                    module.beforeCreate(tmp, $Route, lazyLoader)
                }
            }
        }, 0)
    }
}
const $decorator = new Decorator()
$decorator.$on = eventBus.$on.bind(eventBus)
$decorator.$off = eventBus.$off.bind(eventBus)
$decorator.$emit = eventBus.$emit.bind(eventBus)
$decorator.$once = eventBus.$once.bind(eventBus)

export default $decorator