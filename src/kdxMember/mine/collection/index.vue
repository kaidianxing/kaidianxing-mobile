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
        <view class="content">
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
        <!-- 多规格选择 -->
        <goods-picker
            ref="goodsPicker"
            @custom-event="customEventHandler"
        ></goods-picker>
    </page-box>
</template>
<script>
import GoodsList from '../components/GoodsList'
import NoGoods from '../components/NoGoods'
import PageMixin from '@/common/PageMixin.js'
import goodsPicker from '@/components/goods/GoodsPicker'
import CartAdder from '@/components/goods/addCartTools.js'
export default {
    mixins: [PageMixin],
    components: {
        GoodsList,
        NoGoods,
        goodsPicker,
    },
    data() {
        return {
            requestLoading: false,
            list: [],
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
                    this.$refs?.goodsPicker.toggle(
                        this.cartAdder.pickerCallback,
                        e.data?.type
                    )
                }
            }
        })
        this.getFavorite()
    },
    methods: {
        // 获取我的收藏
        getFavorite() {
            if (this.requestLoading) {
                return
            }
            this.requestLoading = true
            this.$api.memberApi
                .getFavorite({
                    page: this.page,
                })
                .then((res) => {
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
        },
        // 切换收藏状态
        changeFavorite(data) {
            this.$api.memberApi
                .changeFavorite({
                    goods_id: data.data.goods.id,
                    is_add: 0,
                })
                .then((res) => {
                    if (res.error === 0) {
                        this.list.splice(data.index, 1)
                    } else {
                        this.$toast(res.message)
                    }
                })
        },
        async eventHandler(e) {
            // 判断登录
            await this.$store.dispatch('quickPurchase/checkLoginStatus')
            // 获取商品详情
            this.cartAdder.getGoodDetail(e.data.goods_id).then((res) => {
                if (res.error === 0) {
                    // 打开goodsPicker
                    this.cartAdder.callback({
                        type: 'toggle',
                        data: {
                            type: 'spec',
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
                this.$refs?.goodsPicker.toggle() // 购物车添加成功关闭弹窗
            }
        },
    },
    onReachBottom() {
        if (this.finished) {
            return
        }
        this.page++
        this.getFavorite()
    },
    onPullDownRefresh() {
        this.page = 1
        this.list= []
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
</style>
