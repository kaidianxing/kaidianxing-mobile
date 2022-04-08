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
        <view class="main">
            <!-- 维权提示 -->
            <action-tip v-if="info.refund_info" :content="info.refund_info" :title="`${getTypeText}须知`"></action-tip>

            <!-- 维权商品 -->
            <refund-goods
                v-if="goods_info"
                :order-goods-id="order_goods_id"
                :goods-info="goods_info"
            ></refund-goods>

            <!-- 维权金额 -->
            <action-money
                v-model="model.price"
                :deduct="priceOpt.balance_deduct"
                :option="priceOpt"
                :credit="model.credit"
                v-if="
                    model.refund_type === '1' ||
                        (model.refund_type === '2' && model.price)
                "
            ></action-money>

            <!-- 维权说明 -->
            <action-explain :title="getTypeText" v-model="model.content"></action-explain>

            <!-- 维权凭证 -->
            <action-proofs :img-list="imgList" @change="imgsChange"></action-proofs>
        </view>

        <template v-slot:foot>
            <view class="flex flex-end align-center footer van-hairline--top">
                <btn type="text" :ghost="true" @btn-click="cancelHandle">取消</btn>
                <btn type="do" classNames="theme-primary-bgcolor" @btn-click="submitData">提交申请</btn>
            </view>
        </template>
        <toast-tip v-model="show" title="提交成功" type="success"></toast-tip>
    </page-box>
</template>

<script>
import RefundGoods from '../components/refund/RefundGoods'
import ActionTip from '../components/refund/action/ActionTip'
import ActionMoney from '../components/refund/action/ActionMoney'
import ActionExplain from '../components/refund/action/ActionExplain'
import ActionProofs from '../components/refund/action/ActionProofs'
import ToastTip from '../components/refund/ToastTip'

import { multipleFilesUpload } from '@/common/util'
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    components: {
        RefundGoods,
        ActionTip,
        ActionMoney,
        ActionExplain,
        ActionProofs,
        ToastTip
    },
    data() {
        return {
            goods_info: null,
            imgList: [],
            info: {},
            model: {
                refund_type: '',
                order_id: '',
                price: '',
                content: ''
            },
            order_goods_id: '',
            show: false,
            priceOpt: {},
            need_platform: '',
        }
    },
    computed: {
        getTypeText() {
            let textObj = {
                '1': '退款',
                '2': '退货退款',
                '3': '换货'
            }
            return textObj[this.model.refund_type]
        },
        getQueryTerm() {
            let data = { order_id: this.model.order_id }

            if (this.order_goods_id) {
                data.order_goods_id = this.order_goods_id
            }

            return data
        }
    },
    mounted() {
        this.initData()
        this.setTitle()
    },
    methods: {
        // 根据维权类型设置不同的标题
        setTitle() {
            uni.setNavigationBarTitle({
                title: this.getTypeText
            })
        },
        initData() {
            let { order_id, order_goods_id, refund_type, need_platform } = this.$Route.query
            this.model = { ...this.model, order_id, refund_type }
            this.order_goods_id = order_goods_id;
            this.need_platform = need_platform
            this.canRefund()
        },
        // 判断能否进行维权
        canRefund() {
            this.$api.orderApi
                .refundInfo(this.getQueryTerm)
                .then(res => {
                    if (res.error === 0) {
                        let {
                            refund_type,
                            goods_info,
                            refund_price,
                            ...info
                        } = res
                        this.goods_info = goods_info
                        this.model = {
                            ...this.model,
                            price: refund_price.price
                        }
                        this.priceOpt = refund_price
                        this.info = info
                        // console.log(this.priceOpt)
                    }
                })
        },
        submitData() {
            let data = { ...this.model }

            if (this.order_goods_id) {
                data.order_goods_id = this.order_goods_id
            }
            if (this.need_platform) {
                data.need_platform = this.need_platform
            }
            if (this.model.refund_type === '3') {
                delete data.price
            } else if (!data.price) {
                return this.$toast('退款金额不能为空')
            }

            if (!this.model.content) {
                return this.$toast(`请输入${this.getTypeText}说明`)
            }
            // uni.showLoading({title:'加载中'})
            // 判断有没有上传凭证
            if (this.imgList.length) {
                // 提交申请时开始上传文件
                // multipleFilesUpload
                multipleFilesUpload(this.imgList)
                    .then(res => {
                        if (res) {
                            data.images = JSON.stringify(res)
                            this.submitRefund(data)
                        }
                    })
                    .catch(err => {
                        uni.hideLoading()
                        this.$toast(err)
                    })
            } else {
                this.submitRefund(data)
            }
        },
        async submitRefund(data) {
            this.$api.orderApi
                .refundSubmit(data)
                .then(res => {
                    if (res.error === 0) {
                        this.show = true
                        setTimeout(() => {
                            this.goRefundDetail()
                        }, 500)
                    }
                })
                .finally(() => {
                    uni.hideLoading()
                })
        },
        goRefundDetail() {
            this.$Router.auto({
                path: '/kdxOrder/refund/detail',
                query: this.getQueryTerm
            })
        },
        imgsChange(e) {
            this.imgList = e
        },
        cancelHandle() {
            this.$Router.back(1)
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/ .gBody {
    background-color: #f5f5f5;
}
.main {
    padding: 16rpx 24rpx 100rpx;

    /deep/ .refund-goods {
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
                    font-size: 16rpx;
                    text-align: center;
                    line-height: 32rpx;
                    color: #fff;
                    background: rgba(#212121, 0.7);
                }
            }
        }
    }

    /deep/ .refund-money {
        .label {
            margin-left: 10rpx;
        }

        .cell,.cell-inner  {
            border-bottom: 0;
        }
    }
}

/deep/.footer {
    height: 94rpx;
    background-color: #fff;
    .kdx-btn{
        width: 144rpx;
        margin-right: 24rpx;
    }
    &.van-hairline--top:after {
        border-top-color: $uni-border-color;
        border-style: solid;
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
            background: linear-gradient(
                    158.86deg,
                    $uni-color-primary 0%,
                    #ff6f29 94.38%
            );
        }
    }
}
</style>
