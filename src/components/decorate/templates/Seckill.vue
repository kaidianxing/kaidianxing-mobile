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
    <div class="seckill" v-if="componentData&&componentData.id=='seckill'&&limitNumData.length>0" :style="{padding:`${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`}">
        <div class="content" :style="{
            borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`,
            background: getBg
        }">
            <div class="activity-header" v-if="componentData.params.showacttitle == 1" :style="{background: getTitlebg}">
                <div class="left">
                    <div class="activity-name" v-if="componentData.params.titletype === 'texticon'">
                        <i :class="componentData.params.titleicon" :style="{color: componentData.style.titleiconcolor, fontSize: titleIconFontSize}"></i>
                        <span class="name"
                              :style="{fontSize: `${px2rpx(componentData.style.titlesize)}`, fontWeight: componentData.params.titleweight, color: componentData.style.titlecolor}"
                        >{{ componentData.params.titlename }}</span>
                    </div>
                    <img mode='aspectFit' lazy-load :src="$utils.mediaUrl(titleImage)" alt="" :class="[$isPC ? 'title-img-pc' : 'title-img']"
                         @load='loaded(titleImage)' @error='loaded(titleImage)' v-else-if="componentData.params.titletype === 'img' && titleImage" :style="{width: titleImgWidth}"
                    />
                    <i v-else-if="componentData.params.titletype === 'img' && !titleImage" class="iconfont-m- icon-m-miaoshabiaoti seckill-icon" style="color: #FFFFFF" />
                    <div class="activity-time" v-if="componentData.params.activityGoodsType == 1">
                        <span class="text" :style="{color: componentData.style.textcolor}">{{isStart(componentData.params.activeInfo)?'距结束':'距开始'}}</span>
                        <span class="time" :style="{color: componentData.style.numcolor, backgroundColor: componentData.style.countbgcolor}">{{countTime[0]}}</span>
                        <span class="colon" :style="{color: componentData.style.textcolor}">天</span>
                        <span class="time" :style="{color: componentData.style.numcolor, backgroundColor: componentData.style.countbgcolor}">{{countTime[1]}}</span>
                        <span class="colon" :style="{color: componentData.style.textcolor}">:</span>
                        <span class="time" :style="{color: componentData.style.numcolor, backgroundColor: componentData.style.countbgcolor}">{{countTime[2]}}</span>
                        <span class="colon" :style="{color: componentData.style.textcolor}">:</span>
                        <span class="time" :style="{color: componentData.style.numcolor, backgroundColor: componentData.style.countbgcolor}">{{countTime[3]}}</span>
                    </div>
                </div>
                <div class="more-btn" :style="{color: componentData.style.morecolor}" @click="goDetail" v-if="componentData.params.showmore == 1&&componentData.style.listtype == 'scroll'">
                    <span>查看更多</span>
                    <i class="iconfont-m- icon-m-right  more-icon"></i>
                </div>
            </div>

            <!-- 滑动 -->
            <div class="scroll-box" v-if="componentData.style.listtype == 'scroll'">
                <ul class="goods-list">
                    <li class="goods-list-box" @click='clickGood(item,index)' v-for="(item,index) in limitNumData" :key="index">
                        <div class="goods-list-info" :style="{
                            background: componentData.style.goodsbgcolor
                        }">
                            <div class="goods-img-box">
                                <div class="badge-box" :class="$isPC?'scale':''" v-if='componentData.params.showbadge==1' :style="{background: componentData.style.badgebgcolor}">
                                    <i class="badge-icon" :class="[componentData.params.badgeicon]" :style="{color: componentData.style.badgecolor}"></i>
                                    <span class="badge-text" :style="{color: componentData.style.badgetextcolor}">{{componentData.params.badgetext||'限时秒杀'}}</span>
                                </div>
                                <img mode='widthFix' lazy-load :src="getLoadingSrc" alt="" class='goods-img preload'
                                     v-if='item.preloading&&preloading'/>
                                <img mode='widthFix' lazy-load :src="$utils.mediaUrl(item.thumb)" alt="" class='goods-img'
                                     @load='loaded(item.thumb)' @error='loaded(item.thumb)'
                                     :class='{loading:item.preloading&&preloading}' v-if='startLoadImg'/>
                            </div>
                            <div class="goods-footer">
                                <div class="goods-title" :style="{color: componentData.style.goodscolor}">{{item.title}}</div>
                                <div class="activity-time" :style="{backgroundColor: componentData.style.countbgcolor, borderColor: componentData.style.numcolor}" v-if="componentData.params.activityGoodsType == 0">
                                    <div style="transform: scale(0.8);width: 125px;margin-left: -12px;">
                                        <span class="text" :style="{color: componentData.style.textcolor}">{{isStart(item.seckillData)?'距结束':'距开始'}}</span>
                                        <span class="time" :style="{color: componentData.style.textcolor}">{{item.countTime[0]}}</span>
                                        <span class="colon" :style="{color: componentData.style.textcolor}">天</span>
                                        <span class="time" :style="{color: componentData.style.textcolor}">{{item.countTime[1]}}</span>
                                        <span class="colon" :style="{color: componentData.style.textcolor}">:</span>
                                        <span class="time" :style="{color: componentData.style.textcolor}">{{item.countTime[2]}}</span>
                                        <span class="colon" :style="{color: componentData.style.textcolor}">:</span>
                                        <span class="time" :style="{color: componentData.style.textcolor}">{{item.countTime[3]}}</span>
                                    </div>
                                </div>
                                <div class="goods-price-info">
                                    <div class="goods-seckill-tag"  :class="$isPC?'scale':''" v-if="componentData.params.showtag=='1'" :style="{
                                        color: componentData.style.tagtextcolor,
                                        background: componentData.style.tagbgcolor
                                    }">{{componentData.params.tagtext || '秒杀价'}}</div>
                                    <span class="goods-price-unit"  :style="{color: componentData.style.seckillcolor}">¥</span>
                                    <span class="goods-price-num"  :style="{color: componentData.style.seckillcolor}">{{item|getSeckillPrice|formatMoney}}</span>
                                </div>
                                <div class="goods-sale-info" v-if="componentData.params.showprice=='1'" :class="{
                                    'flex-end': componentData.params.showprice=='0' ||  item.productprice<=0
                                }">
                                    <span v-if="componentData.params.showprice=='1'&& item.productprice>0"  class="orginal-price"  :style="{color: componentData.style.pricecolor}">¥{{item.productprice|formatMoney}}</span>
                                    <span v-if="componentData.params.showsales=='1'"  :style="{color: componentData.style.salescolor}">{{componentData.params.salestext|| '销量'}}:{{item.sales}}</span>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- 列表 -->
            <div class="list-box" v-if="componentData.style.listtype == 'list'">
                <ul class="goods-list">
                    <li class="goods-list-box" @click='clickGood(item,index)'  v-for="(item,index) in limitNumData" :key="index">
                        <div class="left">
                            <div class="badge-box" :class="$isPC?'scale':''" v-if='componentData.params.showbadge==1' :style="{background: componentData.style.badgebgcolor}">
                                <i class="badge-icon" :class="[componentData.params.badgeicon]" :style="{color: componentData.style.badgecolor}"></i>
                                <span class="badge-text" :style="{color: componentData.style.badgetextcolor}">{{componentData.params.badgetext||'限时秒杀'}}</span>
                            </div>
                            <img mode='widthFix' lazy-load :src="getLoadingSrc" alt="" class='goods-img preload'
                                 v-if='item.preloading&&preloading'/>
                            <img mode='widthFix' lazy-load :src="$utils.mediaUrl(item.thumb)" alt="" class='goods-img'
                                 @load='loaded(item.thumb)' @error='loaded(item.thumb)'
                                 :class='{loading:item.preloading&&preloading}'  v-if='startLoadImg'/>
                        </div>
                        <div class="right">
                            <div class="right-box van-hairline--bottom">
                                <div class="goods-title" :class="item.sub_name?'line-hide':'two-line-hide'" :style="{color: componentData.style.goodscolor}">{{item.title}}</div>

                                <div class="line-hide goods-subtitle" v-if="item.sub_name"  :style="{color: componentData.style.subtitlecolor}">{{item.sub_name}}</div>

                                <div class="goods-price-info">
                                    <div class="goods-price-box" v-if="componentData.params.activityGoodsType!=='0'&&componentData.params.listtype!=='list'">
                                        <div class="goods-seckill-tag" v-if="componentData.params.showtag=='1'" :style="{
                                            color: componentData.style.tagtextcolor,
                                            borderColor: componentData.style.tagbordercolor
                                        }">{{componentData.params.tagtext || '秒杀价'}}</div>
                                    </div>
                                    <div v-else>
                                        <div class="activity-time" :style="{backgroundColor: componentData.style.countbgcolor, borderColor: componentData.style.numcolor}">
                                            <span class="text" :style="{color: componentData.style.textcolor}">{{isStart(item.seckillData)?'距结束':'距开始'}}</span>
                                            <span class="time" :style="{color: componentData.style.textcolor}">{{item.countTime[0]}}</span>
                                            <span class="colon" :style="{color: componentData.style.textcolor}">天</span>
                                            <span class="time" :style="{color: componentData.style.textcolor}">{{item.countTime[1]}}</span>
                                            <span class="colon" :style="{color: componentData.style.textcolor}">:</span>
                                            <span class="time" :style="{color: componentData.style.textcolor}">{{item.countTime[2]}}</span>
                                            <span class="colon" :style="{color: componentData.style.textcolor}">:</span>
                                            <span class="time" :style="{color: componentData.style.textcolor}">{{item.countTime[3]}}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <span class="goods-price-unit" :style="{color: componentData.style.seckillcolor}">¥</span>
                                        <span class="goods-price-num"  :style="{color: componentData.style.seckillcolor}">{{item|getSeckillPrice|formatMoney}}</span>
                                        <span v-if="componentData.params.showprice=='1' && item.productprice>0"  class="orginal-price"  :class="$isPC?'scale':''"  :style="{color: componentData.style.pricecolor}">¥{{item.productprice|formatMoney}}</span>
                                    </div>
                                </div>

                                <div class="sale-info"  :class="{
                                    'flex-end': componentData.params.showsales=='0'
                                }">
                                    <span class="sale-num" v-if="componentData.params.showsales=='1'"  :style="{color: componentData.style.salescolor}">{{componentData.params.salestext|| '销量'}}:{{item.sales}}</span>
                                    <div class="buy-btn" :style="{
                                        color: componentData.style.btntextcolor,
                                        background: componentData.style.btncolor
                                    }" v-if="componentData.params.showbtn=='1'">{{componentData.params.btntext}}</div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <div class="more-btn  van-hairline--top"  v-if="componentData.params.showmore==1" :style="{color: componentData.style.morecolor}" @click="goDetail">查看更多</div>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'

    let throttleImgLoad = null;
    export default {
        mixins: [mixin],
        name: 'seckill',
        data() {
            return {
                countTime: ['2','59','59','59'],
                preloading: true,
                loading: {},
                startText: '',
                timestamp: null,
                dateTimer: null
            }
        },
        computed: {
            titleImgWidth() {
                if (this.$utils.getImgInfo && this.titleImage) {
                    return this.px2rpx(this.componentData.params?.titleimgwidth || 60)
                } else {
                    return 'auto'
                }
            },
            titleIconFontSize() {
                if (this.componentData.style.titlesize) {
                    return this.px2rpx(parseInt(this.componentData.style.titlesize) + 8)
                }
                return this.px2rpx(48)
            },
            titleImage() {
                if (this.componentData?.params?.titleimg) {
                    return this.componentData.params.titleimg;
                } else {
                    return ''
                }
            },
            getBg(){
                if(this.componentData.style.listtype =='list') return '';
                switch (this.componentData.params.bgstyle) {
                    case 'color':
                        return this.componentData.style.bgcolor
                    case 'img':
                        return `url(${this.componentData.params.bgimg?this.$utils.mediaUrl(this.componentData.params.bgimg): this.$utils.staticMediaUrl("decorate/seckill/bg.png")})`
                    default:
                        return ''
                }
            },
            getTitlebg(){
                switch (this.componentData.params.titlebg) {
                    case 'color':
                        return this.componentData.style.titlebgcolor
                    case 'img':
                        return `url(${this.componentData.params.titlebgimg?this.$utils.mediaUrl(this.componentData.params.titlebgimg):this.$utils.staticMediaUrl("decorate/seckill/title_bg.png")})`
                    default:
                        return ''
                }
            },
            limitNumData(){
                if (this.componentData.data instanceof Array && this.componentData.data?.length > 0) {
                    let arr =  this.componentData.data.slice(0, this.componentData.params.goodsnum)
                    return arr.map(item => {
                        if (this.localStorage) {
                            let src = item.thumb ? item.thumb.replace(/\./g, '_') : this.$utils.staticMediaUrl('decorate/goods_col2.png')
                            item.preloading = this.loading[src] === undefined || this.loading[src];
                        } else {
                            item.preloading = false;
                        }
                        this.$isPC?item.countTime= ['2','59','59','59']:'';
                        return item
                    })
                } else if (this.componentData.data?.length === 0) {
                    return this.$isPC?this.exampleGoods:[]
                }
                return [];
            },
            exampleGoods() {
                let thumb= this.$utils.staticMediaUrl('decorate/goods_col2.png')
                return new Array(2).fill({
                    thumb,
                    price: '20.00',
                    productprice: '99.00',
                    title: '这里是商品标题',
                    sub_name: '这里是商品副标题',
                    sales: '0',
                    gid: '',
                    credit: 0,
                    ctype: 1,
                    countTime: ['2','59','59','59'],
                    seckillData: {goods_info:[{activity_price:'66.00'}]}
                })
            },
            getLoadingSrc() {
                if (this.$store.state.setting.systemSetting?.basic?.loading) {
                    return this.$store.state.setting.cacheLoadingImg || this.$utils.mediaUrl(this.$store.state.setting.systemSetting?.basic?.loading)
                } else {
                    return this.$utils.staticMediaUrl('decorate/goods_col2.png')
                }
            },
        },
        watch: {
            'componentData.params':{
                handler(){
                    if (!this.$isPC) {
                        this.getNowDate();
                        this.componentData.data.forEach(item => {
                            item.countTime = ['2','59','59','59'];
                            this.cutdownTime(item.seckillData, item)
                        })
                    }
                },
                immediate: true
            }
        },
        mounted() {
            setTimeout(() => {
                this.preloading = false; //强行终止图片加载效果
            }, 3000)
        },
        methods: {
            getFormatDate(time){
                if(!time) return;
                return  Date.parse(time.replace(/-/g, "/"))
            },
            getNowDate(){
                this.timestamp = Date.now();
                clearTimeout(this.dateTimer)
                this.dateTimer= setInterval(() => {
                    this.timestamp = Date.now()
                }, 1000);

                this.$once('hook:beforeDestroy',()=> {
                    clearInterval(this.dateTimer)
                })
            },
            cutdownTime(activeInfo, item){
                let {start_time,end_time} = activeInfo ||{};
                let endTime;

                if(this.isPreheat(activeInfo)) {
                    endTime = start_time
                }

                // 判断活动有没有开始
                if(this.isStart(activeInfo)) {
                    endTime = end_time
                }
                if(this.isFinish(activeInfo)){
                    return
                }

                let formatTime = this.getFormatDate(endTime)
                let time = formatTime/1000;
                this.startCount(time, item)
            },
            isPreheat(activeInfo) {
                let {is_preheat,start_time} = activeInfo || {}
                return is_preheat =='1' && this.getFormatDate(start_time) > this.timestamp
            },
            isStart(activeInfo){
                let {start_time} = activeInfo || {}
                return this.getFormatDate(start_time) <= this.timestamp
            },
            // 判断活动是否结束
            isFinish(activeInfo){
                let {end_time} = activeInfo || {}
                if(!end_time) return ''
                return this.getFormatDate(end_time) <= this.timestamp
            },
            startCount(time, item){
                item.countTime = this.$utils.countDown(time, false,true);
                let timer = setInterval(()=>{
                    item.countTime = this.$utils.countDown(time, false,true);
                    if(item.countTime === false) {
                        clearInterval(timer)
                        this.cutdownTime()
                    }
                },1000)

                this.$once('hook:beforeDestroy',()=> {
                    clearInterval(timer)
                })
            },
            loaded(url) {
                if (url) {
                    let src = url.replace(/\./g, '_');
                    this.loading[src] = false;
                    clearTimeout(throttleImgLoad)
                    throttleImgLoad = setTimeout(() => {
                        this.loading = {
                            ...this.loading
                        }
                    }, 100)
                }
            },
            clickGood(item, index) {
                this.$emit('custom-event', {
                    target: 'seckill/clickGood',
                    data: {
                        value: item,
                        key: index
                    }
                })
            },
            goDetail(){
                let data = {};
                if (!(this.componentData?.params?.activityGoodsType === '0')) {
                    data.id = this.componentData?.params?.activityData?.id
                    data.type = 'activity'
                } else {
                    data.goodsID = this.componentData.data.map(item => item.id).join()
                    data.type = 'goods'
                }
                this.$emit('custom-event', {
                    target: 'seckill/clickMore',
                    data
                })
            },
        },
        filters: {
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
            getSeckillPrice(item){
                if(item.has_option=='1') {
                    let min_price = item.seckillData?.price_range?.min_price ||0
                    return `${parseFloat(min_price)}`
                } else {
                    return parseFloat(item?.seckillData?.activity_price || 0)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .seckill {
        -webkit-overflow-scrolling: touch;
        .content {
            overflow: hidden;
            background-size: cover!important;
            background: #ffffff;

            .activity-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: px2rpx(6) px2rpx(12);
                .left {
                    display: flex;
                    align-items: center;
                    flex: 1;
                    .activity-name {
                        color: #ffffff;
                        max-height: px2rpx(24);
                        display: flex;
                        align-items: center;
                        i {
                            font-size: px2rpx(24);
                            line-height: px2rpx(20);
                            width: px2rpx(20);
                            height: px2rpx(20);
                        }
                        .name {
                            font-size: px2rpx(16);
                            line-height: px2rpx(24);
                            font-weight: bold;
                            padding-left: px2rpx(4);
                        }
                    }
                    .title-img {
                        max-width: px2rpx(120);
                        // #ifndef H5
                        height: px2rpx(28);
                        min-width: px2rpx(28);
                        width: 100%;
                        // #endif
                        // #ifdef H5
                        max-height: px2rpx(28);
                        // #endif
                    }
                    .title-img-pc {
                        flex-shrink: 0;
                        max-height: px2rpx(28);
                        max-width: px2rpx(120);
                    }
                    .activity-time {
                        display: flex;
                        align-items: center;
                        height: px2rpx(16);
                        color: #fff;
                        .text {
                            font-size: px2rpx(12);
                            line-height: px2rpx(16);
                            padding: 0 px2rpx(4) 0 px2rpx(8);
                            //display: inline-block;
                        }
                        .day {
                            font-size: px2rpx(12);
                            line-height: px2rpx(16);
                            padding-right: px2rpx(2);
                            //display: inline-block;
                        }
                        .time {
                            padding: 0 px2rpx(1);
                            // width: px2rpx(16);
                            height: px2rpx(16);
                            line-height: px2rpx(16);
                            text-align: center;
                            background-color: #fff;
                            color: #ff6f29;
                            font-size: px2rpx(12);
                            border-radius: px2rpx(2);

                            //padding: 0 px2rpx(2);
                            //font-size: px2rpx(12);
                            //line-height: px2rpx(16);
                            //height: px2rpx(16);
                            //width: px2rpx(16);
                            //background-color: #ff6f29;
                            //border-radius: px2rpx(2);
                            //display: inline-block;
                            //margin: px2rpx(4) 0;
                        }
                        .colon {
                            padding: 0 px2rpx(2);
                            font-size: px2rpx(14);
                            display: inline-block;
                        }
                    }
                }
                .more-btn {
                    font-size: px2rpx(12);
                    line-height: px2rpx(17);
                    display: flex;
                    color: #ffffff;
                    .i {
                        font-size: px2rpx(16);
                        vertical-align: middle;
                    }
                    span {
                        line-height: px2rpx(17);
                    }
                }
            }

            // 滑动

            .scroll-box {
                padding: px2rpx(8) 0 px2rpx(8);
                .goods-list {
                    display: flex;
                    flex-wrap: nowrap;
                    overflow-x: auto;
                    &::-webkit-scrollbar{
                        display: none;
                    }
                    &-box {
                        padding-right: px2rpx(8);

                        .goods-list-info {
                            overflow: hidden;
                            display: flex;
                            flex-direction: column;
                            border-radius: px2rpx(6);
                            width: px2rpx(120);
                            background: #fff;
                            height: 100%;

                            .goods-img-box,.goods-img,.goods-img.preload {
                                width: px2rpx(120);
                                height: px2rpx(120);
                                border-radius: px2rpx(6);
                            }
                            .goods-img-box {
                                position: relative;
                                overflow: hidden;

                                .goods-img {
                                    display: block;
                                }
                            }

                            .goods-footer {
                                display: flex;
                                flex-direction: column;
                                flex: 1;
                                padding: px2rpx(8) px2rpx(4);
                            }

                            .goods-title {
                                flex: 1;
                                max-height: px2rpx(40);
                            }
                            .activity-time {
                                margin-top: px2rpx(4);
                                padding: 0 px2rpx(3);
                                line-height: px2rpx(14);
                                font-size: px2rpx(12);
                                border: 1px solid transparent;
                                border-radius: px2rpx(2);
                                margin-right: px2rpx(10);
                            }

                            .goods-price-info {
                                display: flex;
                                align-items: center;
                                .goods-seckill-tag {
                                    display: inline-block;
                                    margin-right: px2rpx(4);
                                    border-radius: px2rpx(2);
                                    padding: px2rpx(1) px2rpx(1);
                                    min-width: px2rpx(24);
                                    font-size: px2rpx(8);
                                    font-weight: bold;
                                    text-align: center;
                                    line-height: px2rpx(12);
                                    color: #fff;
                                    background: linear-gradient(132.57deg, #FF3C29 0%, #FF6F29 94.38%);


                                    &.scale {
                                        -webkit-transform: scale(0.8);
                                        -webkit-transform-origin: left center;
                                    }
                                }


                            }

                            .goods-sale-info {
                                margin-top: px2rpx(4);
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                font-size: px2rpx(10);
                                line-height: px2rpx(14);
                                color: #969696;

                                .orginal-price {
                                    text-decoration: line-through;
                                }


                            }

                        }

                        &:first-child {
                            padding-left: px2rpx(12);
                        }

                        &:last-child {
                            padding-right: px2rpx(12);
                        }
                    }

                    .more-btn {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        padding-right: px2rpx(12);

                        .more-text {
                            width: px2rpx(14);
                            font-size: px2rpx(11);
                            text-align: center;
                            line-height: px2rpx(13);
                            color: #969696;
                        }

                        .more-icon {
                            margin-top: px2rpx(4    );
                            font-size: px2rpx(14);
                            width: px2rpx(14);
                            height: px2rpx(14);
                            line-height: px2rpx(14);
                            color: #969696;
                        }
                    }
                }
            }

            .goods-price-unit {
                font-size: px2rpx(12);
                line-height: px2rpx(16);
                color: #ff3c29;
            }

            .goods-price-num {
                font-size: px2rpx(14);
                font-weight: bold;
                color: #ff3c29;
            }

            .goods-title {
                font-size: px2rpx(14);
                line-height: px2rpx(20);
                color: #212121;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
            }

            .badge-box {
                position: absolute;
                left: 0;
                top: 0;
                z-index: 9;
                display: flex;
                align-items: center;
                border-radius: px2rpx(2);
                padding: px2rpx(1) px2rpx(2);
                min-width: px2rpx(36);
                background: #ff3c29;
                color:  #fff;

                &.scale {
                    -webkit-transform: scale(0.8);
                    -webkit-transform-origin: left top;
                }

                .badge-icon {
                    font-size: px2rpx(8);
                }

                .badge-text {
                    flex: 1;
                    text-align: center;
                    font-weight: bold;
                    font-size: px2rpx(9);
                    line-height: px2rpx(12);
                }
            }

            .flex-end {
                justify-content: flex-end!important;
            }


            // 列表

            .list-box {

                li:last-of-type {
                    .right-box {
                        &.van-hairline--bottom:after {
                            border-width: 0;
                        }
                    }
                }

                .goods-list-box {
                    display: flex;
                    padding: px2rpx(8) px2rpx(12) 0;

                    .left, .goods-img {
                        width: px2rpx(120);
                        height: px2rpx(120);
                        border-radius: px2rpx(6);
                    }

                    .left {
                        position: relative;
                        height: px2rpx(128);
                        padding-bottom: px2rpx(8);
                    }

                    .right {
                        overflow: hidden;
                        flex: 1;
                        padding: px2rpx(4) px2rpx(12) 0;

                        &-box {
                            display: flex;
                            flex-direction: column;
                            height: 100%;
                            padding-bottom: px2rpx(10);
                            &.van-hairline--bottom:after {
                                border-bottom-color: $uni-border-color;
                                border-style: solid;
                            }

                            .goods-subtitle {
                                margin-top: px2rpx(4);
                                font-size: px2rpx(12);
                                line-height: px2rpx(16);
                                color: #969696;
                            }

                            .goods-price-info {
                                flex: 1;
                                margin-top: px2rpx(4);

                                .goods-price-box {
                                    display: flex;
                                    align-items: center;
                                }

                                .activity-time {
                                    width: fit-content;
                                    margin-top: px2rpx(4);
                                    padding: 0 px2rpx(3);
                                    line-height: px2rpx(14);
                                    font-size: px2rpx(10);
                                    border: 1px solid transparent;
                                    border-radius: px2rpx(2);
                                }

                                .goods-seckill-tag {
                                    margin-right: px2rpx(4);
                                    border: 1px solid #ff3c29;
                                    border-radius: px2rpx(2);
                                    padding: 0 px2rpx(4);
                                    min-width: px2rpx(30);
                                    font-size: px2rpx(10);
                                    text-align: center;
                                    line-height: px2rpx(14);
                                    color: #FF3C29;
                                    background: #fff;
                                }
                            }

                            .sale-num,.orginal-price {
                                font-size: px2rpx(10);
                                line-height: px2rpx(14);
                                color: #969696;
                            }

                            .orginal-price {
                                margin-left: px2rpx(4);
                                text-decoration: line-through;

                                &.scale {
                                    -webkit-transform: scale(0.8);
                                    -webkit-transform-origin-x: left;
                                }
                            }

                            .sale-info {
                                height: px2rpx(27);
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            }

                            .buy-btn {
                                min-width: px2rpx(66);
                                padding: px2rpx(0) px2rpx(14);
                                border-radius: px2rpx(24);
                                font-weight: 600;
                                font-size: px2rpx(12);
                                height: px2rpx(27);
                                line-height: px2rpx(27);
                                text-align: center;
                                color: #fff;
                                background: linear-gradient(132.57deg, #FF3C29 0%, #FF6F29 94.38%);
                            }
                        }

                    }

                }

                .more-btn {
                    height: px2rpx(48);
                    line-height: px2rpx(48);
                    text-align: center;
                    font-size: px2rpx(12);
                    color: #969696;

                    &.van-hairline--top:after {
                        border-top-color: $uni-border-color;
                        border-style: solid;
                    }
                }
            }
        }
    }
</style>