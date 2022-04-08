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
   <div class="catrgory-template flex1">
       <scroll-view :scroll-y="true"
                    :scroll-top="scrollTop"
                    @scroll='scrollFn'
                    class="es-category-right"
                    v-if="template == 1||template == 2">
           <!-- 广告图 -->
           <view class="content-right-banner" v-if="advData.advimg" @click="handleClick"
                 :style="{'background-image': `url(${$utils.staticMediaUrl('decorate/picture.png')})`,}">
               <image :src="$utils.mediaUrl(advData.advimg)"/>
           </view>
           <block v-if="template == 1">
               <view class="second-category">
                   <div class="category-icon-col flex-column" v-for="(item,index) in rightData" :key="index" @click="getGoodsList(item.id)">
                       <view class="goods-img" :class="styleType == 1?'square':'circle'" :style="{'background-image':!item.thumb? `url(${$utils.staticMediaUrl('decorate/goods_col2.png')})`:'',}">
                           <image mode="aspectFill" class='grace-img-lazy' :src="$utils.mediaUrl(item.thumb)" :class="styleType == 1?'square':'circle'" />
                       </view>
                      <!-- <div class="text line-hide">{{item.name}}</div>-->
                       <div class="text">{{$utils.showCategoryName(item.name)}}</div>
                   </div>
               </view>
           </block>
           <block v-if="template == 2">
               <view v-for="(item,index) in rightData" :key="index">
                   <view class="three-category" v-if="item.children.length > 0">
                       <view class="category-title">{{item.name}}</view>
                       <view class="category-goods-list">
                           <div class="category-icon-col flex-column" v-for="(childItem,childIndex) in item.children" :key="childIndex" @click="getGoodsList(childItem.id)">
                               <view class="goods-img" :class="styleType == 1?'square':'circle'" :style="{'background-image': `url(${$utils.staticMediaUrl('decorate/goods_col2.png')})`,}">
                                   <image mode="aspectFill" class='grace-img-lazy' :src="$utils.mediaUrl(childItem.thumb)" :class="styleType == 1?'square':'circle'" />
                               </view>
                               <!--<div class="text line-hide">{{childItem.name}}</div>-->
                               <div class="text">{{$utils.showCategoryName(childItem.name)}}</div>
                           </div>
                       </view>
                   </view>
               </view>
           </block>
       </scroll-view>
       <view class="category-first" v-if="template == 0">
           <view class="first-category">
               <div class="category-icon-col flex-column" v-for="(item,index) in list" :key="index"
                     @click="getGoodsList(item.id)">
                   <view class="goods-img" :class="styleType == 1?'square':'circle'" :style="{'background-image': `url(${$utils.staticMediaUrl('decorate/goods_col2.png')})`,}">
                       <image mode="aspectFill" class='grace-img-lazy' :class="styleType == 1?'square':'circle'" :src="$utils.mediaUrl(item.thumb)"/>
                   </view>
                   <!--<div class="text line-hide">{{item.name}}</div>-->
                   <div class="text">{{$utils.showCategoryName(item.name)}}</div>
               </div>
           </view>
       </view>
   </div>
</template>

<script>
    export default {
        components: {},
        props: {
            template: {
                type: [String, Number],
                default: 1
            },
            scrollTop: {
                type: [String, Number],
                default: 1
            },
            styleType: {
                type: [String, Number],
                default: 1 // 图片展示形式 1:方形 0：圆形
            },
            advData: {
                type: Object,
                default: () => {}
            },
            rightData: {
                type: Array,
                default: () => []
            },
            list: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                loadingType: 0,
            }
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            getGoodsList(id) {
                this.$emit('getGoodsList', id)
            },
            scrollFn(e) {
                this.$emit('scrollFn', e)
            },
            handleClick() {
                if (this.advData?.advurl) {
                    this.$Router.auto(this.advData?.advurl)
                }
            }
        },
    }
</script>

<style lang="scss">
    .catrgory-template {
        width: 100%;
        .category-first {
            padding: 32rpx 24rpx;
            border-radius: 8rpx;
            background-color: #fff;
            box-sizing: border-box;
            min-height: calc( 100vh - 92rpx - 100rpx - 16rpx);
            .first-category {
                display: flex;
                flex-wrap: wrap;
                .category-icon-col {
                    margin-right: 30rpx;
                    &:nth-child(4n) {
                        margin-right: 0;
                    }
                    &:nth-child(n + 5) {
                        margin-top: 32rpx;
                    }
                }
            }
        }
        .category-icon-col {
            align-items: center;
            flex-shrink: 0;
            .text {
                font-size: 24rpx;
                color: #565656;
                line-height: 34rpx;
                margin-top: 16rpx;
                text-align: center;
                max-width: 140rpx;
                white-space: pre-line;
            }
            .goods-img {
                width: 140rpx;
                height: 140rpx;
                background-size: cover;
            }
            .goods-img.circle {
                border-radius: 50%;
            }
            .grace-img-lazy {
                width: 140rpx;
                height: 140rpx;
            }
            .grace-img-lazy.circle {
                border-radius: 50%;
            }
        }
        .second-category {
            padding: 32rpx 24rpx;
            display: flex;
            flex-wrap: wrap;
            border-radius: 8rpx;
            background-color: #fff;
            .category-icon-col {
                margin-right: 24rpx;
                &:nth-child(3n) {
                    margin-right: 0;
                }
                &:nth-child(n + 4) {
                    margin-top: 32rpx;
                }
            }
        }
        .three-category {
            padding: 32rpx 24rpx;
            border-radius: 8rpx;
            background-color: #fff;
            margin-bottom: 16rpx;
            .category-icon-col {
                margin-right: 24rpx;
                &:nth-child(3n) {
                    margin-right: 0;
                }
                &:nth-child(n + 4) {
                    margin-top: 32rpx;
                }
            }
            .category-title {
                margin-bottom: 24rpx;
                font-size: 28rpx;
                line-height: 40rpx;
                font-weight: bold;
                color: $uni-text-color;
            }
            .category-goods-list {
                display: flex;
                flex-wrap: wrap;
            }
        }
        .es-category-right {
            flex: 1;
            height: calc( 100vh - 92rpx - 100rpx);
            padding: 0 24rpx;
            box-sizing: border-box;

            .content-right-banner {
                width: 100%;
                margin-bottom: 16rpx;
                height: 172rpx;
                overflow: hidden;
                border-radius: 12rpx;
                background-size: cover;
                image {
                    display: inline-block;
                    width: 100%;
                    height: 172rpx;
                }
            }
        }
    }

</style>
