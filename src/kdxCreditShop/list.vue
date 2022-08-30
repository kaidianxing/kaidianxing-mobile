<template>
    <page-box>
        <view class="credit-list">
            <!-- 顶部搜索 -->
            <view class="search-content">
                <view class="search-content-input">
                    <input v-model="search.keyword" class="search-input" type="text" placeholder="搜索商品" @confirm="handleSearch"/>
                    <i class="iconfont-m- icon-m-shangpinxiangqing-search"></i>
                </view>
            </view>
            <!-- 筛选导航 -->
            <credit-nav :show_style="show_style" :search="search" @getList="getList" @showStyle="showStyle" @changeType="changeType" @showDrawer="handleShowDrawer"></credit-nav>
            <block v-if="!loading && count <= 0">
                <!-- 缺省页 -->
                <view class='default-page flex-column'>
                    <view class="bg">
                        <image :src="$utils.staticMediaUrl('default/search.png')"></image>
                    </view>
                    <view class='default-text'>没找到相关宝贝</view>
                </view>
            </block>
            <view class="credit-goods" v-if="list.length > 0">
                <credit-goods :goods-list="list" @addCart="addCart"></credit-goods>
                <!--加载更多  -->
                <page-loading v-if="list.length != count" :loadingType="loadingType"></page-loading>
            </view>
        </view>

        <!-- 多规格选择 -->
        <goods-picker ref="goodsPicker" from="creditShop"  @custom-event="customEventHandler"></goods-picker>

    </page-box>
</template>

<script>
import CreditGoods from "./components/CreditGoods"
import CreditNav from "./components/CreditNav"
import GoodsPicker from "@/components/goods/GoodsPicker";
import CartAdder from './components/addCartTools.js'

export default {
    name: 'goodsList',
    components: {
        CreditGoods,
        CreditNav,
        GoodsPicker
    },
    data() {
        return {
            list: [],
            page: 1,
            count: 0,
            loading: false,
            showDrawer: false,
            show_style: false,
            search: {
                sale_sort: '',
                keyword: ''
            },
        }
    },
    mounted() {
        this.getList();
        // 快速购买处理
        this.cartAdder = new CartAdder((e) => {
            if (e.type == 'toggle') {
                if (this.$refs.goodsPicker.showmodal && e.data.errorInfo) {
                    this.$toast(e.data.errorInfo)
                } else {
                    this.$refs?.goodsPicker.toggle(this.cartAdder.pickerCallback, e.data?.type);
                }
            }
        });
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
    methods: {
        handleSearch() {         
            this.list = [];
            this.getList();
        },
        showStyle() {
            this.show_style = !this.show_style;
        },
        handleShowDrawer() {
            this.showDrawer = false;
        },
        changeType(search) {
            this.list = [];
            this.page = 1;
            this.search = {...search};
            this.getList();
        },
        getList() {
            let parmas = this.search;
            this.$api.creditShopApi.getCreditShopList({...parmas}).then(res => {
                if (res.error === 0) {
                    if (res.list.length>0) {
                        this.list = this.list.concat(res.list);
                    }
                    this.page = this.page + 1;
                    this.count = res.total;
                    this.loading = false;
                    this.graceLazyload.load(0, this)
                }
            })
        },
        async addCart(e){
            // 判断登录
            await this.$store.dispatch('creditQuickPurchase/checkLoginStatus')
            // 获取商品详情
            this.cartAdder.getGoodDetail(e.goods_id).then((res) => {
                if (res.error === 0) {
                    if( res?.data?.goods?.type == '2' && !res?.plugin_account?.virtualAccount ||  res?.data?.goods?.type == '3' && !res?.plugin_account?.appointment) {
                        this.$toast('商品暂时无法购买');
                        return
                    }else {
                        // 打开goodsPicker
                        this.cartAdder.callback({
                            type: 'toggle',
                            data: {
                                type: 'spec'
                            },
                        })
                    }
                }
            })
        },
        //规格选完回来
        async customEventHandler(e) {//快速购买处理
            await this.cartAdder.pickerCallback(e);
            this.$refs?.goodsPicker.toggle(); // 购物车添加成功关闭弹窗
        },
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
}
</script>

<style lang="scss" scoped>

    .credit-goods {
        padding: px2rpx(8) px2rpx(12);
    }
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
            // input {
            //     text-indent: px2rpx(6);
            // }
            i {
                padding-top: px2rpx(2);
            }
        }
        .search-btn {
            padding-left: 16rpx;
            color: #262B30;
            font-size: 24rpx;
            line-height: 16rpx;
        }
        .keywords {
            padding-left: px2rpx(34);
            line-height: px2rpx(28);
        }
    }
    .default-page {
        margin-top: 30%;
    }
</style>
