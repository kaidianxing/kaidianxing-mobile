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
    <view class="rules">
        <!-- 判断显示哪种规则 -->
        <view v-if="type == '1'">
            <!-- 积分规则 -->
            <view class="credit-rules">
                <view class="rules-item">
                    <view class="item-title">{{ credit.credit_text }}上限</view>
                    <view class="item-text" v-if="credit.credit_limit_type == '2'">最多可获得 {{ credit.credit_limit }} {{ credit.credit_text }}</view>
                    <view class="item-text" v-else>可获得{{ credit.credit_text }}无限制</view>
                </view>
                <view class="rules-item">
                    <view class="item-title">{{ credit.credit_text }}换算规则</view>
                    <view class="item-text">{{ credit.basic_credit_num }} {{ credit.credit_text }} = {{ credit.credit_num }} 元</view>
                </view>
                <view class="rules-item">
                    <view class="item-title">{{ credit.credit_text }}抵扣</view>
                    <view class="item-text">
                        <span v-if="credit.credit_state === '0'">不</span>
                        <span>支持{{ credit.credit_text }}抵扣</span>
                    </view>
                </view>
            </view>
        </view>
        <view v-if="type == '2'">
            <!-- 规则说明 -->
            <view class="rules-explain">
                <view class="rules-item">
                    <view class="item-title">订单售后</view>
                    <view class="item-text" v-if="explain.finish_order_refund_type == '0'">订单完成后不支持申请售后</view>
                    <view class="item-text" v-if="explain.finish_order_refund_type == '1'">订单完成后 {{explain.finish_order_refund_days}} 天内支持申请售后</view>
                </view>
                <view class="rules-item">
                    <view class="item-title">{{ credit.credit_text }}退还规则</view>
                    <view class="item-text">
                        售后退款时，{{ credit.credit_text }}部分
                        <span v-if="explain.refund_rule === '1'">不</span>
                        支持退还</view>
                </view>
                <view class="rules-item">
                    <view class="item-title">其他</view>
                    <view class="item-text">{{ credit.credit_text }}商品订单不支持分销，不支持优惠叠加</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            type: '',
            credit: {
                credit_text: '积分',
                credit_limit: '',
                credit_limit_type: '',
                basic_credit_num: '',
                credit_num: '',
                credit_state: '1'
            },
            explain: {
                refund_rule: '',                   // 退款规则 0 全部 1 不退积分
                finish_order_refund_type: '0',       // 已完成订单是否支持售后 0 不可以 1 可以
                finish_order_refund_days: 'n'       // 订单完成后多少天支持售后
            }
        }
    },
    mounted() {
        this.getType();
        this.getCreditSet();
        this.getShopExplain();
    },
    methods: {
        getType() {
            this.type = this.$Route.query.type
        },
        getCreditSet() {
            this.$api.memberApi.getCreditSet().then(res => {
                if (res.error !== 0) return;
                this.credit = res.data;
                this.setNavigationBarTitle();
            })
        },
        getShopExplain() {
            this.$api.creditShopApi.shopStatus({},  {errorToast: false}).then(res => {
                if (res.error !== 0) return;
                this.explain = res.data;
                this.setNavigationBarTitle();
            })
        },
        setNavigationBarTitle() {
            let _title = ''
            if (this.type === '1') {
                _title = `${this.credit.credit_text}规则`
            }
            if (this.type === '2') {
                _title = '规则说明'
            }
            uni.setNavigationBarTitle({
                title: _title
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.rules {
    width: 100%;
    height: 100%;
    background-color: #fff;
}
.credit-rules, .rules-explain {
    padding: px2rpx(16) px2rpx(12);
    .rules-item {
        margin-bottom: px2rpx(16);
        .item-title {
            font-size: px2rpx(12);
            line-height: px2rpx(18);
            font-weight: 600;
            margin-bottom: px2rpx(8);
        }
        .item-text {
            font-size: 12px;
            line-height: 16px;
            color: #969696;
        }
    }
}
</style>
