/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
import api from '@/api'
import * as utils from '@/common/util.js'
import store from '@/store'
// #ifdef H5
import uQRCode from "./uqrcode";
// #endif
import getJson from './painterJSON/index'; //小程序的海报插件数据格式处理函数
import poster from './poster'
let qrcode = ''
let avatar = ''

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

// 文章海报
export function getArticlePoster(id) {
    return new Promise((resolve, reject) => {
        poster.getPoster('article').then(async poster => {
            let qrcodeUrl
            // #ifdef H5
            qrcodeUrl = poster.filter(item => item.id == 'poster_qrcode')[0]||'';
            if (qrcodeUrl) {
                qrcodeUrl = await getH5Qrcode(qrcodeUrl.params.imgurl, 170, qrcodeUrl);
            }
            // #endif
            // #ifdef MP-WEIXIN
            qrcodeUrl = await getWxArticlePoster(id);
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
                    console.log('成功');
                    qrcode = res;
                    resolve(res)
                },
                fail: res => {
                    console.log('失败');
                    uni.showToast({
                        title: '生成二维码失败',
                        icon: 'none',
                    });
                    reject(res)
                }
            });
    })
}
