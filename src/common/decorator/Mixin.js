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
import * as utils from '@/common/util.js'
import DataSetter from './DataSetter.js';
import {
    setPageBottomHeight,
    setPageTopHeight
} from '@/store/decorate/tools/Global'
import store from '@/store'
import $decorator from '@/common/decorator'
import {
    deepCopy,
    deepMerge,
    deepCompare
} from '@/common/objectTools.js'
import Vue from 'vue'
class Common {
    dataSetter = null;
    moduleName = '';
    constructor() {
        this.dataSetter = new DataSetter(this);
    }
    setData(data, forceRefresh = false) {
        if (this._config?.store) {
            this.dataSetter.updateState(this._config.store + '/updateState', data, forceRefresh)
        }
    }
    getStore() {
        if (!this.moduleName) {
            if (this._config?.store) {
                this.moduleName = this._config.store.replace('decorate/', '')
            } else {
                return
            }
        }
        return store.state.decorate[this.moduleName]
    }
}
export class PageMixin extends Common {
    constructor() {
        super();
    }
    setPageTitle(title) {
        setTimeout(() => {
            if (this._config.route == Vue.prototype.$Route.path) { // 页面path和装修route一致时才会更新
                if (this.pageSettings?.title || title) {
                    if (typeof title == 'string' && title.length > 11) {
                        title = title.substring(0, 11) + "…"
                    }
                    uni.setNavigationBarTitle({
                        title: title || this.pageSettings.title
                    })
                }
            }
        })
    }
    setPageInfo(info, from) {
        return new Promise((resolve, reject) => {
            if (!this._config) {
                resolve()
                return
            }
            if (info && this._config.pageType !== undefined) {
                this.dataSetter.createPageInfo(info, this._config.pageType).then(pageInfo => {
                    this.pageInfo = pageInfo
                    this.setData(['pageInfo'])
                    resolve()
                }).catch(() => {
                    resolve()
                });
            } else {
                resolve()
            }
            this?.setPageTopHeight?.()
            this?.setPageBottomHeight?.()
        })
    }
    setPageBottomHeight() {
        //页面底部高度
        this.pageBottomHeight = setPageBottomHeight(this.isBottom, this.pageInfo)
        this.setData(['pageBottomHeight'])
    }
    setPageTopHeight() {
        //页面顶部高度
        this.pageTopHeight = setPageTopHeight(this.isTop, this.pageInfo);
        this.setData(['pageTopHeight'])
    }
    _setPageList(list) {
        return new Promise((resolve, reject) => {
            if (!deepCompare(this.cachePagList, list)) {
                this.cachePagList = deepCopy(list);
                this.isBottom = [];
                this.isTop = [];
                this.isFixed = [];
                this.pageList = list.filter(item => {
                    if (item.id == 'detail_swipe') { //去除无用参数
                        item.params.video_thumb = ''
                        item.params.video = ''
                        item.data = []
                    }
                    if (item.id) {
                        if (item.isfixed) {
                            this.isFixed.push(item)
                        } else if (item.isbottom) {
                            this.isBottom.push(item)
                        } else if (item.istop) {
                            this.isTop.push(item)
                        }
                    }
                    return item.id && !item.isfixed && !item.isbottom && !item.istop
                })
                if (this.pageInfo.gotop) {
                    this.pageInfo.gotop.show = false;
                }

                this.isTop = this.isTop.sort((a, b) => b.istop - a.istop);
                this.isBottom = this.isBottom.sort((a, b) => a.isbottom - b.isbottom);
                if (this.isTop.length) {
                    this.setPageTopHeight()
                }
                if (this.isBottom.length) {
                    this.setPageBottomHeight()
                }
                this.setData(['cachePagList', 'isBottom', 'isTop', 'isFixed', 'pageList', 'pageInfo', 'forClearFormData', 'customPageList'])
                resolve()
            } else {
                reject()
            }
        }).catch(err => {
        })
    }

}


export class ModuleMixin extends Common {
    constructor() {
        super()
    }

}
