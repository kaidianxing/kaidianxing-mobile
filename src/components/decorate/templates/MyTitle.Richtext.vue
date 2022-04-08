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
    <div>
        <!-- 标题栏 -->
        <div class='title' :style='{"padding":`${px2rpx(componentData.style.paddingtop)} ${px2rpx(componentData.style.paddingleft)} ${px2rpx(componentData.style.paddingbottom)}`}' @click='clickSubtitle' v-if='componentData&&componentData.id=="title"&&componentData.show!==false'>
            <div class='bg' :style='{"justify-content":getAlign,background:componentData.style.background,borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`}'>
                <div>
                    <p class='lefttit' :style='{"justify-content":getAlign}'>
                        <i :class='componentData.params.icon' v-if="componentData.params.icon" :style='{color:componentData.style.iconcolor,fontSize: getIconSize,lineHeight:getIconSize,width:getIconSize,height:getIconSize}' class='icon'></i>
                        <span class='tit' :style='{color:componentData.style.color,fontSize: getTitleSize,fontWeight:getFontWeight}'>{{componentData.params.title}}</span>
                    </p>
                    <p class="bottomtit line-hide" v-if="componentData.params.showTitle == '1'"
                       :style='{color:componentData.style.secondcolor,fontSize: getSecondTitleSize,fontWeight:getFontWeight}'>
                        {{componentData.params.secondTitle}}</p>

                </div>
                <p class='righttit' v-if="componentData.params.showmore!='0'" :style="{color:componentData.style.subtitlecolor}">
                    <span class='_span'>{{componentData.params.subTitle}}</span>
                    <i class='_i' :class="componentData.params.righticon" :style="{color: componentData.style.righticoncolor}"></i>
                </p>
            </div>
        </div>

        <!-- 富文本 -->
        <div
                class='richtext'
                :style="{padding:`${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`}"
                v-if='componentData&&componentData.id=="richtext"'
        >
            <div
                    class="container"
                    :style="{
                background:componentData.style.background,
                borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`,
                padding: `0 ${px2rpx(componentData.style.padding)}`
            }"
            >
                <my-rich-text :content='componentData.params.content'></my-rich-text>
            </div>
        </div>

    </div>
</template>

<script>
    import mixin from './mixin.js'
    import MyRichText from '../templates-shim/RichText.vue'
    export default {
        mixins: [mixin],
        components: {
            MyRichText
        },
        name: 'mytitle',
        data() {
            return {
                content: ''
            }
        },
        computed: {
            getAlign() {
                if (this.componentData.style.textalign == 'left') {
                    return 'flex-start'
                } else {
                    return 'center'
                }
            },
            getIconSize(){
                if(this.componentData.style.titlesize != null) {
                    return this.px2rpx(parseInt(this.componentData.style.titlesize) + 8)
                }
                return this.px2rpx(48)
            },
            getTitleSize(){
                if(this.componentData.style.titlesize != null) {
                    return this.px2rpx(parseInt(this.componentData.style.titlesize))
                }
                return this.px2rpx(28)
            },
            getSecondTitleSize(){
                if(this.componentData.style.secondTitlesize != null) {
                    return this.px2rpx(parseInt(this.componentData.style.secondTitlesize))
                }
                return this.px2rpx(28)
            },
            getFontWeight(){
                return this.componentData.params.titleweight || 'bold'
            }
        },
        methods: {
            clickSubtitle() {
                this.$emit('custom-event', {
                    target: 'title/clickSubtitle',
                    data: this.componentData.params
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';

    .bg {
        width: 100%;
        margin: 0 auto;
        display: flex;
        position: relative;
        box-sizing: border-box;
        //height: px2rpx(40);
        padding: 0 px2rpx(8)  0 px2rpx(12);
        border-radius: px2rpx(6);
        overflow: hidden;
        .lefttit {
            display: flex;
            align-items: center;
            padding: px2rpx(8) 0 px2rpx(4) 0;
            .icon {
                margin-right: rpx(10);
                font-size: px2rpx(18);
                text-align: center;
                display: inline-block;
                vertical-align:middle;
                &::before{
                    display:block;
                    margin:auto;
                    /*transform: translate( 0,7%);*/
                }
            }
            span {
                font-family: PingFang SC;
                font-style: normal;
                font-weight: bold;
                font-size: px2rpx(14);
                /* 文字信息/21 */
                line-height: px2rpx(22);
                color: $uni-text-color;
                vertical-align:middle;
            }
        }
        .bottomtit {
            width: px2rpx(278);
            padding-bottom: px2rpx(8);
        }
        .righttit {
            position: absolute;
            cursor: pointer;
            right: px2rpx(8);
            display: flex;
            top: 0;
            bottom: 0;
            margin: auto;
            justify-content: center;
            align-items: center;
            font-size: px2rpx(12);
            font-family: PingFang SC;
            font-style: normal;
            font-weight: normal;
            color: $uni-text-color-grey;
            ._i {
                font-size: px2rpx(16);
            }
            ._i,
            ._span {
                font-weight: normal;
                line-height: rpx(30)
            }
        }
    }

    .richtext {
        box-sizing: border-box;
        .container {
            border-radius: px2rpx(6);
            min-height: rpx(100);
            overflow: hidden;
        }
    }
</style>
