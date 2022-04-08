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
    <div class="detail_navbar__seckill">
        <button class='shop nav-icon'
                :open-type="(activityData.params.canService && getLike.url=='wx_service')?'contact': ''"
                :send-message-img="activityData.params.goods_thumb"
                :send-message-title="activityData.params.goods_title"
                :send-message-path="activityData.params.goodslink"
                @click='clickItem("shop")'>
            <i class="myicon iconfont-m- icon-m-iconfontshop" style='color:#969696'></i>
            <span style='color:#969696'>店铺</span>
        </button>
        <button class='like nav-icon'
                :open-type="(activityData.params.canService && getLike.url=='wx_service')?'contact': ''"
                :send-message-img="activityData.params.goods_thumb"
                :send-message-title="activityData.params.goods_title"
                :send-message-path="activityData.params.goodslink"
                @click='clickItem("like")'>
            <i class="myicon" :class="[activityData.params.favor?'iconfont-m- icon-m-xingxingshixin':'iconfont-m- icon-m-xingxingkongxin']"  :style='{color:activityData.params.favor?activityData.style.dotcolor:activityData.style.iconcolor}'></i>
            <span style='color:#969696'>{{activityData.params.favor?'已收藏':'收藏'}}</span>
        </button>
        <div class="left-btn" :class="{'disabled': activityData.params.is_buy_disable}" @click="normalClick">
            <div class="left-btn-desc">
                <span class="money">¥</span>{{getPrice}}
            </div>
            <div class="left-btn-label">原价购买</div>
        </div>
        <div class="right-btn" :class="{
            'disabled': btnDisabled || activityData.params.is_buy_disable
        }" @click="specialClick">
            <span class="iconfont-m- icon-m-shandian right-btn-icon"></span>
            <span class="right-btn-text" v-if="!btnDisabled || !isSelled">马上抢</span>
            <span class="right-btn-text" v-else>已抢光</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'detail_navbar__seckill',
    props: {
        activityData: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        getPrice(){
            let {min_price,price,has_option} = this.activityData?.params?.goods||{};
            if(has_option=='1'){
                return `${this.formatMoney(min_price)}起`
            } else {
                return this.formatMoney(price)
            }
        },
        btnDisabled(){
            let stock =this.activityData?.params?.seckill?.activity_stock ||0
            return stock<=0;
        },
        // 库存为0
        isSelled(){
            return !this.activityData.params.canbuy;
        },
        // 剩余购买数量
        getSeckillLimit(){
            return this.activityData?.params?.seckill?.rules?.limit_num - this.activityData?.params?.seckill?.buy_count
        },
        limitBuy(){
             let limit_type = this.activityData?.params?.seckill?.rules.limit_type;
             if(limit_type!='0'){
                 return this.getSeckillLimit<=0
             } 
             return false
        }
    },
    methods: {
        normalClick(){
            this.$emit('normal-click', {
                btn:'buy',
            })
        },
        specialClick(){
            if(this.btnDisabled) return
            if(this.limitBuy) {
                this.$toast('购买超过限制')
                return;
            }
            this.$emit('special-click',{
                btn:'buy',
                activeName: 'seckill'
            })
        },
        formatMoney(money) {
            if (typeof money === 'number' || (typeof money === 'string' && money.trim() !== '')) {
                if (money >= 10000) {
                    return parseFloat(money / 10000) + '万'
                } else {
                    return parseFloat(money)
                }
            } else {
                return 0
            }
        },
        clickItem(btn) {
            let data = {
                btn,
            }
            if(btn == 'like') {
                data.icon= this.activityData.params.favor?'iconfont-m- icon-m-xingxingshixin':'iconfont-m- icon-m-xingxingkongxin',
                data.content=  this.activityData.params.favor?'已收藏':'收藏',
                data.color = this.activityData.params.favor?this.activityData.style.dotcolor:this.activityData.style.iconcolor
            }
            this.$emit('custom-event', {
                ...data
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.detail_navbar__seckill {
    width: 100%;
    height: px2rpx(48);
    display: flex;
    flex-wrap: nowrap;
    box-sizing: border-box;
    background-color: #fff;
    padding: px2rpx(4) px2rpx(6) px2rpx(4) 0;

    .nav-icon {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: px2rpx(54);
        flex-shrink: 0;
        position: relative;
        align-items: center;
        overflow: visible;
        background-color: #fff;

        &::after {
            border: 0;
        }
        .myicon {
            font-size: px2rpx(24);
            margin: 0 auto;
            text-align: center;
            height: px2rpx(24);
            width: px2rpx(24);
            line-height: px2rpx(24);
            font-style: normal;
        }
        .badge {
            box-sizing: border-box;
            font-size: px2rpx(8);
            position: absolute;
            height: px2rpx(12);
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            min-width: px2rpx(12);
            border-radius: px2rpx(11);
            font-weight: bold;
            color: #fff;
            transform: translate(-50%,0);
            left: 65%;
            top: px2rpx(-3);
            padding: 0;
            font-style: normal;
            padding: 0 px2rpx(3);
        }
        span {
            font-size: px2rpx(10);
            line-height: px2rpx(10);
            margin: 0 auto px2rpx(3);
            text-align: center;
        }
    }


    .left-btn {
        margin-left: px2rpx(4);
        width: px2rpx(128);
        height: px2rpx(40);
        box-sizing: border-box;
        text-align: center;
        border-radius: px2rpx(24) 0 0 px2rpx(24);
        background: #212121;
        .left-btn-desc {
            font-size: px2rpx(14);
            .money {
                font-size: px2rpx(10);
            }
        }
        &.disabled {
            border-color: #CCCCCC;
            .left-btn-desc {
                color: #CCCCCC;
            }
        }

        &-label {
            margin-bottom: px2rpx(3);
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            color: #fff;
        }

        &-desc {
            font-size: px2rpx(10);
            line-height: px2rpx(20);
            color: #fff;
        }
    }

    .right-btn {
        text-align: center;
        line-height: px2rpx(40);
        height: px2rpx(40);
        flex: 1;
        color: #ffffff;
        background:  linear-gradient(132.57deg, #FF3C29 0%, #FF6F29 94.38%);
        border-radius: 0 px2rpx(24) px2rpx(24) 0;
        &.disabled {
            background: #CCCCCC;
        }

        &-icon {
            height: px2rpx(20);
            width: px2rpx(20);
            font-size: px2rpx(20);
        }

        &-text {
            font-weight: 600;
            font-size: px2rpx(18);
            line-height: px2rpx(25);
        }
    }
}

</style>
