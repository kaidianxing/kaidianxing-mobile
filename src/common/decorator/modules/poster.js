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
import $decorator from '@/common/decorator'
import {ModuleMixin} from '../Mixin'
const getShopInfo = shopInfo => ({
    poster_shoplogo: item => {
        item.params.imgurl = utils.mediaUrl(shopInfo.logo)
        return item
    },
    poster_shopname: item => {
        item.params.content = shopInfo.name
        return item
    },
})

const getGoodInfo = detailInfo => {
    let detail = detailInfo.data ?.goods || {}
    return {
        poster_goodimg: item => {

            console.log(detail.thumb,'detail.thumb>>>>');

            item.params.imgurl = utils.mediaUrl(detail.thumb)
            return item
        },
        poster_goodname: item => {
            item.params.content = detail.title
            return item
        },
        poster_sellprice: item => { // 售卖价
            let {activity, data: {goods}} = detailInfo;
            let price = 0;
            if(goods.has_option=='1') {
                if(activity?.seckill){
                    // 多规格秒杀价
                    price = activity.seckill?.price_range.min_price
                } else {
                    // 多规格 会员价
                    price = `${goods.min_price}-${goods.max_price}`;
                    price = utils.formartPrice(price)
                }

            } else {
                // 单规格秒杀价
                if(activity?.seckill) {
                    price = activity.seckill?.goods_info[0]?.activity_price
                } else {
                    // 单规格 会员价
                    price = goods.price
                }
            }
            item.params.content = price;
            let price_actives = ['seckill','preheat_activity'];
            let is_active = activity && price_actives.some(key=> activity[key]);
            return item
        },
        poster_price: item => {
            let {activity, data: {goods}} = detailInfo
            let price = 0;
            // TODO
            if(goods.has_option=='1') {
                if(activity?.seckill){
                    // 多规格秒杀价
                    price = activity.seckill?.price_range.min_price
                } else {
                    // 多规格 会员价
                  price = activity.member_price?`${activity.member_price.min_price}-${activity.member_price.max_price}`: `${goods.min_price}-${goods.max_price}`
                  price = utils.formartPrice(price)
                }

            } else {
                // 单规格秒杀价
              if(activity?.seckill) {
                price =  activity.seckill?.goods_info[0]?.activity_price
              } else {
                // 单规格 会员价
                price =  activity.member_price ? activity.member_price.min_price : goods.price
              }
            }
            let price_actives = ['seckill','preheat_activity'];
            let is_active = activity && price_actives.some(key=> activity[key]);
            item.params.content = price
            return item
        },
        poster_delprice: item => {
            item.params.content = detail.original_price
            return item
        },
        poster_commission: item => {
            item.params.commission = detailInfo.activity ?.commission ?.max || 0
            return item
        },
    }

}

const getUserInfo = userInfo => ({
    poster_avatar: item => {
        item.params.imgurl = userInfo.avatar
        return item
    },
    poster_nickname: item => {
        item.params.content = userInfo.nickname
        return item
    },
})

