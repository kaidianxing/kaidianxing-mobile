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
    <div
        class='liver'
        v-if='componentData&&componentData.id=="liver"'
        :style="{padding:`${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`}"
    >
        <div class="liver-container">
            <!-- 大图 -->
            <div v-if="componentData.params.liverstyle == 'big_pic'">
                <div
                    class="liver-item big_pic overflow-h"
                    v-for="(item,index) in limitData"
                    @click='clickItem(item)'
                    :key="index"
                    :style="{
                        borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`
                    }"
                >
                    <div class="liver-item-box">
                        <img
                            class="cover-img"
                            :src="getThumb(item)"
                            v-if='startLoadImg'
                        />
                        <div
                            class="liver-status"
                            v-if="componentData.params.showstatus =='0'"
                        >
                            <i
                                class="iconfont-m- liver-status-icon"
                                :class="getStatus(item).icon"
                            ></i>
                            <div class="liver-status-box">{{getStatus(item).text}}</div>
                        </div>
                        <div class="liver-info">
                            <div class="liver-info-box">
                                <div
                                    class="liver-info-title"
                                    :style="{color: componentData.style.livertitlecolor}"
                                >{{item.title}}</div>
                                <div
                                    class="liver-info-user"
                                    v-if="componentData.params.shownickname=='0'"
                                    :style="{color: componentData.style.nicknamecolor}"
                                >主播：{{item.anchor_name || ''}}</div>
                            </div>
                            <div
                                class="liver-goods-box"
                                v-if="componentData.params.showgoods=='0' && getGoodsThumb(item)"
                            >
                                <img
                                    :src="getGoodsThumb(item)"
                                    class="liver-goods-img"
                                    v-if='startLoadImg'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 两列 -->
            <div
                class="liver-item cell_two"
                v-else-if="componentData.params.liverstyle == 'cell_two'"
            >
                <div
                    class="liver-item-box cell_two-list"
                    v-for="(item,index) in limitData"
                    :key="index"
                    @click='clickItem(item)'
                >
                    <div
                        class="overflow-h liver-content-box"
                        :style="{
                            borderRadius: `0 0 ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`
                        }"
                    >
                        <img
                            class="cover-img overflow-h"
                            :src="getThumb(item)"
                            :style="{
                                borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} 0 0`
                            }"
                            v-if='startLoadImg'
                        />
                        <div
                            class="liver-status"
                            v-if="componentData.params.showstatus =='0'"
                        >
                            <i
                                class="iconfont-m- liver-status-icon"
                                :class="getStatus(item).icon"
                            ></i>
                            <div class="liver-status-box">{{getStatus(item).text}}</div>
                        </div>
                        <!-- 主播昵称不显示 -->
                        <!-- <div
                        class="liver-info"
                        v-if="componentData.params.showtitle=='0' && componentData.params.shownickname=='1'"
                    >
                        <div class="liver-info-box">
                            <div
                                class="two-line-hide liver-info-title"
                                :style="{color: componentData.style.livertitlecolor}"
                            >{{item.title}}</div>
                        </div>
                    </div> -->

                        <!-- 显示主播昵称 -->
                        <div
                            class="liver-info has-nickname"
                            v-show="(componentData.params.showgoods=='0' && getGoodsThumb(item)) || componentData.params.shownickname=='0'"
                        >
                            <div
                                class="liver-info-box"
                                :class="{
                                    'flex_end':componentData.params.shownickname=='1'
                                }"
                            >
                                <div
                                    class="liver-info-user"
                                    v-if="componentData.params.shownickname=='0'"
                                    :style="{color: componentData.style.nicknamecolor}"
                                >主播：{{item.anchor_name || ''}}</div>
                                <div
                                    class="liver-goods-box"
                                    v-if="componentData.params.showgoods=='0' && getGoodsThumb(item)"
                                >
                                    <img
                                        :src="getGoodsThumb(item)"
                                        class="liver-goods-img"
                                        v-if='startLoadImg'
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            class="two-line-hide liver-info-title"
                            :style="{color: componentData.style.livertitlecolor,background: componentData.style.background}"
                        >{{item.title}}</div>
                    </div>
                </div>
            </div>

            <!-- 两列长图 -->
            <div
                class="liver-item cell_two_long"
                v-else-if="componentData.params.liverstyle == 'cell_two_long'"
            >
                <div
                    class="liver-item-box cell_two_long-list overflow-h"
                    :style="{
                        borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`
                    }"
                    v-for="(item,index) in limitData"
                    :key="index"
                    @click='clickItem(item)'
                >
                    <img
                        class="cover-img overflow-h"
                        :style="{
                            borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`
                        }"
                        :src="getThumb(item)"
                        v-if='startLoadImg'
                    />
                    <div
                        class="liver-status"
                        v-if="componentData.params.showstatus =='0'"
                    >
                        <i
                            class="iconfont-m- liver-status-icon"
                            :class="getStatus(item).icon"
                        ></i>
                        <div class="liver-status-box">{{getStatus(item).text}}</div>
                    </div>

                    <div
                        class="liver-info overflow-h"
                        :style="{
                            borderRadius: `0 0 ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`
                        }"
                    >
                        <div class="liver-info-box">
                            <div
                                class="liver-info-title two-line-hide"
                                :style="{color: componentData.style.livertitlecolor}"
                            >{{item.title}}</div>
                            <div
                                class="liver-info-user"
                                v-if="componentData.params.shownickname=='0'"
                                :style="{color: componentData.style.nicknamecolor}"
                            >主播：{{item.anchor_name || ''}}</div>
                        </div>
                        <div
                            class="liver-goods-box"
                            v-if="componentData.params.showgoods=='0' && getGoodsThumb(item)"
                        >
                            <img
                                :src="getGoodsThumb(item)"
                                class="liver-goods-img"
                                v-if='startLoadImg'
                            />
                        </div>
                    </div>
                </div>
            </div>
            <!-- 标题 1+2 -->
            <div
                v-if="componentData.params.liverstyle == 'title_pic'"
                class="overflow-h"
                :style="{
                    background: componentData.style.background,
                    borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`
                }"
            >
                <div
                    class="liver-item title_pic overflow-h"
                    :style="{
                        borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`
                    }"
                >
                    <div
                        class="liver-item-box"
                        @click='clickItem(getLiverData(0))'
                    >
                        <div
                            class="title"
                            v-if="componentData.params.showtitle == '0'"
                        >
                            <span :style="{color: componentData.style.firstcolor}">{{componentData.params.firsttitle}}</span>
                            <i
                                :style="{color: componentData.style.firstcolor}"
                                class="iconfont-m- icon-m-right more-icon"
                            ></i>
                        </div>
                        <div
                            class="subtitle"
                            :style="{color: componentData.style.secondcolor}"
                            v-if="componentData.params.showsubtitle == '0'"
                        >{{componentData.params.subtitle}}></div>
                    </div>
                    <div class="liver-layout">
                        <div
                            class="left overflow-h"
                            @click='clickItem(getLiverData(0))'
                            :style="{
                                borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`
                            }"
                        >
                            <div
                                class="liver-status"
                                v-if="componentData.params.showstatus =='0'"
                            >
                                <i
                                    class="iconfont-m- liver-status-icon"
                                    :class="getStatus(getLiverData(0)).icon"
                                ></i>
                                <div class="liver-status-box">{{getStatus(getLiverData(0)).text}}</div>
                            </div>

                            <img
                                class="cover-img"
                                :src="getThumb(getLiverData(0))"
                                v-if='startLoadImg'
                            />
                            <div class="liver-info">
                                <div class="liver-info-box">
                                    <div
                                        class="liver-info-title"
                                        :style="{color: componentData.style.livertitlecolor}"
                                    >{{getLiverData(0).title}}</div>
                                    <div
                                        class="liver-info-user"
                                        v-if="componentData.params.shownickname=='0'"
                                        :style="{color: componentData.style.nicknamecolor}"
                                    >主播：{{getLiverData(0).anchor_name || ''}}</div>
                                </div>
                                <div
                                    class="liver-goods-box"
                                    v-if="componentData.params.showgoods=='0' && getGoodsThumb(getLiverData(0))"
                                >
                                    <img
                                        :src="getGoodsThumb(getLiverData(0))"
                                        class="liver-goods-img"
                                        v-if='startLoadImg'
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="right">
                            <img
                                class="right-list"
                                :src="getThumb(getLiverData(1))"
                                @click='clickItem(getLiverData(1))'
                                v-if='startLoadImg'
                            />
                            <img
                                class="right-list"
                                :src="getThumb(getLiverData(2))"
                                @click='clickItem(getLiverData(2))'
                                v-if='startLoadImg'
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 列表 -->
            <div
                class="liver-item list"
                v-else-if="componentData.params.liverstyle == 'list'"
            >
                <div
                    class="liver-item-box overflow-h"
                    :style="{
                        background: componentData.style.background,
                        borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`
                    }"
                    v-for="(item,index) in limitData"
                    :key="index"
                    @click='clickItem(item)'
                >
                    <div class="left">
                        <div
                            class="liver-status"
                            v-if="componentData.params.showstatus =='0'"
                        >
                            <i
                                class="iconfont-m- liver-status-icon"
                                :class="getStatus(item).icon"
                            ></i>
                            <div class="liver-status-box">{{getStatus(item).text}}</div>
                        </div>

                        <img
                            class="cover-img"
                            :src="getThumb(item)"
                        />
                    </div>
                    <div class="right">
                        <div>
                            <div
                                class="liver-info-title"
                                :style="{color: componentData.style.livertitlecolor}"
                            >{{item.title}}</div>
                            <div
                                class="liver-info-user"
                                v-if="componentData.params.shownickname=='0'"
                                :style="{color: componentData.style.nicknamecolor}"
                            >主播：{{item.anchor_name || ''}}</div>
                        </div>
                        <div class="goods-img">
                            <div
                                class="goods-img-list"
                                v-if="componentData.params.showgoods=='0' && getGoodsThumb(item)"
                            >
                                <img
                                    class="goods-img-thumb"
                                    :src="getGoodsThumb(item)"
                                />
                            </div>

                            <div
                                class="goods-img-list"
                                v-if="componentData.params.showgoods=='0' && getGoodsThumb(item, 1)"
                            >
                                <img
                                    class="goods-img-thumb"
                                    :src="getGoodsThumb(item, 1)"
                                />
                                <span
                                    class="goods-num"
                                    v-if="item.goods_count>2"
                                >+{{item.goods_count - 2}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    </div>
</template>

<script>

const statusObj = {
    '101': { text: '直播中', icon: 'icon-m-zhibozhong' },
    '102': { text: '未开始', icon: 'icon-m-yugao' },
    '103': { text: '已结束', icon: 'icon-m-zhibojieshu' },
    '104': { text: '禁播', icon: 'finished' },
    '105': { text: '暂停', icon: 'finished' },
    '106': { text: '异常', icon: 'finished' },
    '107': { text: '已过期', icon: 'finished' },
}
import mixin from './mixin.js'
export default {
    mixins: [mixin],
    name: 'liver',
    computed: {
        limitData() {
            return this.componentData.data.length ? this.componentData.data : this.examplesData
        },
        examplesData() {
            let keys = ['cell_two', 'cell_two_long'];
            let num = 1;
            if (keys.includes(this.componentData.params.liverstyle)) {
                num = 2
            }

            return new Array(num).fill({
                anchor_name: "昵称",
                goods_count: 0,
                imgurl: '',
                title: "这是直播间标题",
                status: '101',
                goods_list: [{ thumb: this.$utils.staticMediaUrl(`decorate/goods_col2.png`) }]
            })
        }
    },
    methods: {
        getThumb(item) {
            if (item?.imgurl) {
                return this.$utils.mediaUrl(item.imgurl)
            }
            if (item?.share_img) {
                return this.$utils.getLiverImg(item?.share_img)
            }

            let imgKey = this.componentData.params.liverstyle == 'cell_two_long' ? '_long' : '_normal'
            return this.$utils.staticMediaUrl(`decorate/liver${imgKey}.png`)
        },
        getGoodsThumb(item, index = 0) {
            if (item.goods_list && item.goods_list.length && item.goods_list[index]) {
                return item.goods_list[index]?.thumb ? this.$utils.mediaUrl(item.goods_list[index]?.thumb) : ''
            } else {
                return ''
            }
        },
        getLiverData(index) {
            return this.limitData ? this.limitData[index] : {}
        },
        getStatus(item) {
            if (item.status == 102) {
                if (!item.start_time) {
                    return {
                        icon: 'icon-m-yugao',
                        text: '未开始'
                    }
                }

                // 解决ios时间兼容问题
                item.start_time = item.start_time.replace(/-/g, '/')
                let text = this.$utils.formatDateTime(new Date(item.start_time), 'MM-dd hh:mm')
                return {
                    icon: 'icon-m-yugao',
                    text: text ? '预告：' + text : '未开始'
                }
            }
            return statusObj[item?.status] || {}
        },
        clickItem(item) {
            this.$emit('custom-event', {
                target: 'liver/clickItem',
                data: {
                    data: this.componentData,
                    item: item
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./decorate.scss";

.liver-container {
    .overflow-h {
        border-radius: px2rpx(6);
        overflow: hidden;
    }
    .liver-item {
        margin-bottom: px2rpx(8);

        &-container {
            height: 100%;
        }

        &:last-child {
            margin-bottom: 0;
        }
        .liver-status {
            display: flex;
            position: absolute;
            top: px2rpx(8);
            height: px2rpx(20);

            &-icon {
                position: absolute;
                left: px2rpx(-10);
                top: 0;
                height: px2rpx(19);
                width: px2rpx(19);
                border-radius: 50%;

                font-size: px2rpx(20);
                line-height: 1;
                background: #fff;

                &.icon-m-zhibozhong {
                    color: #ff3c29;
                }

                &.icon-m-zhibojieshu {
                    color: #565656;
                }

                &.icon-m-yugao {
                    color: #09c15f;
                }
            }

            &-box {
                border-radius: 0px px2rpx(12) px2rpx(12) 0px;
                padding: 0 px2rpx(12) 0 px2rpx(15);
                color: #fff;
                font-size: px2rpx(12);
                line-height: px2rpx(20);
                background: rgba(0, 0, 0, 0.3);
            }
        }

        .liver-info {
            position: absolute;
            left: 0;
            display: flex;
            justify-content: space-between;
            width: 100%;

            &-title {
                margin-bottom: px2rpx(4);
                font-size: px2rpx(14);
                line-height: px2rpx(20);
            }

            &-user {
                font-size: px2rpx(12);
                line-height: px2rpx(17);
            }
        }

        .liver-goods {
            &-box {
                overflow: hidden;
                border-radius: px2rpx(6);
            }

            &-box,
            &-img {
                height: px2rpx(40);
                width: px2rpx(40);
                flex-shrink: 0;
            }
        }

        .cover-img {
            display: block;
            width: 100%;
        }
    }

    // 单列
    .big_pic {
        position: relative;
        height: px2rpx(280);
        border-radius: px2rpx(6);

        .cover-img {
            height: px2rpx(280);
        }

        .liver-status {
            left: px2rpx(24);
        }

        .liver-info {
            align-items: flex-end;
            bottom: 0;
            padding: px2rpx(0) px2rpx(8) px2rpx(8) px2rpx(8);
            background: linear-gradient(
                180deg,
                rgba(0, 0, 0, 0) 0%,
                rgba(0, 0, 0, 0.4) 100%
            );

            &-title {
                margin-bottom: 0;
            }

            &-user {
                margin-top: px2rpx(4);
            }
        }
    }

    .cell_two,
    .cell_two_long {
        margin-left: px2rpx(-7);
        display: flex;
        flex-wrap: wrap;

        &-list {
            margin-bottom: px2rpx(8);
            position: relative;
            box-sizing: border-box;
            padding-left: px2rpx(7);
            width: 50%;
        }

        .liver-status {
            left: px2rpx(25);
        }
    }

    // 两列
    .cell_two {
        .cover-img {
            height: px2rpx(138);
        }

        .liver-content-box {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .liver-info {
            display: block;
            left: px2rpx(7);
            padding: px2rpx(6) px2rpx(0) px2rpx(8) px2rpx(8);
            background: linear-gradient(
                360deg,
                rgba(0, 0, 0, 0.6) 0%,
                rgba(0, 0, 0, 0) 100%
            );
            width: calc(100% - #{px2rpx(8)});
            &:not(.has-nickname) {
                top: px2rpx(90);
            }

            &-user {
                min-height: px2rpx(30);
                display: flex;
                align-items: flex-end;
            }

            &-box {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;

                &.flex_end {
                    justify-content: flex-end;
                }

                .liver-goods-box,
                .liver-goods-img {
                    width: px2rpx(30);
                    height: px2rpx(30);
                    border-radius: px2rpx(6);
                }

                .liver-goods-box {
                    padding-left: px2rpx(8);
                    box-sizing: content-box;
                }
            }

            &-title {
                flex: 1;
                margin-bottom: 0;
                font-size: px2rpx(12);
                line-height: px2rpx(17);
                color: #fff;
            }

            &.has-nickname {
                top: px2rpx(100);
                padding: 0 px2rpx(8) px2rpx(8) px2rpx(8);

                & + .liver-info-title {
                    padding: px2rpx(8) px2rpx(8);
                    font-size: px2rpx(12);
                    line-height: px2rpx(17);
                    background: #fff;
                    color: #212121;
                }
            }
        }
    }

    .cell_two_long {
        .cover-img {
            height: px2rpx(306);
        }

        .liver-info {
            display: flex;
            align-items: flex-end;
            left: px2rpx(8);
            bottom: 0;
            padding: 0 px2rpx(16) px2rpx(8) px2rpx(8);
            background: linear-gradient(
                360deg,
                rgba(0, 0, 0, 0.6) 0%,
                rgba(0, 0, 0, 0) 100%
            );

            &-title {
                margin-bottom: 0;
            }

            &-user {
                margin-top: px2rpx(4);
            }
        }

        .liver-goods-box {
            padding-left: px2rpx(8);
            box-sizing: content-box;
            flex-shrink: 0;
            height: px2rpx(40);
            width: px2rpx(40);

            .liver-goods-img {
                border-radius: px2rpx(6);
            }
        }
    }

    // 标题+图
    .title_pic {
        padding: px2rpx(8) px2rpx(12);

        .title {
            display: flex;
            align-items: center;
            margin-bottom: px2rpx(4);
            font-size: px2rpx(16);
            line-height: px2rpx(22);
            color: #ff3c29;

            .more-icon {
                margin-left: px2rpx(4);
                font-size: px2rpx(16);
            }
        }

        .subtitle {
            margin-bottom: px2rpx(8);
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            color: #969696;
        }

        .liver-layout {
            display: flex;
            justify-content: space-between;
            height: px2rpx(170);

            .left {
                position: relative;
                width: 65%;

                .liver-status {
                    left: px2rpx(18);
                }

                .cover-img {
                    height: px2rpx(170);
                }

                .liver-info {
                    display: flex;
                    align-items: flex-end;
                    padding: 0 px2rpx(8) px2rpx(8) px2rpx(8);
                    min-height: px2rpx(60);
                    background: linear-gradient(
                        360deg,
                        rgba(0, 0, 0, 0.6) 0%,
                        rgba(0, 0, 0, 0) 100%
                    );
                    bottom: 0;

                    &-title {
                        margin-bottom: 0;
                    }

                    &-user {
                        margin-top: px2rpx(4);
                    }

                    .liver-goods-box {
                        box-sizing: content-box;
                        padding-left: px2rpx(8);
                        flex-shrink: 0;

                        .liver-goods-img {
                            border-radius: px2rpx(6);
                        }
                    }
                }
            }

            .right {
                padding-left: px2rpx(12);
                width: 35%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .right-list {
                    width: 100%;
                    border-radius: px2rpx(6);
                    height: px2rpx(82);
                }
            }
        }
    }

    // 列表

    .list {
        .liver-item-box {
            display: flex;
            margin-bottom: px2rpx(8);

            &:last-child {
                margin-bottom: 0;
            }
        }
        .left {
            position: relative;
            width: 53%;
            .cover-img {
                height: px2rpx(150);
            }

            .liver-status {
                left: px2rpx(16);
            }

            .liver-info {
                align-items: flex-end;
            }
        }

        .right {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: px2rpx(12) 0 px2rpx(8) px2rpx(12);
            width: 47%;

            .liver-info-user {
                color: #56595b;
            }

            .goods-img {
                display: flex;

                &-list,
                &-thumb {
                    border-radius: px2rpx(6);
                    width: px2rpx(40);
                    height: px2rpx(40);
                }

                &-list {
                    margin-right: px2rpx(8);
                    position: relative;

                    &:nth-child(3) {
                        margin-right: 0;
                    }
                }

                .goods-num {
                    position: absolute;
                    font-size: px2rpx(10);
                    line-height: px2rpx(14);
                    color: #ffffff;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }
            }
        }
    }
}
</style>
