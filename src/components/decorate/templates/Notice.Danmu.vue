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
        <!-- 公告 -->
        <div class='notice' :style="{padding:`${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`,}"
             v-if='componentData&&componentData.id=="notice"'>
            <div class="bg" :style="{
            background:componentData.style.background,
            borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`
        }">
                <p class="notice-icon-box">
                    <img mode='widthFix' lazy-load class='notice-icon' :src="getNoticeImg" alt="" v-if='startLoadImg'>
                </p>
                <div class='notice-box'>
                    <CustomNotice style='flex:1' :list='getList' :speed='componentData.params.speed' @click-notice='clickNotice'>

                    </CustomNotice>
                    <i class='iconfont-m- icon-m-right'></i>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import mixin from './mixin.js'
    import CustomNotice from '../templates-shim/Notice.vue'
    import Calculater from '../loader/Calculater.js'
    export default {
        components: {
            CustomNotice,
        },
        mixins: [mixin],
        name: 'notice',
        computed: {
            getList() {
                return this.componentData ?.data.map(item => {
                    return {
                        ...item,
                        color: this.componentData.style.color
                    }
                })
            },
            getNoticeImg(){
                let {noticestyle,noticeimg} = this.componentData.params
                if(this.componentData.params.noticestyle =='custom') {
                    if(noticeimg) {
                        return this.$utils.mediaUrl(noticeimg)
                    } else {
                        return this.$utils.staticMediaUrl('decorate/goods_col2.png')
                    }

                } else {
                    return this.$utils.staticMediaUrl(`decorate/notice/notice_icon${noticestyle || '1'}.svg`)
                }
            },
            fixedTop() {
                let { isTop } = this.$store.state.decorate.indexPage,
                    calculater = new Calculater(),
                    result = 0;
                isTop?.map(item=> {
                    result += calculater[item.id]()
                });
                return (result/2)
            }
        },
        data() {
            return {
                curIndex: 0
            }
        },
        methods: {
            clickNotice(item) {
                this.$emit('custom-event', {
                    target: 'notice/clickNotice',
                    data:{
                        params: this.componentData.params,
                        item: item
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .notice {
        width: 100%;
        padding: 0 px2rpx(12);
        overflow: hidden;
        .bg {
            height: px2rpx(33);
            width: 100%;
            box-sizing: border-box;
            display: flex;
            flex-wrap: nowrap;
            margin: 0 auto;
            padding: 0 px2rpx(8) 0 px2rpx(12);
            border-radius: px2rpx(6);
            .notice-icon-box {
                width: px2rpx(26);
                height: px2rpx(33);
                flex-shrink: 0;
                display: flex;
                position: relative;
                align-items: center;
                .notice-icon {
                    position: absolute;
                    width: px2rpx(26);
                    top: 0;
                    bottom: 0;
                    left: 0;
                    margin: auto;
                    height: auto;
                    display: block;
                }
            }
            .notice-box {
                flex: 1;
                width: 0;
                display: flex;
                flex-wrap: nowrap;
                padding: px2rpx(4) px2rpx(8);
                position: relative;
                .iconfont-m- {
                    font-size: px2rpx(16);
                    line-height: px2rpx(16);
                    height: px2rpx(16);
                    position: absolute;
                    z-index: 10;
                    top: px2rpx(9);
                    right: 0;
                    color: $uni-text-color-grey;
                }
                /deep/ .notice-item {
                    line-height: rpx(44);
                    font-size: px2rpx(12);
                    color: #666666;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
                .info {
                    font-size: px2rpx(12);
                    line-height: px2rpx(25);
                }
            }
        }
    }

    .danmu {
        position: absolute;
        top: px2rpx(100);
        left: px2rpx(16);
        width: px2rpx(235);
        height: px2rpx(32);
        border-radius: rpx(8);
        overflow: hidden;
        z-index: 999990;

        .mask {
            position: absolute;
            left: 0;
            top: 0;
            width: px2rpx(235);
            height: px2rpx(32);
            border-radius: rpx(8);
        }
        &.circle {
            border-radius: px2rpx(32);
        }
    }
</style>
