<template>
    <div class="cate-aside" :class="{'cate-aside-height': list.length || goods.length || mask}">
        <scroll-view
            scroll-y
            class="cate-aside-box"
            @scrolltolower="lowerHandler"
            @scroll="scrollHandler"
        >
            <div class="cate-container">
                <img
                    v-if="advImg"
                    :src="$utils.mediaUrl(advImg)"
                    class="cate-img"
                    @click="goAdv"
                />
            </div>
            <div
                v-if="showCate  && list.length"
                class="cate-choose normal"
            >
                <slot name="cate"></slot>
            </div>
            <div
                class="scroll-container"
                :style="{
                height:getMinHeight
            }"
            >
                
                <div class="scroll-box">
<div
                    class="mask"
                    v-if="mask"
                    @touchmove.stop.prevent
                ></div>
                    <slot></slot>
                </div>

            </div>
        </scroll-view>
        <div
            v-if="showCate && list.length && fixed"
            class="cate-choose fixed"
        >
            <slot name="catefixed"></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        active: {
            type: Number,
            default: 0
        },
        mask: {
            type: Boolean,
            default: false
        },
        advImg: String,
        advUrl: String,
        showCate: {
            type: Boolean,
            default: false
        },
        list: {
            type: Array,
            default: () => []
        },
        tempKey: [String,Number],
        advImgHeight: [String,Number],
        goods: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            fixed: false,
            cateStyle: null,
        }
    },
    computed: {
        getMinHeight() {
            let num = this.advImg ? this.advImgHeight : 0
            return `calc(100% - ${uni.upx2px(96 + num)}px)`
        }
    },
    watch: {
        tempKey(){
            this.fixed = false
        },
    },
    mounted() {
        setTimeout(() => {
            this.$getRect('.cate-aside').then(res => {
                this.cateStyle = res
            })
        }, 0);
    },
    methods: {
        scrollHandler(e) {
            let num = this.advImg ? uni.upx2px(this.advImgHeight) : 0;
            if (e.detail.scrollTop > num && !this.fixed) {
                this.fixed = true
            } else if (e.detail.scrollTop < num && this.fixed) {
                this.fixed = false
            }
        },
        lowerHandler() {
            this.$emit('load-list')
        },
        goAdv() {
            if (this.advUrl) {
                this.$Router.auto(this.advUrl);
            }
        }
    }

}
</script>

<style lang="scss" scoped>
.cate-aside {
    padding-top: px2rpx(8);
    background: #fff;
    //height: 100%;
    position: relative;
    z-index:1;
    &.cate-aside-height {
        height: 100%; // 处理缺省图和分类之间的层级问题，当高度为100%时会将缺省图盖住
    }
    &-box {
        height: 100%;
    }

    .cate-container {
        .cate-img {
            display: block;
            margin: 0 auto;
            border-radius: px2rpx(6);
            width: px2rpx(267);
            height: px2rpx(89);
        }
    }

    .cate-choose {
        height: px2rpx(40);
        &.normal {
            position: relative;
            z-index: 99;
        }

        &.fixed {
            position: absolute;
            z-index: 100;
            height: px2rpx(40);
            top: 0;
            width: 100%;
            right: 0;
        }
    }


    .scroll-box {
        position: relative;
        min-height: 100%;

        background: #fff;
        .mask {
            position: absolute;
            left: 0;
            top: px2rpx(9);
            z-index: 98;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
        }
    }
}
</style>