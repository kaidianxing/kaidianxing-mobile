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
    <login-box>
        <login-pass v-if="type=='0'" @switch="switchHandler"></login-pass>
        <login-code v-else-if="type=='1'" @switch="switchHandler"></login-code>
    </login-box>
</template>
<script>
import {mapState} from 'vuex'
import LoginBox from './components/LoginBox'
import LoginPass from './components/login/LoginPass'
import LoginCode from './components/login/LoginCode'
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    components: {
        LoginBox,
        LoginPass,
        LoginCode
    },
    data() {
        return {
            type: '2'
        }
    },
    computed: {
        ...mapState('setting',{
            h5_login_method: state=> state.systemSetting?.registry_settings?.h5_login_method
        })
    },
    watch: {
        // #ifdef H5
        h5_login_method: {
            handler(val){
                this.type = this.h5_login_method||'0'
            },
            immediate: true
        }
        // #endif
    },
    methods: {
        switchHandler(type) {
            this.type = type
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/ .grace-page-body {
    background-color: #fff;
}

/deep/ .login-code {
    .my-long-button {
        margin: 96rpx auto 0;
        width: 590rpx;
    }
}

/deep/ .login-pass {
    .my-long-button {
        margin: 0 auto;
        width: 590rpx;
    }
}
</style>