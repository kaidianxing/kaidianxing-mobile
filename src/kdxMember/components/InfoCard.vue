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
    <view class="info-card" :style="{backgroundImage: backGround}">
        <!-- 我的积分 -->
        <view class="card-con color">
            <view class="title">我的{{ credit_text }}</view>
            <view class="amount">{{ credit || 0 }}</view>
        </view>
        <!-- 积分规则 -->
        <view class="card-rule color flex" @click="openRules">
            <view class="iconfont-m- icon-m-wenhao"></view>
            <view class="tip"> {{ credit_text }}规则</view>
        </view>
        <!-- 按钮：去使用 -->
        <view class="card-use color" v-if="status === '1'" @click="skipToHome">
            去使用 <span class="iconfont-m- icon-m-right"></span>
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
    data() {
        return {
            status: '0',
            credit: ''
        }
    },
    created() {
        this.getMemberInfo();
        this.getStatus();
    },
    computed: {
        ...mapState('setting', {
            credit_text: state => state.systemSetting.credit_text,
        }),
        backGround() {
            return `url('${this.$utils.staticMediaUrl('member/credit-bg.png')}')`
        }
    },
    methods: {
        // 规则说明跳转
        openRules() {
            this.$Router.push({
                path: '/kdxMember/rules/index',
                query: {
                    type: '1'
                }
            });
        },
        skipToHome() {
            this.$Router.push({
                path: '/kdxCreditShop/index'
            })
        },
        getMemberInfo() {
            this.$decorator.getPage('vipCenter').getUserInfo().then(res => {
                //获取会员详情
                if (res.error === 0) {
                    this.credit = res.data.credit;
                }
            })
        },
        // 获取积分商城开关状态
        getStatus() {
            this.$api.creditShopApi.shopStatus({}, {errorToast: false}).then(res => {
                if(res.error === 0) {
                    this.status = res.data.status
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.info-card {
    width: 100%;
    height: px2rpx(139);
    position: relative;
    background-repeat: no-repeat;
    background-size: 100%;
    .color {
        color: #fff;
    }
    .card-con {
        display: inline-block;
        margin: px2rpx(24) 0 0 px2rpx(36);
        .title {
            height: px2rpx(16);
            line-height: px2rpx(16);
            font-size: px2rpx(12);
        }
        .amount {
            height: px2rpx(50);
            line-height: px2rpx(50);
            font-size: px2rpx(36);
            font-weight: 500;
        }
    }
    .card-rule {
        position: absolute;
        top: px2rpx(8);
        right: px2rpx(8);
        height: px2rpx(14);
        line-height: px2rpx(14);
        font-size: px2rpx(12);
        transform: scale(.8);  // 缩放后字体大小 10px
        .tip {
            margin-left: px2rpx(2);
        }
    }
    .card-use {
        position: absolute;
        top: px2rpx(60);
        right: px2rpx(12);
        height: px2rpx(16);
        line-height: px2rpx(16);
        font-size: px2rpx(12);
        display: flex;
        align-items: center;
    }
}
</style>