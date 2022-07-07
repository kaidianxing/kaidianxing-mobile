<template>
    <div
        class="detail_sale__group"
        v-if="filterList.length"
    >
        <div
            class="title-box van-hairline--bottom"
            @click="clickItem"
        >
            <span class="title">以下用户正在拼团，可直接参与拼团</span>
            <div
                class="touch-content"
                v-if="lists.length>2"
            >
                <i class="iconfont-m- icon-m-right"></i>
            </div>
        </div>
        <ul class="groups van-hairline--bottom">
            <li
                class="group"
                v-for="(group,index) in filterList"
                :key="index"
            >
                <div class="group-left">
                    <img
                        class="group-avatar"
                        :src="$utils.mediaUrl(group.avatar)||$utils.staticMediaUrl('decorate/avatar_mobile.png')"
                    />
                    <div class="group-leader">
                        <div class="group-leader-name line-hide">{{group.nickname}}</div>
                        <div
                            class="group-leader-tag"
                            v-if="isLadderGroup"
                        >{{group.success_num}}人团</div>
                    </div>
                </div>
                <div class="group-right">
                    <div class="group-info">
                        <div class="group-info-desc">还差 <span class="group-info-user">{{getSurplus(group)}}人</span> 成团</div>
                        <div class="group-time-box">
                            <span class="group-time-desc">剩余</span>
                            <span class="group-time-num">{{group.countTime}}</span>
                        </div>
                    </div>
                    <div
                        class="group-btn"
                        @click="clickJoin(group)"
                    >去参团</div>
                </div>
            </li>
        </ul>
        <div class="group-tip" v-if="isLadderGroup">拼团玩法：{{getLadderPrice}}先选择参团人数，支付开团邀请好友参团，人数不足将自动退款</div>
        <div class="group-tip" v-else>拼团玩法：支持开团邀请好友参团，人数不足自动退款</div>
    </div>
</template>

<script>

export default {
    props: {
        info: {
            type: Object,
            default: () => { }
        },
        team: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            lists: []
        }
    },
    computed: {
        filterList() {
            return this.lists.slice(0, 2)
        },
        isLadderGroup() {
            return this.info.inner_type == '1'
        },
        // 阶梯价玩法介绍
        getLadderPrice(){
            let {inner_type,rules: {success_num},every_ladder_min_price} = this.info
            let str='';
            if(inner_type !='1'){
                // 小程序兼容代码
                return str;
            }
            Object.keys(success_num).forEach(num => {
                str+= `${success_num[num]}人团¥${every_ladder_min_price[num]}，`
            })
            str = str.slice(0,-1)
            return str
        },
    },
    watch: {
        team: {
            handler() {
                this.lists = this.team || [];
                this.lists.forEach(list => this.getTime(list))
            },
            immediate: true
        }
    },
    mounted() {
        // #ifdef MP-WEIXIN
        this.$store.dispatch('setting/getWxappIds') // 更新系统小程序订阅模板id
        // #endif
    },
    methods: {
        clickItem() {
            if(this.lists.length > 2) {
                this.$emit('click-all')
            }
        },
        async clickJoin(item) {
            if (item.is_join == '1') {
                // 团长拼团
                this.$emit('click-detail', item)
            } else {
                // #ifdef MP-WEIXIN
                let type_code = ['groups_success', 'groups_defeated'];
                this.$utils.sendWxappMsg(type_code)
                // #endif
                let opt = {
                    btn: 'buy',
                    activeName: 'groups',
                    is_join: '1',
                    team_id: item.id
                }

                if (this.info.inner_type == '1') {
                    opt.ladder = item.ladder
                }
                this.$emit('special-click', opt)
            }
        },
        getSurplus(group) {
            let { count = 0, success_num = 0 } = group;
            return +success_num - +count;
        },
        getTime(item) {
            let endTime = new Date(Date.parse(item.end_time.replace(/-/g, "/"))).getTime();
            let time = parseInt(endTime / 1000);

            const dealTiem = () => {
                let countTime = this.$utils.countDown(time, false)
                if (countTime !== false) {
                    let [day, hour, minute, second] = countTime;
                    this.$set(item, 'countTime', `${day}天${hour}:${minute}:${second}`)
                } else {
                    this.lists = this.lists.filter(list => list !== item)
                    clearInterval(timer)
                }
            }
            dealTiem()

            let timer = setInterval(() => {
                dealTiem()
            }, 1000)

            this.$once('hook:beforeDestroy', () => {
                clearInterval(timer)
            })
        },
    },
}
</script>


<style lang="scss" scoped>
.detail_sale__group {
    padding-left: px2rpx(12);
    margin-bottom: px2rpx(8);
    background: #fff;
    .title-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: px2rpx(12);
        height: px2rpx(40);

        &.van-hairline--bottom:after {
            border-bottom-color: $uni-border-color;
            border-style: solid;
        }

        .title {
            font-size: px2rpx(14);
        }

        .touch-content {
            height: px2rpx(40);
            line-height: px2rpx(40);
            padding-left: px2rpx(20);
        }

        .icon-m-right {
            font-size: px2rpx(16);
            color: #969696;
        }
    }

    .groups {
        &.van-hairline--bottom:after {
            border-bottom-color: $uni-border-color;
            border-style: solid;
        }

        .group {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: px2rpx(63);

            &-left,
            &-right {
                display: flex;
                align-items: center;
            }

            &-right {
                padding-right: px2rpx(12);
            }

            &-avatar {
                margin-right: px2rpx(8);
                border-radius: 50%;
                height: px2rpx(38);
                width: px2rpx(38);
            }

            &-leader {
                width: px2rpx(120);

                &-name {
                    font-size: px2rpx(12);
                    line-height: px2rpx(17);
                }

                &-tag {
                    display: inline-block;
                    border-radius: px2rpx(2);
                    border: px2rpx(1) solid #ffdaa3;
                    padding: px2rpx(1) px2rpx(4);
                    font-size: px2rpx(10);
                    line-height: px2rpx(14);
                    color: #ff6f29;
                    background: #fff9f0;
                }
            }

            &-info {
                margin-right: px2rpx(8);

                &-desc {
                    font-size: 12px;
                    line-height: 17px;
                    text-align: right;
                    color: #212121;
                }

                &-user {
                    margin: 0 px2rpx(4);
                    color: #ff3c29;
                }
            }

            &-time {
                &-desc,
                &-num {
                    font-size: px2rpx(11);
                    line-height: px2rpx(15);
                    color: #969696;
                }

                &-num {
                    font-family: PingFang SC;
                    font-variant-numeric: tabular-nums;
                    font-family: Helvetica Neue;
                    text-align: right;
                    display: inline-block;
                }

                &-desc {
                    margin-right: px2rpx(2);
                }
            }

            &-btn {
                width: px2rpx(68);
                height: px2rpx(27);
                font-size: px2rpx(12);
                font-weight: bold;
                line-height: px2rpx(27);
                text-align: center;
                color: #fff;
                background: linear-gradient(
                    114.57deg,
                    #ff8a00 19.05%,
                    #ff4c14 87.67%
                );
                border-radius: 24px;
            }
        }
    }

    .group-tip {
        padding: px2rpx(12) px2rpx(12) px2rpx(12) 0;
        font-size: px2rpx(12);
        line-height: px2rpx(17);
        color: #212121;
    }
}
</style>
