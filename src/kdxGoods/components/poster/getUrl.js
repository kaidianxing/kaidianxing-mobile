import api from '@/api'
import * as utils from '@/common/util.js'
import store from '@/store'
// #ifdef H5
import uQRCode from "./uqrcode";
// #endif
import getJson from './painterJSON/index'; //小程序的海报插件数据格式处理函数
import $decorator from '@/common/decorator'
let qrcode = ''
let avatar = ''
export function getWxappQrcode() {
    return new Promise((resolve, reject) => {
        if (qrcode) {
            resolve(qrcode)
        } else {
            api.commissionApi.getWxappQrcode({}).then(path => {
                if (path?.error == 0 && path.patch) {
                    uni.getImageInfo({
                        src: path.patch,
                        success: img => {
                            qrcode = img.path;
                            resolve(img.path)
                        },
                        fail(){
                            uni.showToast({
                                title: '加载商品二维码失败1',
                                icon: 'none',
                            })
                            resolve()
                        }
                    })
                } else {
                    uni.showToast({
                        title: '加载商品二维码失败2',
                        icon: 'none',
                    })
                    resolve()
                }
            }).catch(()=>{
                resolve()
                uni.showToast({
                    title: '加载商品二维码失败3',
                    icon: 'none',
                })
            });
        }
    })
};
export function getCommissionPosterQrcode() {
    return new Promise((resolve, reject) => {
        if (qrcode) {
            resolve(qrcode)
        } else {
            api.merchantsApi.getCommissionPosterQrcode().then(res => {
                if (res.error === 0 && res.url) {
                    uni.getImageInfo({
                        src: res.url,
                        success: img => {
                            qrcode = img.path;
                            resolve(img.path)
                        },
                        fail(){
                            uni.showToast({
                                title: '加载商品二维码失败1',
                                icon: 'none',
                            })
                            resolve()
                        }
                    })
                } else {
                    uni.showToast({
                        title: '加载商品二维码失败2',
                        icon: 'none',
                    })
                    resolve()
                }
            }).catch(()=>{
                resolve()
                uni.showToast({
                    title: '加载商品二维码失败3',
                    icon: 'none',
                })
            });
        }
    })
};
export function getWxGoodPoster(id) {
    return new Promise((resolve, reject) => {
        if (qrcode) {
            resolve(qrcode)
        } else {
            api.goodApi.getWxPoster({
                goods_id: id
            }).then(res => {
                if (res.error === 0) {
                    uni.getImageInfo({
                        src: res.patch,
                        success: img => {
                            qrcode = img.path;
                            resolve(img.path)
                        },
                        fail(err){
                            uni.showToast({
                                title: '下载商品二维码失败',
                                icon: 'none',
                            })
                            resolve()
                        }
                    })
                } else {
                    uni.showToast({
                        title:'加载商品二维码失败:'+ res.message,
                        icon: 'none',
                    })
                    resolve()
                }
            }).catch(()=>{
                resolve()
                uni.showToast({
                    title: '加载商品二维码失败',
                    icon: 'none',
                })
            });
        }
    })
}

export function getCreditShopQrcode(id) {
    return new Promise((resolve, reject) => {
        if (qrcode) {
            resolve(qrcode)
        } else {
            api.creditShopApi.getWxQrcode({id}).then(path => {
                if (path?.error == 0 && path.patch) {
                    uni.getImageInfo({
                        src: path.patch,
                        success: img => {
                            qrcode = img.path;
                            resolve(img.path)
                        },
                        fail(){
                            uni.showToast({
                                title: '加载商品二维码失败1',
                                icon: 'none',
                            })
                            resolve()
                        }
                    })
                } else {
                    uni.showToast({
                        title: '加载商品二维码失败2',
                        icon: 'none',
                    })
                    resolve()
                }
            }).catch(()=>{
                resolve()
                uni.showToast({
                    title: '加载商品二维码失败3',
                    icon: 'none',
                })
            });
        }
    })
}

