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
/**
 * 开店星商城系统1.0
 * @author 青岛开店星信息技术有限公司
 * @copyright Copyright (c) 2015-2021 Qingdao ShopStar Information Technology Co., Ltd.
 * @link https://www.kaidianxing.com
 * @warning This is not a free software, please get the license before use.
 * @warning 这不是一个免费的软件，使用前请先获取正版授权。
 */
import api from '@/api'
import * as utils from '@/common/util.js'
import {
    deepCompare
} from '@/common/objectTools.js'
import $decorator from '@/common/decorator'
import store from '@/store'
import {ModuleMixin} from '../Mixin'

const defaultData = {
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
    }
};

class DetailComment extends ModuleMixin{
    constructor() {
        super()
    }
    beforeCreate(item,$Route,lazyLoader){
        if (item.params.showtype) { return }
        let realParams = $decorator.getPage($Route).pageInfo?.detail_comment?.params
        let style = {
            ...defaultData.style,
            ...item.style
        };
        let params = {
            ...defaultData.params,
            ...item.params,
            ...realParams
        };

        $decorator.getPage($Route).setPageInfo({
            detail_comment: {
                style,
                params
            }
        },'beforeCreate/detail_comment.js')
    }
    methods = {

    }
}
export default new DetailComment();