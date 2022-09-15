<template>
    <div class="main-temp">
        <div class="main-temp-one">
            <!-- 顶部分类 -->
            <cate-temp-one
                v-if="level!='0' && getOneMenus.length"
                :list="getOneMenus"
                :active="activeTab.temp1"
                @on-choose="chooseCate($event, 'temp1')"
            ></cate-temp-one>
        </div>
        <div
            class="cate-layout"
            :style="{
                height: layoutHeight
            }"
        >
            <!-- 左侧分类 -->
            <div class="left">
                <cate-temp-two
                    :list="getTwoMenus"
                    :active="activeTab.temp2"
                    @on-choose="chooseCate($event, 'temp2')"
                ></cate-temp-two>
            </div>
            <!-- #ifdef MP-TOUTIAO -->
            <div class="right">
            <!-- #endif-->
            <!-- #ifndef MP-TOUTIAO -->
            <div
                class="right"
                @touchmove.stop.prevent="moveHandler"
            >
            <!-- #endif -->
                <view
                    class="default-page flex-column empty-page"
                    v-if="!loading&&!goods.length && !mask"
                    :style="{
                        paddingTop: getAdv.advimg? advImgHeight+'rpx': 0,
                    }"
                >
                    <view class="bg">
                        <image :src="$utils.staticMediaUrl('default/goods_pack.png')"></image>
                    </view>
                    <view class="default-text">暂无商品</view>
                </view>
                <cate-aside
                    v-if="isFirst"
                    :top="getTop"
                    :advImg="getAdv.advimg"
                    :advUrl="getAdv.advurl"
                    :mask="mask"
                    @load-list="loadGoods"
                    :showCate="level=='2'"
                    :list="getThreeMenus"
                    :tempKey="activeTab.temp1+ ' ' +activeTab.temp2"
                    :advImgHeight="advImgHeight"
                    :goods="goods"
                >
                    <template v-slot:cate>
                        <cate-temp-three
                            :list="getThreeMenus"
                            :active="activeTab.temp3"
                            @on-choose="chooseCate($event, 'temp3')"
                            @on-mask="maskHandler"
                            :tempKey="activeTab.temp1+ ' ' +activeTab.temp2"
                        ></cate-temp-three>
                    </template>
                    <template v-slot:catefixed>
                        <cate-temp-three
                            :list="getThreeMenus"
                            :active="activeTab.temp3"
                            @on-choose="chooseCate($event, 'temp3')"
                            @on-mask="maskHandler"
                            :tempKey="activeTab.temp1+ ' ' +activeTab.temp2"
                        ></cate-temp-three>
                    </template>
                    <div
                        class="goods-box"
                        v-if="goods.length"
                    >
                        <cate-goods
                            @click.native.stop.prevent="toDetail(goodsItem.id)"
                            :goods="goodsItem"
                            v-for="(goodsItem,index) in goods"
                            :key="index"
                            @goods-click="goodsClick"
                        ></cate-goods>
                    </div>
                </cate-aside>
            </div>
        </div>
        <!-- 多规格选择 -->
        <goods-picker
            ref="goodsPicker"
            @custom-event="customEventHandler"
        ></goods-picker>
    </div>
</template>


<script>
import { mapState } from 'vuex'
import CateTempOne from './CateTempOne'
import CateTempTwo from './CateTempTwo'
import CateAside from './CateAside'
import CateGoods from './CateGoods'
import CateTempThree from './CateTempThree'
import goodsPicker from "@/components/goods/GoodsPicker";
import CartAdder from '@/components/goods/addCartTools.js'

