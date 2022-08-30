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
    <view class="create-goods">
        <!-- 配送、自提时间 -->
        <div class="deliver-time-box border-radius-top" v-if="getDeliveryTimeStatus">
            <div class="deliver-time deliver-time--bottom">
                <div class="label">
                    {{ getDeliveryName }}
                </div>
                <div class="content">
                    <!-- <date-time :date="delivery_time" :start="currentDate" @on-ok="handleTimeOk"></date-time> -->
                    <date-time-picker :title="getDeliveryName" :deliveryTime="delivery_time" :spanDetail="span_detail" :spanDetailNow="span_detail_now" @handleTimeOk="handleTimeOk"></date-time-picker>
                    <span class="iconfont-m- icon-m-right"></span>
                </div>
            </div>
        </div>
        <view class="create-goods-block border-radius-top"  v-for="(item, index) in goodsData" :key="index">
            <div class="create-goods-block-item">
                <goods-block :order="true"
                             :maxBuyNum="getMaxNum"
                             :activity-type="activityType"
                             :addGrayColor="addGrayColor"
                             :reduceGrayColor="reduceGrayColor"
                             :orderData="orderData"
                             :goodsData="item"
                             @detail="detail(item.goods_id)"
                             @handlerChangeNumber="handlerChangeNumber(goodsData, index,$event)"
                             @handlerBlurNumber="handlerBlurNumber(goodsData, index,$event)"
                             @clickAdd="clickAdd(goodsData,index,$event)">
                </goods-block>
            </div>
        </view>
    </view>
</template>

