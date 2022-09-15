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
import request from './request.js'
import store from '@/store'
import api from '@/api'
import { sessionStorage } from 'mp-storage'
// #ifdef H5
let jweixin = require('jweixin-module');
// #endif
export * from './objectTools'
export * from './price'
export * from './helper/user'
let settings = require('@/static/settings.js').config
// #ifdef MP-WEIXIN
let playerPlugin = null;
// let playerPlugin = requirePlugin('live-player-plugin');
// #endif

let sysType = -1;
let setLoaded = false
/**
 懒加载
 来自 grace.hcoder.net
 作者 hcoder 深海 5213606@qq.com

 版权声明 :
 GraceUI 的版权约束是不能转售或者将 GraceUI 直接发布到公开渠道！
 侵权必究，请遵守版权约定！
 */
var graceLazyWinHeight = 500;
var graceLazyTimer = null;
export const graceLazyload = {
    load: function (top, _page) {
        if (graceLazyTimer != null) {
            clearTimeout(graceLazyTimer);
        }
        graceLazyTimer = setTimeout(function () {
            uni.getSystemInfo({
                success: function (res) {
                    graceLazyWinHeight = res.windowHeight;
                    //遍历img
                    uni.createSelectorQuery().selectAll('.grace-img-lazy').fields({
                        rect: true,
                    }, function (res) {
                        var isShow = [];
                        //检查图片是否在窗口可视区域
                        for (var i = 0; i < res.length; i++) {
                            if (res[i].top <= graceLazyWinHeight + top) {
                                isShow[i] = true;
                            } else {
                                break;
                            }
                        }
                        _page.isShow = isShow;
                    }).exec();
                }
            });
        }, 200);
    }
}

export function HexToRgb(color, opacity = 1) {
    color = color.toLowerCase();
    var pattern = /^#([0-9|a-f]{3}|[0-9|a-f]{6})$/;
    if (color && pattern.test(color)) {
        if (color.length == 4) {
            // 将三位转换为六位
            color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
        }
        //处理六位的颜色值
        var colorNew = [];
        for (var i = 1; i < 7; i += 2) {
            colorNew.push(parseInt("0x" + color.slice(i, i + 2)));
        }
        colorNew.push(opacity)
        return "rgba(" + colorNew.join(",") + ")";
    }
    return color;
}

export function formatWapPath(path) {
    if (path && typeof path == 'string') {
        if (path.indexOf('http://') > -1 || path.indexOf('https://') > -1 || path.indexOf('tel:') > -1) {
            return path
        } else if (path.indexOf('/') == 0) {
            if (path.indexOf('?') > -1) {
                let arr = path.split('?');
                //#ifdef H5
                if (arr[0] == '/pages/index/index') {
                    arr[0] = '/'
                }
                //#endif
                let params = arr[1].split('&');
                let query = {};
                params.forEach(item => {
                    let tmp = item.split('=')
                    let key = tmp[0];
                    let val = tmp[1];
                    query[key] = val
                })

                return {
                    path: arr[0],
                    query
                }
            } else {
                //#ifdef H5
                if (path == '/pages/index/index') {
                    path = '/'
                }
                //#endif
                return {
                    path,
                    query: {}
                }
            }
        }
        return path
    } else if (typeof path == 'object' && path.path) {
        let params = formatWapPath(path.path)
        if (typeof params == 'string') {
            path.path = params
        } else {
            path.path = params.path
            path.query = {
                ...params.query,
                ...path.query
            }
        }

        return path
    } else {
        return path
    }
}

export function getImgInfo(url) {
    return new Promise((resolve, reject) => {
        uni.getImageInfo({
            src: url,
            success(image) {
                resolve(image)
            }
        });
    })
}

export function arrSplit(array, subGroupLength) { //数组等长分割

    let newArray = array;
    if (array instanceof Array && array.length && subGroupLength > 0) {
        newArray = []
        let index = 0;
        while (index < array.length) {
            newArray.push(array.slice(index, index += subGroupLength));
        }
    }
    return newArray;
}

export let isWx = false

