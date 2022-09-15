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
    <page-box showDiymenu>
        <view class="goods-category rr-page">
            <search-input></search-input>
            <block v-if="id == '0' && list.length">
                <default-temp
                    ref="cateTemp"
                    :list="list"
                    :temp-style="style"
                    :level="level"
                    @on-skip="getGoodsList"
                ></default-temp>
            </block>
            <block v-if="id =='1' && list.length">
                <cate-temp
                    ref="cateTemp"
                    :list="list"
                    :level="level"
                    @on-skip="getGoodsList"
                ></cate-temp>
            </block>
        </view>
    </page-box>
</template>

<script>
    import SearchInput from "../components/search/SearchInput";
import DefaultTemp from '../components/category/default'
import PageMixin from '@/common/PageMixin.js'
import PageLoadingMixin from "@/common/LoadingBox/PageLoadingMixin"
import CateTemp from '../components/category/cateTemp'
export default {
    mixins: [PageMixin,PageLoadingMixin],
    components: {
        SearchInput,
        DefaultTemp,
        CateTemp
    },
    data() {
        return {
            style: '1', // 图片显示圆形还是方形
            list: [],
            tempStyle: '',
            level: '1',
            tmpId: '1',
            id: '0'
        }
    },
    computed: {

    },
    mounted() {
        this.getCategory()
    },
    methods: {
        async pullDownRefresh() { //下拉刷新，mixin.js中调用
            // uni.showLoading({
            //     title: '正在刷新',
            // })
            this.getCategory().then(() => {
                this.$refs.cateTemp.refresh()
            })
        },
        getCategory() {
            // 获取分类列表
            // 默认右侧数据是第一个
            this.$loading.hideLoading();
            return new Promise((resolve, reject) => {
                this.$api.goodApi.categoryList().then(res => {
                    console.log('res', res)
                    if (res.error == 0) {
                        let { level, style, list, title, template_type } = res
                        this.level = level
                        this.style = style
                        this.list = list
                        this.id = template_type
                        uni.setNavigationBarTitle({
                            title
                        })
                        resolve()
                    }
                }).finally(rej => {

                    this.$closePageLoading()
                    resolve()
                })
            })
        },
        // 跳转至商品列表
        getGoodsList(id) {
            this.$Router.auto({
                path: '/kdxGoods/goodList/index',
                query: {
                    category_id: id
                }
            })
        },
        handleSearch() {
            this.$Router.auto({
                path: '/kdxGoods/search/index'
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.search-content {
    &.temp-1 {
        background: #fff;

        .search-input {
            background: #f5f5f5;
        }
    }
}
.goods-category {
    display: flex;
    flex-direction: column;
    background-color: $uni-bg-color-grey;

     /deep/ .uni-scroll-view {
        position: static;
    }
}
</style>
