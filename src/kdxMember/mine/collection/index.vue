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
    <pull-refresh :scrollTopChild="scrollTopOffset" @refresh="$_pullRefresh">
        <page-box>
            <view v-if="showPerms('article')" class="list-tab">
                <view class="tab flex">
                    <view class="item" :class="type === item.type?'active theme-primary-color':''"
                          v-for="(item, index) in status" :key="index" @click="changeTab(item.type)">
                        {{item.text}}
                        <span class="line theme-primary-bgcolor"></span>
                    </view>
                </view>
            </view>
            <view v-if="type === 'goods'" class="content" :class="showPerms('article') ? 'paddingTop' : ''">
                <div class="goods-list" v-if="list.length">
                    <goods-list
                        v-if="list.length"
                        :list="list"
                        @changeFavorite="changeFavorite"
                        @custom-event="eventHandler"
                    />
                </div>
                <div class="goods-nodata" v-if="!list.length && !requestLoading">
                    <no-goods :from="pageFrom" />
                </div>
            </view>
            <view v-else class="content" :class="showPerms('article') ? 'paddingTop' : ''">
                <div class="goods-list" v-if="articleList.length">
                    <article-list
                        v-if="articleList.length"
                        :list="articleList"
                        @changeFavorite="changeFavorite"
                    />
                </div>
                <div class="article-nodata" v-if="!articleList.length && !articleLoading">
                    <div class="icon">
                        <img :src="$utils.staticMediaUrl('default/collection.png')" alt="" />
                    </div>
                    <div class="tips">暂时没有收藏的文章哦</div>
                </div>
            </view>
            <!-- 多规格选择 -->
            <goods-picker ref="goodsPicker" @custom-event="customEventHandler"></goods-picker>
        </page-box>
    </pull-refresh>
