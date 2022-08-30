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
    <div class='goods' :style="{
        padding: getPadding,
        background: getBg
    }" v-if='componentData&&componentData.id=="goods"&&limitNumData.length&& insideStyle.liststyle'>
        <ul class='goods-list' :class='getClass' :style="{
                'padding-bottom':  isScroll?px2rpx(insideStyle.marginbottom):'',
                borderRadius: insideStyle.liststyle=='list'?`${px2rpx(insideStyle.topradius)} ${px2rpx(insideStyle.topradius)} ${px2rpx(insideStyle.bottomradius )} ${px2rpx(insideStyle.bottomradius )}`: ''
            }">
            <li v-for='(item,index) in limitNumData' :key='index' class='good-box' :class="{
                    'scroll-box': isScroll
                }" :style="{
                    background:insideStyle.liststyle=='list'?insideStyle.background:'',
                }" @click='clickGood(item,index)'>
                <div class="good-box-item" :style='{
                  background:insideStyle.background,
                  borderRadius:hasItemRaidus?`${px2rpx(insideStyle.topradius)} ${px2rpx(insideStyle.topradius)} ${px2rpx(insideStyle.bottomradius )} ${px2rpx(insideStyle.bottomradius )}`: ""
                }'>
                    <!-- 商品图区 -->
                    <div class='img-box' v-if="insideStyle.liststyle">
                        <div class="good-img-box"
                             :class='{soldOut:showSoldOutIcon||(item.stock==0&&(insideParams.saleout == "0" ||insideParams.saleout == "1"))}'>
                            <!-- 系统角标 -->
                            <p class="marker system" :class='[insideStyle.iconstyle,insideStyle.goodsicon]'
                               v-if='insideParams.showicon==1'>
								<span class='bgImgSpan'><i class='bgImgPre bgIconI'></i><i class='bgImgAft bgIconI'
                                                                                           :style='getCornerIcon'></i></span>
                                <span class='name'>{{ getSycMarker }}</span>
                            </p>
                            <!-- 自定义角标 -->
                            <img mode='widthFix' lazy-load class="marker custom" :class='[insideParams.iconposition]'
                                 :style='{width:`${insideStyle.iconzoom}%`, margin:markerPosition}'
                                 :src="$utils.mediaUrl(insideParams.goodsiconsrc)" alt=""
                                 v-else-if='insideParams.showicon==2&&insideParams.goodsiconsrc&&startLoadImg'>
                            <!-- 商品图 -->
                            <!-- 预加载图 -->
                            <img mode='widthFix' lazy-load :src="getLoadingSrc" alt="" style="position: absolute;"
                                 class='good-img preload' v-if='item.preloading&&preloading||!startLoadImg'/>
                            <!-- 正式图 -->
                            <img  lazy-load :src="getThumb(item)" alt="" class='good-img' @load='loaded(item.thumb)' @error='loaded(item.thumb)' :class='{loading:item.preloading&&preloading}' v-if='startLoadImg'/>
                            <!-- 佣金 -->
                            <div class="commision-box" :class="{
                               'style2': insideParams.commisionstyle == '1'
                           }">
                                <p class="commision-bg" :style="{
                                    background: getCommissionBg.background,
                                    opacity: getCommissionBg.opacity
                                }" v-if="showCommission(item)"></p>
                                <p class="commision-money" v-if="showCommission(item) && (getListStyle > -1)"
                                   :style="{color: insideStyle.commissionColor}">￥{{ formatMoney(item.commission) }}
                                </p>
                                <p class="commision-money" v-if="showCommission(item) && (getListStyle ==-1)"
                                   :style="{color: insideStyle.commissionColor}">
                                    {{ insideParams.commisiontext || '预计佣金' }}￥{{ formatMoney(item.commission) }}
                                </p>
                            </div>
                            <!-- 售磬图标 -->
                            <div class="soldout default" v-if='showSoldOutIcon||item.stock==0'>
                                <div class="soldout-img" :style='soldOutBg' v-if='startLoadImg'></div>
                            </div>
                        </div>
                        <p class="title" v-if='insideStyle.liststyle!="list"' :style='{color:insideStyle.titlecolor}'>
                            {{ item.title }}
                        </p>
                    </div>
                    <!-- 普通模式 -->
                    <div class="box-bottom"
                         v-if='insideStyle.liststyle!="list" && !preloadingText'
                         @click.stop>
                        <div class="price">
							<span class='pro-price' v-if='insideParams.showprice==1'
                                  :style='{color:insideStyle.pricecolor}'><i
                                    v-if="getCredit(item)">{{ getCredit(item) }}+</i>￥<i>{{ getPrice(item) }}</i></span>
                            <span class='del-price' v-if='insideParams.showproductprice==1&&hasProductPrice(item)'
                                  :style='{color:insideStyle.productpricecolor}'>
								<i class='del-icon'
                                   v-if='insideParams.productpricetext'>{{ insideParams.productpricetext }}:</i>
								<i class='del-num'>￥{{ getDelPrice(item) }}</i>
							</span>
                        </div>
                        <div class="btn">
                            <!-- 购买按钮 -->
                            <span :class='[buyBtnIcon.class]' v-if="!is_active(item)" class='buybtn-icon'
                                  :style='buyBtnIcon.style' @click='clickBuyBtn(item,index)'></span>
                            <span class='sales-num' v-if='insideParams.showsales==1'
                                  :style='{color:insideStyle.salescolor}'>{{
                                    insideParams.salestext || '销量'
                                }}:{{ item.sales }}</span>
                        </div>
                    </div>
                    <!-- 列表模式 -->
                    <div class="right van-hairline--bottom"
                         v-else-if="insideStyle.liststyle=='list' && !preloadingText">
                        <div>
                            <p class="title" :style='{color:insideStyle.titlecolor}'>{{ item.title }}</p>
                            <p class="subtitle">{{ item.sub_name }}</p>
                        </div>
                        <div class='right-bottom' @click.stop>
                            <div class="price" :class="{
                                    'price-end': insideParams.showproductprice!==1&&!hasProductPrice(item)
                                }">
								<span class='pro-price' v-if='insideParams.showprice==1'
                                      :style='{color:insideStyle.pricecolor}'><i
                                        v-if="getCredit(item)">{{ getCredit(item) }}+</i>￥<i>{{
                                        getPrice(item)
                                    }}</i></span>
                                <span class='del-price' v-if='insideParams.showproductprice==1&&hasProductPrice(item)'
                                      :style='{color:insideStyle.productpricecolor}'>
									<i class="del-icon"
                                       v-if='insideParams.productpricetext'>{{ insideParams.productpricetext }}:</i>
									<i class="del-num">￥{{ getDelPrice(item) }}</i>
								</span>
                            </div>
                            <div class="btn" :class="{
                                    'btn-end': insideParams.showsales!=1
                                }">
                                <!-- 购买按钮 -->
                                <span :class='[buyBtnIcon.class]' :style='buyBtnIcon.style' v-if="!is_active(item)"
                                      @click='clickBuyBtn(item,index)'></span>
                                <span class='sales-num' v-if='insideParams.showsales==1'
                                      :style='{color:insideStyle.salescolor}'>{{
                                        insideParams.salestext || '销量'
                                    }}:{{ item.sales || 0 }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
            <!-- 这俩是用来占位防justify-content:space-around;不满行的错位 -->
            <!-- <li class='good-box ' style='height:0;margin-top:0;margin-bottom:0;min-height:0;padding-top:0;padding-bottom:0;border:none;' v-if='insideParams.goodsscroll=="0"'></li>
            <li class='good-box ' style='height:0;margin-top:0;margin-bottom:0;min-height:0;padding-top:0;padding-bottom:0;border:none;' v-if='insideParams.goodsscroll=="0"'></li> -->
        </ul>
    </div>
</template>

<script>
import mixin from './mixin.js'

let throttleImgLoad = null;
export default {
    mixins: [mixin],
    name: 'goods',
    data() {
        return {
            imgs: {},
            loading: {},
            preloading: true,
            preloadingText: true,
        }
    },
    mounted() {
        setTimeout(() => {
            this.preloading = false; //强行终止图片加载效果
        }, 500)
        this.preloadingText = false;
    },
    destroyed() {
        clearTimeout(throttleImgLoad)
    },
    computed: {
        credit_text() {
            if (this.$isPC) {
                return '积分'
            }
            return this.$store.state.setting.systemSetting?.credit_text || '积分'
        },
        insideParams() {
            return this.componentData.params || {}
        },
        insideStyle() {
            return this.componentData.style || {}
        },
        soldOutBg() {
            return `
                background-image:url(${this.getSoldOutIcon})
            `
        },
        hasItemRaidus() {
            let notRaidus = ['list'];
            return !notRaidus.includes(this.insideStyle.liststyle)
        },
        getGoodsList() {
            if (this.componentData.data?.length) { //真实商品
                let list = this.componentData.data
                return list
            }
            if (this.$isPC) {
                return this.componentData.tpl_data?.length ? this.componentData.tpl_data : []; //来自模板的商品
            }
            return []
        },
        exampleGoods() {
            if (!this.insideStyle.liststyle) return
            let thumb;
            if (this.insideStyle.liststyle.includes('one')) {
                thumb = this.$utils.staticMediaUrl('decorate/goods_col1.png')
            } else {
                thumb = this.$utils.staticMediaUrl('decorate/goods_col2.png')
            }
            let num = this.insideStyle.liststyle.includes('three') ? 3 : 2
            return new Array(num).fill({
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
                commission: 5
            })
        },
        systemSetting() {
            if (this.$store.state.setting?.systemSetting) {
                return this.$store.state.setting.systemSetting
            }
            return {}
        },
        getCornerIcon() {
            let bgimg = '';
            if (this.insideStyle.iconstyle == 'triangle') {
                bgimg = {
                    backgroundImage: `url(${this.$utils.staticMediaUrl('goods/1.png')})`
                }
            } else if (this.insideStyle.iconstyle == 'rectangle') {
                bgimg = {
                    backgroundImage: `url(${this.$utils.staticMediaUrl('goods/7.png')})`
                }
            }
            // #ifndef H5
            if (bgimg) {
                bgimg = `background-image:${bgimg.backgroundImage}`
            }
            // #endif
            return bgimg
        },
        getListStyle() {
            if (this.insideStyle.liststyle) {
                return this.insideStyle.liststyle.indexOf('three')
            } else {
                return -2
            }
        },
        getClass() {
            if (!this.insideStyle.liststyle) return 'inline'
            let liststyle = this.insideStyle.liststyle;
            if (liststyle == 'block') {
                liststyle = 'block two'
            }
            return this.insideParams.goodsscroll == 1 ? ("scroll " + liststyle.replace('block', ' ')) : liststyle
        },
        showSoldOutIcon() { //PC端用于显示售磬图标示例
            return false
            // return this.process ?.env ?.VUE_APP_platform == 'PC'&&this.insideParams.saleout!='-1'
        },
        getLoadingSrc() {
            if (this.$store.state.setting.systemSetting?.basic?.loading) {
                return this.$store.state.setting.cacheLoadingImg || this.$utils.mediaUrl(this.$store.state.setting
                        .systemSetting?.basic?.loading)
            } else {
                return this.$utils.staticMediaUrl('decorate/goods_col2.png')
            }
        },
        hasLimitGoods() {
            let {
                goodsdata,
                goodstype,
                creditgoodsdata
            } = this.insideParams
            return (goodstype == '0' && goodsdata != 0) || (goodstype == 1 && creditgoodsdata != 0)
        },
        limitNumData() {
            if (this.getGoodsList?.length > 0) {
                let arr = this.getGoodsList
                if (this.hasLimitGoods) {
                    arr = this.getGoodsList.slice(0, this.insideParams.goodsnum)
                }
                return arr.map(item => { //这里是图片预加载效果
                    if (this.localStorage) {
                        let src = item.thumb ? item.thumb.replace(/\./g, '_') : this.$utils.staticMediaUrl(
                                'decorate/goods_col2.png')
                        //默认 this.loading[src] === undefined = true  (第一次打开加载)
                        item.preloading = this.loading[src] === undefined || this.loading[src];
                    } else {
                        item.preloading = false;
                    }
                    return item
                })
            } else if (this.$isPC && this.componentData.data?.length === 0) {
                return this.exampleGoods
            }
            return [];
        },
        markerPosition() {
            if (!this.insideParams.iconposition) return
            let margin = {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            }
            if (this.insideParams.iconposition.indexOf('top') > -1) {
                margin.top = this.px2rpx(this.insideStyle.iconpaddingtop)
            } else if (this.insideParams.iconposition.indexOf('bottom') > -1) {
                margin.bottom = this.px2rpx(this.insideStyle.iconpaddingtop)
            }
            if (this.insideParams.iconposition.indexOf('left') > -1) {
                margin.left = this.px2rpx(this.insideStyle.iconpaddingleft)
            } else if (this.insideParams.iconposition.indexOf('right') > -1) {
                margin.right = this.px2rpx(this.insideStyle.iconpaddingleft)
            }
            return `${margin.top} ${margin.right} ${margin.bottom} ${margin.left}`
        },
        getSoldOutIcon() {
            if (this.systemSetting?.basic?.sale_out) {
                return this.$utils.mediaUrl(this.systemSetting?.basic?.sale_out)
            }
            return this.$utils.staticMediaUrl('decorate/sale_out.png')
        },
        getSycMarker() {
            switch (this.insideStyle.goodsicon) {
                case 'recommand':
                    return '推荐';
                case 'hotsale':
                    return '热销';
                case 'isnew':
                    return '上新';
                case 'sendfree':
                    return '包邮';
                case 'istime':
                    return '限时卖';
                case 'bigsale':
                    return '促销';
            }
            return this.insideParams.customicontext
        },
        buyBtnIcon() {
            let btn = {
                class: '',
                style: `color:${this.insideStyle.buybtncolor}`
            }
            switch (this.insideStyle.buystyle) {
                case 'buybtn-1':
                    btn.class = 'buybtn iconfont-m- icon-m-buy-jiagou2'
                    break;
                case 'buybtn-2':
                    btn.class = 'buybtn iconfont-m- icon-m-buy-jiagou1'
                    break;
                case 'buybtn-3':
                    btn.class = 'buybtn iconfont-m- icon-m-buy2'
                    break;
                case 'buybtn-4':
                    btn.class = 'buybtn iconfont-m- icon-m-buy3'
                    break;
                case 'buybtn-5':
                    btn.class = 'buybtn iconfont-m- icon-m-buy'
                    break;
                case 'buybtn-6':
                    btn.class = 'buybtn iconfont-m- icon-m-buy1'
                    break;
            }
            return btn
        },
        getPadding() {
            let {
                marginbottom,
                margintop,
                marginleft
            } = this.insideStyle
            return `${this.px2rpx(margintop)} ${this.px2rpx(marginleft)} ${this.px2rpx(marginbottom)}`

        },
        isScroll() {
            return this.insideParams.goodsscroll == 1
        },
        getBg() {
            switch (this.insideParams.componentbg) {
                case '1':
                    return this.insideStyle.bgcolor
                case '2':
                    return `url(${this.insideParams.bgimg ? this.$utils.mediaUrl(this.insideParams.bgimg) : ''})`
                default:
                    return ''
            }
        },
        getCommissionBg() { // 获取佣金背景样式
            let {
                commissionBackground: background,
                commisionopcaity: opacity
            } = this.insideStyle
            // 修正之前版本
            if (opacity == null) {
                opacity = 100
            }
            return {
                background,
                opacity: opacity / 100
            }
        },
    },
    methods: {
        is_active(item) {
            let actives = ['seckill']
            return item.activities && actives.some(key => item.activities[key])
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
                target: 'goods/clickGood',
                data: {
                    value: item,
                    key: index
                }
            })
        },
        clickBuyBtn(item, index) {
            if (!this.$isPC) {
                if (item.credit_good) {
                    /* 积分商品 点击加购按钮直接跳转商品详情 */
                    this.$emit('custom-event', {
                        target: 'goods/clickGood',
                        data: {
                            value: item,
                            key: index
                        }
                    });
                    return
                }
                if ((item.goodstype == '2' || item.type == '2') && !item?.plugin_account?.virtualAccount) {
                    //卡密权限适配
                    this.$toast('商品暂时无法购买')
                    return
                }
                this.$emit('custom-event', {
                    target: 'goods/clickBuyBtn',
                    data: {
                        value: item,
                        key: index
                    }
                })
            }
        },
        showCommission(item) {
            if (this.$isPC && this.insideParams.commisionstyle != '-1') {
                return true
            }
            return (
                    item.commission &&
                    parseFloat(item.commission) > 0 && this.insideParams.commisionstyle != '-1')
        },
        getThumb(row) {
            if (row.act_type == '1') {
                let suffix = ''
                if (this.insideStyle?.liststyle.indexOf('one') > -1) {
                    suffix = '_block'
                }
                let path = row.coupon_sale_type == '2' ? `creditShop/discount${suffix}.png` :
                        `creditShop/full${suffix}.png`
                return this.$utils.staticMediaUrl(path)
            }
            return this.$utils.mediaUrl(row.thumb)
        },
        getDelPrice(row) {
            if (row.act_type == '1') {
                let str1, str2;
                if (row.shop_coupon_credit) {
                    str1 = `${row.shop_coupon_credit}${this.credit_text}`
                }

                if (row.shop_coupon_credit) {
                    str2 = `￥${this.formatMoney(row.shop_coupon_balance)}`
                }

                if (str1 && str2) {
                    return str1 + str2
                }
                return ''

            }
            return this.formatMoney(row.productprice)
        },
        hasProductPrice(row) {
            if (row.act_type == '1') {
                if (row.shop_coupon_credit > 0 && row.shop_coupon_credit > 0) {
                    return true
                }
                return false

            }
            return row.productprice >= 0
        },
        getPrice(item) {
            if (typeof item.act_type === 'undefined') {
                return this.formatMoney(item.price)
            }
            return `${this.formatMoney(item.credit_shop_price)}`
        },
        getCredit(item) {
            if (item.act_type && item?.credit_shop_credit) {
                return `${item?.credit_shop_credit}${this.credit_text}`
            }
            return ''
        },
        formatMoney(money) {
            if (typeof money === 'number' || (typeof money === 'string' && money.trim() !== '')) {
                if (money >= 10000) {
                    return parseInt(money / 100) / 100 + '万'
                } else {
                    // return parseFloat(money)
                    return money // 修改bug-23650，积分商品显示00
                }
            } else {
                // return parseFloat(money)
                return money
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import './decorate.scss';
@import '../templates-shim/goods.scss';

.goods {
    width: 100%;
    overflow: auto;
    padding: px2rpx(8) px2rpx(12) 0;
    -webkit-overflow-scrolling: touch;
    background-size: cover !important;
}
.goods i {
    font-style: normal;
}
.goods .goods-list {
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    min-width: 100%;
    box-sizing: border-box;
    padding-left: 0;
}
.goods .goods-list .good-box {
    flex-shrink: 0;
    overflow: hidden;
}
.good-box.scroll-box:first-child {
    padding-left: 0;
}
.good-box-item {
    overflow: hidden;
}
.good-box .good-img {
    display: block;
    width: 100%;
}
.good-box .good-img.loading {
    display: block;
    height: 0;
    opacity: 0;
}
.good-img-box {
    position: relative;
    overflow: hidden;
}
.good-img-box.soldOut {
    position: relative;
}
.good-img-box.soldOut::after {
    position: absolute;
    content: "";
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.36);
}
.goods-list .good-box .img-box {
    overflow: hidden;
    position: relative;
}
.goods-list .good-box .img-box .marker {
    position: absolute;
    z-index: 100;
}
.goods-list .good-box .img-box .marker.system {
    left: 0;
    top: 0;
    color: #ffffff;
    font-size: rpx(24);
    text-align: center;
    display: flex;
    flex-direction: column;
    height: px2rpx(19);
    padding: 0 px2rpx(6);
}
.good-box .img-box .marker.system .icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.img-box .marker.system .bgImgSpan {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
}
.img-box .marker.system .bgImgSpan .bgImgAft {
    height: 100%;
}
.img-box .marker.system .name {
    position: relative;
    z-index: 10;
    display: block;
    font-size: px2rpx(12);
    line-height: px2rpx(12);
    height: px2rpx(12);
    margin: auto;
    white-space: nowrap;
    text-align: center;
}
.img-box .marker.system.circle .bgImgSpan {
    background: #367bf5;
    border-bottom-right-radius: px2rpx(9);
}
.img-box .marker.system.rectangle .bgImgSpan .bgImgPre {
    height: px2rpx(19);
    width: 0;
    flex: 1;
    background: #367bf5;
}
.img-box .marker.system.rectangle .bgImgSpan .bgImgAft {
    width: px2rpx(7);
    height: px2rpx(19);
    flex-shrink: 0;
    background-size: px2rpx(36) px2rpx(19);
    background-position: px2rpx(-29) 0;
    background-repeat: no-repeat;
}
.img-box .marker.system.triangle .bgImgSpan .bgImgPre {
    height: px2rpx(19);
    width: 0;
    flex: 1;
    background: #09c15f;
}
.img-box .marker.system.triangle .bgImgSpan .bgImgAft {
    width: px2rpx(7);
    height: px2rpx(19);
    flex-shrink: 0;
    background-size: px2rpx(36) px2rpx(19);
    background-position: px2rpx(-29) 0;
    background-repeat: no-repeat;
}
.img-box .marker.system.echelon {
    background: linear-gradient(to right, #ff7e24, #fcd10e);
    border-bottom-right-radius: px2rpx(10);
    border-top-right-radius: px2rpx(10);
    border-bottom-left-radius: px2rpx(2);
}
.img-box .marker.system.square {
    height: px2rpx(33);
}
.img-box .marker.system.square .name {
    padding-bottom: px2rpx(4);
}
.img-box .marker.system.square .bgImgSpan {
    background: #ff3c29;
    border-bottom-right-radius: px2rpx(17);
    border-bottom-left-radius: px2rpx(17);
    border-top-right-radius: px2rpx(2);
}
.img-box .marker.system.istime .name {
    padding-right: px2rpx(4);
}
.img-box .marker.system.bigsale .name {
    padding-right: px2rpx(4);
}
.img-box .marker.system.istime.square .name {
    padding-right: 0;
}
.img-box .marker.custom {
    position: absolute;
    z-index: 100;
    width: 100%;
}
.img-box .marker.custom.top {
    top: 0 !important;
}
.img-box .marker.custom.right {
    right: 0 !important;
}
.img-box .marker.custom.bottom {
    bottom: 0 !important;
}
.img-box .marker.custom.left {
    left: 0 !important;
}
.img-box .soldout,
.img-box .soldOutIcon {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 10;
    color: #fff;
}
.img-box .soldout {
    background: rgba(0, 0, 0, 0.5);
    height: 100%;
}
.img-box .soldout-img {
    position: absolute;
    width: 100%;
    height: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
}
.img-box .soldOutIcon {
    width: px2rpx(100);
    height: px2rpx(100);
    line-height: px2rpx(100);
    text-align: center;
    font-size: px2rpx(86);
    z-index: 100;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.title {
    width: 100%;
    box-sizing: border-box;
    color: $uni-text-color;
    font-style: normal;
    font-weight: normal;
    font-size: px2rpx(14);
    line-height: px2rpx(20);
    max-height: px2rpx(40);
    padding: 0 px2rpx(8);
    margin: px2rpx(8) 0 px2rpx(4);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-break: break-all;
}
.good-box .price .del-price {
    display: flex;
    align-items: center;
    height: px2rpx(14);
    line-height: px2rpx(14);
}
.price .del-num {
    text-decoration: line-through;
}
.price .del-icon,
.price .del-num {
    display: inline-block;
    color: inherit;
    font-size: px2rpx(10);
    height: px2rpx(14);
    line-height: px2rpx(14);
}
.price .pro-price {
    box-sizing: border-box;
    font-size: px2rpx(12);
    line-height: px2rpx(17);
}
.price .pro-price i,
.price .pro-price ._i {
    font-size: px2rpx(14);
    height: px2rpx(24);
    line-height: px2rpx(24);
    text-overflow: ellipsis;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    font-style: normal;
    font-weight: bold;
}
.price .pro-price.bargaining {
    font-weight: bold;
}
.btn {
    display: flex;
    flex-direction: column;
    margin: 0;
    justify-content: flex-end;
}
.btn .buybtn {
    font-size: px2rpx(24);
    height: px2rpx(24);
    line-height: px2rpx(24);
    text-align: right;
}
.btn .sales-num {
    height: px2rpx(14);
    font-size: px2rpx(10);
    line-height: px2rpx(14);
    /* 商品组color/96 */
    color: $uni-text-color-grey;
    text-align: right;
}
.box-bottom,.right-bottom {
    width: 100%;
    display: flex;
    box-sizing: border-box;
}
.box-bottom .price,
.right-bottom .price {
    display: flex;
    flex-direction: column;
}
.goods-list.block .good-box-item {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.goods-list.block .good-img.loading {
    display: block;
    height: 0;
    opacity: 0;
}
.goods-list.block .good-box .box-bottom {
    padding: 0 px2rpx(8) px2rpx(8);
    justify-content: space-between;
}
.goods-list.block .good-box .box-bottom .pro-price,
.goods-list.block .good-box .box-bottom .buybtn {
    height: px2rpx(24);
}
.goods-list.block .good-box .box-bottom .del-price,
.goods-list.block .good-box .box-bottom .sales-num {
    margin-top: px2rpx(4);
}
.goods-list.block .good-box .box-bottom .pro-price {
    line-height: px2rpx(24);
}
.goods-list.block.two .good-box {
    width: 50%;
}
.goods-list.block.two .good-box:nth-child(odd) {
    padding-right: px2rpx(4);
}
.goods-list.block.two .good-box:nth-child(even) {
    padding-left: px2rpx(4);
}
.goods-list.block.two .good-box:nth-child(n+3) {
    margin: px2rpx(8) 0 0;
}
.goods-list.block.two .good-box .pro-price {
    min-height: px2rpx(24);
    height: auto;
}
.goods-list.block.two .good-img-box {
    height: px2rpx(172);
}
.goods-list.block.two .good-img-box .good-img {
    height: px2rpx(172);
}
.goods-list.block.one .good-box {
    width: 100%;
}
.goods-list.block.one .good-box:nth-child(n+2) {
    margin-top: px2rpx(8);
}
.goods-list.block.one .good-box .good-box-item {
    padding-bottom: px2rpx(8);
}
.goods-list.block.one .good-box .good-img-box {
    height: px2rpx(161);
}
.goods-list.block.one .good-box .good-img-box .good-img {
    height: px2rpx(161);
}
.goods .goods-list.block.one .good-box .box-bottom {
    padding: 0 px2rpx(8) 0;
}
.goods .goods-list.block.one .good-box .price,
.goods .goods-list.block.one .good-box .btn {
    flex-direction: row;
    align-items: center;
}
.goods .goods-list.block.one .good-box .pro-price,
.goods .goods-list.block.one .good-box .buybtn {
    margin-bottom: px2rpx(0);
}
.goods .goods-list.block.one .good-box .price .pro-price {
    margin-right: px2rpx(8);
}
.goods .goods-list.block.one .good-box .price .del-price {
    margin-top: 0;
    height: px2rpx(24);
    line-height: px2rpx(24);
}
.goods .goods-list.block.one .good-box .price .del-price .del-icon,
.goods .goods-list.block.one .good-box .price .del-price .del-num {
    font-size: px2rpx(10);
    height: px2rpx(24);
    line-height: px2rpx(24);
}
.goods .goods-list.block.one .good-box .btn .sales-num {
    margin-top: 0;
    margin-right: px2rpx(4);
    height: px2rpx(24);
    line-height: px2rpx(24);
}
.goods .goods-list.block.one .good-box .btn .buybtn {
    order: 2;
}
.goods .goods-list.block.three .title {
    font-size: px2rpx(12);
    line-height: px2rpx(17);
    max-height: px2rpx(34);
}
.goods .goods-list.block.three .good-box {
    width: 33.33%;
}
.goods .goods-list.block.three .good-box:nth-child(3n-2), .goods .goods-list.block.three .good-box:nth-child(3n-1) {
    padding-right: px2rpx(4);
}
.goods .goods-list.block.three .good-box:nth-child(3n-1), .goods .goods-list.block.three .good-box:nth-child(3n) {
    padding-left: px2rpx(4);
}
.goods .goods-list.block.three .good-box:nth-child(3) {
    margin: 0 0 0;
}
.goods .goods-list.block.three .good-box:nth-child(n+4) {
    margin: px2rpx(8) 0 0;
}
.goods .goods-list.block.three .good-box .good-img-box {
    height: px2rpx(112);
    margin-bottom: px2rpx(8);
}
.goods .goods-list.block.three .good-box .good-img   {
    height: px2rpx(112);

}
.goods .goods-list.block.three .good-box .good-img-box .soldOutIcon {
    font-size: px2rpx(80);
}
.goods .goods-list.block.three .good-box .price,
.goods .goods-list.block.three .good-box .btn {
    height: px2rpx(24);
}
.goods .goods-list.block.three .good-box .pro-price i {
    font-size: px2rpx(12);
}
.goods .goods-list.block.three .good-box .pro-price,
.goods .goods-list.block.three .good-box .btn {
    margin-bottom: 0;
}
.goods .goods-list.block.three .good-box .sales-num,
.goods .goods-list.block.three .good-box .del-price {
    display: none;
}
.goods .goods-list.list {
    flex-direction: column;
    padding: 0;
    margin: 0 auto;
}
.goods .goods-list.list .good-box {
    border-radius: 0;
    width: 100%;
    margin: 0 auto;
    flex-direction: row;
    padding: px2rpx(8) px2rpx(12) 0;
}
.goods .goods-list.list .good-box:last-child .right.van-hairline--bottom:after {
    border-width: 0;
}
.goods .goods-list.list .good-box-item {
    display: flex;
}
.goods .goods-list.list .good-box .img-box {
    width: rpx(180);
    height: rpx(180);
    flex-shrink: 0;
    margin-right: px2rpx(8);
}
.goods .goods-list.list .good-box .img-box .good-img-box {
    height: 100%;
    display: block;
    border-radius: px2rpx(6);
}
.goods .goods-list.list .good-box .img-box .good-img-box .good-img {
    width: 100%;
    height: 100%;
}
.goods .goods-list.list .good-box .img-box .good-img-box .good-img.loading {
    display: block;
    height: 0;
    opacity: 0;
}
.goods .goods-list.list .good-box .right {
    height: px2rpx(108);
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: px2rpx(8);
    box-sizing: content-box;
    overflow: hidden;
}
.goods .goods-list.list .good-box .right.van-hairline--bottom:after {
    border-bottom-color: $uni-border-color;
    border-style: solid;
}
.goods .goods-list.list .good-box .right .title {
    margin-top: 0;
    padding: 0;
    max-height: px2rpx(34);
    line-height: px2rpx(17);
    font-size: px2rpx(12);
}
.goods .goods-list.list .good-box .right .subtitle {
    font-style: normal;
    font-weight: normal;
    font-size: px2rpx(12);
    line-height: px2rpx(17);
    color: $uni-text-color-grey;
    padding: 0;
    margin-bottom: px2rpx(11);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    box-sizing: border-box;
}
.goods .goods-list.list .good-box .right .right-bottom {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    margin-bottom: 0;
}
.goods .goods-list.list .good-box .right .right-bottom .pro-price {
    height: px2rpx(22);
}
.goods .goods-list.list .good-box .right .right-bottom .pro-price i {
    font-size: px2rpx(16);
}
.goods .goods-list.list .good-box .right .right-bottom .pro-price.price-end,
.goods .goods-list.list .good-box .right .right-bottom .btn.btn-end {
    justify-content: flex-end;
}
.goods .goods-list.list .good-box .right .right-bottom .btn .sales-num {
    margin-top: px2rpx(2);
}
.goods .goods-list.scroll {
    flex-direction: row !important;
    flex-wrap: nowrap;
}
.goods-list.scroll .good-box {
    padding-left: px2rpx(8);
}
.goods-list.scroll .good-box-item {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.goods-list.scroll .good-img-box {
    height: px2rpx(156);
    overflow: hidden;
}
.goods-list.scroll .good-img {
    height: px2rpx(156);
}
.goods-list.scroll .box-bottom {
    padding: 0 px2rpx(8) px2rpx(8);
    justify-content: space-between;
}
.goods-list.scroll .box-bottom .del-price,
.goods-list.scroll .box-bottom .sales-num {
    margin-top: px2rpx(4);
}
.goods-list.scroll .box-bottom .pro-price {
    height: px2rpx(24);
}
.goods-list.scroll.two .good-box-item {
    width: px2rpx(156);
}
.goods-list.scroll.one {
    flex-direction: column;
}
.goods-list.scroll.one .good-box {
    width: px2rpx(296);
}
.goods-list.scroll.one .good-img-box {
    overflow: hidden;
    width: 100%;
    height: px2rpx(138);
}
.goods-list.scroll.one .good-img-box .good-img {
    height: px2rpx(138);
}
.goods-list.scroll.one .soldout-img {
    width: 100%;
}
.goods-list.scroll.three {
    justify-content: flex-start;
}
.goods-list.scroll.three .good-box-item {
    width: px2rpx(102);
}
.goods-list.scroll.three .good-img-box {
    width: 100%;
    height: px2rpx(102);
    margin-bottom: px2rpx(8);
}
.goods-list.scroll.three .good-img-box .good-img {
    height: px2rpx(102);
}
.goods-list.scroll.three .soldOutIcon {
    font-size: px2rpx(80);
}
.goods-list.scroll.three .good-box .title {
    font-size: px2rpx(12);
    line-height: px2rpx(17);
    max-height: px2rpx(34);
}
.goods-list.scroll.three .good-box .pro-price i {
    font-size: px2rpx(12);
}
.goods-list.scroll.three .good-box .del-price,
.goods-list.scroll.three .good-box .sales-num {
    display: none;
}
.goods .commision-bg {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: px2rpx(21);
    background: linear-gradient(171.66deg, #ff3c29 0%, #ff6f29 94.38%);
}
.commision-box {
    position: absolute;
    left: 0;
    bottom: 0;
    height: px2rpx(21);
    width: 100%;
    overflow: hidden;
}
.commision-box.style2 {
    width: fit-content;
    border-radius: 0;
}
.commision-box.style2 .commision-bg {
    border-top-right-radius: px2rpx(2);
}
.commision-money {
    position: relative;
    padding: 0 px2rpx(4);
    font-size: px2rpx(10);
    line-height: px2rpx(21);
    text-align: center;
    color: #fff;
    z-index: 1000;
}

</style>
