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
/*
 *  用于店铺装修功能，所有的装修组件的模板信息
 *  所有模板的组件数据
 *  这里的数值是rpx值，750的基准
 *  podition:fixed元素为0
 *  组件函数接收到的data为PC端保存时的数据
 *  pageInfo为各个页面实时更新后的数据
 * 计算的时候需要自行合并判断
 */
export default class Calculater {
    pageInfo = {}
    constructor(pageInfo) {
        this.pageInfo = pageInfo;//这是每个页面最新的更新数据
    }
    notice(data) {
        return Math.min(66, 66 + data.style.marginbottom + data.style.margintop);
    }
    banner(data) {
        if (data.style.imgheight > 0) {
            return data.style.imgheight
        }
        return 284
    }
    richtext(data) {
        return 122
    }
    title(data) {
        return 80 + 2 * data.style.paddingtop
    }
    search(data) {
        return 60 + 2 * data.style.paddingtop
    }
    line(data) {
        return 1 * data.style.height + 2 * data.style.padding
    }
    blank(data) {
        return 1 * data.style.height
    }
    menu(data) {
        if (data.style.pagenum == 2) {
            if (data.data.length > data.style.rownum) {
                return 376
            }
            return 346
        } else {
            if (data.data.length > data.style.rownum) {
                return 203
            }
            return 173
        }
    }
    menu2(data) {
        return 80 + 1 * data.style.margintop
    }
    picture(data) {
        let height = 0
        let width = 750 - data.style.paddingleft * 2;
        let rate = width / 750;
        data.data.forEach(item => {
            height += Math.min(item.imgheight * rate || 0, 423) + 2 * (data.style.paddingtop || 0)
        })
        return height
    }
    picturew(data) {
        return 0
    }
    pictures(data) {
        return 292 + data.style.paddingtop * 2
    }
    goods(data) {
        let goods = data.data
        if (this.pageInfo[data._comIndex_]) {
            goods = this.pageInfo[data._comIndex_].data || data.data
        }

        // 修正商品组的高度 商品重复或错误返回时
        if (data.params.goodsscroll == 1) { //左右滑动
            if (data.style.liststyle == 'block two' || data.style.liststyle == 'block') { //双列
                return 440 + (data.style.marginbottom * 1 || 0) + (data.style.margintop * 1 || 0)
            } else if (data.style.liststyle == 'block three') { //三列
                return 320 + (data.style.marginbottom * 1 || 0) + (data.style.margintop * 1 || 0)
            } else if (data.style.liststyle == 'block one') { //单列
                return 404 + (data.style.marginbottom * 1 || 0) + (data.style.margintop * 1 || 0)
            } else {
                return 0
            }
        } else {
            if (data.style.liststyle == 'block two' || data.style.liststyle == 'block') { //双列
                return 472 * Math.ceil(goods.length / 2) + (data.style.marginbottom * 1 || 0) + (data.style.margintop * 1 || 0)
            } else if (data.style.liststyle == 'block three') { //三列
                return 346 * Math.ceil(goods.length / 3) + (data.style.marginbottom * 1 || 0) + (data.style.margintop * 1 || 0)
            } else if (data.style.liststyle == 'block one') { //单列
                return 450 * goods.length + (data.style.marginbottom * 1 || 0) + (data.style.margintop * 1 || 0)
            } else if (data.style.liststyle == 'list') { //列表
                return 312 * goods.length + (data.style.marginbottom * 1 || 0) + (data.style.margintop * 1 || 0)
            } else {
                return 0
            }

        }
    }
    diymod(data) {
        return 0
    }
    listmenu(data) {
        return data.data.length * 96
    }
    wxcard(data) {
        return 0
    }
    member(data) {
        return 280
    }
    distributor(data) {
        return 516
    }
    icongroup(data) {
        return Math.ceil(data.data.length / data.params.rownum) * 170
    }
    bindmobile(data) {
        return 102 + (data.style.margintop * 1 || 0) + (data.style.marginbottom * 1 || 0);
    }

