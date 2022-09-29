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
 * 商品详情的装修项
 */
import { getActivityName } from '@/common/helper/goods'
import { SINGLE_BUY_ACTIVE } from '@/common/variable/activity'
import * as utils from '@/common/util.js'
import store from '@/store'
import $decorator from '@/common/decorator'

export function detail_spec(goods, activity, res) {
    let name = getActivityName(activity)
    let hasSingle = SINGLE_BUY_ACTIVE.includes(name)
    let title = '';
    title = '请选择商品规格'
    let price_actives = ['seckill','preheat_activity'];
    let isBargain = activity && price_actives.some(key=> activity[key]);
    return {
        //商品规格选择框
        show: goods?.has_option == 1,
        isBargain,
        params: {
            specs: title,
            activeName: hasSingle ? name : '',
            // 处理卡密插件权限是否显示对规格选择 false 显示规格 true 不显示规格
            virtual_account: +goods?.type === '2' && !res?.plugin_account?.virtualAccount
        }
    }
}
export function detail_sale(goods, {
    data,
    activity,
    goods_coupon = [],
    intracity
} = res) {
    let activityName = getActivityName(activity)
    let price_actives = ['seckill','preheat_activity','groups'];
    let isBargain = activity && price_actives.some(key=> activity[key]);

    let info = {
        data: [
            {
                label: '优惠券',
                name: "可用优惠券",
                type: "coupon",
                items: goods_coupon || []
            },
            {
                label: '活动',
                name: "活动",
                type: "active",
                items: (() => {
                    let arr = []
                    let actives = activity.full_deduct || []
                    // 满减活动
                    actives.forEach(v => {
                        arr.push({
                            name: '满减',
                            type: 'full',
                            enough: v.enough,
                            deduct: v.deduct
                        })
                    })

                    // 全场满金额包邮
                    if (activity.free_dispatch?.full_free_dispatch) {
                        arr.push({
                            name: '包邮',
                            type: 'freeExpress',
                            classify: 'full_free_dispatch',
                            value: activity.free_dispatch?.full_free_dispatch
                        })
                    }

                    // 单商品满件数包邮
                    if (activity.free_dispatch?.single_full_unit_num) {
                        arr.push({
                            name: '包邮',
                            type: 'freeExpress',
                            classify: 'single_full_unit_num',
                            value: activity.free_dispatch?.single_full_unit_num
                        })
                    }

                    // 单商品满金额包邮
                    if (activity.free_dispatch?.single_full_quota_price) {
                        arr.push({
                            name: '包邮',
                            type: 'freeExpress',
                            classify: 'single_full_quota_price',
                            value: activity.free_dispatch?.single_full_quota_price
                        })
                    }

                    // 是否支持全国包邮
                    // if ((!data.dispatch_template?.not_dispatch) && activity.free_dispatch?.full_free_dispatch && (parseFloat(goods.dispatch_price) == 0)) {
                    //     arr.push({
                    //         name: '包邮',
                    //         type: 'freeExpress',
                    //         classify: 'all_dispatch',
                    //     })
                    // }
                    if (goods.deduction_credit_type != '0' && activity?.credit) {
                        arr.push({
                            name: store.state.systemSetting?.credit_text || '积分',
                            type: 'score',
                            score: 12,
                            deduction_type: goods.deduction_credit_type,
                            deduction_price: goods.deduction_credit
                        })
                    }

                    if (goods.deduction_balance_type != '0' && activity?.balance) {
                        arr.push({
                            name: store.state.systemSetting?.balance_text || '余额',
                            type: 'balance',
                            score: 12,
                            deduction_type: goods.deduction_balance_type,
                            deduction_price: goods.deduction_balance
                        })
                    }

                    return arr
                })(),
                url: 'active'
            },
            {
                label: '服务',
                name: '服务',
                type: 'biaoqian',
                // items: [
                //    { id: 'is_hot', name: '热卖' },
                //    { id: 'is_new', name: '新品' },
                //    { id: 'is_recommand', name: '推荐' }
                // ].filter(item => {
                //    return goods?.[item.id] == 1
                // }),
                items: goods.label.filter(v => v.name)
            }
        ],
        params: {
            activityName,
            isBargain,//是否是活动商品
            activityData: activity[activityName],
            goods,
        }

    };
    // 运费
    let expressFee;
    let freightText = goods?.trade?.freight_type == 0 ? '包邮': goods?.trade?.freight_content || ""
    //虚拟商品
    if (goods.type != 0) {
        expressFee = '0'
    } else if (goods.dispatch_intracity === '1' && intracity.intracity_enable == 1) {
        // 同城配送开启 并且商品支持同城配送
        expressFee = (parseFloat(intracity?.dispatch_price) > 0 ? `运费${parseFloat(intracity?.dispatch_price)}元` : freightText);
    } else if (goods.dispatch_express === '1' && intracity.express_enable === 1) {
        // 快递开启 并且商品支持快递
        // 包邮

        if (goods.dispatch_type == '0') {
            expressFee = freightText
        }
        // 运费模板
        if (goods.dispatch_type == '1') {

            expressFee = (intracity?.dispatch_price > 0 ? `运费${parseFloat(intracity?.dispatch_price)}元` : freightText);
        }

        // 统一运费
        if (goods.dispatch_type == '2') {

            expressFee = (goods?.dispatch_price > 0 ? `运费${parseFloat(goods?.dispatch_price)}元` : freightText)
        }
    } else {

        expressFee = '0'
    }
    // 判断不配送区域
    let not_dispatch = data.dispatch_template?.not_dispatch
    // data.goods.type == 0 改为配送区域只在实体商品中显示
    if ((typeof not_dispatch == 'string' && not_dispatch.trim() != '' && data.goods.type == 0) || (expressFee != 0)) {
        // 添加商城配送or不配送判断
        let dispatchLabel = data.dispatch_template?.delivery_type == '0' ? '不配送' : '只配送'
        // if(data.dispatch_template?.delivery_type != '0' ){
        //
        // }
        info.data.push({
            label: "发货",
            name: "发货",
            type: "bupeisong",
            showIcon: (typeof not_dispatch == 'string' && not_dispatch.trim() != '' && data.goods.type == 0),
            content: {
                value: expressFee,
                dispatchLabel,
                dispatch: data.dispatch_template?.not_dispatch
            }
        })
    }
    // 判断商品支持同城配送
    if (data.goods.dispatch_intracity === '1' && intracity.intracity_enable == 1) {
        let closeStatus = intracity.dispatch_area?.delivery_area == '2'
        let someCity = store.state.setting?.systemSetting?.dispatch_name['30']? store.state.setting?.systemSetting?.dispatch_name['30'] : '同城配送';
        let address = `${intracity?.shop_address?.address?.province || ""}${intracity?.shop_address?.address?.city || ""}${intracity?.shop_address?.address?.area || ""}${intracity?.shop_address?.address?.detail || ""}`
        if(intracity?.sub_shop_address?.address) {
            address = `${intracity?.sub_shop_address?.address?.province || ""}${intracity?.sub_shop_address?.address?.city || ""}${intracity?.sub_shop_address?.address?.area || ""}${intracity?.sub_shop_address?.address?.detail || ""}`
        }
        info.data.push({
            label: `${someCity}`,
            name: '查看商家位置',
            content: {
                value: closeStatus ? '' : address
            },
            showIcon: !closeStatus,
            type: 'samecity',
            url: 'samecity'
        })

    }
    // 判断活动显示内容
    let activityObj = {
        seckill: ['biaoqian', 'bupeisong', 'samecity'],
    };
    // 拼团不开启使用优惠券关闭
    if(activity.groups?.rules?.use_coupon=='0') {
        info.data = info.data.filter(item=> item.type!='coupon')
    }
    // 拼团返利不开启使用优惠券关闭
    if(activity.groupsRebate?.rules?.use_coupon=='0') {
        info.data = info.data.filter(item=> item.type!='coupon')
    }
    let activeKey;
    // 获取当前正在进行的活动
    Object.keys(activityObj).forEach(key => {
        if (activity && activity[key]) {
            activeKey = key
        }
    })
    // 拼团不开启使用优惠券关闭
    if(activity.groups?.rules?.use_coupon=='0') {
        info.data = info.data.filter(item=> item.type!='coupon')
    }
    info.data = info.data.filter(item => {
        if (activeKey) {
            if (activityObj[activeKey].includes(item.type)) {
                return item
            }
        } else {
            return item
        }
    });
    return info
    //商品营销信息


}

