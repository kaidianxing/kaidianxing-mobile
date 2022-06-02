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
    <view class="create-submit">
        <view class="flex">
            <view>
                <text class="uni-text-color">{{handleText}}</text>
                <span class="price-text theme-primary-price" v-if="creditText">{{creditText}}</span>
                <text class="theme-primary-price" :class="creditText?'fz-16': 'fz-12'">￥</text>
                <span class="price-text theme-primary-price">{{pay_price}}</span>
            </view>
            <view  style="position: relative">
                <btn :disabled="disabled" classNames="theme-primary-bgcolor"  styles="margin-left: 24rpx;padding: 0 44rpx;width:auto" type="do" size="middle" @btn-click="pay">立即支付</btn>
                <subscribe v-if="showSubscribe && noticePayIds.length>0 && $utils.is_weixin()" :templates="noticePayIds" :subStyle='sub_style' @success="success" @error="error"></subscribe>
            </view>

        </view>
    </view>
</template>

<script>
    import {mapState} from "vuex";
    import Subscribe from '@/components/wechat/Subscribe'
    import {px2rpx} from "@/assets/jsTools/environment";

    export default {
        name: "CreateSubmit",
        components: {Subscribe},
        props: {
            payPrice: {
                type: [String, Number],
                default: 0
            },
            orderData: {
                type: Object,
                default: () => {}
            },
            // 公众号信息
            noticePayIds: {
                type: Array,
                default: () => []
            },
        },
        data() {
            return {
                showSubscribe: true, //公众号订阅按钮
            }
        },
        computed: {
            sub_style() {
                return `top:0;right:0;width:${px2rpx(190)};height:${px2rpx(76)};`
            },
            ...mapState('setting', {
                credit_text: state => state.systemSetting.credit_text,
            }),
            handleText() {
                return '合计：'
            },
            /*
            * 适配多商户 立即支付按钮置灰
            * */
            disabled() {
                let is_dis = false
                return is_dis
            },
            creditText(){
                if(this.orderData.pay_credit){
                    return `${this.orderData.pay_credit}${this.credit_text}+`
                }
                return ''
            },
            pay_price() {
                return this.payPrice.toFixed(2)
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            pay() {
                this.$emit('pay')
            },
            // 公众号订阅消息事件
            success() {
                this.showSubscribe = false;
                this.$emit('pay')
            },
            error() {
                this.showSubscribe = false;
                this.$emit('pay')
            }
        },
    }
</script>

<style lang="scss">
    .create-submit {
        height: 96rpx;
        line-height: 96rpx;
        padding-right: 24rpx;
        background-color: #fff;

        .price-text {
            font-size: 32rpx;
            font-weight: bold;
        }
        .flex {
            align-items: center;
            justify-content: flex-end;
        }

        .fz-12 {
            font-size: px2rpx(12);
        }
        .fz-16 {
            font-size: px2rpx(16);
        }
        .pay-btn {
            margin-left: 24rpx;
            padding: 0 44rpx;
            height: 68rpx;
            line-height: 68rpx;
            background: linear-gradient(to right, $uni-color-primary, #FF6F29);
            color: #fff;
            border-radius: 34rpx;
            text-align: center;
            font-size: px2rpx(14);
            &.disabled {
                background: #CCCCCC;
            }
        }
    }
</style>
