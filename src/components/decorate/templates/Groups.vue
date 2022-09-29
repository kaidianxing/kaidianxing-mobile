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
    <div class="spell-group" v-if="componentData&&componentData.id=='groups'&&limitNumData.length>0" :style="{padding:`${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`}">
        <div class="spell-group-content" :style="{
             borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`,
             background: getContentBackground}">
            <div class="activity-header" v-if="componentData.params.showacttitle == 1" :style="{background: getHeaderBackground}">
                <div class="left">
                    <div class="activity-name" v-if="componentData.params.titletype === 'texticon'">
                        <div>
                            <i :class="componentData.params.titleicon" :style="{color: componentData.style.titleiconcolor, fontSize: titleIconFontSize}"></i>
                        </div>
                        <div>
                            <span class="name"
                                  :style="{fontSize: `${px2rpx(componentData.style.titlesize)}`, fontWeight: componentData.params.titleweight, color: componentData.style.titlecolor}"
                            >{{ componentData.params.titlename }}</span>
                        </div>
                    </div>
                    <img mode='aspectFit' lazy-load :src="$utils.mediaUrl(titleImage)" alt="" :class="[$isPC ? 'title-img-pc' : 'title-img']"
                         @load='loaded(titleImage)' @error='loaded(titleImage)' v-else-if="componentData.params.titletype === 'img'" :style="{width: titleImgWidth}"
                    />
                    <div class="activity-time" v-if="componentData.params.activityGoodsType == 1">
                        <span class="text" :style="{color: componentData.style.textcolor}">{{isStart(componentData.params.activeInfo)?'距结束':'距开始'}}</span>
                        <span class="day" :style="{color: componentData.style.textcolor}">{{countTime[0]}}天</span>
                        <span class="time" :style="{color: componentData.style.numcolor, backgroundColor: componentData.style.countbgcolor}">{{countTime[1]}}</span>
                        <span class="colon" :style="{color: componentData.style.textcolor}">:</span>
                        <span class="time" :style="{color: componentData.style.numcolor, backgroundColor: componentData.style.countbgcolor}">{{countTime[2]}}</span>
                        <span class="colon" :style="{color: componentData.style.textcolor}">:</span>
                        <span class="time" :style="{color: componentData.style.numcolor, backgroundColor: componentData.style.countbgcolor}">{{countTime[3]}}</span>
                    </div>
                </div>
                <div class="more-btn" :style="{color: componentData.style.morecolor}" @click="goDetail" v-if="isShowMore">
                    <span>查看更多</span>
                    <i class="iconfont-m- icon-m-right  more-icon"></i>
                </div>
            </div>
            <!--滚动-->
            <div class="goods-scroll" v-if="componentData.params.listtype === 'scroll'">
                <ul>
                    <li v-for="(item, index) in limitNumData" :key="index" @click="clickGood(item,index)" :style="{background: componentData.style.goodsbgcolor}">
                        <div class="image-box">
                            <img mode='widthFix' lazy-load :src="getLoadingSrc" alt="" class='goods-img preload'
                                 v-if='item.preloading&&preloading'/>
                            <img mode='widthFix' lazy-load :src="$utils.mediaUrl(item.thumb)" alt="" class='goods-img'
                                 @load='loaded(item.thumb)' @error='loaded(item.thumb)'
                                 :class='{loading:item.preloading&&preloading}' v-if='startLoadImg'/>
                            <div class="badge-box" :class="{'pc-scale': $isPC}" v-if="componentData.params.showbadge == 1" :style="{background: badgeBackground}">
                                <i :class="componentData.params.badgeicon" :style="{color: componentData.style.badgeiconcolor}"></i>
                                <span class="name" :style="{color: componentData.style.badgetextcolor}">{{ componentData.params.badgetext }}</span>
                            </div>
                        </div>
                        <div class="goods-content">
                            <div class="goods-title omit-2" :style="{color: componentData.style.goodscolor}">
                                <span class="group-label" :class="{'pc-scale': $isPC}" v-if="componentData.params.showsales == 0">
                                    {{item | getGroupsNum}}
                                </span>
                                <span>{{ item.title }}</span>
                            </div>
                            <div class="activity-time"  v-if="componentData.params.activityGoodsType == 0" :style="{backgroundColor: componentData.style.countbgcolor, borderColor: componentData.style.numcolor}">
                                <div style="transform: scale(0.8);width: 125px;margin-left: -12px;font-size: 12px;">
                                    <span class="text" :style="{color: componentData.style.textcolor}">{{isStart(item.groupsData)?'距结束':'距开始'}}</span>
                                    <span class="day" :style="{color: componentData.style.textcolor}">{{item.countTime[0]}}天</span>
                                    <span class="time" :style="{color: componentData.style.numcolor, backgroundColor: componentData.style.countbgcolor}">{{item.countTime[1]}}</span>
                                    <span class="colon" :style="{color: componentData.style.textcolor}">:</span>
                                    <span class="time" :style="{color: componentData.style.numcolor, backgroundColor: componentData.style.countbgcolor}">{{item.countTime[2]}}</span>
                                    <span class="colon" :style="{color: componentData.style.textcolor}">:</span>
                                    <span class="time" :style="{color: componentData.style.numcolor, backgroundColor: componentData.style.countbgcolor}">{{item.countTime[3]}}</span>
                                </div>
                            </div>
                            <div class="label-sales" :class="{'pc-scale': $isPC}" v-if="componentData.params.showsales == 1">
                                <span class="group-label">{{item | getGroupsNum}}</span>
                                <span class="sales">
                                    已拼{{ item.sales }}件
                                </span>
                            </div>
                            <div class="group-price" :style="{color: componentData.style.pricegroupcolor}">
                                <span class="name">{{ componentData.params.pricegrouptext }} </span>
                                <span class="price">
                                    <span class="unit">￥</span>{{item | getGroupsPrice|formatMoney}}
                                </span>
                            </div>
                            <div class="original-price" :style="{color: componentData.style.pricecolor}" v-if="componentData.params.showprice == 1">
                                <span class="name">{{ componentData.params.pricetext }} </span>
                                <span class="price">
                                    <span class="unit">￥</span>{{item | getOriginalPrice |formatMoney}}
                                </span>
                            </div>
                            <div class="buy-btn-long" :style="{background: buyBackground, color: componentData.style.btntextcolor}" v-if="componentData.params.showbtn == 1">
                                {{ componentData.params.btntext }}
                            </div>
                        </div>
                    </li>
                    <li></li>
                </ul>
            </div>
            <!--双行-->
            <div class="goods-block-two" v-else-if="componentData.params.listtype === 'blocktwo'">
                <ul>
                    <li v-for="(item, index) in limitNumData" :key="index" @click="clickGood(item,index)">
                        <div class="li-box" :style="{background: componentData.style.goodsbgcolor}">
                            <div class="image-box">
                                <img mode='widthFix' lazy-load :src="getLoadingSrc" alt="" class='goods-img preload'
                                     v-if='item.preloading&&preloading'/>
                                <img mode='widthFix' lazy-load :src="$utils.mediaUrl(item.thumb)" alt="" class='goods-img'
                                     @load='loaded(item.thumb)' @error='loaded(item.thumb)'
                                     :class='{loading:item.preloading&&preloading}' v-if='startLoadImg'/>
                                <div class="badge-box" :class="{'pc-scale': $isPC}" v-if="componentData.params.showbadge == 1" :style="{background: badgeBackground}">
                                    <i :class="componentData.params.badgeicon" :style="{color: componentData.style.badgeiconcolor}"></i>
                                    <span class="name" :style="{color: componentData.style.badgetextcolor}">{{ componentData.params.badgetext }}</span>
                                </div>
                            </div>
                            <div class="goods-content">
                                <div class="goods-title omit-2" :style="{color: componentData.style.goodscolor}">
                                <span class="group-label" :class="{'pc-scale': $isPC}" v-if="componentData.params.showsales == 0">
                                    {{item | getGroupsNum}}
                                </span>
                                    {{ item.title }}
                                </div>
                                <div class="activity-time"  v-if="componentData.params.activityGoodsType == 0" :style="{backgroundColor: componentData.style.countbgcolor, borderColor: componentData.style.numcolor}">
                                    <span class="text" :style="{color: componentData.style.textcolor}">{{isStart(item.groupsData)?'距结束':'距开始'}}</span>
                                    <span class="day" :style="{color: componentData.style.textcolor}">{{item.countTime[0]}}天</span>
                                    <span class="time" :style="{color: componentData.style.numcolor, backgroundColor: componentData.style.countbgcolor}">{{item.countTime[1]}}</span>
                                    <span class="colon" :style="{color: componentData.style.textcolor}">:</span>
                                    <span class="time" :style="{color: componentData.style.numcolor, backgroundColor: componentData.style.countbgcolor}">{{item.countTime[2]}}</span>
                                    <span class="colon" :style="{color: componentData.style.textcolor}">:</span>
                                    <span class="time" :style="{color: componentData.style.numcolor, backgroundColor: componentData.style.countbgcolor}">{{item.countTime[3]}}</span>
                                </div>
                                <div class="label-sales" :class="{'pc-scale': $isPC}" v-if="componentData.params.showsales == 1">
                                    <span class="group-label">{{item | getGroupsNum}}</span>
                                    <span class="sales">
                                    已拼{{ item.sales }}件
                                </span>
                                </div>
                                <div class="goods-price-box">
                                    <div class="goods-price">
                                        <div class="group-price" :style="{color: componentData.style.pricegroupcolor}">
                                            <span class="name">{{ componentData.params.pricegrouptext }} </span>
                                            <span class="price">
                                    <span class="unit">￥</span>{{item | getGroupsPrice|formatMoney}}
                                </span>
                                        </div>
                                        <div class="original-price" :style="{color: componentData.style.pricecolor}" v-if="componentData.params.showprice == 1">
                                            <span class="name">{{ componentData.params.pricetext }} </span>
                                            <span class="price">
                                    <span class="unit">￥</span>{{item | getOriginalPrice |formatMoney}}
                                </span>
                                        </div>
                                    </div>
                                    <div class="single-buy-btn" v-if="componentData.params.showbtn == 1 && componentData.params.btnstyle == '1'" :style="{background: buyBackground}">
                                        <span class="iconfont-m- icon-m-pintuan1"></span>
                                    </div>
                                </div>
                                <div class="buy-btn-long" v-if="componentData.params.showbtn == 1 && componentData.params.btnstyle == '0'" :style="{background: buyBackground, color: componentData.style.btntextcolor}">
                                    {{ componentData.params.btntext }}
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <!--单列表-->
            <div class="goods-block-one" v-else-if="componentData.params.listtype === 'list'">
                <ul>
                    <li v-for="(item, index) in limitNumData" :key="index" @click="clickGood(item,index)">
                        <div class="image-box">
                            <img mode='widthFix' lazy-load :src="getLoadingSrc" alt="" class='goods-img preload'
                                 v-if='item.preloading&&preloading'/>
                            <img mode='widthFix' lazy-load :src="$utils.mediaUrl(item.thumb)" alt="" class='goods-img'
                                 @load='loaded(item.thumb)' @error='loaded(item.thumb)'
                                 :class='{loading:item.preloading&&preloading}' v-if='startLoadImg'/>
                            <div class="badge-box" :class="{'pc-scale': $isPC}" v-if="componentData.params.showbadge == 1" :style="{background: badgeBackground}">
                                <i :class="componentData.params.badgeicon" :style="{color: componentData.style.badgeiconcolor}"></i>
                                <span class="name" :style="{color: componentData.style.badgetextcolor}">{{ componentData.params.badgetext }}</span>
                            </div>
                        </div>
                        <div class="goods-content">
                            <div>
                                <div class="goods-title" :class="[item.sub_title? 'omit-1': 'omit-2']" :style="{color: componentData.style.goodscolor}">
                                <span class="group-label" :class="{'pc-scale': $isPC}" v-if="componentData.params.showsales == 0">
                                    {{item | getGroupsNum}}</span>
                                    {{item.title}}
                                </div>
                                <div class="goods-sub-title line-hide" v-if="item.sub_title" :style="{color: componentData.style.subtitlecolor}">
                                    {{ item.sub_name }}
                                </div>
                                <div class="activity-time"  v-if="componentData.params.activityGoodsType == 0" :style="{backgroundColor: componentData.style.countbgcolor, borderColor: componentData.style.numcolor}">
                                    <span class="text" :style="{color: componentData.style.textcolor}">{{isStart(item.groupsData)?'距结束':'距开始'}}</span>
                                    <span class="day" :style="{color: componentData.style.textcolor}">{{item.countTime[0]}}天</span>
                                    <span class="time" :style="{color: componentData.style.numcolor, backgroundColor: componentData.style.countbgcolor}">{{item.countTime[1]}}</span>
                                    <span class="colon" :style="{color: componentData.style.textcolor}">:</span>
                                    <span class="time" :style="{color: componentData.style.numcolor, backgroundColor: componentData.style.countbgcolor}">{{item.countTime[2]}}</span>
                                    <span class="colon" :style="{color: componentData.style.textcolor}">:</span>
                                    <span class="time" :style="{color: componentData.style.numcolor, backgroundColor: componentData.style.countbgcolor}">{{item.countTime[3]}}</span>
                                </div>
                                <div class="label-sales" :class="{'pc-scale': $isPC}" v-if="componentData.params.showsales == 1">
                                    <span class="group-label">{{item | getGroupsNum}}</span>
                                    <span class="sales">
                                    已拼{{ item.sales }}件
                                </span>
                                </div>
                            </div>
                            <div class="goods-price-box">
                                <div class="goods-price">
                                    <div class="group-price" :style="{color: componentData.style.pricegroupcolor}">
                                        <span class="name">{{ componentData.params.pricegrouptext }} </span>
                                        <span class="price">
                                            <span class="unit">￥</span>{{item | getGroupsPrice|formatMoney}}
                                        </span>
                                    </div>
                                    <div class="original-price" :style="{color: componentData.style.pricecolor}" v-if="componentData.params.showprice == 1">
                                        <span class="name">{{ componentData.params.pricetext }} </span>
                                        <span class="price">
                                    <span class="unit">￥</span>{{ item.productprice | formatMoney }}
                                </span>
                                    </div>
                                </div>
                                <div class="buy-btn" v-if="componentData.params.showbtn == 1 && componentData.params.btnstyle == '0'" :style="{background: buyBackground, color: componentData.style.btntextcolor}">
                                    {{ componentData.params.btntext }}
                                </div>
                                <div class="single-buy-btn" v-else-if="componentData.params.showbtn == 1 && componentData.params.btnstyle == '1'" :style="{backgroun: buyBackground}">
                                    <span class="iconfont-m- icon-m-pintuan1"></span>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin'

    let throttleImgLoad = null;
    export default {
        name: 'Groups',
        mixins: [mixin],
        data() {
            return {
                countTime: ['1', '23', '23', '23'],
                preloading: true,
                loading: {},
                startText: '',
                timestamp: null,
                dateTimer: null,
            };
        },
        computed: {
            limitNumData(){
                if (this.$utils.isArray(this.componentData.data) && this.componentData.data?.length > 0) {
                    let arr =  this.componentData.data.slice(0, this.componentData.params.goodsnum)
                    return arr.map(item => {
                        if (this.localStorage) {
                            let src = item.thumb ? item.thumb.replace(/\./g, '_') : this.$utils.staticMediaUrl('decorate/goods_col2.png')
                            item.preloading = this.loading[src] === undefined || this.loading[src];
                        } else {
                            item.preloading = false;
                        }
                        this.$isPC?item.countTime= ['1','23','23','23']:'';
                        return item
                    })
                } else if (this.componentData.data?.length === 0) {
                    return this.$isPC?this.exampleGoods:[]
                }
                return [];
            },
            exampleGoods() {
                let thumb= this.$utils.staticMediaUrl('decorate/goods_col2.png')
                return new Array(3).fill({
                    thumb,
                    price: '20.00',
                    productprice: '99.00',
                    title: '这里是商品标题',
                    sub_name: '这里是商品副标题',
                    sales: '0',
                    gid: '',
                    bargain: 0,
                    credit: 0,
                    ctype: 1,
                    countTime: ['1','23','23','23'],
                    groupsData: {
                        inner_type: '0',
                        goods_info:[{activity_price:'66.00'}],
                        rules: {
                            success_num: 3
                        }
                    }
                })
            },
            // 组件背景
            getContentBackground() {
                let bgStyle = this.componentData.params.bgstyle,
                    listType = this.componentData.params.listtype;
                if (listType !== 'list') {
                    if (bgStyle === 'color') {
                        return this.componentData.style.bgcolor;
                    }
                    if (listType === 'scroll' && bgStyle === 'img') {
                        return `url(${this.componentData.params.bgimg?this.$utils.mediaUrl(this.componentData.params.bgimg):this.$utils.staticMediaUrl("decorate/groups/bg.png")})`;
                    }
                }
                return '';
            },
            // 标题背景
            getHeaderBackground() {
                switch (this.componentData.params.titlebg) {
                    case 'color':
                        return this.componentData.style.titlebgcolor;
                    case 'img':
                        return `url(${this.componentData.params.titlebgimg?this.$utils.mediaUrl(this.componentData.params.titlebgimg):this.$utils.staticMediaUrl("decorate/groups/title_bg.png")})`;
                    default:
                        return ''
                }
            },
            getLoadingSrc() {
                if (this.$store.state.setting.systemSetting?.basic?.loading) {
                    return this.$store.state.setting.cacheLoadingImg || this.$utils.mediaUrl(this.$store.state.setting.systemSetting?.basic?.loading)
                } else {
                    return this.$utils.staticMediaUrl('decorate/goods_col2.png')
                }
            },
            isShowMore() {
                if (this.componentData?.params?.activitygoodscount && this.limitNumData?.length) {
                    if (this.componentData?.params?.activitygoodscount > this.limitNumData?.length) {
                        return true;
                    }
                }
                return false;
            },
            titleImage() {
                if (this.componentData?.params?.titleimg) {
                    return this.componentData.params.titleimg;
                } else {
                    return this.$utils.staticMediaUrl('decorate/groups/title_img.png')
                }
            },
            buyBackground() {
                if (this.componentData.style.btncolor === '#ff6f29' ) {
                    return 'linear-gradient(114.57deg, #FF8A00 19.05%, #FF4C14 87.67%)'
                }
                return this.componentData.style.btncolor;
            },
            badgeBackground() {
                if (this.componentData.style.badgebgcolor === '#ff6f29' ) {
                    return 'linear-gradient(114.57deg, #FF8A00 19.05%, #FF4C14 87.67%)'
                }
                return this.componentData.style.badgebgcolor;
            },
            titleIconFontSize() {
                if (this.componentData.style.titlesize) {
                    return this.px2rpx(parseInt(this.componentData.style.titlesize) + 8)
                }
                return this.px2rpx(48)
            },
            titleImgWidth() {
                if (this.$utils.getImgSize && this.titleImage) {
                    return this.px2rpx(this.componentData.params?.titleimgwidth || 60)
                } else {
                    return 'auto'
                }
            }
        },
        mounted() {
            setTimeout(() => {
                this.preloading = false; //强行终止图片加载效果
            }, 3000)
        },
        watch: {
            'componentData.params':{
                handler(){
                    if (!this.$isPC) {
                        // this.cutdownTime()
                        this.getNowDate()
                        if (!(this.componentData?.params?.activityGoodsType === '0')) {
                            console.log(this.componentData?.params)
                            this.cutdownTime(this.componentData?.params?.activityData, this)
                        } else {
                            this.componentData.data.forEach(item => {
                                item.countTime = ['1','23','23','23'];
                                this.cutdownTime(item.groupsData, item)
                            })
                        }
                    }
                },
                immediate: true
            },
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
                let {start_time} = activeInfo || {}
                return  this.getFormatDate(start_time) > this.timestamp
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
                    target: 'groups/clickGood',
                    data: {
                        value: item,
                        key: index
                    }
                })
            },
            goDetail(){
                let data = {};
                if (!(this.componentData?.params?.activityGoodsType === '0')) {
                    data.id = this.componentData?.params?.activityData?.id;
                    data.type = 'activity'
                } else {
                    data.goodsID = this.componentData.data.map(item => item.id).join()
                    data.type = 'goods'
                }
                this.$emit('custom-event', {
                    target: 'groups/clickMore',
                    data
                })
            },
        },
        filters: {
            formatMoney(money) {
                if (typeof money === 'number' || (typeof money === 'string' && money.trim() !== '')) {
                    if (money >= 10000) {
                        return parseInt(money/100)/100 + '万'
                    } else {
                        return parseFloat(money)
                    }
                } else {
                    return 0
                }
            },
            getGroupsPrice(item) {
                let groups = item.groupsData;
                if (groups?.inner_type == 1) {
                    let min_price = groups?.price_range?.min_price ||0
                    return `${parseFloat(min_price)}`
                } else { // 普通拼团
                    if (item.has_option == 0) {
                        return groups?.activity_price;
                    } else {
                        let min_price = groups?.price_range?.min_price ||0
                        return `${parseFloat(min_price)}`
                    }
                }
            },
            getOriginalPrice(item) {
                if (item?.has_option == 0) {
                    return item?.price;
                } else {
                    return item?.productprice;
                }
            },
            getGroupsNum(item) {
                let groups =  item?.groupsData;
                return `${groups?.rules?.success_num || 2}人团`;
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../templates-shim/groups.scss";
</style>
