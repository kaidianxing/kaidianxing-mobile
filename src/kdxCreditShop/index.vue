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
    <page-box>
        <div class="credit-shop" v-if="status">
            <!-- 积分信息 -->
            <credit-info :user-info="userInfo"></credit-info>
            <!-- 按钮组 -->
            <credit-btn></credit-btn>
            <!-- 广告图 -->
            <img class="credit-adv" :src="$utils.staticMediaUrl('creditShop/credit_adv.jpg')" alt="">
            <!-- 商品列表 -->
            <div v-if="list.length > 0">
                <credit-goods :goods-list="list" @addCart="addCart"></credit-goods>
                <!--加载更多  -->
                <page-loading v-if="list.length != count" :loadingType="loadingType"></page-loading>
            </div>
        </div>

        <!-- 缺省图 -->
        <default-page v-else title="页面暂停访问" desc="请联系商城管理员" btn="去首页" btnCalss="theme-primary-border theme-primary-color"
                      :imgUrl="$utils.staticMediaUrl('have_no_browse_perm.png')" @btnClick="toIndex"></default-page>

        <!-- 多规格选择 -->
        <goods-picker ref="goodsPicker" from="creditShop"  @custom-event="customEventHandler"></goods-picker>

    </page-box>
</template>

<script>
    import CreditInfo from './components/index/CreditInfo'
    import CreditBtn from "./components/index/CreditBtn";
    import CreditGoods from "./components/CreditGoods";
    import GoodsPicker from "@/components/goods/GoodsPicker";
    import CartAdder from './components/addCartTools.js'
    import {mapGetters, mapState} from "vuex";

    export default {
        name: "index",
        components: {
            CreditInfo,
            CreditBtn,
            CreditGoods,
            GoodsPicker
        },
        props: {},
        data() {
            return {
                status: 1,
                userInfo: {
                    nickname: '',
                    credit: '',
                    avatar: ''
                },
                list: [],
                page: 1,
                loading: false,
                count: 0,
                isFirstLoad: true,
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
            ...mapGetters('login', ['isLogin']),
        },
        watch: {
            isLogin: {
                handler(val) {
                    if (!val) {
                        this.$decorator.getPage('vipCenter').initMember()
                    } else {
                        this.getMemberInfo()
                    }
                },
                immediate: true
            }
        },
        created() {
            // #ifndef MP-TOUTIAO
            this.$loading.showLoading();
            // #endif
        },
        mounted() {
            this.getSet();
        },
        // onShow() {
        //     this.init()
        // },
        methods: {
            getSet() {
                this.$api.creditShopApi.shopStatus({}, {errorToast: false}).then(res => {
                    if (res.error === 0) {
                        this.status = +res.data.status;
                        this.getList();
                        this.init()
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
                    } else {
                        this.status = 0;
                    }
                }).finally(rej => {
                    this.$loading.hideLoading();
                    setTimeout(() => {
                        this.$loading.hideLoading();
                    }, 100)
                })
            },
            getList() {
                this.$api.creditShopApi.getCreditShopList({}).then(res => {
                    if (res.error === 0) {
                        if (res.list.length>0) {
                            this.list = this.list.concat(res.list);
                        }
                        this.page = this.page + 1;
                        this.count = res.total;
                        this.loading = false;
                        this.graceLazyload.load(0, this)
                    }
                }).finally(rej => {
                    this.$loading.hideLoading();
                    setTimeout(() => {
                        this.$loading.hideLoading();
                    }, 100)
                })
            },
            init() {
                if(this.isFirstLoad) {
                    this.isFirstLoad = false;
                    return
                }
                if(!this.isLogin) {
                    this.$decorator.getPage('vipCenter').initMember()
                } else {
                    this.getMemberInfo()
                }
                setTimeout(() => {
                    this.$closePageLoading()
                },1500)
            },
            getMemberInfo() {
                this.$decorator.getPage('vipCenter').getUserInfo().then(res => {
                    //获取会员详情
                    if (res.error === 0) {
                        this.userInfo = res.data;
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
            toIndex() {
                this.$Router.auto({
                    //#ifndef H5
                    path: '/pages/index/index',
                    //#endif
                    //#ifdef H5
                    path: '/'
                    //#endif
                })
            }
        },
        onPullDownRefresh() {

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
    .credit-shop {
        padding: px2rpx(12);
        background-color: #fff;
        .credit-adv {
            display: block;
            width: 100%;
            height: px2rpx(150);
            margin-bottom: px2rpx(8);
            border-radius: px2rpx(6);
        }
    }
</style>