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
    <view class="withdraw-card">
        <view class="item" v-for="(item, index) in list" :key="item.id">
            <view class="top flex">
                <view class="left flex1">
                    <view>提现到{{item.type_text}}</view>
                    <view class="uni-text-color-grey">{{item.apply_time}}</view>
                </view>
                <view class="right">
                    <view v-if="item.status == 0" class="orange">{{item.status_text}}</view>
                    <view v-if="item.status == 10" class="uni-color-primary">{{item.status_text}}</view>
                    <view v-if="item.status == 20" class="success">{{item.status_text}}</view>
                    <view v-if="item.status == 21" class="success">{{item.status_text}}</view>
                    <view v-if="item.status == 30" class="uni-text-color-grey">{{item.status_text}}</view>
                    <view v-if="item.status == 31" class="uni-text-color-grey">{{item.status_text}}</view>
                    <view>+{{item.final_commission}}元</view>
                </view>
                <view class="icon" @click="clickItem(index)">
                    <i v-if="active[index]" class="iconfont-m- icon-m-down"></i>
                    <i v-else class="iconfont-m- icon-m-right"></i>
                </view>
            </view>
            <view class="bottom" v-if="active[index]">
                <view class="bottom-content flex">
                    <view>
                        <view class="label uni-text-color-grey">申请佣金</view>
                        <view>{{item.apply_commission}}元</view>
                    </view>
                    <view>-</view>
                    <view>
                        <view class="label uni-text-color-grey">提现手续费</view>
                        <view>{{item.charge_deduction}}元</view>
                    </view>
                    <view>=</view>
                    <view>
                        <view class="label uni-text-color-grey">实际金额</view>
                        <view>{{item.final_commission}}元</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "ListCard",
        components: {},
        props: {
            list: {
                type: Array
            }
        },
        data() {
            return {
                active: {}
            }
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            clickItem(index) {
                this.active[index] = !this.active[index];
                this.active = { ...this.active}
            }
        },
    }
</script>

<style lang="scss" scoped>
    .withdraw-card {
        .item {
            margin-bottom: 12rpx;
            background-color: #fff;
            border-radius: 12rpx;
            .success {
                color: #09C15F;
            }
            .orange {
                color: #FF6F29;
            }
            .top {
                padding: 16rpx 24rpx;
                justify-content: space-between;
                align-items: center;
                view {
                    font-size: 24rpx;
                    line-height: 34rpx;
                }
                .right {
                    text-align: right;
                }
                .icon {
                    margin-left: 26rpx;
                    color: $uni-text-color-grey;
                }
            }
            .bottom {
                border-top: 1px solid $uni-border-color;
                .bottom-content {
                    padding: 16rpx 64rpx;
                    justify-content: space-between;
                    align-items: center;
                    view {
                        font-size: 24rpx;
                        line-height: 34rpx;
                    }
                    >view {
                        text-align: center;
                    }
                    .label {
                        margin-bottom: 6rpx;
                    }
                }
            }
        }
    }
</style>