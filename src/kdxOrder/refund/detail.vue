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
    <page-box navbarBg>
        <view class="main">
            <view class="bg theme-primary-bgcolor"></view>
            <view class="main-cotnent">
                <!-- 维权状态 -->
                <detail-status :status="status" :refundType="refund_type" :timeout="timeout" :countTime="countTime" :reason="reason" @goOrderDetail="goOrderDetail" />
                <!-- 填写快递 -->
                <detail-address v-if="status == 1" @express="goExpress"></detail-address>
                <!-- 快递信息 -->
                <detail-express
                    v-if="showExpress"
                    :status="status"
                    :refund="refund"
                    @skip="getExpress"
                ></detail-express>
                <!-- 维权信息 -->
                <detail-goods
                    v-if="goods_info"
                    :goods-info="goods_info"
                    :img-list="imgList"
                    :order-goods-id="query.order_goods_id"
                    :refund="refund"
                ></detail-goods>
            </view>
        </view>
        <template v-slot:foot>
            <view class="flex flex-end align-center footer van-hairline--top">
                
                <btn styles="margin:0 24rpx 0 0;" v-if="canCancel" :classNames="['ptd28']" @btn-click="showModal('cancelRefund')" type="text" :ghost="true">取消申请</btn>
                <btn styles="margin:0 24rpx 0 0;" v-if="status == -1" :classNames="['ptd28', 'theme-primary-bgcolor']" @btn-click="editRefund" type="do">修改申请</btn>

                <text class="btn btn--primary  theme-primary-bgcolor" v-if="showEditEx" @click="editExpress">修改快递单号</text>
                <text
                    class="btn btn--primary  theme-primary-bgcolor"
                    v-if="status == 3 && refund_type == 3"
                    @click="showModal('sureChange')"
                >确认收货换货物品</text>
            </view>
        </template>
        <rr-modal
            :title="modalTips"
            v-model="show"
            @handlerOK="handlerOK"
            @handlerCancel="handlerCancel"
        ></rr-modal>
    </page-box>
