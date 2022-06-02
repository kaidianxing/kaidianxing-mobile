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
import getSessionId from '@/common/request/getSessionId'
import {localStorage} from 'mp-storage'
import store from '@/store'
import {openLiver} from '@/common/util'
import {hasBindBySence} from '@/common/helper/user';

/**
 * 注意组件名称等于文件名，等于组件id
 */
let handler = {};
handler.banner = {
    clickImg(data) {
        // #ifdef MP-WEIXIN
        if (!data.linkurl) {
            checkToLive(data)
            return
        }
        // #endif

        if (data.linkurl) {
            this.$Router.auto(data.linkurl, {wxappid: data.wxappid})
            return;
        }

        if (store.state.setting?.systemSetting?.basic?.photo_preview == '1') {
            uni.previewImage({
                urls: data.items,
                current: data.index,
                indicator: 'number'
            })
        }
    }
}
handler.detail_navbar = {
    clickItem(data) {
    }
}
handler.bindmobile = {
    clickBtn(data) {
        if (this.$store.state.login.isLogin) {
            if (data.params.mobile) {
                this.$Router.auto('/kdxMember/bindTel/index')
            } else {
                // #ifndef MP-WEIXIN
                this.$Router.auto({
                    path: '/kdxMember/bindTel/mobile'
                })
                // #endif
                // #ifdef MP-WEIXIN
                this.$store.commit('login/setModal', true)
                // #endif
            }
        } else {
            this.$store.commit('login/setModal', true)
        }
    }
}

handler.blockgroup = {
    clickItem(data) {
        if (data.linkurl) {
            this.$Router.auto(data.linkurl)
        }
    }
}

handler.coupon = {
    receiveCoupon(data) {
        if (data.pick_type == '1') {
            this.$Router.auto({
                path: '/kdxMember/coupon/detail/index',
                query: {
                    id: data.id
                }
            })
        } else {
            this.$Router.auto({
                path: '/kdxMember/coupon/list/index'
            })
        }
    }
}
handler.distributor = {
    checkLevel() {
        this.$Router.auto({
            path: '/kdxCommission/level',
        })
    },
    goWithDraw() {
        this.$Router.auto({
            path: '/kdxCommission/withdraw/index',
        })
    },
    checkCommission() {
        this.$Router.auto({
            path: '/kdxCommission/toAccount',
        })
    }
}
handler.diymenu = {
    clickItem(data) {
        /**
         * 这里分h5和非h5，因为小程序有首页按钮；h5没有
         */
        if (data.length == 2 && !!data[0].target_url && data[0].child?.length == 0) {
            this.$Router.auto(data[0].target_url, {wxappid: data[0].wxappid})
        } else if (data.length == 4 && data[2].target_url) {
            this.$Router.auto(data[2].target_url, {wxappid: data[2].wxappid})
        }
    }
}
handler.fixedsearch = {
    clickLeftIcon(data) {
        if (data.params.leftnav == 1) {//图标
            if (data.params.lefticonlink) {
                this.$Router.auto(data.params.lefticonlink, {wxappid: data.params.lefticon_wxappid})
            }
        } else {//图片
            if (data.params.leftimglink) {
                this.$Router.auto(data.params.leftimglink, {wxappid: data.params.leftimg_wxappid})
            }
        }

    },
    clickInput(data) {
        this.$Router.auto({
            path: '/kdxGoods/search/index'
        })
    },
    clickRightIcon(data) {
        if (data.params.rightnav == 1) {//图标
            if (data.params.righticonlink) {
                this.$Router.auto(data.params.righticonlink, {wxappid: data.params.righticon_wxappid})
            }
        } else {//图片
            if (data.params.rightimglink) {
                this.$Router.auto(data.params.rightimglink, {wxappid: data.params.rightimg_wxappid})
            }
        }
    }
}
handler.icongroup = {
    clickItem(data) {
        if (data.linkurl) {
            this.$Router.auto(data.linkurl, {wxappid: data.wxappid})
        }
    }
}
handler.gotop = {
    clickGoTop(data) {
        // #ifdef MP-WEIXIN
        if (data.params.gotopclick == 1 && !data.params?.linkurl) {
            checkToLive({
                keyLink: data.params.keyLink || '',
                noticeId: data.params.noticeId || '',
                linkurl_name: data.params.linkurl_name
            })
            return
        }
        // #endif

        if (data.params.gotopclick == 1 && data.params.linkurl) {
            this.$Router.auto({
                path: data.params.linkurl
            }, {wxappid: data.params.wxappid})
        } else {
            uni.pageScrollTo({
                scrollTop: 0,  //距离页面顶部的距离
                duration: 300
            });
        }

    }
}
handler.listmenu = {
    clickSubtitle(data) {
        this.$Router.auto(data.linkurl, {wxappid: data.wxappid})
    }
}

