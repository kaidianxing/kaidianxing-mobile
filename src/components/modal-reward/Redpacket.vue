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
    <page-box class="bg_redpacket">
        <view
            @touchmove.stop.prevent
            :style="{
            height: windowHeight
        }"
        >
            <view class="ticket"
                  @touchmove.stop.prevent
                  :class="{bgHidden: contentScale}"
                  :style="{height: windowHeight}"
                  v-if="visible || isShow">
                <!-- 领取红包弹窗 -->
                <view class="big_content">
                    <view class="redpacket" :class="{scaleBot: contentScale }" v-if="!getRedpacket">
                        <image
                            :src="$utils.staticMediaUrl('activity/redpacket/redpacketClose.png')"
                            class="bg-img absolute"
                        />
                        <img :src="logo" alt="" class="shop_logo absolute">
                        <view class="shop_name absolute">{{ shopName }}</view>
                        <view class="reward_desc absolute">恭喜您获得{{ activityType | formatActivityType }}红包</view>
                        <view class="reward_good absolute">{{ activityData.blessing }}</view>
                        <view class="reward_open absolute" @click="openRedpacket"></view>
                        <view class="reward_time absolute">有效期至： {{ activityData.expire_time }}</view>
                    </view>
                    <!-- 红包领取成功样式 -->
                    <view class="redpacketOpen" v-else>
                        <image
                            :src="$utils.staticMediaUrl('activity/redpacket/fostar.png')"
                            class="foStar absolute"
                        />
                        <view class="openDetail">
                            <image
                                :src="$utils.staticMediaUrl('activity/redpacket/redpacketBack.png')"
                                class="openGet absolute"
                            />
                            <view class="shopInfo absolute">
                                <img :src="logo" alt="" class="open_shop_logo">
                                <view class="open_shop_name">{{ shopName }}</view>
                            </view>
                            <view class="reward_desc absolute">红包领取成功</view>
                            <view class="reward_money absolute">{{ activityData.money }} <span>元</span></view>
                            <view class="reward_tip absolute">金额已存入到您的「微信钱包」</view>
                            <view class="reward_detail absolute" @click="seeRedpacketDetail">查看明细</view>
                        </view>
                    </view>
                    <view class="close">
                        <span
                            class="iconfont-m- icon-m-haibaoxieyi1 close-icon"
                            @click="close"
                        ></span>
                    </view>
                </view>
            </view>


            <!-- 红包小浮窗 -->
            <view class="small_redpack" @click="openRedpack" v-if="redpackNum>0 && !isShow" :style="{bottom: getBottom}">
                <view class="all_redpack">
                    <img :src="$utils.staticMediaUrl('activity/redpacket/smallRedpacket.png')" alt="">
                    <view class="redpack_num">
                        <view class="scale_text">待领取({{ redpackNum }})</view>
                    </view>
                </view>
            </view>
        </view>
    </page-box>
</template>

<script>
import {mapState, mapGetters} from 'vuex'

