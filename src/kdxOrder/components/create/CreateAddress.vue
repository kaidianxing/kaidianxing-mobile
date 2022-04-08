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
    <view class="create-address">
        <!-- 无地址时 -->
        <view v-if="!addressData.address_id" class="no-address flex-column" @click="chooseAddress">
            <i class="iconfont-m- icon-m-shouhuodizhi"></i>
            <text>请选择收货地址</text>
            <div class="line-box flex">
                <div class="line-icon" v-for="(item, index) in 40" :key="index"></div>
            </div>
        </view>
        <!-- 有地址时 -->
        <view v-else class="address-box flex" @click="chooseAddress">
            <view class="address-icon theme-primary-bgcolor">
                <i v-if="dispatch_type=='10'" class="iconfont-m- icon-m-map2 order-icon"></i>
                <i v-else-if="dispatch_type=='30'" class="iconfont-m- icon-m-tongchengpeisong2 order-icon"></i>
            </view>
            <view class="address flex1">
                <view class="name">
                    <text>{{addressData.buyer_name}}</text>
                    <text>{{buyer_mobile}}</text>
                </view>
                <view class="subtitle two-line-hide uni-text-color-grey">
                    {{addressData.address_state}}{{addressData.address_city}}{{addressData.address_area}}{{addressData.address_detail}}
                </view>
            </view>
            <view class="more"><i class="iconfont-m- icon-m-right"></i></view>
            <div class="line-box flex">
                <div class="line-icon" v-for="(item, index) in 40" :key="index"></div>
            </div>
        </view>
    </view>
</template>

<script>
    export default {
        name: "CreateAddress",
        components: {},
        props: {
            addressData: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {}
        },
        computed: {
            buyer_mobile() {
                return this?.addressData?.buyer_mobile?.replace(this?.addressData?.buyer_mobile?.substring(3,7), "****") || ''
            },
            dispatch_type(){
                return this.addressData?.dispatch_type
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            chooseAddress() {
                // 选择地址
                this.$Router.auto({
                    path: '/kdxMember/address/list',
                    query: {
                        type: 'order'
                    }
                })
            }
        },
    }
</script>

<style lang="scss">
    .create-address {
        position: relative;
        height: 188rpx;
        background-color: #fff;
        border-bottom-right-radius:12rpx;
        border-bottom-left-radius:12rpx;
        overflow: hidden;
        .bg {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 4rpx;
        }

        .no-address {
            position: relative;
            height: 100%;
            align-items: center;
            justify-content: center;
            color: $uni-text-color-grey;
            i {
                font-size: 72rpx;
            }
        }
        .address-box {
            position: relative;
            height: 100%;
            align-items: center;
            padding: 32rpx 24rpx;
            overflow: hidden;
            .address-icon {
                width: 60rpx;
                height: 60rpx;
                line-height: 60rpx;
                text-align: center;
                border-radius: 50%;
                .order-icon {
                    font-size: 44rpx;
                    color: #fff;
                }
            }
            .address {
                margin: 0 72rpx 0 24rpx;
                .name{
                    margin-bottom: 16rpx;
                    line-height: 40rpx;
                    text {
                        color: $uni-text-color;
                        &:first-child {
                            margin-right: 10px;
                        }
                    }
                }
                .subtitle {
                    font-size: 24rpx;
                    line-height: 34rpx;
                }
            }
            .more {
                font-size: 40rpx;
                color: $uni-text-color-grey;
                .iconfont-m- {
                    font-size: 40rpx;
                }
            }
        }
        .line-box {
            position: absolute;
            left: 0;
            bottom: 0;
            flex-wrap: nowrap;
            width: 100%;
            height: 4rpx;
            overflow: hidden;
            .line-icon {
                flex-shrink: 0;
                width: 16rpx;
                height: 4rpx;
                margin-right: 8rpx;
                background-color: #518DEF;
                transform: skewX(-45deg);
                &:nth-child(2n) {
                    background-color: #E42311;
                }
            }
        }
    }
</style>