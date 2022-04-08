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
    <div class='detail_pullup isbottom' :style='{marginTop:px2rpx(componentData.style.margintop),padding:`${px2rpx(componentData.style.margintop)}  ${px2rpx(componentData.style.marginleft)}  ${px2rpx(componentData.style.marginbottom)} `}'  v-if='componentData&&componentData.id=="detail_pullup"'>
        <div style="overflow: hidden" :style="{'border-radius':`${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`,background:componentData.style.background}">
        <div class="tab" :style='{background:componentData.style.background}' v-if="isShowTab">
            <p class='item' @click='changeTab("detail")'><span class='_span detail' :class='{active:curTab=="detail"}'>详情</span></p>
            <p class='item'  @click='changeTab("params")'><span class='_span params' :class='{active:curTab=="params"}'>参数</span></p>
        </div>
        <div class="body" :style='(curTab=="detail"?"padding:0":"")+";background:"+componentData.style.background'>
            <div class="detail" v-if='curTab=="detail"'>
                <img class="detail_img" v-if="$isPC" :src="$utils.staticMediaUrl('decorate/no_shopdetail.png')" />
                <div class="detail_content" v-if="componentData.params.content">
                    <my-rich-text @click.native="detailClick" :content='componentData.params.content'></my-rich-text>
                </div>
            </div>
            <ul class='params _ul' v-else>
                <li class='_li' v-for='(item,index) in componentData.data' :key='index'>
                    <p class="key">{{item.key}}</p>
                    <p class="value">{{item.value}}</p>
                </li>
            </ul>
        </div>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    import MyRichText from '@/components/decorate/templates-shim/RichText.vue'
    export default {
        components: {
            MyRichText
        },
        mixins: [mixin],
        name: 'detail_pullup',
        data() {
            return {
                curTab: 'detail'
            }
        },
        computed: {
            // 是否显示tab
            isShowTab() {
                if (this.$isPC) {
                    return true;
                }
                return 0 !==  this.componentData.params.params_switch && this.componentData?.params?.content && this.componentData?.data?.length
            }
        },
        mounted() {
            if (!this.$isPC) {
                this.curTab = this.componentData?.params?.content ? 'detail' : 'params';
            }
        },
        methods: {
            changeTab(tab) {
                this.curTab = tab;
            },
            detailClick(event){
                this.$emit('custom-event', {
                    target: 'detail_pullup/clickDetail',
                    data:{
                        event,
                        content: this.componentData.params.content
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "./decorate.scss";
    .detail_pullup {
        box-sizing:border-box;
        overflow:hidden;
        .tab {
            width: 100%;
            height: px2rpx(40);
            display: flex;
            flex-wrap: nowrap;
            border-bottom: px2rpx(0.5) solid #e6e7eb;
            justify-content: center;
            .item {
                height: 100%;
                width: 50%;
                display: flex;
                justify-content: center;
                ._span {
                    display: inline-block;
                    height: 100%;
                    text-align: center;
                    justify-content: center;
                    position: relative;
                    font-size: px2rpx(14);
                    color: #565656;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    &.active {
                        font-size: px2rpx(16);
                        font-weight: bold;
                        color: #212121;
                        &:after {
                            content: '';
                            position: absolute;
                            width: 100%;
                            height: px2rpx(2);
                            background : #FF3C29;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            border-radius: px2rpx(3);
                        }
                    }
                }
            }
        }
        .body {
            width: 100%;
            display: flex;
            flex-direction: column;
            background: #fff;
            overflow: hidden;
            padding: px2rpx(16) 0;
            .detail {
                padding: 0 ;

                &_img {
                    width: 100%;
                    height: px2rpx(138);
                }

                &_content {
                    padding: 0 px2rpx(12);
                }
            }
            .params {
                display: flex;
                flex-direction: column;
                width: px2rpx(351);
                margin: auto;
                border-top: px2rpx(0.5) solid #e6e7eb;
                ._li {
                    display: flex;
                    flex-wrap: nowrap;
                    width: 100%;
                    min-height: px2rpx(40);
                    border-right: px2rpx(0.5) solid #e6e7eb;
                    border-bottom: px2rpx(0.5) solid #e6e7eb;
                    border-left: px2rpx(0.5) solid #e6e7eb;
                    .key {
                        width: px2rpx(106);
                        flex-shrink: 0;
                        border-right: px2rpx(0.5) solid #e6e7eb;
                        font-size: px2rpx(12);
                        line-height: px2rpx(17);
                        color: #969696;
                        padding: px2rpx(12);
                    }
                    .value {
                        flex: 1;
                        font-size: px2rpx(12);
                        line-height: px2rpx(17);
                        color: #212121;
                        padding: px2rpx(12);
                        display:flex;
                        flex-direction: column;
                        justify-content: center;
                        overflow: hidden;
                        word-break: break-all;
                    }
                }
            }
        }
    }
</style>
