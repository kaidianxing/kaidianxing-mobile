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
    <view class="rule_main van-hairline--top">
        <view v-html="ext_field.rule_description.rule"></view>
    </view>
</template>

<script>


import {mapState} from 'vuex'
export default {
    name: "signRule",
    data() {
        return {
            ext_field: {
                rule_description: {
                    rule: ''
                }

            }
        }
    },
    computed: {
        ...mapState('login', ['userInfo']),
    },
    created() {
        this.$api.signInApi.getDetail({
            uid: this.userInfo.id,
        }).then(res => {
            this.ext_field = res.data.activity.ext_field
        })
    },
    methods: {
        change(val) {
            this.$emit('change', val)
        }
    }
}
</script>

<style>
page {
    background: #FFFFFF;
}
</style>
<style lang="scss" scoped>
.rule_main {
    //padding: px2rpx(16) px2rpx(12);
    /* #ifdef MP-WEIXIN */
    //border-top: 1px solid #E6E7EB;
    position: absolute;
    top:0;
    &.van-hairline--top:after {
        border-top-color: $uni-border-color;
        border-style: solid;
    }
    /* #endif */
}
</style>
