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
<theme-content @catchtouchmove="catchTouchMove">
    <div class="goods-screen flex-column" :style="{paddingBottom:areaBottom+'px'}">
        <scroll-view class="scroll-view" :scroll-y="true">
            <!-- 模板一 -->
            <div class="screen-one flex" v-if="template == 0" style="overflow: scroll;">
                <view class="item" :class="choseMenu[item.id]?'active':''" v-for="(item, index) in list" :key="index"
                    @click="chooseItem(item.id)">{{item.name}}
                </view>
            </div>
            <div class="content" v-else>
                <view class="screen-block " v-for="(item, index) in list" :key="index" style="overflow: scroll;">
                    <view class="title">{{item.name}}</view>
                    <view class="flex screen-one">
                        <view class="item"
                            :class="choseMenu[childrenItem.id]?'active theme-primary-border theme-primary-color':''"
                            v-for="(childrenItem, childrenIndex) in item.children" :key="childrenIndex"
                            @click="chooseItem(childrenItem.id, item, index)">{{childrenItem.name}}
                        </view>
                    </view>
                </view>
            </div>
        </scroll-view>
        <div class="wrap">
            <button-group type="hollow">
                <btn class="group" @btn-click="reset" type="do" size="middle">重置</btn>
                <btn class="group" classNames="theme-primary-bgcolor" @btn-click="confirmCate" type="do" size="middle">确定</btn>
            </button-group>
        </div>
    </div>
</theme-content>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        components: {},
        props: {
            list: {
                type: Array,
                default: () => []
            },
            template: {
                type: [String, Number],
                default: 0
            },
            choseMenuData: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                choseMenu: {},
            }
        },
        watch: {
            choseMenuData: {
                handler(newValue) {
                    this.choseMenu = newValue
                },
                immediate: true
            }
        },
        computed: {
            ...mapState(['areaBottom'])
        },
        created() {
        },
        mounted() {
        },
        methods: {
            chooseItem(id, item, i) {
                let choseMenu = this.choseMenu;
                choseMenu[id] = !this.choseMenu[id];
                this.choseMenu = {...choseMenu}
            },
            reset() {
                this.choseMenu = {};
                this.$emit('reset')
            },
            confirmCate() {
                let string = '';
                for (let i in this.choseMenu) {
                    if (this.choseMenu[i]) {
                        string += i + ','
                    }
                }
                this.$emit('confirmCate', {category_id: string, choseMenu: this.choseMenu})
            },
            catchTouchMove() {
                return
            },
        },
    }
</script>



<style lang="scss">
    .goods-screen {
        padding: 16rpx 24rpx 0;
        height: 100vh;
        justify-content: space-between;
        box-sizing: border-box;
        .scroll-view {
            height: calc(100% - 156rpx);
        }
        .screen-one {
            flex-wrap: wrap;
        }
        .content {
            .title {
                font-size: 28rpx;
                line-height: 40rpx;
                font-weight: bold;
                color: $uni-text-color;
                padding-top: 32rpx;
                padding-bottom: 32rpx;
            }
        }
        .item {
            margin: 0 24rpx 16rpx 0;
            width: 180rpx;
            height: 64rpx;
            border-radius: 32rpx;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24rpx;
            color: #565656;
            background: $uni-bg-color-grey;
            border: 1px solid transparent;
            &:nth-child(3n) {
                margin-right: 0;
            }
        }
        .item.active {
            background: #FFFFFF;
            border: 1px solid $uni-color-primary;
            color: $uni-color-primary;
        }
        .cate-btn {
            padding: 32rpx 0;
            box-sizing: content-box;
            height: 68rpx;
            line-height: 68rpx;
            font-size: 28rpx;
            color: $uni-text-color;

            view {
                width: 50%;
                text-align: center;
                box-sizing: border-box;
            }
            .bor-t {
                border: 1px solid $uni-border-color;
                border-radius: 40rpx 0 0 40rpx;
            }
            .sure {
                background: linear-gradient(166.61deg, $uni-color-primary 0%, #FF6F29 94.38%);
                color:#fff;
                border-radius: 0 40rpx 40rpx 0;
            }
        }
    }
    .wrap{
        padding: 32rpx 0
    }
</style>
