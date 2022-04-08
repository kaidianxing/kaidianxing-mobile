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
    <view class="form-info">
        <view class="form-info-item" v-for="(item, index) in data" :key="index">
            <view class="item-box">
                <view class="label">
                    {{item.params.title}}：
                </view>
                <!-- 数组类型 checkboxes-->
                <view class="content" v-if="item.id === 'checkboxes'">
                    <text>{{toString(item)}}</text>
                </view>
                <!--城市-->
                <view class="content" v-else-if="item.id === 'city'">
                    <!--省市区-->
                    <text v-if="item.params.status">
                        {{item.params.province || ''}} {{item.params.city || ''}} {{item.params.area || ''}}
                    </text>
                    <!--省市-->
                    <text v-else>
                        {{item.params.province || ''}} {{item.params.city || ''}}
                    </text>
                </view>
                <view class="content" v-else-if="item.id === 'daterange' || item.id === 'timerange'">
                    <text>
                         {{item.params.start.value}}
                    </text>
                    <text v-if="item.params.start.value && item.params.end.value">  ~  </text>
                    <text>
                         {{item.params.end.value}}
                    </text>
                </view>
                <view class="content-image"  v-else-if="item.id === 'pictures'">
                    <select-img ref="myPictures" :items="item.params.value" readonly></select-img>
                </view>
                <view class="content" v-else>
                    <text>{{item.params.value}}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import SelectImg from "@/components/image/SelectImg";
    export default {
        name: "FormInfo",
        components: {
            SelectImg
        },
        props: {
            data: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            toString(item) {
                if (item?.params?.value instanceof Array) {
                    return item?.params?.value.join(',');
                } else {
                    return ''
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .form-info {
        background-color: #ffffff;
        margin: 16rpx 0;
        border-radius: 12rpx;
        padding: 32rpx 0;
        padding-left: 24rpx;
        .form-info-item {
            margin-bottom: 32rpx;
            &:last-child {
                margin-bottom: 0;
            }
            .item-box {
                display: flex;
                /*height: 34rpx;*/
                line-height: 34rpx;
                .label {
                    color: #565656;
                    flex-shrink: 0;
                    max-width: 144rpx;
                    word-break: break-all;
                    font-size: px2rpx(12);
                }
                .content {
                    flex: 1;
                    text {
                        color: $uni-text-color;
                        font-size: px2rpx(12);
                    }
                }
                .content-image {
                    flex: 1;
                }
            }
        }
    }
</style>
