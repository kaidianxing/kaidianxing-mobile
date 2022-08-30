<template>
    <div class="detail-pullup isbottom">
        <div class="tab" v-if="isShowTab">
            <p class='item' @click='changeTab("detail")'>
                <span class='_span detail' :class='{active:curTab=="detail"}'>详情</span>
            </p>
            <p class='item'  @click='changeTab("params")'>
                <span class='_span params' :class='{active:curTab=="params"}'>参数</span>
            </p>
        </div>
        <div class="body" :style='curTab=="detail"?"padding:0":""'>
            <div class="detail" v-if='curTab==="detail"'>
                <div class="detail_content" v-if="pullData.content">
                    <my-rich-text :content='pullData.content' @click.native="detailClick"></my-rich-text>
                </div>
            </div>
            <ul class='params _ul' v-else>
                <li class='_li' v-for='(item,index) in pullData.data' :key='index'>
                    <p class="key">{{item.key}}</p>
                    <p class="value">{{item.value}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

    import MyRichText from '@/components/decorate/templates-shim/RichText.vue'

    export default {
        name: "DetailPullup",
        components: {
            MyRichText
        },
        props: {
            pullData: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                curTab: 'detail',
                content: "<p>ccccsfdfffff</p>",
                data: [
                    {
                        key: '1211',
                        value: '12113213'
                    },{
                        key: '1211',
                        value: '12113213'
                    },{
                        key: '1211',
                        value: '12113213'
                    },{
                        key: '1211',
                        value: '12113213'
                    },{
                        key: '1211',
                        value: '12113213'
                    },{
                        key: '1211',
                        value: '12113213'
                    },
                ]
            }
        },
        computed: {
            // 是否显示tab
            isShowTab() {
                return 0 !==  this.pullData.params_switch && this.pullData?.content && this.pullData?.data?.length
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            changeTab(tab) {
                this.curTab = tab;
            },
            detailClick() {

            }
        },
    }
</script>

<style lang="scss" scoped>
    .detail-pullup {
        margin-top: px2rpx(8);
        background-color: #fff;
        overflow: hidden;
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
                    position: relative;
                    display: flex;
                    height: 100%;
                    text-align: center;
                    justify-content: center;
                    font-size: px2rpx(14);
                    color: #565656;
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