export function detail_swipe(goods) {
    let params = {
        video: null
    }
    if (goods.video) {
        params = {
            video: utils.mediaUrl(goods.video, "", "video"), //商品视频
            video_thumb: utils.mediaUrl(goods.video_thumb) //视频封面
        }
    }
    return {
        //商品轮播图
        params,
        data: goods.thumb_all ? goods.thumb_all.map(item => {
            return {
                imgurl: utils.mediaUrl(item),
                linkurl: ''
            }
        }) : []
    }

}

export function detail_info(data, activity, dispatch, intracity) {
    let expressFee;
    //虚拟商品
    if (data.type != 0) {
        expressFee = '0.00'
    } else if (data.dispatch_intracity === '1' && intracity.intracity_enable == 1) {
        // 同城配送开启 并且商品支持同城配送
        expressFee = (parseFloat(intracity?.dispatch_price) > 0 ? "¥" + parseFloat(intracity?.dispatch_price) : freightText);
    } else if (data.dispatch_express === '1' && intracity.express_enable === 1) {
        // 快递开启 并且商品支持快递
        // 包邮
        if (data.dispatch_type == '0') {
            expressFee = '包邮'
        }

        // 运费模板
        if (data.dispatch_type == '1') {
            expressFee = (dispatch?.dispatch_price > 0 ? "¥" + parseFloat(dispatch?.dispatch_price) : '包邮');
        }

        // 统一运费
        if (data.dispatch_type == '2') {
            expressFee = (data?.dispatch_price > 0 ? "¥" + parseFloat(data?.dispatch_price) : '包邮')
        }
    } else {
        expressFee = '0.00'
    }
    let has_option = data.has_option == 1;
    let price = data.price;
    if (has_option) {
        // 多规格 会员价
        price = activity.member_price ?
                `${activity.member_price.min_price}-${activity.member_price.max_price}` :
                `${data.min_price}-${data.max_price}`
        price = utils.formartPrice(price)

    } else {
        // 单规格 会员价
        price = activity.member_price ? activity.member_price.min_price : data.price
    }
    if(activity?.member_card_free_goods?.free_goods_code) {
        price = activity?.member_card_free_goods?.price
    }
    let memberInfo = $decorator.getPage(12).pageInfo;
    return {
        params: {
            has_option: data.has_option,
            stock: data.stock,
            showstock: data?.ext_field?.show_stock == '1',
            address: "山东 济南",
            delPrice: data.original_price,
            desc: data.sub_name,
            expressFee,
            preSalesExpressAfter: '',
            price,
            sales: data.sales * 1 + (data.real_sales || 0) * 1,
            showsales: data?.ext_field?.show_sales != '0',
            share_link: "",
            timeBuyCountDown: '',
            title: data.title,
            level_name: memberInfo.member?.info?.levelname || '',
            commisionMax: activity.commission?.max || 0,
            has_shoppingReward: activity?.shoppingReward?.reward ? true : false,
            rewardInfo: activity?.shoppingReward?.reward,
            activityName: getActivityName(activity),
            seckill: activity?.seckill ?? null,
            preheat_activity: activity.preheat_activity ?? null,
            activity,
            type: data?.type,
            buy_button_settings: data?.ext_field?.buy_button_settings, //议价商品设置项
            buy_button_type: data?.ext_field?.buy_button_type, // 议价购买按钮是否走装修
        }
    }

}

