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
    <view class="list-content" :style="{'padding-bottom': `${settings.bottom_menu == 1 ? '116rpx': '16rpx'}`}"  v-if="list.length">
        <view class="list-content-column">
            <view class="list-item" v-for="item, index in currentlistR" :key="item.id">
                <view class="item-article" @click="articleDetail(item.id)">
                    <view class="item-thumb">
                        <image class="thumb" mode="aspectFill" :src="getCover(item)"/>
                    </view>
                    <view class="item-b">
                        <view class="item-title">
                            {{ item.title }}
                        </view>
                        <view v-if="item.digest" class="item-digest">
                            {{ item.digest }}
                        </view>
                        <view class="item-btn">
                            <view v-if="item.read_number_status === '1'" class="btn" @click.stop="thumpsUp('currentlistR', item.member_thump_up_status, index)">
                                <i class="icon iconfont-m- icon-m-liulan"></i>{{ item.read_number > 9999 ? "9999+" : item.read_number }}
                            </view>
                            <view v-if="item.thumps_up_status === '1'" class="btn" :class="item.member_thump_up_status == '1' ? 'thump-up' : ''" @click.stop="thumpsUp('currentlistR', item.member_thump_up_status, index)">
                                <i :class="['icon', 'iconfont-m-', item.member_thump_up_status == '1' ? 'icon-m-dianzan-2' : 'icon-m-dianzan']"></i>{{ item.thumps_up_number > 9999 ? "9999+" : item.thumps_up_number }}
                            </view>
                        </view>
                    </view>
                </view>
                <view v-for="goodsItem, index in item.goods" :key="goodsItem.id" v-if="index === 0">
                    <view class="item-goods" @click="goodsDetail(goodsItem.id, item.id)">
                        <view class="goods-thumb-box">
                            <!-- <view class="goods-tag" v-if="goodsItem.has_activity" >{{activityName(goodsItem.activity_type)}}</view> -->
                            <image class="goods-thumb" mode="aspectFill" :src="$utils.mediaUrl(goodsItem.thumb)"/>
                        </view>
                        <view class="goods-r">
                            <view class="goods-title">{{ goodsItem.title }}</view>
                            <view class="goods-price">{{ goodsPrice(goodsItem) }}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="list-content-column">
            <view class="list-item" v-for="item, index in currentlistL" :key="item.id">
                <view class="item-article" @click="articleDetail(item.id)">
                    <view class="item-thumb">
                        <image class="thumb" mode="aspectFill" :src="getCover(item)"/>
                    </view>
                    <view class="item-b">
                        <view class="item-title">
                            {{ item.title }}
                        </view>
                        <view v-if="item.digest" class="item-digest">
                            {{ item.digest }}
                        </view>
                        <view class="item-btn">
                            <view v-if="item.read_number_status === '1'" class="btn" @click.stop="thumpsUp('currentlistL', item.member_thump_up_status, index)">
                                <i class="icon iconfont-m- icon-m-liulan"></i>{{ item.read_number > 9999 ? "9999+" : item.read_number }}
                            </view>
                            <view v-if="item.thumps_up_status === '1'" class="btn" :class="item.member_thump_up_status == '1' ? 'thump-up' : ''" @click.stop="thumpsUp('currentlistL', item.member_thump_up_status, index)">
                                <i :class="['icon', 'iconfont-m-', item.member_thump_up_status == '1' ? 'icon-m-dianzan-2' : 'icon-m-dianzan']"></i>{{ item.thumps_up_number > 9999 ? "9999+" : item.thumps_up_number }}
                            </view>
                        </view>
                    </view>
                </view>
                <view v-for="goodsItem, index in item.goods" :key="goodsItem.id" v-if="index === 0">
                    <view class="item-goods" @click="goodsDetail(goodsItem.id, item.id)">
                        <view class="goods-thumb-box">
                            <!-- <view class="goods-tag" v-if="goodsItem.has_activity" >{{activityName(goodsItem.activity_type)}}</view> -->
                            <image class="goods-thumb" mode="aspectFill" :src="$utils.mediaUrl(goodsItem.thumb)"/>
                        </view>
                        <view class="goods-r">
                            <view class="goods-title">{{ goodsItem.title }}</view>
                            <view class="goods-price">{{ goodsPrice(goodsItem) }}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>

import {mediaUrl} from "../../../common/util";

