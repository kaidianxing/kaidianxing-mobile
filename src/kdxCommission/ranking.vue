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
        <view class="rank">
            <view class="content" v-if="!loading && open">
                <img :src="$utils.staticMediaUrl('commission/bg.png')" alt="" class="bg-bg" mode="aspectFill"/>
                <scroll-view class="scroll-view" :scroll-y="true">
                    <div class="info">
                        <div class="info-avatar" :style="{'background-image': `url(${$utils.staticMediaUrl('decorate/avatar_mobile.png')})`}">
                            <image :src="$utils.mediaUrl(myData.avatar)"></image>
                        </div>
                        <div class="info-info">
                            <div v-if="myData.top != -1">我的排名第<span>{{myData.top}}</span>名</div>
                            <div v-if="myData.top == -1">我的排名 未上榜</div>
                            <div>{{params.count_commission}}<span>￥{{myData.commission_total}}</span></div>
                        </div>
                    </div>
                    <div class="ranking-list">
                        <div class="top3">
                            <div class="top3-inner second">
                                <div class="avatar" :style="{'background-image': `url(${$utils.staticMediaUrl('decorate/avatar_mobile.png')})`}">
                                    <img :src="$utils.staticMediaUrl('member/bg-2-crown.png')" alt="" class="bg-crown" mode="widthFix"/>
                                    <img :src="$utils.staticMediaUrl('member/bg-shadow2.png')" alt="" class="bg-shadow" mode="widthFix"/>
                                    <img class="bg-avatar" :src="$utils.mediaUrl(top.top2.avatar)" alt=""/>
                                </div>
                                <div class="top3-inner-info">
                                    <img :src="$utils.staticMediaUrl('member/bg-2.png')" alt="" mode="widthFix"/>
                                    <div class="c">
                                        <block v-if="!top.top2.nickname && !top.top2.commission_total">
                                            <div class="name">-</div>
                                        </block>
                                        <block v-else>
                                            <div class="name">{{top.top2.nickname}}</div>
                                            <div class="num">￥{{top.top2.commission_total}}</div>
                                        </block>
                                    </div>
                                </div>
                            </div>
                            <div class="top3-inner first">
                                <div class="avatar" :style="{'background-image': `url(${$utils.staticMediaUrl('decorate/avatar_mobile.png')})`}">
                                    <img :src="$utils.staticMediaUrl('member/bg-1-crown.png')" alt="" class="bg-crown" mode="widthFix"/>
                                    <img :src="$utils.staticMediaUrl('member/bg-shadow1.png')" alt="" class="bg-shadow" mode="widthFix"/>
                                    <img class="bg-avatar" :src="$utils.mediaUrl(top.top1.avatar)" alt=""/>
                                </div>
                                <div class="top3-inner-info">
                                    <img :src="$utils.staticMediaUrl('member/bg-1.png')" alt="" mode="widthFix"/>
                                    <div class="c">
                                        <block v-if="!top.top1.nickname && !top.top1.commission_total">
                                            <div class="name">-</div>
                                        </block>
                                        <block v-else>
                                            <div class="name">{{top.top1.nickname}}</div>
                                            <div class="num">￥{{top.top1.commission_total}}</div>
                                        </block>
                                    </div>
                                </div>
                            </div>
                            <div class="top3-inner third">
                                <div class="avatar" :style="{'background-image': `url(${$utils.staticMediaUrl('decorate/avatar_mobile.png')})`}">
                                    <img :src="$utils.staticMediaUrl('member/bg-3-crown.png')" alt="" class="bg-crown" mode="widthFix"/>
                                    <img :src="$utils.staticMediaUrl('member/bg-shadow2.png')" alt="" class="bg-shadow" mode="widthFix"/>
                                    <img class="bg-avatar" :src="$utils.mediaUrl(top.top3.avatar)" alt=""/>
                                </div>
                                <div class="top3-inner-info">
                                    <img :src="$utils.staticMediaUrl('member/bg-3.png')" alt="" mode="widthFix"/>
                                    <div class="c">
                                        <block v-if="!top.top3.nickname && !top.top3.commission_total">
                                            <div class="name">-</div>
                                        </block>
                                        <block v-else>
                                            <div class="name">{{top.top3.nickname}}</div>
                                            <div class="num">￥{{top.top3.commission_total}}</div>
                                        </block>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="other">
                            <ranking-list :list="list"></ranking-list>
                        </div>
                    </div>
                </scroll-view>
            </view>
            <block v-if="!loading && !open">
                <!-- 缺省页 -->
                <view class='default-page flex-column'>
                    <view class="bg">
                        <image :src="$utils.staticMediaUrl('default/rank.png')"></image>
                    </view>
                    <view class='default-text'>商家暂未开启</view>
                </view>
            </block>
        </view>
    </page-box>
</template>

