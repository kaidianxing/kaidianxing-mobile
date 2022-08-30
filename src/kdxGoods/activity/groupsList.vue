<template>
    <div>
        <div class="groups">
            <div class="groups-img-box">
                <img
                        :src="$utils.staticMediaUrl('activity/group/banner.png')"
                        class="groups-img"
                />
                <div class="count-down" v-if="type === 'activity'">
                    <div
                            class="groups-surplus"
                            v-if="isFinish"
                    >本场已结束</div>
                    <div
                            class="groups-surplus"
                            v-else-if="!isPreheat(activeInfo)"
                    >距本场结束</div>
                    <div
                            class="groups-surplus"
                            v-else-if="isPreheat(activeInfo)"
                    >距本场开始</div>
                    <div
                            class="groups-count"
                            v-if="countTime && !isFinish"
                    >
                        <span class="text">{{countTime[0]}}天</span>
                        <span class="time">{{countTime[1]}}</span>
                        <span class="colon">:</span>
                        <span class="time">{{countTime[2]}}</span>
                        <span class="colon">:</span>
                        <span class="time">{{countTime[3]}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="goods">
            <view
                    v-for="item in list"
                    :key="item.id"
                    class="goods-list"
            >
                <div v-if="type === 'goods'">
                    <Goods :item="item" type="groups" @on-click="clickGoods">
                        <template v-slot:countdown="{data}">
                            <div class="activity-time">
                                <span class="text">{{data.isPreheat?'距开始':'距结束'}}</span>
                                <span class="time">{{data.countTime[0]}}</span>
                                <span class="colon">天</span>
                                <span class="time">{{data.countTime[1]}}</span>
                                <span class="colon">:</span>
                                <span class="time">{{data.countTime[2]}}</span>
                                <span class="colon">:</span>
                                <span class="time">{{data.countTime[3]}}</span>
                            </div>
                        </template>
                    </Goods>
                </div>
                <div v-else>
                    <Goods :item="item" type="groups" @on-click="clickGoods"></Goods>
                </div>
            </view>
            <!--加载更多  -->
            <page-loading
                    v-if="list.length != count"
                    :loadingType="loadingType"
            ></page-loading>
            <block v-if="!loading && count <= 0">
                <!-- 缺省页 -->
                <view class='default-page flex-column'>
                    <view class="bg">
                        <image :src="$utils.staticMediaUrl('default/search.png')"></image>
                    </view>
                    <view class='default-text'>没找到相关宝贝</view>
                </view>
            </block>
        </div>
    </div>
</template>

<script>
    import Goods from "./components/GoodsGroup";

    export default {
        components: {
            Goods,
        },
        data() {
            return {
                type: 'activity', // activity 一个活动 // goods // 以商品选择的活动-多个商品多个活动
                goodsID: '',
                list: [],
                page: 1,
                loading: false,
                count: 0,
                reqesting: false,
                activityId: '',
                countTime: ["0", "23", "59", "59"],
                activeInfo: {},
                isFinish: false
            };
        },
        computed: {
            loadingType() {
                let loadingType = 0;
                if (this.loading) {
                    loadingType = 1
                } else if (this.list.length == this.count && this.count > 0 && this.loading == false) {
                    loadingType = 2
                }
                return loadingType
            }
        },
        onLoad() {
            if (this.$Route.query.type === 'activity') {
                this.activityId = this.$Route.query.id;
            } else if (this.$Route.query.type === 'goods') {
                this.goodsID = this.$Route.query.goodsID;
            }
            this.type = this.$Route.query.type
        },
        onShow() {
            this.reset()
        },
        methods: {
            getList() {
                if (!this.reqesting) {
                    this.reqesting = true;
                    let obj = {
                        page: this.page,
                        get_activity: 1,
                        activity_type: 'groups'
                    };
                    if (this.type === 'activity') {
                        obj.activity_id=this.activityId
                    } else {
                        obj.id = this.goodsID
                    }
                    this.loading = true;

                    this.$api.goodApi.goodList(obj).then(res => {
                        if (res.error == 0) {
                            if (res.list.length > 0) {
                                this.type === 'goods'&&res.list.forEach(item => {
                                    item.countTime = ["0","23","59","59"];
                                    item.groupsData = item?.activities?.groups || item?.activities?.preheat_activity
                                    item.isPreheat = this.isPreheat(item.groupsData)
                                    this.cutdownTime(item.groupsData, item)
                                });
                                this.list = this.list.concat(res.list);
                            }
                            this.page = this.page + 1;
                            this.loading = false;
                            this.count = res.total;
                            this.graceLazyload.load(0, this);
                            this.reqesting = false
                        }
                    }).catch(res => {
                        this.reqesting = false
                    }).finally(rej => {
                        setTimeout(() => { //解决loading关不掉的bug
                            uni.hideLoading()
                        }, 100)
                    })
                }
            },
            getActivity() {
                // uni.showLoading()
                this.$api.goodApi.getActivity({ activity_id: this.activityId }).then(res => {
                    if (res.error == 0) {
                        this.activeInfo = res;
                        this.isFinish = (res.status < 0);
                        if (!this.isFinish) {
                            this.getList()
                            this.cutdownTime(this.activeInfo, this)
                        } else {
                            this.$Router.replace('/kdxGoods/activity/expire')
                        }
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    uni.hideLoading()
                })
            },
            isPreheat() {
                let { is_preheat, start_time } = this.activeInfo;
                if (!start_time) {
                    return false
                }
                let begin_time = new Date(Date.parse(start_time.replace(/-/g, "/"))).getTime()
                return is_preheat == '1' && begin_time > Date.now()
            },
            reset() {
                this.list = [];
                this.page = 1;
                this.type === 'activity'&&this.getActivity();
                this.type === 'goods'&&this.getList();
                setTimeout(() => {
                    uni.stopPullDownRefresh();
                }, 1000);
            },
            cutdownTime(activeInfo, item){
                let {start_time,end_time} = activeInfo;
                let endTime = this.isPreheat(activeInfo)?start_time: end_time;
                let formatTime = new Date(Date.parse(endTime.replace(/-/g, "/"))).getTime()

                if((formatTime-Date.now()>0)) {
                    let time = formatTime/1000;
                    this.startCount(time, item)
                }

            },
            startCount(time, item){
                item.countTime = this.$utils.countDown(time, false);
                let timer = setInterval(()=>{
                    item.countTime = this.$utils.countDown(time, false);

                    if(item.countTime == false) {
                        clearInterval(timer)
                        this.reset()
                    }

                },1000)

                this.$once('hook:beforeDestroy',()=> {
                    clearInterval(timer)
                })
            },
            clickGoods(item) {
                this.$Router.auto({
                    path: '/kdxGoods/detail/index',
                    query: {
                        goods_id: item.id,
                    },
                })
            }
        },
        onReachBottom() {
            if (this.list.length == this.count && this.page > 1) return;
            this.getList()
        },
        onPageScroll(e) {
            this.graceLazyload.load(e.scrollTop, this);
        },
    };
</script>

<style lang="scss" scoped>
    .groups {
        position: relative;
        height: px2rpx(193);
        .groups-img {
            height: px2rpx(173);
            width: px2rpx(375);
        }

        .count-down {
            position: absolute;
            left: px2rpx(12);
            bottom: px2rpx(0);
            height: px2rpx(40);
            width: px2rpx(351);
            background: #ffffff;
            border-radius: 6px;
            display: flex;
            justify-content: center;
            align-items: center;
            .groups-surplus {
                font-size: px2rpx(12);
                line-height: px2rpx(17);
                color: #212121;
            }

            .groups-count {
                display: flex;
                align-items: center;
                height: px2rpx(16);
                color: #fff;

                .time {
                    width: px2rpx(16);
                    height: px2rpx(16);
                    line-height: px2rpx(16);
                    text-align: center;
                    background-color: #ff6f29;
                    color: #ffffff;
                    font-size: px2rpx(12);
                    border-radius: px2rpx(2);
                }

                .text {
                    margin-left: px2rpx(8);
                    margin-right: px2rpx(6);
                    font-size: px2rpx(12);
                    color: #212121;
                }

                .colon {
                    margin: 0 px2rpx(2);
                    line-height: px2rpx(16);
                    color: #ff6f29;
                }
            }
        }
    }

    .goods {
        margin-top: px2rpx(8);
        padding: 0 px2rpx(12);

        .activity-time {
            width: fit-content;
            margin-top: px2rpx(4);
            padding: 0 px2rpx(4);
            line-height: px2rpx(14);
            font-size: px2rpx(10);
            border: 1px solid #ff6f29;
            border-radius: px2rpx(2);
            >span {
                color: #ff6f29;
            }
        }

        .goods-list {
            margin-bottom: px2rpx(8);
        }
    }
</style>
