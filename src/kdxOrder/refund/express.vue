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
            <view class="address">
                <view>
                    <refund-cell title="退货地址"></refund-cell>
                </view>
                <view class="address-desc-box">
                    <refund-cell
                        :title="refund.refund_name"
                        :label="refund.refund_mobile"
                    >
                        <template v-slot:bottom>
                            <view class="address-desc">
                                {{ refund.refund_address }}
                            </view>
                        </template>
                    </refund-cell>
                </view>
            </view>
            <view
                class="express"
                :class="{
                    on: refund_checkEx.name,
                }"
            >
                <view>
                    <refund-cell
                        title="快递公司"
                        :value="getExText"
                        rightIcon="icon-m-right"
                        @icon-click="choose"
                    ></refund-cell>
                </view>
                <view class="express-sn">
                    <refund-cell title="快递单号">
                        <template v-slot:append>
                            <input
                                type="text"
                                v-model="queryInfo.express_sn"
                                class="express-input"
                                placeholder-class="express-input-text"
                                placeholder="请输入快递单号"
                            />
                        </template>
                    </refund-cell>
                </view>
            </view>
            
            <btn type="do" size="middle" classNames="theme-primary-bgcolor" @btn-click="submitExpress">提交</btn>
        </view>
    </page-box>
</template>
<script>
import RefundCell from '../components/refund/RefundCell'
import { mapGetters, mapMutations } from 'vuex'
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    components: {
        RefundCell,
    },
    data() {
        return {
            queryInfo: {
                order_id: '',
                express_sn: '',
            },
            refund: {},
        }
    },
    computed: {
        ...mapGetters('order', ['refund_checkEx']),
        getExText() {
            if (this.refund_checkEx.name) {
                return this.refund_checkEx.name
            } else {
                return '请选择'
            }
        },
    },
    mounted() {
        this.initQuery()
        this.getRefundInfo()
    },
    methods: {
        ...mapMutations('order', ['setRefundCheckEx']),
        initQuery() {
            let { order_id, order_goods_id, express_sn } = this.$Route.query
            this.queryInfo.order_id = order_id
            if(this.$Route.query.is_edit) {
                this.queryInfo.is_edit = this.$Route.query.is_edit
            }
            if (order_goods_id) {
                this.queryInfo = { ...this.queryInfo, order_goods_id }
            }
            if (express_sn) {
                this.queryInfo = { ...this.queryInfo, express_sn }
            }
        },
        getRefundInfo() {
            this.$api.orderApi
                .refundDetail(this.queryInfo)
                .then((res) => {
                    if (res.error === 0) {
                        this.refund = res.refund
                    }
                })
        },
        submitExpress() {
            if (!this.refund_checkEx.name || !this.queryInfo.express_sn) {
                return uni.showToast({
                    icon: 'none',
                    title: '请填写物流信息',
                })
            }

            let { code, name, key } = this.refund_checkEx
            let data = {
                ...this.queryInfo,
                express_code: code,
                express_name: name,
                express_encoding: key,
            }
            this.$api.orderApi.submitExpress(data).then((res) => {
                if (res.error === 0) {
                    this.$Router.back(1)
                }else {
                    this.$toast('该状态无法提交快递单号')
                    setTimeout(()=> {
                        this.$Router.replace({
                            path: '/kdxOrder/detail',
                            query: {
                                order_id: this.$Route.query?.order_id
                            }
                        })
                    },3000)
                }
            })
        },
        choose() {
            this.$Router.auto({
                path: '/kdxOrder/refund/expressChoose',
            })
        },
    },
    beforeDestroy() {
        this.setRefundCheckEx({})
    },
}
</script>

<style lang="scss" scoped>
/deep/ .gBody {
    background-color: #f5f5f5;
}

.main {
    margin-top: 16rpx;
    padding: 0 24rpx;

    /deep/ .cell {
        padding-left: 0;
    }
    .express-sn /deep/ .cell .cell-inner {
        border-bottom: none;
    }
    .address,
    .express {
        overflow: hidden;
        padding-left: 24rpx;
        border-radius: 12rpx;
        background-color: #fff;
    }

    .address {
        margin-bottom: 14rpx;

        .address-desc-box {
            /deep/ .cell {
                .cell-inner {
                    padding-top: 32rpx;
                    padding-bottom: 32rpx;
                    border-bottom: none;
                }

                &:last-child {
                    border-bottom: 0;
                }

                .label {
                    font-size: 28rpx;
                    line-height: 40rpx;
                    color: $uni-text-color;
                }
            }
        }

        &-desc {
            font-size: 24rpx;
            line-height: 34rpx;
            color: $uni-text-color;
            margin-top: 8rpx;
        }
    }

    .express {
        margin-bottom: 32rpx;
        /deep/ .cell .value {
            font-size: 24rpx;
        }
        &.on {
            /deep/ .cell .value {
                color: $uni-text-color;
            }
        }

        &-sn {
            /deep/ .cell {
                &:last-child {
                    border-bottom: 0;
                }
            }
        }

        &-input {
            font-size: 24rpx;
            text-align: right;
            line-height: 32rpx;
            color: $uni-text-color;
            &-text {
                color: $uni-text-color-grey;
            }
        }
    }

    .btn {
        border-radius: 40rpx;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 24rpx;
        text-align: center;
        color: #fff;
        background: linear-gradient(173.01deg, #ff3c29 0%, #ff6f29 94.38%);
    }
}
</style>
