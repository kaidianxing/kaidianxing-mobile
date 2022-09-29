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
    <div class="goods-group">
        <div class="image-box">
            <img
                mode='widthFix'
                lazy-load
                :src="getLoadingSrc"
                alt=""
                class='goods-img preload'
                v-if='item.preloading&&preloading'
            />
            <img
                mode='widthFix'
                lazy-load
                :src="$utils.mediaUrl(item.thumb)"
                alt=""
                class='goods-img'
                @load='loaded(item.thumb)'
                @error='loaded(item.thumb)'
                :class='{loading:item.preloading&&preloading}'
            />
        </div>
        <div class="goods-content">
            <div>
                <div
                    class="goods-title"
                    :class="[item.sub_name? 'omit-1': 'omit-2']"
                >
                    <span class="group-label" v-if="!isPreheat">
                        {{getGroupsNum }}
                    </span>
                    {{item.title}}
                </div>
                <div
                    class="goods-sub-title line-hide"
                    v-if="item.sub_name"
                >
                    {{item.sub_name}}
                </div>
            </div>
            <!-- 倒计时 -->
            <slot name="countdown" :data='item'></slot>
            <div class="goods-price-box">
                <div class="goods-price">
                    <div class="group-price">
                        <span class="name">拼团价</span>
                        <span class="price">
                            <span class="unit">￥</span>
                            {{getGroupsPrice| formatMoney}}
                        </span>
                    </div>
                    <div class="original-price">
                        <span class="name">单买价</span>
                        <span class="price">
                            <span class="unit">￥</span>
                            {{ getPrice | formatMoney }}
                        </span>
                    </div>
                </div>
                <div
                    class="buy-btn"
                    v-if="hasBtn"
                    @click="clickGood"
                >马上拼</div>
            </div>
        </div>
    </div>
</template>

<script>
let throttleImgLoad = null;
export default {
    name: 'GoodsGroup',
    props: {
        item: {
            type: Object,
            default: () => { }
        },
        hasBtn: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            preloading: true,
            loading: {},
            timestamp: null,
            dateTimer: null
        };
    },
    computed: {
        getLoadingSrc() {
            if (this.$store.state.setting.systemSetting?.basic?.loading) {
                return this.$store.state.setting.cacheLoadingImg || this.$utils.mediaUrl(this.$store.state.setting.systemSetting?.basic?.loading)
            } else {
                return this.$utils.staticMediaUrl('decorate/goods_col2.png')
            }
        },
        getGroupsPrice() {
            let info = this.item.activities?.groups || this.item.activities?.preheat_activity || {}
            if(this.item.has_option == 0 && info.inner_type=='0') {
                return info.activity_price
            } else {
              return info?.price_range?.min_price || 0
            }
        },
        getPrice(){
            if(this.item.has_option == '1'){
                return this.item.price
            } else {
                return this.item.min_price
            }
        },
        isPreheat() {
            return this.item.activities?.preheat_activity
        },
        getGroupsNum() {
            let groups =  this.item?.activities?.groups;
            if (groups?.inner_type == 0) {
                return `${groups?.rules?.success_num}人团`;
            } else {
                return '阶梯团';
            }
        }
    },
    mounted() {
        setTimeout(() => {
            this.preloading = false; //强行终止图片加载效果
        }, 3000)
    },
    methods: {
        loaded(url) {
            if (url) {
                let src = url.replace(/\./g, '_');
                this.loading[src] = false;
                clearTimeout(throttleImgLoad)
                throttleImgLoad = setTimeout(() => {
                    this.loading = {
                        ...this.loading
                    }
                }, 100)
            }
        },
        clickGood() {
            this.$emit('on-click', this.item)
        },
    },
    filters: {
        formatMoney(money) {
            if (typeof money === 'number' || (typeof money === 'string' && money.trim() !== '')) {
                if (money >= 10000) {
                    return parseInt(money / 100) / 100 + '万'
                } else {
                    return parseFloat(money)
                }
            } else {
                return 0
            }
        },
    }

};
</script>

<style lang="scss" scoped>
.goods-group {
    display: flex;
    align-items: center;
    padding: px2rpx(8) px2rpx(12);
    border-radius: px2rpx(6);
    background: #fff;
    .image-box {
        position: relative;
        width: px2rpx(110);
        height: px2rpx(110);
        border-radius: px2rpx(6);
        overflow: hidden;
        flex-shrink: 0;
        .goods-img {
            width: 100%;
            height: 100%;
            border-radius: px2rpx(6);
        }
    }
    .goods-content {
        padding-left: px2rpx(12);
        flex: 1;
        width: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: px2rpx(110);
        .goods-sub-title {
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            color: #969696;
            padding-top: px2rpx(4);
        }
        .goods-price-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .group-price,
        .original-price {
            .name {
                margin-right: px2rpx(4);
            }
        }

        .group-price {
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            color: #ff3c29;
            padding-top: px2rpx(4);
            padding-bottom: px2rpx(2);
            .price {
                font-size: px2rpx(16);
                font-weight: bold;
                line-height: px2rpx(23);
            }

            .unit {
                font-size: px2rpx(12);
                line-height: px2rpx(17);
            }
        }
        .original-price {
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            color: #969696;
        }

        .buy-btn {
            border-radius: px2rpx(24);
            width: px2rpx(64);
            height: px2rpx(27);
            font-size: px2rpx(12);
            font-weight: bold;
            text-align: center;
            line-height: px2rpx(27);
            color: #ffffff;
            background: linear-gradient(
                114.57deg,
                #ff8a00 19.05%,
                #ff4c14 87.67%
            );
        }
    }
}

.group-label {
    font-size: px2rpx(10);
    line-height: px2rpx(14);
    padding: px2rpx(1) px2rpx(4);
    color: #ff6f29;
    background: #fff9f0;
    border: px2rpx(1) solid #ffdaa3;
}

.goods-title {
    font-size: px2rpx(14);
    line-height: px2rpx(20);
    color: #212121;
    .group-label {
        border-radius: px2rpx(2);
        margin-right: px2rpx(2);
    }
}
.omit-1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.omit-2 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
</style>
