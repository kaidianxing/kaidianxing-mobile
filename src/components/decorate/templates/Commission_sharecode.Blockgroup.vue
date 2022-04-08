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
        <!-- 分享二维码 -->
        <div class='commission_sharecode' v-if='componentData&&componentData.id=="commission_sharecode"'>
            <div class='bg' :class='"top-"+componentData.params.topborderradius+" bot-"+componentData.params.bottomborderradius' :style='{margin:`${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`,background:componentData.style.background}'
                 @click='clickItem'>
                <div class='menu-item'>
                    <p class='lefttit'>
                        <i :class='componentData.params.iconclass' :style='{color:componentData.style.iconcolor}' class='icon'></i>
                        <span class='tit' :style='{fontSize:px2rpx(componentData.style.fontsize),color:componentData.style.textcolor}'>{{componentData.params.title}}</span>
                    </p>
                    <p class='righttit' :style="{color:componentData.style.remarkcolor}">
                        <span>{{componentData.params.subtitle}}</span>
                        <i class='iconfont-m- icon-m-right'></i>
                    </p>
                </div>
            </div>
        </div>

        <!-- 分销数据 -->
        <div class='blockgroup decorate' v-if='componentData&&componentData.id=="blockgroup"'>
            <ul class='menu-box' :style='{background:componentData.style.background}'>
                <li class='menu-item' :class='[componentData.params.sorttype,"col"+componentData.params.rownum]' v-for='(item,index) in componentData.data' :key='index' @click='clickBlockgroupItem(item)'>
                    <i class='item-icon' :class='item.iconclass' :style='{color:item.iconcolor}'></i>
                    <div class='body'>
                        <p class='title' :style="{color:item.textcolor}">{{item.text}}</p>
                        <p class="detail">
                            <span class='_span tip' :style="{color:componentData.style.tipcolor}">{{item.tipnum}}</span>
                            <span class='_span tip-unit' :style="{color:item.textcolor}">{{item.tiptext}}</span>
                        </p>
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
        name: 'commission_sharecode',
        computed: {
            getAlign() {
                if (this.componentData.style.textalign == 'left') {
                    return 'flex-start'
                } else {
                    return 'center'
                }
            }
        },
        methods: {
            clickItem() {
                this.$emit('custom-event', {
                    target: 'commission_sharecode/clickItem',
                    data: this.componentData.params
                });
            },
            clickBlockgroupItem(item) {
                this.$emit('custom-event', {
                    target: 'blockgroup/clickItem',
                    data: item
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .commission_sharecode {
        overflow: hidden;
        box-sizing: border-box;
    }
    .bg {
        display: flex;
        position: relative;
        box-sizing: border-box;
        flex-direction: column;
        padding: 0 0 0 px2rpx(12);
        border-radius: px2rpx(6);
        &.top-block {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
        &.bot-block {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }
        .menu-item {
            width: 100%;
            display: flex;
            position: relative;
            box-sizing: border-box;
            height: px2rpx(48);
            border-bottom: rpx(1) solid #eee;
        }
        .lefttit {
            display: flex;
            font-size: px2rpx(14);
            justify-content: center;
            align-items: center;
            i,
            span {
                margin: auto;
                font-size: px2rpx(18);
                line-height: px2rpx(18);
            }
            span {
                font-family: PingFang SC;
                font-style: normal;
                font-size: px2rpx(14);
                /* 文字信息/21 */
                color: $uni-text-color;
                margin-left: rpx(6);
            }
        }
        .righttit {
            position: absolute;
            cursor: pointer;
            right: rpx(20);
            display: flex;
            top: 0;
            bottom: 0;
            margin: auto;
            justify-content: center;
            align-items: center;
            font-size: px2rpx(12);
            font-family: PingFang SC;
            font-style: normal;
            font-weight: 500;
            color: $uni-text-color-grey;
            i,
            span {
                font-size: px2rpx(12);
            }
            i {
                font-size: px2rpx(16);
                margin-top: px2rpx(1);
            }
        }
    }

    .blockgroup.decorate {
        width: 100%;
        padding: 0 px2rpx(12);
    }
    .blockgroup.decorate .menu-box {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        border-radius: px2rpx(6);
        overflow: hidden;
    }
    .menu-box .menu-item {
        overflow: hidden;
        padding: px2rpx(16) 0;
        flex-shrink: 0;
        box-sizing: border-box;
        display: flex;
        color: inherit;
        width: 50%;
    }
    .menu-box .menu-item .item-icon {
        width: px2rpx(44);
        height: px2rpx(44);
        font-size: px2rpx(44);
        line-height: px2rpx(44);
        text-align: center;
        overflow: hidden;
        margin: 0 auto px2rpx(6);
    }
    .menu-box .menu-item .body {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .menu-box .body .title,
    .menu-box .body .detail {
        color: #212121;
        font-size: px2rpx(12);
        line-height: px2rpx(17);
    }
    .menu-box .menu-item .body .tip {
        color: #FF6F29;
    }
    .menu-box .menu-item.row {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        padding: px2rpx(16) 0 px2rpx(16) px2rpx(24);
    }
    .menu-box .menu-item.row .item-icon {
        margin: auto px2rpx(12) auto 0;
    }
    .menu-item.row .body .title,
    .menu-item.row .body .detail,
    .menu-item.row .body ._span {
        text-align: left;
    }
    .menu-box .menu-item.col {
        flex-direction: column;
    }
    .menu-item.col .body {
        text-align: center;
    }
    .menu-box .menu-item.col2 {
        width: 50%;
    }
    .menu-box .menu-item.col3 {
        width: 33.3%;
    }
    .menu-box .menu-item .menu-item-img {
        width: 100%;
        height: 100%;
    }
    .radius .img-box {
        border-radius: rpx(20);
    }
    .circle .img-box {
        border-radius: 50%;
    }
</style>
