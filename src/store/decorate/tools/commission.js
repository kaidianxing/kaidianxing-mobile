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
 * 分销中心的装修项
 */
/**
 * 接口请求失败时的默认数据
 */
export const defaultPageInfo = {
  page:{
   id: "106",
   type: '20',
   common: {
      description: "",
      diy_adv: "396",
      diy_gotop: "0",
      diy_layer: "0",
      diy_menu: "1",
      error: 0,
      follow_box: "0",
      is_default: "0",
      is_used: "1",
      keywords: "",
      name: "【勿删除】设计默认首页模板",
      no_visit: "null",
      thumb: "",
      pageInfo: {
         background_color: '#f5f5f5'
      },
   },
   content: [{
      "id": "distributor",
      "type": "distributor",
      "name": "分销商信息",
      "max": 1,
      "params": {
         "style":"default1",
         "levellink": "",
         "seticon": "iconfont-m- icon-m-buy",
         "setlink": "",
         "leftnav": "充值",
         "leftnavlink": "",
         "rightnav": "兑换",
         "rightnavlink": "",
         "show_recommender": "1",
         "avatar": "",
         "nickname": "",
         "levelname": "",
         "withdraw": "0",
         "pending": "0",
         "havemoney": "0",
         "levelid": "",
         "level": "9",
         "recommender": ""
      },
      "style": {
         "background": "#FF6F29",
         "nicknamecolor": "#ffffff",
         "recommendercolor": "#ffffff",
         "titlecolor": "#212121",
         "moneycolor": "#212121",
         "hightlightcolor": "#FF3C29",
         "headstyle": ""
      }
   }, {
      "id": "commission_sharecode",
      "type": "commission_sharecode",
      "name": "邀请码",
      "style": {
         "background": "#ffffff",
         "textcolor": "#000000",
         "iconcolor": "#ff8000",
         "margintop": "8",
         "marginbottom": "8",
         "marginleft": "24",
         "fontsize": '28'
      },
      "params": {
         "title": "推广二维码",
         "linkurl": "",
         "linkurl_name": "",
         "subtitle": "",
         "iconclass": "icon-m-erweima iconfont-m-",
         "showicon": 1,
         "topborderradius": "round",
         "bottomborderradius": "round"
      },
      "max": 1
   }, {
      "id": "blockgroup",
      "type": "blockgroup",
      "name": "图标块",
      "params": {
         "rownum": 3,
         "newstyle": 1,
         "sorttype": "col"
      },
      "style": {
         "background": "#ffffff",
         "tipcolor": "#feb312"
      },
      "data": [{
         "iconclass": "iconfont-m- icon-m-yongjin",
         "iconcolor": "#FFDD44",
         "text": "分销佣金",
         "textcolor": "#212121",
         "linkurl": "/kdxCommission/statistics",
         "linkurl_name": "",
         "tipnum": "0.00",
         "tiptext": "元",
         "_sortId": "1586320090161_0.8079887491884752"
      }, {
         "iconclass": "iconfont-m- icon-m-fenxiaodingdan",
         "iconcolor": "#54A3FE",
         "text": "分销订单",
         "textcolor": "#212121",
         "linkurl": "/kdxCommission/order/list",
         "linkurl_name": "",
         "tipnum": "0",
         "tiptext": "笔",
         "_sortId": "1586320090161_0.6713250322066109"
      }, {
         "iconclass":
            "iconfont-m- icon-m-tixianmingxi",
         "iconcolor": "#FF8243",
         "text": "提现明细",
         "textcolor": "#212121",
         "linkurl": "/kdxCommission/withdraw/list",
         "linkurl_name": "",
         "tipnum": "0",
         "tiptext": "笔",
         "_sortId": "1586320090161_0.03343444203476498"
      }, {
         "iconclass": "iconfont-m- icon-m-xiaxian",
         "iconcolor": "#A46AFF",
         "text": "我的下线",
         "textcolor": "#212121",
         "linkurl": "/kdxCommission/downLine",
         "linkurl_name": "",
         "tipnum": "0",
         "tiptext": "人",
         "_sortId": "1586320090161_0.39841303539817763"
      }, {
         "iconclass": "iconfont-m- icon-m-dengjishuoming",
         "iconcolor": "#00E28F",
         "text": "等级说明",
         "textcolor": "#212121",
         "linkurl": "/kdxCommission/level",
         "linkurl_name": "",
         "tipnum": "0",
         "tiptext": "",
         "_sortId": "1586320090161_0.34403834755083684"
      }, {
         "iconclass": "iconfont-m- icon-m-paiming",
         "iconcolor": "#FF715F",
         "text": "佣金排名",
         "textcolor": "#212121",
         "linkurl": "/kdxCommission/ranking",
         "linkurl_name": "",
         "tipnum": "",
         "tiptext": "",
         "_sortId": "1586320090161_0.7664396727774094"
      }]
   }
   ]
  }
}