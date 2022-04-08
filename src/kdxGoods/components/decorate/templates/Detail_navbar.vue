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
    <div>
        <ul class='detail_navbar isbottom van-hairline--top' :style='{background:componentData.style.background,"border-top-color": componentData.style.dividercolor}' v-if='componentData&&componentData.id=="detail_navbar"&&componentData.params.activityName!=="seckill"'>
            <!-- 卡密新增无法购买提示 -->
            <div class="detail-tip" v-if="componentData.params.is_buy_disable" :style="{bottom:isIphoneX}">
                <div class="tip-text">商品暂时无法购买</div>
            </div>
            <button class='like nav-icon'
                    :open-type="(componentData.params.canService && getLike.url=='wx_service')?'contact': ''"
                    :send-message-img="componentData.params.goods_thumb"
                    :send-message-title="componentData.params.goods_title"
                    :send-message-path="componentData.params.goodslink"
                    show-message-card
                    :style='{background:componentData.style.background}' v-if='getLike' @click='clickItem(getLike)'>
                <i class="myicon" :class='[getLike.icon]' :style='{color:getLike.color}'></i>
                <span :style='{color:componentData.style.textcolor}'>{{getLike.content}}</span>
                <i class="badge" v-if='getLike.badge' :style="{background:componentData.style.dotcolor}">{{getLike.badge}}</i>
            </button>
            <button class='shop nav-icon'
                    :open-type="(componentData.params.canService && getShop.url=='wx_service')?'contact': ''"
                    :send-message-img="componentData.params.goods_thumb"
                    :send-message-title="componentData.params.goods_title"
                    :send-message-path="componentData.params.goodslink"
                    show-message-card :style='{background:componentData.style.background}' v-if='getShop' @click='clickItem(getShop)'>
                <i class="myicon" :class='[getShop.icon]' :style='{color:getShop.color}'></i>
                <span :style='{color:componentData.style.textcolor}'>{{getShop.content}}</span>
                <i class="badge" v-if='getShop.badge' :style="{background:componentData.style.dotcolor}">{{getShop.badge}}</i>
            </button>
            <button class='cart nav-icon'
                    :open-type="(componentData.params.canService && getCart.url=='wx_service')?'contact': ''"
                    :send-message-img="componentData.params.goods_thumb"
                    :send-message-title="componentData.params.goods_title"
                    :send-message-path="componentData.params.goodslink"
                    show-message-card
                    :style='{background:componentData.style.background}' v-if='getCart' @click='clickItem(getCart)'>
                <i class="myicon" :class='[getCart.icon]' :style='{color:getCart.color}'></i>
                <span :style='{color:componentData.style.textcolor}'>{{getCart.content}}</span>
                <i class="badge" v-if='getCart.badge>0||getCart.cart_num>0' :style="{background:componentData.style.dotcolor}">{{getCart.badge||getCart.cart_num}}</i>
            </button>

            <!-- <button
                 class='customer nav-icon'
                 :open-type="(componentData.params.canService && getCustomer.url=='wx_service')?'contact': ''"
                 :send-message-img="componentData.params.goods_thumb"
                 :send-message-title="componentData.params.goods_title"
                 :send-message-path="componentData.params.goodslink"
                 show-message-card

                 :style='{background:componentData.style.background}'
                 v-if="getCustomer"
                 @click='clickItem(getCustomer)'
             >

             <i class="myicon" :class='[getCustomer.icon]' :style='{color:getCustomer.color}'></i>
             <span :style='{color:componentData.style.textcolor}'>{{getCustomer.content}}</span>
             <i class="badge" v-if='getCustomer.badge>0||getCustomer.cart_num>0' :style="{background:componentData.style.dotcolor}">{{getCustomer.badge||getCustomer.cart_num}}</i>

             </button>-->

           <li class='btns-box'>
                <!-- 普通商品非议价商品 -->
               <div class="btns-gorup" v-if="componentData.params.goods">
                    <div class='btns' v-if="componentData.params.canbuy == false">
                        <p class="btn no-num">已售罄</p>
                    </div>
                    <div  class='btns btns2' v-else>
                        <button-group style="flex:1" :simple='componentData.params.hidecartbtn=="0"&&componentData.params.goodsType!=1'>
                            <btn v-if='componentData.params.hidecartbtn=="0"&&componentData.params.goodsType=="0"' :styles="styles" class="group" @btn-click='clickItem({btn:"add"})' type="do" size="middle">加入购物车</btn>
                            <btn @btn-click='clickItem({btn:"buy"})' :styles="stylesDown" :disabled="componentData.params.is_buy_disable" :classNames='[componentData.params.hidecartbtn=="1" ? "nocart" : ""]' class="group" type="do" size="middle">{{componentData.params.textbuy}}</btn>
                        </button-group>
                    </div>
                </div>
            </li>
        </ul>
        <div v-if="componentData.params.activityName=='seckill'">
            <!-- 卡密商品参加 秒杀活动无权限 -->
            <div class="detail-tip" v-if="componentData.params.is_buy_disable" :style="{bottom:isIphoneX}">
                <div class="tip-text">商品暂时无法购买</div>
            </div>
            <detail-navbar-seckill @normal-click="clickItem" :activity-data="componentData" @special-click="clickItem" @custom-event="clickItem"></detail-navbar-seckill>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    import DetailNavbarSeckill from './Detail_navbar__seckill.vue'
    export default {
        mixins: [mixin],
        name: 'detail_navbar',
        components: {
            DetailNavbarSeckill,
        },
        computed: {
            styles(){
                return `background:${this.componentData.style.cartcolor}`
            },
            stylesDown(){
                return `background:${this.componentData.style.buycolor}`
            },
            getLike() {
                let data = null;
                if (this.componentData.params.hidelike == '0') { //关注
                    data = {
                        btn: 'like',
                        icon: this.componentData.params.favor?'iconfont-m- icon-m-xingxingshixin':'iconfont-m- icon-m-xingxingkongxin',
                        content:  this.componentData.params.favor?'已收藏':'收藏',
                        color:this.componentData.params.favor?this.componentData.style.dotcolor:this.componentData.style.iconcolor
                    }
                } else if (this.componentData.params.hidelike == '-1') { //店铺
                    data = {
                        btn: 'shop',
                        icon: 'iconfont-m- icon-m-iconfontshop',
                        content: '店铺',
                        color:this.componentData.style.iconcolor,
                    }
                } else if (this.componentData.params.hidelike == '-2') { //购物车
                    data = {
                        btn: 'tocart',
                        icon: 'iconfont-m- icon-m-cart',
                        content: '购物车',
                        badge: this.componentData.params.badge,
                        color:this.componentData.style.iconcolor
                    }
                } else if (this.componentData.params.hidelike == '-3') { //自定义
                    data = {
                        btn: 'custom',
                        icon: this.componentData.params.likeiconclass,
                        content: this.componentData.params.liketext,
                        url: this.componentData.params.likelink,
                        color:this.componentData.style.iconcolor,
                        wxappid: this.componentData.params.like_wxappid
                    }
                }else if(this.componentData.params.hidelike == '-4'){ // 客服
                    data = {
                        btn: 'customer',
                        icon: this.componentData.params.customericonclass,
                        content: this.componentData.params.customertext,
                        url: this.componentData.params.customerlink,
                        color:this.componentData.style.iconcolor,
                        wxappid: this.componentData.params.customer_wxappid
                    }

                }
                return data;
            },
            getShop() {
                let data = null;
                if (this.componentData.params.hideshop == '-1') { //关注
                    data = {
                        btn: 'like',
                        icon: this.componentData.params.favor?'iconfont-m- icon-m-xingxingshixin':'iconfont-m- icon-m-xingxingkongxin',
                        content:  this.componentData.params.favor?'已收藏':'收藏',
                        color:this.componentData.params.favor?this.componentData.style.dotcolor:this.componentData.style.iconcolor
                    }
                } else if (this.componentData.params.hideshop == '0') { //店铺
                    data = {
                        btn: 'shop',
                        icon: 'iconfont-m- icon-m-iconfontshop',
                        content: '店铺',
                        color:this.componentData.style.iconcolor,
                    }
                } else if (this.componentData.params.hideshop == '-2') { //购物车
                    data = {
                        btn: 'tocart',
                        icon: 'iconfont-m- icon-m-cart',
                        content: '购物车',
                        badge: this.componentData.params.badge,
                        color:this.componentData.style.iconcolor
                    }
                } else if (this.componentData.params.hideshop == '-3') { //自定义
                    data = {
                        btn: 'custom',
                        icon: this.componentData.params.shopiconclass,
                        content: this.componentData.params.shoptext,
                        url: this.componentData.params.shoplink,
                        color:this.componentData.style.iconcolor,
                        wxappid: this.componentData.params.shop_wxappid
                    }
                }else if(this.componentData.params.hideshop == '-4'){ // 客服

                    data = {
                        btn: 'customer',
                        icon: this.componentData.params.customericonclass,
                        content: this.componentData.params.customertext,
                        url: this.componentData.params.customerlink,
                        color:this.componentData.style.iconcolor,
                        wxappid: this.componentData.params.customer_wxappid
                    }

                }
                return data;
            },
            getCustomer(){
                let data = null;
                if (this.componentData.params.hidecustomer == '-1') { //关注
                    data = {
                        btn: 'like',
                        icon: this.componentData.params.favor?'iconfont-m- icon-m-xingxingshixin':'iconfont-m- icon-m-xingxingkongxin',
                        content:  this.componentData.params.favor?'已收藏':'收藏',
                        color:this.componentData.params.favor?this.componentData.style.dotcolor:this.componentData.style.iconcolor
                    }
                } else if (this.componentData.params.hidecustomer == '-2') { //店铺
                    data = {
                        btn: 'shop',
                        icon: 'iconfont-m- icon-m-iconfontshop',
                        content: '店铺',
                        color:this.componentData.style.iconcolor,
                    }
                } else if (this.componentData.params.hidecustomer == '0') { //购物车
                    data = {
                        btn: 'tocart',
                        icon: 'iconfont-m- icon-m-cart',
                        content: '购物车',
                        badge: this.componentData.params.badge,
                        color:this.componentData.style.iconcolor
                    }
                } else if (this.componentData.params.hidecustomer == '-3') { //自定义
                    data = {
                        btn: 'custom',
                        icon: this.componentData.params.carticonclass,
                        content: this.componentData.params.carttext,
                        url: this.componentData.params.cartlink,
                        color:this.componentData.style.iconcolor,
                        wxappid: this.componentData.params.cart_wxappid
                    }
                }else if(this.componentData.params.hidecustomer == '-4'){ // 客服

                    data = {
                        btn: 'customer',
                        icon: this.componentData.params.customericonclass,
                        content: this.componentData.params.customertext,
                        url: this.componentData.params.customerlink,
                        color:this.componentData.style.iconcolor,
                        wxappid: this.componentData.params.customer_wxappid
                    }

                }
                // console.log(data,'data')
                return data;
            },
            getCart() {
                let data = null;
                if (this.componentData.params.hidecart == '-1') { //关注
                    data = {
                        btn: 'like',
                        icon: this.componentData.params.favor?'iconfont-m- icon-m-xingxingshixin':'iconfont-m- icon-m-xingxingkongxin',
                        content:  this.componentData.params.favor?'已收藏':'收藏',
                        color:this.componentData.params.favor?this.componentData.style.dotcolor:this.componentData.style.iconcolor
                    }
                } else if (this.componentData.params.hidecart == '-2') { //店铺
                    data = {
                        btn: 'shop',
                        icon: 'iconfont-m- icon-m-iconfontshop',
                        content: '店铺',
                        color:this.componentData.style.iconcolor,
                    }
                } else if (this.componentData.params.hidecart == '0') { //购物车
                    data = {
                        btn: 'tocart',
                        icon: 'iconfont-m- icon-m-cart',
                        content: '购物车',
                        badge: this.componentData.params.badge,
                        color:this.componentData.style.iconcolor
                    }
                } else if (this.componentData.params.hidecart == '-3') { //自定义
                    data = {
                        btn: 'custom',
                        icon: this.componentData.params.carticonclass,
                        content: this.componentData.params.carttext,
                        url: this.componentData.params.cartlink,
                        color:this.componentData.style.iconcolor,
                        wxappid: this.componentData.params.cart_wxappid
                    }
                }else if(this.componentData.params.hidecart == '-4'){ // 客服

                    data = {
                        btn: 'customer',
                        icon: this.componentData.params.customericonclass,
                        content: this.componentData.params.customertext,
                        url: this.componentData.params.customerlink,
                        color:this.componentData.style.iconcolor,
                        wxappid: this.componentData.params.customer_wxappid
                    }

                }
                // console.log(data,'data')
                return data;
            },
            isIphoneX() {
                // 获取iphonex底部安全区域
                return this.$store.state.areaBottom + 48 + 'px'
            }
        },
        created(){
            if(this.componentData.style.dividercolor == null){
                this.componentData.style.dividercolor = '#E6E7EB'
            }
        },
        methods: {
            clickItem(data) {
                if (data.btn=='buy' && this.componentData.params?.is_buy_disable) {
                    return
                }
                if(data.btn=="shop"){
                    this.$Router.auto({
                        path: '/pages/index/index'
                    })
                    return

                }
                this.$emit('custom-event', {
                    target: 'detail_navbar/clickItem',
                    data: data
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .detail-tip {
        position: fixed;
        left: 0;
        width: 100%;
        height: px2rpx(27);
        line-height: px2rpx(27);
        background-color: rgba(255, 230, 142, 0.5);
        text-align: center;
        .tip-text {
            color: #565656;
            font-size: px2rpx(12);
        }
    }
    .detail_navbar {
        width: 100%;
        overflow: hidden;
        height: px2rpx(48);
        display: flex;
        flex-wrap: nowrap;
        box-sizing: border-box;
        padding: px2rpx(7) px2rpx(3) px2rpx(5) px2rpx(3);

        &.van-hairline--top:after {
            border-top-color: inherit;
            border-style: solid;
        }

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

            &::after {
                border: 0;
            }
            .myicon {
                font-size: px2rpx(20);
                margin: 0 auto;
                text-align: center;
                height: px2rpx(20);
                width: px2rpx(20);
                line-height: px2rpx(20);
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
        .btns-box{
            flex: 1;
            height:100%;
            margin:0 px2rpx(3)
        }
        .btns {
            display: flex;
            flex: 1;
            height: 100%;
            display: flex;
            flex-wrap: nowrap;
            justify-content: center;
            color: #fff;
            min-width: px2rpx(202);
            margin: 0!important;
            overflow: hidden;
            border-radius: px2rpx(34);
            .btn {
                font-size: px2rpx(14);
                text-align: center;
                flex: 1;
                height: 100%;
                min-width: px2rpx(101);
                margin: 0;
                line-height: px2rpx(14);
                display: flex;
                flex-direction: column;
                justify-content: center;
                &.cart-btn {
                    padding-left: px2rpx(5);
                }
                &.buy-btn {
                    padding-right: px2rpx(5);
                }
                &.disabled {
                    background: #ccc !important;
                }

                &.no-num {
                    width: px2rpx(202);
                    height: px2rpx(36);
                    background-color: #ccc;
                }
            }
            &.nocart {
                min-width: px2rpx(202);
                flex-shrink: 0;
                .btn{
                    padding:0;
                }
            }
        }
    }
    .dy{
        position: absolute;
        left: 0;
        right: 0;
        height:px2rpx(48) ;
        top:px2rpx(-48);
        background: rgba(0,0,0,0.7);
        line-height:px2rpx(48) ;
        text-align: center;
        font-size:px2rpx(14);
        color: #fff;
    }
    .sub_shop_closed{
        position: relative;
        &::after{
            content: "";
            position: absolute;
            background:rgba(255,255,255,0.7);
            top:0;left:0;
            width:100%;
            height:100%;
            z-index: 100;
        }
    }
</style>