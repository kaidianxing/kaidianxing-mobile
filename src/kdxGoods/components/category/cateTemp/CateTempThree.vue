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
    <div class="temp-three">
        <div class="arrow-icon">
            <i
                class="iconfont-m- icon-m-up icon-arrow"
                @click="pickCate(false)"
                v-if="showModal"
            ></i>
            <i
                class="iconfont-m- icon-m-down icon-arrow"
                @click="pickCate(true)"
                v-else
            ></i>
        </div>
        <img
            :src="$utils.staticMediaUrl('left-shadow.png')"
            class="left-shadow"
        />
        <scroll-view
            class="choose-cate"
            scroll-y
            v-if="showModal"
        >
            <div class="choose-cate-content">
                <div
                    class="choose-cate-item"
                    :class="{
                    'theme-primary-color theme-sub-bgcolor theme-spec-bgcolor': active ==index
                }"
                    v-for="(item, index) in list"
                    :key="index"
                    @click="clickItem(item.id,index)"
                >{{$utils.showCategoryName(item.name)}}</div>
            </div>
        </scroll-view>

        <scroll-view
            class="cate"
            scroll-x
            :scroll-left="getScrollX"
            scroll-with-animation
        >
            <div class="cate-items">
                <div class="cate-item" :class="{'theme-primary-color theme-sub-bgcolor theme-spec-bgcolor': active ==index}" v-for="(item, index) in list" @click="clickItem(item.id,index)" :key="index">
                    {{$utils.showCategoryName(item.name)}}
                </div>
            </div>
        </scroll-view>
    </div>
</template>

<script>
export default {
    props: {
        list: {
            type: Array,
            default: () => []
        },
        active: {
            type: Number,
            default: 0
        },
        tempKey: [String, Number]
    },
    data() {
        return {
            showModal: false,
            rectList: [],
            rectStyle: null
        }
    },
    computed: {
        getScrollX() {
            if (!this.rectStyle || this.rectList.length == 0) {
                return 0
            }
            let rl = this.rectStyle.left
            let rw = this.rectStyle.width
            let { left, width } = this.rectList[this.active]

            let x = (left - rl) - (rw / 2) + (width / 2)
            return x <= 0 ? 0 : x

        }
    },
    watch: {
        tempKey() {
            this.showModal = false
        },
        list: {
            handler(val) {
                setTimeout(() => {
                    this.$getRect('.temp-three').then(res => {
                        let { left, width } = res
                        this.rectStyle = { left, width }
                    })
                    this.$getRect('.cate-item', true).then(res => {
                        this.rectList = res
                    })
                }, 0);
            },
            immediate: true
        }
    },
    methods: {
        pickCate(status) {
            this.showModal = status
            this.$emit('on-mask', status)
        },
        clickItem(id, index) {
            this.pickCate(false)
            if (this.active == index) return;
            this.$emit('on-choose', {
                id, index
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.temp-three {
    position: relative;
    display: flex;
    height: px2rpx(40);
    padding: 0 px2rpx(48) 0 px2rpx(8);
    align-items: center;
    background: #fff;

    .left-shadow {
        position: absolute;
        right: px2rpx(40);
        top: 0;
        z-index: 3;
        width: px2rpx(11);
        height: px2rpx(40);
        object-fit: cover;
    }

    .arrow-icon {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        height: px2rpx(40);
        width: px2rpx(40);
        background: #fff;

        .icon-arrow {
            font-size: px2rpx(16);
            color: #969696;
            z-index: 99;
        }
    }

    .choose-cate {
        position: absolute;
        top: 100%;
        left: 0;
        padding: px2rpx(8) 0 px2rpx(16) px2rpx(8);
        width: 100%;
        z-index: 100;
        background: #fff;
        height: px2rpx(300);

        ///deep/ .uni-scroll-view-content {
        //    display: flex;
        //    flex-wrap: wrap;
        //    height: 0;
        //}
        .choose-cate-content {
            display: flex;
            flex-wrap: wrap;
            height: 0;
        }
        &-item {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin: 0 px2rpx(8) px2rpx(8) 0;
            width: px2rpx(85);
            padding: 0 px2rpx(12);
            height: px2rpx(32);
            line-height: px2rpx(14);
            font-size: px2rpx(12);
            color: #565656;
            background: $uni-bg-color-grey;
            border-radius: px2rpx(4);
            text-align: center;
            overflow: hidden;

            &.active {
                color: #367bf5;
                background: #e6efff;
            }
        }
    }

    .cate {
        position: relative;
        width: 100%;
        //white-space: nowrap;

        .cate-items {
            display: flex;
            height: px2rpx(40);
            align-items: center;

            .cate-item {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                width: px2rpx(76);
                padding: 0 px2rpx(8);
                margin-right: px2rpx(6);
                height: px2rpx(32);
                line-height: px2rpx(14);
                background: $uni-bg-color-grey;
                font-size: px2rpx(12);
                color: #565656;
                text-align: center;
                overflow: hidden;
                border-radius: px2rpx(4);
                word-break:break-all;

                &.active {
                    color: #367bf5;
                    background: #e6efff;
                }
            }
        }
    }
}
</style>