export function getAvatar(url) {
    return new Promise((resolve, reject) => {
        if (avatar) {
            resolve(avatar)
        } else {
            uni.getImageInfo({
                src: url,
                success: img => {
                    avatar = img.path;
                    resolve(img.path)
                },
                fail(){
                    uni.showToast({
                        title: '加载头像失败',
                        icon: 'none',
                    })
                    resolve()
                }

            })
        }
    })
}
export function getH5Qrcode(text, size, data) {
    if(/#\/$|#\/pages.+$/.test(text)){//将#转为_route=
        text=text.replace('#','&_route=')
    }
    let style = {};
    if (data) {
        style = {
            foregroundColor: data.style.color,
            backgroundColor: data.style.bgcolor,
            margin: size * 0.04
        }
    }
    return new Promise((resolve, reject) => {
            uQRCode.make({
                canvasId: 'qrcode',
                text: text,
                size: size,
                fileType: 'png',
                margin: 5,
                ...style,
                success: res => {
                    qrcode = res;
                    resolve(res)
                },
                fail: res => {
                    uni.showToast({
                        title: '生成二维码失败',
                        icon: 'none',
                    });
                    reject(res)
                }
            });
    })
}
export function getWxGroupPoster(team_id) {
    return new Promise((resolve, reject) => {
            api.orderApi.getWxGroupsQrcode({team_id}).then(res => {
                if (res.error === 0) {
                    uni.getImageInfo({
                        src: res.patch,
                        success: img => {
                            qrcode = img.path;
                            resolve(img.path)
                        },
                        fail(err){
                            uni.showToast({
                                title: '下载商品二维码失败',
                                icon: 'none',
                            })
                            resolve()
                        }
                    })
                } else {
                    uni.showToast({
                        title:'加载商品二维码失败:'+ res.message,
                        icon: 'none',
                    })
                    resolve()
                }
            }).catch(()=>{
                resolve()
                uni.showToast({
                    title: '加载商品二维码失败',
                    icon: 'none',
                })
            });
    })
}

export function getWxGroupRebatePoster(team_id) {
    return new Promise((resolve, reject) => {
            api.orderApi.getWxGroupsRebateQrcode({team_id}).then(res => {
                if (res.error === 0) {
                    uni.getImageInfo({
                        src: res.patch,
                        success: img => {
                            qrcode = img.path;
                            resolve(img.path)
                        },
                        fail(err){
                            uni.showToast({
                                title: '下载商品二维码失败',
                                icon: 'none',
                            })
                            resolve()
                        }
                    })
                } else {
                    uni.showToast({
                        title:'加载商品二维码失败:'+ res.message,
                        icon: 'none',
                    })
                    resolve()
                }
            }).catch(()=>{
                resolve()
                uni.showToast({
                    title: '加载商品二维码失败',
                    icon: 'none',
                })
            });
    })
}

export function getWxGroupsFissionPoster(team_id) {
    return new Promise((resolve, reject) => {
            api.orderApi.getWxGroupsFissionQrcode({team_id},{errorToast: false}).then(res => {
                if (res.error === 0) {
                    uni.getImageInfo({
                        src: res.patch,
                        success: img => {
                            qrcode = img.path;
                            resolve(img.path)
                        },
                        fail(err){
                            uni.showToast({
                                title: '下载商品二维码失败',
                                icon: 'none',
                            })
                            resolve()
                        }
                    })
                } else {
                    uni.showToast({
                        title:'加载商品二维码失败:'+ res.message,
                        icon: 'none',
                    })
                    resolve()
                }
            }).catch(()=>{
                resolve()
                uni.showToast({
                    title: '加载商品二维码失败',
                    icon: 'none',
                })
            });
    })
}


export function getWxArticlePoster(id) {
    return new Promise((resolve, reject) => {
        if (qrcode) {
            resolve(qrcode)
        } else {
            api.articleApi.getWxappQrcode({
                id,
            }).then(res => {
                if (res.error === 0) {
                    uni.getImageInfo({
                        src: res.patch,
                        success: img => {
                            qrcode = img.path;
                            resolve(img.path)
                        },
                        fail(err){
                            uni.showToast({
                                title: err,
                                icon: 'none',
                            })
                            resolve()
                        }
                    })
                } else {
                    uni.showToast({
                        title:'加载文章二维码失败:'+ res.message,
                        icon: 'none',
                    })
                    resolve()
                }
            }).catch(()=>{
                resolve()
                uni.showToast({
                    title: '加载文章二维码失败',
                    icon: 'none',
                })
            });
        }
    })
}
export function getCommissionPoster(data, size) {
    qrcode = ''
    return new Promise((resolve, reject) => {
        $decorator.getModule('poster').getPoster('commission').then(async poster => {
            let avatarUrl = ''
            // #ifdef MP-WEIXIN
            let qrcodeUrl = await getWxappQrcode();
            for (let item of poster) {
                if (item.id == 'poster_avatar') {
                    avatarUrl = item.params.imgurl
                    break;
                }
            }
            if (avatarUrl) {
                avatarUrl = await getAvatar(avatarUrl)
            }
            // #endif
            // #ifdef H5
            let qrcodeUrl = poster.filter(item => item.id == 'poster_qrcode')[0]||'';

            if (qrcodeUrl) {
                qrcodeUrl = await getH5Qrcode(data.url, size, qrcodeUrl);
            }
            // #endif
            let list = utils.deepCopy(poster)
            list.forEach(async item => {
                if (item.id == 'poster_qrcode') {
                    item.params.imgurl = qrcodeUrl;
                    qrcode = qrcodeUrl||''
                }

                return item
            })
            let posterTemp = utils.deepCopy(list)
            posterTemp = getJson(posterTemp);
            resolve(posterTemp)
        }).catch((err) => {
            uni.showToast({
                title: '生成海报失败',
                icon: 'none',
            })
            reject(err)
            uni.hideLoading();
        })
    })

}