const getClient = () => {
    // 浏览器环境
    if (navigator) {
        /* 判断是否在微信环境 */
        let ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            isWx = true
        } else {
            isWx = false
        }
    } else { //小程序环境
        isWx = 'wxapp'
        return 'wxapp'
    }
}
getClient()
// 加载渠道状态,微信关闭走H5渠道
let isLoadChannel = false
let isWxClient;
export function is_weixin() {
    // #ifdef H5
    if (isLoadChannel) {
        return isWxClient
    }
    if (isWx) {
        if (store) {
            let res = store.state.setting.channelStatus
            isLoadChannel = true
            // 调整client_type
            isWxClient = (res.wechat == 1)
        } else {
            isWxClient = true
        }
    } else {
        // 调整client_type
        isWxClient = false
    }
    return isWxClient
    // #endif
    // #ifdef MP-WEIXIN
    return 'wxapp'
    // #endif
};

export function getSystemInfo() {
    let cache = sessionStorage.getItem('getSystemInfo')
    let getSystemInfo = cache && JSON.parse(cache)
    if (getSystemInfo) {
        return getSystemInfo
    } else {
        getSystemInfo = uni.getSystemInfoSync();
        sessionStorage.setItem('getSystemInfo', JSON.stringify(getSystemInfo))
        return getSystemInfo
    }
};

/**
 * 拼接路由及参数
 * @param routes
 * @param params
 * @returns {*}
 */
export function getFullPath(routes, params) {
    let url = routes
    let base_url = settings?.base_url || '';
    if (params && typeof (params) === 'object') {
        let string = ''
        for (let item in params) {
            string += item + '=' + params[item] + '&'
        }
        url += (((base_url + url).indexOf('?') === -1) ? '?' : '&') + string
    }
    if (/.+\?$/.test(url)) { //？结尾的去掉？
        url = url.slice(0, -1)
    }
    return (settings?.base_url || '') + url
}

/**
 * 提取url中的query以及hash中的query
 *
 * @param {} url
 */
