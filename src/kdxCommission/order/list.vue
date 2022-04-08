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
        <view class="commission-order-list">
            <!-- tab切换 -->
            <list-tab :status="status" :current="type" @changeTab="changeTab"></list-tab>
            <!-- 商品列表 -->
            <view class="container">
                <block v-if="list.length > 0">
                    <order-goods-card :list="list"></order-goods-card>
                    <!--加载更多  -->
                    <page-loading v-if="list.length != count" :loadingType="loadingType"></page-loading>
                </block>
                <block v-if="count <= 0">
                    <!-- 缺省页 -->
                    <view class='default-page flex-column'>
                        <view class="bg">
                            <image :src="$utils.staticMediaUrl('default/bill.png')"></image>
                        </view>
                        <view class='default-text'>您暂时还没有订单哦</view>
                    </view>
                </block>
            </view>
        </view>
    </page-box>
</template>

<script>

    import listTab from '../components/ListTab'
    import orderGoodsCard from '../components/order/OrderGoodsCard'
    import PageMixin from '@/common/PageMixin.js'
    export default {
        mixins: [PageMixin],
        name: "list",
        components: {
            listTab,
            orderGoodsCard
        },
        props: {},
        data() {
            return {
                list: [],
                page: 1,
                loading: false,
                count: 0,
                type: 'all',
                status: [
                    {
                        text: '全部',
                        type: 'all'
                    },
                    {
                        text: '待付款',
                        type: 'wait'
                    },
                    {
                        text: '已付款',
                        type: 'pay'
                    },
                    {
                        text: '已完成',
                        type: 'finish'
                    },
                ],
                apiObj: {
                    all: 'allCommissionOrder',
                    wait: 'waitCommissionOrder',
                    pay: 'payCommissionOrder',
                    finish: 'finishCommissionOrder',
                },
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
            this.$store.dispatch('commissionSet/getCommissionSetting').then(res => {
                if(res.error==0&&res.commission_order) {
                    uni.setNavigationBarTitle({
						title: res.commission_order
					});
                }
            })
        },
        mounted() {
            
			
            this.getList()
        },
        methods: {
            changeTab(type) {
                this.type = type;
                this.page = 1;
                this.list = [];
                this.getList()
            },
            getList() {
                this.loading = true;
                // uni.showLoading({title:'加载中'})
                this.$api.commissionApi[this.apiObj[this.type]]({page: this.page}).then(res => {
                    if (res.error == 0) {
                        if (res.list.length > 0) {
                            this.list = this.list.concat(res.list);
                            this.page = this.page + 1;
                        }
                        this.loading = false;
                        this.count = res.total;
                    } else {
                        this.$toast(res.message)
                    }
                    this.graceLazyload.load(0, this);
                }).finally(rej => {
                    uni.hideLoading()
                })
            },
        },
        onReachBottom: function() {
            //避免多次触发
            this.getList()
        },
        onPageScroll(e) {
            this.graceLazyload.load(e.scrollTop, this)
        }
    }
</script>

<style lang="scss" scoped>
    .commission-order-list {
        position: relative;
        min-height: 100vh;
        overflow: auto;
        box-sizing: border-box;
        .container {
            padding: 102rpx 24rpx 16rpx;
        }
    }
</style>