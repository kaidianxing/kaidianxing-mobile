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
    <view :class="['article-goods', modalItem ? 'modalItem' : '']" @click="toGoodsDetail">
        <view class="goods-thumb-box">
            <view class="goods-tag" v-if="goodsDetail.has_activity" >{{goodsDetail.activity_type}}</view>
            <img class="goods-thumb" :src="$utils.mediaUrl(goodsDetail.thumb) + (useCache?'':('?t=' + new Date().getTime()))" />
        </view>
        <view class="goods-r">
            <view class="goods-title">{{goodsDetail.title}}</view>
            <view class="goods-b">
                <block v-if="!goodsDetail.perm_price">
                    <view class="price">{{goodsDetail.price_diy}}</view>
                </block>
                <block v-else>
                    <view class="price">{{goodsDetail.price}}</view>
                    <view class="goods-btn">
                        立即购买
                    </view>
                </block>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        useCache:{
            type: Boolean,
            default: false
        },
        goodsData: {
            type: Object,
            default: () => {}
        },
        modalItem: {
            type: Boolean,
            default: false
        },
        articleId: {
            typa: String,
            default: ""
        }
    },
    data() {
        return {};
    },
    computed: {
        goodsDetail() {
            let res = {};
            res = {
                id: this.goodsData.id,
                thumb: this.goodsData.thumb,
                title: this.goodsData.title,
                price: this.goodsPrice(this.goodsData),
                has_activity: this.goodsData.has_activity,
                activity_type: this.activityName(this.goodsData.activity_type),
                perm_price: this.goodsData?.perm_price,
                price_diy: this.goodsData.ext_field?.price_diy
            }
            return res
        },
    },
    methods: {
        // 跳转商品页
        toGoodsDetail() {
            // 记录文章id，下单和领券接口添加文章id参数
            this.sessionStorage.setItem("article_id", this.articleId);
            this.$Router.push({
                path: '/kdxGoods/detail/index',
                query: {
                    goods_id: this.goodsDetail.id
                }
            })
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
                case "groupsFission":
                    res = "拼团免单"
                    break;
                case "presell":
                    res = "预售"
                    break;
                default:
                    break;
            }
            return res
        },
        // 商品价格
        goodsPrice(data) {
            let res = `￥${data.price}`;
            if(data.has_option === "1") {
                res = `￥${data.min_price} ~ ￥${data.max_price}`
            };
            if(data.has_activity == 0 && data.has_preheat_activity == 0 && data.buy_button_status == 1) {
                res = data.ext_field.buy_button_settings.price_text
            }
            return res
        },
    },
};
</script>
<style lang='scss' scoped>
.article-goods {
    display: flex;
    width: 100%;
    padding: px2rpx(12);
    margin: px2rpx(8) 0;
    background: #FAFAFA;
    border-radius: px2rpx(10);
    &.modalItem {
        margin-bottom: 0;
        .goods-thumb {
            width: px2rpx(100);
            height: px2rpx(100);
        }
        .goods-r .goods-b .price {
            font-size: px2rpx(16)
        }
    }
    .goods-thumb-box {
        position: relative;
        margin-right: px2rpx(12);
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
    }
    .goods-thumb {
        display: block;
        width: px2rpx(80);
        height: px2rpx(80);
        border-radius: px2rpx(6);
    }
    .goods-r {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: calc(100% - 184rpx);
        .goods-title {
            height: px2rpx(38);
            font-size: px2rpx(14);
            line-height: px2rpx(20);
            font-weight: bold;
            color: $color-w1;
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap:break-word;
            display: -webkit-box;
            -webkit-line-clamp: 2;  
            -webkit-box-orient: vertical;
        }
        .goods-b {
            display: flex;
            justify-content: space-between;
            color: $uni-color-primary;
            font-size: px2rpx(12);
            line-height: px2rpx(19);
            .price{
                width: calc(100% - 150rpx);
                font-size: px2rpx(14);
                line-height: px2rpx(22);
                font-weight: bold;
                word-break: break-all;
                word-wrap: break-word;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .goods-btn {
                width: px2rpx(70);
                text-align: center;
                height: px2rpx(22);
                line-height: px2rpx(22);
                border-radius: px2rpx(90);
                background: #FF0000;
                color: #fff;
                font-size: px2rpx(12);
                font-weight: bold;
            }
        }
    }
}
</style>