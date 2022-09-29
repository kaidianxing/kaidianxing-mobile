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
import * as $utils from '@/common/util.js'
import store from '@/store'

function isDisabled(value) {
    return typeof value === 'undefined' || value == '0' || value == ''
}
function $toast(info,icon='none') {
    info && uni.showToast({
        title: info,
        icon: icon
    })
}
export function handleGoodsData(res) {
    // res.credit_shop.type === '1' 优惠券商品
    // res.credit_shop.type === '0' 商品

}

/**
 * handleVideo 处理商品详情页面视频
 *
 * */
export function handleVideo(type, data) {

    console.log(data,'data>>>>');

    if (+type === 1) {
        return [
            {
                img: $utils.staticMediaUrl(`creditShop/${+data.coupon_sale_type === 1 ? 'full.png' : 'discount.png'}`),
                linkurl: ''
            }
        ]
    }
    let videoList = data.thumb_all ? data.thumb_all.map(item => {
        return {
            img: $utils.mediaUrl(item),
            linkurl: ''
        }
    }) : [];
    if (data.video) {
        let params = {
            video: $utils.mediaUrl(data.video, "", "video"), //商品视频
            video_thumb: $utils.mediaUrl(data.video_thumb) //视频封面
        };
        videoList = [params, ...videoList]
    }

    console.log(videoList,'videoList>>>>>');

    return videoList
}

/**
 * 处理运费
 *
 * */
export function handleExpressFee(data, dispatch, intracity) {
    let expressFee;
    //虚拟商品
    if (data.type != 0) {
        expressFee = '0.00'
    } else if (data.dispatch_intracity === '1' && intracity.intracity_enable == 1) {
        // 同城配送开启 并且商品支持同城配送
        expressFee = "¥" + (parseFloat(intracity?.dispatch_price) > 0 ? parseFloat(intracity?.dispatch_price) : '0.00');
    } else if (data.dispatch_express === '1' && intracity.express_enable === 1) {
        // 快递开启 并且商品支持快递
        // 包邮
        if (data.dispatch_type == '0') {
            expressFee = '包邮'
        }

        // 运费模板
        if (data.dispatch_type == '1') {
            expressFee = "¥" + (dispatch?.dispatch_price > 0 ? parseFloat(dispatch?.dispatch_price) : '0.00');
        }

        // 统一运费
        if (data.dispatch_type == '2') {
            expressFee = "¥" + (data?.dispatch_price > 0 ? parseFloat(data?.dispatch_price) : '0.00')
        }
    } else {
        expressFee = '-'
    }
    return expressFee
}

/***
 * 处理活动信息
 *
 * */
export function handleActive(type, data, dispatchTem, intracity, activity) {
    let info = {
        data: []
    };
    if (+type === 1) {
        info.data.push({
            label: '优惠权益',
            name: "优惠券权限",
            type: "coupon",
            content: {
                value: '查看'
            }
        });
        return info
    }
    info.data = [
        {
            label: '活动',
            name: "活动",
            type: "active",
            items: (() => {
                let arr = [];
                if (data.deduction_balance_type != '0' && activity?.balance) {
                    arr.push({
                        name: store.state.setting.systemSetting?.balance_text || '余额',
                        type: 'balance',
                        score: 12,
                        deduction_type: data.deduction_balance_type,
                        deduction_price: data.deduction_balance
                    })
                }
                return arr
            })(),
            url: 'active'
        }
    ];
    // 判断不配送区域
    let not_dispatch = dispatchTem?.not_dispatch;

    // data.goods.type == 0 改为配送区域只在实体商品中显示
    if (typeof not_dispatch == 'string' && not_dispatch.trim() != '' && data.type == 0) {
        // 添加商城配送or不配送判断
        let dispatchLabel = dispatchTem?.delivery_type == '0' ? '不配送' : '只配送'
        info.data.push({
            label: dispatchLabel,
            name: "不配送区域",
            type: "bupeisong",
            content: {
                value: dispatchTem?.not_dispatch
            }
        })
    }

    // 判断商品支持同城配送
    if (data.dispatch_intracity === '1' && intracity.intracity_enable == 1) {
        let closeStatus = intracity.dispatch_area?.delivery_area == '2'
        let someCity = store.state.setting?.systemSetting?.dispatch_name['30'] ? store.state.setting?.systemSetting?.dispatch_name['30'] : '同城配送';
        info.data.push({
            label: `${someCity}`,
            name: '查看商家位置',
            content: {
                value: closeStatus ? '' : '查看商家位置'
            },
            chooseAdr: !closeStatus,
            type: 'samecity',
            url: 'samecity'
        })
    }

    // 如果开启自提
    if (data.dispatch_verify === '1' && intracity.verify_enable == 1 && data?.dispatch_verify_point_count != 0) {
        info.verifyData = {
            is_verify: true,
            title: data?.type == 0 ? '自提点' : '核销点',
            dispatch_verify_point_count: data?.dispatch_verify_point_count + '个',
            verify_point_title: '',
            verify_point_distance: ''
        }
    }
    info.data = info.data.filter(item => (item.label && ((item.items && item.items.length) || item.content)));
    return info
}