export function getRouteParams(url) {
    let tmp = url.split('#').filter(Boolean);
    let host = /^http(?:s)?:\/\/(?:.*?)(?=[/&?#])/.exec(url) || '';

    if (host) {
        host = host[0].replace(/\/$/, '')
    }
    let location = {
        hash: tmp[1] ? ('#' + tmp[1]) : '',
        path: tmp[0],
        href: url,
        host,
        pathname: tmp[0].split('?')[0].replace(host, ''),
        query: {},
        hashQuery: {},
        search: tmp[0].split('?')[1] || ''
    };
    let query = {};
    if (location.search) {
        location.search.split('&').filter(Boolean).forEach(item => {
            let tmp = item.split('=');
            query[tmp[0]] = tmp[1] || '';
        })
        location.query = query;
    }

    if (tmp.length > 1) {
        let hashQuery = {};
        if (location.hash.indexOf('?') > -1) {
            location.hash.split('?')[1].split('&').forEach(item => {
                let tmp = item.split('=');
                hashQuery[tmp[0]] = tmp[1] || '';
            })
        }
        location.hashQuery = hashQuery;
    }
    return location
}

/**
 * 向url中添加query参数
 *
 * @param {*} obj
 */
export function addRouteParams(url, params, pos = 0) {
    let location = getRouteParams(url);
    let string = createRouteParams(params);
    let res = ''
    if (pos === 0) {
        let newParams = {
            ...location.query,
            ...params
        };
        let path = location.path;
        let search = createRouteParams(newParams)
        console.log(newParams, '<<<<<', location)
        if (path.indexOf('?') > -1) {
            res = location.host + location.pathname + '?' + search + location.hash
        } else {
            res = path + '?' + string + location.hash
        }

    } else {
        if (location.hash.indexOf('?') > -1) {
            res = location.href + '&' + string
        } else {
            res = location.href + '?' + string
        }

    }
    return res.replace(/[?&]$/, '')
}

export function createRouteParams(params) {
    let string = '';
    for (let item in params) {
        string += item + '=' + params[item] + '&'
    }
    string = string.replace(/&$/, '')
    return string
}

/**
 * 转换图片实际url
 * @author Gao
 * @param src 单个图片path
 * @param type 图片类型，图片可不传，manage(代表使用本地url拼接)/video(不拼接图片压缩参数)
 * @returns {*}
 */
export function toMediaUrl(src, type) {
    // 微信、头条小程序本地图片校验
    let reg = /^((blob:){0,1}http:\/\/(tmp\/wx){0,1})|(wxfile:\/\/tmp_)|(ttfile:\/\/temp\/)\w*/;
    if (src.indexOf('data:') == 0 || reg.test(src)) {
        return src
    }
    if (src.indexOf('http://') !== -1 || src.indexOf('https://') !== -1 || src.indexOf('wxfile://') !== -1) {
        return src
    }

    if (!/\/$/.test(settings.attachment_url)) { //必须是/结尾
        settings.attachment_url = settings.attachment_url + '/'
    }

    if (src.substr(0, 1) === '/') {
        return settings.public_url + src.slice(1);
    } else {
        // 店铺存储地址与图片压缩
        let shopStorage = store.state.setting.shopStorage;
        if ((!type || type === 'video') && shopStorage.attachmentUrl) {
            if (type === 'video') {
                return shopStorage.attachmentUrl + src
            }
            return shopStorage.attachmentUrl + src + (shopStorage.attachmentSuffix ? `?${shopStorage.attachmentSuffix}` : '')
        }
        return settings.attachment_url + src;
    }
}

/**
 * 移动端的图片地址，链接移动端图片用的方法
 * @param {} url
 */
export function staticMediaUrl(url, defaultUrl) {
    settings = require('@/static/settings.js').config
    if (url.indexOf('/') == 0) {
        return url;
    } else if (url.indexOf('http://') > -1 || url.indexOf('https://') > -1) {
        return url;
    } else if (!url && defaultUrl && typeof defaultUrl == 'string') {
        if (defaultUrl.indexOf('/') == 0) {
            return defaultUrl;
        } else if (defaultUrl.indexOf('http://') > -1 || defaultUrl.indexOf('https://') > -1) {
            return defaultUrl;
        } else {
            return settings?.wap_dist_url + defaultUrl;
        }
    }
    return settings?.wap_dist_url + url;
}

export function themeMediaUrl(url){
    let theme_color = store.state.setting.theme_color;
    if(theme_color!='default') {
        url = url.replace(/\.png/, `_${theme_color}.png`)
    }
    return staticMediaUrl(url)
}

/**
 * 转换图片实际url
 * @author Gao
 * @param urls 单个图片/数组图片/富文本
 * @returns {*}
 */
export function mediaUrl(urls, defaultUrl, type) {
    if (!urls) {
        if (defaultUrl && typeof defaultUrl == 'string') {
            return toMediaUrl(defaultUrl)
        }
        return ''
    }
    if (typeof urls === 'object') {
        if (urls.type == 'local' || urls.type == 'network') {  // 兼容腾讯视频和本地视频
            if (urls.path.indexOf('http://') !== -1 || urls.path.indexOf('https://') !== -1) {
                return urls.path
            } else {
                let shopStorage = store.state.setting.shopStorage;
                if ((!type || type === 'video') && shopStorage.attachmentUrl) {
                    if (type === 'video') {
                        return shopStorage.attachmentUrl + urls.path
                    }
                    return shopStorage.attachmentUrl + urls.path + (shopStorage.attachmentSuffix ? `?${shopStorage.attachmentSuffix}` : '')
                }
                return settings.attachment_url + urls.path
            }
        } else {
            //数组
            urls.forEach(function (src) {
                src = toMediaUrl(src)
            })
            return urls
        }

    } else if (urls.indexOf('<img') !== -1) {
        //富文本
        return urls.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
            return match.replace(capture, toMediaUrl(capture, type))
        })
    }
    return toMediaUrl(urls, type)
}


