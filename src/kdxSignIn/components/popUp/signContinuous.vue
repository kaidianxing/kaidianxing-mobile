/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <signMask v-if="popupShow.continuousShow">
        <view class="popup-success">
            <view class="popup-success_close" @click="cancel">
                <i class="iconfont-m- icon-m-haibaoxieyi1" style="color: #ffffff"></i>
            </view>

            <view class="popup-success_center">
                <!-- 礼物背景图-->
                <img class="popup-success_pp" :src="signSuccess" alt="">
                <!-- 滚动区域 如果礼物小于等于3个 用popup-success_scroll--center 属性  -->
                <template v-if="rewardDetail.reward_list && rewardDetail.reward_list.length> 3">
                    <scroll-view scroll-x class="popup-success_scroll" :scroll-left="scrollLeft" @scroll="scroll" >
                        <view v-for="(item,i) in rewardDetail.reward_list" :key="i" class="popup-success_msgBox">
                            <view v-if="item.type === 'credit' " class="popup-success_msg">
                                <view class="popup-success_msgTp">
                                    <view class="popup-success_imgBox"><img class="popup-success_point" :src="point" alt=""></view>
                                    <text v-if="item.info.length < 7" class="popup-success_text">{{
                                            item.info || '0'
                                        }}
                                    </text>
                                    <text v-else class="popup-success_text--small">{{ item.info || '0' }}</text>
                                </view>
                                <view class="popup-success_msgBt">
                                    <text class="popup-success_text">{{ credit_text }}</text>
                                </view>
                            </view>
                            <view v-if="item.type === 'coupon'" class="popup-success_msg">
                                <view class="popup-success_msgTp">
                                    <view class="popup-success_imgBox"> <img class="popup-success_discount" :src="discount" alt=""></view>
                                    <text v-if="item.info.discount_price && item.info.discount_price < '99999' "
                                          class="popup-success_text">{{ item.info.discount_price | priceFilter }}{{item.info.coupon_sale_type == '1'?'元':'折'}}
                                    </text>
                                    <text v-else class="popup-success_text--small">
                                        {{ item.info.discount_price | priceFilter }}{{item.info.coupon_sale_type == '1'?'元':'折'}}
                                    </text>
                                </view>
                                <view class="popup-success_msgBt">
                                    <text class="popup-success_text">{{item.status === true?'优惠券':'已领完'}}</text>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </template>
                <template v-else>
                    <view class="popup-success_scroll popup-success_scroll--center ">
                        <view v-for="(item,i) in rewardDetail.reward_list" :key="i" class="popup-success_msgBox">
                            <view v-if="item.type === 'credit' " class="popup-success_msg">
                                <view class="popup-success_msgTp">
                                    <view class="popup-success_imgBox"> <img class="popup-success_point" :src="point" alt=""></view>
                                    <text v-if="item.info.length < 7" class="popup-success_text">{{
                                            item.info || '0'
                                        }}
                                    </text>
                                    <text v-else class="popup-success_text--small">{{ item.info || '0' }}</text>
                                </view>
                                <view class="popup-success_msgBt">
                                    <text class="popup-success_text">{{ credit_text }}</text>
                                </view>
                            </view>
                            <view v-if="item.type === 'coupon'" class="popup-success_msg">
                                <view class="popup-success_msgTp">
                                    <view class="popup-success_imgBox"> <img class="popup-success_discount" :src="discount" alt=""></view>
                                    <text v-if="item.info.discount_price && item.info.discount_price < '99999' "
                                          class="popup-success_text">{{ item.info.discount_price | priceFilter }}{{item.info.coupon_sale_type == '1'?'元':'折'}}
                                    </text>
                                    <text v-else class="popup-success_text--small">
                                        {{ item.info.discount_price | priceFilter }}{{item.info.coupon_sale_type == '1'?'元':'折'}}
                                    </text>
                                </view>
                                <view class="popup-success_msgBt">
                                    <text class="popup-success_text">{{item.status === true ? '优惠券':'已领完'}}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </template>
            </view>
            <view class="popup-success_bt">
                <sButton v-if="rewardDetail.status && rewardDetail.status ==='0' " :diyStyle="diyBt"
                         @onclick="getReward">点击领取
                </sButton>
                <sButton v-if="rewardDetail.status &&  rewardDetail.status ==='1' " :diyStyle="diyBt" @onclick="cancel">
                    已领取
                </sButton>
            </view>

        </view>
    </signMask>
</template>

<script>
import signMask from "./mask";
import sButton from "./sButton";

