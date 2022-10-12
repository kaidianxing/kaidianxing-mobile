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
<template>
    <page-box >
        <view class="content">
            <img
                class="bg"
                mode="widthFix"
                :src="$utils.staticMediaUrl('member/coupon-detail-bg.png')"
                alt=""
            />
            <div class="content-info" v-if="requestFlag">
                <div class="top">
                    <div class="price uni-color-primary">
                        <span
                            class="unit"
                            v-if="couponData.coupon_sale_type === '1'"
                            style="font-size:48rpx;transform: translateY(20rpx);"
                        >
                            ￥
                        </span>
                        {{ parseFloat(couponData.discount_price) }}
                        <span
                            class="unit"
                            v-if="couponData.coupon_sale_type === '2'"
                            style="transform: translateY(24rpx);"
                        >
                            折
                        </span>
                    </div>
                    <div class="name">{{ couponData.coupon_name }}</div>
                    <div class="desc">{{ couponData.content }}</div>
                    <div class="time">
                        有效期：{{
                            couponData.time_limit === '0'
                                ? `${couponData.start_time}~${couponData.end_time}`
                                : couponData.limit_day === '0'
                                ? '无限制'
                                : `即领取日内${couponData.limit_day}天有效`
                        }}
                    </div>

                    <div v-if="couponData.is_free === '1'" style="width:100%;margin-top:32rpx;position: relative">
                        <btn type="do" size="middle" @btn-click="getCouponForMsg">立即领取</btn>
                        <subscribe class="sub-coupon-wrap" v-if="showSubscribe && subTemplateId.length>0" :templates="subTemplateId"  @success="success" @error="error"></subscribe>
                    </div>
                    <div class="btn" style="position: relative" v-else @click="getCouponForMsg">
                        <span v-if="parseFloat(couponData.credit) !== 0"
                            >{{ parseFloat(couponData.credit)
                            }}{{ credit_text }}</span
                        >
                        <span
                            v-if="
                                parseFloat(couponData.credit) !== 0 &&
                                    parseFloat(couponData.balance) !== 0
                            "
                            >+</span
                        >
                        <span v-if="parseFloat(couponData.balance) !== 0"
                            >{{ parseFloat(couponData.balance) }}元</span
                        >
                        <subscribe class="sub-coupon-wrap" v-if="showSubscribe && subTemplateId.length>0" :templates="subTemplateId"  @success="success" @error="error"></subscribe>

                    </div>
                    <ul class="dotList">
                        <li class="dot"></li>
                        <li class="dot"></li>
                    </ul>
                </div>
                <div class="bottom">
                    <div class="bottom-box" v-if="couponData.is_free === '0'">
                        <div class="bottom-box-title">
                            <div class="dot "></div>
                            <div class="text">所需金额与{{ credit_text }}</div>
                        </div>
                        <ul class="money-integral">
                            <li v-if="parseFloat(couponData.balance) !== 0">
                                <div class="left">金额：</div>
                                <div class="right">
                                    {{ parseFloat(couponData.balance) }}元
                                </div>
                            </li>
                            <li v-if="parseFloat(couponData.credit) !== 0">
                                <div class="left">{{ credit_text }}：</div>
                                <div class="right">
                                    消耗{{ parseFloat(couponData.credit)
                                    }}{{ credit_text }}
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="bottom-box">
                        <div class="bottom-box-title">
                            <div class="dot"></div>
                            <div class="text">领取限制</div>
                        </div>
                        <ul class="receive-restrictions">
                            <li>
                                <div class="left">领取人限制：</div>
                                <div class="right">
                                    {{limit_member}}
                                </div>
                            </li>
                            <li>
                                <div class="left">领取张数：</div>
                                <div class="right">
                                    {{limit_text}}
                                </div>
                            </li>
                            <li v-if="couponData.is_free === '1'">
                                <div class="left">领取方式：</div>
                                <div class="right">免费领取</div>
                            </li>
                        </ul>
                    </div>
                    <div class="bottom-box">
                        <div class="bottom-box-title">
                            <div class="dot"></div>
                            <div class="text">
                                使用限制
                                <span v-if="couponData.goods_limit === '1'">
                                    （允许以下{{
                                        couponData.goods.length
                                    }}个商品使用）
                                </span>
                                <span  v-if="couponData.goods_limit === '2'">
                                    （不允许以下{{
                                        couponData.goods.length
                                    }}个商品使用）
                                </span>
                                <span v-if="couponData.goods_limit === '3'">
                                    （允许以下分类使用）
                                </span>
                            </div>
                        </div>
                        <ul
                            class="use-restrictions"
                            v-if="
                                couponData.goods_limit !== '0' &&
                                    couponData.goods_limit !== '3'
                            "
                        >
                            <block
                                v-for="(item, index) in couponData.goods"
                                :key="index"
                            >
                                <li
                                    v-if="index < 3"
                                    @click="jumpGoodsDetail(item)"
                                >
                                    <div
                                        class="img"
                                        :style="{
                                            'background-image': `url(${$utils.staticMediaUrl(
                                                'decorate/goods_col2.png'
                                            )})`,
                                        }"
                                    >
                                        <img
                                            :src="$utils.mediaUrl(item.thumb)"
                                            alt=""
                                        />
                                        <div
                                            class="bg"
                                            v-if="
                                                index === 2 &&
                                                    couponData.goods.length > 3
                                            "
                                        >
                                            <div
                                                class="box"
                                                @click.stop="jumpGoodsList"
                                            >
                                                <div class="num">
                                                    +{{
                                                        couponData.goods.length
                                                    }}
                                                </div>
                                                <div class="see">查看更多</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text">
                                        {{ item.title | formatText }}
                                    </div>
                                </li>
                            </block>
                        </ul>
                        <ul
                            class="use-restrictions-limit3"
                            v-else-if="couponData.goods_limit === '3'"
                        >
                            <li>
                                <div class="left">分类名称：</div>
                                <div class="right">
                                    <span
                                        class="cate-item"
                                        v-for="(item,
                                        index) in couponData.goods"
                                        :key="index"
                                        @click="jumpCategoryGoodsList(item.id)"
                                    >
                                        {{ item.name }}
                                    </span>
                                </div>
                            </li>
                        </ul>
                        <div
                            class="no"
                            v-else-if="couponData.goods_limit === '0'"
                        >
                            无
                        </div>
                    </div>
                    <div class="bottom-box">
                        <div class="bottom-box-title">
                            <div class="dot"></div>
                            <div class="text">使用说明</div>
                        </div>
                        <ul
                            class="use-description"
                            v-if="couponData.default_description"
                        >
                            <li v-if="couponData.default_description === '2'">
                                <div
                                    v-html="formatHtml(couponData.description)"
                                ></div>
                            </li>
                            <li v-else>
                                <div
                                    v-html="
                                        formatHtml(
                                            couponData.default_description
                                        )
                                    "
                                ></div>
                            </li>
                        </ul>
                        <div class="no" v-else>无</div>
                    </div>
                </div>
            </div>
            <pay-picker
                ref="payPicker"
                :payList="payList"
                @closePicker="closePicker"
                @confirmPay="confirmPay"
            />
            <rr-modal
                :title="modalTitle"
                :cancelText="cancelText"
                :okText="okText"
                :showOkBtn="showOkBtn"
                v-model="modalShowFlag"
                @handlerOK="handlerOK"
                @handlerCancel="handlerCancel"
            />
        </view>
    </page-box>
