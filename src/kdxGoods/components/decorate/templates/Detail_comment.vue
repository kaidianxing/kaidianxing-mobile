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
    <div class='detail_comment' :style="{padding:`${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)}  ${px2rpx(componentData.style.marginbottom)}`}"
         v-if='componentData&&componentData.id=="detail_comment"'>
        <div style="overflow: hidden" :style="{'border-radius':`${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`}">
        <div class="container" :style="{background:componentData.style.background}">

            <div class="label van-hairline--bottom"
                 :style="{'border-bottom-color': componentData.style.titledividercolor, 'background':componentData.style.titlebgcolor}"
                 @click='checkMore'>
                <p class="evaluate" :style="{color:componentData.style.titlecolor}">
                    评价
                    <i v-if="componentData.params.showcommentnum == 1" :style="{color:componentData.style.commentnumcolor}">({{componentData.params.total}})</i>
                </p>
                <div class="flex align-center" v-if="componentData.params.total!=0">
                    <p class="toDetail" :style="{color:componentData.style.morecolor}" v-if='componentData.params.showmore==1&&componentData.params.showtype==0'>{{componentData.params.moretext}}</p>
                    <i :class='componentData.params.arrowicon' v-if='componentData.params.showarrow==1' :style="{color:componentData.style.arrowcolor}"></i>
                </div>
            </div>

            <div class="no-comment" v-if="!getComments.length">
                暂无评价
            </div>

            <div class="body" :class="{'is-scroll':componentData.params.showtype==1}"  v-else>
                <!-- 普通样式 -->
                <ul class='all-comment' v-if="componentData.params.showtype==0">
                    <li class='item' v-for='(item,index) in getComments' :key='index' @click="checkMore">
                        <div class="avart">
                            <img :src='$utils.mediaUrl(item.avart)||$utils.staticMediaUrl("decorate/avatar_mobile.png")'></img>
                        </div>
                        <div class="item-content van-hairline--bottom" :style="{'border-bottom-color': componentData.style.dividercolor}">
                            <div class="head">
                                <div class="userinfo">
                                    <div class="flex align-center">
                                        <div class='name' :style="{color:componentData.style.usercolor}">{{item.username||''}}</div>
                                        <div class="level" v-if="componentData.params.showlevel==1&&item.levelname"
                                             :style="{color:componentData.style.levelcolor, 'background':componentData.style.levelbgcolor}">
                                            <span class="level-text">{{item.levelname}}</span>
                                        </div>
                                    </div>
                                    <p class="star" v-if="componentData.params.showstar==1">
                                        <i class='iconfont-m- icon-m-xingxingshixin'
                                           :style="{color:index>=item.starnum?componentData.style.nostarcolor:componentData.style.starcolor}"
                                           v-for='(val,index) in 5' :key='val'></i>
                                    </p>
                                </div>
                                <div class="time" v-if="componentData.params.showtime==1" :style="{color:componentData.style.timecolor}">{{item.time}}</div>
                            </div>
                            <div class="content" :style="{color:componentData.style.commentcolor}">{{item.content}}</div>
                            <p class="spec" :style='{color:componentData.style.speccolor}' v-if='item.spec&&componentData.params.showspec==1'>{{item.spec}}</p>
                            <ul class='comment-imgs' v-if='item.images.length&&componentData.params.showimg==1'>
                                <li class='img-box' v-for='(img,imgIndex) in item.images.slice(0,4)' :key='imgIndex'
                                    @click.stop="previewImage(item.images, imgIndex)">
                                    <img class='img' mode='scaleToFill' :src="$utils.mediaUrl(img)" alt="">
                                    <div class="img-num" v-if="item.images.length>4&&imgIndex===3">
                                        <span class="img-num-text">{{item.images.length+'张'}}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>

                <!-- 滑动 -->
                <ul class="scroll" v-else>
                    <li class="item" :style="{background:componentData.style.commentbgcolor, 'border-color': componentData.style.bordercolor, 'margin-right': `${px2rpx(componentData.style.betweenmargin)}`}"
                        v-for='(item,index) in getComments' :key='index' @click="checkMore">
                        <div class="item-content">
                            <div class="userinfo">
                                <div class="avart">
                                    <img :src='$utils.mediaUrl(item.avart)||$utils.staticMediaUrl("decorate/avatar_mobile.png")'></img>
                                </div>
                                <div class='name' :style="{color:componentData.style.usercolor}">{{item.username||''}}</div>
                                <div class="level" v-if="componentData.params.showlevel==1&&item.levelname"
                                     :style="{color:componentData.style.levelcolor, 'background':componentData.style.levelbgcolor}">
                                    <span class="level-text">{{item.levelname}}</span>
                                </div>
                            </div>
                            <div class="content" :style="{color:componentData.style.commentcolor}">{{item.content}}</div>
                        </div>
                        <div class="comment-img" v-if='item.images.length&&componentData.params.showimg==1'>
                            <div class='img-box' @click="previewImage(item.images, 0)">
                                <img class='img' mode='scaleToFill' :src="$utils.mediaUrl(item.images[0])" alt=""  @click.stop="previewImage(item.images, 0)">
                                <div class="img-num" v-if="item.images.length>1">
                                    <span class="img-num-text">{{item.images.length+'张'}}</span>
                                </div>
                            </div>
                        </div>
                    </li>

                    <li class="item all"
                        :style="{background:componentData.style.commentbgcolor, 'border-color': componentData.style.bordercolor}"
                        v-if="componentData.params.showall==1"
                        @click='checkMore'>
                        <span class="all-text" :style="{color:componentData.style.allcolor}">{{componentData.params.alltext}}</span>
                    </li>
                </ul>

            </div>

        </div>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'

    export default {
        mixins: [mixin],
        name: 'detail_comment',
        props: {
            max: {
                type: Number,
                default: 2
            }
        },
        computed: {
            getComments() {
                if (this.$isPC) {
                    this.componentData.data.forEach(item => {
                        item.levelname = '会员'
                    });
                }
                if (this.max > 0 && this.componentData.data.length > this.max) { //最多显示
                    return [...this.componentData.data].splice(0, this.max);
                }
                return this.componentData.data
            }
        },
        created() {
            if (this.componentData.style.dividercolor == null) {
                this.componentData.style.dividercolor = '#E6E7EB'
            }
        },
        methods: {
            checkMore() {
                this.$emit('custom-event', {
                    target: 'detail_comment/checkMore',
                    total: this.componentData.params.total
                })
            },
            // 预览图片
            previewImage(urls, index) {
                this.$emit('custom-event', {
                    target: 'detail_comment/previewImage',
                    data: {
                        index,
                        urls,
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';

    .detail_comment {
        width: 100%;
    }
    .detail_comment .container {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        width: 100%;
    }
    .detail_comment .label {
        width: 100%;
        display: flex;
        justify-content: space-between;
        position: relative;
        padding: 0 px2rpx(12);
        box-sizing: border-box;
    }
    .detail_comment .label.van-hairline--bottom:after {
        border-bottom-color: inherit;
        border-style: solid;
    }
    .detail_comment .label i {
        font-style: normal;
    }
    .detail_comment .label p {
        line-height: px2rpx(40);
    }
    .detail_comment .label .evaluate {
        font-size: px2rpx(14);
        color: $uni-text-color;
    }
    .detail_comment .label .toDetail {
        font-size: px2rpx(12);
        color: $uni-text-color-grey;
    }
    .detail_comment .label .icon-m-right {
        color: $uni-text-color-grey;
        width: px2rpx(16);
        height: px2rpx(16);
        line-height: px2rpx(16);
        text-align: center;
        font-size: px2rpx(16);
    }
    .detail_comment .no-comment {
        height: px2rpx(56);
        padding: px2rpx(8) px2rpx(12) 0;
        box-sizing: border-box;
        color: $uni-text-color;
        font-size: px2rpx(14);
    }
    .detail_comment .container .body {
        width: 100%;
        padding-left: px2rpx(12);
        position: relative;
    }
    .detail_comment .body.is-scroll {
        overflow-x: auto;
    }
    .detail_comment .body .level {
        margin-left: px2rpx(4);
        display: inline-block;
        height: px2rpx(12);
        line-height: px2rpx(12);
        padding: 0 px2rpx(1);
        border-radius: px2rpx(10);
    }
    .detail_comment .body .level .level-text {
        position: relative;
        top: px2rpx(-1);
        height: 100%;
        width: 100%;
        display: inline-block;
        font-size: px2rpx(12);
        transform: scale(0.75);
    }
    .detail_comment .body .name {
        max-width: px2rpx(43);
        overflow: hidden;
        font-size: px2rpx(12);
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .detail_comment .body .content {
        font-size: px2rpx(12);
        line-height: px2rpx(16);
        margin-bottom: px2rpx(8);
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }
    .detail_comment .body .img-num {
        position: absolute;
        bottom: px2rpx(4);
        right: px2rpx(4);
        height: px2rpx(12);
        line-height: px2rpx(12);
        padding: px2rpx(2) px2rpx(4);
        color: #fff;
        background-color: $uni-text-color;
        border-radius: px2rpx(10);
        opacity: 0.7;
    }
    .detail_comment .body .img-num-text {
        position: relative;
        top: px2rpx(-3);
        display: inline-block;
        font-size: px2rpx(12);
        transform: scale(0.8);
    }
    .detail_comment .body .all-comment {
        width: 100%;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: 500;
        overflow: hidden;
    }
    .detail_comment .body .all-comment .item {
        margin-top: px2rpx(16);
        padding-right: px2rpx(12);
        display: flex;
    }
    .detail_comment .all-comment .item:last-child .item-content.van-hairline--bottom:after {
        border-width: 0;
    }
    .detail_comment .all-comment .avart {
        flex-shrink: 0;
        width: px2rpx(38);
        height: px2rpx(38);
        border-radius: 50%;
        overflow: hidden;
    }
    .detail_comment .all-comment .avart img {
        width: 100%;
        height: 100%;
        display: block;
    }
    .detail_comment .all-comment .item-content {
        flex: 1;
        margin-left: px2rpx(8);
        padding-bottom: px2rpx(8);
    }
    .detail_comment .all-comment .item-content.van-hairline--bottom:after {
        border-bottom-color: inherit;
        border-style: solid;
    }
    .detail_comment .all-comment .head {
        display: flex;
        margin: 0 0 px2rpx(8) 0;
        justify-content: space-between;
    }
    .detail_comment .all-comment .head .time {
        flex-shrink: 0;
        font-size: px2rpx(10);
        display: inline-block;
    }
    .detail_comment .all-comment .star {
        font-size: px2rpx(12);
    }
    .detail_comment .all-comment .spec {
        font-size: px2rpx(12);
        line-height: px2rpx(16);
        margin-bottom: px2rpx(8);
    }
    .detail_comment .all-comment .comment-imgs {
        margin-bottom: px2rpx(8);
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
    }
    .detail_comment .all-comment .comment-imgs .img-box {
        overflow: hidden;
        border-radius: px2rpx(4);
        width: px2rpx(60);
        height: px2rpx(60);
        box-sizing: border-box;
        margin-right: px2rpx(8);
    }
    .detail_comment .comment-imgs .img-box:nth-child(4n) {
        position: relative;
        margin-right: 0;
    }
    .detail_comment .comment-imgs .img-box .img {
        width: 100%;
        height: 100%;
    }
    .detail_comment .scroll {
        padding: px2rpx(16) 0;
        display: flex;
        width: fit-content;
        overflow-x: auto;
        overflow-y: hidden;
    }
    .detail_comment .scroll .item {
        display: flex;
        padding: px2rpx(8) px2rpx(12);
        width: px2rpx(232);
        height: px2rpx(97);
        border-radius: px2rpx(6);
        border: px2rpx(1) solid $uni-border-color;
    }
    .detail_comment .scroll .item.all {
        width: px2rpx(74);
        line-height: px2rpx(79);
        margin-right: px2rpx(12);
    }
    .detail_comment .scroll .item.all .all-text {
        font-size: px2rpx(12);
    }
    .detail_comment .scroll .item .item-content .userinfo {
        display: flex;
        align-items: center;
    }
    .detail_comment .scroll .item .item-content .name {
        margin: 0 px2rpx(4) 0 px2rpx(8);
    }
    .detail_comment .scroll .item .item-content .content {
        margin-top: px2rpx(8);
        margin-bottom: 0;
        -webkit-line-clamp: 3;
    }
    .detail_comment .scroll .item .item-content .avart {
        flex-shrink: 0;
        width: px2rpx(20);
        height: px2rpx(20);
        border-radius: 50%;
        overflow: hidden;
    }
    .detail_comment .scroll .item .item-content .avart img {
        width: 100%;
        height: 100%;
        display: block;
    }
    .detail_comment .scroll .item .comment-img {
        margin-left: px2rpx(10);
        flex-shrink: 0;
        width: px2rpx(81);
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
    }
    .detail_comment .scroll .item .comment-img .img-box {
        position: relative;
        overflow: hidden;
        border-radius: px2rpx(4);
        width: px2rpx(81);
        height: px2rpx(81);
        box-sizing: border-box;
    }
    .detail_comment .scroll .item .comment-img .img-box .img {
        width: 100%;
        height: 100%;
    }
    .detail_comment .openBtn {
        width: rpx(212);
        height: rpx(52);
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
        font-size: rpx(24);
        border: px2rpx(0.5) solid #ff5555;
        color: #ff5555;
        margin: rpx(30) auto;
        border-radius: rpx(30);
    }

</style>