export default {
    props: {
        // 当前活动奖励类型
        activityType: {
            type: [String, Object],
            default: '',
        },
        // 当前活动奖励红包数据
        activityData: {
            type: Object,
            default: () => {
            },
        },
        // 为了处理在当前页面点击查看详情
        path: {
            type: Boolean,
            default: false
        },
        // 可领取红包个数
        redpackNum: {
            type: [String, Number],
            default: '0'
        },
        // 为了判断是否展示红包小浮窗
        isShow: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            items: [],
            getRedpacket: false, //是否打开红包
            showSmall: 1,//未领取红包数量
            visible: false, //红包弹窗是否展示
            contentScale: false, //红包领取弹窗是否缩放
        }
    },
    computed: {
        ...mapState(['windowHeight']),
        ...mapGetters('login', ['isLogin']),
        ...mapState('setting', {
            systemSetting: (state) => state.systemSetting, // 商城基础数据
        }),
        // 商城logo
        logo() {
            return this.$utils.mediaUrl(this.systemSetting?.basic?.logo)
        },
        // 商城名称
        shopName() {
            return this.systemSetting?.basic?.name
        },
        getBottom() {
            return this.$store.state.areaBottom + 80 + 'px'
        },
    },
    filters: {
        formatActivityType(value) {
            let text = ''
            switch (value) {
                case 'consumeReward':
                    text = '消费奖励'
                    break
                case 'shoppingReward':
                    text = '购物奖励'
                    break
                default:
                    text = '评价奖励'
                    break
            }
            return text
        },
    },
    methods: {
        /*
        * 红包弹窗关闭时
        * isShow 表示没有左下角小浮窗 关闭不需要滑动效果
        * */
        close() {
            if (!this.isShow) {
                this.contentScale = true;
                setTimeout(() => {
                    this.visible = false;
                    this.$emit('update:visible', {update: true})
                }, 300)
            } else {
                this.contentScale = false;
                this.visible = false;
                this.$emit('update:visible', {update: false})
            }
        },
        // 点击开启红包
        openRedpacket() {
            this.$api.memberApi
                .getRedpacket({
                    id: this.activityData.id
                })
                .then(res => {
                    if (res.error == 0) {
                        this.getRedpacket = true;
                    } else {
                        this.$toast(res.message)
                    }
                })
        },
        // 点击查看红包明细
        seeRedpacketDetail() {
            if (this.path) {
                this.contentScale = false;
                this.visible = false;
                this.$emit('update:visible', {update: true})
            } else {
                this.$Router.auto({
                    path: '/kdxMember/detail/redpacketDetail',
                    query: {
                        type: 4,
                    }
                })
            }
        },
        // 点击左下角红包领取
        openRedpack() {
            this.visible = true;
            this.contentScale = false;
            this.getRedpacket = false;
        },
    },
}
</script>

