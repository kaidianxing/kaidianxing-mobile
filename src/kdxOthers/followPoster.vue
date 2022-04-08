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
    <page-box>
       <poster-modal poster-type="follow" ref="poster"></poster-modal>
    </page-box> 
</template>

<script>
    import PosterModal from "@/components/poster/PosterModal";
    import PageMixin from '@/common/PageMixin.js'
    export default {
        mixins: [PageMixin],
        components: {
            PosterModal,
        },
        mounted() {
            // 获取登录状态以及是否强制绑定手机号
            this.$store.dispatch('login/checkLogin').then(res => {
                if (!res) {
                    this.$store.commit('login/setModal', true)
                } else {
                    this.$refs.poster.toggle(show => {
                        console.log("toggle", show);
                    });
                }
            })
        }
    }
</script>

<style lang="scss" scoped>

</style>