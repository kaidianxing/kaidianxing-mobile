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
    <div class="temp-one">
        <scroll-view
            class="temp-scroll-box"
            scroll-x
            :scroll-left="getScrollX"
            scroll-with-animation
        >
            <div class="scroll-container">
                <div
                    class="menu-list"
                    v-for="(item, index) in list"
                    :key="index"
                    :class="{
                        'active': active == index
                    }"
                    @click="clickItem(item.id,index)"
                >
                    <div class="menu-advimg-image">
                        <img
                            :src="item.thumb?$utils.mediaUrl(item.thumb): $utils.staticMediaUrl('decorate/goods_col2.png')"
                            class="menu-advimg"
                            :class="{
                                'theme-primary-border': active == index
                            }"
                        />
                    </div>
                    <div
                        class="menu-title"
                        :class="{
                            'theme-primary-bgcolor': active == index
                        }"
                    >{{$utils.showCategoryName(item.name)}}</div>
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
        }
    },
    data() {
        return {
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
    mounted() {
        setTimeout(() => {
            this.$getRect('.scroll-container').then(res => {
                let { left, width } = res
                this.rectStyle = { left, width }
            })
            this.$getRect('.menu-list', true).then(res => {
                this.rectList = res
            })
        }, 0);
    },
    methods: {
        clickItem(id, index) {
            if(this.active == index) return;
            this.$emit('on-choose', {
                id, index
            })
        }
    }
}
</script>


<style lang="scss" scoped>
.temp-one {
    background: #fff;
    padding-bottom: px2rpx(10);
    .temp-scroll-box {
        .scroll-container {
            display: flex;
            padding: 0 px2rpx(12);
        }
    }
    .menu-list {
        //display: flex;
        //flex-direction: column;
        //align-items: center;
        margin-right: px2rpx(12);
        //max-width: px2rpx(70);
        //min-width: px2rpx(56);
        width: px2rpx(70);
        flex-shrink: 0;

        &.active {
            .menu-advimg {
                border: px2rpx(1) solid #ff3c29;
                filter: drop-shadow(0px 4px 4px rgba(231, 83, 0, 0.05));
            }

            .menu-title {
                /*border-radius: px2rpx(15);*/
                border-radius: px2rpx(6);
                background: linear-gradient(
                    161.72deg,
                    #ff3c29 0%,
                    #ff6f29 94.38%
                );
                color: #fff;
            }
        }
        .menu-advimg-image {
            text-align: center;
        }
        .menu-advimg {
            margin-bottom: px2rpx(5);
            height: px2rpx(44);
            width: px2rpx(44);
            border-radius: 50%;
        }

        .menu-title {
            //max-width: px2rpx(70);
            //min-width: px2rpx(56);
            width: 100%;
            padding: 0 px2rpx(4);
            /*white-space: nowrap;*/
            /*height: px2rpx(17);*/
            font-size: px2rpx(12);
            text-align: center;
            line-height: px2rpx(17);
            color: #212121;
            overflow: hidden;
            word-wrap: break-word;
            word-break: normal;
        }
    }
    /*去除scroll-view的滚动条*/
    /deep/ .temp-scroll-box {
        /*#ifdef H5*/
        .uni-scroll-view {
            &::-webkit-scrollbar {
                display: none;
            }
        }
        /*#endif*/
        /*#ifndef H5*/
        ::-webkit-scrollbar{
            display: none;
        }
        /*#endif*/
    }
}
</style>