handler.logout = {
    logout() {
        this.localStorage.setItem('session-id', '')
        this.sessionStorage.setItem('promiser', '')
        getSessionId().then(res => {
            if (res) {
                this.$store.commit('login/setLogin', false)

                this.$Router.replaceAll({
                    //#ifndef H5
                    path: '/pages/index/index',
                    //#endif
                    //#ifdef H5
                    path: '/'
                    //#endif
                })
            }
        })
    }
}
handler.member = {
    clickIcon(data) {
        if (data.value.params.setlink) {
            this.$Router.auto(data.value.params.setlink, {wxappid: data.value.params.set_wxappid})
        }
    },
    clickMemberInfo() {
        this.$Router.auto({
            path: '/kdxMember/memberInfo/index'
        })
    },
    money() {
        this.$Router.auto({
            path: '/kdxMember/balance/index'
        })
    },
    credit() {
        this.$Router.auto({
            path: '/kdxMember/credit/index',
        })
    },
    coupon() {
        this.$Router.auto({
            path: '/kdxMember/coupon/list/index',
            query: {
                tabIndex: '2'
            }
        })
    },
    clickLevelInfo(data) {
        if (data.value.params.levellink) {
            this.$Router.auto(data.value.params.levellink, {wxappid: data.value.params.level_wxappid})
        }
    },
}
handler.menu = {
    clickItem(data) {
        // #ifdef MP-WEIXIN
        if (!data?.item.linkurl) {
            checkToLive({
                keyLink: data.item?.keyLink || '',
                noticeId: data.item?.noticeId || '',
                linkurl_name: data?.item?.linkurl_name || ''
            })
            return
        }
        // #endif
        if (data.item.linkurl == 'wx_service') {
            // #ifdef H5

            if (store.state.shopWxCode) {
                store.commit('changeWxCode', {
                    status: true
                })
            } else {
                store.dispatch('getWxCode').then(res => {
                    if (res) {
                        store.commit('changeWxCode', {
                            status: true
                        })
                    }
                })
            }
            // #endif
        } else if (data.item.linkurl && data.item.linkurl != 'wx_service') {
            this.$Router.auto(data.item.linkurl, {wxappid: data.item.wxappid})
        }
    }
}

handler.menu2 = {
    clickItem(data) {
        console.log(data,'data---111')
        if (data.item.linkurl) {
            this.$Router.auto(data.item.linkurl, {wxappid: data.item.wxappid})
        }
    }
}
handler.notice = {
    clickNotice({params = {}, item = {}}) {
        if (params.noticedata == '1') {
            if (item.linkurl) {
                this.$Router.auto(item.linkurl, {wxappid: item.wxappid})
            }
        } else {
            if (item.linkurl && item.linkurl.indexOf('http') > -1) {
                this.$Router.auto({
                    path: '/kdxOthers/webview',
                    query: {
                        link: item.linkurl
                    }
                })
            } else if (item.linkurl && item.linkurl.indexOf('http') == -1) {
                this.$Router.auto({
                    path: item.linkurl
                })
            } else {
                this.$Router.auto({
                    path: '/kdxOthers/notice/detail',
                    query: {
                        id: item.id
                    }
                })
            }
        }

    }
}

