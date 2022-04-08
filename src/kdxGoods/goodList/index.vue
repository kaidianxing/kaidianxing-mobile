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
        <Skeleten v-if='isSkeleton && loadingFlg < 1'></Skeleten>
        <view class="goods-list">
            <view class="block">
                <search-input :keywords="search.title"></search-input>
                <!-- 标题栏 -->
                <nav-bar :show_style="show_style" :search="search" @getList="getList" @showStyle="showStyle" @changeType="changeType" @showDrawer="handleShowDrawer"></nav-bar>
            </view>
            <view class="container">
                <!-- 商品列表 -->
                <goods-list :list="list" :show_style="show_style"  @custom-event='eventHandler'></goods-list>
                <!--加载更多  -->
                <page-loading v-if="list.length != count" :loadingType="loadingType"></page-loading>
            </view>
            <block v-if="!loading && count <= 0">
                <!-- 缺省页 -->
                <view class='default-page flex-column'>
                    <view class="bg">
                        <image :src="$utils.staticMediaUrl('default/search.png')"></image>
                    </view>
                    <view class='default-text'>没找到相关宝贝</view>
                </view>
                <!-- 猜你喜欢 -->
                <goods-like></goods-like>
            </block>
        </view>
        <template slot="fixed">
            <graceDrawer :show="showDrawer" @closeDrawer="closeDrawer" direction="right" width="636rpx" padding="0">
                <div class="screen-content" slot="links">
                    <goods-screen :list="cateList"
                        :template="template"
                        :choseMenuData="choseMenu"
                        @reset="reset"
                        @confirmCate="confirmCate">
                    </goods-screen>
                </div>
            </graceDrawer>
        </template>
        <!-- 多规格选择 -->
        <goods-picker
            ref="goodsPicker"
            @custom-event="customEventHandler"
        ></goods-picker>
    </page-box>
</template>

<script>
    import SearchInput from "../components/search/SearchInput";
    import navBar from '../components/goodsList/NavBar'
    import goodsList from '../components/goodsList/GoodsList'
    import graceDrawer from "../components/goodsList/graceDrawer.vue"
    import goodsScreen from '../components/goodsList/GoodsScreen'
    import goodsLike from '../components/goods/GoodsLike'
    import Skeleten from '../components/goodsList/Skeleten'
    import PageMixin from '@/common/PageMixin.js'
    import goodsPicker from "@/components/goods/GoodsPicker"
    import CartAdder from '@/components/goods/addCartTools.js'

    export default {
        mixins: [PageMixin],
        components: {
            SearchInput,
            navBar,
            goodsList,
            graceDrawer,
            goodsScreen,
            goodsLike,
            Skeleten,
            goodsPicker,
        },
        created(){
            // #ifndef MP-TOUTIAO
            this.$loading.showLoading();
            // #endif
        },
        props: {},
        data() {
            return {
                showDrawer: false,
                show_style: false, // 列表 false 瀑布流
                cartAdder:null,//添加购物车类对象
                search: {
                    title: '',
                    category_id: '',
                    sort: '',
                    select: [],
                    by: '',
                },
                list: [],
                cateList: [], // 分类列表
                template: 0,
                choseMenu: {},
                page: 1,
                loading: false,
                count: 0,
                placeAccount: true,
                showSkeleten: true,
                reqesting: false,
            };
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
            }
        },
        watch: {},
        mounted() {
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
            // 去除参数中间的空格
            this.search.title = this.$Route.query.keywords ? this.$Route.query.keywords.replace(/%20/g, ' ') : '';
            this.search.category_id = this.$Route.query.category_id ? this.$Route.query.category_id : '';
            if (this.search.title) {
                this.placeAccount = false
            }
            this.getList();
            this.getCategory()
        },
        methods: {
            async eventHandler(e){
                // 判断登录
                await this.$store.dispatch('quickPurchase/checkLoginStatus')
                // 获取商品详情
                this.cartAdder.getGoodDetail(e.data.goods_id).then((res) => {
                    if (res.error === 0) {
                        if( res?.data?.goods?.type == '2' && !res?.plugin_account?.virtualAccount) {
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
            getList() {
                if (!this.reqesting) {
                    this.reqesting = true;
                    let obj = {
                        ...this.search,
                        page: this.page,
                        get_activity: 1
                    };
                    this.loading = true;
                    this.$api.goodApi.goodList(obj).then(res => {
                        if (res.list.length > 0) {
                            this.list = this.list.concat(res.list);
                        }
                        this.page = this.page + 1;
                        this.loading = false;
                        this.count = res.total;
                        this.graceLazyload.load(0, this);
                        this.reqesting = false
                    }).catch(res=>{
                        this.reqesting = false
                    }).finally(rej => {
                        this.$loading.hideLoading();
                        setTimeout(() => { //解决loading关不掉的bug
                            this.$loading.hideLoading();
                            this.showSkeleten = false;
                        }, 100)
                    })
                }
            },
            getCategory() {
                // 获取分类列表
                // 默认右侧数据是第一个
                this.$api.goodApi.categoryList().then(res => {
                    if (res.level == 1) {
                        res.list = res.list.filter(item => item.children.length > 0);
                    }
                    if (res.level == 2) {
                        let level1 = res.list.filter(item => item.children.length > 0);
                        let result = level1.filter(item => {
                            for (let i = 0; i < item.children.length; i ++) {
                                if (item.children[i].children.length>0) {
                                    return item
                                }
                            }
                        });
                        res.list = result
                    }
                    this.cateList = res.list;
                    this.template = res.level;
                })
            },
            // 改变商品展现样式
            showStyle() {
                this.show_style = !this.show_style
            },
            closeDrawer() {
                this.showDrawer = false;
            },
            handleShowDrawer() {
                this.showDrawer = true;
            },
            confirmCate(data) {
                this.search.category_id = data.category_id;
                this.choseMenu = data.choseMenu;
                this.list = [];
                this.page = 1;
                this.getList();
                this.showDrawer = false
            },
            reset() {
                this.choseMenu = {};
                this.search.category_id = '';
                this.list = [];
                this.page = 1;
                this.getList();
                this.showDrawer = false
            },
            changeType(search) {
                this.list = [];
                this.page = 1;
                this.search = { ...search
                };
                this.getList()
            }
        },
        onPullDownRefresh() {
            this.choseMenu = {};
            this.list = [];
            this.page = 1;
            this.getList();
            this.showDrawer = false;
            setTimeout(() => {
                uni.stopPullDownRefresh();
            }, 1000);
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
    };
</script>

<style lang="scss" scoped>
    .goods-list {
        position: relative;
        min-height: 100vh;
        overflow: auto;
        .block {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            z-index: 999;
        }
        .container {
            padding: 188rpx 24rpx 16rpx;
        }
        .search-content {
            background-color: #fff;
            .search-input {
                background-color: $uni-bg-color-grey;
            }
        }
    } // .grace-drawer-shade {
    //     position: absolute;
    //     bottom: 0;
    // }
    .screen-content {
        height: 100%;
        overflow: auto;
    }
</style>
