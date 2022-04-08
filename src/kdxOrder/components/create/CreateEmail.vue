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
    <view class="create-email">
        <div class="email">
            <div class="title">接收邮件地址 <span> （选填） </span></div>
<!--            <div class="tip">购买后将会发送到您添加的邮箱地址</div>-->
            <div class="content">
                <input v-model="params.virtual_email" class="rr-input" type="text" placeholder="请输入接收卡密商品信息的邮箱地址" placeholder-class="input-placeholder" />
            </div>
        </div>
    </view>
</template>

<script>

    import {mapState} from "vuex";
    export default {
        name: "CreateEmail",
        computed: {
            ...mapState('orderCreate', {
                params: state => state,
            }),
        },
        data() {
            return {
            }
        },
        methods: {
        }
    }
</script>

<style scoped lang="scss">
    .create-email {
        background-color: #ffffff;
        padding-bottom: px2rpx(16);
        margin-top: px2rpx(8);
        border-radius: px2rpx(6);
        .email {
            padding: 16px 12px 0 12px;
            .title {
                min-width: 80px;
                font-size: 14px;
                line-height: 20px;
                word-break: break-all;
                span{
                    color: #969696;
                }
            }
            .tip {
                font-size: 12px;
                line-height: 17px;
                padding-top: 4px;
                color: #969696;
                word-break: break-all;
            }
            .content {
                flex: 1;
                display: flex;
                font-size: 14px;
                line-height: 20px;
                color: #212121;
                margin-top: 8px;
                border: 1px solid #E6E7EB;
                border-radius: 2px;
                padding: 10px 12px;
                background: #F5F5F5;
                input {
                    width: 100%;
                }
            }
        }
    }
</style>