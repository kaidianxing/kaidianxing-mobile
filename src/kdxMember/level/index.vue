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
        <div class="level-demon">
            <img
                class="page-bg"
                :src="$utils.staticMediaUrl('level-bg.png')"
                alt=""
            />
            <img
                lazy-load
                class="avart"
                mode="aspectFill"
                :src="
                    $utils.mediaUrl(
                        userInfo.avatar,
                        $utils.staticMediaUrl('decorate/gotop.png')
                    )
                "
                alt=''
            />
            <div class="info">
                <p class="name">{{ userInfo ? userInfo.nickname : '' }}</p>
            </div>
            <scroll-view
                class="levels-scroll scroll-view"
                :scroll-x="true"
                scroll-with-animation
                :scroll-left="scrollTo"
                @scroll="scroll"
            >
                <view class="_ul">
                    <view class="level first"></view>
                    <view
                        class="level"
                        :class="{
                            myLevel: myLevel.level_id == item.level_id,
                            curIndex: currentLevel.index == index,
                        }"
                        v-for="(item, index) in levels"
                        :key="index"
                        @click="clickItem(index)"
                    >
                        <view
                            class="name"
                            :class="{
                                current: myLevel.level_id == item.level_id,
                            }"
                        >
                            {{ item.level_name }}
                        </view>
                        <view
                            class="line"
                            :class="{
                                'last-child': index == levels.length - 1,
                                active: item.index < myLevel.index,
                            }"
                        >
                            <view
                                class="dot"
                                :class="{ active: item.index <= myLevel.index }"
                            ></view>
                        </view>
                        <view
                            class="limit"
                            v-if="myLevel.level_id == item.level_id"
                        >
                            当前等级
                        </view>
                    </view>
                    <view class="level last"></view>
                </view>
            </scroll-view>
            <scroll-view :scroll-y="true" class="demon scroll-view">
                <div class="body" v-if="currentLevel.demon.is_discount === '1'">
                    <div>
                        <p class="body-title">等级说明</p>
                        <p class="body-content">
                            {{ currentLevel.demon.demon }}
                        </p>
                    </div>
                    <div>
                        <p class="body-title">等级权益</p>
                        <p class="body-content">
                            {{ currentLevel.level_name }}会员购买商品
                            <span class="key">
                                {{ currentLevel.demon.discount }}折
                            </span>
                        </p>
                    </div>
                    <div>
                        <p class="body-title">升级条件</p>
                        <p class="body-content" style="border:none;">
                            {{ currentLevel.demon.update_text }}
                        </p>
                        <div
                            class="goods-list"
                            v-if="currentLevel.demon.update_condition === '3'"
                        >
                            <ul>
                                <li
                                    v-for="(item, index) in currentLevel.demon
                                        .goodsList"
                                    :key="index"
                                >
                                    <goods-info
                                        :goodsData="item"
                                        type="applyGoods"
                                    />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="commonVip" v-else>
                    <img
                        class="vip-level"
                        :src="$utils.staticMediaUrl('default/vip-level.png')"
                        alt=""
                    />
                    <p class="common-demon">当前等级没有任何优惠</p>
                </div>
            </scroll-view>
        </div>
    </page-box>
</template>