// 返回promise
export const getSDKInstance = InGetSDKInstance = (() => {
    // #ifdef H5
    if (is_weixin()) {
        let Instance = null;
        let pubUrl = '';

        return (url = "", errorcallback = () => {}) => {
            url = encodeURIComponent(url);
            pubUrl = url;

            if (!Instance || pubUrl != url) {
                return new Promise((resolve, reject) => {
                    // 初始化sdk相关配置
                    request.get('/wechat/js-sdk', {
                        url
                    }).then(res => {
                        if (res.error === 0) {
                            jweixin.config({
                                debug: window.wxDebug || false,
                                appId: res.config.appId,
                                timestamp: res.config.timestamp,
                                nonceStr: res.config.nonceStr,
                                signature: res.config.signature,
                                jsApiList: [
                                    "onMenuShareAppMessage",
                                    "onMenuShareTimeline",
                                    "invokeMiniProgramAPI",
                                    "openAddress",
                                    "scanQRCode",
                                    "openLocation",
                                    "getLocation",
                                    "wx-open-subscribe"
                                ],
                                openTagList: ["wx-open-launch-weapp", "wx-open-subscribe","wx-open-subscribe-dialog"],
                            });

                            jweixin.ready(function () {
                                Instance = jweixin;
                                resolve(Instance);
                            });
                            jweixin.error(function (e) {
                                console.log(e, 'jsApiList>>>>>>>>>>>>');
                                errorcallback(e);
                            })
                        } else {
                            uni.showToast({
                                icon: 'none',
                                title: res.message
                            })
                            resolve(0);
                        }
                    })
                });
            } else {
                return Promise.resolve(Instance);
            }
        };
    }
    // #endif
})();

/**
 * 跨平台获取当前位置
 * @returns {Promise} 返回经纬度 -1 定位失败  {latitude:'', longitude: ''} -99 平台处理不支持扫码这个功能因为只能小程序和公众号call起来 -2 公众号失败
 */
export const getLocation = () => {
    return new Promise((resolve) => {
        // 设置坐标
        const setLocation = (res) => {
            return {
                longitude: res.longitude,
                latitude: res.latitude,
            };
        };

        // 小程序端，只用用uni-app 为什么不能通用？ luchao的demo是可以不知道这里为什么不可以所以借助微信jssdk来做一下。
        // #ifndef H5
        uni.getLocation({
            success: (res) => {
                resolve(setLocation(res));
            },
            fail: function () {
                resolve(-1);
            },
        });
        // #endif

        // h5
        // #ifdef H5
        // 公众号
        if (is_weixin()) {

            // 修改bug-23695
            let url = window.location.href;
            if (operationSystemType() == 'ios') {
                url = store.state.setting.wxSignUrl
            }

            const getSDKInstance = InGetSDKInstance(url, (error) => {
                // by ios
                if (window.JWEIXIN) {
                    window.JWEIXIN.getLocation({
                        success: (res) => {
                            resolve(setLocation(res));
                        },
                        fail: () => {
                            resolve(-1);
                        },
                    });
                } else {
                    resolve(-2);
                }
            });
            // 获取坐标系
            getSDKInstance.then((obj) => {
                obj.getLocation({
                    complete: () => {
                        resolve(-1);
                    },
                    success: (res) => {
                        resolve(setLocation(res));
                    },
                    fail: () => {
                        console.log('fail失败');
                        resolve(-1);
                    }
                });
            });
        } else {
            resolve(-99);
        }
        // #endif
    });
}

