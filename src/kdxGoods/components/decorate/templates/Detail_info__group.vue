/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="detail-info-group">
        <div
            class="group-pending"
            v-if="isStart"
        >
            <div class="activity-price">
                <div class="left">
                    <div
                        class="group"
                        :class="{
                         'medium': getPriceLen > 9,
                         'small':  getPriceLen > 11
                    }"
                    >
                        <span class="group-unit">¥</span>
                        <span class="group-num">{{ splitMoney(getPrice).integer }}</span>
                        <span class="group-append">{{ `${splitMoney(getPrice).decimal} ` }}</span>
                    </div>
                    <div class="group-discount">
                        <div class="group-tag">{{ getTag }}</div>
                        <div
                            class="group-original"
                            v-if="getOriginal >0"
                        >￥{{ formatMoney(getOriginal) }}
                        </div>
                    </div>
                    <i class="iconfont-m- icon-m-pintuan2-1 left-icon-fixed"/>
                </div>
                <div class="right">
                    <div class="group-surplus">活动剩余时间</div>
                    <div class="group-count">
                        <span class="text">{{ getHotDay }}天</span>
                        <span class="time">{{ countTime[1] }}</span>
                        <span class="colon">:</span>
                        <span class="time">{{ countTime[2] }}</span>
                        <span class="colon">:</span>
                        <span class="time">{{ countTime[3] }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="group-waiting flex"
            :class="{
             'column': getPriceLen>12
         }"
            v-else
            :style="'background-image: url('+ $utils.staticMediaUrl('activity/group/bg1.png') +')'"
        >
            <div class="group-notice">
                <i class="iconfont-m- icon-m-pintuan2-1 group-notice-icon"></i>
                <span class="group-notice-text">拼团预告</span>
            </div>
            <div class="group-waiting-box">
                <span class="group-waiting-time">
                    <span>距活动开始：</span>
                    <span class="group-waiting-font">{{ getHotDay }}天</span>
                    <span class="group-waiting-font group-waiting-timebox">{{ getStartTime }}</span>
                </span>
                <span class="group-waiting-price">拼团价¥{{ getPrice }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        activityData: {
            type: Object,
            default: () => {
            }
        }
    },
    data() {
        return {
            countTime: []
        }
    },
    computed: {
        hasOption() {
            return this.activityData.params.has_option == '1'
        },
        getPrice() {
            if (!this.hasOption) {
                return this.formatMoney(this.getInfo?.activity_price)
            } else {
                let {min_price} = this.getInfo?.price_range
                let price = `${this.formatMoney(min_price)}`
                return this.$utils.formartOptPrice(price)
            }
        },
        getTag() {
            let {rules} = this.activityData?.params?.activity?.groups || {}
            let usernum = typeof rules?.success_num === 'object' ? 0 : rules?.success_num
            return `${+usernum}人拼团价`
        },
        getPriceLen() {
            return this.getPrice?.length || 0
        },
        getStartTime() {
            if (this.countTime.length) {
                return `${this.countTime[1]}:${this.countTime[2]}:${this.countTime[3]}`
            }
            return ''
        },
        getHotDay() {
            return this.countTime?.[0] || 0
        },
        isStart() {
            return this.activityData?.params?.activityName == 'groups'
        },
        getInfo() {
            return this.isStart ? this.activityData?.params?.activity?.groups : this.activityData?.params?.preheat_activity;
        },
        getOriginal() {
            return this.activityData?.params?.delPrice
        }

    },
    mounted() {
        this.cutdownTime()
    },
    methods: {
        cutdownTime() {
            let {start_time, end_time} = this.getInfo;
            let endTime = this.isStart ? end_time : start_time;
            let formatTime = new Date(Date.parse(endTime?.replace(/-/g, "/"))).getTime()

            if ((formatTime - Date.now() > 0)) {
                let time = formatTime / 1000;
                this.startCount(time)
            }
        },
        startCount(time) {
            this.countTime = this.$utils.countDown(time, false);
            let timer = setInterval(() => {
                this.countTime = this.$utils.countDown(time, false);

                if (this.countTime === false) {
                    this.$emit('refresh', 'endStop');
                    clearInterval(timer)
                    this.cutdownTime()
                }
            }, 1000)

            this.$once('hook:beforeDestroy', () => {
                clearInterval(timer)
            })
        },
        formatMoney(money) {
            if (typeof money === 'number' || (typeof money === 'string' && money.trim() !== '')) {
                return parseFloat(money).toFixed(2)
            } else {
                return 0
            }
        },
        splitMoney(price) {
            if (price == '' || typeof price == 'object') {
                return price
            }

            let [integer, decimal] = parseFloat(price).toFixed(2).split('.')

            return {integer, decimal: '.' + decimal}
        }

    }
}
</script>

