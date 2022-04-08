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
    <div class='distributor decorate' v-if='componentData&&componentData.id=="distributor"'>
        <div class="top-info" :style='{background:componentData.style.background}'>
            <div class="left-img">
                <div class="img-box">
                    <img class='avart' lazy-load mode='widthFix' :src="$utils.mediaUrl(componentData.params.avatar)||$utils.staticMediaUrl('login/avatar_default.png')" alt="">
                </div>
            </div>
            <div class="right-info" :class="{
                'center': componentData.params.show_commission_level ==1
            }">
                <p class="title" :style='{color:componentData.style.nicknamecolor}'>{{componentData.params.nickname}}</p>
                <p class="level" @click='checkLevel' v-if="componentData.params.show_commission_level ==1"><img class='level-icon' :src="$utils.staticMediaUrl('commission/commission-level.png')" alt="">{{componentData.params.levelname}}</p>
                <p class="recommender" :style='{color:componentData.style.recommendercolor}'>推荐人：{{componentData.params.recommender}}</p>
            </div>
        </div>
        <div class="bottom-info">
            <div class="left-info">
                <p class="title" :style='{color:componentData.style.titlecolor}'>{{componentData.params.canwithdrawtext||`可${componentData.params.withdrawtext||'提现'}${componentData.params.moneytext||''}`}}（元）</p>
                <p class="money havemoney" :style='{color:componentData.style.hightlightcolor}'>{{componentData.params.havemoney}}</p>
                <p class="withdraw btn" :style='{background:componentData.style.hightlightcolor}' @click='goWithDraw'>{{componentData.params.withdrawtext || '提现'}}</p>
            </div>
            <div class="right-info">
                <p class="title" :style='{color:componentData.style.titlecolor}'>{{componentData.params.waitrecordtext||`待入账${componentData.params.moneytext||''}`}} (元)<span class='check' :style='{color:componentData.style.hightlightcolor}' @click='checkCommission'>查看</span></p>
                <p class="money pending" :style='{color:componentData.style.moneycolor}'>{{componentData.params.pending}}</p>
                <p class="title" :style='{color:componentData.style.titlecolor}'>成功{{componentData.params.withdrawtext||''}}{{componentData.params.moneytext||''}} (元)</p>
                <p class="money withdraw" :style='{color:componentData.style.moneycolor}'>{{componentData.params.withdraw||''}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'distributor',
        data() {
            return {}
        },
        computed: {},
        methods: {
            checkLevel() {
                this.$emit('custom-event', {
                    target: 'distributor/checkLevel'
                })
            },
            goWithDraw() {
                this.$emit('custom-event', {
                    target: 'distributor/goWithDraw'
                })
            },
            checkCommission() {
                this.$emit('custom-event', {
                    target: 'distributor/checkCommission'
                })
            }
        }
    }
</script>

<style lang="scss">
    @import './decorate.scss';
    .distributor.decorate {
        width: px2rpx(375);
        overflow: hidden;
        position: relative;
        padding-bottom: px2rpx(72);
        .img-box {
            overflow: hidden;
            border-radius: 50%;
        }
        .top-info {
            width: 100%;
            padding: px2rpx(24) px2rpx(26) px2rpx(89);
            background: #FF6F29;
            display: flex;
            flex-wrap: nowrap;
            .left-img {
                width: px2rpx(60);
                height: px2rpx(60);
                flex-shrink: 0;
                border: px2rpx(0.5) solid #E6E7EB;
                box-sizing: border-box;
                border-radius: 50%;
                margin: auto px2rpx(12) auto 0;
                overflow: hidden;
                .avart,.img-box {
                    width: 100%;
                    height: 100%;
                }
            }
            .right-info {
                flex: 1;
                width: 0;
                display: flex;
                flex-direction: column;
                min-height: px2rpx(60);

                &.center {
                    justify-content: center;
                }
                .title {
                    font-family: PingFang SC;
                    font-style: normal;
                    font-size: px2rpx(16);
                    line-height: px2rpx(22);
                    color: #fff;
                    font-weight: bold;
                }
                .level {
                    width: fit-content;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    text-align: center;
                    position: relative;
                    font-size: px2rpx(8);
                    font-weight: bold;
                    line-height: px2rpx(0);
                    padding: px2rpx(7) px2rpx(3) px2rpx(6) px2rpx(13);
                    border-radius: px2rpx(2);
                    vertical-align: middle;
                    background: #565656;
                    color: #FFE382;
                    margin: px2rpx(5) px2rpx(7);
                    .level-icon {
                        position: absolute;
                        top: 50%;
                        left: 0;
                        transform: translate(-50%, -50%);
                        width: px2rpx(15);
                        height: px2rpx(15);
                        margin: auto 0;
                    }
                }
                .recommender {
                    font-size: px2rpx(10);
                    line-height: px2rpx(14);
                    color: #fff;
                }
            }
        }
        .bottom-info {
            width: px2rpx(350);
            height: px2rpx(147);
            background: #fff;
            border-radius: px2rpx(6);
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            margin: 0 auto;
            box-sizing: border-box;
            padding: px2rpx(24);
            display: flex;
            flex-wrap: nowrap;
            .left-info,
            .right-info {
                width: 50%;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .title {
                    font-size: px2rpx(12);
                    color: #969696;
                    line-height: px2rpx(17);
                }
                .money {
                    font-size: px2rpx(16);
                    font-weight: 500;
                    line-height: px2rpx(22);
                    color: #000;
                }
                .havemoney {
                    font-size: px2rpx(24);
                    line-height: px2rpx(34);
                    color: #FF6F29;
                }
                .withdraw.btn {
                    width: px2rpx(62);
                    height: px2rpx(25);
                    border-radius: px2rpx(40);
                    background: #FF6F29;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    text-align: center;
                    font-size: px2rpx(12);
                    color: #fff;
                    margin-top: px2rpx(10);
                }
            }
            .left-info {
                border-right: px2rpx(0.5) solid #E6E7EB;
            }
            .right-info {
                padding-left: px2rpx(24);
                .pending {
                    margin-bottom: px2rpx(8);
                }
                .check {
                    color: #FF6F29;
                    margin-left: px2rpx(8);
                }
            }
        }
    }
</style>