export function getShareInfo(shareInfo, has, callback) {
    console.log(shareInfo, 'shareInfo')

    // alert(JSON.stringify(shareInfo))

    // #ifdef H5
    if (is_weixin()) {
        shareInfo.sdkUrl = encodeURIComponent(shareInfo.sdkUrl);

        request.get('/wechat/js-sdk', {
            'url': shareInfo.sdkUrl
        }).then(res => {
            let link = '';
            link = shareInfo.link;
            if (res.error === 0) {
                jweixin.config({
                    // debug: false, // 开启调试模式,开发时可以开启
                    debug: window.wxDebug || false, // 开启调试模式,开发时可以开启
                    appId: res.config.appId, // 必填，公众号的唯一标识   由接口返回
                    timestamp: res.config.timestamp, // 必填，生成签名的时间戳 由接口返回
                    nonceStr: res.config.nonceStr, // 必填，生成签名的随机串 由接口返回
                    signature: res.config.signature, // 必填，签名 由接口返回
                    jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'invokeMiniProgramAPI', 'openAddress', "scanQRCode", "openLocation", "getLocation","wx-open-subscribe"], // 此处填你所用到的方法
                    openTagList: ['wx-open-launch-weapp',"wx-open-subscribe", "wx-open-subscribe-dialog"] // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
                });

                jweixin.ready(function () {
                    window.JWEIXIN = jweixin;
                    // alert('shareInfo>>>'+JSON.stringify(shareInfo));
                    jweixin.onMenuShareAppMessage({
                        title: shareInfo.title, // 分享标题
                        desc: shareInfo?.description || '',
                        link: link, // 分享链接！
                        imgUrl: mediaUrl(shareInfo.logo), // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            if (callback) {
                                callback()
                            }
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                    //分享到朋友圈
                    jweixin.onMenuShareTimeline({
                        title: shareInfo.title, // 分享标题
                        link: link, // 分享链接！
                        imgUrl: mediaUrl(shareInfo.logo), // 分享图标
                        success: function () {
                            if (callback) {
                                callback()
                            }
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                    // 无用
                    // jweixin.hideMenuItems({
                    //     menuList: ['menuItem:copyUrl', 'menuItem:readMode'], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
                    //     success: function (res) {
                    //     }
                    // });
                });
            }
        }).catch(rej => {
        })
    }
    // #endif
}

// 判断是安卓还是iOS
export function operationSystemType() {
    if (sysType == -1) {
        // #ifdef H5
        let u = navigator.userAgent,
            app = navigator.appVersion;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
            sysType = 'android';
            //这个是安卓操作系统
            return 'android';
        }
        if (isIOS) {
            sysType = 'ios';
            //这个是ios操作系统
            return 'ios';
        }
        // #endif
        // #ifndef H5
        return new Promise((resolve, reject) => {
            wx.getSystemInfo({
                success(res) {
                    if (/ios/i.test(res.system)) {
                        sysType = 'ios'
                        resolve('ios')
                    } else {
                        sysType = 'android'
                        resolve('android')
                    }
                }
            })
        })

        // #endif
    }
    return sysType
};

let util = {
    SIGN_REGEXP: /([yMdhsm])(\1*)/g,
    DEFAULT_PATTERN: 'yyyy-MM-dd'
};

util.padding = (s, len) => {
    let lens = len - (s + '').length;
    for (let i = 0; i < lens; i++) {
        s = '0' + s;
    }
    return s;
};

export const formatDateTime = (date, pattern) => {
    if (!date) {
        return '';
    }
    if (typeof date != 'object') {
        return date;
    }

    pattern = pattern || util.DEFAULT_PATTERN;
    return pattern.replace(util.SIGN_REGEXP, $0 => {
        switch ($0.charAt(0)) {
            case 'y':
                return util.padding(date.getFullYear(), $0.length);
            case 'M':
                return util.padding(date.getMonth() + 1, $0.length);
            case 'd':
                return util.padding(date.getDate(), $0.length);
            case 'w':
                return date.getDay() + 1;
            case 'h':
                return util.padding(date.getHours(), $0.length);
            case 'm':
                return util.padding(date.getMinutes(), $0.length);
            case 's':
                return util.padding(date.getSeconds(), $0.length);
        }
    });
};

// 倒计时方法，return days hours minutes seconds
export function countDown(timePoint, time, stamp = true) {
    // 当前时间
    let now = parseInt(Date.now() / 1000);
    let leftTime = 0; //
    if (timePoint) {
        leftTime = timePoint > now ? (timePoint - now) : 0; //时间差
        leftTime = parseInt(leftTime);
    }
    if (time) {
        leftTime = parseInt(time);
    }
    if (leftTime == 0) {
        return false;
    } else {
        let day = Math.floor(leftTime / (60 * 60 * 24));
        let hour = Math.floor((leftTime - day * 24 * 60 * 60) / 3600);
        let minute = Math.floor((leftTime - day * 24 * 60 * 60 - hour * 3600) / 60);
        let second = Math.floor(leftTime - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
        let time;
        if (stamp) {
            time = [day, hour < 10 ? '0' + hour : hour, minute < 10 ? '0' + minute : minute, second < 10 ? '0' + second : second];
        } else {
            hour = day * 24 + hour
            time = [hour < 10 ? '0' + hour : hour, minute < 10 ? '0' + minute : minute, second < 10 ? '0' + second : second];
        }
        return time;
    }
};

// 处理返回的路径
const formatPath = (result) => {
    let path = result.map(res => {
        if (res.error === 0) {
            return res.path
        } else {
            return false
        }
    })

    return path
}

export const multipleFilesUpload = (files) => {
    let filesPromise = files.map(file => singleUpload(file))
    return Promise.all(filesPromise).then(res => {
        return new Promise((resolve, reject) => {
            let path = formatPath(res)
            if (path[0] && path.length === files.length) {
                resolve(path)
            } else {
                reject('文件上传失败')
            }
        })
    })
}

export const singleUpload = (file) => {
    return api.orderApi.uploadFile(file)
}

// 获取直播间封面
export const getLiverImg = (url) => {
    if (url) {
        if (url.indexOf('http') > -1) {
            return settings.base_url + `/utility/attachment/index/get-wechat-image?url=` + url
        } else {
            return mediaUrl(url)
        }
    } else {
        return ''
    }
}
// #ifdef MP-WEIXIN
export const liverPlayer = playerPlugin
// #endif
//  缓存直播状态
let currentLiver = {}

export const openLiver = ({ liverId, broadId }) => {
    if (!broadId) {
        return
    }
    // #ifdef MP-WEIXIN
    if (liverPlayer) {
        if (currentLiver[broadId]) {
            goLiver(broadId, currentLiver[broadId], liverId)
        } else {
            liverPlayer.getLiveStatus({
                room_id: broadId
            }).then(res => {
                goLiver(broadId, res.liveStatus, liverId)
                currentLiver[broadId] = res.liveStatus
                let timer = setTimeout(() => {
                    currentLiver[broadId] = null
                    clearTimeout(timer)
                }, 60000);
            })
        }
    } else {
        uni.showToast({
            icon: 'none',
            title: '未开启小程序直播插件'
        })
    }
    // #endif

    // #ifndef  MP-WEIXIN
    store.commit('setLiverCode', {
        liverId,
        broadId
    })
    // #endif
}

// 版本号比较
export function compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }

    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }

    return 0
}