<script>
    import goodsBlock from "../goods/GoodsBlock";
    import DateTime from '../datetime/index.vue'
    import DateTimePicker from '../DateTimePicker'

    import {mapState} from 'vuex'

    export default {
        name: "CreateGoods",
        components: {
            goodsBlock,
            DateTime,
            DateTimePicker

        },
        props: {
            goodsData: {
                type: Array,
                default: () => []
            },
            activityType: {
                type: [String,Number],
                default: ''
            },
            orderData: {
                type: Object,
                default: ()=> {}
            },
            dispatch_type: { // 当前选择配送方式
                type: String,
                default: ''
            }
        },
        data() {
            return {
                addGrayColor: false,
                reduceGrayColor: true,
                currentDate: '', // 当前时间
                date:'',
            }
        },
        watch:{
            'delivery_time':{
                handler(val){
                    console.log(val,'vall')
                    if(val){
                        this.date =val
                    }
                },
                deep:true
            }
        },
        computed: {
            ...mapState('orderCreate', {
                delivery_time: state => state.deliveryTime,
                merchant_delivery_time: state => state.merchant_delivery_time,
                span_detail: state => state.span_detail,
                span_detail_now: state => state.span_detail_now,
            }),
            backgroundImage() {
                return `background-image:url(${this.$utils.staticMediaUrl('decorate/logo_default.png')})`
            },
            getMaxNum() {
                /*
                * 2秒杀活动
                * 5. 积分余额商品
                * default 普通商品
                * */
                switch (this.activityType) {
                    case 2:
                        return this.getSeckillMax
                    case 5:
                        return this.creditShopMax
                }
            },
            getSeckillMax(){
                if(this.activityType==2) {
                    let activityData = this.orderData?.extra_discount_rules_package?.[0]?.seckill || {}
                    let {buy_count,rules: {limit_num,limit_type}} = activityData
                    return limit_type != 0? Number(limit_num - buy_count) : ''
                }

            },
            creditShopMax(){
                if(this.activityType == 5){
                    let credit_shop = this.orderData.activity_return_data.credit_shop || {}
                    let {buy_count,goods_limit_num: limit_num,goods_limit_type:limit_type} = credit_shop
                    return limit_type != 0? Number(limit_num - buy_count) : ''
                }
            },
            // 获取配送、自提时间开启状态
            getDeliveryTimeStatus() {
                // 到店自提
                if (20 === +this.orderData.dispatch_type) {
                    return 1 === +this.orderData.dispatch_verify_delivery_time && 0 === this.goodsType;
                } else if (30 === +this.orderData.dispatch_type) {
                    return 1 === +this.orderData.delivery_time;
                }
                return false;
            },
            // 配送、核销字段名称
            getDeliveryName() {
                let option = {
                    20: '自提时间',
                    30: '配送时间'
                }
                return option[this.orderData.dispatch_type];
            }
        },
        created() {
        },
        mounted() {
            this.currentDate = this.$utils.formatDateTime(new Date(), 'yyyy-MM-dd hh:mm');
        },
        methods: {
            detail(id) {
                if (+this.activityType === 5) {
                    this.$Router.auto({
                        path: '/kdxCreditShop/detail',
                        query: {
                            id
                        }
                    });
                    return
                }
                this.$Router.auto({
                    path: '/kdxGoods/detail/index',
                    query: {
                        goods_id: id
                    }
                })
            },
            clickAdd(data, index, e) {

            // 秒杀处理限购
            if(this.activityType == 2){
                this.seckillActLimit(index,e)
                return
            }
            // 积分商品
            if(this.activityType ==5){
                this.creditShopActLimit(index, e)
                return
            }
            // 活动限购处理
            let actLimitFns = {}
            for(let key in this.orderData.extra_price_package){
                let actLimitFn = actLimitFns[key]
                if(actLimitFn) {
                    actLimitFn.call(this, index, e)
                    return
                }
            }
            let max_buy = Number(data[index].stock);
            let min_buy = 1;
            if (e == 1) {
                // 增加下单页面
                this.reduceGrayColor = false;
                data[index].total++;
                if (Number(data[index].total) > max_buy) {
                    data[index].total = max_buy;
                    this.addGrayColor = true;
                    this.$toast('不能增加了');
                    return
                } else if(Number(data[index].total) > Number(data[index].stock)) { // 超库存
                    data[index].total = Number(data[index].stock);
                    this.$toast('不能增加了');
                    return
                }
            } else {
                // 减少
                this.addGrayColor = false;
                data[index].total--;
                if (Number(data[index].total) < min_buy) {
                    data[index].total = min_buy;
                    this.reduceGrayColor = true;
                    this.$toast('不能减少了');
                    return
                } else if (Number(data[index].total) <1) {
                    data[index].total = 1;
                    this.$toast('不能减少了');
                }
            }
            this.setGoodInfo()
        },
        // 输入数量
        handlerChangeNumber(data, index, e) {
            setTimeout(() => {
                let num = Number(parseInt(e.target.value));
                if (isNaN(num) || num == 0) {
                    return
                }
                e.target.value = num;
                this.reduceGrayColor = false;
                setTimeout(() => {
                    data[index].total = num;
                }, 0)
            },0)
        },
        handlerBlurNumber(data, index, e) {
            // 秒杀处理限购
            if(this.activityType == 2) {
                this.seckillActLimit(index, e.target.value,'blur')
                return
            }

            // 活动限购处理
            let actLimitFns = {}
            for(let key in this.orderData.extra_price_package){
                let actLimitFn = actLimitFns[key]
                if(actLimitFn) {
                    actLimitFn.call(this, index, e.target.value,'blur')
                    return
                }
            }

            let max_buy = Number(data[index].stock);
            let min_buy = 1;
            setTimeout(() => {
                if (Number(data[index].total) < min_buy) {
                    data[index].total = min_buy;
                    this.reduceGrayColor = true;
                    this.$toast(`最少购买${min_buy}件`);
                }
                if (Number(data[index].total) > max_buy) {
                    data[index].total = max_buy;
                    this.addGrayColor = true;
                    this.$toast(`最多限购${max_buy}件`);
                }
                this.setGoodInfo()
            }, 0)
        },
        // 秒杀活动限购
        seckillActLimit(index,e,type = 'click'){
            let activityData = this.orderData?.extra_discount_rules_package?.[0]?.seckill || {}
            let goodsStock = this.goodsData[index].stock;
            let option_id = this.$Route.query.option_id;
            let activeStock = activityData?.goods_info[option_id]?.activity_stock
            let stock = Math.min(goodsStock,activeStock)
            let {buy_count,rules: {limit_num,limit_type}} = activityData

            this.commonActLimit({index,e,type}, {stock,buy_count,limit_num,limit_type})
        },
        // 积分商城限购
        creditShopActLimit(index,e, type = 'click'){
            let credit_shop = this.orderData.activity_return_data.credit_shop || {}
            let goodsStock = this.goodsData[index].stock;
            let activeStock = credit_shop.credit_shop_stock
            let stock = Math.min(goodsStock,activeStock)
            let {buy_count,goods_limit_num: limit_num,goods_limit_type:limit_type} = credit_shop
            this.commonActLimit({index,e,type}, {stock,buy_count,limit_num,limit_type})
        },
        commonActLimit({index,e,type}, {stock,buy_count,limit_num,limit_type}){
            let num;
            if(type=='click'){
                num = Number(this.goodsData[index].total)+ Number(e);
            } else {
                num = Number(e)
            }
            if(num == 0){
                this.goodsData[index].total=1;
                this.setGoodInfo()
                this.$toast(`至少购买1件`)
                return
            }

            if(limit_type!='0') {
                let canbuy = Number(limit_num - buy_count);
                if(num>canbuy) {
                    this.$toast(`限购${canbuy}件`)
                    this.goodsData[index].total=canbuy;
                    this.setGoodInfo()
                    return
                }
            }

            if(num> stock) {
                this.$toast('库存不足')
                this.goodsData[index].total = stock
                this.setGoodInfo()
                return
            }

            this.goodsData[index].total=num;
            this.setGoodInfo()
        },
        setGoodInfo() {
            let goodsInfo = [];
            goodsInfo = this.goodsData.map(item => {
                return {
                    goods_id: item.goods_id,
                    option_id: item.option_id || 0,
                    total: item.total
                }
            });
            // 存储store
            this.$store.commit('orderCreate/setGoodsInfo', goodsInfo);
            this.getData()
        },

        getData() {
            this.$emit('getData')
        },
        toInvoice(data) {
            this.$emit('toInvoice', data)
        },
        handleTimeOk(date) {
            this.date = date;
            this.$store.commit('orderCreate/setOrderDeliverTime', date)
        },
    },
}
</script>

