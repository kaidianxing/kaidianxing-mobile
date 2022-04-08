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
<theme-content>
    <view class="order-comment-index">
        <!-- 商品信息 -->
        <view class="goods-item">
            <goods-card :goodsData="goodsData"></goods-card>
        </view>
        <!-- 评分-->
        <view class="comment-content flex-column">
            <!-- start -->
            <view class="rr-cell">
                <view class="flex bor-bottom">
                    <view class="label uni-text-color flex1">评分</view>
                    <view class="start flex">
                        <view v-for="(item,i) in 5" :key="i" :class="starNum[0]>i?'theme-primary-color iconfont-m- icon-m-xingxingshixin':'iconfont-m- icon-m-xingxingkongxin'" v-on:click="star(0,i+1)"></view>
                    </view>
                </view>
            </view>
            <view class="comment-textarea flex1 flex-column">
                <div class="text-content flex1">
                    <textarea placeholder="宝贝满足你的期待吗？快来评论" placeholder-class="text-placeholder" :maxlength="500" v-model="commentData.content" />
                    <div class="uni-text-color-grey">{{commentData.content.length}}/500</div>
                </div>
                <view class="comment-img">
                    <select-img ref="selectImg" @change="imgChange"></select-img>
                </view>
                <!-- btn -->
                <btn type="do" size="middle" classNames="theme-primary-bgcolor" @btn-click="save">发布评价</btn>
            </view>
        </view>
    </view>
    </theme-content>
</template>

<script>

    import selectImg from '../components/SelectImg'
    import goodsCard from '../components/GoodsInfo'
    import PageMixin from '@/common/PageMixin.js'
    export default {
        mixins: [PageMixin],
        name: "detail",
        components: {
            selectImg, goodsCard
        },
        props: {},
        data() {
            return {
                // id: '',
                goodsData: {},
                starNum: [5],
                commentData: {
                    order_goods_id: '',
                    level: '',
                    content: '',
                    images: [],
                },
                isCan: false,
            }
        },
        computed: {},
        created() {
        },
        mounted() {
            this.commentData.order_goods_id = this.$Route.query.id;
            this.getData()
        },
        methods: {
            getData() {
                this.$api.orderApi.getCommentGoods({order_goods_id: this.commentData.order_goods_id}).then(res => {
                    if (res.error == 0) {
                        this.goodsData = res.goods
                    }
                })
            },
            // 点击星星
            star(num,star) {
                this.$set(this.starNum,num,star);
            },
            imgChange(data) {
                this.commentData.images = data
            },
            // 提交评价
            save() {
                if (this.isCan) {return}
                if(!this.starNum[0]) {
                    this.$toast('请选择评价等级');
                    return;
                }
                this.isCan = true;
                let obj = {
                    ...this.commentData,
                    content: !this.commentData.content ? '此用户没有填写评价' : this.commentData.content,
                    level: this.starNum[0]
                };
                // 判断是否上传图片
                if (obj.images.length > 0) {
                    // 上传图片
                    this.$utils.multipleFilesUpload(this.commentData.images)
                        .then( res => {
                            if (res) {
                                obj.images = JSON.parse(JSON.stringify(res));
                                this.submit(obj)
                            }
                        })
                        .catch(rej => {
                            this.$toast(rej);
                            this.isCan = false;
                        })
                } else {
                    this.submit(obj)
                }
            },
            submit(data) {
                this.$api.orderApi.submitComment(data).then(res => {
                    this.isCan = false;
                    if (res.error == 0) {
                        // 评价成功页面
                        this.$Router.replace({
                            path: '/kdxOrder/paySuccess',
                            query: {
                                isComment: true
                            }
                        })
                    } else {
                        this.$toast(res.message);
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .order-comment-index {
        padding: 16rpx 24rpx;
        min-height: 100%;
        display: flex;
        flex-direction: column;
        .goods-item {
            flex-shrink: 0;
            padding: 32rpx 24rpx;
            background-color: #fff;
            border-radius: 12rpx;
        }
        .comment-content {
            flex: 1;
            margin-top: 16rpx;
            background-color: #fff;
            border-radius: 12rpx;
            overflow: hidden;
            .rr-cell {
                height: 96rpx;
                line-height: 96rpx;
                .label {
                    font-size: 28rpx;
                    font-weight: 700;
                }
                .start {
                    justify-content: flex-end;
                    padding-right: 24rpx;
                    color: #ccc;
                    .iconfont-m- {
                        font-size: 40rpx;
                    }
                }
            }
            .comment-textarea {
                padding: px2rpx(8) px2rpx(12) px2rpx(16);
                box-sizing: border-box;
                textarea {
                    width: 100%;
                    height: px2rpx(320);
                    box-sizing: border-box;
                    font-size: 28rpx;
                    line-height: 34rpx;
                    color: $uni-text-color;
                }
                .uni-text-color-grey {
                    font-size: px2rpx(12);
                }
            }
            .comment-img {
                margin: px2rpx(8) px2rpx(-12) px2rpx(16) 0;
            }
        }
    }
</style>
