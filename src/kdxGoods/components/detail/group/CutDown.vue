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
