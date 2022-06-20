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
import {getActivityName} from '@/common/helper/goods'
import {SINGLE_BUY_ACTIVE} from '@/common/variable/activity'
import {
    tipBeforeOper,
    addCart,
    createOrder,
} from './indexTools'
import {hasBindBySence} from '@/common/helper/user';

async function detailNavBarHandler(data, {
    goodsData,
    goods_id,
    option_id,
    total,
    detailInfo,
    buy_num,
    goodDetail,
    activityInfo,
    is_origin,
}) {
    let params = data.data;
    try {
        switch (params.btn) {
            case 'like': //关注按钮
                let detail_navbar = this.pageInfo['detail_navbar'] || {};
                let res = await this.$api.goodApi.changeFavor({
                    goods_id: goods_id,
                    is_add: detail_navbar.params.favor ? 0 : 1
                })
                if (res.error == 0) {
                    if (!detail_navbar.params.favor) {
                        uni.showToast({title: '收藏成功', icon: "none"});
                    }
                    detail_navbar.params.favor = !detail_navbar.params.favor;
                    this.$decorator.getPage(this.$Route).setPageInfo({
                        detail_navbar
                    }, 'detailNavBarHandler/eventHandler.js')
                }
                break;
            case 'add': //添加购物车
                // 需要绑定登录
                if ((!(await store.dispatch('login/checkLogin')))) {
                    return store.commit('login/setModal', true)
                }
                // 需要绑定手机号
                if (hasBindBySence('add_cart')) {
                    return store.commit('login/setModal', true)
                }
                // 往goodsPicker里存值
                this.$store.commit('quickPurchase/setGoodDetail', detailInfo)
                this.$store.commit('quickPurchase/setOptionsInfo', store.state?.decorate?.goodDetailPage?.optionsInfo)
                await tipBeforeOper({
                    goodsData,
                    goods_id,
                    option_id,
                    total,
                    type: params.btn,
                    buy_num,
                    activityInfo
                }, false);
                await addCart.call(this, {
                    goods_id,
                    goodDetail,
                    option_id: option_id || 0,
                    total,
                    activityInfo,
                    buy_num,
                    is_origin,
                });
                this.goodsData.has_option == 1 && this.$refs?.goodsPicker.toggle();
                this.$decorator.getModule('diymenu').getCartNum()
                break;
            case 'tocart': //去购物车
                this.$Router.auto({
                    path: '/kdxCart/index',
                })
                break;
            case 'buy': //下单
                // 需要绑定登录
                if (!(await store.dispatch('login/checkLogin'))) {
                    return store.commit('login/setModal', true)
                }
                // 需要绑定手机号
                if (hasBindBySence('buy')) {
                    return store.commit('login/setModal', true)
                }
                // 往goodsPicker里存值
                // 判断是不是秒杀
                let hasActive = SINGLE_BUY_ACTIVE.includes(params.activeName);
                let optionsInfo = hasActive ? store.state?.decorate?.goodDetailPage?.activeOptInfo : store.state?.decorate?.goodDetailPage?.optionsInfo;
                this.$store.commit('quickPurchase/setGoodDetail', detailInfo)
                delete optionsInfo.is_join
                this.$store.commit('quickPurchase/setOptionsInfo', optionsInfo)

                // 判断是否是原价购买
                let singleActiveName = getActivityName(this.activityInfo)
                let is_origin = SINGLE_BUY_ACTIVE.includes(singleActiveName) && !hasActive;
                await tipBeforeOper({
                    goodsData,
                    goods_id,
                    option_id,
                    total,
                    type: params.btn,
                    buy_num,
                    activityInfo,
                    is_origin
                });


                // console.log('to buy!!', this.goodsData.has_option == 1)
                console.log(this.goodsData)
                this.goodsData.has_option == 1 && this.$refs?.goodsPicker.toggle();

                let orderParams = {
                    goodDetail,
                    goods_id,
                    option_id,
                    total,
                    detailInfo,
                    liverId: this.liverId,
                    canBuy: this.canBuy,
                    buy_num,
                    activityInfo,
                    is_origin,
                }

                createOrder.call(this, {...orderParams})
                break;
            case 'custom':
                if (params.url != 'wx_service') {
                    this.$Router.auto(params.url, {wxappid: params.wxappid})
                } else if (params.url == 'wx_service') {
                    // #ifndef MP-WEIXIN
                    if (store.state.shopWxCode) {
                        store.commit('changeWxCode', {status: true})
                    } else {
                        store.dispatch('getWxCode').then(res => {
                            if (res) {
                                store.commit('changeWxCode', {status: true})
                            }
                        })
                    }
                    // #endif
                }
                break;
            case 'customer':
                // #ifndef MP-WEIXIN
                if (store.state.shopWxCode) {
                    store.commit('changeWxCode', {status: true})
                } else {
                    store.dispatch('getWxCode').then(res => {
                        if (res) {
                            store.commit('changeWxCode', {status: true})
                        }
                    })
                }
                // #endif
                break;
        }

    } catch (e) {
        console.log(e, 'eeeeeeeeeee')
        /*
        * 商品详情中购买弹窗判断
        * */
        if (e?.errorId == 'openPicker') {
            this.$refs.goodsPicker.toggle(null, e.type);
        } else if (e?.errorInfo) {
            uni.showToast({
                title: e.errorInfo,
                icon: 'none'
            });
        }
    }

}

/**
 * 装修组件事件处理
 * @param {自定义的事件对象} data
 * @param {入参} param1
 */