export async function createOrder({goods_id, option_id, total, goodDetail, detailInfo, canBuy, buy_num}) {
    if (goodDetail?.has_option === '1' && !option_id) {
        // 判断多规格
        $toast('请选择商品规格');
        return
    }
    if (store.state.login.isLogin) {
        if (!canBuy) {
            return $toast('您暂时没有购买权限!')
        }
    } else {
        return store.commit('login/setModal', true)
    }

    if (+detailInfo.credit_shop.credit_shop_stock === 0) {
        $toast('商品已售罄');
        return
    }

    // 限购
    // try {
    //     total = await handleLimit.call(this, {goodDetail, total, buy_num});
    // } catch (e) {
    //     // 弹窗限购提示，禁止跳转下单页面
    //     $toast(e);
    //     return
    // }

    return new Promise(async (resolve, reject) => {

        // 商品类型存储快递方式
        if (+detailInfo.credit_shop.type === 0) {
            // 存储商品、店铺 普通快递/同城配送状态/自提
            let {dispatch_intracity, dispatch_express, dispatch_verify, type} = goodDetail;
            let {express_enable, intracity_enable, verify_enable} = detailInfo.intracity;
            let dispatchStatus = {
                dispatch_intracity,
                dispatch_express,
                dispatch_verify,
                express_enable,
                intracity_enable,
                verify_enable
            };
            store.commit('orderCreate/setDispatchStatus', dispatchStatus);

            if (+type === 0) {
                // 实体商品，校验配送方式
                if ((isDisabled(express_enable) || isDisabled(dispatch_express)) && (isDisabled(intracity_enable) || isDisabled(dispatch_intracity)) && (isDisabled(verify_enable) || isDisabled(dispatch_verify))) {
                    $toast('没有可用的配送方式');
                    return
                }
            }
        }

        store.commit('orderCreate/setGoodsInfo', [{goods_id, option_id: option_id || 0, total}]);
        let query = {
            goods_id,
            option_id: option_id || 0,
            total: total || 1,
            type: goodDetail?.type || '-1', // 原商品type，优惠券-1
            credit_good_type: detailInfo.credit_shop.type,
            plugin: 'creditShop'
        };

        // 商品存在表单时，存取商品表单信息
        if (+detailInfo.credit_shop.type === 0&&goodDetail?.form_data?.id) {
            let resultParams = await store.dispatch('creditQuickPurchase/validForm')
            resultParams.goods_id = goods_id
            store.dispatch('creditQuickPurchase/sendFormData', resultParams).then((res) => {
                if (res.error == 0) {
                    resolve();
                    // 跳转订单页面清空表单信息
                    store.commit('form/resetForm')
                    this.$Router.auto({
                        path: '/kdxOrder/create',
                        query
                    })
                }
            });
        } else {
            resolve();
            store.commit('form/resetForm')
            this.$Router.auto({
                path: '/kdxOrder/create',
                query
            })
        }
    })
}

export function handleLimit() {
    return new Promise((resolve, reject) => {
        resolve()
    })
}

export function setShareInfo() { //修改公众号分享信息
    if (!$utils.is_weixin()) {
        return
    }
    let shareInfo = {
        link:  this.postData.poster_url,
        logo: $utils.mediaUrl(this.postData.thumb),
        sdkUrl: location.href,
        title: this.postData.title
    };

    $utils.getShareInfo(shareInfo);
}

export function handleSaleBtn(type) {
    if (type === 'coupon') {
        this.$Router.auto({
            path: '/kdxMember/coupon/detail/index',
            query: {
                id: this.infoData.id,
                is_credit_shop: 1
            }
        });
    } else if (type === 'samecity') {
        this.$Router.auto({
            path: '/kdxOrder/deliveryArea'
        });
    }  else if (type === 'verify') {
        this.$utils.getMapLocation().then(res=>{
            let obj = {
                longitude: res?.longitude || '',
                latitude: res?.latitude || '',
                goods_id: this.infoData.id,
                title: this.infoData.goods_type == 0 ? '自提点':'核销点'
            };
            // 自提点弹窗
            this.$refs.mapPicker.showMapPicker(obj);
        }).catch(err=> {
            console.log(err, '22222>>>>>>>>>>>>>>>');
        });
    } else {
        if (this.activeData?.data && type) {
            this.activity.info = this.activeData?.data.filter(
                (item) => item.type == type
            )[0];
        }
        this.activity.type = type
        this.activity.show = true
    }
}
