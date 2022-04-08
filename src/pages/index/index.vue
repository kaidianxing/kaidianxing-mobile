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
    <div class="index-page" :style="{background: pageSettings.background_color}" @touchstart='touchstart' @touchend='touchend' @touchmove='touchmove'>
        <Skeleten v-if="isSkeleton && loadingFlg < 1"></Skeleten>
        <div class="hidePagelist">
            <page-decorater showDiymenu :customIsTop="isTop" :customIsBottom="isBottom" :customIsFixed="isFixed" :customPageList="getPageList" :customPageInfo="pageInfo" :customPageBottom="pageBottom" :pageTop="pageTop" :load-tip="loadTip" :pageSettings="pageSettings"  @custom-event='eventHandler'>
            </page-decorater>
        </div>
        <!-- 小程序引导 -->
        <!-- #ifdef MP-WEIXIN -->
        <guide v-model="showGuide" v-if='showGuide'></guide>
        <!-- #endif -->
        <new-gifts :visible="showNewGiftsWithPerm" :newGiftsData="newGiftsData" @update:visible="changeShowNewGifts" v-if='showNewGiftsWithPerm'/>
        <!-- 多规格选择 -->
        <goods-picker
            ref="goodsPicker"
            @custom-event="customEventHandler"
        ></goods-picker>
        <!-- 领取微信红包奖励弹窗 -->
        <redpacket :activityType="activityType" :activityData="activityData" :redpackNum="redpackNum" :isShow="false"
                   @update:visible="changeShowReward"></redpacket>
    </div>
