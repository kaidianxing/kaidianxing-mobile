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
    <page-box>
        <div class='detail_comment'>
            <default-page  v-if='!loading&&comments.length==0' :title="nodataTip"
                           :imgUrl="$utils.staticMediaUrl('default/search.png')">
            </default-page>
            <div class="container" v-else>
                <ul class='all-comment'>
                    <li class='item' v-for='(item,index) in comments' :key='index'>
                        <div class="avart">
                            <img :src='$utils.mediaUrl(item.avatar)||$utils.staticMediaUrl("decorate/avatar_mobile.png")'></img>
                        </div>
                        <div class="item-content">
                            <div class="head">
                                <div class="userinfo">
                                    <p>
                                        <span class='name'>{{item.username||''}}</span>
                                        <span class="level" v-if="item.levelname">{{item.levelname}}</span>
                                    </p>
                                    <p class="star">
                                        <i class='iconfont-m- icon-m-xingxingshixin ' :class='[index>=item.starnum?"icon-m-xingxingkongxin ":"theme-primary-color"]' v-for='(val,index) in 5' :key='val'></i>
                                    </p>
                                </div>
                                <div class="time">{{item.time}}</div>
                            </div>
                            <div class="content">{{item.content}}</div>
                            <p class="spec" v-if='item.spec'>{{item.spec}}</p>
                            <ul class='comment-imgs' v-if='item.images.length'>
                                <li class='img-box' v-for='(img,imgIndex) in item.images' :key='imgIndex' @click="previewImage(item.images, imgIndex)">
                                    <img class='img' mode='scaleToFill' :src="$utils.mediaUrl(img)" alt="">
                                </li>
                            </ul>
                            <!-- 卖家回复 -->
                            <div class="reply" v-if="item.reply_content">
                                <p class="theme-primary-color">卖家回复：</p>
                                <p class="uni-text-color">{{item.reply_content}}</p>
                            </div>
                        </div>
                    </li>
                </ul>
                <!--加载更多  -->
                <page-loading v-if="comments.length != total" :loadingType="loadingType"></page-loading>
            </div>
        </div>
    </page-box>
</template>

