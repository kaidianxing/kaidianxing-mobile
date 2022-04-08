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
    <view class="content">
        <div class="pug-item" v-for="(item, index) in list" :key="index">
            <div class="time">{{ item.date }}</div>
            <ul class="goods-list">
                <li
                    class="list-item"
                    v-for="(subItem, subIndex) in item.data"
                    :key="subIndex"
                    @click="jumpGoodsDetail(subItem)"
                >
                    <div
                        class="left"
                        :style="{
                            'background-image': `url(${$utils.staticMediaUrl(
                                'decorate/goods_col2.png'
                            )})`,
                        }"
                    >
                        <img :src="$utils.mediaUrl(subItem.goods.thumb)" alt="" />
                    </div>
                    <div class="right">
                        <div class="name">
                            {{ subItem.goods.title | formatStr }}
                        </div>
                        <div class="bottom">
                            <div class="price" >
                                <span class="unit">￥</span>
                                {{ subItem.goods.price }}
                            </div>
                            <div class="b-right">
                                <div
                                    class="collect iconfont-m- icon-m-xingxingkongxin  theme-primary-color"
                                    :class="{
                                        collected: subItem.is_add === 1,
                                        'icon-m-xingxingshixin':
                                            subItem.is_add === 1,
                                    }"
                                    @click.stop="
                                        changeFavorite(item, index, subIndex)
                                    "
                                ></div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </view>
</template>

<script>
export default {
    props: ['list'],
    data() {
        return {}
    },
    filters: {
        formatStr(value) {
            if (value.length > 36) {
                value = `${value.slice(0, 36)}...`
            }
            return value
        },
    },
    methods: {
        jumpGoodsDetail(data) {
            const path = `/kdxGoods/detail/index`
            this.$Router.auto({
                path,
                query: {
                    goods_id: data.goods_id,
                },
            })
        },
        changeFavorite(data, index, subIndex) {
            this.$emit('changeFavorite', {
                data,
                index,
                subIndex,
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.content {
    .pug-item {
        .time {
            padding-left: 48rpx;
            padding-top: 32rpx;
            font-size: 24rpx;
            line-height: 34rpx;
            color: #969696;
        }
        .goods-list {
            padding-left: 24rpx;
            padding-right: 24rpx;
        }
    }
    ul {
        overflow: hidden;
    }
    .list-item {
        margin-top: 16rpx;
        display: flex;
        align-items: center;
        background-color: #fff;
        border-radius: 12rpx;
        padding: 32rpx 24rpx;
        .left {
            width: 160rpx;
            height: 160rpx;
            flex-shrink: 0;
            border-radius: 12rpx;
            overflow: hidden;
            background-repeat: no-repeat;
            background-size: contain;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .right {
            flex: 1;
            height: 160rpx;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding-left: 24rpx;
            .name {
                color: #212121;
                font-size: 24rpx;
                line-height: 34rpx;
                word-break: break-all;
            }
            .bottom {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .price {
                    color: #ff3c29;
                    font-size: 32rpx;
                    line-height: 34rpx;
                    font-weight: bold;
                    .unit {
                        font-size: 24rpx;
                    }
                }
                .b-right {
                    display: flex;
                    align-items: center;
                    .iconfont-m- {
                        // font-weight: bold;
                        font-size: 40rpx;
                    }
                    .collect {
                        color: #969696;
                        &.collected {
                            color: #ff3c29;
                        }
                    }
                }
            }
        }
        &:last-child {
            border-bottom: none;
        }
    }
}
</style>
