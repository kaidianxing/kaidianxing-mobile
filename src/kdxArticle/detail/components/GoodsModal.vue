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
    <pick-mask @mask-close="toggle" v-if="showmodal">
        <view class="inner flex-column">
            <div class="title-box">
                <view class="title">精选商品({{goodsList.length}})</view>
                <view class="picker-close" @click="toggle">
                    <img
                        class="close-img"
                        :src="$utils.staticMediaUrl('verify/close.png')"
                        alt="" />
                </view>
            </div>
            <scroll-view scroll-y class="picker-goods-list">
                <view class="item" v-for="item in goodsList" :key="item.id">
                    <GoodsItem :useCache="true" :goods-data="item" :article-id="articleId" :modalItem="true"></GoodsItem>
                </view>
            </scroll-view>
        </view>
    </pick-mask>
</template>

<script>
import { mapState } from 'vuex'
import PickMask from "@/components/picker/PickMask";
import GoodsItem from "./GoodsItem"
export default {
    props: {
        goodsList: {
            type: Array,
            default: () => []
        },
        articleId: {
            typa: String,
            default: ""
        }
    },
    components: {
        PickMask,
        GoodsItem
    },
    data() {
        return {
            showmodal: false,
        };
    },
    computed: {
        ...mapState(['areaBottom']),
        paddingBottom(){
            return this.areaBottom + 'px'
        },
    },
    methods: {
        toggle() {
            this.showmodal = !this.showmodal;
        },
    },
};
</script>
<style lang='scss' scoped>
    
.inner {
    height: px2rpx(490);
    background: #fff;
    border-radius: 20rpx 20rpx 0 0;
    // padding: 0 0 28rpx;
    justify-content: space-between;
    box-sizing: border-box;
    .content-box {
        flex: 1;
        height: 348rpx;
        box-sizing: border-box;
    }
    .title-box {
        position: relative;
        .title {
            padding: px2rpx(16) 0;
            text-align: center;
            color: $uni-text-color;
            font-size: 32rpx;
            font-weight: bold;
            line-height: 44rpx;
        }

        .picker-close {
            position: absolute;
            top: px2rpx(12);
            right: px2rpx(12);
            width: px2rpx(24);
            height: px2rpx(24);
            .close-img {
                width: px2rpx(24);
                height: px2rpx(24);
            }
        }
    }
    .item {
        margin: 0 px2rpx(12);
        width: calc(100% - 48rpx);
        margin-top: px2rpx(8);
    }
    .picker-goods-list {
        height: px2rpx(468);
        overflow-y: scroll;
        /deep/ .uni-scroll-view {
            &::-webkit-scrollbar {
                height: 0;
                width: 0;
            }
        }
    }
}
</style>