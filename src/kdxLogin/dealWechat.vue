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
    <view></view>
</template>


<script>
const url = require('url')

import { mapState, mapMutations } from 'vuex'
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    mounted() {
        uni.showLoading({
            mask: true
        })

        this.postData()
    },
    computed: {
        ...mapState('login', ['oldLength'])
    },
    methods: {
        ...mapMutations('login', ['setLogin']),
        postData() {
            let { code, state, target_url, target_params } = url.parse(
                decodeURIComponent(location.href),
                true
            ).query
            this.$api.loginApi
                .getLogin({ code, state, type: 'wechat' })
                .then(res => {
                    if (res.error === 0) {
                        // 设置登录状态
                        this.setLogin(true)
                        uni.hideLoading()
                        this.$toast('登录成功')
                        let len = history.length
                        if (this.oldLength != null) {
                            history.go(this.oldLength - len)
                        } else {
                            if (len == 2) {
                                history.go(-1)
                            } else {
                                history.go(-2)
                            }
                        }

                    } else {
                        this.$toast(res.message)
                        uni.hideLoading()
                        let len = history.length
                        setTimeout(() => {
                            if (len == 2) {
                                history.go(-1)
                            } else {
                                history.go(-2)
                            }
                        }, 1000);
                    }
                })
        }
    }
}
</script>