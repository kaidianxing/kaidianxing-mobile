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
    <div class="detail_info"
         :style="{padding:`${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`}"
         v-if='componentData&&componentData.id=="detail_info"'>
        <div  :style="{background:componentData.style.background,'border-radius':`${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`}">
        <!-- 活动-商品信息 -->
        <detail-info-seckill v-if="hasSeckill" :activity-data="componentData" @refresh="refresh"></detail-info-seckill>
      <div class="container" >
            <div>
                <div class="price-floor floor" :class="{
                    'seckill-price-floor': activityName=='seckill' }">
                    <div v-if="activityName!=='seckill'">
                        <div  class="price-level">
                            <p class="price" :style="{color:componentData.style.pricecolor}">
                                <span class="price-unit">￥</span>
                                <i class="num" :class="{
                            small: componentData.params.price &&componentData.params.price.length>15
                        }">{{componentData.params.price  || 0}}</i>
                            </p>
                            <div class="level"  :class="{
                            small: componentData.params.price &&componentData.params.price.length>15
                        }" v-if="componentData.params.level_name">
                                <i class="icon-m-huangguan iconfont-m-"></i>
                                <span class="level-name">{{componentData.params.level_name}}</span>
                            </div>
                        </div>
                        <div class="del-price-money"
                             :class="{
                            'no-level': !componentData.params.level_name
                        }"
                             v-if="componentData.params.delPrice>0"
                             :style="{ color:componentData.style.linepriceColor }"
                        >
                            <span  class="origin-price-line">￥{{componentData.params.delPrice}}</span>
                            <!-- #ifdef MP-TOUTIAO -->
                            <div class="line" v-if="!$isPC" :style="{
                            background: componentData.style.linepriceColor
                        }"></div>
                            <!-- #endif -->
                        </div>
                    </div>
                    <div v-else class="title-floor floor">
                        <p class="title" :style="{color:componentData.style.titlecolor}">{{componentData.params.title}}</p>
                    </div>
                    <div class="share-commission">
                        <div class="commission"
                             v-if="componentData.params.hidecomsission == 1 && componentData.params.commisionMax>0"
                             :style="{background: componentData.style.commissionBackground, color: componentData.style.commissionColor}">
                            <p class="money">
                                <span class="money-unit">￥</span>
                                <span class="num">{{componentData.params.commisionMax}}</span>
                            </p>
                            <p class="word">{{componentData.params.comsissiontitle || '预计佣金'}}</p>
                        </div>
                    </div>
                </div>
                <div class="title-floor floor" v-if="activityName!=='seckill'">
                    <p class="title" :style="{color:componentData.style.titlecolor}">{{componentData.params.title}}</p>
                </div>
            </div>
            <!-- 分享 -->
            <div class="float-share" :style="{position:$isPC?'absolute':'fixed'}" v-if='componentData.params.hideshare==1' @click.stop="clickShare">
                <i class="share-icon iconfont-m-" :class="[componentData.params.share_icon]"></i>
                <span class="share-word">{{componentData.params.share}}</span>
            </div>
            <div class="desc-floor floor" :style="{color:componentData.style.subtitlecolor}" v-if="componentData.params.desc">
                {{componentData.params.desc}}
            </div>
            <!-- <div class="active-floor floor" :style="{background:componentData.style.timecolor,color:componentData.style.timetextcolor}"  >
                        <i class="icon-m-shijian iconfont-m-"></i>
                        <p class="demon">距离限时购结束</p>
                        <p class="count-down">1天1小时44分33秒</p>
            </div>-->
            <!-- 运费、销量、库存在非面议情况显示 -->
            <div class="express-floor floor" :style="{color:componentData.style.textcolor}">
                <p class="express" :style="{ color: componentData.style.expresscolor }" v-if="componentData.params.type == 0  || componentData.params.expressFee == '包邮' ">
                    <i class="icon-m-shangpinxiangqing-kuaidi iconfont-m-"></i>
                    <span class="floor-text">运费：{{componentData.params.expressFee}}</span>
                </p>
                <p class="express" v-else-if="componentData.params.showsales == false"></p>
                <p class="sales" :style="{ color: componentData.style.sellcolor }"
                   v-if="componentData.params.showsales!==false">
                    <i class="icon-m-shangpinxiangqing-xiaoliang iconfont-m-"></i>
                    <span class="floor-text">销量：{{componentData.params.sales||0}}</span>
                </p>
                <p class="addr" :style="{ color: componentData.style.stockcolor }"
                   v-if="componentData.params.showstock!==false">
                    <i class="icon-m-kucun iconfont-m-"></i>
                    <span class="floor-text">库存：{{componentData.params.stock||0}}</span>
                </p>
            </div>
        </div>
        <div class="reward-container" v-if="componentData.params.has_shoppingReward">
            <div class="reward-box" @click.stop="viewReward">
                <img class="bg bg-left" :src="$utils.staticMediaUrl('reward/shopping-reward-bg-l.png')" alt=""
                     mode="widthFix">
                <img class="bg bg-right" :src="$utils.staticMediaUrl('reward/shopping-reward-bg-r.png')" alt=""
                     mode="widthFix">
                <div class="reward-type">
                    <img :src="$utils.staticMediaUrl('reward/shopping-reward.png')" alt="" mode="widthFix">
                </div>
                <div class="reward-content" :style="{width:rewardContentWidth}">
                    购物可得 {{ rewardInfo }}
                </div>
                <i class="iconfont-m- icon-m-right"></i>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    import detailInfoSeckill from './Detail_info__seckill'
    import {mapState} from "vuex";
    export default {
        mixins: [mixin],
        name: 'detail_info',
        components: {
            detailInfoSeckill,
        },
        computed: {
            ...mapState("decorate/goodDetailPage", {
                goodsType: state => state.detailInfo?.data?.goods?.type,
                detailInfo: state => state.detailInfo
            }),
            rewardContentWidth() {
                if(this.$isPC){
                    return `calc(100% - 42px)`;
                }else{
                    return `calc(100% - 84rpx)`;
                }
            },
            credit_text() {
                return this.$store.state.setting.systemSetting?.credit_text || '积分'
            },
            balance_text() {
                return (
                    this.$store.state.setting.systemSetting?.balance_text || '余额'
                )
            },
            rewardInfo() {
                let _rewardInfo = ''
                if (this.componentData.params.rewardInfo?.coupon_title) {
                    _rewardInfo += this.componentData.params.rewardInfo.coupon_title.map(item => item.coupon_name).join('、')
                }
                if (this.componentData.params.rewardInfo?.credit && !!parseFloat(this.componentData.params.rewardInfo?.credit)) {
                    _rewardInfo += `，${this.componentData.params.rewardInfo.credit}${this.credit_text}`
                }
                if (this.componentData.params.rewardInfo?.balance && !!parseFloat(this.componentData.params.rewardInfo?.balance)) {
                    _rewardInfo += `，${this.componentData.params.rewardInfo.balance}${this.balance_text}`
                }
                if (this.componentData.params.rewardInfo?.red_package && !!parseFloat(this.componentData.params.rewardInfo?.red_package?.money)) {
                    _rewardInfo += `，￥${this.componentData.params.rewardInfo?.red_package?.money}红包`
                }
                return _rewardInfo
            },
            activityName(){
                return this.componentData.params.activityName
            },
            preheatType(){
                return this.componentData.params?.preheat_activity?.activity_type
            },
            hasSeckill(){
                return this.activityName==='seckill' || this.preheatType === 'seckill'
            },
        },
        methods: {
            clickShare() {
                this.$emit('custom-event', {
                    target: 'detail_info/clickShare',
                    data: this.componentData
                })
            },
            viewReward() {
                this.$emit('custom-event', {
                    target: 'detail_info/viewReward',
                    data: this.componentData
                })
            },
            refresh(type) {
                if (!this.$isPC) {
                    this.$emit('custom-event', {
                        target: 'detail_info/refresh',
                        data: type
                    })
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';

    .detail_info {
        width: 100%;

        .container {
            padding: px2rpx(8) px2rpx(12);
            width: 100%;
            box-sizing: border-box;
        }

        .floor {
            width: 100%;
            box-sizing: border-box;
            display: flex;
            flex-wrap: nowrap;

            &-text {
                margin-left: px2rpx(4);
            }
        }

        .title-floor {
            .title {
                color: $uni-text-color;
                width: 0;
                flex: 1;
                font-family: PingFang SC;
                font-style: normal;
                font-weight: bold;
                font-size: px2rpx(14);
                line-height: px2rpx(20);
                color: #212121;
            }

            margin-bottom: px2rpx(8);
        }

        .desc-floor {
            font-family: PingFang SC;
            font-style: normal;
            font-weight: normal;
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            /* 文字信息/56 */
            color: #969696;
            margin-bottom: px2rpx(8);
        }

        .price-floor {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            margin: px2rpx(8) auto px2rpx(16);

            &.seckill-price-floor {
                margin-bottom: 0;
            }
            .price-level {
                display: flex;
                flex-wrap: nowrap;
                align-items: flex-end;
            }
            .price {
                font-size: px2rpx(16);

                &-unit {
                    font-size: px2rpx(16);
                }
                .num {
                    margin-left: px2rpx(-4);
                    font-weight: 700!important;

                    font-style: normal;
                    font-size: px2rpx(24);
                    line-height: px2rpx(34);

                    &.small {
                        font-size: px2rpx(18);
                        line-height: px2rpx(25);
                    }
                }

                &-begin {
                    font-size: px2rpx(12);
                }
            }

            .level {
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0 0 px2rpx(7) px2rpx(4);
                border-radius: px2rpx(10);
                padding: 0 px2rpx(2) 0 0;
                min-width: px2rpx(40);
                width: fit-content;
                //height: px2rpx(13);
                line-height: px2rpx(13);
                color: #F2DCAC;
                background: #31312D;

                &.small {
                    margin: 0 0 px2rpx(5) px2rpx(4);
                }

                .icon-m-huangguan {
                    height: px2rpx(18);
                    line-height: px2rpx(18);
                    text-align: center;
                    padding-left: px2rpx(4);
                }
                .level-name {
                    font-size: px2rpx(11);
                    line-height: px2rpx(14);
                    padding: px2rpx(1) px2rpx(6) px2rpx(1) 0;
                    overflow: hidden;
                    white-space: nowrap;
                    display: inline-block;

                }
                line-height: px2rpx(34);

                &.small {
                    font-size: px2rpx(18);
                    line-height: px2rpx(25);
                }
            }

            .del-price-money {
                display: inline-block;
                font-family: PingFang SC;
                font-style: normal;
                font-weight: 500;
                font-size: px2rpx(12);
                line-height: px2rpx(17);
                color: $uni-text-color-grey;
                position: relative;

                // #ifndef MP-TOUTIAO
                text-decoration: line-through;
                .origin-price-line {
                    text-decoration: line-through;
                }
                // #endif

                &.no-level {
                    margin-top: px2rpx(6);
                }

                .line {
                    position: absolute;
                    height: px2rpx(1);
                    width: 100%;
                    background:#969696;
                    left: 0;
                    top: 50%;
                    transform: translate(0,-50%);
                }
            }
            .share-commission {
                display: flex;
                flex-wrap: nowrap;
                .commission {
                    min-width: px2rpx(56);
                    height: px2rpx(36);
                    background: linear-gradient(
                                    149.91deg,
                                    $uni-color-primary 0%,
                                    #ff6f29 94.38%
                    );
                    border-radius: px2rpx(6);
                    display: flex;
                    flex-direction: column;
                    color: #fff;
                    justify-content: space-around;
                    padding: px2rpx(2) px2rpx(8);
                    .money {
                        font-size: px2rpx(10);
                        text-align: center;

                        &-unit {
                            font-size: px2rpx(10);
                        }
                        .num {
                            font-size: px2rpx(14);
                            line-height: px2rpx(14);
                            font-weight: 500;
                        }
                    }
                    .word {
                        font-size: px2rpx(10);
                        line-height: px2rpx(10);
                        text-align: center;
                    }
                }
            }
            .float-share{
                position: absolute;
                right: 0;
                top:60%;
                background:rgba(0,0,0,0.5);
                font-size:px2rpx(12);
                text-align: center;
                line-height: px2rpx(24);
                height: px2rpx(24);
                color:#fff;
                padding:0 px2rpx(6);
                border-radius:px2rpx(12) 0 0 px2rpx(12);
                z-index: 666;
                display: flex;
                .share-icon {
                    display: inline-block;
                    width: px2rpx(18);
                    height: px2rpx(18);
                    font-size: px2rpx(14);
                    line-height: px2rpx(18);
                    text-align: center;
                    margin:auto px2rpx(2);
                }
                .share-word {
                    text-align: center;
                    font-size: px2rpx(10);
                    line-height: px2rpx(18);
                    height: px2rpx(18);
                    margin: auto 0;
                }
            }

            .bargaining {
                font-weight: 600;
                font-size: 20px;
                line-height: 30px;
                color: #FF3C29;
            }
        }

        .del-price-money {
            display: block;
            font-family: PingFang SC;
            font-style: normal;
            font-weight: 500;
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            color: $uni-text-color-grey;
            position: relative;

            // #ifndef MP-TOUTIAO
            text-decoration: line-through;
            .origin-price-line {
                text-decoration: line-through;
            }
            // #endif

            &.no-level {
                margin-top: px2rpx(6);
            }

            .line {
                position: absolute;
                height: px2rpx(1);
                width: 100%;
                background:#969696;
                left: 0;
                top: 50%;
                transform: translate(0,-50%);
            }
        }
        .share-commission {
            display: flex;
            flex-wrap: nowrap;

            .commission {
                min-width: px2rpx(56);
                height: px2rpx(36);
                background: linear-gradient(
                                149.91deg,
                                $uni-color-primary 0%,
                                #ff6f29 94.38%
                );
                border-radius: px2rpx(6);
                display: flex;
                flex-direction: column;
                color: #fff;
                justify-content: space-around;
                padding: px2rpx(2) px2rpx(8);

                .money {
                    font-size: px2rpx(10);
                    text-align: center;

                    &-unit {
                        font-size: px2rpx(10);
                    }

                    .num {
                        font-size: px2rpx(14);
                        line-height: px2rpx(14);
                        font-weight: 500;
                    }
                }

                .word {
                    font-size: px2rpx(10);
                    line-height: px2rpx(10);
                    text-align: center;
                }
            }
        }

        .float-share {
            position: absolute;
            right: 0;
            top: 60%;
            background: rgba(0, 0, 0, 0.5);
            font-size: px2rpx(12);
            text-align: center;
            line-height: px2rpx(24);
            height: px2rpx(24);
            color: #fff;
            padding: 0 px2rpx(6);
            border-radius: px2rpx(12) 0 0 px2rpx(12);
            z-index: 666;
            display: flex;

            .share-icon {
                display: inline-block;
                width: px2rpx(18);
                height: px2rpx(18);
                font-size: px2rpx(14);
                line-height: px2rpx(18);
                text-align: center;
                margin: auto px2rpx(2);
            }

            .share-word {
                text-align: center;
                font-size: px2rpx(10);
                line-height: px2rpx(18);
                height: px2rpx(18);
                margin: auto 0;
            }
        }

        .active-floor {
            height: rpx(58);
            background: #fff2e2;
            border-radius: rpx(4);
            color: #f00;
            box-sizing: border-box;
            padding: 0 rpx(8);
            margin-bottom: px2rpx(8);

            i,
            p {
                line-height: rpx(58);
                font-size: px2rpx(14);
                margin-right: px2rpx(8);
            }

            .demon {
                font-family: 'Open Sans';
                font-weight: bold;
                line-height: rpx(56);
            }
        }

        .express-floor {
            justify-content: space-between;

            p {
                line-height: px2rpx(17);
                font-size: px2rpx(12);
                color: $uni-text-color-grey;
            }

            color: $uni-text-color-grey;

            .iconfont-m- {
                vertical-align: px2rpx(-2);
            }
        }

        .market-floor {
            .pre {
                line-height: px2rpx(17);
                font-size: px2rpx(12);
                text-align: center;
                padding: 0 rpx(16);
                border-radius: rpx(4);
                background: #ccc;
                font-weight: bold;
                color: #fff;
                display: flex;
                flex-direction: column;
                justify-content: center;
                margin-right: rpx(10);
            }

            .pre-info {
                font-size: px2rpx(12);
                line-height: px2rpx(17);
                padding: rpx(2) 0 0 0;
                color: $uni-text-color-grey;
                position: relative;

                // #ifndef MP-TOUTIAO
                text-decoration: line-through;
                // #endif

                .date {
                    font-style: normal;
                }

                .line {
                    position: absolute;
                    height: px2rpx(1);
                    width: 100%;
                    background:#969696;
                    left: 0;
                    top: 50%;
                    transform: translate(0,-50%);
                }
            }
        }

        .reward-container {
            padding-top: px2rpx(8);
            background-color: #fff;

            .reward-box {
                height: px2rpx(40);
                background-color: #FFEBEE;
                padding-left: px2rpx(12);
                padding-right: px2rpx(12);
                display: flex;
                align-items: center;
                position: relative;

                img {
                    display: block;
                }

                img.bg {
                    position: absolute;
                }

                img.bg-left {
                    top: 0;
                    left: px2rpx(12);
                    width: px2rpx(53);
                }

                img.bg-right {
                    top: 0;
                    right: 0;
                    width: px2rpx(42);
                }

                .reward-type {
                    width: px2rpx(26);
                    flex-shrink: 0;

                    img {
                        width: px2rpx(26);
                    }
                }

                .reward-content {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    padding-left: px2rpx(8);
                    padding-right: px2rpx(1);
                    font-size: px2rpx(12);
                    line-height: px2rpx(17);
                    color: #212121;
                }

                .icon-m-right {
                    flex-shrink: 0;
                    line-height: px2rpx(16);
                    height: px2rpx(16);
                    font-size: px2rpx(16);
                    color: $uni-text-color-grey;
                }
            }
        }
    }
</style>