<script>
    import rankingList from './components/RankingList'
    import PageMixin from '@/common/PageMixin.js'
    export default {
        mixins: [PageMixin],
        name: "rank",
        components: {
            rankingList
        },
        props: {},
        data() {
            return {
                myData: {
                    commission_pay: 0,
                    commission_total: 0,
                    show_total: 10,
                    top: 1,
                },
                top: {
                    top1: {},
                    top2: {},
                    top3: {},
                },
                list: [],
                open: 1,
                loading: false,
            }
        },
        computed: {
            params() {
                return this.$store.state.commissionSet.commissionSetting
            }
        },
        mounted() {
            uni.setNavigationBarTitle({
                title: this.params?.commission_rank
            })
            this.getList()
        },
        methods: {
            getList() {
                // uni.showLoading({title:'加载中'})
                this.loading = true
                this.$api.commissionApi.getRank({}).then(res => {
                    if (res.open === 0) {
                        this.open = 0
                        return
                    }
                    if (res.list.length > 3) {
                        this.top = {
                            top1: res.list[0],
                            top2: res.list[1],
                            top3: res.list[2]
                        };
                        this.list = res.list.slice(3)
                    } else {
                        this.top = {
                            top1: res.list[0] || {},
                            top2: res.list[1] || {},
                            top3: res.list[2] || {}
                        };
                        for (let i = 4; i < 11; i ++) {
                            this.list.push({
                                nickname: '虚位以待',
                                avatar: '',
                                commission_pay: '',
                                top: i
                            })
                        }
                    }
                    this.myData = res.my;
                }).finally(rej => {
                    this.loading = false
                    uni.hideLoading()
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .rank {
        .content {
            height: 100vh;
            position: relative;
            img.bg-bg {
                position: absolute;
                width: 100%;
                height: 100%;
            }
            .scroll-view {
                height: 100%;
                position: relative;
                .info {
                    position: relative;
                    padding-top: 32rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .info-avatar {
                        width: 96rpx;
                        height: 96rpx;
                        margin-right: 20rpx;
                        border-radius: 50%;
                        background-color: #f5f5f5;
                        background-repeat: no-repeat;
                        background-size: contain;
                        image {
                            width: 96rpx;
                            height: 96rpx;
                            border-radius: 50%;
                        }
                    }
                    .info-info {
                        color: #fff;
                        div:nth-child(1) {
                            font-weight: bold;
                            font-size: 28rpx;
                            line-height: 40rpx;
                        }
                        div:nth-child(2) {
                            font-size: 24rpx;
                            line-height: 34rpx;
                        }
                        span {
                            color: #efbf16;
                        }
                    }
                }
                .top3 {
                    margin-top: 48rpx;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    .top3-inner {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        .avatar {
                            position: relative;
                            border: 4rpx solid #fff;
                            box-sizing: border-box;
                            background-color: #666;
                            border-radius: 50%;
                            z-index: 1;
                            background-repeat: no-repeat;
                            background-size: contain;
                            .bg-crown {
                                position: absolute;
                                z-index: 2;
                            }
                            .bg-shadow {
                                position: absolute;
                                bottom: -32rpx;
                                left: 50%;
                                transform: translateX(-50%);
                                z-index: 2;
                            }
                            img.bg-avatar {
                                width: 100%;
                                height: 100%;
                                border-radius: 50%;
                            }
                        }
                        .top3-inner-info {
                            position: relative;
                            display: flex;
                            width: 100%;
                            .c {
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                margin-top: 16rpx;
                                text-align: center;
                                .name {
                                    font-weight: bold;
                                    font-size: 28rpx;
                                    line-height: 40rpx;
                                    color: #565656;
                                }
                                .num {
                                    color: #FF3C29;
                                }
                            }
                            img {
                                width: 100%;
                            }
                        }
                        &.first {
                            width: 222rpx;
                            .avatar {
                                margin-bottom: -12rpx;
                                width: 168rpx;
                                height: 168rpx;
                                img.bg-crown {
                                    width: 122rpx;
                                    height: 126rpx;
                                    right: -24rpx;
                                    top: -32rpx;
                                }
                                img.bg-shadow {
                                    width: 106rpx;
                                    height: 12rpx;
                                }
                            }
                            .top3-inner-info {
                                .c {
                                    .name {
                                        margin-bottom: 8rpx;
                                    }
                                }
                                img {
                                    width: 100%;
                                }
                            }
                        }
                        &.second {
                            width: 200rpx;
                            .avatar {
                                margin-bottom: 8rpx;
                                margin-right: -20rpx;
                                width: 132rpx;
                                height: 132rpx;
                                img.bg-crown {
                                    width: 92rpx;
                                    height: 94rpx;
                                    right: -18rpx;
                                    top: -24rpx;
                                }
                                img.bg-shadow {
                                    width: 82rpx;
                                    height: 12rpx;
                                }
                            }
                        }
                        &.third {
                            width: 200rpx;
                            .avatar {
                                margin-bottom: 8rpx;
                                margin-left: -20rpx;
                                width: 132rpx;
                                height: 132rpx;
                                img.bg-crown {
                                    width: 92rpx;
                                    height: 94rpx;
                                    right: -18rpx;
                                    top: -24rpx;
                                }
                                img.bg-shadow {
                                    width: 82rpx;
                                    height: 12rpx;
                                }
                            }
                        }
                    }
                }
                .ranking-list {
                    position: relative;
                    padding-bottom: 32rpx;
                    .other {
                        background-color: #fff;
                        border-radius: 12rpx;
                        margin: 0 24rpx;
                    }
                }
            }
        }
    }
</style>