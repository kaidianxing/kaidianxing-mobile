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
    <div class='diymenu isbottom' id='customMenu' v-if='componentData&&componentData.id=="diymenu"&&getCacheData.show!==false && showMenu'>
        <ul class='list' :style='{background:getCacheData.style.bgcolor,borderTop:`1px solid ${getCacheData.style.bordercolor}`||"#eee"}'>
            <li class='item' v-for='(item,index) in getCacheData.items' :key='index' :style='{background:item.active?getCacheData.style.bgcoloron:"rgba(0,0,0,0)",justifyContent:getCacheData.icon_position=="left"?"center;":"space-around"}' @click.stop='clickItem(item,index)'>
                <div class='icon-text' :class='[getCacheData.icon_position]' v-if='getCacheData.icon_type=="0"'>
                    <div class="icon-box" :class="{
                        'custom-icon' : hasCustom(item.icon_url)
                    }"><i class='i' :class='[item.icon_url||"iconfont-m- icon-m-dianpu",hasCustom(item.icon_url)?"custom-icon" :""]' :style='{color:item.active?getCacheData.style.iconcoloron:getCacheData.style.iconcolor}'></i></div>
                    <span class='text' :style='{color:item.active?getCacheData.style.textcoloron:getCacheData.style.textcolor}'>{{item.text}}</span>
                </div>
                <div class='onlyimg' v-else>
                    <div class="img" :style="{
                        backgroundImage: `url(${getImg(item)})`
                    }"></div>
                    <!-- <img mode='widthFix' lazy-load class='img' :src="item.icon_url?$utils.mediaUrl(item.icon_url):$utils.staticMediaUrl('decorate/menu_radius.png')" alt=""> -->
                </div>
                <!-- 购物车显示徽标数 -->
                <span class="badgenum" :style="{background:getCacheData.cart_bgcolor}" v-if='item.badge&&getCacheData.cart_number==1'>{{item.badge}}</span>
                <transition name="slide-fade">
                    <div class="submenu-box" :class="{leftitem:index==0,rightitem:index==(getCacheData.items.length-1)}" v-if='item.child&&item.child.length&&item.showsubmenu'>
                        <ul class='submenu' :style="{color:getCacheData.style.childtextcolor,background:getCacheData.style.childbgcolor}">
                            <li class='subitem van-hairline van-hairline--bottom' :class="[(item.child&&key==(item.child.length-1))?'lastone':'']" v-for='(val,key) in item.child' :key='key'
                                @click.stop='clickItem(item,index,val,key)'>{{val.text}}</li>
                        </ul>
                    </div>
                </transition>
            </li>
        </ul>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    import {
        mapState
    } from 'vuex' 
    export default {
        mixins: [mixin],
        name: 'search',
        data() {
            return {
                throttle: false,
                cacheData: {
                    style: {},
                    params: {},
                    items: []
                },
                isMounted: false
            }
        },
        mounted(){
            this.isMounted = true
        },
        computed: {
            ...mapState('decorate', {
                tabbarPages: state => state.tabbarPages
            }),
            getCacheData() {
                let cacheData = this.cacheData;
                    if (cacheData.items instanceof Array) {
                        cacheData.items = cacheData.items ?.map((menu) => {
                            menu.active = false;
                            if(this.cacheData?.cart_number=='1'&&menu.target_url == '/kdxCart/index'){
                                if(!this.$isPC) {
                                    menu.badge=this.cacheData?.cart_num
                                } else {
                                    // #ifdef H5
                                    menu.badge = 4
                                    // #endif
                                }
                            }
                            if (menu.child ?.length) {
                                menu.child.forEach(childmenu => {
                                    childmenu.active = false;
                                    if (this.$Route ?.path == childmenu.target_url) {
                                        menu.active = true;
                                        childmenu.active = true;
                                    }
                                })
                            } else {
                                // 适配云智服，防止链接字段是一个对象
                                if(typeof menu.target_url!=='string'){
                                    return menu
                                }
                                // 判断路径一致， 判断参数一致 23319
                                    if(this.isMounted &&this.isSamePath(menu.target_url, this.$Route)){
                                        menu.active = true
                                    }
                            }
                            return menu
                        })
                }else{
                    cacheData.items?.map(item=>{
                        if(item.target_url == '/kdxCart/index'){
                            item.badge=4
                        }
                        return item
                    })
                }
                return cacheData
            },
            showMenu(){
                if (this.$isPC) {
                    return this.$store.state.decorate.pageInfo.params.showmenu !='1'
                }
                return true
            }
        },
        watch: { 
            'componentData': {
                immediate: true,
                handler() {
                    this.cacheData = Object.assign({}, this.refresh(this.componentData));
                }
            }
        },
        methods: {
            isSamePath(url, $Route){
                let [path,params] = url?.split('?')
                if(path!=$Route.path) return false;

                if(params){
                    let res = {}
                    params?.split('&')?.forEach(item=> {
                        let [key,value] = item?.split('=')
                        res[key] = value
                    })
                    return this.$utils.deepCompare(res,this.$Route.query)
                }
                return true
               
            },
            hasCustom(icon_url){
                let reg = /ri/g
                if(typeof icon_url == 'string') {
                    return reg.test(icon_url)
                }
                return ''
            },
            getImg(item) {
                let url =''
                if(item.active) {
                    if(item.icon_url_1_on) {
                        url= this.$utils.mediaUrl(item.icon_url_1_on)
                    } else {
                        url = this.$utils.staticMediaUrl('decorate/menu_radius.png')
                    }
                } else {
                    if(item.icon_url) {
                        url = this.$utils.mediaUrl(item.icon_url)
                    } else {
                        url = this.$utils.staticMediaUrl('decorate/menu_radius.png')
                    }
                }

                return url
            },
            refresh(cacheData) {
                cacheData.items ?.forEach((menu) => {
                    menu.active = false;
                    menu.showsubmenu = false;
                    if (menu.child ?.length) {
                        menu.child.forEach(childmenu => {
                            childmenu.active = false;
                        })
                    }
                })
                return cacheData
            },
            clickItem(...data) {
                if (!this.throttle) {
                    this.throttle = true;
                    setTimeout(() => { //函数节流
                        this.throttle = false
                    }, 100);
                    let index = data[1];
                    if (this.cacheData.items instanceof Array) {
                        this.cacheData.items = this.cacheData.items.map((item, idx) => {
                            if (index == idx) {
                                if (!this.tabbarPages) {//这里在PC端起效
                                    item.active = true;
                                }
                                item.showsubmenu = !item.showsubmenu;
                                if (data.length == 4) {
                                    let key = data[3];
                                    item.child = item.child.map((item, no) => {
                                        if (!this.tabbarPages) {//这里在PC端起效
                                            item.active = no == key;
                                        }
                                        return item
                                    })
                                }
                            } else {
                                item.active = false;
                                item.showsubmenu = false;
                                if (data.length == 4) {
                                    item.child = item.child.map((item) => {
                                        item.active = false;
                                        return item
                                    })
                                }
                            }
                            return item
                        })
                    }
                    this.cacheData = Object.assign({}, this.cacheData)
                    this.$emit('custom-event', {
                        target: 'diymenu/clickItem',
                        data: data
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .diymenu {
        z-index: 999999;
        .list {
            display: flex;
            flex-wrap: nowrap;
            width: 100%;
            height: px2rpx(50);
            border-top: px2rpx(0.5) solid #eee;
            box-sizing: border-box;
            .item {
                width: 0;
                flex: 1;
                height: px2rpx(50);
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
            }
            .badgenum {
                box-sizing: border-box;
                font-size: px2rpx(8);
                line-height: px2rpx(12);
                height: px2rpx(12);
                min-width: px2rpx(12);
                position: absolute;
                display: flex;
                flex-direction: column;
                justify-content: center;
                text-align: center;
                border-radius: px2rpx(11);
                font-weight: bold;
                color: #fff;
                left: 53%;
                top: px2rpx(5); // transform: translate(-50%,0); 
                font-style: normal;
                z-index: 10;
                padding: 0 px2rpx(3);
            }
            .icon-text {
                display: flex;
                text-align: center;
                color: #666;
                box-sizing: border-box;
                &.top {
                    justify-content: space-around;
                    flex-direction: column;
                    margin: 0;
                    height: 100%;
                    padding: px2rpx(4) 0 px2rpx(6);
                }
                .i {
                    font-size: px2rpx(26);
                    text-align: center;
                    display: block;

                    &.custom-icon {
                        &::before {
                            font-size: px2rpx(22);
                        }
                    }

                   
                }

                .icon-box {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: px2rpx(26);

                    &.custom-icon {
                        padding-bottom: px2rpx(1);
                    }
                }

                
                .text {
                    text-align: center;
                    font-size: px2rpx(12);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                &.left {
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-content: center;
                    margin: 0;
                    .i {
                        font-size: px2rpx(16);
                        margin: 0 px2rpx(2);
                    }
                    .text {
                        font-size: px2rpx(10);
                    }
                }
            }
            .onlyimg {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                .img {
                    width: 100%;
                    height: 100%;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                }
            }
            .submenu-box {
                position: absolute;
                top: 0;
                left: 50%;
                transform: translate(-50%, -100%);
                padding-bottom: px2rpx(4);
                width: px2rpx(93);
                overflow: hidden;
                z-index: 999998;
                box-shadow: 0px 0px px2rpx(19) rgba(0, 0, 0, 0.1);

                &.leftitem {
                    left: 0;
                    transform: translate(0, -100%);
                }
                &.rightitem {
                    right: 0;
                    left: auto;
                    transform: translate(0, -100%);
                }
            }
            .submenu {
                width: px2rpx(93);
                padding: 0;
                border-radius: px2rpx(6);
                position: relative;
                overflow: hidden;
                .subitem {
                    width: 100%;
                    min-height: px2rpx(45);
                    box-sizing: border-box;
                    padding: px2rpx(15) 0;
                    line-height: px2rpx(14);
                    text-align: center;
                    font-size: px2rpx(14);

                    &.van-hairline--bottom:after {
                        border-bottom-color: $uni-border-color;
                        border-style: solid;
                    }

                    &.lastone {
                        &.van-hairline--bottom:after {
                        border-width: 0;
                    }

                    }
                }
            }
        }
    }
    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
        transition: all .1s ease;
    }
    .slide-fade-leave-active {
        transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter,
    .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */
    {
        opacity: 0;
    }
</style>