<script>
let lastPosition = -1
let unitLength = 0
let rpx = 0
import GoodsInfo from '../components/goods/GoodsInfo'
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    components: {
        GoodsInfo,
    },
    data() {
        return {
            userInfo: {},
            scrollTo: 0,
            scrolling: false,
            bar: '',
            bar2: '',
            levels: [],
            currentLevel: {
                demon: {},
            },
        }
    },
    computed: {
        unitLength() {
            return uni.upx2px(270)
        },
        myLevel() {
            let info = {
                level_id: '',
                level: '',
            }
            if (this.userInfo) {
                this.levels.forEach((item, index) => {
                    if (item.level_id == this.userInfo.level_id) {
                        info = {
                            level_id: item.level_id,
                            level: item.level,
                            index,
                        }
                        this.currentLevel = item
                        this.$nextTick(() => {
                            this.scrollTo = index * this.unitLength
                        })
                    }
                })
            }
            return info
        },
    },
    watch: {
        scrolling() {
            if (!this.scrolling) {
                let index = Math.abs(Math.round(this.scrollTo / unitLength))
                this.currentLevel = this.levels[index]
                if (this.scrollTo - index * unitLength > unitLength) {
                    index = index + 1
                }
                if (this.scrollTo != index * unitLength) {
                    this.clickItem(index)
                }
            }
        },
    },
    mounted() {
        unitLength = uni.upx2px(270)
        rpx = uni.upx2px(10) / 10
        this.$api.memberApi.levelList().then(async (res) => {
            if (res.error == 0) {
                this.levels = await Promise.all(
                    res.data
                        .sort((a, b) => a.level - b.level)
                        .map((item, index) => {
                            return this.asyncWorker(item, index)
                        })
                )
            } else {
                this.$toast(res.message)
            }
        })
        this.$api.memberApi.getUserInfo().then((res) => {
            let data = res.data
            if (res.error == 0) {
                this.userInfo = data
            } else {
                this.$toast(res.message)
            }
        })
    },
    methods: {
        scroll(e) {
            this.scrolling = true
            clearTimeout(this.bar2)
            this.bar2 = setTimeout(() => {
                this.scrollTo = e.detail.scrollLeft //px2rpx
                this.scrolling = false
            }, 34)
        },
        clickItem(index) {
            clearTimeout(this.bar2)
            this.currentLevel = this.levels[index]
            this.scrollTo = index * unitLength
        },
        // 处理数据
        asyncWorker(data, index) {
            return new Promise(async (resolve, reject) => {
                let goodsList
                if (data.update_condition === '3') {
                    // 购买指定商品， 获取商品
                    goodsList = await this.goodList(data.goods_ids)
                } else {
                    goodsList = []
                }
                resolve({
                    level: data.level,
                    index,
                    level_name: data.level_name,
                    level_id: data.id,
                    demon: {
                        demon:
                            data.is_default === '1'
                                ? '系统默认会员等级。'
                                : data.update_condition === '0'
                                ? '商城用户不可自动升级成为该等级下的用户。'
                                : `${data.update_text}可升级到该等级(${
                                      data.level_name
                                  })，可享受${parseFloat(
                                      data.discount
                                  )}折权益哦`,
                        update_condition: data.update_condition,
                        update_text:
                            data.is_default === '1'
                                ? '无'
                                : data.update_condition === '0'
                                ? '不自动升级'
                                : data.update_text,
                        is_discount: data.is_discount,
                        discount: parseFloat(data.discount),
                        goodsList: goodsList,
                    },
                })
            })
        },
        // 获取商品列表
        goodList(id) {
            return new Promise((resolve, reject) => {
                this.$api.goodApi
                    .goodList({
                        id,
                    })
                    .then((res) => {
                        if (res.error === 0) {
                            resolve(res.list)
                        } else {
                            resolve([])
                        }
                    })
            })
        },
    },
    beforeDestroy() {
        clearInterval(this.bar)
    },
}
</script>

