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
    <page-box>
        <view class="search-index">
            <search-input v-model="type" from="search" @confirm="confirm"></search-input>
            <view class="search-box">
                <block v-if="searchKeyHistory.length > 0">
                    <div class="grace-title">
                        <span class="grace-title-text uni-text-color">历史记录</span>
                        <span class="grace-text-small grace-gray grace-icons icon-remove" @tap="removeAll"><i class="iconfont-m- icon-m-other-delete"></i>清空</span>
                    </div>
                    <div class="grace-search-tags grace-wrap">
                        <div v-for="(item, index) in searchKeyHistory" :key="index" :data-key="item"
                                class="grace-search-tags-items" @click="setKey(item)">{{item}}
                        </div>
                    </div>
                </block>
                <!--<view class="grace-title" style="margin-top:15rpx;">
                    <text class="grace-title-text grace-black">热门搜索</text>
                </view>
                <view class="grace-search-tags grace-wrap">
                    <view v-for="(item, index) in HotKeyHistory" :key="index" :data-key="item"
                          class="grace-search-tags-items" @tap="setKey">{{item}}
                    </view>
                </view>-->
            </view>
        </view>
    </page-box>
</template>

<script>
    import PageMixin from '@/common/PageMixin.js'
    import SearchInput from "../components/search/SearchInput";
    export default {
        mixins: [PageMixin],
        components: {
            SearchInput
        },
        props: {},
        data() {
            return {
                id: '',
                searchKey: '',
                searchKeyHistory: [],
                HotKeyHistory: [],
                oldHistory: [], // 缓存中的
                placeAccount: true,
                focus:false,
                showType: false,
                type: '商品',
                typeList: ['商品','店铺']
            }
        },
        mounted() {
            this.focus = true
            this.id = this.$Route.query.id || '';
            if (this.localStorage.getItem('searchKeyHistory')) {
                this.oldHistory = JSON.parse(this.localStorage.getItem('searchKeyHistory'))
                this.searchKeyHistory = this.oldHistory;
            }
        },
        methods: {
            inputting(e) {
                this.placeAccount = false;
            },
            confirm(e) {
                let value = e.detail?.value?.trim() || '';
                this.$Router.replace({
                    path: '/kdxGoods/goodList/index',
                    query: {
                        keywords: value,
                        id: this.id
                    }
                });
                if (value) {
                    this.oldHistory.push(value);
                    this.localStorage.setItem('searchKeyHistory', JSON.stringify(this.oldHistory));
                }
            },
            setKey(data) {
                this.placeAccount = false;
                this.searchKey = data;
                this.$Router.replace({
                    path: '/kdxGoods/goodList/index',
                    query: {
                        keywords: data,
                        id: this.id
                    }
                })
            },
            removeAll() {
                this.searchKeyHistory = [];
                this.oldHistory = [];
                this.localStorage.removeItem('searchKeyHistory')
            },
            handleBlur() {
                if (!this.searchKey) {
                    this.placeAccount = true
                }
            },
            searchBtn() {
                this.confirm({
                    detail: {
                        value: this.searchKey
                    }
                })
            },
            chooseType() {
                this.showType = !this.showType
            },
            changeType(item) {
                this.type = item;
                this.showType = false
            }
        },
    }
</script>

<style lang="scss">
    .search-index {
        height: 100vh;
        background-color: #fff;
        .grace-title {
            display: flex;
            justify-content: space-between;
            padding: 0;
            line-height: 40rpx;
            .grace-title-text {
                font-weight: 700;
            }
            .iconfont-m- {
                margin-right: 8rpx;
                font-size: 24rpx;
                color: $uni-text-color-grey;
                vertical-align: bottom;
            }
        }
        .grace-search-tags {
            display: flex;
            flex-wrap: wrap;
            margin-top: 48rpx;
        }
        .search-box {
            padding: 16rpx 24rpx;
        }
        .grace-search-tags-items {
            padding: px2rpx(4) px2rpx(12);
            width: fit-content;
            line-height: px2rpx(17);
            border-radius: 25rpx;
            margin-right: 24rpx;
            margin-bottom: 32rpx;
            font-size: 24rpx;
            color: #565656;
            background-color: $uni-bg-color-grey;
        }
    }
</style>