<script>
    import PageMixin from '@/common/PageMixin.js'
    import PageLoadingMixin from "@/common/LoadingBox/PageLoadingMixin"

    export default {
        mixins: [PageMixin, PageLoadingMixin],
        data() {
            return {
                nodataTip:'暂无商品评价',
                comments: [],
                page: 1,
                total: 0,
                loading: false,
            }
        },
        computed: {
            loadingType() {
                let loadingType = 0;
                if (this.loading) {
                    loadingType = 1
                } else if (this.comments.length == this.total && this.total > 0 && this.loading == false) {
                    loadingType = 2
                }
                return loadingType
            },
        },
        methods: {
            getComments() {
                this.loading = true;
                this.$api.goodApi.getComments({
                    goods_id: this.$Route.query.goods_id, 
                    page: this.page
                }).then(res => {
                    if (res.error == 0) {
                        let comments = res.list.map(item => {
                            let images = []
                            images = item.images
                            if(typeof item.images ==='string') {
                                images = JSON.parse(item.images)
                            }
                            return {
                                avatar:item.avatar,
                                starnum: item.level, //星星数
                                username: item.nickname, //用户名
                                time: item.created_at,
                                content: item.content,
                                praise: 1, //1好评，0差评
                                spec: item.option_title,
                                images,
                                levelname: item.member_level_name,
                                reply_content: item.reply_content
                            }
                        })
                        this.page++
                        this.total = res.total
                        this.comments = [...this.comments,...comments]
                    }
                    this.loading = false;
                    this.graceLazyload.load(0, this)
                }).finally(rej => {
                    this.$loading.hideLoading()
                    setTimeout(() => {
                        this.$loading.hideLoading();
                    }, 100);
                })
            },
            // 预览图片
            previewImage(urls, index) {
                urls = urls.map(item => {
                    return this.$utils.mediaUrl(item)
                })
                uni.previewImage({
                    current: index,
                    urls: urls,
                })
            },
        },
        created() {
            // #ifndef MP-TOUTIAO
            this.$loading.showLoading();
            // #endif
        },
        mounted() {
            this.getComments();
        },
        onReachBottom(){
            if(this.comments.length<this.total){
                 this.getComments();
            }
        },
        onPageScroll(e) {
            this.graceLazyload.load(e.scrollTop, this);
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../components/decorate/templates/decorate.scss';
    .detail_comment {
        min-height: 100vh;
        width: 100%;
        .container {
            padding: px2rpx(8) px2rpx(12) 0;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            width: 100%;

            .level {
                display: inline-block;
                margin-left: px2rpx(4);
                height: px2rpx(12);
                line-height: px2rpx(12);
                padding: 0 px2rpx(4);
                /*font-size: px2rpx(12);*/
                font-size: px2rpx(8);
                color: #f2dcac;
                background-color: #31312d;
                /*transform: scale(0.8);*/
                border-radius: px2rpx(10);
            }
            .name {
                overflow: hidden;
                font-size: px2rpx(12);
                color: $uni-text-color;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .content {
                line-height: px2rpx(16);
                margin-bottom: px2rpx(8);
                word-break: break-all;
                overflow: hidden;
                color: $uni-text-color;
                font-size: px2rpx(12);
            }
            .img-num {
                position: absolute;
                bottom: px2rpx(4);
                right: px2rpx(4);
                height: px2rpx(12);
                line-height: px2rpx(12);
                padding: 0 px2rpx(2);
                font-size: px2rpx(8);
                color: #fff;
                background-color: #212121;
                transform: scale(0.8);
                border-radius: px2rpx(10);
                opacity: 0.7;
            }
            .all-comment {
                width: 100%;
                font-family: PingFang SC;
                font-style: normal;
                font-weight: 500;
                overflow: hidden;
                // 普通
                .item {
                    margin-bottom: px2rpx(8);
                    padding: px2rpx(16) px2rpx(12) px2rpx(8);
                    display: flex;
                    background-color: #fff;
                    border-radius: px2rpx(6);
                }
                .avart {
                    flex-shrink: 0;
                    width: px2rpx(38);
                    height: px2rpx(38);
                    border-radius: 50%;
                    overflow: hidden;

                    img {
                        width: 100%;
                        height: 100%;
                        display: block;
                    }
                }
                .item-content {
                    flex: 1;
                    margin-left: px2rpx(8);
                    /*padding-bottom: px2rpx(8);*/
                }
                .head {
                    display: flex;
                    margin: 0 0 px2rpx(8) 0;
                    justify-content: space-between;

                    .time {
                        flex-shrink: 0;
                        font-size: px2rpx(10);
                        display: inline-block;
                        color: $uni-text-color-grey;
                    }
                }
                .star {
                    font-size: px2rpx(12);
                    color: $uni-color-primary;
                    .icon-m-xingxingkongxin {
                        color: $uni-border-color;
                    }
                }
                .spec {
                    font-size: px2rpx(12);
                    line-height: px2rpx(16);
                    margin-bottom: px2rpx(8);
                    color: $uni-text-color-grey;
                }
                .comment-imgs {
                    margin-bottom: px2rpx(8);
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: flex-start;

                    .img-box {
                        margin: px2rpx(8) px2rpx(8) 0 0;
                        width: px2rpx(88);
                        height: px2rpx(88);
                        overflow: hidden;
                        border-radius: px2rpx(4);

                        &:nth-child(-n+3) {
                            margin-top: 0;
                        }
                        &:nth-child(3n) {
                            position: relative;
                            margin-right: 0;
                        }

                        .img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
                .reply {
                    margin: px2rpx(16) 0 px2rpx(8);
                    position: relative;
                    padding: px2rpx(8) px2rpx(12);
                    background-color: $uni-bg-color-grey;
                    border-radius: px2rpx(6);
                    &:before {
                        content: '';
                        position: absolute;
                        left: px2rpx(12);
                        top: px2rpx(-6);
                        border: px2rpx(9) solid $uni-bg-color-grey;
                        border-bottom-color: transparent;
                        border-right-color: transparent;
                        border-radius: px2rpx(3);
                        transform: rotate(45deg);
                    }
                    .uni-color-primary {
                        margin-bottom: px2rpx(4);
                        line-height: px2rpx(16);
                        font-size: px2rpx(12);
                    }
                    .uni-text-color {
                        line-height: px2rpx(16);
                        font-size: px2rpx(12);
                    }
                }
            }
        }
    }
</style>