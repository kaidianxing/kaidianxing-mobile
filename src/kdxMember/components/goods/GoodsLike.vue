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
    <view class="goods-like" v-if="list.length>0">
        <!-- 标题 -->
        <view class="like-title">你可能会喜欢</view>
        <view class="card-list flex">
            <view v-for="(item, index) in list" :key="index">
                <goods-info :goodsData="item" :show_style="true" :isAddIcon="true"></goods-info>
            </view>
        </view>
    </view>
</template>

<script>
    import goodsInfo from './GoodsInfo'

    export default {
        components: {
            goodsInfo
        },
        data() {
            return {
                list: []
            }
        },
        mounted() {
            this.getList();
        },
        methods: {
            getList() {
                this.$api.goodApi.goodList({is_recommand: 1, get_activity: 1}).then(res => {
                    if (res.error == 0) {
                        this.handleRandom(res.list)
                    }
                })
            },
            todetail(id) {
                this.$Router.auto({
                    path: '/kdxGoods/detail/index',
                    query: {
                        goods_id: id
                    }
                })
            },
            handleRandom(arr) {
                let result = [];
                if (arr.length <= 6) {
                    result = [...arr]
                } else {
                    let arr_x = JSON.parse(JSON.stringify(arr));
                    while (result.length < 6) {
                        let num = Math.floor(Math.random() * arr_x.length);
                        result.push(arr_x.splice(num, 1)[0])
                    }
                }
                this.list = result
            }
        },
    }
</script>

<style lang="scss" scoped>
    .goods-like {
        padding: 0rpx 24rpx;
        overflow: hidden;

        .like-title {
            height: 80rpx;
            line-height: 80rpx;
            font-weight: 700;
            color: $uni-text-color;
            font-size: 32rpx;
            text-align: center;
        }

        .card-list {
            flex-wrap: wrap;
            justify-content: space-between;
        }
    }
</style>
