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
    <view class="list-modal">
        <!-- 取消订单modal -->
        <rr-modal v-model="cancelModal" title="确定取消订单吗？" @handlerCancel="handlerCancel" @handlerOK="cancelOrderOk"></rr-modal>
        <!-- 删除订单 -->
        <rr-modal v-model="deleteModal" title="确定删除订单吗？" @handlerCancel="handlerCancel" @handlerOK="deleteOrderOk"></rr-modal>
        <!-- 确认收货 -->
        <rr-modal v-model="sendModal" title="确定收到所有商品了吗？" @handlerCancel="handlerCancel" @handlerOK="sendOrderOk"></rr-modal>
    </view>
</template>

<script>
// 23143bug
// #ifdef MP-TOUTIAO
import bus from "../../bus";
// #endif
    export default {
        name: "ListModal",
        components: {},
        props: {
            title: String
        },
        data() {
            return {
                cancelModal: false,
                deleteModal: false,
                sendModal: false,
            }
        },
        computed: {},
        created() {
            // #ifdef MP-TOUTIAO
            bus.$emit('list-modal', this)
            // #endif
        },
        mounted() {
        },
        methods: {
            showCancelModal() {
                console.log(this._uid)
                this.cancelModal = true;
            },
            showDeleteModal() {
                this.deleteModal = true;
            },
            showSendModal() {
                this.sendModal = true;
            },
            handlerCancel() {
                this.cancelModal = false;
                this.deleteModal = false;
                this.sendModal = false;
            },
            cancelOrderOk() {
                this.cancelModal = false;
                this.$emit('cancelOrderOk')
            },
            deleteOrderOk() {
                this.deleteModal = false;
                this.$emit('deleteOrderOk')
            },
            sendOrderOk() {
                this.sendModal = false;
                this.$emit('sendOrderOk')
            },
        },
    }
</script>

<style lang="scss">
</style>