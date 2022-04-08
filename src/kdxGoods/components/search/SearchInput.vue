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
    <div>
        <!-- 顶部搜索框 -->
        <view class="search-content">
            <view class="search-content-input" @click="handleSearch">
                <input v-if="from === 'search'" class="search-input" :focus="focus" type="text" v-model="searchKey" @input="inputting" @blur="handleBlur" @confirm="searchBtn"/>
                <span class="keywords" v-else>{{keywords}}</span>
                <i class="iconfont-m- icon-m-shangpinxiangqing-search"></i>
                <span class="placeholder uni-text-color-grey" v-if="placeAccount&&from !== 'search'">搜索商品</span>
            </view>
            <view v-if="from==='search'" class="search-btn" @click="searchBtn">搜索</view>
        </view>
    </div>
</template>

<script>
    export default {
        name: "SearchInput",
        components: {},
        props: {
            value: {
                type: String,
                default: '商品'
            },
            from: {
                type: String,
                default: ''
            },
            keywords:{
                type: String,
                default: ''
            }
        },
        data() {
            return {
                focus:false,
                placeAccount: true,
                searchKey: '',
                showType: false,
                typeList: ['商品','店铺']
            }
        },
        computed: {},
        watch: {
            keywords: {
                handler(val) {
                    if (val) {
                        this.placeAccount = false
                    }
                },
                immediate: true
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            inputting(e) {
                this.placeAccount = false;
            },
            handleBlur() {
                if (!this.searchKey) {
                    this.placeAccount = true
                }
            },
            searchBtn() {
                this.$emit('confirm',{
                    detail: {
                        value: this.searchKey
                    }
                })
            },
            chooseType() {
                if (this.from !== 'search') {
                    return
                }
                this.showType = !this.showType
            },
            changeType(item) {
                if (this.from !== 'search') {
                    return
                }
                this.$emit('input',item)
                this.showType = false
            },
            // 其余页面点击跳转到搜索页
            handleSearch() {
                if (this.from === 'search') {
                    return
                }
                this.$Router.auto({
                    path: '/kdxGoods/search/index'
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
    .search-content {
        display: flex;
        align-items: center;
        background-color: #fff;
        .search-input {
            background-color: $uni-bg-color-grey;
        }
        .search-content-input {
            flex: 1;
            background-color: $uni-bg-color-grey;
            border-radius: 12rpx;
        }
        .search-btn {
            text-align: center;
            width: 80rpx;
            flex-shrink:0 ;
            padding-left: 16rpx;
            color: #262B30;
            font-size: 24rpx;
            line-height: 16rpx;
        }
        .keywords {
            padding-left: px2rpx(34);
            line-height: px2rpx(28);
        }
        &.merchant {
            .type {
                align-items: center;
                padding-left: px2rpx(16);
                /*width: px2rpx(61);*/
                flex-shrink: 0;
                line-height: px2rpx(30);
                font-size: px2rpx(12);
                .line {
                    margin-left: px2rpx(8);
                    width: 1px;
                    height: px2rpx(14);
                    background-color: $uni-border-color;
                    /*transform: scaleX(0.5);*/
                }
            }
            .input-box {
                width: 100%;
            }
            .search-input {
                border-radius: px2rpx(35);
            }
            .icon-m-arrow-down {
                margin-left: px2rpx(2);
                font-size: px2rpx(10);
                color: #c4c4c4;
            }
            .icon-m-shangpinxiangqing-search {
                left: px2rpx(80);
            }
            .placeholder {
                left: px2rpx(38);
            }
            .search-content-input {
                background-color: $uni-bg-color-grey;
                border-radius: px2rpx(35);
                &.no-search {
                    .icon-m-shangpinxiangqing-search {
                        left: px2rpx(22);
                    }
                }
            }
        }
    }
    .search-input-box {
        position: relative;
    }
    .type-selector {
        position: absolute;
        left: px2rpx(12);
        top: px2rpx(50);
        padding: 0 px2rpx(12);
        background-color: #fff;
        border-radius: px2rpx(6);
        box-shadow: 0 0 px2rpx(6) rgba(0, 0, 0, 0.1);
        .icon-m-arrow-up {
            position: absolute;
            left: 50%;
            top: px2rpx(-16);
            width: px2rpx(24);
            height: px2rpx(24);
            font-size: px2rpx(24);
            color: #fff;
            transform: translateX(-50%);
        }
        .type-item {
            width: px2rpx(56);
            height: px2rpx(44);
            line-height: px2rpx(44);
            font-size: px2rpx(14);
            text-align: center;
            &.van-hairline--bottom:after {
                border-bottom-color: $uni-border-color;
                border-style: solid;
            }
        }
    }
</style>
