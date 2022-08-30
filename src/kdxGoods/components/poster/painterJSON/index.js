import {
    staticMediaUrl,
    mediaUrl,
    deepCopy
} from '@/common/util.js'
import $store from '@/store'

function px2rpx(val) {
    // #ifdef H5
    return val * 0.936 + 'px'
    // #endif
    // #ifndef H5
    return val * 0.936 + 'rpx'
    // #endif
}
function refreshImgUrl(url){
    // #ifdef H5
    if(url.indexOf('http')==0){
        if(url.indexOf('?')>-1){
            url=url+'&t='+new Date().getTime()
        }else{
            url=url+'?t='+new Date().getTime()
        }
    }
    // #endif
    // #ifndef H5
    url=url.replace('http:','https:')
    // #endif
    return url
}
function maxLines(componentData) {
    let rownum = Math.round(componentData.style.height / ((componentData.style.fontsize||12) * (componentData.style.lineheight || 1.1)))
    rownum = Math.max(rownum, 1);
    return rownum
}
function colorRgb(color, opacity = 1) {
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
const posterItem = {
    poster_avatar(data, index) {
        return {
            type: 'image',
            url: refreshImgUrl(data.params.imgurl ? mediaUrl(data.params.imgurl) : staticMediaUrl('decorate/avatar_square.png')),
            css: {
                "width": px2rpx(data.style.width),
                "height": px2rpx(data.style.height),
                background: data.style.bgcolor,
                "top": px2rpx(data.style.top),
                "left": px2rpx(data.style.left),
                borderRadius: data.params.borderradius == 0 ? px2rpx(data.style.width) : 0,
                borderWidth: data.params.bordershow == 1 ? px2rpx(data.style.borderwidth || 1) : 0,
                borderColor: data.style.bordercolor,
                "mode": "scaleToFill",
            }
        }
    },
    poster_bgimg(data, index) {
        if (data.params.bgtype == 0) {
            return {
                "type": "rect",
                "css": {
                    "width": px2rpx(750),
                    "height": px2rpx(1334),
                    "background": data.style.bgcolor,
                    "top": '0',
                    "left": '0',
                    "rotate": "0",
                    "shadow": "",
                    "color": data.style.bgcolor,
                    "borderRadius": '0',
                }
            }
        }
        return {
            type: 'image',
            url: refreshImgUrl(data.params.imgurl? mediaUrl(data.params.imgurl) : staticMediaUrl('decorate/page_bg_img.png')),
            css: {
                width: px2rpx(750),
                height: px2rpx(1334),
                top: '0',
                left: '0',
                "mode": "scaleToFill"
            }
        }
    },
    poster_delprice(data, index) {
        if(!parseFloat(data.params.content)){
            return []
        }
        return {
            "type": "text",
            "text": '￥' + data.params.content,
            "css": {
                "color": data.style.color,
                "background": "rgba(0,0,0,0)",
                "top": px2rpx(data.style.top),
                "left": px2rpx(data.style.left),
                "fontSize": px2rpx(data.style.fontsize),
                "fontWeight": data.style.fontweight > 400 ? 'bold' : 'normal',
                "borderRadius": '0',
                lineHeight: px2rpx(data.style.fontsize * (data.style.lineheight || 1)),
                // textAlign:data.style.textalign||'left',
                maxLines:1,
                'textDecoration':'line-through'
            }
        }
    },
    poster_exptime(data, index) {
        return {
            "type": "text",
            "text": data.params.content,
            "css": {
                "color": data.style.color,
                "background": "rgba(0,0,0,0)",
                "top": px2rpx(data.style.top),
                "left": px2rpx(data.style.left),
                "fontSize": px2rpx(data.style.fontsize),
                "fontWeight": data.style.fontweight > 400 ? 'bold' : 'normal',
                "borderRadius": 0,
                lineHeight: px2rpx(data.style.fontsize * (data.style.lineheight || 1.4)),
                textAlign:data.style.textalign||'left',
                maxLines:1
            }
        }
    },
    poster_goodimg(data, index) {
        return {
            type: 'image',
            url: refreshImgUrl(data.params.imgurl ?  mediaUrl(data.params.imgurl) : staticMediaUrl('decorate/page_bg_img.png')),
            css: {
                width: px2rpx(data.style.width),
                height: px2rpx(data.style.height),
                top: px2rpx(data.style.top),
                left: px2rpx(data.style.left),
                borderRadius: data.params.borderradius == 0 ? px2rpx(12) : 0,
                borderWidth: data.params.bordershow == 1 ? px2rpx(data.style.borderwidth) : 0,
                borderColor: data.style.bordercolor,
                "mode": "scaleToFill"
            }
        }
    },
    poster_goodname(data, index) {
        return {
            "type": "text",
            "text": data.params.content,
            "css": {
                "color": data.style.color,
                "background": "rgba(0,0,0,0)",
                "width": px2rpx(data.style.width),
                "top": px2rpx(data.style.top),
                "left": px2rpx(data.style.left),
                "fontSize": px2rpx(data.style.fontsize),
                "fontWeight": data.style.fontweight > 400 ? 'bold' : 'normal',
                "borderRadius": 0,
                lineHeight: px2rpx(data.style.fontsize * (data.style.lineheight || 1.4)),
                textAlign:data.style.textalign||'left',
                maxLines: maxLines(data),
            }
        }
    },
    poster_nickname(data, index) {
        return {
            "type": "text",
            "text": data.params.content,
            "css": {
                "color": data.style.color,
                "background": "rgba(0,0,0,0)",
                "width": px2rpx(data.style.width),
                "top": px2rpx(data.style.top),
                "left": px2rpx(data.style.left),
                "fontSize": px2rpx(data.style.fontsize),
                "fontWeight": data.style.fontweight > 400 ? 'bold' : 'normal',
                "borderRadius": 0,
                lineHeight: px2rpx(data.style.fontsize * (data.style.lineheight || 1.4)),
                textAlign:data.style.textalign||'left',
                maxLines:maxLines(data)
            }
        }
    },
    poster_price(data, index) {
        return {
            "type": "text",
            "text": !data.params?.buy_button_status ? '￥' + data.params.content : '  '+data.params?.buy_button_settings?.price_text ,
            "css": {
                "color": data.style.color,
                "background": "rgba(0,0,0,0)",
                "top": px2rpx(data.style.top),
                "left": px2rpx(data.style.left),
                "fontSize": px2rpx(data.style.fontsize),
                "fontWeight": data.style.fontweight > 400 ? 'bold' : 'normal',
                "borderRadius": 0,
                lineHeight: px2rpx(data.style.fontsize * (data.style.lineheight || 1)),
                textAlign: data.style.textalign||'left',
                maxLines:1
            }
        }
    },
    poster_sellprice(data, index) {
        return {
            "type": "text",
            "text": !data.params?.buy_button_status ? '￥' + data.params.content : '  '+data.params?.buy_button_settings?.price_text ,
            "css": {
                "color": data.style.color,
                "background": "rgba(0,0,0,0)",
                "top": px2rpx(data.style.top),
                "left": px2rpx(data.style.left),
                "fontSize": px2rpx(data.style.fontsize),
                "fontWeight": data.style.fontweight > 400 ? 'bold' : 'normal',
                "borderRadius": 0,
                lineHeight: px2rpx(data.style.fontsize * (data.style.lineheight || 1)),
                textAlign: data.style.textalign||'left',
                maxLines:1
            }
        }
    },
    poster_img(data, index) {
        return {
            type: 'image',
            url: refreshImgUrl(data.params.imgurl ? mediaUrl(data.params.imgurl) : staticMediaUrl('decorate/page_bg_img.png')),
            css: {
                width: px2rpx(data.style.width),
                height: px2rpx(data.style.height),
                top: px2rpx(data.style.top),
                left: px2rpx(data.style.left),
                borderRadius: data.style.borderradius == 0 ? px2rpx(12) : 0,
                borderWidth: data.params.bordershow == 1 ? px2rpx(data.style.borderwidth) : 0,
                borderColor: data.style.bordercolor,
                "mode": data.style.mode? data.style.mode:"scaleToFill"
            }
        }
    },
    poster_qrcode(data, index) {
        let temp = {}
        try {
            temp = {
                type: 'image',
                url: refreshImgUrl(mediaUrl(data.params.imgurl)),
                css: {
                    width: px2rpx(data.style.width),
                    height: px2rpx(data.style.height),
                    top: px2rpx(data.style.top),
                    left: px2rpx(data.style.left),
                    borderRadius: data.params.borderradius == 0 ? px2rpx(12) : 0,
                    borderWidth: data.params.bordershow == 1 ? px2rpx(data.style.borderwidth) : 0,
                    borderColor: data.style.bordercolor,
                    "mode": "scaleToFill"
                }
            }
        } catch (e) {
            console.log(e, '>><><')
        }
        return temp
    },
    poster_commission(data, index) {
        if (data.params.commission == 0) {
            return []
        }
        return [{
            type: 'text',
            "text": ' ',
            css: {
                width: px2rpx(data.style.width),
                height: px2rpx(data.style.height),
                top: px2rpx(data.style.top),
                left: px2rpx(data.style.left),
                borderRadius: px2rpx(data.style.borderradius),
                borderWidth: '0',
                borderColor: colorRgb(data.style.bgcolor, data.style.opacity),
                "mode": "scaleToFill",
                textAlign: 'center',
                lineHeight: px2rpx(data.style.height),
                "fontSize": px2rpx(data.style.fontsize),
                "color": data.style.color,
                "background": colorRgb(data.style.bgcolor, data.style.opacity),
                "fontWeight": data.style.fontweight > 400 ? 'bold' : 'normal',
            }
        }, {
            type: 'text',
            "text": '预计佣金 ￥' + data.params.commission,
            css: {
                width: px2rpx(data.style.width),
                height: px2rpx(data.style.height),
                top: px2rpx(data.style.top * 1 + (data.style.height - data.style.fontsize) / 2.2),
                left: px2rpx(data.style.left),
                borderRadius: px2rpx(data.style.borderradius),
                borderWidth: '0',
                borderColor: colorRgb(data.style.bgcolor, data.style.opacity),
                "mode": "scaleToFill",
                textAlign: 'center',
                lineHeight: px2rpx(data.style.fontsize),
                "fontSize": px2rpx(data.style.fontsize),
                "color": data.style.color,
                "background": colorRgb(data.style.bgcolor, data.style.opacity),
                "fontWeight": data.style.fontweight > 400 ? 'bold' : 'normal',
            }
        }]
    },
    poster_shoplogo(data, index) {
        let css = {
            width: px2rpx(data.style.width),
            top: px2rpx(data.style.top),
            left: px2rpx(data.style.left),
            "borderRadius": data.style.borderRadius? px2rpx(data.style.borderRadius): 0,
            "mode": data.style.mode? data.style.mode:"auto",
            borderWidth: data.params.bordershow == 1 ? px2rpx(data.style.borderwidth) : 0,
            borderColor: data.style.bordercolor||'',
        }
        if(data.params.imgscaletype==1){
            css.height=px2rpx(data.style.height)
        }
        return {
            type: 'image',
            url: refreshImgUrl(data.params.imgurl ? mediaUrl(data.params.imgurl) : staticMediaUrl('decorate/page_bg_img.png')),
            css: css
        }
    },
    poster_shopname(data, index) {
        return {
            "type": "text",
            "text": data.params.content,
            "css": {
                "color": data.style.color,
                "background": "rgba(0,0,0,0)",
                "width": px2rpx(data.style.width),
                "top": px2rpx(data.style.top),
                "left": px2rpx(data.style.left),
                "fontSize": px2rpx(data.style.fontsize),
                "fontWeight": data.style.fontweight > 400 ? 'bold' : 'normal',
                "borderRadius": 0,
                lineHeight: px2rpx(data.style.fontsize * (data.style.lineheight || 1.4)),
                textAlign:data.style.textalign||'center',
                maxLines:maxLines(data)
            }
        }
    },
    poster_text(data, index) {
        return {
            "type": "text",
            "text": data.params.content,
            "css": {
                "color": data.style.color,
                "background": "rgba(0,0,0,0)",
                "width": px2rpx(data.style.width),
                "top": px2rpx(data.style.top),
                "left": px2rpx(data.style.left),
                "fontSize": px2rpx(data.style.fontsize),
                "fontWeight": data.style.fontweight > 400 ? 'bold' : 'normal',
                "borderRadius": 0,
                lineHeight: px2rpx(data.style.fontsize * (data.style.lineheight || 1.4)),
                textAlign:data.style.textalign||'left'
            }
        }
    },
    poster_articletitle(data, index) {
        return {
            "type": "text",
            "text": data.params.content,
            "css": {
                "color": data.style.color,
                "background": "rgba(0,0,0,0)",
                "width": px2rpx(data.style.width),
                "top": px2rpx(data.style.top),
                "left": px2rpx(data.style.left),
                "fontSize": px2rpx(data.style.fontsize),
                "fontWeight": data.style.fontweight > 400 ? 'bold' : 'normal',
                "borderRadius": 0,
                lineHeight: px2rpx(data.style.fontsize * (data.style.lineheight || 1.4)),
                textAlign:data.style.textalign||'left',
            }
        }
    },
    poster_articledigest(data, index) {
        return {
            "type": "text",
            "text": data.params.content,
            "css": {
                "color": data.style.color,
                "background": "rgba(0,0,0,0)",
                "width": px2rpx(data.style.width),
                "top": px2rpx(data.style.top),
                "left": px2rpx(data.style.left),
                "fontSize": px2rpx(data.style.fontsize),
                "fontWeight": data.style.fontweight > 400 ? 'bold' : 'normal',
                "borderRadius": 0,
                lineHeight: px2rpx(data.style.fontsize * (data.style.lineheight || 1.4)),
                textAlign:data.style.textalign||'left',
            }
        }
    },
}
export default function getStyle(list) {
    let views = []
    let tmp = null;
    let item = null;
    for (let index = 0; index < list.length; index++) {
        item = list[index];
        tmp = posterItem[item.id](item, index)
        if (Array.isArray(tmp)) {
            views = views.concat(tmp)
        } else {
            views.push(tmp)
        }
    }
    views = deepCopy(views)
    return {
        width: px2rpx(750),
        height: px2rpx(1334),
        borderRadius: px2rpx(18),
        views: views
    }
}
