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
    let settings = require('@/static/settings.js').config
export default {
    data() {
        return {
            id: '',
            shop_id: ''
        }
    },
    mounted() {
        let { id} = this.$route.query
        this.id = id
        this.shop_id = settings.shop_id
        this.getLink()
    },
    methods: {
        getLink() {
            this.$api.othersApi.getWxAppLink({ id: this.id,shop_id: this.shop_id }).then(res=> {
               if(res.error === 0){
                   if(res.data?.path){
                       location.href = res.data?.path
                   }
               } else {
                   this.$toast(res.message)
               }
            })
        }
    }
}
</script>