handler.picture = {
    clickItem(data) {
        // #ifdef MP-WEIXIN
        if (!data.linkurl) {
            checkToLive(data)
            return
        }
        // #endif
        if (data.linkurl) {
            this.$Router.auto(data.linkurl, {wxappid: data.wxappid})
        }
    }
}
handler.pictures = {
    clickItem(data) {
        // #ifdef MP-WEIXIN
        if (!data.linkurl) {
            checkToLive(data)
            return
        }
        // #endif
        if (data.linkurl) {
            this.$Router.auto(data.linkurl, {wxappid: data.wxappid})
        }
    }
}
handler.search = {
    clickInput() {
        this.$Router.auto({
            path: '/kdxGoods/search/index'
        })
    }
}
handler.tabbar = {
    clickItem({data, key}) {
        this.$decorator.getModule('tabbar').setCurIndex(data, key)
        this.$decorator.getModule('tabbar').getTabGoods(data, this.$Route)
    }
}
handler.title = {
    clickSubtitle(data) {
        // #ifdef MP-WEIXIN
        if (!data.linkurl) {
            checkToLive(data)
            return
        }
        // #endif
        if (!checkWxService(data.linkurl) && data.linkurl.length > 0) {
            this.$Router.auto(data.linkurl, {wxappid: data.wxappid})
        }
    }
}
handler.topmenu = {
    toPage(data) {
        this.$Router.auto({
            path: data.value.linkurl
        })
    }
}

handler.goods = {
    clickGood(data) {
        let {gid} = data.value;
        if (gid) {
            this.$Router.auto({
                path: '/kdxGoods/detail/index',
                query: {
                    goods_id: gid
                }
            })
        }
    },
}
handler.followbar = {
    clickBtn(data) {
        // #ifdef MP-WEIXIN
        if (!data.linkurl) {
            checkToLive(data)
            return
        }
        // #endif
        if (data.linkurl) {//点击跳转链接
            this.$Router.auto(data.linkurl, {wxappid: data.wxappid});
        }
    },
    close({showtype}) {
        if (showtype == '2') {
            const seven_day = 7 * 24 * 60 * 60 * 1000;
            const time = new Date().getTime()
            const outdate_time = time + seven_day
            let userId = this.$store.state.login.userInfo.id
            if (userId) {
                localStorage.setItem(`bar_closetime${userId}`, outdate_time)
            }
        }

        this.$decorator.getPage(this.$Route).setPageInfo({
            followbar: {
                show: false
            }
        }, 'templates-shim/index/close')
    }
}

handler.liver = {
    clickItem({data, item}) {
        openLiver({
            liverId: item.id,
            broadId: item.broadcast_room_id
        })
    }
}


handler.cube = {
    clickItem(data) {
        // #ifdef MP-WEIXIN
        if (!data.linkurl) {
            checkToLive(data)
            return
        }
        // #endif
        if (data.linkurl) {
            this.$Router.auto(data.linkurl, {wxappid: data.wxappid});
        }
    }
}

handler.seckill = {
    clickGood(data) {
        if (data.value.gid) {
            this.$Router.auto({
                path: '/kdxGoods/detail/index',
                query: {
                    goods_id: data.value.gid
                }
            })
        }

    },
    clickMore(data) {
        if (data.type) {
            this.$Router.auto({
                path: '/kdxGoods/activity/seckillList',
                query: data
            })
        }
    }
}

handler.customer = {
    clickItem(data) {
        if (data.params.customer === 'wx') {
            // #ifdef H5
            if (store.state.shopWxCode) {
                store.commit('changeWxCode', {
                    status: true
                })
            } else {
                store.dispatch('getWxCode').then(res => {
                    if (res) {
                        store.commit('changeWxCode', {
                            status: true
                        })
                    }
                })
            }
            // #endif
        } else { // 客服
            // 判断商户权限
            if (data.params.customer === 'rr') {
                let merchant = this.$decorator.getPage(this.$decorator.getPageType(this.$Route.path))?.detailInfo?.merchant_service || ['renxinyun'];
                if (!(merchant && merchant.includes('renxinyun'))) {
                    uni.showToast({
                        title: '暂未开启',
                        icon: 'none'
                    });
                    return
                }
            }
            this.$Router.auto(data.params.link_url, {wxappid: data.params.wxappid})
        }
    }
};

