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
        <view class="order-list">
            <!-- 商品列表 -->
            <view class="container">
                <list-goods-card :list="list"></list-goods-card>

                <!-- 缺省页 -->
                <view class="empty-list" v-if="list.length == 0 && !loading && count <= 0">
                    <view class="bg">
                        <image class="empty-img" :src="$utils.staticMediaUrl('default/cart.png')" />
                    </view>
                    <view class="empty-text">您暂时还没有售后订单哦</view>
                </view>

                <!--加载更多  -->
                <page-loading v-if="list.length != count" :loadingType="loadingType"></page-loading>
            </view>
        </view>
    </page-box>
</template>

<script>
import listGoodsCard from '../components/refund/list/ListGoodsCard'
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    name: 'list',
    components: {
        listGoodsCard
    },
    props: {},
    data() {
        return {
            status: 'all',
            list: [],
            page: 1,
            loading: false,
            count: 0,
            id: '',
            isLoad: false
        }
    },
    computed: {
        loadingType() {
            let loadingType = 0;
            if (this.loading) {
                loadingType = 1
            } else if (this.list.length == this.count && this.count > 0 && this.loading == false) {
                loadingType = 2
            }
            return loadingType
        },
    },
    onLoad() {
        this.getList()
    },
    onShow() {
        if (this.isLoad) {
            this.list = []
            this.page = 1
            this.getList()
        }
    },
    methods: {
        getList() {
            // uni.showLoading({title:'加载中'})
            this.loading = true
            this.$api.orderApi
                .refundList({
                    page: this.page
                })
                .then(res => {
                    if (res.error == 0) {
                        if (res.list.length > 0) {
                            this.list = this.list.concat(res.list)
                        }
                        this.page = this.page + 1
                        this.loading = false
                        this.isLoad = true
                        this.count = res.total
                    } else {
                        uni.showToast({
                            title: res.message,
                            icon: 'none'
                        })
                    }
                    this.graceLazyload.load(0, this)
                })
                .finally(() => {
                    uni.hideLoading()
                })
        }
    },
    onReachBottom() {
        if (this.list.length == this.count && this.page > 1) return;
        this.getList()
    },
    //页面滚动时启动懒加载
    //此处如果图片在滚动区域内则监听滚动区域事件并传递 滚动区域的 scrollTop 值给 load函数
    onPageScroll(e) {
        this.graceLazyload.load(e.scrollTop, this);
    },
    onPullDownRefresh: function() {
        this.list = []
        this.page = 1
        this.getList()
    }
}
</script>

<style lang="scss" scoped>
.order-list {
    position: relative;
    min-height: 100vh;
    overflow: auto;
    background-color: $uni-bg-color-grey;
    .container {
        padding: 32rpx 24rpx 16rpx;
    }

    .empty-list {
        padding-top: 64rpx;
        .bg {
            text-align: center;
        }

        .empty-img {
            height: 176rpx;
            width: 176rpx;
        }

        .empty-text {
            margin-top: 32rpx;
            font-size: 24rpx;
            text-align: center;
            line-height: 34rpx;
            color: #969696;
        }
    }

    /deep/ .img-list {
        &-items {
            margin-right: 24rpx;
            margin-bottom: 16rpx;
            height: 140rpx;
            width: 140rpx;
            border: 0;

            &:nth-child(4n) {
                margin-right: 0;
            }

            .price {
                position: absolute;
                bottom: 0;
                left: 0;
                border-radius: 0px 0px 4rpx 4rpx;
                width: 100%;
                height: 32rpx;
                font-size: 16rpx;
                text-align: center;
                line-height: 32rpx;
                color: #fff;
                background: rgba(#212121, 0.7);
            }
        }
    }
}
</style>