class Poster extends ModuleMixin {
    constructor() {
        super()
    }
    poster = { //海报模板缓存
        goodsPoster: null,
        commissionPoster: null,
        followPoster: null,
        joinPoster:null,
    };
    userInfo = null; //用户信息缓存
    getUserInfo() { //请求用户信息
        let that = this;
        return new Promise((resolve, reject) => {
            api.memberApi.getUserInfo().then(res => {
                that.userInfo = res.data
                that.userInfo.avatar = store.state.setting.avatar || that.userInfo.avatar; //后端将微信头像缓存在用户本地，避免跨域问题
                resolve(that.userInfo)
            })
        })
    }
    /**
     * 海报装修模板获取
     */
    getGoodPoster() { //获取商品装修模板结构参数表
        let that = this;
        return new Promise((resolve, reject) => {
            if (that.poster.goodsPoster) {
                resolve(that.poster.goodsPoster)
            } else {
                api.decorateApi.getGoodPoster().then(res => {
                    if (res.error == 0) {
                        if (res.data) {
                            res.data.content = JSON.parse(res.data.content)
                            that.poster.goodsPoster = res.data
                        } else {
                            uni.showToast({
                                title: '无可用海报',
                                icon: 'none',
                            })
                        }
                    } else {
                        uni.showLoading({
                            title: res.message ? res.message : '海报获取错误',
                            mask: true,
                        });
                    }
                    resolve(that.poster.goodsPoster)
                }).catch(() => {
                    uni.showToast({
                        title: '海报模板出错啦',
                        icon: 'none',
                    })
                    resolve()
                })
            }
        })
    }
    getCommissionPoster() { //获取分析海报装修模板结构参数表
        let that = this;
        return new Promise((resolve, reject) => {
            if (that.poster.commissionPoster) {
                resolve(that.poster.commissionPoster)
            } else {
                api.decorateApi.getCommissionPoster().then(res => {
                    if (res.error == 0) {
                        if (res.data) {
                            res.data.content = JSON.parse(res.data.content).map(item => {
                                if (item.id == "poster_qrcode") {
                                    item.params.imgurl = res.data.url
                                }
                                return item
                            })
                            that.poster.commissionPoster = res.data
                        } else {
                            uni.showToast({
                                title: '无可用海报',
                                icon: 'none',
                            })
                        }
                        resolve(that.poster.commissionPoster)
                    } else if (res.message) {
                        uni.showLoading({
                            title: res.message?res.message:'海报出错啦',
                            mask: true,
                        });
                        resolve()
                    }
                }).catch(() => {
                    uni.showToast({
                        title: '获取海报错误',
                        icon: 'none',
                    })
                })
            }
        })
    }
    getFollowPoster() { //获取关注海报装修模板结构参数表
        let that = this;
        return new Promise((resolve, reject) => {
            if (that.poster.followPoster) {
                resolve(that.poster.followPoster)
            } else {
                api.decorateApi.getFollowPoster().then(res => {
                    if (res.error == 0) {
                        if (res.data) {
                            res.data.content = JSON.parse(res.data.content).map(item => {
                                if (item.id == 'poster_qrcode') {
                                    item.params.imgurl = utils.mediaUrl(res.data.qr_code)
                                } else if (item.id == 'poster_exptime') { //失效时间
                                    item.params.content = res.data.deadline
                                }
                                return item
                            })
                            that.poster.followPoster = res.data
                        } else {
                            uni.showToast({
                                title: '无可用海报',
                                icon: 'none',
                            })
                        }
                    } else if (res.message) {
                        uni.showLoading({
                            title: res.message?res.message:'海报模板出错啦',
                            mask: true,
                        });
                    }
                    resolve(that.poster.followPoster)
                }).catch(()=>{
                    uni.showLoading({
                        title: '海报模板错误',
                        mask: true,
                    });
                    resolve(that.poster.followPoster)
                })
            }
        })
    }
    /**
     * //获取商品详情
     * @param {*} data
     */
    getGoodPosterDetail(data) {
        let that = this;
        return new Promise((resolve, reject) => {
            Promise.all([that.getUserInfo(), that.getGoodPoster()]).then(async res => {
                if (!store.state.decorate.goodDetailPage.detailInfo.data) {
                    await $decorator.getPage('goodDetail').getGoodDetail(data)
                }
                let detail = store.state.decorate.goodDetailPage.detailInfo;
                let goodInfo = {};
                if (detail) {
                    goodInfo = getGoodInfo(detail)
                }
                let info = {}
                let shopInfo = store.state.setting.systemSetting.basic || {}
                if (that.userInfo) {
                    info = {
                        ...getShopInfo(shopInfo),
                        ...getUserInfo(that.userInfo),
                    }
                }
                resolve({
                    ...info,
                    ...goodInfo
                })
            })
        })
    }
    /**
     * 海报模板的实际数据处理方法集合
     * @param {*} data
     */
    getCommissionPosterDetail(data) { //获取商品海报模板处理对象集合
        let that = this;
        return new Promise((resolve, reject) => {
            Promise.all([that.getUserInfo(), that.getCommissionPoster()]).then(async res => {
                let posterInfo = res[1]
                let info = {}
                let shopInfo = store.state.setting.systemSetting.basic || {}
                if (that.userInfo) {
                    info = {
                        ...getShopInfo(shopInfo),
                        ...getUserInfo(that.userInfo),
                    }
                }
                resolve(info)
            })
        })
    }

    /**
     * 海报模板的实际数据处理方法集合
     * @param {*} data
     */
    getFollowPosterDetail(data) { //获取商品海报模板处理对象集合
        let that = this;
        return new Promise((resolve, reject) => {
            Promise.all([that.getUserInfo(), that.getFollowPoster()]).then(async res => {
                let info = {}
                let shopInfo = store.state.setting.systemSetting.basic || {}
                if (that.userInfo) {
                    info = {
                        ...getShopInfo(shopInfo),
                        ...getUserInfo(that.userInfo),
                    }
                }
                resolve(info)
            })
        })
    }

    async getPoster(posterType) {
        let that = this;
        return new Promise(async (resolve, reject) => {
            let requester = null;
            let list = []
            switch (posterType) {
                case 'goods':
                    requester = await that.getGoodPosterDetail()
                    list = that.poster.goodsPoster.content
                    break;
                case 'commission':
                    requester = await that.getCommissionPosterDetail()
                    list = that.poster.commissionPoster.content
                    break;
                case 'follow':
                    requester = await that.getFollowPosterDetail()
                    list = that.poster.followPoster.content
                    break;

            }
            list = list.map(item => {
                let fun = requester[item.id]
                if (typeof fun == 'function') {
                    let res = fun(item)
                    return res
                }
                return item
            });

            resolve(list)
        })

    }
}
export default new Poster()