handler.credit = {
    clickBtn(data) {
        if (data.type === 'credit') {
            this.$Router.auto({
                path: '/kdxMember/credit/index'
            })
        } else if (data.type === 'order') {
            this.$Router.auto({
                path: '/kdxOrder/list'
            })
        } else if (data.type === 'rule') {
            this.$Router.auto({
                path: '/kdxMember/rules/index',
                query: {
                    type: '2'
                }
            })
        }
    },
    clickMemberInfo() {
        this.$Router.auto({
            path: '/kdxMember/memberInfo/index'
        })
    },
}
/**
 * 视频号交易组件点击事件 - 视频号直播
 * @param data 必须采用data.keyLink   data.linkurl_name 格式
 * @param data 传参时有的data默认(data.item.keyLink  or data.params.keyLink )不是这种格式需要传的时候处理下
 */
const checkToLive = async function (data = {
    keyLink: '',
    noticeId: '',
    linkurl_name: ''
}) { //必须传此格式

    if (data?.keyLink == 'videoRam') {
        // 直接进入直播间
        wxTransLiveAppoint(data)
        return;
    }
    if (data?.keyLink == 'videoLive') {
        Object.assign({}, data, await formatParam(data));
        Object.assign({}, data, await formatLive(data));
        // 预约直播
        if (data?.appoint && data?.live_status != 2) {
            wxAppoint(data?.noticeId)
        }
        // 进入直播间
        if (!data?.appoint && data?.live || data?.live_status == 2) {
            wxGoLive(data?.linkurl_name)
        }
        return;
    }
}
const formatLive = function (item) {
    return new Promise(resolve => {
        wx.getChannelsLiveInfo({
            finderUserName: item?.linkurl_name,
            success: (res) => {
                item.live = true;
                item.live_status = res.status
                resolve(item)
            },
            fail: (res) => {
                item.live = false;
                resolve(item)
            }
        })
    })
}

const formatParam = function (item) {
    return new Promise((resolve) => {
        // if (!wx.getChannelsLiveNoticeInfo) return
        wx.getChannelsLiveNoticeInfo({
            finderUserName: item?.linkurl_name || item?.link_url_name,
            success: (res) => {
                if (res.reservable) {
                    // 是否可预约
                    item.appoint = true;
                    item.noticeId = res.noticeId
                } else {
                    item.appoint = false;
                }
                resolve(item)
            },
            fail: (res) => {
                item.appoint = false;
                resolve(item)
            }
        })
    })
}
// 处理小程序自定义交易组件 - 视频号直播
const wxTransLiveAppoint = function (data) {
    let noticeId = data?.linkurl_name, video_id = data?.video_id;
    if (noticeId) {
        if (video_id) {
            wx.openChannelsActivity({
                        finderUserName: noticeId,
                        feedId: video_id,
                        success: (res) => {
                        },
                        fail: (res) => {
                        }
                    }
            )
        }
    }
}

// 预约直播
const wxAppoint = function (noticeId) {
    noticeId && wx.reserveChannelsLive({
        noticeId
    })
}
// 进入直播间
const wxGoLive = function (finderUserName) {
    finderUserName && wx.openChannelsLive({
        finderUserName
    })
}


const checkWxService = function (url) {//判断是否为小程序客服   小程序客服需要通过button激活
    let isService = false
    if (url == 'wx_service') {
        isService = true
        // #ifdef H5
        if (store.state.shopWxCode) {
            store.commit('changeWxCode', {
                status: true
            })
        } else {
            store.dispatch('getWxCode').then(res => {
                if (res) {
                    store.commit('changeWxCode', {
                        status: true
                    })
                }
            })
        }
        // #endif
        return isService
    }
    return isService
}


export default function (event) {
    if (store.state.decorate.pageQuery.previewId) {
        uni.showToast({title: '预览模式', icon: 'none'})
        return
    }
    if (event?.target) {
        let target = event.target.split('/')
        let modalId = target[0];//模块id
        let handlerObject = handler[modalId];//模块处理函数集合
        if (!handlerObject) {
            return
        }
        let functionName = target[1];//处理函数名称
        let handlerFun = handlerObject[functionName];//处理函数
        if (!handlerFun || typeof handlerFun !== 'function') {
            return
        }
        let data = event.data;//参数
        handlerFun.call(this, data);
    } else {
        throw Error('模板事件对象错误！')
    }

}