<style lang="scss" scoped>
.scroll-view ::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: transparent;
}
.level-demon {
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    .page-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }
    .avart {
        position: relative;
        z-index: 10;
        width: px2rpx(50);
        height: px2rpx(50);
        display: block;
        border-radius: 50%;
        margin: px2rpx(24) auto px2rpx(8);
    }
    .info {
        text-align: center;
        margin: 0 auto px2rpx(32);
        position: relative;
        color: #fff;
        .name {
            line-height: px2rpx(20);
        }
    }
    .demon {
        width: auto;
        height: calc(100vh - 450rpx);
        /* #ifdef H5 */
        height: calc(100vh - 538rpx);
        /* #endif */
        position: relative;
        border-radius: px2rpx(6);
        background: #fff;
        padding-top: px2rpx(1);
        margin-left: px2rpx(12);
        margin-right: px2rpx(12);
        margin-bottom: px2rpx(16);
        padding-top: px2rpx(16);
        padding-bottom: px2rpx(16);
        box-sizing: border-box;
        &::before {
            content: '';
            width: px2rpx(10);
            height: px2rpx(10);
            background: #fff;
            position: absolute;
            top: px2rpx(-5);
            left: 0;
            right: 0;
            margin: 0 auto;
            transform: rotate(45deg);
            // z-index: 100;
        }
        .title {
            height: px2rpx(54);
            font-size: px2rpx(16);
            line-height: px2rpx(16);
            padding: px2rpx(19) px2rpx(24);
            border-bottom: 1rpx solid #e6e7eb;
            color: #212121;
            font-weight: bold;
        }
        .body {
            padding-left: px2rpx(24);
            > div:nth-child(1) {
                .body-title {
                    margin-top: 0;
                }
            }
            > div:nth-child(3) {
                .body-content {
                    padding-bottom: 16rpx;
                }
            }
            .body-title {
                font-size: px2rpx(16);
                line-height: px2rpx(22);
                margin: px2rpx(16) 0 px2rpx(8) 0;
                color: #212121;
                font-weight: bold;
            }
            .body-content {
                font-size: px2rpx(12);
                line-height: px2rpx(17);
                border-bottom: 1rpx solid #e6e7eb;
                padding-right: px2rpx(24);
                padding-bottom: px2rpx(16);
                color: #969696;
            }
            .goods-list {
                padding-right: 48rpx;
                /deep/ .goods-card-item {
                    padding-top: 16rpx;
                    padding-bottom: 16rpx;
                }
                li:last-child {
                    /deep/ .goods-card-item {
                        &:after {
                            border-bottom: none;
                        }
                    }
                }
            }
        }
        .key {
            color: #ff3c29;
        }
    }
    .commonVip {
        padding-top: px2rpx(64);
        display: flex;
        flex-direction: column;
        align-items: center;
        .vip-level {
            margin-bottom: px2rpx(16);
            width: px2rpx(100);
            height: px2rpx(100);
        }
        .common-demon {
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            text-align: center;
            color: #969696;
        }
    }
    /deep/ .levels-scroll {
        width: 100%;
        ._ul {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
        }
        .level {
            width: px2rpx(135);
            height: px2rpx(75);
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            color: #fff;
            .name {
                font-size: px2rpx(12);
                line-height: px2rpx(17);
                transform: translate(-53%, 0);
                text-align: center;
                margin-bottom: px2rpx(11);
                white-space: nowrap;
                &.current {
                    color: #ebbe59;
                    line-height: px2rpx(18);
                }
            }
            .limit {
                font-size: px2rpx(12);
                line-height: px2rpx(17);
                transform: translate(-50%, 0);
                text-align: center;
                padding: px2rpx(14) 0 px2rpx(11);
            }
            .line {
                width: px2rpx(135);
                height: px2rpx(2);
                background: #969696;
                position: relative;
                .dot {
                    width: px2rpx(8);
                    height: px2rpx(8);
                    background: #969696;
                    border-radius: 50%;
                    top: 0;
                    left: 0;
                    transform: translate(-100%, -35%);
                    &.active {
                        background: #ebbe59;
                    }
                }
                &.last-child {
                    width: 0;
                }
                &.active {
                    background: #ebbe59;
                }
            }
            &.first {
                width: px2rpx(190);
            }
            &.last {
                width: px2rpx(55);
            }
            &.curIndex {
                .name {
                    transform: translate(-53%, -10%);
                    font-size: px2rpx(16);
                }
            }
        }
    }
}
</style>