<style lang="scss">
.create-goods {
    margin-top: 16rpx;
    .create-goods-block {
        position: relative;
        /*padding: 0 24rpx;*/
        background-color: #fff;
        //border-radius: px2rpx(6) px2rpx(6) 0 0;
        &.shop {
            padding: 16rpx 0 0;
            margin-bottom: px2rpx(8);
            border-radius: px2rpx(6);
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
    .create-goods-block-item {
        padding: 32rpx px2rpx(12);
        .reduce-icon {
            padding: 20rpx 0 0 8rpx;
        }
    }
    .shop-item {
        display: flex;
        align-items: center;
        padding: 0 px2rpx(12);
        font-size: px2rpx(14);
        .shop-logo {
            margin-right: px2rpx(8);
            width: px2rpx(24);
            height: px2rpx(24);
            background-size: 100% 100%;
            background-repeat: no-repeat;
        }
        .shop-img {
            width: px2rpx(24);
            height: px2rpx(24);
            border-radius: 50%;
        }
        .self-label {
            margin-right: px2rpx(4);
            padding: px2rpx(1) px2rpx(3);
            line-height: px2rpx(12);
            background: linear-gradient(132.57deg, #FF3C29 0%, #FF6F29 94.38%);
            color: #fff;
            font-size: px2rpx(9);
            font-weight: 600;
            border-radius: px2rpx(2);
        }
        .shop-name {
            line-height: 20px;
        }
    }
    // 配送、自提时间
    .deliver-time {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: px2rpx(16) 0;
        .label {
            font-size: px2rpx(14);
            line-height: px2rpx(16);
            font-weight: bold;
            color: $color-w1;
            &:after {
                content: '*';
                display: inline-block;
                margin-left: px2rpx(4);
                line-height: 1;
                font-size: px2rpx(14);
                color: $uni-color-primary;
            }
        }
        .content {
            color: $uni-text-color-grey;
            font-size: px2rpx(14);
            line-height: px2rpx(16);
            font-weight: bold;
            display: flex;
        }
    }
    .deliver-time-box {
        padding: 0 px2rpx(12);
        //border-radius: px2rpx(6) px2rpx(6) 0 0;
        background-color: #ffffff;
    }
    .deliver-time--bottom {
        position: relative;
        &:after {
            content: '';
            position: absolute;
            left: -50%;
            bottom: 0;
            right: 0;
            width: 200%;
            height: 1px;
            background-color: #e6e7eb;
            -webkit-transform: scale(0.5);
            transform: scale(0.5);
            overflow: hidden;
        }
    }
    .border-radius-top {
        &:first-child {
            border-radius: px2rpx(6) px2rpx(6) 0 0;
        }
    }
}
</style>
