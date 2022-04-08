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
    <view class="apply-condition">
        <block v-if="handleStatus || show_success">
            <apply-audit :applyData="applyData" :show_success="show_success" :is_audit="is_audit"></apply-audit>
        </block>
        <block v-else>
           <!-- 购买商品 -->
           <apply-goods v-if="applyData.become_condition == 1" :goodsList="goodsList" @custom-event='eventHandler'></apply-goods>
           <!-- 消费金额 -->
           <apply-consumption v-if="applyData.become_condition == 2 || applyData.become_condition == 3" :applyData="applyData"></apply-consumption>
           <!-- 表单申请项 ps：申请协议可以隐藏 -->
           <apply-form v-if="applyData.become_condition == 4" :applyData="applyData" @changeStatus="changeStatus"></apply-form>
        </block>
    </view>
</template>

<script>
    import applyGoods from './ApplyGoods'
    import applyConsumption from './ApplyConsumption'
    import applyAudit from './ApplyAudit'
    import applyForm from './ApplyForm'

    export default {
        name: "ApplyCondition",
        components: {
            applyGoods,
            applyConsumption,
            applyAudit,
            applyForm
        },
        props: {
            applyData: {
                type: Object,
                default: () => {}
            },
            goodsList: {
                type: Array,
                default: () => []
            },
            show_success: {
                type: [Number, String],
                default: 0
            },
            is_audit: {
                type: [Number, String],
                default: 0
            },
        },
        data() {
            return {
                isSHow: false
            }
        },
        watch: {},
        computed: {
            handleStatus() {
                if (this.applyData?.show_reject) {
                    this.isSHow = true
                } else if (this.applyData?.status) {
                    this.isSHow = this.applyData.status == 0
                } else if (this.applyData?.become_condition == 0 && this.applyData?.is_audit == 1) {
                    this.isSHow = true
                }
                return this.isSHow
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            eventHandler(e){
                this.$emit('custom-event',e)
            },
            changeStatus(status) {
                this.applyData.status = status;
                this.isSHow = true;
            },
        },
    }
</script>

<style lang="scss">
    .apply-condition {

    }
</style>
