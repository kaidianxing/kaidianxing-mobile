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
    <page-box :setting="{background:'#fff'}">
        <NoticeModules @custom-event='toIndex'></NoticeModules>
    </page-box>
</template>

<script>
    import NoticeModules from '@/components/spin/Notice'
    import PageMixin from '@/common/PageMixin.js'
    export default {
        mixins: [PageMixin],
        components: {
            NoticeModules
        },
        data() {
            return {
                info: {

                }
            }
        },
        created() {
            this.$store.dispatch('setting/getSysSetting').then(res => {
                if (res) {
                    if (res.plugins.commission) {
                        this.toIndex();
                    }
                }
            })
        },
        methods: {
            toIndex() {
                // #ifdef H5
                this.$Router.replaceAll({
                    path: '/',
                })
                // #endif
                // #ifndef H5
                this.$Router.replaceAll({
                    path: '/pages/index/index',
                })
                // #endif
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
