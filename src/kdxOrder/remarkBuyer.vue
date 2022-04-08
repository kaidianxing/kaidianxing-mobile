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
    <view class="buy-message">
        <view class="container">
            <textarea placeholder="请输入买家留言"
                      placeholder-class="text-placeholder"
                      :maxlength="50"
                      v-model="remark">
            </textarea>
            <text class="currentWordNumber">{{remark.length}}/50</text>
        </view>
        <btn type="do" size="middle" classNames="theme-primary-bgcolor" @btn-click="submit">提交</btn>
    </view>
    </theme-content>
</template>

<script>
    import PageMixin from '@/common/PageMixin.js'
    export default {
        mixins: [PageMixin],
        name: "message",
        props: {},
        data() {
            return {
                remark: ''
            }
        },
        computed: {},
        created() {
        },
        mounted() {
            this.remark = this.$store.state.orderCreate.buyer_remark
        },
        methods: {
            submit() {
                // store中存储买家留言
                this.$store.commit('orderCreate/setOrderCreateInfo', {buyer_remark: this.remark});
                // 返回确认订单页面
                // this.$Router.back(0)
                this.$Router.back(1)
            }
        },
    }
</script>

<style lang="scss">
    .buy-message {
        padding: 16rpx 24rpx;
        height: 100%;
        background-color: $uni-bg-color-grey;
        .container {
            margin-bottom:32rpx;
            position: relative;
            textarea {
                padding: 32rpx 24rpx;
                background-color: #fff;
                width: 100%;
                box-sizing: border-box;
                font-size: 24rpx;
                line-height: 34rpx;
                color: $uni-text-color;
            }
            /deep/ .text-placeholder {
                font-size: 24rpx;
                color: $uni-text-color-grey;
            }
            .currentWordNumber {
                position: absolute;
                bottom: 16rpx;
                right: 28rpx;
                font-size: 24rpx;
                color: $uni-text-color-grey;
            }
        }
        .submit-btn {
            margin-top: 32rpx;
            background: linear-gradient(to right, $uni-color-primary, #FF6F29);
        }
    }
</style>