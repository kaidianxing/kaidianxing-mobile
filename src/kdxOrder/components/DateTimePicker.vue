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
    <view>
        <text v-if="dateTime" class="date" @click="toggle">{{dateTime}}</text>
        <text v-else class="placeholder" @click="toggle">{{`请选择${title}`}}</text>
        <pick-mask @mask-close="close" v-if="showmodal">
            <view class="inner flex-column">
                <div class="title-box">
                    <view class="title">{{ `选择${title}` }}</view>
                    <view class="picker-close" @click="close">
                        <img
                            class="close-img"
                            :src="$utils.staticMediaUrl('verify/close.png')"
                            alt="" />
                    </view>
                </div>
                <div class="picker-wrap">
                    <scroll-view scroll-y class="date-list picker-list" @scrolltolower="scrolltolower">
                        <view :class="['date-item', date.timestemp === item.timestemp ? 'selected' : '']" v-for="(item, index) in dateList" :key="index" @click="selectDate(item)">
                            {{ `${item.date}(${item.text})` }}
                        </view>
                    </scroll-view>
                    <scroll-view scroll-y class="time-list picker-list">
                        <view class="time-item" v-for="(item, index) in timeList" :key="index" @click="selectTime(item)">
                            <view>{{ item }}</view>
                            <i class="icon-m-yes iconfont-m-" v-if="`${date.timestemp} ${item}` === dateTime"></i>
                        </view>
                    </scroll-view>
                </div>
            </view>
        </pick-mask>
    </view>
</template>

<script>
import { mapState } from 'vuex'
import PickMask from "@/components/picker/PickMask";
export default {
    props: {
        title: {
            type: String,
            default: "自提时间"
        },
        deliveryTime: {
            type: String,
            default: ""
        },
        spanDetail: {
            type: Array,
            default: () => []
        },
        spanDetailNow: {
            type: Array,
            default: () => []
        },
    },
    components: {
        PickMask
    },
    data() {
        return {
            showmodal: false,
            date: {
                timestemp: ""
            },
            time: "",
            dateTime: "",
            dateList: [],
            timeList: [],
            page: {
                pagesize: 7,
                page: 1
            },
        };
    },
    computed: {
        ...mapState(['areaBottom']),
        paddingBottom(){
            return this.areaBottom + 'px'
        },
    },
    watch: {
        date(val) {
            console.log(val.timestemp, this.spanDetail)
            console.log(this.$utils.formatDateTime(new Date(), "yyyy-MM-dd"), this.spanDetailNow)
            if(val.timestemp === this.$utils.formatDateTime(new Date(), "yyyy-MM-dd")) {
                this.timeList = this.spanDetailNow
            }else {
                this.timeList = this.spanDetail
            }
        }
    },
    methods: {
        toggle() {
            this.showmodal = !this.showmodal;
            this.page.page = 1;
            this.dateList = [];
            this.dateTime = this.deliveryTime;
            this.getDate().then(() => {
                // 当天没有可选时间不显示当天
                if(!this.spanDetailNow.length) {
                    this.dateList.shift();
                }
                if(this.dateList.length) {
                    this.date = this.dateList[0]
                }
            })
        },
        close() {
            this.showmodal = !this.showmodal;
            this.$emit("handleTimeOk", this.dateTime);
        },
        selectDate(date) {
            this.date = date;
        },
        selectTime(time) {
            this.time = time;
            this.dateTime = `${this.date.timestemp} ${this.time}`
        },
        scrolltolower() {
            this.page.page += 1;
            this.getDate()
        },
        getDate() {
            return new Promise((resolve) => {
                this.$api.orderApi.getDate({
                    ...this.page
                }).then((res) => {
                    if(res.error === 0) {
                        this.dateList = this.dateList.concat(res.date);
                        resolve()
                    }
                })
            })
        }
    },
};
</script>
<style lang='scss' scoped>

.inner {
    height: px2rpx(300);
    background: #fff;
    border-radius: 20rpx 20rpx 0 0;
    // padding: 0 0 28rpx;
    justify-content: space-between;
    box-sizing: border-box;
    .content-box {
        flex: 1;
        height: 348rpx;
        box-sizing: border-box;
    }
    .title-box {
        position: relative;
        .title {
            padding: 24rpx 0 32rpx;
            text-align: center;
            color: $uni-text-color;
            font-size: 32rpx;
            font-weight: bold;
            line-height: 44rpx;
        }

        .picker-close {
            position: absolute;
            top: px2rpx(12);
            right: px2rpx(12);
            width: px2rpx(24);
            height: px2rpx(24);
            .close-img {
                width: px2rpx(24);
                height: px2rpx(24);
            }
        }
    }
    .item {
        margin: 0 px2rpx(12);
        width: calc(100% - 48rpx);
        margin-top: 12rpx;
        margin-bottom: 24rpx;
    }
    .picker-wrap {
        display: flex;
        flex-wrap: nowrap;
        height: px2rpx(250);
    }
    .picker-list {
        height: px2rpx(250);
        overflow-y: scroll;
        /deep/ .uni-scroll-view {
            &::-webkit-scrollbar {
                height: 0;
                width: 0;
            }
        }
    }
    .date-list {
        width: px2rpx(126);
        background: #F5F5F5;
        .date-item {
            line-height: px2rpx(44);
            text-align: center;
            height: px2rpx(44);
            color: $color-w3;
            &.selected {
                background: #fff;
                color: #212121;
            }
        }
    }
    .time-list {
        flex: 1;
        .time-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #212121;
            height: px2rpx(44);
            line-height: px2rpx(44);
            padding: 0 px2rpx(15) 0 px2rpx(24);
            &.selected {
                color: $uni-color-primary;
            }
            .icon-m-yes {
                font-size: px2rpx(24);
                line-height: px2rpx(20);
                text-align: center;
                border-radius: 50%;
                color: $uni-color-primary;
            }
        }
    }
}
</style>
