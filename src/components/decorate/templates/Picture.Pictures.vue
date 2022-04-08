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
    <div class='picture-pictures'>
        <!-- picture 单图组 -->
        <ul class='picture' :style='{background:componentData.style.background, padding:`${px2rpx(componentData.style.paddingtop)} ${px2rpx(componentData.style.paddingleft)} ${px2rpx(componentData.style.paddingbottom)} `}' v-if='componentData&&componentData.id=="picture"'>
            <li v-for='(item,index) in componentData.data' :style="{
                'margin-bottom': `${px2rpx(componentData.style.marginbottom)}`
            }" :key='index' class='item' @click='clickItem(item)'>
                <img mode='widthFix' lazy-load class='img' :style="{
                        borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`
                    }" @error='error(index)' :src="errorImgs[index]||item.imgurl?$utils.mediaUrl(item.imgurl):$utils.staticMediaUrl('decorate/picture.png')" alt="">
            </li>
        </ul>
        <!-- pictures 图片展播 -->
        <div class='pictures' v-if='componentData&&componentData.id=="pictures"' :style="{'padding':`${px2rpx(componentData.style.paddingtop)} ${px2rpx(componentData.style.paddingleft)} 0`}">
            <ul class='pictures-list' :class="{'list': !isScroll}" :style="{
                    'padding-bottom': px2rpx(componentData.style.paddingbottom),
                }">
                <li class='pictures-item' :class='["col-"+componentData.params.rownum]' v-for="(item,index) in componentData.data" :style="{
                    width: getWidth
                }" :key='index' @click="clickPicturesItem(item)">
                   <div class="pictures-item-container" :style="{
                       borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)}  ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`,
                   }">
                        <div class="img-box" :style="{
                        height: getHeight
                    }">
                        <img mode='widthFix' lazy-load :src="getImg(item.imgurl)" alt="" class='goods-img' v-if='startLoadImg'>
                        <p class="title" :style="{color:componentData.style.titlecolor,fontSize:px2rpx(25-componentData.params.rownum),textAlign:componentData.style.titlealign}" v-if='item.title'>{{item.title}}</p>
                    </div>
                    <p class="text" :style="{
                        color:componentData.style.textcolor,
                        fontSize:px2rpx(25-componentData.params.rownum),
                        textAlign:componentData.style.textalign,
                        background:componentData.style.background
                    }" v-if='item.text'>{{item.text}}</p>
                   </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        data() {
            return {
                errorImgs: {}
            }
        },
        computed: {
            isScroll() {
                return this.componentData.params ?.showtype != 0
            },
            getWidth() {
                if (this.componentData.params.showtype == '0') {
                    let rownum = this.componentData.params.rownum;
                    return this.px2rpx((750 - (rownum - 1) * 2 * 8 - (this.componentData.style.paddingleft * 2)) / rownum)
                } else {
                    return ''
                }
            },
            getHeight() {
                if (this.componentData.params.imgheight) {
                    return this.px2rpx(this.componentData.params.imgheight)
                }
                return ''
            }
        },
        mounted() {
            if (this.componentData.id == "pictures" && this.componentData.params.imgheight == null) {
                this.componentData.params.imgheight = ''
            }
        },
        methods: {
            clickPicturesItem(item) {
                this.$emit('custom-event', {
                    target: 'pictures/clickItem',
                    data: item
                });
            },
            getImg(imgurl) {
                if (imgurl) {
                    return this.$utils.mediaUrl(imgurl)
                } else {
                    if (this.componentData.params.rownum == '1') {
                        return this.$utils.staticMediaUrl('decorate/pictures.png')
                    } else {
                        return this.$utils.staticMediaUrl('decorate/goods_col2.png')
                    }
                }
            },
            error(index) {
                this.componentData.data[index].imgurl = this.$utils.staticMediaUrl('decorate/picture.png')
                this.errorImgs[index] = this.$utils.staticMediaUrl('decorate/picture.png');
                this.errorImgs = { ...this.errorImgs}
            },
            clickItem(item) {
                this.$emit('custom-event', {
                    target: 'picture/clickItem',
                    data: item
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .picture {
        width: 100%;
        display: flex;
        flex-direction: column;
        .item {
            width: 100%;
            margin: 0 auto;
            margin-bottom: px2rpx(8);
            box-sizing: border-box;
            &:last-child {
                margin-bottom: 0!important;
            }
            .img {
                border-radius: px2rpx(6);
                width: 100%;
                display: block;
            }
        }
    }
    .pictures {
        .pictures-list {
            display: flex;
            overflow-x: scroll;
            &.list {
                overflow-x: hidden;
                flex-wrap: wrap;
                .pictures-item {
                    margin-top: px2rpx(8);
                    box-sizing: content-box;
                    padding-right: 0;
                    &.col-1 {
                        &:nth-child(-n+1) {
                            margin-top: 0;
                        }
                        padding-right: 0;
                        .img-box {
                            height: px2rpx(148);
                        }
                    }
                    &.col-2 {
                        &:nth-child(-n+2) {
                            margin-top: 0;
                        }
                        &:nth-child(even) {
                            padding-left: px2rpx(4);
                        }
                        &:nth-child(odd) {
                            padding-right: px2rpx(4);
                        }
                        .img-box {
                            height: px2rpx(154);
                        }
                    }
                    &.col-3 {
                        &:nth-child(-n+3) {
                            margin-top: 0;
                        }
                        &:nth-child(3n-2),
                        &:nth-child(3n-1) {
                            padding-right: px2rpx(4);
                        }
                        &:nth-child(3n-1),
                        &:nth-child(3n) {
                            padding-left: px2rpx(4);
                        }
                        .img-box {
                            height: px2rpx(100);
                        }
                    }
                    &.col-4 {
                        &:nth-child(-n+4) {
                            margin-top: 0;
                        }
                        &:nth-child(4n) {
                            padding-right: 0;
                            padding-left: px2rpx(4);
                        }
                        &:nth-child(4n-1),
                        &:nth-child(4n-2) {
                            padding-left: px2rpx(4);
                            padding-right: px2rpx(4);
                        }
                        &:nth-child(4n-3) {
                            padding-right: px2rpx(4);
                        }
                        .img-box {
                            height: px2rpx(76);
                        }
                    }
                }
            }
        }
        .pictures-item {
            flex-shrink: 0;
          
            padding-right: px2rpx(8);
            &-container {
                position: relative;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-sizing: content-box;
            }
            &:last-child {
                padding-right: 0;
            }
            .img-box {
                margin: 0 auto;
                width: 100%;
                box-sizing: border-box;
                position: relative;
                overflow: hidden;
                .goods-img {
                    width: 100%;
                    display: block;
                }
                .title {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    width: 100%;
                    line-height: px2rpx(25);
                    color: #fff;
                    font-size: px2rpx(12);
                    text-align: center;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    box-sizing: border-box;
                    padding: 0 px2rpx(8);
                    background: linear-gradient(0deg, rgba(0, 0, 0, 0.54) 0%, rgba(0, 0, 0, 0) 100%);
                }
            }
            .text {
                margin: 0 auto;
                text-align: center;
                line-height: px2rpx(20);
                color: #666;
                font-size: px2rpx(14);
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                width: 100%;
                flex: 1;
                padding: 0 px2rpx(8);
            }
            .img-box {
                .goods-img {
                    width: 100%;
                    min-height: 100%;
                }
            }
            &.col-1 {
                width: px2rpx(300);
                .img-box {
                    height: px2rpx(148);
                }
            }
            &.col-2 {
                width: px2rpx(154);
                .img-box {
                    height: px2rpx(154);
                }
            }
            &.col-3 {
                width: px2rpx(100);
                .img-box {
                    height: px2rpx(100);
                }
            }
            &.col-4 {
                width: px2rpx(76);
                .img-box {
                    height: px2rpx(76);
                }
            }
        }
    }
</style>