const goLiver = (broadId, status, liverId) => {
    let codes = [101, 102, 103, 106];
    if (codes.includes(status)) {
        let url = `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${broadId}`;
        let query = {
            liverId
        }

        if (store.state.login.isLogin) {
            query.inviter_id = store.state.login.userInfo.id
        }

        let customParams = encodeURIComponent(JSON.stringify(query))
        url += `&custom_params=${customParams}`
        uni.navigateTo({
            url
        })
    } else {
        uni.showToast({
            icon: 'none',
            title: '该直播间已过期'
        })
    }
}

export const getRect = function (selector, all) {
    return new Promise(resolve => {
        uni.createSelectorQuery().in(this)[all ? 'selectAll' : 'select'](selector)
            .boundingClientRect(rect => {
                if (all && Array.isArray(rect) && rect.length) {
                    resolve(rect)
                }
                if (!all && rect) {
                    resolve(rect)
                }
            })
            .exec()
    })
}

//1. 防抖
export function debounce(func, ms = 1000) {
    let timer;
    return function (...args) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            func.apply(this, args)
        }, ms)
    }
}

// 节流
export function throttle(func, ms = 1000) {
    let canRun = true
    return function (...args) {
        if (!canRun) return
        canRun = false
        setTimeout(() => {
            func.apply(this, args)
            canRun = true
        }, ms)
    }
}

