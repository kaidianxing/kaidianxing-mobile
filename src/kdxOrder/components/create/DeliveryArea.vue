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
<template>
    <div class="delivery-area" v-if="intracity_error" >
        <div class="flex box align-center theme-sub-bgcolor theme-spec-bgcolor theme-primary-border">
            <div class="left flex align-center">
                <div class="text theme-primary-color" v-if=" intracity_error && (intracity_error.code === 230133 || intracity_error.code == 230136)">该商户商品{{ intracity_error.msg }}</div>
                <div class="text theme-primary-color" v-else>所选地址不在配送范围内</div>
            </div>
            <div class="right flex align-center" @click="jumpDeliveryArea" v-if="orderData.address_province!='国外'">
                <div class="text" >查看配送范围</div>
                <span class="iconfont-m- icon-m-right"></span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['orderData'],
    data() {
        return {
            intracity_error: ''
        }
    },
    watch: {
        'orderData.dispatch_intracity_error' : {
            handler(val) {
                this.intracity_error = val != null ? this.orderData.dispatch_intracity_error : ''
                this.$forceUpdate()
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        // 查看配送范围
        jumpDeliveryArea() {
            this.$Router.auto({
                path: '/kdxOrder/deliveryArea',
                query:  {},
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.delivery-area {
    margin-top: 16rpx;
    .box {
        height: 68rpx;
        background: #fff3f5;
        border: 2rpx solid #ffcdd0;
        box-sizing: border-box;
        border-radius: 12rpx;
        padding-left: 24rpx;
        padding-right: 24rpx;
        justify-content: space-between;
        .text {
            font-size: 24rpx;
            line-height: 34rpx;
        }
        .iconfont-m- {
            font-size: 28rpx;
        }
        .left {
            .iconfont-m- {
                color: #ff3c29;
            }
            .text {
                padding-left: 8rpx;
                color: #ff3c29;
            }
        }
        .right {
            .text {
                color: #518def;
                padding-right: 4rpx;
            }
            .iconfont-m- {
                color: #518def;
            }
        }
    }
}
</style>
