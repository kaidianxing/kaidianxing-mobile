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
        <view class="order-comment-list">
            <view class="container">
                <!-- 商品信息 -->
                <view class="goods-item" v-for="(item, index) in list" :key="index">
                    <goods-card :goodsData="item">
                        <template slot="btn">
                            <view class="comment-btn theme-primary-color theme-primary-border" @click="toComment(item.id)">去评价</view>
                        </template>
                    </goods-card>
                </view>
                <!--加载更多  -->
                <page-loading v-if="list.length != count" :loadingType="loadingType"></page-loading>
            </view>
        </view>
    </page-box>
</template>

<script>
    import goodsCard from '../components/GoodsInfo'
    import PageMixin from '@/common/PageMixin.js'
    export default {
        mixins: [PageMixin],
        name: "list",
        components: {
            goodsCard
        },
        props: {},
        data() {
            return {
                order_id: '',
                page: 1,
                loading: false,
                count: 0,
                list: [],
            }
        },
        computed: {
            loadingType() {
                let loadingType = 0;
                if (this.loading) {
                    loadingType = 1
                } else if (this.list.length == this.count && this.count > 0 && this.loading == false && this.list.length > 20) {
                    loadingType = 2
                }
                return loadingType
            }
        },
        created() {
        },
        mounted() {
            this.order_id = this.$Route.query.order_id;
            this.getList()
        },
        methods: {
            getList() {
                this.$api.orderApi.getCommentList({page: this.page, order_id: this.order_id}).then(res => {
                    if (res.error == 0) {
                        if (res.list.length > 0) {
                            this.list = this.list.concat(res.list);
                            this.page = this.page + 1;
                        }
                        this.loading = false;
                        this.count = res.total;
                    } else {
                        uni.showToast({
                            title: res.message,
                            icon: 'none'
                        })
                    }
                    this.graceLazyload.load(0, this);
                })
            },
            toComment(id) {
                this.$Router.auto({
                    path: '/kdxOrder/comment/index',
                    query: {
                        id: id
                    }
                })
            }
        },
        onReachBottom: function() {
            //避免多次触发
            this.getList();
        },
        onPageScroll(e) {
            this.graceLazyload.load(e.scrollTop, this);
        },
    }
</script>

<style lang="scss" scoped>
    .order-comment-list {
        padding: 16rpx 24rpx;
        .container {
            .goods-item {
                padding: 32rpx 24rpx 16rpx;
                background-color: #fff;
                border-radius: 12rpx;
                overflow: hidden;
            }
            .comment-btn {
                margin-top: 32rpx;
                font-size: 24rpx;
                line-height: 34rpx;
                padding: 10rpx 28rpx;
                border: 1px solid $uni-color-primary;
                color: $uni-color-primary;
                border-radius: 40rpx;
            }
        }
    }
</style>