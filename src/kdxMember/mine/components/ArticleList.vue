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
    <view class="content">
        <ul>
            <li class="list-item"
                v-for="(item, index) in list"
                :key="index"
                @click="jumpGoodsDetail(item)"  >
                <div class="left":style="{ 'background-image': `url(${$utils.staticMediaUrl('decorate/goods_col2.png')})`}">
                    <img :src="getCover(item)" alt="" />
                </div>
                <div class="right">
                    <div class="name">{{ item.title }}</div>
                    <div class="bottom">
                        <div class="b-right">
                            <i class="collect iconfont-m- icon-m-xingxingshixin theme-primary-color"
                                @click.stop="changeFavorite(item, index)">
                            </i>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </view>
</template>

<script>
export default {
    props: ['list'],
    data() {
        return {}
    },
    methods: {
        getCover(item) {
            let cover = item.cover.split(',');
            return this.$utils.mediaUrl(cover[0])
        },
        jumpGoodsDetail(data) {
            const path = '/kdxArticle/detail/index'
            this.$Router.auto({
                path,
                query: {
                    id: data.article_id,
                },
            })
        },
        changeFavorite(data, index) {
            this.$emit('changeFavorite', {
                data,
                index,
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.content {
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
                font-size: px2rpx(14);
                line-height: 34rpx;
                height: px2rpx(34);
                font-weight: bold;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                word-break:break-all;
            }
            .bottom {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                width: 100%;
                .b-right {
                    display: flex;
                    align-items: center;
                    .iconfont-m- {
                        // font-weight: bold;
                        font-size: 40rpx;
                        width: 40rpx;
                        height: 40rpx;
                        display: flex;
                        align-items: center;
                    }
                    .buy {
                        color: #ff3c29;
                        margin-right: 24rpx;
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
