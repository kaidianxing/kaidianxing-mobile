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
    <view class="refund-money">
        <refund-cell title="退款金额" :label="editabled?'(可修改)':''">
            <template v-slot:append>
                <!-- 积分商城退款金额 -->
                <view class="font-style flex align-center" v-if="credit">{{ credit }}{{credit_text}}
                    <view class="font-style" v-if="money"> +￥{{ money }}</view>
                </view>
                <view class="font-style" v-else-if="!credit && !editabled">￥{{ money }}</view>
                <!-- 其他退款金额 -->
                <view class="flex align-center" v-else>
                    <input
                        ref="input"
                        type="digit"
                        class="refund-input theme-primary-price"
                        v-model="money"
                        @change="moneyChange"
                        @blur="moneyChange"
                        :disabled="!editabled"
                    />
                </view>
            </template>
        </refund-cell>
        <view class="refund-tip flex align-center" v-if="deduct">
            <view class="tip-content" v-if="!editabled">
                <text>退款金额内含</text>
                <text class="theme-primary-price"
                    v-if="deduct"
                    >{{ balance_text }}抵扣{{ deduct }}元</text
                >
                <text>，运费{{ option.dispatch_price }}元</text>
            </view>
            <view class="tip-content" v-else>
                <text>退款金额内含</text>
                <text class="theme-primary-price"
                    v-if="deduct"
                    >{{ balance_text }}抵扣{{ deduct }}元</text
                >
                <text>，部分退款时优先退还{{ balance_text }}</text>
            </view>
        </view>
    </view>
</template>
<script>
import RefundCell from '../RefundCell'

export default {
    props: {
        deduct: [String, Number],
        value: String,
        option: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            money: '',
            credit: '',
            balance_text: '',
            editabled: false,
        }
    },
    computed: {
        credit_text() {
            return (this.$store.state.setting?.systemSetting?.credit_text || '积分')
        }
    },
    components: {
        RefundCell,
    },
    watch: {
        value: {
            handler() {
                this.money = this.value
            },
            immediate: true,
        },
        option: {
            handler(val) {
                this.editabled = this.option.is_can_edit == 1
                this.credit = this.option?.credit || ''
            },
            immediate: true,
        },
    },
    beforeMount() {
        this.balance_text =
            this.$store.state.setting.systemSetting.balance_text || '余额'
    },
    methods: {
        moneyChange() {
            let money = this.money
            if (money > parseFloat(this.option.price)) {
                money = this.option.price
                this.$toast('退款金额不能大于订单金额')
                money = parseFloat(money).toFixed(2)
            }
            this.$set(this, 'money', parseFloat(money).toFixed(2))

            this.$emit('input', parseFloat(money).toFixed(2))
        },
    }
}
</script>
<style lang="scss" scoped>
.refund-money {
    margin-bottom: 16rpx;
    border-radius: 12rpx;
    background-color: #fff;
   
    .refund-input {
        font-size: 28rpx;
        text-align: right;
        line-height: 40rpx;
        color: $uni-color-primary;
        /deep/ .uni-input-input {
            font-weight: bold;
        }
    }

    .edit-icon {
        font-size: 48rpx;
        color: $uni-text-color-grey;
    }

    .refund-tip {
        padding-top: 8rpx;
        min-height: 34rpx;

        color: $uni-text-color-grey;
        background-color: #f5f5f5;
        padding-left: 24rpx;

        .tip-content {
            font-size: 24rpx;
            line-height: 34rpx;
        }

        
    }

    // 积分商城退款金额样式
    .font-style {
        font-size: 14px;
        font-weight: bold;
        text-align: right;
        color: $uni-color-primary;
    }
}
</style>