export function getGoodsPosters(id, size) {
    qrcode = ''
    let posterUrl = store.state.decorate.goodDetailPage.detailInfo ?.poster_url
    return new Promise((resolve, reject) => {
        $decorator.getModule('poster').getPoster('goods').then(async poster => {
            // #ifdef MP-WEIXIN
            let qrcodeUrl = await getWxGoodPoster(id);
            // #endif
            // #ifdef H5
            let qrcodeUrl = poster.filter(item => item.id == 'poster_qrcode')[0];
            if (qrcodeUrl) {
                qrcodeUrl = await getH5Qrcode(posterUrl, size);
            }
            // #endif
            let list = utils.deepCopy(poster)
            list.forEach(async item => {
                if (item.id == 'poster_qrcode') {
                    item.params.imgurl = qrcodeUrl;
                    qrcode = qrcodeUrl
                }
                return item
            })
            resolve(getJson(list))
        }).catch((err) => {
            uni.showToast({
                title: '生成海报失败',
                icon: 'none',
            })
            reject(err)
            uni.hideLoading();
        })
    })

}

// 积分商品
export function getCreditGoodsPosters(id, size) {
    qrcode = ''
    let posterUrl = store.state.creditShop?.creditPosterData?.poster_url
    return new Promise((resolve, reject) => {
        $decorator.getModule('poster').getPoster('creditGoods').then(async poster => {
            // #ifdef MP-WEIXIN
            let qrcodeUrl = await getCreditShopQrcode(id);
            // #endif
            // #ifdef H5
            let qrcodeUrl = poster.filter(item => item.id == 'poster_qrcode')[0];
            if (qrcodeUrl) {
                qrcodeUrl = await getH5Qrcode(posterUrl, size);
            }
            // #endif
            let list = utils.deepCopy(poster)
            list.forEach(async item => {
                if (item.id == 'poster_qrcode') {
                    item.params.imgurl = qrcodeUrl;
                    qrcode = qrcodeUrl
                }
                return item
            })
            resolve(getJson(list))
        }).catch((err) => {
            uni.showToast({
                title: '生成海报失败',
                icon: 'none',
            })
            reject(err)
            uni.hideLoading();
        })
    })

}

// #ifdef H5
export function getFollowPosters(size) {
    qrcode = ''
    return new Promise((resolve, reject) => {
        $decorator.getModule('poster').getPoster('follow').then((poster) => {
            resolve(getJson(poster))
        }).catch((err) => {
            uni.showToast({
                title: '生成海报失败',
                icon: 'none',
            })
            reject(err)
            uni.hideLoading();
        })
    })
}
// #endif
// 拼团海报
export function getGroupPoster(team_id) {
    return new Promise((resolve, reject) => {
        $decorator.getModule('poster').getPoster('group').then(async poster => {
            // #ifdef H5
            let qrcodeUrl = poster.filter(item => item.id == 'poster_qrcode')[0]||'';
            if (qrcodeUrl) {
                qrcodeUrl = await getH5Qrcode(qrcodeUrl.params.imgurl, 170, qrcodeUrl);
            }
            // #endif
            // #ifdef MP-WEIXIN
            let qrcodeUrl = await getWxGroupPoster(team_id);
            // #endif
            let list = utils.deepCopy(poster);
            list.forEach(async item => {
                if (item.id == 'poster_qrcode') {
                    item.params.imgurl = qrcodeUrl;
                }
                return item
            });
            resolve(getJson(list))
        }).catch(err=> {
            uni.showToast({
                title: '生成海报失败',
                icon: 'none',
            });
            reject(err);
            uni.hideLoading();
        })
    })
}


