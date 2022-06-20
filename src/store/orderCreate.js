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
import store from './index'

export default {
    namespaced: true,
    state: {
        changeAddress: false, // 是否切换地址
        dispatch_type: '10', // 快递类型  10:快递 30:同城配送
        address_id: 0, // 地址id  0默认
        goods_info: [
            {
                goods_id: '', // 商品id
                option_id: '', // 规格id  默认0
                total: '', // 商品数量
            }
        ], // 商品信息
        virtual_email: '', // 虚拟卡密-接收邮件地址
        buyer_remark: '', // 留言
        invoice_title: '', // 发票抬头
        invoice_is_electronic: '', // 发票材料类型 1纸质2电子
        invoice_is_company: '', // 是否是个人发票 1是个人 2是企业
        invoice_number: '', // 纳税人识别号
        invoice_address: '', // 邮寄地址/电子邮箱
        select_coupon_id: '', // 优惠券
        deduct_balance: 1, // 是否开启余额抵扣
        deduct_credit: 1, // 是否开启积分抵扣
        dispatch_status: {
            dispatch_express: "0", // 商品是否开启普通快递
            express_enable: 0, // 商城是否开启普通快递
            dispatch_intracity: "0", // 商品是否开启同城配送
            intracity_enable: 0, // 商城是否开启同城配送

        },
        cacheAddressId: {},

        deliveryTime:'',//配送、自提时间
        span_detail: [], // 自提、送达可选时间段
        span_detail_now: [], // 自提、送达当天可选时间段

        // ext_field: {}, // 扩展字段
        // pay_type: 'online',//付款方式 online: 在现在支付 delivery: 货到付款
    },
    mutations: {
        setGoodsInfo(state, res) {
            state.goods_info = res.map(item => {
                return {
                    goods_id: item.goods_id,
                    option_id: item.option_id || 0,
                    total: item.total,
                }
            });
        },
        setDispatchStatus(state, status) {
            console.log('设置了快递',status)
            state.dispatch_status = {
                ...state.dispatch_status,
                ...status,
            };
            const dispatch_obj = {
                10: {
                    dispatch_type: '10',
                    type: 'dispatch_express',
                    enable: 'express_enable'
                },
                30: {
                    dispatch_type: '30',
                    type: 'dispatch_intracity',
                    enable: 'intracity_enable'
                },
            };
            // 兼容数据配送方式顺序为空的时候
            let dispatch_sort = store.state.setting.systemSetting?.dispatch_sort;
            let arr;
            if(dispatch_sort){
                dispatch_sort = dispatch_sort.split(',')
                arr = dispatch_sort.filter(item=>state.dispatch_status[dispatch_obj[item]?.type] == '1' && state.dispatch_status[dispatch_obj[item]?.enable] == 1)
            } else {
                dispatch_sort = []; arr = []
            }
            state.dispatch_type = arr.length>0?arr[0]:'10'
        },

        setOrderCreateInfo(state, res) {
            for(let i in res) {
                state[i] = res[i];
                if(i === 'address_id') {
                    state.cacheAddressId[state.dispatch_type] = res[i]
                }
            }
        },
        // 设置送达时间
        setOrderDeliverTime(state, res) {
            state.deliveryTime = res || '';
        },
        clearInvoiceInfo(state) {
            state.invoice_title ='';
            state.invoice_is_electronic ='';
            state.invoice_is_company ='';
            state.invoice_number ='';
            state.invoice_address ='';
        },
        setDropInfo(state, res) {
            state.drop_ship_info = {
                ...res
            }
        },
        setChangeDrop(state, res) {
            state.changeDropInfo = res
        },
        setFreeGoodsCode(state, res) {
            state.free_goods_code = res
        }
    },
};
