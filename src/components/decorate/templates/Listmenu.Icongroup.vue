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
        <!-- 列表导航 -->
        <div class='listmenu'  v-if='componentData&&componentData.id=="listmenu"'  :style='{padding:`${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`}'>
            <div  class="container" :style='{
            background:componentData.style.background,
            borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`,}'>
                <ul class='bg'>
                    <li v-for='(item,index) in componentData.data' :key='index' class='menu-item' :style="{
                    'border-bottom-color': componentData.style.dividercolor
                }" @click='clickSubtitle(item)'>
                        <p class='lefttit'>
                            <i :class='item.iconclass' :style='{color:item.iconcolor}' class='icon'></i>
                            <span class='tit' :style='{color:item.textcolor}'>{{item.text}}</span>
                        </p>
                        <p class='righttit' v-if="componentData.params.showmore!='0'" >
                            <span :style="{color:componentData.style.remarkcolor}">{{componentData.params.remark}}</span>
                            <i :class="componentData.params.righticon" :style="{color: componentData.style.righticoncolor}"></i>
                        </p>
                    </li>
                </ul>
            </div>
        </div>

        <!-- 图标组 -->
        <div class='icongroup' :style="{
            padding:`${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`
        }"  v-if='componentData&&componentData.id=="icongroup"'>
            <ul class='bg' :style='{
            background:componentData.style.background,
            borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`,
        }'>
                <li class='icon-item' :style='{width:`${100/componentData.params.rownum}%`}' v-for='(item,index) in componentData.data' :key='index' @click='clickItem(item,index)'>
                    <div class="icon-box">
                        <i class='custom-icon' :class="item.iconclass?item.iconclass:'iconfont-m- icon-m-xingxingshixin'" :style="{color:componentData.style.iconcolor}"></i>
                        <!-- 暂未开放 -->
                        <span class="badge" v-if='item[item.linkurl]>0' :style="{background:componentData.style.dotcolor}">{{item[item.linkurl]}}</span>
                    </div>
                    <p class="title" :style="{color:componentData.style.textcolor}">
                        {{item.text}}
                    </p>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'listmenu',
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
            clickSubtitle(item) {
                this.$emit('custom-event', {
                    target: 'listmenu/clickSubtitle',
                    data: item
                });
            },
            clickItem(item) {
                this.$emit('custom-event', {
                    target: 'icongroup/clickItem',
                    data: item
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .listmenu{
        padding:px2rpx(8) px2rpx(12) 0;
    }

    .container {
        padding-left: px2rpx(12);
        border-radius: px2rpx(6);
    }
    .listmenu .bg {
        width: 100%;
        display: flex;
        position: relative;
        box-sizing: border-box;
        flex-direction: column;
        border-radius: px2rpx(6);
        .menu-item {
            width: 100%;
            display: flex;
            position: relative;
            box-sizing: border-box;
            height: px2rpx(48);
            border-bottom: rpx(1) solid #eee;

            &:last-child {
                border-bottom: 0;
            }
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


    .icongroup {
        padding: px2rpx(8) px2rpx(12) 0;
    }
    .icongroup .bg {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;
        border-radius: px2rpx(6);
        .icon-item {
            display: flex;
            flex-direction: column;
            height: px2rpx(85);
        }
        .icon-box {
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            position: relative;
            padding: px2rpx(16) 0 px2rpx(8);
            .custom-icon {
                font-size: px2rpx(28);
                height: px2rpx(28);
                line-height: px2rpx(28);
                display: flex;
                flex-direction: column;
                &:before {
                    width: px2rpx(28);
                    height: px2rpx(28);
                }
            }
            .badge {
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                flex-direction: column;
                position: absolute;
                min-width: px2rpx(12);
                height: px2rpx(12);
                line-height: px2rpx(12);
                font-size: px2rpx(8);
                padding: 0 px2rpx(3);
                right: 0;
                top: px2rpx(12);
                background: red;
                border-radius: px2rpx(11);
                text-align: center;
                color: #fff;
                transform: translate(30%, 0);
                font-weight: bold;
            }
        }
        .title {
            text-align: center;
            margin: 0 auto;
            font-size: px2rpx(12);
            line-height: px2rpx(17);
        }
    }
</style>
