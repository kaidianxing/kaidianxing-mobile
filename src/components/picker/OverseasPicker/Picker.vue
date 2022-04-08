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
    <div class='custom-picker' ref='picker'>
        <scroll-view class="body" scroll-y ref='pickBody' :scroll-top='scrollTop' :scroll-into-view='scrollTo'
                     @scroll='scroll'>
            <slot name='hot-areas'></slot>
            <ul class="items" ref='pickerItems'>
                <li v-for='(item,index) in items' :id='"li-"+item' :key='index'>
                    <div v-if='areaList[item] && areaList[item].length > 0'>
                        <div class="label" v-if="areaGrade != 'country'">{{ item }}</div>
                        <ul class='custom-content' :class="{'country': areaGrade == 'country'}">
                            <li v-for='(val,key) in areaList[item]' :key='key' @click='clickItem(val)'
                                :class="{'van-hairline--bottom':areaGrade != 'country'}" :style="border_bottom">
                                <span v-if="areaGrade == 'country'">国外（自定义地址）</span>
                                <span v-else>{{ val.name }}</span>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </scroll-view>
        <ul class="vertical-menu-bar" v-if="areaGrade!='country'">
            <li class='theme-primary-color'>
                <i class="iconfont-m- icon-m-remen"></i>
            </li>
            <li class="uni-text-color-grey" :class='{activeMenuItem:currentArea==item}' v-for='(item,index) in items'
                :key='index' @click='selectAreaId(index)' v-show='areaList[item]&&areaList[item].length'>
                {{ item }}
            </li>
        </ul>
    </div>
</template>

<script>
//picker中 A-Z的分别的位置尺寸
let allListRects = {};
let throttle = false;
let rpx2px = 2;
export default {
    props: {
        margin: { //距离下个区块多远就算是下一个了
            type: Number,
            default: 15
        },
        areas: {
            type: Array,
            default: []
        },
        pickerTop: {
            type: Number,
            default: 50
        },
        areaGrade: {
            type: String
        },
    },
    data() {
        return {
            items: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
            currentArea: 'A',
            scrollTop: 0,
            scrollTo: 'A',
            // height: 'height:668rpx',
            padding_top: 'padding-top: 32rpx',
            border_bottom: 'border-style:none'
        }
    },
    computed: {
        areaList() {
            let list = {};
            this.areas.forEach(item => {
                if (list[item.letterId]) {
                    list[item.letterId].push(item);
                } else {
                    list[item.letterId] = [item];
                }
            });
            if (this.areas && this.areas.length) {
                this.$nextTick(() => {
                    this.getElementRect();
                })
            }
            return list;
        }
    },
    watch: {
        pickerTop() {
            this.getElementRect();
        },
    },
    beforeMount() {
      rpx2px = uni.getSystemInfoSync().screenWidth / 750;
    },
    methods: {
        clickItem(e) {
            this.$emit('click', e);
        },
        // 统计所需元素的尺寸位置信息
        getElementRect() {
            let curTop = 0;
            let tmp = [];
            this.items.forEach((item, index) => {
                tmp.push(this.areaList[item] ? this.areaList[item].length * 81 : 24);
                curTop += tmp[index - 1] || 0;
                allListRects[item] = {
                    height: tmp[index],
                    top: curTop
                };
            });
        },
        // 点击侧面菜单事件
        selectAreaId(index) {
            this.currentArea = this.items[index];
            this.bodyScrollTo(this.currentArea);
        },
        // picker滚动事件
        scroll(e) {
            if (!throttle) {
                throttle = true;
                setTimeout(() => {
                    let scrollTop = e.detail.scrollTop /rpx2px - this.pickerTop;
                    let currentRect = null;
                    for (let k in allListRects) {
                        currentRect = allListRects[k];
                        if (scrollTop - currentRect.scrollTop >= 0 && scrollTop - currentRect.scrollTop - currentRect.height <= 0) {
                            this.currentArea = k;
                            break;
                        }
                    }
                    throttle = false;
                }, 50)
            }
        },
        // picker卷入高度设置
        bodyScrollTo(id) {
            this.scrollTo = 'li-' + id;
        }
    },
}
</script>

<style lang="scss" scoped>
.custom-picker {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    border-radius: 25rpx;

    .body {
        box-sizing: border-box;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: auto;
        padding: 32rpx 24rpx 0;

        .items {
            box-sizing: border-box;
            width: 100%;
            display: flex;
            flex-direction: column;

            > li > div {
                box-sizing: border-box;
                width: 100%;
                /*display: flex;*/
                .label {
                    /*display: inline-block;*/
                    /*width: 40rpx;*/
                    font-size: 20rpx;
                    font-weight: 500;
                    color: $uni-text-color-grey;
                    line-height: 28rpx;
                }

                ul {
                    margin: 30rpx 0 32rpx;
                    box-sizing: border-box;
                    /*width: 0;*/
                    /*flex-grow: 1;*/
                    &.country {
                        margin: 0;
                    }

                    > li {
                        font-size: 26rpx;
                        font-weight: 500;
                        color: $uni-text-color;
                        line-height: 34rpx;
                        margin: 0 0 32rpx;

                        &:last-child {
                            padding-bottom: 32rpx;
                            margin-bottom: 0;

                            &.van-hairline--bottom:after {
                                border-bottom-color: $uni-border-color;
                                border-style: solid;
                            }
                        }
                    }
                }
            }
        }
    }

    .vertical-menu-bar {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        right: 0;
        border-radius: 25rpx;
        padding: 20rpx 0;
        background: #fff;
        width: 44rpx;
        min-height: 500rpx;

        li {
            width: 100%;
            margin-bottom: 8rpx;
            font-size: 16rpx;
            line-height: 22rpx;
            text-align: center;
            font-weight: 500;
            white-space: nowrap;
        }

        .hot {
            color: $uni-color-primary;
        }

        .activeMenuItem {
            color: #FD463E;
        }
    }
}
</style>
