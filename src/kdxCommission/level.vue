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
        <view class="commission-level">
            <!-- 等级 -->
            <view class="level-rank">
                <i class="iconfont-m- icon-m-arrow-up"></i>
                <i class="iconfont-m- icon-m-huangguan1"></i>
                <view class="level-title">您的当前{{commissionSetting.agent_name}}等级<text>{{levelName}}</text></view>
                <view class="levels-scroll-box">
                    <scroll-view class="levels-scroll" :scroll-x="true" scroll-with-animation :scroll-left="scrollTo" @scroll="scroll">
                        <view class="_ul">
                            <view class="level first"></view>
                            <view class="level" v-for="(item, index) in levels" :key="index" @click="clickItem(index, item.id)">
                                <view class="level-icon">
                                    <image class="level-image" :src="currentLevel.id == item.id ? $utils.staticMediaUrl('commission/level-active-icon.png') : $utils.staticMediaUrl('commission/level-icon.png')"></image>
                                    <image class="level-num" :src="$utils.staticMediaUrl(`commission/level/commission_level${index+1}.png`)"></image>
                                </view>
                                <view class="level-name two-line-hide" :class="{active: currentLevel.id == item.id}">{{item.name}}</view>
                            </view>
                            <view class="level last"></view>
                        </view>
                    </scroll-view>
                </view>
            </view>
            <view class="container">
                <!-- 佣金比例 -->
                <view class="proportion" v-if="proportion.length > 0">
                    <view class="title">{{commissionSetting.commission}}比例</view>
                    <view class="proportion-content flex" :class="'proportion'+index" v-for="(item, index) in proportion" :key="index">
                        <view style="font-size: 24rpx;">{{item.text}}</view>
                        <view style="font-size: 32rpx;">{{item.num}}%</view>
                    </view>
                </view>
                <!-- 升级条件 -->
                <view class="up-grade" v-if="condition">
                    <view class="title">升级条件<text class="uni-text-color-grey" style="font-size: 24rpx;">{{upgrade_type==1?'（满足以下全部条件）':'（满足以下任意1个条件）'}}</text></view>
                    <view class="up-grade-content">
                        <view class="rr-cell" v-if="condition.order_money">
                            <view class="flex">
                                <view class="flex1">
                                    <text>{{commissionSetting.commission_order}}总额达到<text class="uni-color-primary price">{{condition.order_money}}元</text></text>
                                </view>
                                <block>
                                    <view class="right status success" v-if="condition.order_money_finish">已完成</view>
                                    <view class="right status" v-else>未完成</view>
                                </block>
                            </view>
                        </view>
                        <view class="rr-cell" v-if="condition.order_money_1">
                            <view class="flex">
                                <view class="flex1">
                                    <text>{{commissionSetting.level_name_1}}{{commissionSetting.commission_order}}总额达到<text class="uni-color-primary price">{{condition.order_money_1}}元</text></text>
                                </view>
                                <block>
                                    <view class="right status success" v-if="condition.order_money_1_finish">已完成</view>
                                    <view class="right status" v-else>未完成</view>
                                </block>
                            </view>
                        </view>
                        <view class="rr-cell" v-if="condition.order_count">
                            <view class="flex">
                                <view class="flex1">
                                    <text>{{commissionSetting.commission_order}}总数达到<text class="uni-color-primary price">{{condition.order_count}}单</text></text>
                                </view>
                                <block>
                                    <view class="right status success" v-if="condition.order_count_finish">已完成</view>
                                    <view class="right status" v-else>未完成</view>
                                </block>
                            </view>
                        </view>
                        <view class="rr-cell" v-if="condition.order_count_1">
                            <view class="flex">
                                <view class="flex1">
                                    <text>{{commissionSetting.level_name_1}}{{commissionSetting.commission_order}}总数达到<text class="uni-color-primary price">{{condition.order_count_1}}单</text></text>
                                </view>
                                <block>
                                    <view class="right status success" v-if="condition.order_count_1_finish">已完成</view>
                                    <view class="right status" v-else>未完成</view>
                                </block>
                            </view>
                        </view>
                        <view class="rr-cell" v-if="condition.self_order_money">
                            <view class="flex">
                                <view class="flex1">
                                    <text>自购订单总额达到<text class="uni-color-primary price">{{condition.self_order_money}}元</text></text>
                                </view>
                                <block>
                                    <view class="right status success" v-if="condition.self_order_money_finish">已完成</view>
                                    <view class="right status" v-else>未完成</view>
                                </block>
                            </view>
                        </view>
                        <view class="rr-cell" v-if="condition.self_order_count">
                            <view class="flex">
                                <view class="flex1">
                                    <text>自购订单数达到<text class="uni-color-primary price">{{condition.self_order_count}}单</text></text>
                                </view>
                                <block>
                                    <view class="right status success" v-if="condition.self_order_count_finish">已完成</view>
                                    <view class="right status" v-else>未完成</view>
                                </block>
                            </view>
                        </view>
                        <view class="rr-cell" v-if="condition.child_count">
                            <view class="flex">
                                <view class="flex1">
                                    <text>下线总人数达到<text class="uni-color-primary price">{{condition.child_count}}人</text></text>
                                </view>
                                <block>
                                    <view class="right status success" v-if="condition.child_count_finish">已完成</view>
                                    <view class="right status" v-else>未完成</view>
                                </block>
                            </view>
                        </view>
                        <view class="rr-cell" v-if="condition.child_count_1">
                            <view class="flex">
                                <view class="flex1">
                                    <text>{{commissionSetting.level_name_1}}下线总人数达到<text class="uni-color-primary price">{{condition.child_count_1}}人</text></text>
                                </view>
                                <block>
                                    <view class="right status success" v-if="condition.child_count_1_finish">已完成</view>
                                    <view class="right status" v-else>未完成</view>
                                </block>
                            </view>
                        </view>
                        <view class="rr-cell" v-if="condition.child_agent_count">
                            <view class="flex">
                                <view class="flex1">
                                    <text>下线{{commissionSetting.agent_name}}人数达到<text class="uni-color-primary price">{{condition.child_agent_count}}人</text></text>
                                </view>
                                <block>
                                    <view class="right status success" v-if="condition.child_agent_count_finish">已完成</view>
                                    <view class="right status" v-else>未完成</view>
                                </block>
                            </view>
                        </view>
                        <view class="rr-cell" v-if="condition.child_agent_count_1">
                            <view class="flex">
                                <view class="flex1">
                                    <text>{{commissionSetting.level_name_1}}下线{{commissionSetting.agent_name}}达到<text class="uni-color-primary price">{{condition.child_agent_count_1}}人</text></text>
                                </view>
                                <block>
                                    <view class="right status success" v-if="condition.child_agent_count_1_finish">已完成</view>
                                    <view class="right status" v-else>未完成</view>
                                </block>
                            </view>
                        </view>
                        <view class="rr-cell" v-if="condition.withdraw_money">
                            <view class="flex">
                                <view class="flex1">
                                    <text>已提现{{commissionSetting.commission}}金额达到<text class="uni-color-primary price">{{condition.withdraw_money}}元</text></text>
                                </view>
                                <block>
                                    <view class="right status success" v-if="condition.withdraw_money_finish">已完成</view>
                                    <view class="right status" v-else>未完成</view>
                                </block>
                            </view>
                        </view>
                        <view class="rr-cell" v-if="condition.goods_ids">
                            <view class="flex">
                                <view class="flex1">
                                    <text>购买以下商品</text>
                                </view>
                                <block>
                                    <view class="right status success" v-if="goods_ids_finish">已完成</view>
                                    <view class="right status" v-else>未完成</view>
                                </block>
                            </view>
                        </view>
                        <view class="goods-content">
                            <view class="item" v-for="item in goodsList" :key="item.id">
                                <goods-info :goodsData="item" :isAddIcon="true"></goods-info>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </page-box>
