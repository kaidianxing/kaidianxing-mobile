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
import { deepCopy } from "../../../common/objectTools"

const detail_swipe = {
    "id": "detail_swipe",
    "type": "detail_swipe",
    "name": "商品图",
    "max": 1,
    "params": {
        "video": "",
        "video_thumb": ""
    },
    "style": {
        "dotstyle": "round",
        "dotalign": "cebter",
        "background": "#ffffff",
        "leftright": "5",
        "bottom": "5",
        "opacity": "0.8"
    },
    "data": [],
    "_comIndex_": "detail_swipe_3_1590394380395",
    "svg": "xiangqing-shangpintupian",
    "groupName": "商品详情组件",
    "yIndex": 1,
    "groupType": "1",
    "color": "#FF9900",
    "typeid": "detail_swipe"
}

const detail_info = {
    "id": "detail_info",
    "type": "detail_info",
    "name": "商品信息",
    "max": 1,
    "params": {
        "hideshare": "1",
        "share": "分享",
        "share_link": "",
        "linkurl_name": "",
        "share_icon": "iconfont-m- icon-m-shangpinxiangqing-fenxiang",
        "title": "2020年夏季新款韩版宽松显瘦黑色短款刺绣针织开衫短袖t恤上衣女 甜美 新款ins潮",
        "desc": "纯棉中长款短袖t恤女装宽松韩版半袖春季上衣夏装2020年新款ins潮 卡通动漫",
        "price": 115,
        "delPrice": 334,
        "timeBuyCountDown": 1000,
        "expressFee": "10元",
        "sales": 3660,
        "level_name": "白金会员",
        "commisionMax": 5,
        "hidecomsission": "1",
        "canbuy": true,
        "stock": 1000
    },
    "style": {
        "margintop": 0,
        "marginbottom": 0,
        "background": "#ffffff",
        "titlecolor": "#000000",
        "subtitlecolor": "#999999",
        "pricecolor": "#ff5555",
        "textcolor": "#cccccc",
        "timecolor": "#fff2e2",
        "timetextcolor": "#ef4f4f",
        "linepriceColor": "#969696",
        "expresscolor": "#565656",
        "sellcolor": "#565656",
        "stockcolor": "#565656"
    },
    "data": [],
    "_comIndex_": "detail_info_7_1590492301904",
    "icon": "iconfont icon-xiangqing-shangpinxinxi",
    "groupName": "商品详情组件",
    "yIndex": 1,
    "groupType": "1",
    "color": "#FF9900",
    "typeid": "detail_info"
}

const detail_sale = {
    "id": "detail_sale",
    "type": "detail_sale",
    "name": "营销信息",
    "max": 1,
    "params": {
        "label_style": "0"
    },
    "style": {
        "margintop": 16,
        "marginbottom": 0,
        "titlecolor": "#969696",
        "couponBackground": "#FF3C29",
        "background": "#ffffff",
        "textcolor": "#212121",
        "numcolor": "#ff3c29",
        "activeTagColor": "#ff3c29",
        "servercolor": "#fff3f5",
        "serverTextColor": "#ff3c29"
    },
    "data": [],
    "_comIndex_": "detail_sale_5_1590394387767",
    "icon": "iconfont icon-xiangqing-yingxiaoxinxi",
    "groupName": "商品详情组件",
    "yIndex": 1,
    "groupType": "1",
    "color": "#FF9900",
    "typeid": "detail_sale"
}

const detail_spec = {
    "id": "detail_spec",
    "type": "detail_spec",
    "name": "商品规格",
    "max": 1,
    "params": {
        "specs": ""
    },
    "style": {
        "background": "#ffffff",
        "textcolor": "#212121",
        "margintop": 16,
        "marginbottom": 0
    },
    "data": [],
    "_comIndex_": "detail_spec_6_1590394391587",
    "svg": "xiangqing-shangpinguige",
    "groupName": "商品详情组件",
    "yIndex": 1,
    "groupType": "1",
    "color": "#FF9900",
    "typeid": "detail_spec"
}

const detail_comment = {
    "id": "detail_comment",
    "type": "detail_comment",
    "name": "商品评价",
    "max": 1,
    params: {
        total: 10, //总评价数
        praise: 10, //好评条数
        showtype: '1', // 0 普通 1 滑动
        showcommentnum: '1', // 评价条数
        showmore: '0', // 查看更多
        moretext: '查看更多',
        showarrow: '1',
        arrowicon: 'iconfont-def icon-def-jiantou-you1',
        showlevel: '1',
        showstar: '1',
        showspec: '1',
        showtime: '1',
        showimg: '1',
        showall: '1',
        alltext: '更多评论',
    },
    style: {
        titlebgcolor: '#ffffff',
        titlecolor: '#212121',
        commentnumcolor: '#212121',
        morecolor: '#969696',
        arrowcolor: '#969696',
        titledividercolor: '#e6e7eb',
        usercolor: '#212121',
        levelcolor: '#f2dcac',
        levelbgcolor: '#31312d',
        starcolor: '#FF3C29',
        nostarcolor: '#e6e7eb',
        commentcolor: '#212121',
        speccolor: '#969696',
        timecolor: '#969696',
        dividercolor: '#e6e7eb',
        background: "#ffffff",
        margintop: 8,
        marginbottom: 8,
        allcolor: "#969696",
        commentbgcolor: "#f5f5f5",
        bordercolor: "#e6e7eb",
        betweenmargin: 24,
    },
    "data": [],
    "_comIndex_": "detail_comment_7_1590492310080",
    "icon": "iconfont icon-xiangqing-pingjia",
    "groupName": "商品详情组件",
    "yIndex": 1,
    "groupType": "1",
    "color": "#FF9900",
    "typeid": "detail_comment"
}

