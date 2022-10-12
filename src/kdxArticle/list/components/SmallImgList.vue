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
    <view class="list-content" :style="{'padding-bottom': `${settings.bottom_menu == 1 ? '100rpx': '0'}`}" v-if="list.length">
        <view class="list-item" v-for="item, index in currentlist" :key="item.id">
            <view class="item-article" @click="articleDetail(item.id)">
                <view class="item-thumb">
                    <image class="thumb" mode="aspectFill" :src="getCover(item)"/>
                </view>
                <view class="item-r">
                    <div class="item-top">
                        <view class="item-title">
                            {{ item.title }}
                        </view>
                        <view class="item-digest">
                            <view class="text">{{ item.digest }}</view>
                        </view>
                    </div>
                    <view class="item-btn">
                        <view v-if="item.read_number_status === '1'" class="btn" @click.stop="thumpsUp(item.id, item.member_thump_up_status, index)">
                            <i class="icon iconfont-m- icon-m-liulan"></i>{{ item.read_number > 9999 ? "9999+" : item.read_number }}
                        </view>
                        <view v-if="item.thumps_up_status === '1'" class="btn" :class="item.member_thump_up_status == '1' ? 'thump-up' : ''" @click.stop="thumpsUp(item.id, item.member_thump_up_status, index)">
                            <i :class="['icon', 'iconfont-m-', item.member_thump_up_status == '1' ? 'icon-m-dianzan-2' : 'icon-m-dianzan']"></i>{{ item.thumps_up_number > 9999 ? "9999+" : item.thumps_up_number }}
                        </view>
                    </view>
                </view>
            </view>
            <view class="item-goods-list" v-if="item.goods.length">
                <view class="goods-item" v-for="goodsItem in item.goods" :key="goodsItem.id" @click="goodsDetail(goodsItem.id, item.id)">
                    <view class="goods-thumb-box">
                        <!-- <view class="goods-tag" v-if="goodsItem.has_activity" >{{activityName(goodsItem.activity_type)}}</view> -->
                        <image class="goods-thumb" :src="$utils.mediaUrl(goodsItem.thumb)"/>
                    </view>
                    <view class="goods-text">
                        <view class="goods-title">{{ goodsItem.title }}</view>
                        <view class="goods-price">{{ goodsPrice(goodsItem) }}</view>
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
            currentlist: this.list
        };
    },
    mounted() {
        this.currentlist = this.list
    },
    watch: {
        list(newVal) {
            this.currentlist = newVal
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
        // 跳转商品页
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
        thumpsUp(id, status, index) {
            let resStatus = Number(!Number(status));
            this.$api.articleApi.articleThumpsUp({
                id,
                status: resStatus
            }).then((res) => {
                if(res.error === 0) {
                    this.currentlist[index].member_thump_up_status = resStatus;
                    if(resStatus) {
                        this.currentlist[index].thumps_up_number++
                    }else {
                        this.currentlist[index].thumps_up_number--
                    }
                }
            })
        },
    },
};
</script>
<style lang='scss' scoped>
.list-content {
    padding: 0 px2rpx(12);
    flex: 1;
    background: #fff;
    margin-top: -2rpx;
    border-top: px2rpx(0.5) solid $uni-border-color;
    .list-item {
        border-bottom: px2rpx(0.5) solid $uni-border-color;
        &:last-child {
            border-bottom: 0;
        }
    }
    .item-article {
        display: flex;
        flex-wrap: nowrap;
        padding: px2rpx(12) 0;
        .item-thumb .thumb {
            display: block;
            width: px2rpx(114);
            height: px2rpx(86);
            border-radius: px2rpx(6);
            margin-right: px2rpx(12);
        }
        .item-r {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-width: 100px;
            justify-content: space-between;
            .item-top {
                height: px2rpx(65);
            }
            .item-title {
                font-size: px2rpx(14);
                color: $uni-text-color;
                line-height: px2rpx(20);
                margin-bottom: px2rpx(4);
                font-weight: bold;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                word-break:break-all;
                .article {
                    display: inline-block;
                    height: px2rpx(18);
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
                .text{
                    color: $uni-text-color-grey;
                    line-height: px2rpx(17);
                    font-size: px2rpx(12);
                    word-break: break-all;
                    word-wrap: break-word;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            .item-btn {
                display: flex;
                justify-content: flex-end;
                text-align: right;
                color: #969696;
                line-height: px2rpx(16);
                height: px2rpx(16);
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
    .item-goods-list {
        display: flex;
        padding-bottom: px2rpx(12);
        overflow-x: auto;
        &::-webkit-scrollbar {
            display:none;
        }
        .goods-item {
            display: flex;
            flex-wrap: nowrap;
            width: px2rpx(227);
            height: px2rpx(66);
            margin-right: px2rpx(12);
            padding: px2rpx(8);
            background: #FAFAFA;
            border-radius: px2rpx(6);
            &:last-child {
                margin-right: 0;
            }
            .goods-thumb-box {
                position: relative;   
                margin-right: px2rpx(8);
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
                }
            }
            .goods-text {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: px2rpx(153);
            }
            .goods-title {
                font-size: px2rpx(12);
                font-weight: bold;
                color: $uni-text-color;
                word-break: break-all;
                word-wrap: break-word;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .goods-price {
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