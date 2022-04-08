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
    <view class="overseas-picker-box" v-show='showPicker' :style="{bottom:bottom}" @click='togglePicker' @touchmove.stop.prevent>
        <view class="picker-bg"></view>
        <view class="picker-closer" @click.stop>
            <!-- picker最顶部标题 -->
            <view class="title">
                {{title}}
            </view>
            <!--添加顶部国内外tab切换-->
            <slot></slot>
            <!-- 选中的地区展示：中国 山东 青岛 -->
            <view class="navbar-box" v-if="areaGrade != 'country' && navbars.length >0">
                <custom-navbar :maxLength='maxLength' :navbars='navbars'  @click='clickItem("crumbs",$event)'></custom-navbar>
            </view>
            <!-- 自定义选择区域 -->
            <view class='overseas-picker' :style="{height: !showTab? '374px' : '339px'}"  :class="{'choose': navbars&&navbars.length >0, ' country': areaGrade == 'country' }">
                <!-- 分区【A-Z】选择区，基本部分为右侧纵向分区选择列菜单与分区内容展示列表 -->
                <view class="areas-picker-container">
                    <MyPicker :areas='pickerList' :areaGrade="areaGrade" @click='clickItem("picker",$event)' :pickerTop='pickerTop'>
                        <!-- 选择区的顶部自定义附加部分，通常为热门地区或者tab切换等模块 -->
                        <template slot="hot-areas">
                            <view class="attachment" ref='attachment'>
                                <!-- 外部注入的额外内容 -->
                                <slot name='attachment'></slot>
                                <view class='sub-title'>{{pickerTitle}}</view>
                            </view>
                        </template>
                    </MyPicker>
                </view>
            </view>
            <!-- 关闭按钮 -->
            <div class="close-picker">
                <btn type="do" style="flex:1" classNames="theme-primary-bgcolor" size="middle" @btn-click="togglePicker">关闭</btn>
            </div>
        </view>
</view>
 
</template>

<script>
    import CustomNavbar from './CustomNavBar'
    import MyPicker from './Picker'
    export default {
        props: {
            bottom:{
                type: [String, Number],
                default: '0',
            },
            maxLength: {
                type: [Number, String],
                default: 3,
            },
            title: {
                type: String,
                default: '选择地区'
            },
            pickerTitle: {
                type: String,
                default: '选择地区'
            },
            navbars: {
                type: Array,
                default: []
            },
            pickerList: {
                type: Array,
                default: []
            },
            pickerTop: {
                type: Number,
                default: 50
            },
            areaGrade: {
                type: String,
            },
            showTab: {
                type: Boolean,
                default: true
            }
        },
        components: {
            CustomNavbar,
            MyPicker,
        },
        data() {
            return {
                showPicker: false
            }
        },
        mounted() {
        },
        methods: {
            clickItem(type, ...value) {
                this.$emit('clickItem', {
                    type,
                    value
                })
            },
            togglePicker() {
                this.showPicker = !this.showPicker;
            }
        },
    }
</script>

<style lang="scss" scoped>
   .overseas-picker-box {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        bottom: 0;
        z-index:9999999;
       .picker-bg {
           width: 100%;
           height: 100%;
           background: rgba(0, 0, 0, 0.5);
       }
       .picker-closer {
           display: flex;
           flex-direction: column;
           position: absolute;
           width: 100%;
           height: 980rpx;
           bottom: 0;
           left: 0;
           padding: 32rpx 0 0;
           background: #fff;
           border-top-left-radius: 16rpx;
           border-top-right-radius: 16rpx;
           .title {
               line-height: 44rpx;
               text-align: center;
               font-size: 32rpx;
               font-weight: bold;
               color: #212121;
               padding-bottom: 44rpx;
           }
           .navbar-box {
               box-sizing: border-box;
               width: 100%;
               margin-top: 32rpx;
               background: #fff;
               padding: 0 24rpx;
           }
           .overseas-picker {
               width: 100%;
               height: px2rpx(339);
               overflow: hidden;
               &.choose {
                   height: px2rpx(303);
               }
               &.country {
                   height: px2rpx(339);
               }
               .areas-picker-container {
                   height: 100%;
                   .sub-title {
                       font-size: 20rpx;
                       font-weight: 400;
                       color: $uni-text-color-grey;
                       line-height: 28rpx;
                       margin-bottom: 32rpx;
                   }
               }
           }
           .close-picker {
               position: relative;
               height: 112rpx;
               display: flex;
               align-items: center;
               padding-left: 24rpx;
               padding-right: 24rpx;
               box-sizing: content-box;
               .btn {
                   width: 100%;
                   display: flex;
                   align-items: center;
                   justify-content: center;
                   height: 80rpx;
                   border-radius: 40rpx;
                   font-size: 28rpx;
                   line-height: 40rpx;
                   color: #FFFFFF;
                   background: linear-gradient(172.93deg, #FF3C29 0%, #FF6F29 94.38%);
               }
           }
       }
  }
</style>