</template>
<script>
import ArticleList from '../components/ArticleList'
import GoodsList from '../components/GoodsList'
import NoGoods from '../components/NoGoods'
import PageMixin from '@/common/PageMixin.js'
import goodsPicker from '@/components/goods/GoodsPicker'
import CartAdder from '@/components/goods/addCartTools.js'
export default {
    mixins: [PageMixin],
    components: {
        ArticleList,
        GoodsList,
        NoGoods,
        goodsPicker,
    },
    data() {
        return {
            type: "goods",
            status: [
                {
                    text: '商品收藏',
                    type: 'goods'
                },
                {
                    text: '文章收藏',
                    type: 'article'
                }
            ],
            requestLoading: false,
            articleLoading: false,
            list: [],
            articleList: [],
            page: 1,
            finished: false,
            pageFrom: 'collection',
        }
    },
    mounted() {
        // 快速购买处理
        this.cartAdder = new CartAdder((e) => {
            if (e.type == 'toggle') {
                if (this.$refs.goodsPicker.showmodal && e.data.errorInfo) {
                    this.$toast(e.data.errorInfo)
                } else {
                    this.$refs?.goodsPicker.toggle(this.cartAdder.pickerCallback, e.data?.type)
                }
            }
        })
        this.getFavorite()
    },
    methods: {
        showPerms(type) {
            let perm = true
            switch (type) {
                case 'article':// 文章营销
                    perm = true
                    break;
                default :
                    perm = true;
                    break;
            }
            return perm
        },
        changeTab(type) {
            console.log(type)
            this.type = type;
            this.reset();
        },
        // 获取我的收藏
        getFavorite() {
            if (this.requestLoading) {
                return
            }
            this.requestLoading = true
            if(this.type === 'goods') {
                this.$api.memberApi.getFavorite({
                    page: this.page,
                }).then((res) => {
                    this.requestLoading = false
                    if (res.error === 0) {
                        this.finished = res.list.length !== res.page_size
                        res.list.forEach((item) => {
                            item.is_add = 1
                        })
                        this.list = this.list.concat(res.list)
                    } else {
                        this.$toast(res.message)
                    }
                })
                return
            }
            // 收藏列表
            this.$api.articleApi.favoriteList({
                page: this.page,
            }).then((res) => {
                this.requestLoading = false
                if (res.error === 0) {
                    this.finished = res.list.length !== res.page_size;
                    this.articleList = this.articleList.concat(res.list)
                } else {
                    this.$toast(res.message)
                }
            })
        },
        // 切换收藏状态
        changeFavorite(data) {
            if(this.type === 'goods') {
                this.$api.memberApi.changeFavorite({
                    goods_id: data.data.goods.id,
                    is_add: 0,
                }).then((res) => {
                    if (res.error === 0) {
                        this.list.splice(data.index, 1)
                    } else {
                        this.$toast(res.message)
                    }
                })
                return
            }
            // 取消收藏
            this.$api.articleApi.cancelFavorite({
                article_id: data.data.article_id,
            }).then((res) => {
                if(res.error === 0) {
                    if (res.error === 0) {
                        this.articleList.splice(data.index, 1)
                    } else {
                        this.$toast(res.message)
                    }
                }
            })
        },
        async eventHandler(e) {
            // 判断登录
            await this.$store.dispatch('quickPurchase/checkLoginStatus')
            // 获取商品详情
            this.cartAdder.getGoodDetail(e.data.goods_id).then((res) => {
                if (res.error === 0) {
                    if(res?.perm?.price==0) {
                        this.$toast('暂无购买权限');
                        return
                    }					// 实体单规格直接加购，虚拟、卡密单规格跳转商品详情
                    const is_close_packer = this.$store.state.setting.systemSetting?.trade?.buy_pop == 0
                    const goods_type = res?.data?.goods?.type
                    const has_options = res?.data?.goods?.has_option
                    const goods_id = res?.data?.goods?.id
                    if(is_close_packer && has_options == '0') {
                        if(goods_type == '0'){
                            this.cartAdder.pickerCallback({
                                type: 'clickBtn',
                                data: {
                                    type: 'cart'
                                },
                            })
                            return
                        }else if(goods_type == '1' || goods_type == '2'){
                            this.$Router.auto({
                                path: '/pagesGoods/detail/index',
                                query: {
                                    goods_id:goods_id
                                }
                            })
                            return
                        }
                    }
                    // 打开goodsPicker
                    this.cartAdder.callback({
                        type: 'toggle',
                        data: {
                            type: 'spec',
                            goods_type: e.data?.value?.type
                        },
                    })
                }
            })
        },
        //规格选完回来
        async customEventHandler(e) {
            //快速购买处理
            await this.cartAdder.pickerCallback(e)
            if (e.type === 'clickBtn') {
                this.$refs?.goodsPicker.toggle(); // 购物车添加成功关闭弹窗
            }
        },
        reset() {
            this.page = 1
            this.list= []
            this.articleList= []
            this.getFavorite()
        },
    },
    onReachBottom() {
        if (this.finished) {
            return
        }
        this.page++
        this.getFavorite()
    },
}
</script>

<style lang="scss" scoped>
.content {
    .goods-list {
        padding-left: 24rpx;
        padding-right: 24rpx;
    }
}
.list-tab {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 999;
    .tab {
        background-color: #fff;
        border-top: 1px solid $uni-border-color;
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
            .line {
                width: 56rpx;
                height: 4rpx;
                position: absolute;
                bottom: 0;
                left: 50%;
                display: none;
                background-color: #FF3C29;
                transform: translateX(-50%);
                border-radius: 4rpx !important;
            }
        }
        .item.active {
            font-size: px2rpx(14);
            font-weight: 600;
            color: #FF3C29;
            .line {
                display: block;
            }
        }
    }
}
.paddingTop {
    padding-top: px2rpx(40);
}
.article-nodata {
    display: flex;
    flex-direction: column;
    align-items: center;
    .icon {
        padding-top: px2rpx(142);
        width: px2rpx(90);
        height: px2rpx(90);
        box-sizing: content-box;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .tips {
        font-size: px2rpx(14);
        line-height: px2rpx(20);
        color: #969696;
        margin-top: px2rpx(14);
        font-weight: 500;
    }
}
</style>
