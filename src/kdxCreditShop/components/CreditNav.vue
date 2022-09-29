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
    <view class="goodsList-nav-bar">
        <view class="tab flex">
            <div class="item" :class="chooseType == 'create_time'?'active':''" @click="changeType('create_time')">
                综合<span class="line"></span>
            </div>
            <view class="item flex" :class="chooseType == 'sales'?'active':''">
                <div @click="changeType('sales')">销量</div>
                <view class="icon-arrow">
                    <p :class="search.sale_sort=='asc'&&chooseType=='sales'?'iconfont-m- icon-m-arrow-up red-color':'iconfont-m- icon-m-arrow-up'"></p>
                    <p :class="search.sale_sort=='desc'&&chooseType=='sales'?'iconfont-m- icon-m-arrow-down red-color':'iconfont-m- icon-m-arrow-down'"></p>
                </view>
                <span class="line"></span>
            </view>
            
        </view>
    </view>
</template>

<script>
export default {
    name: "creditNav",
    components: {},
    props: {
        show_style: {
            type: Boolean,
            default: true
        },
        search: {
            type: Object
        }
    },
    data() {
        return {
            chooseType: 'create_time',
            sale_sort: 'desc',
        }
    },
    methods: {
        changeType(type) {
            let search = this.search;
            this.chooseType = type;
            if (type == 'create_time') {
                search.sale_sort = ''
            } else if (type == 'sales') {
                search.sale_sort = search.sale_sort == 'desc' ? 'asc' : 'desc';
            }
            this.$emit('changeType', search);
        },
        // 改变商品展现样式
        showStyle() {
            this.$emit('showStyle')
        },
        showDrawer() {
            this.$emit('showDrawer')
        }
    },
}
</script>

<style lang="scss" scoped>
    .goodsList-nav-bar {
        .tab {
            background-color: #fff;
            // border-bottom: 1rpx solid $uni-border-color;
            position: relative;
            &:after {
                content: '';
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 1px;
                background-color: $uni-border-color;
                transform: scaleY(0.5);
            }
            .item {
                -webkit-box-flex: 1;
                -ms-flex: 1;
                -webkit-flex: 1;
                flex: 1;
                text-align: center;
                line-height: 80rpx;
                font-size: 28rpx;
                color: #565656;
                position: relative;
                .icon-arrow {
                    .iconfont-m- {
                        display: block;
                        //#ifdef H5
                        font-size: 12rpx;
                        //#endif
                        font-size: 24rpx;
                        line-height: 16rpx;
                        color: #9b9b9b;
                        transform: scale(0.7);
                    }
                    .icon-m-arrow-down {
                        margin-top: -2px;
                    }
                    .red-color {
                        color: $uni-color-primary;
                    }
                }

                .line {
                    width: 56rpx;
                    height: 4rpx;
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    display: none;
                    background-color: transparent;
                    transform: translateX(-50%);
                    z-index: 1;
                }
            }
            .item.flex {
                justify-content: center;
                align-items: center;
            }
            .item.active {
                font-size: 32rpx;
                color: $uni-text-color;
                font-weight: 600;
                .line {
                    display: block;
                    background-color: $uni-color-primary;
                    border-radius: 6rpx;
                }
            }
            .item.show-style {
                flex: 0;
                width: 100rpx;
                &::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    width: 1px;
                    height: 40rpx;
                    margin-top: -20rpx;
                    background-color: rgba(0,0,0,.2);
                }
                .iconfont-m- {
                    flex: initial;
                    font-size: 40rpx;
                    padding: 0 26rpx;
                    vertical-align: middle;
                }
            }
        }
    }
</style>