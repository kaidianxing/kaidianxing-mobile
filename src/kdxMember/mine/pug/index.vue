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
            <div class="pug-list">
                <goods-list-favorite
                    v-if="list.length"
                    :list="list"
                    @changeFavorite="changeFavorite"
                />
            </div>
            <div class="goods-nodata" v-if="!list.length && !requestLoading">
                <no-goods :from="pageFrom" />
            </div>
        </view>
    </page-box>
</template>
<script>
import GoodsListFavorite from '../components/GoodsListFavorite'
import NoGoods from '../components/NoGoods'
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    components: {
        GoodsListFavorite,
        NoGoods,
    },
    data() {
        return {
            requestLoading: false,
            list: [],
            page: 1,
            finished: false,
            pageFrom: 'pug',
        }
    },
    created() {
        this.getFootprint()
    },
    onReachBottom() {
        if (this.finished) {
            return
        }
        this.page++
        this.getFootprint()
    },
    methods: {
        // 获取我的足迹
        getFootprint() {
            if (this.requestLoading) {
                return
            }
            this.requestLoading = true
            this.$api.memberApi
                .getFootprint({
                    page: this.page,
                })
                .then((res) => {
                    this.requestLoading = false
                    if (res.error === 0) {
                        this.finished =
                            res.data.list.length !== res.data.page_size
                        // 处理数据
                        res.data.list.forEach((item) => {
                            // 添加收藏状态
                            if (item.favorite) {
                                item.is_add = 1
                            } else {
                                item.is_add = 0
                            }
                            if (this.list.length === 0) {
                                this.list.push({
                                    date: item.date,
                                    data: [item],
                                })
                            } else {
                                let pushFlag = false
                                this.list.forEach((listItem) => {
                                    if (listItem.date === item.date) {
                                        listItem.data.push(item)
                                        pushFlag = true
                                    }
                                })
                                if (!pushFlag) {
                                    this.list.push({
                                        date: item.date,
                                        data: [item],
                                    })
                                }
                            }
                        })
                        // 刷新页面
                        this.list = this.list.slice(0)
                    } else {
                        this.$toast(res.message)
                    }
                })
        },
        // 切换收藏状态
        changeFavorite(data) {
            this.$api.memberApi
                .changeFavorite({
                    goods_id: data.data.data[data.subIndex].goods.id,
                    is_add: data.data.data[data.subIndex].is_add === 1 ? 0 : 1,
                })
                .then((res) => {
                    if (res.error === 0) {
                        const is_add = this.list[data.index].data[data.subIndex]
                            .is_add
                        this.list[data.index].data[data.subIndex].is_add =
                            is_add === 1 ? 0 : 1
                        // 刷新页面
                        this.list.slice(0)
                    } else {
                        this.$toast(res.message)
                    }
                })
        },
    },
}
</script>

<style lang="scss" scoped>
.content {
}
</style>