const detail_pullup = {
    "id": "detail_pullup",
    "type": "detail_pullup",
    "name": "商品详情",
    "max": 1,
    "params": {
        "delable": false,
        "content": "",
        "hidecomsission": "1",
        "comsissiontitle": "预计佣金",
        "params_switch": "1"
    },
    "data": [{
        "key": "key1",
        "value": "value1",
        "_sortId": "1585187373489_0.3565388904511724"
    }, {
        "key": "key2",
        "value": "value2",
        "_sortId": "1585187373489_0.8403229438314261"
    }, {
        "key": "key3",
        "value": "value3",
        "_sortId": "1585187373489_0.04544526710251784"
    }],
    "style": {
        "margintop": 16,
        "background": "#FFFFFF",
        "textcolor": "#333333"
    },
    "_comIndex_": "detail_pullup_5_1586855505890",
    "parent_id": "73",
    "typeid": "detail_pullup"
}

const blank = {
    "id": "blank",
    "type": "blank",
    "name": "辅助空白",
    "params": {},
    "style": {
        "height": "20",
        "background": "#f5f5f5"
    },
    "data": [],
    "_comIndex_": "blank_7_1587455906533",
    "parent_id": "73",
    "icon": "ivu-icon ivu-icon-ios-apps",
    "groupName": "常用组件",
    "groupType": "common",
    "color": "#2D8CF0",
    "typeid": "blank"
}

const detail_navbar = {
    "id": "detail_navbar",
    "type": "detail_navbar",
    "name": "底部导航",
    "isbottom": 2,
    "max": 1,
    "params": {
        "hidelike": "-1",
        "hideshop": "-1",
        "hidecart": "0",
        "hidecartbtn": 0,
        "textbuy": "立即购买",
        "goodstext": "商品",
        "liketext": "关注",
        "customertext":"客服",
        "customericonclass": "iconfont-m- icon-m-fenxiaoshangdengji",
        "likeiconclass": "iconfont-m- icon-m-fenxiaoshangdengji",
        "likelink": "/pages/member/index/index",
        "customerlink": "wx_service",
        "customerWeixinLink": "",  
        "customerWeixinName": "",  
        "customerChannel": "0",    
        "lilelink_name": "",
        "shoplink": "",
        "shoplink_name": "",
        "cartlink": "",
        "cartlink_name": "",
        "favor": 0,
        "shoptext": "店铺33",
        "shopiconclass": "iconfont-m- icon-m-buy1",
        "carttext": "购物车4",
        "carticonclass": "iconfont-m- icon-m-huodaofukuan",
        "badge": 0
    },
    "style": {
        "background": "#ffffff",
        "textcolor": "#969696",
        "iconcolor": "#969696",
        "cartcolor": "#212121",
        "buycolor": "#ff3c29",
        "dotcolor": "#ff3c29",
        "dividercolor": "#e6e7eb"
    },
    "data": [],
    "_comIndex_": "detail_navbar_7_1586855505891",
    "parent_id": "73",
    "typeid": "detail_navbar"
}

const seckill = ()=> {
    let content = [detail_swipe, detail_info, detail_sale,detail_spec,detail_comment,detail_pullup,blank,detail_navbar]
    return content
}


const activityOpt = {
    seckill,
}

const getActiveContent = (activeType) => {
    let content = activityOpt[activeType]()
    return content
}

const getActiveSet = (activeType)=> {
    const settings = {
        error: 0,
        menu: null,
        page: {
            common: {
                background_color: "#f5f5f5",
                data: [],
                description: "",
                diy_menu: "0",
                id: "pageInfo",
                keywords: "",
                menu_id: "",
                menu_name: "",
                params: {
                    linkid: 1,
                    expire_start_time: "",
                    expire_end_time: "",
                    expire_time: 3,
                    access_type: 0,
                    showmenu: "0"
                },
                style: [],
                thumb: "/data/diypage/page/thumb_e3ae60e8a932ac30f5be319b0a248ae5.jpg",
            },
            content: getActiveContent(activeType)
        }
    }
    return settings
}

export default getActiveSet;
