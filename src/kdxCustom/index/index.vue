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
    <view class="custom-page" :style="{
		'background':pageSettings.background_color
	}" @touchstart='touchstart' @touchend='touchend' @touchmove='touchmove'>
        <!-- 装修页面组件 -->
        <page-decorater
        :customIsTop="isTop"
        :customIsBottom="showMenu[pageId]===false?[]:isBottom"
        :customIsFixed="isFixed"
        :customPageList="lazyLoadList"
        :customPageInfo="pageInfo"
        :customPageBottom="pageBottom"
        :pageTop="pageTop"
        :load-tip="loadTip"
        :pageSettings="pageSettings"
        @custom-event='eventHandler'
        :showDiymenu='showMenu[pageId]!==false'
        ></page-decorater>
        <!-- 多规格选择 -->
        <goods-picker ref="goodsPicker"
            @custom-event="customEventHandler"></goods-picker>
        <Skeleten v-if='isSkeleton && loadingFlg < 1'></Skeleten>
    </view>
</template>


<script>
    import PageDecorater from '../components/decorate/PageBox'

    import { LazyLoadList } from '@/components/decorate/loader/LazyLoadList'
    import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
    import eventHandler from './eventHandler.js'
    import {deepCopy} from '@/common/util.js'
    import preloadDecorate from '@/router/beforeEach/preLoadDecorate.js'
    import CartAdder from '@/components/goods/addCartTools.js'
    import goodsPicker from "@/components/goods/GoodsPicker";
    import PageMixin from '@/common/PageMixin.js'
    import Skeleten from './components/Skeleten'

     // #ifdef MP-TOUTIAO
    import EventBus from '@/common/eventBus.js'
    // #endif

    export default {
        mixins: [PageMixin],
        components: {
            PageDecorater,
            goodsPicker,
            Skeleten
        },
        created(){
            this.$loading.showLoading();
        },
        data() {
            return {
                cartAdder:null,//添加购物车类对象
                lazyLoadList: [],
                shareInfo: {},
                pageId:''
            }
        },
        beforeDestroy(){
            this.$decorator.$off('refreshMyVideo')
            this.scrollTop = 0
            this.$decorator.getPage('custom').clearAll()
        },
        onLoad() {
            this.scrollTop = 0
            this.listLoader = this.listLoader||new LazyLoadList(this.loadList, 0)
            if(!this.lazyLoadList.length){
                this.listLoader.refresh().getMore(this.pageList, 0,this.lazyLoadList.length)
            }
            //#ifdef H5
            this.listLoader.h5ReachBottom((e) => {
                this.scrollTop = Math.max(e.scrollTop,this.scrollTop)
                this.reachBottom = true
                if (this.pageList ?.length) {
                    this.listLoader.getMore(this.pageList, this.scrollTop,this.lazyLoadList.length)
                }
            });
            //#endif
            this.$store.dispatch('setting/getSysSetting') // 更新系统设置
        },

        onUnload(e) {
            this.scrollTop=0
            this.listLoader=null;
        },
        // onShow(){ // 修改bug 21009-删除
        //     if(this.shareInfo.link) {
        //         this.$utils.getShareInfo(this.shareInfo)
        //     }
        // },
        computed: {
            ...mapState('decorate/customPage', {
                pageList: state => state.pageList,
                pageInfo: state => deepCopy(state.pageInfo),
                isTop: state => state.isTop,
                isBottom: state => state.isBottom,
                isFixed: state => state.isFixed,
                pageTop: state => state.pageTopHeight,
                pageBottom: state => state.pageBottomHeight,
                pageSettings:state=>state.pageSettings,
                showSkeleten:state=>state.showSkeleten,
                showMenu:state=>state.showMenu
            }),
            loadTip() {
                if(this.pageList?.length <=1){
                    return ''
                }
                return this.pageList?.length > 0 &&
                    this.pageList?.length == this.lazyLoadList?.length
                    ? ''
                    : '正在加载...'
            },
            isShowSkeleten(){
                return this.showSkeleten||!this.lazyLoadList.length
            }
        },
        watch: {
            pageList: {
                immediate: true,
                handler() {
                    if (this.pageList ?.length&&this.$Route&&this.$Route?.path=='/kdxCustom/index/index') {
                    this.listLoader =
                        this.listLoader || new LazyLoadList(this.loadList, 0)
                        this.listLoader.refresh().getMore(this.pageList, 0,this.lazyLoadList.length)
                    }
                },
            },
            pageSettings: {
                handler() {
                    // #ifdef H5
                    // if(!this.shareInfo.title) { // 修改bug 22252--mumu
                        let shareimg = this.pageSettings.params?.shareimg || this.shareLogo;
                        let location_href = window.location.href;
                        let shareParams = {
                            ...this.$Route.query,
                        };
                        if(this.$store.state.login.userInfo.id) {
                            shareParams.inviter_id = this.$store.state.login.userInfo.id
                        }
                        let link = `${window.config.wap_url}/kdxCustom/index/index?${this.$utils.createQueryParams(shareParams)}`;

                        this.shareInfo= {
                            title:this.pageSettings?.title || '',
                            description: this.pageSettings.params?.sharetext || this.shareDesc,
                            logo: this.$utils.mediaUrl(shareimg)|| '',
                            sdkUrl:  location_href.split('#')[0] + '#' + location_href.split('#')[1],
                            link
                        };
                        this.$utils.getShareInfo(this.shareInfo)
                    // }
                    // #endif
                },
                immediate: true
            },
            isShowSkeleten(val){
                if (val) {
                    // this.$loading.showLoading();
                } else {
                    this.$loading.hideLoading();
                }
            }
        },
        methods: {
            loadList(list) {
                if (list.length>this.lazyLoadList.length) {
                    setTimeout(() => {
                        this.reachBottom = false;
                    },200)
                }
                // if(!this.lazyLoadList.length&&!list.length){
                //     setTimeout(() => {
                //         this.listLoader.getMore(this.pageList, 0)
                //     },500)
                // }
                this.lazyLoadList = list
            },
            touchstart(e){
                this.touchstartY = e.changedTouches?.[0]?.clientY
                this.startScrollTop = this.scrollTop
            },
            touchend(e){
                this.touchendY = e.changedTouches?.[0]?.clientY
                if (this.scrollTop == this.startScrollTop && this.touchendY - this.touchstartY < -50) {
                    this.reachBottom=true
                }
            },
            touchmove(e) {
                if (this.reachBottom && this.pageList ?.length) {
                    clearTimeout(this.throttle)
                    this.throttle = setTimeout(() => {

                        this.listLoader.getMore(this.pageList, this.scrollTop,this.lazyLoadList.length)
                    }, 500)
                }
            },
            async pullDownRefresh(){//下拉刷新，mixin.js中调用
                // uni.showLoading({
                //     title: '正在刷新',
                // })
                this.$decorator.$emit('refreshMyVideo')
                await preloadDecorate(this.$Route.path,this.$Route.query,true);
                this.listLoader.refresh().getMore(this.pageList, this.scrollTop)
                setTimeout(() => {
                    this.$closePageLoading()
                },1000)
            },
             //规格选完回来
            async customEventHandler(e) {//快速购买处理
                await this.cartAdder.pickerCallback(e)
                if (e.type === 'clickBtn') {
                    this.$refs?.goodsPicker.toggle(); // 购物车添加成功关闭弹窗
                }
            },
            eventHandler(e) {
                eventHandler.call(this, e)
            }
        },
        mounted() {
            this.pageId = this.$Route.query.pageId
            // #ifdef MP-TOUTIAO
            EventBus.$off('mounted-child')
            EventBus.$on('mounted-child', (child)=> {
                this.$refs.goodsPicker = child;
            })
            this.$once('hook:beforeDestory',()=> {
                 EventBus.$off('mounted-child')
            })
            // #endif
            this.cartAdder=new CartAdder((e)=>{//商品组加购专用//快速购买处理
                if(e.type=='toggle'){
                    this.$refs?.goodsPicker.toggle(this.cartAdder.pickerCallback, e.data?.type);
                    if(!this.$refs.goodsPicker.showmodal&&e.data.errorInfo){
                        this.$toast(e.data.errorInfo)
                    }
                }
            });
        },

        onPageScroll(e) {
            if ((e.scrollTop > this.scrollTop + 50) && this.reachBottom) {
                this.reachBottom = false;
            }
            this.scrollTop = Math.max(e.scrollTop,this.scrollTop)
        },
        onReachBottom(e) {
            this.reachBottom = true
            if (this.pageList ?.length) {
                this.listLoader.getMore(this.pageList, this.scrollTop,this.lazyLoadList.length)
            }
        },
        // #ifndef H5
        onShareAppMessage() {
             let shareParams = {
                ...this.$Route.query,
            }

            if(this.$store.state.login.userInfo.id) {
                shareParams.inviter_id = this.$store.state.login.userInfo.id
            }

            let url = this.$Route.path+'?'+this.$utils.createQueryParams(shareParams);
            if (this.$Route.meta?.needLogin || this.$Route.meta?.bindSence) {
                url = '/kdxCustom/index/index?'+ this.$utils.createQueryParams(shareParams)
            }
            let shareimg = this.pageSettings.params.shareimg   || this.shareLogo;
            return {
                title:this.pageSettings.title,
                imageUrl:shareimg?this.$utils.media(shareimg): '',
                path: url,
                success: function() {},
                fail: function() {}
            }
        },
        onShareTimeline(){
            let shareimg = this.pageSettings.params.shareimg  || this.shareLogo;

            let shareParams = {
                ...this.$Route.query,
            }

            if(this.$store.state.login.userInfo.id) {
                shareParams.inviter_id = this.$store.state.login.userInfo.id
            }

            return {
                title:this.pageSettings.title,
                imageUrl:shareimg?this.$utils.media(shareimg): '',
                query: this.$utils.createQueryParams(shareParams)
            }
        },
        // #endif
    }
</script>

<style lang="scss" scoped>
    .custom-page {
        background: #eee;
        .showSkeleten {
            height: 0;
            overflow: hidden;
        }
    }
</style>
