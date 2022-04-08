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
    <div class="detail-info-seckill">
        <div class="seckill-pending" v-if="isStart">
            <div class="activity-price" :style="{
                background: getBg
            }">
                <div class="left">
                    <div class="seckill">
                        <span class="seckill-label">秒杀价</span>
                        <span class="seckill-unit">¥</span>
                        <span class="seckill-num">{{getPrice || 20}}</span>
                    </div>
                    <div class="seckill-stock">秒杀库存: {{getStock}}件</div>
                </div>
                <div class="right">
                    <div><i class="iconfont-m- icon-m-miaoshabiaoti seckill-icon"></i></div>
                    <div class="seckill-surplus">活动剩余时间</div>
                    <div class="seckill-count">
                        <span class="text">{{countTime[0]}}天</span>
                        <span class="time">{{countTime[1]}}</span>
                        <span class="colon">:</span>
                        <span class="time">{{countTime[2]}}</span>
                        <span class="colon">:</span>
                        <span class="time">{{countTime[3]}}</span>
                        </div>
                </div>
            </div>
        </div>
         <div class="seckill-waiting flex"
         :class="{
             'column': getPriceLen>12
         }"
          v-else
             :style="'background-image: url('+ $utils.staticMediaUrl('seckill/bg2.png') +')'">
             <div class="seckill-notice">
                 <i class="iconfont-m- icon-m-shandian seckill-notice-icon"></i>
                 <span class="seckill-notice-text">秒杀预告</span>
             </div>
            <div class="seckill-waiting-box">
                <span class="seckill-waiting-time">
                    <span>还有</span>
                    <span>{{getHotDay}}天</span>
                    <span class="seckill-waiting-timebox">{{getStartTime}}</span> 
                    <span>开启活动</span>
                </span>
                <span class="seckill-waiting-price">秒杀价¥{{getPrice}}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
     props: {
        activityData: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            countTime: []
        }
    },
    computed: {
        hasOption(){
            return this.activityData.params.has_option=='1'
        },
        getPrice(){
            if(!this.hasOption) {
                return this.formatMoney(this.getInfo?.activity_price)
            } else {
                let {min_price,max_price} = this.getInfo?.price_range
                let price = `${this.formatMoney(min_price)}-${this.formatMoney(max_price)}`
                return this.$utils.formartPrice(price)
            }
        },
        getPriceLen(){
            return this.getPrice?.length || 0
        },
        getStock(){
            let stock = this.activityData.params.stock
            let activity_stock = this.activityData.params?.seckill?.activity_stock || 0
            return Math.min(stock,activity_stock)
        },
        getStartTime(){
            if(this.countTime.length){
                return  `${this.countTime[1]}:${this.countTime[2]}:${this.countTime[3]}`
            }
            return  ''
        },
        getHotDay(){
            return this.countTime?.[0] || 0
        },
        isStart(){
            return this.activityData.params?.activityName=='seckill'
        },
        getInfo(){
            return this.isStart? this.activityData?.params?.seckill: this.activityData?.params?.preheat_activity;
        },
        getBg(){
            return `url('${this.$utils.staticMediaUrl('seckill/bg.png')}')`
        }

    },
    mounted(){
        this.cutdownTime()
    },
    methods: {
        cutdownTime(){
            let {start_time,end_time} = this.getInfo;
            let endTime =this.isStart? end_time:start_time;
            let formatTime = new Date(Date.parse(endTime.replace(/-/g, "/"))).getTime()

            if((formatTime-Date.now()>0)) {
                let time = formatTime/1000;
                this.startCount(time)
            }
        },
        startCount(time){
            this.countTime = this.$utils.countDown(time, false);
            let timer = setInterval(()=>{
                this.countTime = this.$utils.countDown(time, false);

                if(this.countTime === false) {
                    this.$emit('refresh', 'endStop');
                    clearInterval(timer)
                    this.cutdownTime()
                }
            },1000)

            this.$once('hook:beforeDestroy',()=> {
                clearInterval(timer)
            })
        },
         formatMoney(money) {
            if (typeof money === 'number' || (typeof money === 'string' && money.trim() !== '')) {
                if (money >= 10000) {
                    return parseFloat(money / 10000).toFixed(2) + '万'
                } else {
                    return parseFloat(money).toFixed(2)
                }
            } else {
                return 0
            }
        }
       
    }
}
</script>

<style lang="scss" scoped>
.detail-info-seckill {
    .seckill-pending {
        .activity-price {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 px2rpx(27) 0 px2rpx(12);
            height: px2rpx(72);
            background-repeat: no-repeat;
            background-size: 100% 100%;
            color: #fff;
            background-size: cover!important;
            background: #ff3c29;
            .left {
                .seckill {
                    margin-bottom: px2rpx(3);
                    color: #fff;

                    &-label {
                        font-size: px2rpx(12);
                        line-height: px2rpx(17);
                    }

                    &-unit{
                        margin-left: px2rpx(10);
                        font-size: px2rpx(16);
                        line-height: px2rpx(20);
                    }

                    &-num {
                        font-size: px2rpx(24);
                        font-weight: bold;
                        line-height: px2rpx(30);
                    }
                }

                .seckill-stock {
                    font-size: px2rpx(12);
                    line-height: px2rpx(17);
                    color: #FFFFFF;
                    opacity: 0.8;
                }
                
                
            }
            .right {
                display: flex;
                flex-direction: column;
                align-items: flex-end;

                .seckill-icon {
                    margin-bottom: px2rpx(4);
                    font-size: px2rpx(16);
                }

                .seckill-surplus {
                    margin-bottom: px2rpx(6);
                    font-size: px2rpx(10);
                    line-height: px2rpx(14);
                }
                
                .seckill-count {
                    display: flex;
                    align-items: center;
                    height: px2rpx(16);
                    color: #fff;

                    .time {
                        width: px2rpx(16);
                        height: px2rpx(16);
                        line-height: px2rpx(16);
                        text-align: center;
                        background-color: #212121;
                        color: #ffffff;
                        font-size: px2rpx(12);
                        border-radius: px2rpx(2);
                    }

                    .text {
                        margin-right: px2rpx(6);
                        font-size: px2rpx(10);
                    }

                    .colon {
                        margin: 0 px2rpx(2);
                    }
                }
            }
        }
    }

    .seckill-waiting {
            padding: px2rpx(12);
            align-items: center;
            justify-content: flex-start;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            font-size: px2rpx(12);
            color: #212121;

            &.column {
                flex-direction: column;
                align-items: flex-start;

                .seckill-waiting-box {
                    margin-top: px2rpx(4);
                }
            }

            .seckill-notice {
                display: flex;
                align-items: center;
                margin-right: px2rpx(4);
                padding: px2rpx(1) px2rpx(2);
                border-radius: px2rpx(2);
                background: #ff3c29;
                flex-shrink: 0;


                &-icon {
                    font-size: px2rpx(8);
                    color: #fff;                    
                }
                &-text {
                    font-size: px2rpx(9);
                    font-weight: bold;
                    line-height: px2rpx(12);
                    color: #fff;    
                }
            }


            &-time,&-price {
                font-size: px2rpx(12);
                color: #ff3c29;
            }

            &-time {
                margin-right: px2rpx(12);
            }

            &-timebox {
                width: px2rpx(48);
            }
            &-price {
               font-weight: bold;
               white-space: pre;
            }
        }
}
</style>