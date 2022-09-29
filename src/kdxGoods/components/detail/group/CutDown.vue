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
    <div class="cut-down">
        <span
            class="day"
            :style="{ background: bg_color }"
        >{{countTime[0]
        }}</span>
        <span
            class="text"
            :style="{ color }"
        >天</span>
        <span
            class="time"
            :style="{ background: bg_color }"
        >{{
            countTime[1]
        }}</span>
        <span
            class="colon"
            :style="{ color }"
        >:</span>
        <span
            class="time"
            :style="{ background: bg_color }"
        >{{
            countTime[2]
        }}</span>
        <span
            class="colon"
            :style="{ color }"
        >:</span>
        <span
            class="time"
            :style="{ background: bg_color }"
        >{{
            countTime[3]
        }}</span>
    </div>
</template>

<script>
let timer;
export default {
    props: {
        end_time: {
            type: String,
        },
        bg_color: {
            type: String,
            default: '#FF3C29',
        },
        color: {
            type: String,
            default: "#FF3C29",
        },
    },
    data() {
        return {
            countTime: [],
        };
    },
    mounted() {
        clearInterval(timer);
        this.countTime = [];
        this.cutdownTime();
    },
    methods: {
        cutdownTime() {
            let endTime = this.end_time;
            let formatTime = new Date(
                Date.parse(endTime.replace(/-/g, "/"))
            ).getTime();

            if (formatTime - Date.now() > 0) {
                let time = formatTime / 1000;
                this.startCount(time);
            } else {
                this.countTime = ["00", "00", "00", "00"];
            }
        },
        startCount(time) {
            let countTime;
            countTime = this.$utils.countDown(time, false);
            this.countTime = countTime ? countTime : ["00", "00", "00", "00"];

            if (countTime) {
                timer = setInterval(() => {
                    countTime = this.$utils.countDown(time, false);

                    this.countTime = countTime
                        ? countTime
                        : ["00", "00", "00", "00"];
                    if (countTime == false) {
                        clearInterval(timer);
                        this.$emit("on-end");
                    }
                }, 1000);

                this.$once("hook:beforeDestroy", () => {
                    clearInterval(timer);
                });
            } else {
                this.$emit("on-end");
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.cut-down {
    display: flex;
    align-items: center;
    height: px2rpx(16);
    color: #fff;

    .day {
        padding: 0 px2rpx(2);
        min-width: px2rpx(20);
    }

    .day,
    .time {
        border-radius: px2rpx(3);
        height: px2rpx(20);
        font-size: px2rpx(14);
        text-align: center;
        line-height: px2rpx(20);
        color: #ffffff;
        background-color: #ff3c29;
    }

    .text {
        margin: 0 px2rpx(5);
        font-size: px2rpx(12);
        line-height: px2rpx(17);
        color: #ff3c29;
    }

    .time {
        width: px2rpx(20);
    }

    .colon {
        margin: 0 px2rpx(2);
        line-height: px2rpx(16);
        color: #ff3c29;
    }
}
</style>