export async function eventHandler(data, {
    goodsData,
    goods_id,
    option_id,
    total,
    detailInfo,
    activityInfo,
    goodDetail,
    is_origin,
    sub_shop_id,
    buy_num
}) {
    try {
        switch (data.target) {
            case "detail_info/refresh":
                if (data.data == "frontStop") {
                    // 刷新底部导航
                    this.$decorator.getPage(this.$Route).setPageInfo({
                        detail_navbar: {
                            params: {
                                is_buy_disable: true,
                            },
                        },
                    }, 'goodDetail/eventHandler.js/eventHandler');
                } else {
                    this.pullDownRefresh();
                }
                break;
            case "goods/clickBuyBtn":
                // 商品组快速购买
                // 判断登录
                await this.$store.dispatch('quickPurchase/checkLoginStatus')
                // 获取商品详情
                this.cartAdder.getGoodDetail(data?.data?.value?.gid, 'godddDEtail/goods/clickBuyBtn').then((res) => {
                    if (res.error === 0) {
                        // 打开goodsPicker
                        this.cartAdder.callback({
                            type: 'toggle',
                            data: {
                                type: 'spec'
                            },
                        })
                    }
                })
                break;
            case 'detail_spec/clickItem': //点击商品规格事件
                // 需要绑定登录
                if (!(await store.dispatch('login/checkLogin'))) {
                    return store.commit('login/setModal', true)
                }
                // 需要绑定手机号
                console.log(hasBindBySence('buy'), 'hasBindBySence("buy")')
                if (hasBindBySence('cart') || hasBindBySence('buy')) {
                    return store.commit('login/setModal', true)
                }
                // 往goodsPicker里存值
                this.$store.commit('quickPurchase/setGoodDetail', detailInfo)

                // 活动使用活动规格
                let hasSingle = SINGLE_BUY_ACTIVE.includes(data.data.params.activeName)
                let optionsInfo = hasSingle ? store.state?.decorate?.goodDetailPage?.activeOptInfo : store.state?.decorate?.goodDetailPage?.optionsInfo;
                this.$store.commit('quickPurchase/setOptionsInfo', optionsInfo)
                // 打开goodsPicker
                if (hasSingle) {
                    // 打开活动弹窗
                    this.$store.commit('quickPurchase/setGoodDetail', detailInfo)
                    await tipBeforeOper.call(this, {goodsData, goods_id, option_id, total, type: 'buy', activityInfo});
                    this.goodsData.has_option == 1 && this.$refs?.goodsPicker.toggle();
                    createOrder.call(this, {goods_id, option_id, total, goodDetail, detailInfo, is_origin})
                } else {
                    this.goodsData.has_option == 1 && this.$refs?.goodsPicker.toggle(null, 'spec', 'cacheNum');
                }
                break;
            case 'detail_navbar/clickItem': //点击商品底部菜单事件
                detailNavBarHandler.call(this, data, {
                    goodsData,
                    goodDetail: this.goodDetail,
                    goods_id,
                    option_id,
                    total,
                    detailInfo,
                    activityInfo,
                    is_origin,
                    sub_shop_id,
                    buy_num
                });
                break;
            case 'detail_comment/checkMore':
                if (data.total != 0) {
                    this.$Router.auto({
                        path: '/kdxGoods/detail/allComments',
                        query: {
                            goods_id: goods_id,
                        }
                    })
                }
                break;
            case 'detail_comment/previewImage':
                let {
                    index,
                    urls
                } = data.data;
                uni.previewImage({
                    current: index,
                    urls: urls.map(item => {
                        return this.$utils.mediaUrl(item)
                    })
                })
                break;
            case 'detail_info/clickShare':
                if (!(await store.dispatch('login/checkLogin'))) {
                    return store.commit('login/setModal', true)
                } else if (hasBindBySence('share')) {
                    return store.commit('login/setModal', true)
                } else {
                    this.showShare = true
                }
                break;
            case 'detail_info/viewReward':
                this.showReward = true
                break;
            case 'detail_sale/clickItem':
                this.type = data.data.type;

                let info = this.pageInfo.detail_sale?.data;
                if (info && this.type) {
                    this.info = info.filter(item => item.type == this.type)[0];
                }
                if (this.type == 'samecity') {
                    this.$Router.auto('/kdxOrder/deliveryArea');
                    return;
                }
                // 需要绑定登录
                if (data.data.type == 'coupon' && !(await store.dispatch('login/checkLogin'))) {
                    return store.commit('login/setModal', true)
                }
                this.show = true
                break;
            case 'detail_swipe/clickImg':
                if (store.state.setting?.systemSetting?.basic?.photo_preview == '1') {
                    uni.previewImage({
                        urls: data.data.items,
                        current: data.data.index,
                        indicator: 'number'
                    })
                }
                break;
            case 'detail_pullup/clickDetail':
                if (store.state.setting?.systemSetting?.basic?.photo_preview == '1') {
                    // #ifdef H5
                    // var previewUrls = []
                    // data.data.content.replace(
                    //     /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
                    //     function(match, capture) {
                    //         previewUrls.push(capture)
                    //     }
                    // );
                    // let element = data.data.event.target
                    // if (element.nodeName === 'IMG') {
                    //     let nodes = element.parentNode.parentElement.querySelectorAll('img')
                    //     let current = 0
                    //     for (let i = 0; i < nodes.length; i++) {
                    //         if (nodes[i] == element) {
                    //             current = i
                    //         }
                    //     }
                    //     uni.previewImage({
                    //         urls: previewUrls,
                    //         indicator: 'number',
                    //         current
                    //     })
                    // }
                    // #endif
                }
                break;
        }
    } catch (e) {
        if (e?.errorId == 'openPicker') {
            this.$refs.goodsPicker.toggle(null, e.type, 'cacheNum');
        } else if (e?.errorInfo) {
            uni.showToast({
                title: e.errorInfo,
                icon: 'none'
            });
        }
    }
}