    logout(data) {
        return (data.style.margintop * 1 || 0) + (data.style.marginbottom * 1 || 0) + 80
    }
    video(data) {
        if (data.style.ratio == '0') {
            return 394
        } else if (data.style.ratio == '1') {
            return 526
        } else if (data.style.ratio == '2') {
            return 702
        } else {
            return 0
        }
    }
    memberc(data) {
        return 280
    }
    commission_block(data) {
        return 0
    }
    commission_sharecode(data) {
        return 96 + (data.style.margintop * 1 || 0) + (data.style.marginbottom * 1 || 0)
    }
    blockgroup(data) {
        return Math.ceil(data.data.length / data.params.rownum) * 232
    }
    detail_tab(data) {
        return 0
    }
    detail_swipe(data) {
        return 750
    }
    detail_info(data) {
        return 200
    }
    detail_sale(data) {
        // 处理议价商品隐藏此组件并清除高度且非活动
        // 判断空对象是为了处理 详情下的营销信息不展示时 偶发错误
        let params =this.pageInfo.detail_sale?.params;
        let is_show = JSON.stringify(params) != '{}';
        return is_show ? data.data.length * 70 : 0;
    }
    detail_spec(data) {
        // 处理议价商品隐藏此组件并清除高度且非活动
        // 判断空对象是为了处理 详情下的营销信息不展示时 偶发错误
        let params =this.pageInfo.detail_sale?.params;
        let is_show = JSON.stringify(params) != '{}';
        return is_show ? 70 + (data.style.margintop * 1 || 0) + (data.style.marginbottom * 1 || 0) :0;
    }
    detail_shop(data) {
        return 0
    }
    detail_comment(data) {
        return Math.max(192, data.data.length * 180 + 60)
    }
    detail_buyshow(data) {
        return 0
    }
    detail_store(data) {
        return 0
    }
    detail_package(data) {
        return 0
    }
    detail_pullup(data) {
        return 80
    }
    detail_navbar(data) {
        return 0
    }
    detail_seckill(data) {
        return 0
    }
    audio(data) {
        return 0
    }
    seckillgroup(data) {
        return 0
    }
    seckill_times(data) {
        return 0
    }
    seckill_rooms(data) {
        return 0
    }
    seckill_advs(data) {
        return 0
    }
    seckill_list(data) {
        return 0
    }
    coupon(data) {
        if(!data.data.length){
            return 0;
        }
        return Math.ceil(data.data.length / data.params.num_row) * 224 + 26
    }
    fixedsearch(data) {
        return 92
    }
    exchange_banner(data) {
        return 0
    }
    exchange_input(data) {
        return 0
    }
    exchange_rule(data) {
        return 0
    }
    tabbar(data) {
        if (data.style.showtype == 1) {
            return 80
        } else {
            return Math.min(Math.ceil(data.data.length / 4), 2) * 80
        }
    }
    topmenu(data) {
        return 80
    }
    gotop(data) {
        return 0
    }

    diymenu(data) {
        return 0
    }

    followbar(data) {
        return 96
    }

    liver(data) {
        return 120
    }

    cube(data) {
        if (data.params.cubestyle == 'cell_two' || data.params.cubestyle == 'cell_three') {
            //动态计算高度 避免用户上传超高图片影响懒加载 不使用图片真实尺寸
            const cube_num = {
                'cell_two': 2,
                'cell_three': 3,
            }
            let num = cube_num[data.params.cubestyle]//转number
            let { margininside, marginleft } = data.style
            let getNormalWidth = (750 - marginleft * 2 - (margininside * (num - 1))) / num
            let { imgheight, imgwidth } = data.params
            return parseInt(imgheight * getNormalWidth / imgwidth)
            // return data.params.imgheight || 0

        } else {
            return 750
        }
    }

    seckill(data) {
        let height = 0
        if (data) {
            let pageInfo = this.pageInfo[data._comIndex_] || {};
            let list = pageInfo ?.data || data.data
            if (list.length == 0) {
                return 0
            } else {
                if (data.style.listtype == 'scroll') {
                    height = 474 + data.style.margintop + data.style.marginbottom
                } else {
                    height = 80 + 272 * list.length + data.style.margintop + data.style.marginbottom
                }
            }
        }
        return height
    }

    credit(data) {
        return 494
    }
}