<style lang="scss" scoped>
.bg_redpacket {
    position: absolute;
}
.ticket {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999999;
    width: 100vw;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    transition: all 0.3s linear;

    &.bgHidden {
        background: rgba(0, 0, 0, 0);
    }
    .big_content {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: px2rpx(238);
        height: px2rpx(330);
    }

    // 红包领取样式
    .redpacket {
        width: px2rpx(238);
        height: px2rpx(286);
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: all 0.3s linear;
        opacity: 1;

        .absolute {
            position: absolute;
        }

        > .bg-img {
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }

        .shop_logo {
            top: px2rpx(24);
            left: 50%;
            margin-left: px2rpx(-25);
            height: px2rpx(50);
            width: px2rpx(50);
            border-radius: 50%;
        }

        .shop_name {
            top: px2rpx(76);
            font-size: px2rpx(14);
            line-height: px2rpx(20);
            font-weight: bold;
            background-image: -webkit-linear-gradient(90deg, #FFFCF8 1.52%, #FFF3BF 99.24%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .reward_desc {
            top: px2rpx(102);
            font-size: px2rpx(18);
            line-height: px2rpx(25);
            font-weight: bold;
            background-image: -webkit-linear-gradient(90deg, #FFFCF8 1.52%, #FFF3BF 99.24%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .reward_good {
            top: px2rpx(132);
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            color: #fff;
        }

        .reward_open {
            width: px2rpx(85);
            height: px2rpx(85);
            top: px2rpx(170);
        }

        .reward_time {
            bottom: px2rpx(10);
            font-size: px2rpx(10);
            line-height: px2rpx(14);
            color: #fff;
        }
    }

    .scaleBot {
        opacity: 0;
        transform: translate3d(-150px, 200px, 10px) scale(0.2);
    }

    .scaleTop {
        opacity: 0;
        transform: translate3d(150px, -200px, 10px) scale(0.2);
    }

    // 红包打开样式
    .redpacketOpen {
        width: px2rpx(238);
        height: px2rpx(286);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .absolute {
            position: absolute;
        }

        .foStar {
            top: 50%;
            margin-top: -50vw;
            width: 100vw;
            height: 100vw;
            animation: loading-circle 3s linear infinite;
            transform: scale(1.6);
        }

        .openDetail {
            width: px2rpx(238);
            height: px2rpx(286);
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .shopInfo {
                top: px2rpx(24px);
                height: px2rpx(24);
                width: 100%;
                display: flex;
                justify-content: center;
            }

            .openGet {
                width: 100%;
                height: 100%;
            }

            .open_shop_logo {
                width: px2rpx(24);
                height: px2rpx(24);
                border-radius: 50%;
                margin-right: px2rpx(4);
            }

            .open_shop_name {
                font-size: px2rpx(12);
                color: #6E4B19;
            }

            .reward_desc {
                top: px2rpx(64);
                font-size: px2rpx(18);
                line-height: px2rpx(25);
                font-weight: 500;
                color: #6E4B19;
            }

            .reward_money {
                top: px2rpx(100);
                font-size: px2rpx(60);
                font-weight: bold;
                line-height: px2rpx(65);
                color: #E6443B;

                span {
                    font-size: px2rpx(14);
                    line-height: px2rpx(29);
                }
            }

            .reward_tip {
                top: px2rpx(178);
                font-size: px2rpx(12);
                line-height: px2rpx(17);
                color: #6E4B19;
            }

            .reward_detail {
                bottom: px2rpx(15);
                width: px2rpx(188);
                height: px2rpx(38);
                font-weight: bold;
                text-align: center;
                line-height: px2rpx(38);
                font-size: px2rpx(14);
                background-image: -webkit-linear-gradient(180deg, #FB8215 20.51%, #CD4900 81.41%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .shopInfo {
                top: px2rpx(24);
                height: px2rpx(24);
                line-height: px2rpx(24);
                display: flex;
                flex-direction: row;
            }
        }
    }

    .close {
        margin-top: px2rpx(16);
        text-align: center;
        height: px2rpx(28);
        line-height: px2rpx(28);
        z-index: 6666;
        &-icon {
            font-size: px2rpx(28);
            color: #fff;
        }
    }

    @keyframes loading-circle {
        0% {
            transform: rotate(0deg) scale(1.6);
        }
        50% {
            transform: rotate(180deg) scale(1.6);
        }
        100% {
            transform: rotate(360deg) scale(1.6);
        }
    }
    // 点击关闭红包缩小到浮窗
    @keyframes scale {
        0% {
            transform: scale(0.8);
        }
        50% {
            transform: scale(0.5);
        }
        100% {
            transform: scale(0.2);
        }
    }
}

.small_redpack {
    position: fixed;
    left: px2rpx(14);
    bottom: px2rpx(84);
    height: px2rpx(46);
    width: px2rpx(48);
    z-index: 10;
    animation: redpacket_scale 1.2s linear infinite;

    .all_redpack {
        position: relative;

        img {
            width: px2rpx(44);
            height: px2rpx(46);
        }

        .redpack_num {
            position: absolute;
            left: px2rpx(-2);
            bottom: 0;
            width: px2rpx(48);
            height: px2rpx(13);
            line-height: px2rpx(13);
            text-align: center;
            color: #752626;
            background: linear-gradient(110.78deg, #FEE08A 7.33%, #FBC11E 86.7%);
            border-radius: 6px;

            .scale_text {
                width: px2rpx(64);
                height: px2rpx(13);
                line-height: px2rpx(14);
                margin-left: px2rpx(-8);
                font-size: px2rpx(12);
                transform: scale(0.75);
            }
        }
    }
}

@keyframes redpacket_scale {
    0% {
        transform: scale(1.2);
    }
    50% {
        transform: scale(1);
    }
    100% {
        transform: scale(1.2);
    }
}
</style>