export function detail_navbar(res) {

    let params = {};
    if (res.data?.goods?.type != 0) {
        params.goodsType = 1;
    } else {
        params.goodsType = 0;
    }

    // 虚拟卡密商品，判断权限
    if ( res.data?.goods?.type == 2 && !res?.plugin_account?.virtualAccount) {
        params.is_buy_disable = true
    }
    if (res.data?.goods?.type == 2) {
        params.goodsType = 2;
    }

    if (res?.activity?.seckill) {
        params.seckill = res?.activity?.seckill
    }
    if (res?.activity?.groups) {
        params.groups = res?.activity?.groups
    }
    let canService = false;
    let price_actives = ['seckill','preheat_activity','groups'];
    let isBargain = res?.activity && price_actives.some(key=> res?.activity[key]);
    // #ifdef MP-WEIXIN
    canService = true
    // #endif
    return {
        params: {
            is_buy_disable: false,
            canService,
            goods_title: res.data?.goods?.title,
            goods_thumb: utils.mediaUrl(res.data?.goods?.thumb),
            goodslink: '/kdxGoods/detail/index?goods_id=' + res.data?.goods?.id,
            favor: res.is_favorite,
            canbuy: res.data?.goods?.stock > 0,
            goods: res.data.goods,
            ...params,
            isBargain,
            activityName: getActivityName(res?.activity)
        },
    }

}

export function detail_pullup(data) {
    return {
        params: {
            content: data.content,
            params_switch: data.params_switch
        },
        data: data.params
    }
}

export function clearAllData() {
    return {
        detail_sale: {
            data: []
        },
        detail_swipe: {
            params: {
                video: '',
                video_thumb: ''
            },
            data: []
        },
        detail_info: {
            params: {
                stock: '',
                address: "",
                delPrice: "",
                desc: "",
                expressFee: "",
                preSalesExpressAfter: '',
                price: "",
                sales: "",
                share_link: "",
                timeBuyCountDown: '',
                title: "",
                level_name: "",
                commisionMax: "",
                isMultipe: "",
                preheat_activity: {
                    activity_type: ''  //清除预热信息
                },
                seckill: null,
                groups: null,
                activityName: '',

            }
        },
        detail_navbar: {
            params: {}
        }

    }
}

/**
 * 接口请求失败时的默认数据
 */
export const defaultPageInfo = {}