</template>

<script>

    import goodsInfo from './components/goods/GoodsInfo'
    import {mapState} from "vuex";
    let unitLength = uni.upx2px(184);
    let rpx = uni.upx2px(10) / 10;
    import PageMixin from '@/common/PageMixin.js'
    export default {
        mixins: [PageMixin],
        name: "level",
        components: {
            goodsInfo
        },
        props: {},
        data() {
            return {
                levelName: '', // 当前会员的等级
                scrollTo: 0,
                scrolling: false,
                bar: "",
                bar2: '',
                upgrade_type: 1, // 升级条件
                currentLevel: {},
                levels: [],
                proportion: [], // 佣金
                goods_info: [],
                condition: null, // 升级条件
                goods_ids_finish: false,
                goodsList: []
            }
        },
        computed: {
            ...mapState('commissionSet', {
                commissionSetting: state => state.commissionSetting,
            }),
        },
        watch: {
            scrolling() {
                if (!this.scrolling) {
                    let index = Math.abs(Math.round((this.scrollTo) / unitLength));
                    this.currentLevel = this.levels[index];
                    if (this.scrollTo - index * unitLength > unitLength) {
                        index = index + 1;
                    }
                    if (this.scrollTo != index * unitLength) {
                        this.clickItem(index,this.currentLevel.id);
                    }
                }
            }
        },
        created() {
        },
        beforeMount() {
            uni.setNavigationBarTitle({
                title: this.commissionSetting.level_description
            })
        },
        mounted() {
            this.getLevel()
        },
        methods: {
            getLevel() {
                // uni.showLoading({title:'加载中'})
                this.$api.commissionApi.getLevel().then(res => {
                    if (res.error == 0) {
                        this.levels = res.list.map((item, index) => {
                            return {
                                ...item,
                                index
                            }
                        });
                        this.levels.filter((item, index) => {
                            if (item.id == res.member_level_id) {
                                this.currentLevel = item;
                                this.levelName = item.name;
                                this.$nextTick(() => {
                                    this.scrollTo = index * unitLength
                                });
                            } else {
                                this.currentLevel = this.levels[0];
                            }
                        });
                        // 获取等级
                        this.getLevelData(res.member_level_id || res.list[0].id);
                    }
                }).finally(rej => {
                    uni.hideLoading()
                });
            },
            getLevelData(id) {
                this.$api.commissionApi.getLevelData({level_id: id},{errorToast: false}).then(res => {
                    if (res.error == 0) {
                        this.proportion = [
                            {
                                text: `${this.commissionSetting.level_name_1}${this.commissionSetting.agent_name}比例`,
                                num: res.detail.commission_1 || 0
                            },
                            {
                                text: `${this.commissionSetting.level_name_2}${this.commissionSetting.agent_name}比例`,
                                num: res.detail.commission_2 || 0
                            },
                            {
                                text: `${this.commissionSetting.level_name_3}${this.commissionSetting.agent_name}比例`,
                                num: res.detail.commission_3 || 0
                            }
                        ].splice(0,Number(res.commission_level));
                        if (Array.isArray(res.condition)) {
                            this.condition = null
                        } else {
                            this.condition = res.condition;
                        }
                        this.upgrade_type = res.detail.upgrade_type;
                        if (res.condition.goods_ids) {
                            this.goods_ids_finish = res?.goods_info?.member_goods_ids.length > 0;
                            this.getGoodsList(res.goods_info.goods_ids)
                        }
                    }
                })
            },
            scroll(e) {
                this.scrolling = true;
                clearTimeout(this.bar2);
                this.bar2 = setTimeout(() => {
                    this.scrollTo = e.detail.scrollLeft; //px2rpx
                    this.scrolling = false;
                }, 34)
            },
            clickItem(index, id) {
                this.goodsList = [];
                clearTimeout(this.bar2);
                this.currentLevel = this.levels[index];
                this.scrollTo = index * unitLength;
                this.getLevelData(id)
            },
            getGoodsList(ids) {
                this.$api.goodApi.goodList({id:ids}).then(res => {
                    this.goodsList = res.list
                })
            },
        },
        beforeDestroy() {
            clearInterval(this.bar);
        },
    }
