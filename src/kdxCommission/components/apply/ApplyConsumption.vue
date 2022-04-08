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
<theme-content>
    <view class="apply-consumption">
        <view class="apply-title border-b">
            <text>成为</text>
            <text class="theme-primary-color">{{basicData.name}}</text>
            <text class="theme-primary-color">{{params.agent_name}}</text>
        </view>
        <view class="content">
            <view class="info">
                <view>累计购物满{{applyData.become_condition == 2 ? applyData.become_order_money + '元' : applyData.become_order_count + '次'}}，即可成为<text class="theme-primary-color">{{params.agent_name}}</text></view>
                <view>您已经消费<text class="theme-primary-price">{{applyData.become_condition == 2 ? applyData.member_order_money : applyData.member_order_count}}</text>{{applyData.become_condition == 2 ? '元' : '次'}}，继续加油～</view>
            </view>
            
            <btn styles="margin-top:112rpx;" classNames="theme-primary-bgcolor" size="middle" @btn-click="toIndex">继续去购物</btn>
        </view>
    </view>
    </theme-content>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "ApplyConsumption",
        props: ['applyData'],
        data() {
            return {}
        },
        computed: {
            params() {
                return this.$store.state.commissionSet.commissionSetting
            },
            ...mapState('setting', {
                basicData: state => state.systemSetting?.basic,
            }),
        },
        created() {
        },
        mounted() {
        },
        methods: {
            toIndex() {
                this.$Router.auto({
                    //#ifndef H5
                    path: '/pages/index/index',
                    //#endif
                    //#ifdef H5
                    path: '/'
                    //#endif
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
    .apply-consumption {
        background-color: #fff;
        border-radius: 12rpx;
        .apply-title {
            height: 80rpx;
            line-height: 80rpx;
            text-align: center;
            color: $uni-text-color;
            font-size: 28rpx;
        }
        .border-b {
            border-bottom: 1px solid $uni-border-color;
        }
        .content {
            padding: 32rpx 24rpx;
            .info {
                padding: 32rpx 0 0;
                line-height: 44rpx;
                text-align: center;
            }
            .btn {
                margin-top: 112rpx;
            }
        }
    }
</style>