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
    <div class='swiper' :style='{height}'>
        <swiper :current='value' touchable :autoplay="!setting.autoplay===false" :circular="!setting.loop===false" :interval="setting.autoplaySpeed" :duration="setting.duration||500" @change='change' :key='key'>
            <swiper-item v-for="(item,index) in list" :key='index'>
                <slot :data='index' :item='item'>
                    <img v-if="!isArticle" lazy-load :mode='imgMode' :style='(height?("height:"+height):"")+getImgStyle+(";border-radius:"+(height=="100vh"?"0":borderRadius))' :src="item.img ? item.img : item" alt="" class="swiper-img"/>
                    <img v-else lazy-load :mode='imgMode' :style='(height?("height:"+height):"")+getImgStyle+(";border-radius:"+(height=="100vh"?"0":borderRadius))' :src="`${item.img ? item.img : item}?t=${new Date().getTime()}`" alt="" class="swiper-img"/>
                </slot>
            </swiper-item>
        </swiper>
    </div>
</template>

<script>
    export default {
        props: {
            imgMode: {
                type: String,
                default: "scaleToFill"
            },
            imgStyle: {
                type: Object,
                default: () => ({})
            },
            height: {
                type: String,
                default: ''
            },
            list: {
                type: Array,
                default: () => []
            },
            startIndex: {
                type: Number,
                default: 0
            },
            setting: {
                type: Object,
                default: () => ({
                    duration: 500,
                    autoplay: true,
                    autoplaySpeed: 3000,
                    loop: true
                })
            },
            borderRadius: {
                type: String,
                default: '12rpx'
            }
        },
        computed: {
            getImgStyle() {
                let tmp = ';';
                for (let k in this.imgStyle) {
                    tmp += `${k}:${this.imgStyle[k]};`
                }
                return tmp
            },
            isArticle() {
                return this.$Route.path === '/kdxArticle/detail/index'
            }
        },
        watch: {
            list: {
                immediate: true,
                deep: true,
                handler() {
                    this.key = Math.random();
                    this.value = this.startIndex
                }
            }
        },
        data() {
            return {
                key: '',
                value: 0,
            }
        },
        methods: {
            change(val) {
                let {
                    detail: {
                        current
                    }
                } = val;
                this.$emit('change', current)
            },
            click(val) {
                this.$emit('click', val)
            }
        }
    }
</script>

<style lang="scss">
    swiper {
        height: 100%;
    }
    .swiper-img {
        text-align: center;
        width: 100%;
        display: block;
        margin: 0 auto;
    }
    .swiper {
        overflow: hidden;
    }
</style>