</script>

<style lang="scss" scoped>
    .commission-level {
        overflow: hidden;
        .level-rank {
            position: relative;
            background: linear-gradient(119.23deg, rgba(0, 0, 0, 0.8) 1.99%, rgba(0, 0, 0, 0.744) 97.71%);
            .icon-m-huangguan1 {
                position: absolute;
                right: -52rpx;
                bottom: -146rpx;
                font-size: 404rpx;
                color: #fff;
                opacity: 0.05;
                z-index: 0;
            }
            .icon-m-arrow-up {
                position: absolute;
                left: 50%;
                bottom: -16rpx;
                font-size: 40rpx;
                color: #f5f5f5;
                z-index: 0;
                transform: translate(-50%);
            }
            .level-title {
                padding: 32rpx 0 48rpx;
                font-size: 24rpx;
                text-align: center;
                color: #fff;
                text {
                    color: #CFAA71;
                }
            }
            .levels-scroll-box {
                height: 216rpx;
                overflow: hidden;
            }
            .levels-scroll {
                height: 260rpx;
                ._ul {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                }
                .level {
                    margin-right: 64rpx;
                    width: 120rpx;
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    &.first {
                        width: 260rpx;
                    }
                    &.last {
                        width: 260rpx;
                    }
                }
                .level-icon {
                    position: relative;
                    margin-bottom: 24rpx;
                    .level-image {
                        width: 64rpx;
                        height: 64rpx;
                        border-radius: 50%;
                    }
                    .level-num {
                        position: absolute;
                        right: 4rpx;
                        bottom: 4rpx;
                        width: 20rpx;
                        height: 20rpx;
                    }
                }
                .level-name {
                    width: 120rpx;
                    font-size: 24rpx;
                    color: #F5F5F5;
                    opacity: 0.6;
                    text-align: center;
                    &.active {
                        color: #fff;
                        opacity: 1;
                    }
                }
            }
        }
        .container {
            padding: 0 24rpx 32rpx;
            .title {
                margin: 48rpx 0 32rpx 0;
                font-size: 32rpx;
                line-height: 44rpx;
                color: $uni-text-color;
            }
            .proportion-content {
                justify-content: space-between;
                margin-bottom: 16rpx;
                padding: 0 24rpx;
                height: 96rpx;
                line-height: 96rpx;
                color: #fff;
                border-radius: 12rpx;
                &:last-child {
                    margin-bottom: 0;
                }
            }
            .proportion0 {
                background-color: #996B39;
            }
            .proportion1 {
                background-color: #C18A51;
            }
            .proportion2 {
                background-color: #CFAA71;
            }
            .up-grade-content {
                background-color: #fff;
                border-radius: 12rpx;
                overflow: hidden;
                .rr-cell {
                    height: 96rpx;
                    line-height: 96rpx;
                    color: $uni-text-color;
                    .flex {
                        height: 100%;
                        align-items: center;
                        border-top: 1px solid $uni-border-color;
                        .flex1 {
                            .price {
                                margin-left: 10rpx;
                            }
                        }
                    }
                    .right {
                        margin-right: 24rpx;
                        width: 102rpx;
                        height: 38rpx;
                        line-height: 38rpx;
                        color: $uni-color-primary;
                        font-size: 24rpx;
                        background-color: #FFF3F5;
                        text-align: center;
                        border-radius: 38rpx;
                        &.success {
                            background-color: #D5F9E6;
                            color: #09C15F;
                        }
                    }
                    &:first-child {
                        .flex {
                            border: 0;
                        }
                    }
                }
                .goods-content {
                    /deep/ .goods-card-item {
                        padding: 16rpx 24rpx;
                    }
                    /deep/ .item:last-child {
                        .goods-card-item::after {
                            border: 0;
                        }
                    }
                }
            }
        }
    }
</style>