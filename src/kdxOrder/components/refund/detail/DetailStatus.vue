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
    <view class="flex align-center status">
        <div class="status-icon-box theme-primary-bgcolor">
            <i class="iconfont-m- icon-status" :class="statusIcon" />
        </div>
        <view class="flex-column flex-between">
            <view class="status-title">{{ statusText.title }}</view>
            <text class="status-text line-hide flex" v-if="status === 1&&countTime&&countTime.length">请 <text v-if="timeout.timeout_cancel_refund !=0 && timeout.status == 1"> 在<text class="theme-primary-color">
                <text class="theme-primary-color" v-if="countTime[0]>0">{{countTime[0]}}天</text>
                <text class="theme-primary-color" v-if="countTime[1]>0">{{countTime[1]}}小时</text>
                <text class="theme-primary-color">{{countTime[2]}}分</text>
                <text class="theme-primary-color">{{countTime[3]}}秒</text></text>内</text>发货并填写物流信息</text>
            <view class="status-text line-hide" v-else>{{ statusText.label }}</view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        status: Number,
        reason: String,
        refundType: [String, Number],
        timeout: Object,
        countTime: [Array,Boolean]
    },
    computed: {
        statusIcon() {
            if (this.status === 10 || this.status === 11) {
                return 'icon-m-shenhetongguo2'
            } else if (this.status === -1) {
                return 'icon-m-shenhebutongguo2'
            } else if (this.refundType === 3 && this.status === 3) {
                return 'icon-m-daishouhuo2'
            } else {
                return 'icon-m-shenhezhong2'
            }
        },
        statusText() {
            let textObj = {
                title: '',
                label: '',
            }

            if (this.status === -1) {
                textObj = {
                    title: '商家已拒绝',
                    label: '拒绝理由:' + this.reason,
                }
            }

            if (this.status === 0) {
                textObj = {
                    title: '发起申请',
                    label: '等待商家处理',
                }
            }

            if (this.status === 1) {
                textObj = {
                    title: '商家通过审核',
                    label: '请发货并填写物流信息',
                }
            }

            if (this.refundType === 3 && this.status === 2) {
                textObj = {
                    title: '已退货',
                    label: '等待商家确认收货',
                }
            }

            if (this.refundType === 2 && this.status === 3) {
                textObj = {
                    title: '已退货',
                    label: '等待商家确认收货',
                }
            }

            if (this.refundType === 3 && this.status === 3) {
                textObj = {
                    title: '卖家已发货',
                }
            }

            if (this.status == 10 && this.refundType === 1) {
                textObj = {
                    title: '退款成功',
                    label: '商家已同意退款，款项已原路返回',
                }
            }

            if (this.status == 11 && this.refundType === 1) {
                textObj = {
                    title: '退款成功',
                    label: '商家已同意退款',
                }
            }

            if (this.status == 10 || this.status == 11) {
                if (this.refundType === 2) {
                    textObj = {
                        title: '退货退款成功',
                        label: '售后完成',
                    }
                } else if (this.refundType === 3) {
                    textObj = {
                        title: '换货成功',
                        label: '售后完成',
                    }
                }
            }

            return textObj
        },
    },
    watch: {
        // timeout: {
        //     handler(value) {
        //         if(value.timeout_cancel_refund !=0 && value.status == 1) {
        //             this.handleCountTime()
        //         }
        //     },
        // },
    },
    created() {

    },
    data() {
        return {
            // countTime: [],
            // timer: null
        }
    },
    // beforeDestroy() {
    //     clearInterval(this.timer)
    // },
    methods: {
        // handleCountTime() {
        //     let endTime = new Date(Date.parse(this.timeout.timeout_cancel.replace(/-/g, "/"))).getTime();
        //     let time = parseInt(endTime / 1000);
        //     this.timer = setInterval(() => {
        //         this.countTime = this.$utils.countDown(time, false);
        //         if (!this.countTime && this.timeout.status == 1) {
        //             clearInterval(this.timer);
        //             this.$toast('该状态无法提交快递单号')
        //             setTimeout(()=> {
        //                 // this.$Router.replace({
        //                 //     path: '/kdxOrder/detail',
        //                 //     query: {
        //                 //         order_id: this.$Route.query?.order_id
        //                 //     }
        //                 // })
        //
        //                 this.$emit('goOrderDetail')
        //             },3000)
        //         }
        //     }, 1000)
        // }
    }
}
</script>

<style lang="scss" scoped>
.status {
    margin-bottom: 16rpx;
    box-sizing: border-box;
    border-radius: 12rpx;
    height: 200rpx;
    padding: 46rpx 24rpx;
    background-color: #fff;
    .flex {
        display: flex;
        flex-direction: row;
      
      
    }

    &-icon-box {
        margin-right: 24rpx;
        border-radius: 50%;
        width: 60rpx;
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        .icon-status {
            font-size: 44rpx;
            color: #fff;
        }
    }
   

    &-title {
        font-size: 48rpx;
        line-height: 68rpx;
        color: $uni-text-color;
    }

    &-text {
        width: 560rpx;
        font-size: 24rpx;
        line-height: 34rpx;
        color: #969696;
        white-space: normal;
        /deep/ text {
            font-size: 24rpx;
        }
    }
}
</style>