// 微信跳转小程序
export const goWxApp = function (path, appId, extraData = {}, callback) {
    if (!appId) {
        return
    }

    path = path.replace('wxapp:', '')
    // #ifndef MP-WEIXIN
    store.dispatch('getWxCode').then(res => {
        if (res) {
            store.commit('changeWxCode', {
                status: true,
                type: 'app_skip'
            })
        }
    })
    // #endif


    // #ifdef MP-WEIXIN
    uni.navigateToMiniProgram({
        appId: appId,
        path,
        extraData,
        envVersion: 'trial', // 要打开的小程序版本，有效值： develop （开发版）， trial （体验版）， release （正式版）。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。
        success(res) {
            // 打开成功
            console.log('navigateToMiniProgram success++++++++++++', res)
            if (callback) {
                callback(res)
            }
        },
        fail(res) {
            console.log('navigateToMiniProgram fail++++++++++++', res)
            if (callback) {
                callback(res)
            }
        },
    })
    // #endif
}


// 多规格价格相等时返回一个价格
export const formartPrice = function (price, code = '-') {
    if (typeof price !== 'string') {
        return price
    }

    let arr = price.split(code)
    if (arr.length == 2 && arr[0] == arr[1]) {
        return arr[0]
    } else {
        return price
    }
}
function getTableStyle(content) {
    let table = /<table [^>]*?style=['"]([^'"]+?)['"]/g;
    content = content.replace(table, (val) => {
        return val + ';table-layout:fixed;'
    })
    return content;
}
export function toMobileRichText(content) {
    let reg = /<[a-z]+? [^>]*?style=['"]([^'"]+?)['"][^>]*?>/g
    let reg2 = /(\d+)(px)/g
    let substring = ''
    let str = content.replace(reg, (val, substr) => {
        substring = substr.replace(reg2, (string) => {
            return parseInt(string) + 'rpx'
        })
        return val.replace(substr, substring)
    })
    return getTableStyle(str)
}
// 将分类的名称按照5个一行的原则进行展示
export const showCategoryName = (name) => {
    if (name.length > 5) {
        return name.slice(0, 5) + '\n' + name.slice(5)
    } else {
        return name;
    }
}

// 富文本图片url拼接
export const richMediaUrl = (content) => {
    if (content.indexOf('<img') !== -1) {
        //富文本
        return content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
            return match.replace(capture, mediaUrl(capture));
        });
    }
    return content
};
// 富文本视频url拼接
export const richVideo = (content) => {
    if (content.indexOf('<video') !== -1) {
        //富文本
        return content.replace(/<video [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
            return match.replace(capture, mediaUrl(capture, '', 'video'));
        });
    }
    return content
};


/* 获取当前手机端链接 支付使用 */
export const getPhoneUrl = () => {
    return `${settings.wap_url}`
}

/*
* 小程序消息订阅
* ids 订阅模板id
* callback 订阅执行完成调用的方法
* */
export const sendWxappMsg = (type_code, callback) => {
    // #ifdef MP-WEIXIN
    let ids = [],
            noticeIds = store.state.setting?.noticeTemId
    console.log('-----------sendWxappMsg-------?????????>>>>>>>--------',noticeIds)
    if(noticeIds && type_code.length) {
        type_code.map((item)=> {
            if(noticeIds[item]) {
                ids.push(noticeIds[item])
            }
        })
    }
    console.log('-----------sendWxappMsg---ids----ids?????ids????>>>>>>>--------',ids)
    wx.requestSubscribeMessage({
        tmplIds: ids,
        success(res) {
            console.log(res,'success');
        },
        fail(rej) {
            console.log(rej,'fail');
        },
        complete: (res) => {
            console.log(res,'complete');
            if(callback) {
                callback()
            }
        }
    })
    // #endif
}

export const isArray = (arr) =>  Object.prototype.toString.call(arr) == "[object Array]"

export function createQueryParams(params) {
    let string = '';
    for (let item in params) {
        string += item + '=' + params[item] + '&'
    }
    string = string.replace(/&$/, '')
    return string
}