export default {
    props: {
        list: {
            type: Array,
            default: ()=> []
        },
        settings: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            currentlistR: [],
            currentlistL: []
        };
    },
    mounted() {
        this.currentlistR = [];
        this.currentlistL = [];
        this.list.forEach((item, index) => {
            if(index%2 === 0) {
                if(!this.currentlistR.includes(item)) {
                    this.currentlistR.push(item)
                }
            }else {
                if(!this.currentlistL.includes(item)) {
                    this.currentlistL.push(item)
                }
            }
        });
    },
    watch: {
        list(newVal) {
            this.currentlistR = [];
            this.currentlistL = [];
            newVal.forEach((item, index) => {
                if(index%2 === 0) {
                    if(!this.currentlistR.includes(item)) {
                        this.currentlistR.push(item)
                    }
                }else {
                    if(!this.currentlistL.includes(item)) {
                        this.currentlistL.push(item)
                    }
                }
            });
        }
    },
    methods: {
        getCover(item) {
            let cover = item.cover.split(',');
            return this.$utils.mediaUrl(cover[0])
        },
        // 活动名称
        activityName(type) {
            let res = "";
            switch (type) {
                case "seckill":
                    res = "秒杀"
                    break;
                case "groups":
                    res = "拼团"
                    break;
                case "groupsRebate":
                    res = "拼团返利"
                    break;
                case "presell":
                    res = "预售"
                    break;
                default:
                    break;
            }
            return res
        },
        articleDetail(id) {
            this.$Router.push({
                path: '/kdxArticle/detail/index',
                query: {
                    id: id
                }
            })
        },
        goodsDetail(id, articleId) {
            // 记录文章id，下单和领券接口添加文章id参数
            this.sessionStorage.setItem("article_id", articleId);
            this.$Router.push({
                path: '/kdxGoods/detail/index',
                query: {
                    goods_id: id
                }
            })
        },
        // 商品价格
        goodsPrice(data) {
            let res = `￥${data.price}`;
            if(data.has_option === "1") {
                res = `￥${data.min_price}~￥${data.max_price}`
            };
            if(data.has_activity == 0 && data.has_preheat_activity == 0 && data.buy_button_status == 1) {
                res = data.ext_field.buy_button_settings.price_text
            }
            return res
        },
        thumpsUp(list, status, index) {
            let id = this[list][index].id;
            let resStatus = Number(!Number(status));
            this.$api.articleApi.articleThumpsUp({
                id,
                status: resStatus
            }).then((res) => {
                if(res.error === 0) {
                    this[list][index].member_thump_up_status = resStatus;
                    if(resStatus) {
                        this[list][index].thumps_up_number++
                    }else {
                        this[list][index].thumps_up_number--
                    }
                }
            })
        },
    },
};
</script>
<style lang='scss' scoped>
.list-content {
    display: flex;
    flex-wrap: nowrap;
    padding: px2rpx(12) px2rpx(12) px2rpx(8);
    flex: 1;
    justify-content: space-between;
    .list-content-column {
        width: calc(50% - 7rpx);
    }
    .list-item {
        width: 100%;
        background: #fff;
        border-radius: px2rpx(6);
        margin-bottom: px2rpx(8);
        padding-bottom: px2rpx(8);
        overflow: hidden;
    }
    .item-article {
        .item-thumb {
            width: 100%;
            height: px2rpx(172);
            margin-bottom: px2rpx(8);
            .thumb {
                width: 100%;
                height: px2rpx(172);
                margin-bottom: px2rpx(8);
            }
        }
        .item-b {
            flex: 1;
            padding: 0 px2rpx(8);
            .item-title {
                font-size: px2rpx(14);
                font-weight: bold;
                color: $uni-text-color;
                line-height: px2rpx(20);
                margin-bottom: px2rpx(8);
                word-break: break-all;
                overflow: hidden;
                text-overflow: ellipsis;
                word-wrap:break-word;
                display: -webkit-box;
                -webkit-line-clamp: 2;  
                -webkit-box-orient: vertical;
                .article {
                    display: inline-block;
                    line-height: px2rpx(18);
                    padding: 0 px2rpx(4);
                    font-size: px2rpx(12);
                    border-radius: px2rpx(2);
                    margin-right: px2rpx(5);
                    background: #F0FAFF;
                    color: #367BF5;
                    vertical-align: top;
                    margin-top: px2rpx(1);
                    &.activity {
                        background: #FFE2E6;
                        color: #FF3C29;
                    }
                }
            }
            .item-digest {
                height: px2rpx(17);
                color: $uni-text-color-grey;
                line-height: px2rpx(17);
                font-size: px2rpx(12);
                margin-bottom: px2rpx(8);
                word-break: break-all;
                word-wrap: break-word;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .item-btn {
                display: flex;
                justify-content: flex-end;
                text-align: right;
                color: #969696;;
                .btn {
                    margin-right: px2rpx(8);
                    font-size: px2rpx(12);
                    line-height: px2rpx(17);
                    &:last-child {
                        margin-right: 0;
                    }
                    .icon {
                        font-size: px2rpx(16);
                        vertical-align: middle;
                    }
                    &.thump-up .icon{
                        color: $uni-color-primary;
                    }
                }
            }
        }
    }
    .item-goods {
        display: flex;
        font-size: px2rpx(14);
        line-height: px2rpx(20);
        padding: px2rpx(8) 0 0;
        margin: px2rpx(8) px2rpx(8) 0;
        border-top: px2rpx(0.5) solid $uni-border-color;
        .goods-thumb-box {
            position: relative;   
            .goods-tag {
                position: absolute;
                top: 0;
                left: 0;
                background: #367bf5;
                padding: 0 px2rpx(6);
                line-height: px2rpx(19);
                border-top-left-radius: px2rpx(9);
                border-bottom-right-radius: px2rpx(9);
                z-index: 10;
                font-size: px2rpx(12);
                color: #fff;
            }
            .goods-thumb {
                display: block;
                width: px2rpx(50);
                height: px2rpx(50);
                border-radius: px2rpx(6);
                margin-right: px2rpx(8);
            }
        }
        .goods-r {
            height: px2rpx(50);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: calc(100% - 116rpx);
            .goods-title {
                color: $uni-text-color;
                word-break: break-all;
                word-wrap: break-word;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-weight: bold;
            }
            .goods-price {
                line-height: px2rpx(14);
                color: $uni-color-primary;    
                font-size: px2rpx(14);
                word-break: break-all;
                word-wrap: break-word;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
}
</style>