export default {
    name: "signSuccess",
    components: {signMask, sButton},
    props: {
        popupShow: Object,
        rewardDetail: Object
    },
    data() {
        return {
            signSuccess: this.$utils.staticMediaUrl('SignIn/continuousSign.png'),
            point: this.$utils.staticMediaUrl('SignIn/point.png'),//积分
            discount: this.$utils.staticMediaUrl('SignIn/discount.png'),//优惠券
            discountGrey: this.$utils.staticMediaUrl('SignIn/discountGrey.png'),//优惠券置灰
            diyBt: {'font-size': 14, 'width': 140, 'height': 38},
            list: new Array(4),
            scrollLeft: 0,
            oldScrollTop: 0,
        }
    },
    watch: {
        popupShow: 'goLeft'
    },
    computed: {
        credit_text() {
            return (this.$store.state.setting?.systemSetting?.credit_text || '积分')
        },
    },
    methods: {
        goLeft() {
            console.log('接收到了')
            this.scrollLeft = 1
            this.$nextTick(() => {
                this.scrollLeft = 0
            });

        },
        scroll(e) {
            this.oldScrollTop = e.detail.scrollTop
        },
        cancel() {
            this.$emit('cancel')
        },
        getReward() {
            this.$emit('getReward')
        },
    },
    filters: {
        priceFilter(price) {
            if (price) {
                return Number(price)
            } else {
                return '0'
            }
        }
    }
}
</script>

<style scoped lang="scss">
scroll-view ::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: transparent;
}

.popup-success {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: px2rpx(321);
    height: px2rpx(397);
    padding-top: px2rpx(40);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;

    &_ {
        &close {
            position: absolute;
            right: px2rpx(-10);
            top: px2rpx(-5);
            padding: px2rpx(5);

            i {
                font-size: px2rpx(24);
                color: #ffffff;
            }
        }

        &center {
            position: relative;
        }

        &pp {
            display: block;
            position: relative;
            width: px2rpx(305);
            height: px2rpx(296);
        }

        &scroll {
            width: px2rpx(212);
            height: px2rpx(91);
            display: flex;
            position: absolute;
            display: flex;
            align-items: center;
            left: 50%;
            transform: translateX(-50%);
            top: px2rpx(172);
            overflow-x: scroll;
            overflow-y: hidden;
            white-space: nowrap;
            padding-left: px2rpx(3.5);

            &-- {
                &center {
                    justify-content: center;
                }
            }
        }

        &msgBox {
            display: inline-block;
            padding: 0 px2rpx(3.5);
        }

        &msgBox:nth-child(1) {
            display: inline-block;
            padding: 0 px2rpx(3.5) 0 0;
        }

        &msg {
            display: inline-block;
            background: linear-gradient(310.73deg, #FF3C29 14.43%, #FF9C65 84.61%);
            border-radius: px2rpx(10);
            width: px2rpx(60);
            padding-top: px2rpx(1);
            height: px2rpx(91);
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-direction: column;

            &-- {
                &grey {
                    background: #D2D2D2;
                }
            }
        }

        &msgTp {
            background: #FFF5D9;
            border-radius: px2rpx(9);
            width: px2rpx(58);
            height: px2rpx(62);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;

            &-- {
                &grey {
                    background: #F9F9F9;;

                    text {
                        color: #D2D2D2 !important;
                    }
                }
            }

            text {
                margin-top: px2rpx(1);
                font-weight: 500;
                font-size: px2rpx(14);
                line-height: px2rpx(20);
                display: flex !important;
                align-items: center;
                justify-content: center;
                text-align: center;
                color: $uni-color-primary;
            }
        }
        &imgBox{
            width: px2rpx(34);
            height: px2rpx(34);
            display: flex;
            align-items: flex-start;
            justify-content: center;
            position: relative;
        }
        &msgBt {
            text-align: center;
            line-height: px2rpx(28);

            &-- {
                &grey {
                    text {
                        color: #F9F9F9 !important;
                    }
                }
            }

            text {

                color: #FFF5D9;
                font-weight: 500;
                font-size: px2rpx(14);

            }
        }

        &text {
            text-align: center;
            display: block;
            width: px2rpx(58);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            &--small {
                transform: scale(0.7, 0.7);
            }
        }

        &point {
            width: px2rpx(34);
            height: px2rpx(34);
            display: block;
        }

        &discount {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            width: px2rpx(34);
            height: px2rpx(27);
            display: block;
        }

        &bt {
            //width: px2rpx(139);
            //height: px2rpx(40);
            display: flex;
            align-items: center;
            justify-content: center;
            //background: #FF5C00;
            //border-radius: px2rpx(20);
            //color: #FFFFFF;
            //font-size: px2rpx(16);
            //font-weight: 600;
        }
    }
}
</style>

