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
    <div class="detail-spec">
        <div class="container">
            <span class="label" v-if="optionChoose&&optionChoose.id">已选</span>
            <span class="label" v-else>选择</span>
            <span class="content" @click="chooseOption">{{optionChoose.optionName||'请选择商品规格'}}</span>
            <i class="iconfont-m- icon-m-right"></i>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DetailSpec",
        components: {},
        props: {
            optionChoose: {
                type: Object,
                default: () => {
                    return {
                        optionName: '请选择商品规格'
                    }
                }
            }
        },
        data() {
            return {}
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            chooseOption() {
                this.$emit('chooseOption')
            }
        },
    }
</script>

<style lang="scss" scoped>
    .detail-spec {
        width: 100%;
        margin-top: px2rpx(8);
        .container {
            width: 100%;
            height: px2rpx(42);
            background: #fff;
            display: flex;
            flex-wrap: nowrap;
            font-family: PingFang SC;
            font-style: normal;
            font-weight: normal;
            .label {
                font-size: px2rpx(12);
                line-height: px2rpx(12);
                margin: auto px2rpx(12);
                color: $uni-text-color-grey;
                flex-shrink: 0;
            }
            .content {
                width: 0;
                flex: 1;
                font-size: px2rpx(14);
                line-height: px2rpx(44);
                box-sizing: border-box;
                padding: 0 rpx(10) 0 rpx(20);
                display: flex;
                flex-direction: column;
                justify-content: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin: auto 0;
                color: $uni-text-color;
            }
            .icon-m-right {
                height: px2rpx(42);
                flex-shrink: 0;
                line-height: px2rpx(42);
                margin-right: px2rpx(12);
                font-size: px2rpx(16);
                color: #888;
            }
        }
    }
</style>