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
    <view class="express">
        <refund-cell title="物流信息"></refund-cell>
        <view
            class="flex align-center express-info"
            v-for="list in getList"
            :key="list.key"
            @click="goExpress(list.key)"
        >
            <view class="flex align-center user-type" v-if="refund.refund_type==3">
                <view class="circle member" :class="list.key">{{list.title}}</view>
            </view>
            <view class="flex1 flex align-center express-desc">
                <view class="flex1">
                    <view class="refund-cell">
                        <text class="refund-cell-title">快递公司：</text>
                        <text class="refund-cell-label">{{refund[list.key+ '_express_name']}}</text>
                    </view>
                    <view class="refund-cell">
                        <text class="refund-cell-title">快递单号：</text>
                        <text class="refund-cell-label">{{refund[list.key+ '_express_sn']}}</text>
                    </view>
                </view>
                <text class="iconfont-m- icon-m-arrowright more-btn"></text>
            </view>
        </view>
    </view>
</template>


<script>
import RefundCell from '../RefundCell'
export default {
    props: {
        status: Number,
        refund: {
            type: Object,
            default: () => {}
        }
    },
    components: { RefundCell },
    computed: {
        getList() {
            let list = [{ title: '买', key: 'member' }]


            // 判断商家是否直接发货
            if (
                this.refund.refund_type === 3 &&
                this.refund.seller_express_sn
            ) {
                if (!this.refund.member_express_sn) {
                    list = [{ title: '卖', key: 'seller' }]
                } else {
                    list = list.concat([{ title: '卖', key: 'seller' }])
                }
            }

            return list
        }
    },
    methods: {
        goExpress(code) {
            let data = {}
            let keys = [
                'express_sn',
                'express_encoding',
                'express_code',
                'express_name'
            ]

            keys.forEach(key => {
                data[key] = this.refund[code + '_' + key]
            })

            if (code == 'member') {
                data.type = '1'
            } else {
                data.type = '2'
            }
            this.$emit('skip', data)
        }
    }
}
</script>

<style lang="scss" scoped>
.express {
    overflow: hidden;
    margin-bottom: 16rpx;
    border-radius: 12rpx;
    background-color: #fff;

    &-info {
        box-sizing: border-box;
        padding-left: 24rpx;

        .more-btn {
            padding-right: 24rpx;
            font-size: 32rpx;
            color: $uni-text-color-grey;
        }

        .user-type {
            padding: 16rpx 0;
            justify-content: center;
            height: 150rpx;
            width: 120rpx;

            .circle {
                border-radius: 50%;
                width: 48rpx;
                height: 48rpx;
                font-size: 24rpx;
                line-height: 48rpx;
                text-align: center;
                color: #fff;

                &.member {
                    background-color: #09c15f;
                }

                &.seller {
                    background-color: #ff6f29;
                }
            }
        }

        &:last-child {
            .express-desc {
                border-bottom: 0;
            }
        }

        .express-desc {
            height: 150rpx;
            box-sizing: border-box;
            padding: 32rpx 0;
            border-bottom: 2rpx solid $uni-border-color;

            .refund-cell {
                margin-top: 16rpx;

                &-title {
                    width: 120rpx;
                    font-size: 24rpx;
                    line-height: 34rpx;
                    color: $uni-text-color-grey;
                }

                &-label {
                    width: 120rpx;
                    font-size: 24rpx;
                    line-height: 34rpx;
                    color: $uni-text-color;
                }

                &-money {
                    color: $uni-color-primary;
                }
            }

            .refund-cell:first-child {
                margin-top: 0;
            }
        }
    }
}
</style>