</template>
<script>
import DetailStatus from '../components/refund/detail/DetailStatus'
import DetailAddress from '../components/refund/detail/DetaillAddress'
import DetailExpress from '../components/refund/detail/DetailExpress'
import DetailGoods from '../components/refund/detail/DetailGoods'
import { mapGetters, mapMutations } from 'vuex'
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    components: {
        DetailStatus,
        DetailAddress,
        DetailExpress,
        DetailGoods
    },
    data() {
        return {
            goods_info: null,
            imgList: null,
            query: {
                order_id: ''
            },
            status: 0,
            refund: null,
            refund_type: 0,
            timeout: {},
            reason: '',
            isOnload: false,
            show: false,
            modalTips: '您将取消申请售后，确定继续吗？',
            modalType: 'cancelRefund',
            platform_join: 0, // 多商户新增，是否允许平台介入
            isCancelBack: false, // 详情进来取消售后
            isRefundCancel: false, // 申请维权进来取消售后
            countTime: [],
            timer: null,
        }
    },
    computed: {
        canCancel() {
            return this.status >= 0 && this.status < 10
        },
        showExpress() {
            return (
                this.refund_type > 1 &&
                (this.refund.member_express_sn || this.refund.seller_express_sn)
            )
        },
        showEditEx() {
            if (
                (this.refund_type == 3 && this.status == 2) ||
                (this.refund_type == 2 && this.status == 3)
            ) {
                return true
            } else {
                return false
            }
        },
    },
    onShow() {
        if (this.isOnload) {
            this.getRefundInfo()
        }
    },
    mounted() {
        this.initQuery()
        this.getRefundInfo()
    },
    methods: {
        ...mapMutations('order', ['setRefundCheckEx']),
        initQuery() {
            let { order_id, order_goods_id } = this.$Route.query
            this.query.order_id = order_id
            this.query.is_edit = 1
            if (order_goods_id) {
                this.query = { ...this.query, order_goods_id }
            }
        },
        getRefundInfo() {
            this.$api.orderApi
                .refundDetail(this.query)
                .then(res => {
                    if (res.error === 0) {
                        let { goods_info, refund } = res
                        let { status, refund_type, reject_reason } = refund
                        this.reason = reject_reason
                        this.goods_info = goods_info
                        this.status = status
                        this.refund_type = refund_type
                        this.timeout = {
                            timeout_cancel: res.refund.timeout_cancel,
                            status: res.refund.status,
                            timeout_cancel_refund: res?.refund?.queue_id
                        };
                        if (this.timeout.timeout_cancel_refund !=0 && this.timeout.status == 1) {
                            this.handleCountTime()
                        }
                        this.platform_join = res.platform_join
                        if (refund.images) {
                            this.imgList = JSON.parse(refund.images).map(v =>
                                this.$utils.mediaUrl(v)
                            )
                        }
                        this.isOnload = true
                        this.refund = refund
                    }
                })
        },
        editRefund(type) {
            let query = {...this.query};
            if (type === 'need_platform') {
                query.need_platform = 1
            }
            this.$Router.replace({
                path: '/kdxOrder/refund/start',
                query: query
            })
        },
        showModal(type) {
            this.modalType = type
            if (type === 'cancelRefund') {
                this.modalTips = '您将取消申请售后，确定继续吗？'
            } else if (type === 'sureChange') {
                this.modalTips = '确定收到换货商品了吗？'
            }
            this.show = true
        },
        handlerOK() {
            if (this.modalType === 'cancelRefund') {
                this.sureCancel()
            } else if (this.modalType === 'sureChange') {
                this.sureChange()
            }
            this.show = false
        },
        handlerCancel() {
            this.show = false
        },
        sureCancel() {
            this.$api.orderApi.cancelRefund(this.query).then(res => {
                if (res.error === 0) {
                    this.goOrderDetail()
                }
            })
        },
        // 修改快递单号
        editExpress() {
            let {
                member_express_name: name,
                member_express_encoding: ali_key,
                member_express_code: code,
                member_express_sn
            } = this.refund

            this.setRefundCheckEx({
                ali_key,
                key: ali_key,
                code,
                name
            })

            this.goExpress({ express_sn: member_express_sn })
        },
        sureChange() {
            this.$api.orderApi.exchangeSuc(this.query).then(res => {
                if (res.error === 0) {
                    uni.showToast({
                        title: '操作成功',
                        icon: 'none'
                    })
                    this.getRefundInfo()
                }
            })
        },
        getExpress(data) {
            this.$Router.auto({
                path: '/kdxOrder/refund/expressInfo',
                query: { order_id: this.query.order_id, ...data }
            })
        },
        goExpress(info = {}) {
            this.$Router.auto({
                path: '/kdxOrder/refund/express',
                query: { ...this.query, ...info }
            })
        },
        goOrderDetail() {
            let pages = getCurrentPages()
            let before = pages[pages.length - 1]
            if(pages.length === 1 || (pages.length === 2 && before?.route === 'kdxOrder/refund/express')){
                this.isCancelBack = true;
                this.$Router.replaceAll({
                    path: '/kdxOrder/detail',
                    query: {
                        order_id: this.query.order_id
                    }
                });
                return
            }
            if(before?.route == 'kdxOrder/detail') {
                this.isCancelBack = true
                this.$Router.back()
            } else {
                this.isRefundCancel = true
                this.$Router.back(1)
            }
        },
        goDetail(goods_id) {
            this.$Router.auto({
                path: '/kdxGoods/detail/index',
                query: {
                    goods_id
                }
            })
        },
        handleCountTime() {
            let endTime = new Date(Date.parse(this.timeout.timeout_cancel.replace(/-/g, "/"))).getTime();
            let time = parseInt(endTime / 1000);
            this.timer = setInterval(() => {
                this.countTime = this.$utils.countDown(time, false);
                if (!this.countTime && this.timeout.status == 1) {
                    clearInterval(this.timer);
                    this.$toast('该状态无法提交快递单号')
                    setTimeout(()=> {
                        this.goOrderDetail()
                    },3000)
                }
            }, 1000)
        }
    },
    beforeDestroy() {
        this.setRefundCheckEx({})
        clearInterval(this.timer)
    },
    onUnload() {
        let pages = getCurrentPages()
        setTimeout(() => {
            if (pages[pages.length - 1]?.route === 'kdxOrder/refund/action' || pages[pages.length -2]?.route === 'kdxOrder/refund/action' && !this.isCancelBack) {
                let i= -1, before;
                pages.forEach((page,index)=> {
                    if(page.route === 'kdxOrder/detail') {
                        before = page
                        i = index
                    }
                })
                // 如果是详情申请进来的，返回详情页
                // #ifdef H5
                let len = pages.length - i - 1;
                // #endif
                // #ifndef H5
                let len = pages.length - i - 2;
                // #endif

                if(i == -1){
                    len = 1
                }

                this.$Router.back(len)
            }
        }, 0)
    }
}
</script>