<style lang="scss" scoped>
.detail-info-group {
    background: #fff;

    .group-pending {
        position: relative;
        height: px2rpx(52);
        margin: 0 px2rpx(12);

        .activity-price {
            overflow: hidden;
            position: absolute;
            top: px2rpx(-8);
            display: flex;
            border-radius: px2rpx(6);
            width: 100%;
            height: px2rpx(60);
            color: #fff;
            overflow: hidden;
            box-shadow: 0px px2rpx(4) px2rpx(8) px2rpx(-2) rgba(255, 116, 20, 0.2);

            .left,
            .right {
                height: px2rpx(60);
            }

            .left {
                position: relative;
                flex: 1;
                display: flex;
                align-items: center;
                padding: px2rpx(14) 0;
                background: linear-gradient(
                        114.57deg,
                        #ff8a00 19.05%,
                        #ff4c14 87.67%
                );
                box-shadow: 0px px2rpx(4) px2rpx(8) px2rpx(-2) rgba(255, 116, 20, 0.2);

                .group {
                    color: #fff;

                    &.medium {
                        .group-unit {
                            font-size: px2rpx(14);
                        }

                        .group-num {
                            font-size: px2rpx(22);
                        }

                        .group-append {
                            font-size: px2rpx(14);
                        }
                    }

                    &.small {
                        .group-unit {
                            font-size: px2rpx(12);
                        }

                        .group-num {
                            font-size: px2rpx(18);
                        }

                        .group-append {
                            font-size: px2rpx(12);
                        }
                    }

                    &-unit {
                        display: inline-block;
                        margin-left: px2rpx(12);
                        font-size: px2rpx(16);
                    }

                    &-num {
                        display: inline-block;
                        font-size: px2rpx(28);
                        font-weight: bold;
                    }

                    &-append {
                        display: inline-block;
                        font-size: px2rpx(20);
                        font-weight: bold;
                    }

                    &-discount {
                        margin-left: px2rpx(8);
                    }

                    &-tag {
                        border-radius: px2rpx(2);
                        padding: px2rpx(1) px2rpx(2);
                        font-size: px2rpx(9);
                        font-weight: bold;
                        line-height: px2rpx(12);
                        text-align: center;
                        background: #ffffff;
                        color: #ff9900;
                    }

                    &-original {
                        font-size: px2rpx(12);
                        line-height: px2rpx(17);
                        color: #ffffff;
                        opacity: 0.8;
                        text-decoration: line-through;
                    }
                }

                .left-icon-fixed {
                    position: absolute;
                    right: 0;
                    top: px2rpx(18);
                    font-size: px2rpx(60);
                    opacity: 0.2;
                }
            }

            .right {
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex-shrink: 0;
                width: px2rpx(108);
                background: #fff;

                .group-surplus {
                    margin-bottom: px2rpx(6);
                    font-size: px2rpx(10);
                    text-align: center;
                    line-height: px2rpx(14);
                    color: #ff6f29;
                }

                .group-count {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: px2rpx(16);
                    color: #ff6f29;

                    .time {
                        width: px2rpx(16);
                        height: px2rpx(16);
                        line-height: px2rpx(16);
                        text-align: center;
                        background: #ff6f29;
                        color: #ffffff;
                        font-size: px2rpx(12);
                        border-radius: px2rpx(2);
                    }

                    .text {
                        margin-right: px2rpx(4);
                        font-size: px2rpx(10);
                    }

                    .colon {
                        margin: 0 px2rpx(2);
                    }
                }
            }
        }
    }

    .group-waiting {
        padding: px2rpx(12);
        align-items: center;
        justify-content: flex-start;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-size: px2rpx(12);
        color: #212121;

        &.column {
            flex-direction: column;
            align-items: flex-start;

            .group-waiting-box {
                margin-top: px2rpx(4);
            }
        }

        .group-notice {
            display: flex;
            align-items: center;
            margin-right: px2rpx(4);
            padding: px2rpx(1) px2rpx(2);
            border-radius: px2rpx(2);
            background: linear-gradient(
                    114.57deg,
                    #ff8a00 19.05%,
                    #ff4c14 87.67%
            );
            flex-shrink: 0;

            &-icon {
                display: block;
                font-size: px2rpx(10);
                color: #fff;
            }

            &-text {
                font-size: px2rpx(9);
                font-weight: bold;
                line-height: px2rpx(12);
                color: #fff;
            }
        }

        &-time,
        &-price {
            font-size: px2rpx(12);
            color: #ff3c29;
        }

        &-time {
            margin-right: px2rpx(12);
        }

        &-timebox {
            width: px2rpx(48);
        }

        &-font {
            font-family: PingFang SC;
            font-variant-numeric: tabular-nums;
            font-family: Helvetica Neue;
        }

        &-price {
            font-weight: bold;
            white-space: pre;
        }
    }
}
</style>