</template>
<script>
    import goodsPicker from "@/components/goods/GoodsPicker";
    import PageDecorater from '@/components/decorate/PageBox'
    import NewGifts from './components/NewGifts'
    import Skeleten from './components/Skeleten'
    import {
        mapState,
        mapGetters,
        mapMutations,
        mapActions
    } from 'vuex'
    import {
        deepCopy
    } from '@/common/util.js'
    import guide from './components/Guide'
    import preloadDecorate from '@/router/beforeEach/preLoadDecorate.js'
    // #ifdef MP-TOUTIAO
    import EventBus from '@/common/eventBus.js'
    // #endif
    import CartAdder from '@/components/goods/addCartTools.js'
    import PageMixin from '@/common/PageMixin.js'
    import DecoratePageMixin from '@/common/DecoratePageMixin.js'
    import redpacket from '@/components/modal-reward/Redpacket';
    import * as $utils from '@/common/util.js'
    export default {
        mixins: [PageMixin,DecoratePageMixin],
        created(){
            if(!this.showFlg){
                this.showFlg = 1;
                // #ifndef MP-TOUTIAO
                this.$loading.showLoading();
                // #endif
            }
        },
        components: {
            PageDecorater,
            NewGifts,
            Skeleten,
            guide,
            goodsPicker,
            redpacket,
        },
        data() {
            return {
                isShowModal: true,
                orderInfo: {},
                lazyLoadList: [],
                newGiftsData: {
                    couponList: [],
                    credit: {
                        title: '新人专享',
                        number: '',
                    },
                    balance: {
                        title: '新人赠送',
                        number: '',
                    },
                },
                showNewGifts: false,
                showGuide: false,
                tabIndex: 0,
                visible: false, //返利红包弹窗是否显示
                activityType: '', //红包活动
                activityData: {},
                redpackNum: 0,//未领取红包数量
                contentScale: false,
                pageModuleName: null,
            }
        },
        methods: {
            initPage(){
                this.tabIndex=0
                this.tabEvent=null;
                this.scrollTop = 0;
                if(this.isLogin) {
                    this.getNoRedpacket();
                }
                this.$decorator.getPage('index').clearAll()
            },
            async pullDownRefresh(){//下拉刷新，mixin.js中调用
                // uni.showLoading({
                //     title: '正在刷新',
                // })
                this.$decorator.$emit('refreshMyVideo')
                await this.$loading.setOtherData(true);
                if(this.isLogin) {
                    this.getNoRedpacket();
                }
                if(this.tabIndex==0){
                    await preloadDecorate(this.$Route.path,this.$Route.query,true);
                    this.listLoader.refresh().getMore(this.pageList, this.scrollTop)
                    this.$decorator.getPage('index').setTopmenuActive(0)
                }else{
                    if(this.tabEvent){
                        let { value, key}  =this.tabEvent.data
                        let reg = /pageId=(\d+)$/
                        let pageId = value.linkurl.match(reg) ? value.linkurl.match(reg)[1] : null
                        this.$decorator.getPage('index').turnTab({ key, pageId,forceRefresh:true })
                    }
                }
                setTimeout(() => {
                    this.$closePageLoading()
                },1000)
                uni.stopPullDownRefresh()
            },
            // 处理顶部菜单公众号分享
            appShare(pageId) {
                let share = this.$store.state.setting.systemSetting ?.share ?? {};
                let url = location.href.split('#')[0] + '#' + (this.$Route.path == '/pages/index/index' ? '/' : this.$Route.path);
                let settings_location_url = location.href || url;
                let location_href = $utils.operationSystemType() == 'ios' ? settings_location_url : url; //第一次进入页面时的url
                if (share) {
                    let href = location_href.split('#');
                    share.sdkUrl = href[0] + '#' + (href[1] == '/' ? '/' : href[1]);
                    share.link += '&pageId=' + pageId
                    if ($utils.operationSystemType() == 'ios') {
                        share.sdkUrl = href[0]
                    }
                    $utils.getShareInfo(share, true)
                }
            },
            async eventHandler(e){
                if(e.target=="topmenu/clickItem"){
                    this.tabIndex=e.data.key
                    this.tabEvent=e
                    this.scrollTop = 0
                    this.$decorator.getPage(10).setPageInfo({
                        topmenu:{
                            params:{
                                current:this.tabIndex
                            }
                        }
                    }, 'eventHandler/index.vue')
                    let reg = /pageId=(\d+)$/
                    let { value ,key}=e.data
                    let pageId = this.$Route.query?.pageId != null ? this.$Route.query?.pageId : (value.linkurl.match(reg) ? value.linkurl.match(reg)[1] : null)
                    // 将选中的顶部菜单tab页面ID缓存为了分享处理
                    this.$store.commit('setTopmenuPageID', pageId);
                    // #ifdef H5
                    if(pageId != null) {
                        this.appShare(pageId)
                    }
                    // #endif
                    // 点击添加防抖操作, indexPage修正this指针
                    let indexPage = this.$decorator.getPage('index')
                    this.$utils.debounce(indexPage.turnTab,300).call(indexPage,{ key, pageId});
                } else if (e.target=="goods/clickBuyBtn") {
                    // 快速购买处理
                    // 判断登录
                    await this.$store.dispatch('quickPurchase/checkLoginStatus')
                    // 获取商品详情
                    this.cartAdder.getGoodDetail(e.data.value.gid,'...pages/index.vue').then((res) =>{
                        if (res.error === 0) {
                            // 打开goodsPicker
                            this.cartAdder.callback({
                                type: 'toggle',
                                data: {
                                    type: 'spec'
                                },
                            })
                        }
                    })
                }else if(e.target=="loginModal/closeModal"){
                    uni.hideLoading()
                    if(e.data.btn=='yes'){
                        this.initPage()
                    }
                }else if(e.target=="noticeModules/toIndex"){
                    if(e.data.type=="login"){
                        this.$store.commit('login/setModal',true)
                    }
                }
            },
             //规格选完回来
           async customEventHandler(e) {//快速购买处理
                await this.cartAdder.pickerCallback(e)
                if (e.type === 'clickBtn') {
                    this.$refs?.goodsPicker.toggle(); // 购物车添加成功关闭弹窗
                }

            },
            // 检测新人送礼活动 未登录用户
            checkNewGifts() {
                return new Promise((resolve, reject) => {
                        this.$api.memberApi
                            .checkNewGifts({}, {
                                errorToast: false
                            })
                            .then((res) => {
                                if (res.error === 0) {
                                    this.newGiftsData.popup_type = res.popup_type
                                    if (res.coupon_info && res.coupon_info.length > 0) {
                                        this.newGiftsData.couponList = [
                                            ...res.coupon_info,
                                        ]
                                    }
                                    if (res.credit && parseFloat(res.credit) !== 0) {
                                        // this.newGiftsData.credit.title = res.title
                                        this.newGiftsData.credit.number = res.credit
                                    }
                                    if (res.balance && parseFloat(res.balance) !== 0) {
                                        // this.newGiftsData.balance.title = res.title
                                        this.newGiftsData.balance.number = res.balance
                                    }
                                    resolve()
                                }
                            })

                })
            },
            // 新人送礼 登录用户
            sendGifts() {
                return new Promise((resolve, reject) => {
                        this.$api.memberApi
                            .sendGifts({}, {
                                errorToast: false
                            })
                            .then((res) => {
                                if (res.error === 0) {
                                    this.newGiftsData.popup_type = res.popup_type
                                    if (res.coupon_info && res.coupon_info.length > 0) {
                                        this.newGiftsData.couponList = [
                                            ...res.coupon_info,
                                        ]
                                    }
                                    if (res.credit && parseFloat(res.credit) !== 0) {
                                        // this.newGiftsData.credit.title = res.title
                                        this.newGiftsData.credit.number = res.credit
                                    }
                                    if (res.balance && parseFloat(res.balance) !== 0) {
                                        // this.newGiftsData.balance.title = res.title
                                        this.newGiftsData.balance.number = res.balance
                                    }
                                    resolve()
                                }
                            })

                })
            },
            changeShowNewGifts(value) {
                this.showNewGifts = value
            },
            handlerShowGuide() {
                if (this.localStorage.getItem('flag')) {
                    this.showGuide = false
                } else {
                    this.localStorage.setItem('flag', 1);
                    this.showGuide = true
                }
            },
            // 获取可领取的红包
            getNoRedpacket() {
                this.$api.memberApi
                    .getNoRedpacket({
                        page: 1,
                        pageSize: 20,
                    }).then(res => {
                    this.redpackNum = res.list.length;
                    if(res.error == 0 && res.list.length) {
                        let item = res.list[0];
                        this.activityType = SCENE_MAP[item.scene]
                        this.activityData = {
                            blessing: item.extend.blessing,
                            created_at: item.created_at,
                            expire_time: item.expire_time,
                            limit: item.extend.limit,
                            money: item.money,
                            id: item.id
                        }
                    }
                })
            },
            //红包领取弹窗是否关闭
            changeShowReward(value) {
                if(value.update) {
                    this.pullDownRefresh()
                }
            },
        },
        computed: {
            ...mapGetters('login', ['isLogin']),
            ...mapState('decorate/indexPage', {
                pageList: (state) => state.pageList,
                pageInfo: (state) => deepCopy(state.pageInfo),
                isTop: (state) => state.isTop,
                isBottom: (state) => state.isBottom,
                isFixed: (state) => state.isFixed,
                pageTop: (state) => state.pageTopHeight,
                pageBottom: (state) => state.pageBottomHeight,
                pageLoading: (state) => state.pageLoading,
                pageSettings: (state) => state.pageSettings,
            }),
            ...mapState('setting', {
                shareTitle: state => state.systemSetting ?.share ?.title || '',
                shareLogo: state => state.systemSetting?.share?.logo,
            }),
            showNewGiftsWithPerm() {
                return this.showNewGifts
            },
            advsClosed() {
                return this.advShow === false
            },
            advsList() {
                if (this.isFixed) {
                    return this.isFixed.filter(
                        (v) =>
                        (v.type == 'advs' && v.is_open == '1') ||
                        v.type != 'advs'
                    )
                } else {
                    return []
                }
            },
            // 是否显示过新人送礼弹窗
            showNewGiftsFlag() {
                return this.$store.getters.showNewGiftsFlag
            },
        },
        watch: {
            isLogin: {
                async handler(value) {
                    if (!value) {
                        // 没登陆
                        await this.checkNewGifts()
                        if (!this.showNewGiftsFlag) {
                            this.showNewGifts = true
                            // 改变store状态
                            this.$store.commit('setShowNewGiftsFlag', true)
                        }
                    }
                    if (value) {
                        // 登录
                        await this.sendGifts()
                        if (!this.showNewGiftsFlag) {
                            this.showNewGifts = true
                            // 改变store状态
                            this.$store.commit('setShowNewGiftsFlag', true)
                        }
                    }
                },
                immediate: true,
            },
            advShow: {
                async handler(value) {
                    if (value === false) {
                        if (this.isLogin === false) {
                            // 没登陆
                            await this.checkNewGifts()
                            if (!this.showNewGiftsFlag) {
                                this.showNewGifts = true
                                // 改变store状态
                                this.$store.commit('setShowNewGiftsFlag', true)
                            }
                        }
                        if (this.isLogin === true) {
                            // 登录
                            await this.sendGifts()
                            if (!this.showNewGiftsFlag) {
                                this.showNewGifts = true
                                // 改变store状态
                                this.$store.commit('setShowNewGiftsFlag', true)
                            }
                        }
                    }
                },
            },
            lazyLoadList: {
                 handler(val) {
                     if (val.length) {
                         this.$loading.hideLoading();
                     } else {
                         // this.$loading.showLoading();
                     }
                 },
                 immediate: true
             },
        },
        mounted() {
            this.initPage();
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
        beforeDestroy() {
            this.$decorator.$off('refreshMyVideo')
        },
        onShow(){
            if(this.isLogin) {
                this.getNoRedpacket()
            }
            uni.hideLoading()
        },
        onLoad() {
            // #ifndef H5
            this.handlerShowGuide()
            // #endif
        },
        // #ifndef H5
        onShareAppMessage() {
            let pageId = this.$store.state?.topmenuPageID;
            let shareParams = {
                ...this.$Route.query,
                pageId
            }

            if(this.$store.state.login.userInfo.id) {
                shareParams.inviter_id = this.$store.state.login.userInfo.id
            }
            let url = this.$Route.path + '?' + this.$utils.createRouteParams(shareParams)
            return {
                title: this.shareTitle || this.$Route.meta.title,
                imageUrl: this.$utils.mediaUrl(this.shareLogo),
                path: url,
                success: function() {},
                fail: function() {}
            }
        },
        onShareTimeline() {
            let pageId = this.$store.state?.topmenuPageID;
            let shareParams = {
                ...this.$Route.query,
                pageId,
            }
            if(this.$store.state.login.userInfo.id) {
                shareParams.inviter_id = this.$store.state.login.userInfo.id
            }
            return {
                title: this.shareTitle || this.$Route.meta.title,
                imageUrl: this.$utils.mediaUrl(this.shareLogo),
                query: this.$utils.createRouteParams(shareParams),
            }
        },
        // #endif
    }


    const SCENE_MAP = {
        '12': 'consumeReward',
        '11': 'shoppingReward',
    }
</script>
<style lang="scss" scoped>
    .index-page {
        background: #eee;
        .showSkeleten {
            height: 0;
            overflow: hidden;
        }
        .small_redpack {
            position: fixed;
            left: px2rpx(14);
            bottom: px2rpx(56);
            height: px2rpx(46);
            width: px2rpx(48);
            z-index: 100000;
            animation: redpacket_scale 1.2s linear infinite;
            .all_redpack {
                position: relative;

                img {
                    width: px2rpx(44);
                    height: px2rpx(46);
                }
                .redpack_num {
                    position: absolute;
                    left: px2rpx(-3);
                    bottom: 0;
                    width: px2rpx(48);
                    height: px2rpx(13);
                    line-height: px2rpx(13);
                    text-align: center;
                    color: #752626;
                    background: linear-gradient(110.78deg, #FEE08A 7.33%, #FBC11E 86.7%);
                    border-radius: 6px;
                    .scale_text {
                        width: px2rpx(64);
                        margin-left: px2rpx(-8);
                        font-size: px2rpx(12);
                        transform: scale(0.75);
                    }
                }
            }

        }
        @keyframes redpacket_scale {
            0% {
                transform: scale(1.2);
            }
            50% {
                transform: scale(1);
            }
            100% {
                transform: scale(1.2);
            }
        }
    }
</style>