<style lang="scss" scoped>
/deep/ .gBody {
    background-color: #f5f5f5;
    padding-bottom: 100rpx;
}

.main {
    .bg {
        width: 100vw;
        height: 142rpx;
        background: linear-gradient(
            180deg,
            $uni-color-primary 0%,
            #ff6f29 96.87%
        );
    }
    .main-cotnent {
        margin-top: -110rpx;
        padding: 0 24rpx;

        min-height: calc(100vh - 144rpx);
        /* #ifdef H5 */
        // min-height: calc(100vh - 232rpx);
        /* #endif */
        display: flex;
        flex-direction: column;

        /deep/ .address {
            .prefix {
                margin-right: 16rpx;
                font-size: 40rpx;
                color: $uni-color-primary;
            }
            .cell,.cell-inner  {
                border-bottom: 0;
            }
        }

        /deep/ .express {
            .cell {
                margin-left: 24rpx;
                padding-left: 0;
            }

            /*  #ifdef  MP-WEIXIN  */

            // .cell:last-child {
            //     border-bottom: 2rpx solid $uni-border-color;
            // }
            /*  #endif  */
        }

        /deep/ .goods-info {
            flex: 1;
            .cell {
                display: none;
            }

            .main-content {
                margin: 0;
            }

            .add-list {
                margin-bottom: 32rpx;
            }

            .img-list {
                &-items {
                    margin-right: 24rpx;
                    margin-bottom: 16rpx;
                    height: 140rpx;
                    width: 140rpx;
                    border: 0;

                    &:nth-child(4n) {
                        margin-right: 0;
                    }

                    .price {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        border-radius: 0px 0px 4rpx 4rpx;
                        width: 100%;
                        height: 32rpx;
                        font-size: 20rpx;
                        text-align: center;
                        line-height: 32rpx;
                        color: #fff;
                        background: rgba(#212121, 0.7);
                    }
                }
            }
        }
    }

}
.footer {
    height: 94rpx;
    background-color: #fff;
    border-top: 1px solid #e6e7eb;

    &.van-hairline--top:after {
        border-top-color: $uni-border-color;
        border-style: solid;
    }
}

.btn {
    margin-right: 24rpx;
    box-sizing: border-box;
    border: 2rpx solid #e6e7eb;
    border-radius: 158rpx;
    padding: 0 12rpx;
    min-width: 152rpx;
    height: 56rpx;
    font-size: 24rpx;
    line-height: 56rpx;
    text-align: center;
    color: $uni-text-color;

    &--primary {
        color: #fff;
        border: 0;
    }
}
</style>
