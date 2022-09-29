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
    <div class="cate-goods van-hairline--bottom">
        <div class="goods-thumb-box">
            <img
                :src="$utils.mediaUrl(goods.thumb)"
                class="goods-thumb"
            />
            <div class="goods-soldout" v-if="goods.stock<=0">
                <img
                    class="goods-soldout-img"
                    :src="getSoldOutIcon"
                />
            </div>
        </div>
        <div class="main-content">
            <div v-if="goods.sub_title">
                <div class="title line-hide">{{goods.title}}</div>
                <div class="sub-title line-hide">{{goods.sub_title}}</div>
            </div>
            <div class="title two-line-hide" v-else>{{goods.title}}</div>
            <!-- 非议价商品或者活动商品按正常显示 -->
            <div class="footer-content" v-if="(!goods.buy_button_status || goods.buy_button_status==0 || is_active(goods))">
                <div class="left-content">
                    <span class="goods-pirce theme-primary-price"><i class="theme-primary-price">￥</i>{{getPrice(goods).price |formatMoney}}</span>
                    <span class="goods-original-price" v-if="goods.original_price>0">￥{{getPrice(goods).productprice|formatMoney}}</span>
                </div>
                <div class="right-content">
                    <span
                        class="stock-text theme-primary-color"
                        v-if="goods.stock<=0"
                    >已售罄</span>
                    <i
                        v-else-if="goods.stock>0 && !isActive(goods)"
                        class="iconfont-m- icon-m-buy1 buy-icon theme-primary-color"
                        @click.stop="goodsClick(goods)"
                    />
                    <span class="sales-text" v-if="goods.ext_field && goods.ext_field.show_sales=='1'">销量:{{goods.sales}}</span>
                </div>
            </div>
            <div class="footer-content" v-else>
                <div class="left-content">
                    <span class="goods-pirce bargaining theme-primary-price">{{goods.ext_field.buy_button_settings.price_text}}</span>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { ACTIVE_DECORATE_NAME } from '@/common/variable/activity'
import { getActivityName } from "@/common/helper/goods"
export default {
    props: {
        goods: {
            type: Object,
            default: () => { }
        }
    },
    computed: {
        getSoldOutIcon() {
            if (this.$store.state.setting.systemSetting.basic?.sale_out) {
                return this.$utils.mediaUrl(this.$store.state.setting.systemSetting.basic?.sale_out)
            }
            return this.$utils.staticMediaUrl('decorate/sale_out.png')
        },
    },
    methods: {
        getPrice(item) {
            return {
                price: parseFloat(item.activities?.member_price ? item.activities?.member_price : item.price),
                productprice: parseFloat(item.original_price),
            }
        },
        goodsClick(goods) {
            this.$emit('goods-click', goods)
        },
        isActive(item){
            // 解决23087 bug
            return getActivityName(item?.activities)
        },
        // 是否为活动及预售商品
        is_active(item) {
            let actives = ['presell', 'seckill','groups','preheat_activity']
            return item.activities &&actives.some(key=> item.activities[key])
        },
    },
    filters: {
        formatMoney(money) {
            if (typeof money === 'number' || (typeof money === 'string' && money.trim() !== '')) {
                if (money >= 10000) {
                    return parseFloat(money / 10000) + '万'
                } else {
                    return parseFloat(money)
                }
            } else {
                return 0
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.cate-goods {
    display: flex;
    padding: px2rpx(8) px2rpx(0) px2rpx(8) px2rpx(0);
    margin-left: px2rpx(8);
    margin-right: px2rpx(12);

    background: #fff;
    &.van-hairline--bottom:after {
        border-bottom-color: $uni-border-color;
        border-style: solid;
    }

    .goods-thumb-box {
        margin-right: px2rpx(12);
        border-radius: px2rpx(6);
        width: px2rpx(84);
        height: px2rpx(84);
        position: relative;
    }

    .goods-soldout {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 100%; // bottom: 0; // 内置
        height: 100%;
        z-index: 10;
        color: #fff;
        background: rgba(0, 0, 0, 0.5);
        border-radius: px2rpx(6);
        &-img {
            position: absolute;
            width: 50%;
            height: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
    }

    .goods-thumb {
        border-radius: px2rpx(6);
        width: px2rpx(84);
        height: px2rpx(84);
    }

    .main-content {
        flex: 1;
        width: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .title {
            font-size: px2rpx(14);
            line-height: px2rpx(20);
            color: #212121;
        }
        .sub-title {
            font-size: px2rpx(10);
            line-height: px2rpx(14);
            color: #969696;
            padding-top: px2rpx(4);
        }

        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            .left-content {
                .goods-pirce {
                    font-size: px2rpx(16);
                    line-height: px2rpx(22);
                    font-weight: bold;
                    &.bargaining {
                        font-size: px2rpx(14);
                    }
                    i {
                        font-size: px2rpx(10);
                        line-height: px2rpx(14);
                    }
                }

                .goods-original-price {
                    margin-left: px2rpx(6);
                    font-size: px2rpx(10);
                    line-height: px2rpx(14);
                    color: #969696;
                    position: relative;
                    /*text-decoration: line-through;*/
                    &:after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        bottom: 0;
                        left: 6rpx;
                        right: 0;
                        background-color: #969696;
                        height: 2.4rpx;
                    }
                }
            }

            .right-content {
                display: flex;
                flex-direction: column;
                align-items: flex-end;

                .stock-text {
                    font-size: px2rpx(10);
                    line-height: px2rpx(14);
                }

                .buy-icon {
                    padding: px2rpx(0) 0 0 px2rpx(10);
                    line-height: px2rpx(24);
                    font-size: px2rpx(24);
                }

                .sales-text {
                    font-size: px2rpx(10);
                    line-height: px2rpx(14);
                    color: #969696;
                }
            }
        }
    }
}
</style>