</template>
<script>
import payPicker from '@/components/picker/payPicker'
import { requestPayment, wapWechatPay, wapAliPay } from '@/common/payment'
import PageMixin from '@/common/PageMixin.js'
import { config } from '@/static/settings'
import {is_weixin} from "@/common/util";

import Subscribe from '@/components/wechat/Subscribe'

export default {
    mixins: [PageMixin],
    components: {
        payPicker,
        Subscribe
    },
    data() {
        return {
            is_credit_shop: 0, // 积分优惠券商品
            modalShowFlag: false,
            modalType: 'pay',
            modalTitle: '确定购买优惠券吗？',
            cancelText: '取消',
            okText: '确定',
            showOkBtn: true,
            couponId: '', // 优惠券id
            requestFlag: false,
            couponData: {
                limit_member: [],
            }, // 优惠券信息
            payList: [], // 支付方式
            payType: '', // 支付方式
            orderId: '', // 订单号
            payParams: '', // 微信支付返回的参数
            linkReceive: '', // 链接领取 1：是
            subTemplateId: [], //公众号订阅模板
            showSubscribe: true, //公众号订阅按钮
            credit_shop: {}, // 积分信息
        }
    },
    filters: {
        formatText(value) {
            if (value && value.length > 12) {
                return `${value.slice(0, 12)}...`
            }
            return value
        },
    },
    created() {
        // #ifdef H5
        if (is_weixin()) {
            let noticeIds = this.$store.state.setting?.noticeTemId;
            let type_code = ['buyer_coupon_send','coupon_expire_notice'];
            if (noticeIds && type_code.length) {
                type_code.map((item) => {
                    if (noticeIds[item]) {
                        this.subTemplateId?.push(noticeIds[item])
                    }
                })
            }
        }
        // #endif

    },
    computed: {
        is_weixin() {
            return this.$utils.is_weixin()
        },
        credit_text() {
            return this.$store.state.setting.systemSetting.credit_text || '积分'
        },
        balance_text() {
            return (
                this.$store.state.setting.systemSetting.balance_text || '余额'
            )
        },
        recharge_state() {
            return this.$store.state.setting.systemSetting.recharge_state
        },
        return_url() {
            let url = ''
            if (this.is_weixin) {
                url = `${config.wap_url}/kdxOthers/paySuccess`
            } else {
                url = `${config.wap_url}/kdxMember/coupon/paySuccess/index?id=${this.couponId}`
            }
            return url
        },
        limit_text() {
            if (this.is_credit_shop) {
                return +this.credit_shop.goods_limit_type === 0?'不限制':+this.credit_shop.goods_limit_type === 1?`${this.credit_shop.goods_limit_num}张/人`:`每${this.credit_shop.goods_limit_day}天${this.credit_shop.goods_limit_num}张/人`
            }
            return this.couponData.get_max_type === '0'? '不限制': `${this.couponData.get_max}张/人`
        },
        limit_member() {
            if (this.is_credit_shop) {
                let level_type = +this.credit_shop.member_level_limit_type,
                    group_type = +this.credit_shop.member_group_limit_type,
                    level_result = '',
                    group_result = '';
                if (level_type) {
                    level_result = level_type===1?this.credit_shop.member_level_name.join('、'):`${this.credit_shop.member_level_name.join('、')}不可购买`
                } else if (group_type) {
                    group_result = group_type===1?this.credit_shop.member_group_name.join('、'):`${this.credit_shop.member_group_name.join('、')}不可购买`
                } else {
                    level_result = '不限制'
                }
                return `${level_result} ${group_result}`
            }
            return this.couponData.limit_member.length === 0? '不限制': this.couponData.limit_member.join('、')
        },
    },
    async mounted() {
        this.couponId = this.$Route.query.id
        this.is_credit_shop = this.$Route.query?.is_credit_shop||0
        this.linkReceive = this.$Route.query.linkReceive
        if (this.linkReceive && this.linkReceive === '1') {
            // 判断登录
            let loginStatus = await this.$store.dispatch('login/checkLogin')
            if (!loginStatus) {
                this.getCouponDetail()
                // 未登录
                return this.$store.commit('login/setModal', true)
            }
            // 链接领取
            this.getCoupon()
        } else {
            this.getCouponDetail()
        }
    },
    methods: {
        // 获取优惠券详情
        getCouponDetail() {
            let params = {
                id: this.couponId,
            };
            if (this.is_credit_shop) {
                params.is_credit_shop = 1
            }
            this.$api.memberApi
                .getCouponDetail(params)
                .then((res) => {
                    if (res.error === 0) {
                        res.data.limit_member =
                            res.data.limit_member === '0'
                                ? []
                                : res.data.limit_member
                        this.couponData = { ...res.data }
                        if (this.is_credit_shop) {
                            this.credit_shop = res.data.credit_shop
                            this.couponData.balance = res.data.credit_shop.min_price
                            this.couponData.credit = res.data.credit_shop.min_price_credit
                        }
                    } else {
                        this.$toast(res.message)
                    }
                    this.requestFlag = true
                })
        },
        // 领取免费优惠券
        async getCoupon() {
            // 判断登录
            let loginStatus = await this.$store.dispatch('login/checkLogin')
            if (!loginStatus) {
                // 未登录
                return this.$store.commit('login/setModal', true)
            }
			let params = {
                id: this.couponId,
            };
            // 添加文章营销分享者id
            let article_id = this.sessionStorage.getItem("article_id");
            if (article_id) {
                params.article_id = article_id;
            }
            this.$api.memberApi
                .getCoupon(params)
                .then((res) => {
                    if (res.error === 0) {
                        this.jumpCouponPaySuccess()
                    } else {
                        this.$toast(res.message)
                        if (this.linkReceive && this.linkReceive === '1') {
                            // 链接领取
                            this.getCouponDetail()
                        }
                    }
                })
        },
        // 购买优惠券
        async buyCoupon() {
            // 判断登录
            let loginStatus = await this.$store.dispatch('login/checkLogin')
            if (!loginStatus) {
                // 未登录
                return this.$store.commit('login/setModal', true)
            }
            // 积分商品优惠券-购买
            if (this.is_credit_shop) {
                this.createCouponOrder()
                return
            }
            this.modalType = 'pay'
            this.modalTitle = '确定购买优惠券吗？'
            this.cancelText = '取消'
            this.okText = '确定'
            this.showOkBtn = true
            this.modalShowFlag = true
        },
        async handlerOK() {
            this.modalShowFlag = false
            if (this.modalType === 'pay') {
                let result = await this.getCouponPayType()
                let need_pay = result.need_pay
                this.payList = result.payList
                if (need_pay === 0) {
                    // 不需要支付金额, 直接购买成功
                    this.jumpCouponPaySuccess()
                } else if (need_pay === 1) {
                    // 需要支付金额
                    if (this.payList?.length===0) {
                        // 无支付方式
                        this.$toast('未开启支付方式');
                        return
                    }
                    // #ifdef MP-TOUTIAO
                    this.payType = 'byte_dance';
                    this.payCoupon();
                    // #endif

                    // #ifndef MP-TOUTIAO
                    // 只有一种支付方式-禁止弹窗  多种支付方式-显示支付方式弹窗
                    if (this.payList?.length === 1) {
                        this.confirmPay(this.payList?.[0]?.type)
                        return
                    }
                    this.$refs['payPicker'].showPayPicker()
                    // #endif
                }
            } else if (this.modalType === 'recharge') {
                // 充值 跳转充值页面
                this.$Router.auto({
                    path: '/kdxMember/recharge/index',
                })
            }
        },
        handlerCancel() {
            this.modalShowFlag = false
        },
        // 获取卡券支付方式
        getCouponPayType() {
            return new Promise((resolve, reject) => {
                let params = {
                    id: this.couponId,
                };
                // 添加文章营销分享者id
                let article_id = this.sessionStorage.getItem("article_id");
                if (article_id) {
                    params.article_id = article_id;
                }
                this.$api.memberApi
                    .getCouponPayType(params)
                    .then((res) => {
                        if (res.error === 0) {
                            if (res.need_pay === 1) {
                                // 需要支付金额
                                let payList = []
                                for (let [key] of Object.entries(res.pay_list)) {
                                    if (res.pay_list[key].enable == 1) {
                                        payList.push({
                                            type: key,
                                        })
                                    }
                                }
                                this.orderId = res.order_id
                                resolve({
                                    payList,
                                    need_pay: res.need_pay,
                                })
                            } else if (res.need_pay === 0) {
                                // 不需要支付金额
                                resolve({
                                    payList: [],
                                    need_pay: res.need_pay,
                                })
                            }
                        } else {
                            this.$toast(res.message)
                        }
                    })
            })
        },
        closePicker() {},
        // 确认支付
        confirmPay(type) {
            this.payType = type
            this.payCoupon()
        },
        // 支付卡券
        payCoupon(type) {
            let params = {}
            // #ifdef H5
            params['return_url'] = this.return_url
            // #endif
            this.$api.memberApi
                .payCoupon(
                    {
                        order_id: this.orderId,
                        pay_type: this.payType,
                        ...params,
                    },
                    { errorToast: false }
                )
                .then(async (res) => {
                    if (res.error === 0) {
                        // #ifndef MP-TOUTIAO
                        // 关闭支付方式弹窗
                        this.$refs['payPicker'].closePicker()
                        // #endif
                        if (this.payType == 'alipay') {
                            // #ifdef H5
                            wapAliPay({
                                url: res.data,
                                order_id: this.orderId,
                                couponId: this.couponId,
                                pageFrom: 'coupunPay',
                            })
                            // #endif
                            // #ifdef MP-TOUTIAO
                            let payStatus = ''
                            payStatus = await requestPayment({
                                provider: this.payType,
                                orderInfo: res.orderInfo,
                            })
                            if (payStatus === 'ok') {
                                setTimeout(() => {
                                    this.checkPayStatus()
                                }, 1000)
                            }
                            // #endif
                        } else if (this.payType == 'wechat') {
                            let payStatus = ''
                            // #ifdef MP-WEIXIN || MP-TOUTIAO
                            payStatus = await requestPayment({
                                provider: this.payType,
                                ...res.data,
                            })
                            // #endif
                            // #ifdef H5
                            payStatus = await wapWechatPay({
                                ...res.data,
                            })
                            // #endif
                            if (payStatus === 'ok') {
                                setTimeout(() => {
                                    this.checkPayStatus()
                                }, 1000)
                            }
                        } else if (this.payType == 'balance') {
                            // 余额
                            setTimeout(() => {
                                this.jumpCouponPaySuccess()
                            }, 1000)
                        } else if (this.payType == 'byte_dance') {
                            // #ifdef MP-TOUTIAO
                            let payStatus = ''
                            payStatus = await requestPayment({
                                provider: this.payType,
                                orderInfo: res.data,
                            })
                            if (payStatus === 'ok') {
                                setTimeout(() => {
                                    this.checkPayStatus()
                                }, 1000)
                            }
                            // #endif
                        }
                    } else {
                        if (res.error === 211258 && this.payType == 'balance') {
                            // 余额不足 提示充值
                            // 关闭支付方式弹窗
                            this.$refs['payPicker'].closePicker()
                            this.modalType = 'recharge'
                            this.modalTitle = `对不起，您的${this.balance_text}不足请立即进行充值`
                            if (this.recharge_state === '1') {
                                // 充值开启
                                this.cancelText = '取消支付'
                                this.okText = '立即充值'
                                this.showOkBtn = true
                            } else {
                                // 充值关闭
                                this.cancelText = '确认'
                                this.okText = ''
                                this.showOkBtn = false
                            }
                            this.modalShowFlag = true
                        } else {
                            this.$toast(res.message)
                        }
                    }
                })
        },
        checkPayStatus() {
            let obj = {
                id: this.orderId,
                pay_type: this.payType,
            }
            this.$api.memberApi.checkCouponPayStatus(obj).then((res) => {
                if (res.error == 0) {
                    uni.hideLoading()
                    this.$toast('支付成功')
                    setTimeout(() => {
                        this.jumpCouponPaySuccess()
                    }, 1000)
                } else {
                    setTimeout(() => {
                        this.checkPayStatus()
                    }, 2000)
                }
            })
        },
        // 跳转支付成功页面
        jumpCouponPaySuccess() {
            this.$Router.replace({
                path: '/kdxMember/coupon/paySuccess/index',
                query: {
                    id: this.couponId,
                },
            })
        },
        // 跳转商品详情
        jumpGoodsDetail(data) {
            if (this.couponData.goods_limit === '3') {
                // 分类
                return
            }
            const path = `/kdxGoods/detail/index`
            this.$Router.auto({
                path,
                query: {
                    goods_id: data.id,
                },
            })
        },
        // 跳转至分类商品列表
        jumpCategoryGoodsList(id) {
            this.$Router.auto({
                path: '/kdxGoods/goodList/index',
                query: {
                    category_id: id,
                },
            })
        },
        // 跳转商品列表
        jumpGoodsList() {
            if (this.couponData.goods_limit === '3') {
                // 分类
                return
            }
            // 处理数据
            const goodsList = this.couponData.goods.map((item) => {
                return {
                    goods: item,
                }
            })
            // 将商品列表存入store
            this.$store.commit(
                'coupon/setCouponGoodsList',
                goodsList
            )
            // 跳转页面
            const path = `/kdxMember/coupon/goods/index`
            this.$Router.auto({
                path,
            })
        },
        formatHtml(content) {
            // #ifdef MP-TOUTIAO
            // 字节跳动小程序不识别 引号 特殊字符， 需要转一下
            if (content) {
                content = content.replace(/&ldquo;/g, '“')
                return content.replace(/&rdquo;/g, '”')
            }
            // #endif
            return content
        },
        createCouponOrder() {
            if (!this.credit_shop.perm.buy) {
                return this.$message('您暂时没有购买权限!')
            }
            if (+this.credit_shop.credit_shop_stock === 0) {
                this.$message('商品已售罄');
                return
            }
            let query = {
                goods_id: this.credit_shop.id,
                option_id: 0,
                total: 1,
                type: '-1', // 原商品type，优惠券-1
                credit_good_type: this.credit_shop.type,
                plugin: 'creditShop'
            };
            this.$Router.auto({
                path: '/kdxOrder/create',
                query
            })
        },
        // 小程序订阅消息
        //订阅
        getCouponForMsg() {
            // 订阅消息
            //#ifdef H5
            if(is_weixin()){
                this.showSubscribe = true
                if(this.subTemplateId.length == 0) {
                    if(this.couponData.is_free == '1') {
                        this.getCoupon()
                    }else{
                        this.buyCoupon()
                    }
                }
            }else{
                if(this.couponData.is_free == '1') {
                    this.getCoupon()
                }else{
                    this.buyCoupon()
                }
            }
            //#endif
            // #ifdef MP-WEIXIN
            let type_code = ['buyer_coupon_send','coupon_expire_notice'];
            this.$utils.sendWxappMsg(type_code,()=>{
                if(this.couponData.is_free == '1') {
                    this.getCoupon()
                }else{
                    this.buyCoupon()
                }
            })
            // #endif
        },
        // 公众号订阅消息事件
        success() {
            this.showSubscribe = false;
            if (this.couponData.is_free == '1') {
                // 免费领取
                this.getCoupon()
            } else {
                // 购买
                this.buyCoupon()
            }
        },
        error() {
            this.showSubscribe = false;
            if (this.couponData.is_free == '1') {
                // 免费领取
                this.getCoupon()
            } else {
                // 购买
                this.buyCoupon()
            }
        },

    },
}
</script>
<style lang="scss" scoped>
/deep/ video {
    width: 100%;
}
.content {
    padding: 48rpx 24rpx 32rpx;
    position: relative;
    background-color: #fff;
    min-height: 100vh;
    // /* #ifdef H5 */
    // min-height: calc(100vh - 44px);
    // /* #endif */
    img.bg {
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
    }
    .content-info {
        background-color: #fff;
        border-radius: 12rpx;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
        position: relative;
        min-height: calc(100vh - 80rpx);
        .top {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 32rpx;
            padding-left: 24rpx;
            padding-right: 24rpx;
            padding-bottom: 48rpx;
            border-bottom: 4rpx dashed #e6e7eb;
            position: relative;
            .price {
                font-size: 100rpx;
                line-height: 140rpx;
                font-weight: bold;
                display: flex;
                align-items: center;
                span {
                    font-size: 32rpx;
                    line-height: 1;
                }
            }
            .name {
                font-weight: bold;
                font-size: 40rpx;
                line-height: 56rpx;
                color: #212121;
                margin-top: 16rpx;
            }
            .desc {
                font-size: 32rpx;
                line-height: 44rpx;
                color: #212121;
                margin-top: 8rpx;
                margin-bottom: 8rpx;
            }
            .time {
                font-size: 24rpx;
                line-height: 34rpx;
                color: #969696;
            }
            .btn {
                margin-top: 32rpx;
                font-size: 28rpx;
                line-height: 40rpx;
                color: #ffffff;
                background: #ff3c29;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 80rpx;
                border-radius: 40rpx;
                width: 100%;
            }
            .dotList {
                position: absolute;
                bottom: -18rpx;
                left: 0;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .dot {
                    width: 32rpx;
                    height: 32rpx;
                    border-radius: 50%;
                    background-color: #fff;
                    &:nth-child(1) {
                        transform: translateX(-16rpx);
                        box-shadow: -5px 0px 10px rgba(0, 0, 0, 0.1) inset;
                    }
                    &:nth-child(2) {
                        transform: translateX(16rpx);
                        box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.1) inset;
                    }
                }
            }
        }
        .bottom {
            padding-left: 24rpx;
            padding-right: 24rpx;
            padding-bottom: 32rpx;
            .bottom-box {
                .bottom-box-title {
                    display: flex;
                    align-items: center;
                    padding-top: 48rpx;
                    padding-bottom: 32rpx;
                    .dot {
                        width: 12rpx;
                        height: 12rpx;
                        border-radius: 50%;
                        margin-right: 24rpx;
                        background: #ff3c29;
                    }
                    .text {
                        font-weight: bold;
                        font-size: 32rpx;
                        line-height: 44rpx;
                        color: #212121;
                        span {
                            font-size: 24rpx;
                            font-weight: normal;
                        }
                    }
                }
                .money-integral {
                    padding-left: 36rpx;
                    font-size: 24rpx;
                    line-height: 34rpx;
                    color: #212121;
                    li {
                        display: flex;
                        align-items: center;
                        margin-bottom: 16rpx;
                        .left {
                            font-weight: bold;
                            width: 160rpx;
                            text-align: right;
                            flex-shrink: 0;
                        }
                        .right {
                            color: #ff3c29;
                        }
                        &:last-child {
                            margin-bottom: 0;
                        }
                    }
                }
                .receive-restrictions {
                    padding-left: 36rpx;
                    font-size: 24rpx;
                    line-height: 34rpx;
                    color: #212121;
                    li {
                        display: flex;
                        margin-bottom: 16rpx;
                        &:last-child {
                            margin-bottom: 0;
                        }
                        .left {
                            font-weight: bold;
                            width: 160rpx;
                            text-align: right;
                            flex-shrink: 0;
                            white-space: nowrap;
                        }
                    }
                }
                .use-restrictions {
                    padding-left: 36rpx;
                    font-size: 24rpx;
                    line-height: 34rpx;
                    color: #212121;
                    display: flex;
                    li {
                        width: 180rpx;
                        margin-right: 16rpx;
                        .img {
                            width: 180rpx;
                            height: 180rpx;
                            border-radius: 12rpx;
                            margin-bottom: 16rpx;
                            overflow: hidden;
                            position: relative;
                            background-repeat: no-repeat;
                            background-size: contain;
                            img {
                                width: 100%;
                                height: 100%;
                            }
                            .bg {
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background-color: rgba(0, 0, 0, 0.4);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: #fff;
                                text-align: center;
                                font-size: 28rpx;
                                line-height: 40rpx;
                            }
                        }
                        &:last-child {
                            margin-right: 0;
                        }
                    }
                }
                .use-restrictions-limit3 {
                    padding-left: 36rpx;
                    font-size: 24rpx;
                    line-height: 34rpx;
                    color: #212121;
                    li {
                        display: flex;
                        margin-bottom: 16rpx;
                        &:last-child {
                            margin-bottom: 0;
                        }
                        .left {
                            font-weight: bold;
                            width: 160rpx;
                            text-align: right;
                            flex-shrink: 0;
                            white-space: nowrap;
                        }
                        .right {
                            display: flex;
                            flex-wrap: wrap;
                            align-items: center;
                            span {
                                background-color: #f5f5f5;
                                padding: 8rpx 16rpx;
                                margin-right: 8rpx;
                                margin-bottom: 8rpx;
                                border-radius: 4rpx;
                                &:last-child {
                                    margin-right: 0;
                                }
                            }
                        }
                    }
                }
                .use-description {
                    padding-left: 36rpx;
                    font-size: 24rpx;
                    // line-height: 34rpx;
                    // color: #212121;
                    /deep/ .nodata {
                        color: #212121;
                        view {
                            font-size: 24rpx;
                        }
                    }
                    /deep/ img {
                        width: 100%;
                    }
                    /deep/ ul {
                        display: block;
                        list-style-type: disc;
                        margin-block-start: 1em;
                        margin-block-end: 1em;
                        margin-inline-start: 0px;
                        margin-inline-end: 0px;
                        padding-inline-start: 40px;
                        li {
                            display: list-item;
                            text-align: -webkit-match-parent;
                            list-style-type: disc;
                        }
                    }
                    /deep/ ol {
                        display: block;
                        list-style-type: disc;
                        margin-block-start: 1em;
                        margin-block-end: 1em;
                        margin-inline-start: 0px;
                        margin-inline-end: 0px;
                        padding-inline-start: 40px;
                        li {
                            display: list-item;
                            text-align: -webkit-match-parent;
                            list-style-type: decimal;
                        }
                    }
                    /* #ifdef H5 */
                    /deep/ uni-image {
                        width: 100% !important;
                    }
                    /* #endif */
                    /deep/ h1,
                    /deep/ h1 span,
                    /deep/ h2,
                    /deep/ h2 span,
                    /deep/ h3,
                    /deep/ h3 span,
                    /deep/ h4,
                    /deep/ h4 span,
                    /deep/ h5,
                    /deep/ h5 span,
                    /deep/ h6,
                    /deep/ h6 span,
                    /deep/ strong {
                        font-weight: bold;
                        span,
                        em {
                            font-weight: bold;
                        }
                    }
                    /deep/ em,
                    /deep/ em span {
                        font-style: italic;
                    }
                }
                .no {
                    padding-left: 36rpx;
                    font-size: 24rpx;
                    line-height: 34rpx;
                    color: #212121;
                }
            }
        }
    }

}
.sub-coupon-wrap{
    border: 1px solid red;
    left: 0;
    z-index: 10000;
}
</style>