const levels = {
    'temp1': {
        '0': ['getOneCateId'],
        '1': ['getOneCateId', 'getTwoCateId'],
        '2': ['getOneCateId', 'getTwoCateId', 'getThreeCateId']
    },
    'temp2': {
        '0': ['getTwoCateId'],
        '1': ['getTwoCateId'],
        '2': ['getTwoCateId', 'getThreeCateId']
    },
    'temp3': {
        '2': ['getThreeCateId']
    }
}
export default {
    props: {
        list: {
            type: Array,
            default: () => []
        },
        level: {
            type: [String, Number],
            default: '0'
        }
    },
    components: {
        goodsPicker,
        CateTempOne,
        CateTempTwo,
        CateTempThree,
        CateGoods,
        CateAside
    },
    data() {
        return {
            activeTab: {
                temp1: 0,
                temp2: 0,
                temp3: 0
            },
            isFirst: false,
            temp1Height: null,
            mask: false,
            goods: [],
            page: 1,
            chooseTab: 'temp1',
            total: 0,
            cartAdder: null,// 添加购物车类对象
            advImgHeight: 178,
            topCategoryHeight: '194rpx',
            loading: false
        }
    },
    computed: {
        ...mapState(['windowHeight', 'areaBottom']),
        ...mapState('decorate/othersPage', {
            pageBottomHeight: state => state.pageBottomHeight,
        }),
        // 获取temp1的menu列表
        getOneMenus() {
            return this.list
        },
        // 获取temp2的menu列表
        getTwoMenus() {
            if (this.level == '0' && this.list.length) {
                return this.getOneMenus
            } else if (this.level != '0' && this.getOneMenus.length) {
                return this.getOneMenus[this.activeTab.temp1]?.children || []
            } else {
                return []
            }
        },
        // 获取temp3的menu列表
        getThreeMenus() {
            return this.getTwoMenus[this.activeTab.temp2]?.children || []
        },
        // 获取right容器的top
        getTop() {
            if (this.temp1Height == null) return
            return `calc(${this.temp1Height}px + ${uni.upx2px(94)}px)`
        },
        layoutHeight() {
            let str = this.topCategoryHeight;
            if(this.level == '0') {
                str = '0px'
            }
            return `calc(100vh - 92rpx - 100rpx - ${str} - ${this.areaBottom}px)`
        },
        getAdv() {
            let key = this.level == '0' ? 'temp2' : 'temp1'
            return this.list[this.activeTab[key]]
        },
        // 获取一级分类id
        getOneCateId() {
            let i = this.activeTab.temp1
            return this.getOneMenus[i] ? this.getOneMenus[i].id : null
        },
        // 获取二级分类id
        getTwoCateId() {
            let i = this.activeTab.temp2
            return this.getTwoMenus[i] ? this.getTwoMenus[i].id : null
        },
        // 获取三级分类id
        getThreeCateId() {
            let i = this.activeTab.temp3
            return this.getThreeMenus[i] ? this.getThreeMenus[i].id : null
        }
    },
    created() {
        this.getGoodsList(this.getCateId(this.chooseTab))
    },
    mounted() {
        this.cartAdder = new CartAdder((e) => {//商品组加购专用//快速购买处理
            if (e.type == 'toggle') {
                if (this.$refs.goodsPicker.showmodal && e.data.errorInfo) {
                    this.$toast(e.data.errorInfo)
                } else {
                    this.$refs?.goodsPicker.toggle(this.cartAdder.pickerCallback, e.data?.type);
                }
            }
        });
        setTimeout(() => {
            this.$getRect('.main-temp-one').then(res => {
                if (res) {
                    this.temp1Height = res.height
                }
            })
        }, 0);
        this.$getRect('.main-temp .main-temp-one').then(res => {
            console.log('res======', res)
            this.topCategoryHeight = `${res.height}px`;
        })
    },
    methods: {
        //规格选完回来
        async customEventHandler(e) {//快速购买处理
            await this.cartAdder.pickerCallback(e)
            this.$refs?.goodsPicker.toggle(); // 购物车添加成功关闭弹窗
        },
        // 点击切换分类
        chooseCate({ id, index }, key) {
            this.activeTab[key] = index
            this.chooseTab = key
            this.page = 1
            this.total = 0
            this.goods = []
            this.mask = false

            // 重置下级分类默认选中项
            switch (key) {
                case 'temp1':
                    this.activeTab.temp2 = 0
                    this.activeTab.temp3 = 0
                    break;
                case 'temp2':
                    this.activeTab.temp3 = 0
                    break;
                default:
                    break;
            }

            this.refresh()
        },
        // 取出当前分类id,没有取上级分类id
        getCateId() {
            let cateid;
            levels[this.chooseTab][this.level].forEach(method => {
                cateid = this[method] || cateid
            })

            return cateid;
        },
        getGoodsList(category_id) {
            // uni.showLoading({title: '加载中'})
            this.loading = true
            this.$api.goodApi.goodList({ category_id, page: this.page, get_activity: 1 }).then(res => {
                if (res.error == 0) {
                    if(1 === this.page){
                        this.goods = res.list;
                    }else{
                        this.goods = [...this.goods,...res.list]
                    }
                    this.total = res.total
                    this.isFirst = true
                }
            }).finally(()=> {
                this.loading = false
                uni.hideLoading()
            })
        },
        refresh() {
            this.page = 1;
            this.total = 0;
            this.goods = []
            this.getGoodsList(this.getCateId())
            uni.hideLoading()
        },
        moveHandler() {
            return false
        },
        maskHandler(status) {
            this.mask = status
        },
        loadGoods() {
            if (this.goods.length < this.total) {
                this.page++
                this.getGoodsList(this.getCateId())
            }
        },
        async goodsClick(goods) {
            // 判断登录
            await this.$store.dispatch('quickPurchase/checkLoginStatus')
            // 获取商品详情
            this.cartAdder.getGoodDetail(goods.id,'...pagesGoodDetail/index.vue').then((res) => {
                if (res.error === 0) {
                    if( res?.data?.goods?.type == '2' && !res?.plugin_account?.virtualAccount
                        ||  res?.data?.goods?.type == '3' && !res?.plugin_account?.appointment
                    ) {
                        this.$toast('商品暂时无法购买');
                        return
                    }
                    if(res?.data?.goods?.type == '3') {
                        this.$Router.auto({
                            path: '/kdxGoods/detail/index',
                            query: {
                                goods_id: res?.data?.goods?.id,
                            },
                        })
                        return
                    }
                    // 打开goodsPicker
                    if(goods.has_option == 0) {
                        let cartParams = {
                            goods_id: goods.id,
                            option_id: 0,
                            total:'1',
                            mode: 1,
                        }
                        this.$api.goodApi.changeCartNum(cartParams).then((res) => {
                            if (res.error === 0) {
                                uni.showToast({
                                    title: '成功添加购物车',
                                    icon: 'none',
                                })
                                resolve(res)
                            } else {
                                uni.showToast({
                                    title: res.message || '加入购物车失败',
                                    icon: 'none',
                                })
                            }
                        })
                    }else {
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
        toDetail(id) {
            this.$Router.auto({
                path: '/kdxGoods/detail/index',
                query: {
                    goods_id: id,
                },
            })
        },

    }
}
</script>
<style lang="scss" scoped>
.main-temp {
    flex: 1;
    display: flex;
    flex-direction: column;
}
.cate-layout {
    display: flex;
    border-top: px2rpx(1) solid #f5f5f5;

    .left {
        width: px2rpx(88);
        height: 100%;
    }

    .right {
        background: #fff;
        flex: 1;
        overflow: hidden scroll;
        position: relative;

        .goods-box {
            position: relative;
        }

        .empty-page {
            position: absolute;
            left: 50%;
            top: 50%;
            padding: 0;
            width: 100%;
            transform: translate(-50%,-50%);
            z-index: 2;
        }

        .empty-goods {
            display: flex;
            flex-direction: column;
        }
    }
}
</style>
