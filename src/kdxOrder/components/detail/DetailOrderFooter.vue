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
    <view class="detail-order-footer">
        <view class="footer-btns">
                <view class="footer-container flex" v-if="!isRefundSuc">
                    <block v-if="status == 0">
                        <btn :classNames="['ptd28']" @btn-click="btnClick('cancelOrder')" type="text" :ghost="true">取消订单</btn>
                    </block>

                    <btn v-if="status == 0" :classNames="['ptd28 theme-primary-bgcolor']" @btn-click="btnClick('payOrder')" type="do">立即付款</btn>
                    <!-- 实体商品显示查看物流 -->
                    <btn v-if="orderData.dispatch_type == '10' && ((orderData.status == 11 || orderData.status == 30)|| (status == 20 && orderData.orderGoods[0].type === '0'))" :classNames="['ptd28']" @btn-click="btnClick('express')" type="text" :ghost="true">查看物流</btn>
                    <btn v-if="canShowAll && !(isGroupOrder&& !isSucGroups)" :classNames="['ptd28']" @btn-click="btnClick('refund')" type="text" :ghost="true">申请售后</btn>
                    <view v-if="refund_type === '1'" @click="btnClick('refundDetail')">售后详情</view>
                    <btn v-if="status == 30 || status == -1" :classNames="['ptd28']" @btn-click="btnClick('deleteOrder')" type="text" :ghost="true">删除订单</btn>
                    <!-- 拼团操作 -->
                    <view v-if="status ==10 && isGroupOrder" class="primary theme-primary-bgcolor" @click="btnClick('groupsDetail')">查看团详情</view>

                    <btn v-if="status == 20" :classNames="['ptd28','theme-primary-bgcolor']" @btn-click="btnClick('sendOrder')" type="do">确认收货</btn>
                    <btn v-if="status == 30 && is_comment == 1 && orderData.comment_status == 0&& orderData.activity_type !== '5'" :classNames="['ptd28','theme-primary-bgcolor']" @btn-click="btnClick('comment')" type="do">立即评价</btn>
                </view>
                <view class="footer-container flex" v-else>
                    <btn :classNames="['ptd28']" @btn-click="btnClick('deleteOrder')" type="text" :ghost="true">删除订单</btn>
                </view>
        </view>
    </view>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: 'DetailOrderFooter',
    components: {},
    props: {
        status: {
            type: [String, Number],
            default: ''
        },
        orderData: {
            type: Object,
            default: () => {}
        },
        order_id: [Number, String],
        is_comment: {
            type: [Number, String],
            default: 0
        }
    },
    data() {
        return {
            goodsList: [],
            isRefund: '0',
            refund_type: '',
            info: {},
            isRefundSuc: false
        }
    },
    computed: {
        // 判断是否有维权项
        hasIntersect() {
            let obj = {
                exchange: '1',
                refund: '1',
                return: '1'
            }
            this.goodsList.forEach(v => {
                Object.keys(obj).forEach(key => {
                    if (v.refund_rule[key] != '1') {
                        delete obj[key]
                    }
                })
            })

            return Object.keys(obj).length > 0
        },
        // 是否显示申请维权 (待收货状态 不能维权)
        canShowAll() {
            return (
                this.checkOrderSts(this.info) &&
                this.isRefund === '0' &&
                this.hasIntersect && this.orderData.scene !='20' &&
                !(this.orderData.status === '20' && this.orderData.dispatch_type === '30')
            )
        },
        // 订单完成时时检测维权时间是否在范围内
        allowFinish() {
            return this.info.refund_setting?.refund_time_status === 1
        },
        // 是否是拼团订单
        isGroupOrder(){
            return this.orderData.activity_type=='3'
        },
        // 拼团成功
        isSucGroups(){
            return this.orderData.groups_data?.success =='1'
        },
    },
    watch: {
        orderData: {
            handler(val) {
                let { is_refund, refund_type, orderGoods, ...info } = val
                this.goodsList = orderGoods || []
                this.isRefund = is_refund
                this.info = info
                this.refund_type = refund_type
                // this.isRefundSuc =
                //     this.goodsList.every(
                //         item =>
                //             item.refund_status == '10' ||
                //             item.refund_status == '11'
                //     ) || false // 修改bug 23877 产品确认显示售后详情
            },
            immediate: true
        }
    },
    methods: {
        // 判断订单状态
        checkOrderSts({ status }) {
            let flag = true
            // 状态为30时检测维权时间是否在范围内
            if (status === '30') {
                flag = this.allowFinish
            } else if (status == '-1') {
                flag = false
            }  else {
                let pass = ['10', '11', '20']
                flag = pass.indexOf(status) > -1
            }
            return flag
        },
        btnClick(type) {
            let fns = {
                refund: this.canRefund,
                refundDetail: this.goRefundDetail,
                groupsDetail: this.goGroupsDetail,

            };
            let fn = fns[type]
            if(fn){
                fn.call(this)
            } else {
                 this.$emit('btnClick', { name: type })
            }
        },
        canRefund() {
            let query = { order_id: this.order_id }

            this.$api.orderApi.refundInfo(query).then(res => {
                if (res.error === 0) {
                    this.$Router.auto({
                        path: '/kdxOrder/refund/start',
                        query
                    })
                }
            })
        },
        goRefundDetail() {
            let query = { order_id: this.order_id }

            this.$Router.auto({
                path: '/kdxOrder/refund/detail',
                query
            })
        },
        goGroupsDetail(){
            // 小程序分享有影响,只能在入口处清除
            this.$store.commit('groups/setGroupsTeamId', null)
            let query = { team_id: this.orderData.groups_data.id}
            this.$Router.auto({
                path: '/kdxGoods/groups/detail',
                query
            })
        },

    }
}
</script>

<style lang="scss">
.detail-order-footer {
    // position: fixed;
    // left: 0;
    // bottom: 0;
    width: 100%;
    height: 96rpx;
    padding: 20rpx 24rpx 20rpx 0;
    background-color: #fff;
    border-top: 1rpx solid $uni-border-color;
    box-sizing: border-box;
    .footer-btns {
        width: 100%;
        height: 100%;

        .footer-container {
            align-items: center;
            justify-content: flex-end;

            view {
                margin-left: 24rpx;
                padding: 12rpx 28rpx;
                font-size: 24rpx;
                border: 1px solid $uni-border-color;
                border-radius: 30rpx;
            }
        }
        .footer-container .primary {
            background: linear-gradient(158.86deg, #ff3c29 0%, #ff6f29 94.38%);
            color: #fff;
            border: 0;
            &.disabled {
                background: #ccc;
            }
        }
    }
}
</style>
