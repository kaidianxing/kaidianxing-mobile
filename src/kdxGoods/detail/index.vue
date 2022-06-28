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
    <view
            class="goods-detail-index"
            :style="{'background':pageSettings.background_color}"
            @touchstart='touchstart'
            @touchend='touchend'
            @touchmove='touchmove'
    >
        <!-- 装修页面组件 -->
        <div :class="{showSkeleten:beforeLoaded}">
            <PageDecorater
                    @custom-event="eventHandler"
                    :customIsTop="isTop"
                    :customIsBottom="isBottom"
                    :customIsFixed="isFixed"
                    :customPageList="lazyLoadList"
                    :customPageInfo="pageInfo"
                    :customPageBottom="pageBottom"
                    :pageTop="pageTop"
                    :load-tip='loadTip'
                    :pageSettings="pageSettings"
                    showDiymenu
            >
            </PageDecorater>
        </div>
        <goods-modal
            v-model="show"
            v-if='show'
            :info="info"
            :type="type"
            :custom-style="customStyle"
            :title="getTitle"
            @on-refresh="getDetail"
        ></goods-modal>
        <!-- 多规格选择 -->
        <goods-picker
                ref="goodsPicker"
                @choose="specPickerChoose"
                @changeNum="optionChangeNum"
                @clickBtn="clickBtn"
        ></goods-picker>
        <!-- 多规格选择，商品组加购专用 -->
        <goods-picker ref="goodsPicker2" @custom-event="customEventHandler"></goods-picker>
        <!-- 商品详情分享 -->
        <share-modal
            v-model="showShare"
            :goods="detailInfo"
            @share="shareHandler"
            @material="materialHandler"
            v-if='showShare'
        ></share-modal>
        <material-modal
            v-model="showMaterial"
            :type="materialType"
            :goods="detailInfo"
            @complete="handleComplete"
        ></material-modal>
        <poster-modal
            v-if="showPoster"
            @mounted='posterShow'
            poster-type="goods"
            ref="poster"
        ></poster-modal>
        <!-- 骨架屏 -->
        <Skeleten v-if="isSkeleton && loadingFlg < 1"></Skeleten>
        <!-- 购物奖励奖励详情 -->
        <reward-modal v-model="showReward" v-if='showReward'/>
        <div
                class="broad-status"
                v-if="showSkeleten=== false &&  currentRoom.room_id"
                @click="goLiver"
        >
            <i class="iconfont-m- icon-m-zhibozhong broad-status-icon"></i>
            <div class="broad-statu-text">直播中</div>
            <div class="broad-status-box"></div>
        </div>
    </view>
</template>

<script>
    import goodsPicker from "@/components/goods/GoodsPicker";
    import PageDecorater from "../components/decorate/PageBox";
    import GoodsModal from '../components/detail/modal/GoodsModal'
    import ShareModal from "../components/detail/ShareModal";
    import MaterialModal from "../components/detail/MaterialModal";
    import PosterModal from "@/components/poster/PosterModal";
    import Skeleten from './index/Skeleten.vue'
    import RewardModal from "../components/detail/RewardModal";
    import CartAdder from '@/components/goods/addCartTools.js'

    let throttle=null;
    import {
        addCart,
        createOrder,
        tipBeforeOper,
        setShareInfo,
        getLiverStatus,
    } from "./index/indexTools.js";
    import {
        eventHandler,
    } from './index/eventHandlers.js'
    import {
        mapState,
        mapMutations,
        mapActions,
        mapGetters
    } from "vuex";
    import {
        LazyLoadList
    } from '@/components/decorate/loader/LazyLoadList'
    import {
        deepCopy
    } from '@/common/util.js'
    import preloadDecorate from '@/router/beforeEach/preLoadDecorate.js'
    import PageMixin from '@/common/PageMixin.js'

    // #ifdef MP-TOUTIAO
    import EventBus from '@/common/eventBus.js'
    // #endif
    let isRequestingDetail=false
    export default {
        mixins: [PageMixin],
        created(){
            // #ifndef MP-TOUTIAO
            this.$loading.showLoading();
            // #endif
        },
        components: {
            goodsPicker,
            PageDecorater,
            GoodsModal,
            PosterModal,
            ShareModal,
            Skeleten,
            RewardModal,
            MaterialModal,

        },
        computed: {
            loadTip() {
                if (this.reachBottom&&this.pageList.length>1) {
                    return this.pageList ?.length > 0 &&
                        this.pageList.length == this.lazyLoadList.length ?
                        '已经到底了' :
                        '正在加载...'
                } else {
                    return ''
                }
            },
            ...mapState("decorate/goodDetailPage", {
                serviceList: state => state.serviceList,
                activityList: state => state.activityList,
                areaList: state => state.areaList,
                goodsData: state => state.detailInfo?.data?.goods ?? {},
                detailInfo: state => state.detailInfo, //商品详情全部信息
                pageList: state => state.pageList,
                pageInfo: state => deepCopy(state.pageInfo),
                isTop: state => state.isTop,
                isBottom: state => state.isBottom,
                isFixed: state => state.isFixed,
                pageTop: state => state.pageTopHeight,
                pageBottom: state => state.pageBottomHeight,
                showSkeleten: state => state.showSkeleten,
                pageSettings: state => state.pageSettings,
            }),
            ...mapGetters("login", ["isLogin"]),
            getTitle() {
                if (this.type == 'coupon') return '商品优惠券'
                if (this.type == "active") return "活动";
                if (this.type == "biaoqian") return "服务";
                if (this.type == "bupeisong") {
                    return `${this.info.label}区域`
                };
            },
            beforeLoaded(){
                return this.showSkeleten||!this.lazyLoadList?.length
            },
            showMaterialModal() {
                return this.goodsData?.material && this.goodsData?.material?.length !== 0
            },
        },
        watch: {
            pageList: {
                immediate: true,
                handler() {
                    try{
                        if (this.pageList ?.length&&this.$Route?.path=='/kdxGoods/detail/index') {
                            this.listLoader =
                            this.listLoader || new LazyLoadList(this.loadList, this.$decorator.getPageType(this.$Route))
                            this.listLoader.refresh().getMore(this.pageList, 0,this.lazyLoadList.length)
                            let info = this.pageList?.filter(
                                item => item.id == "detail_sale"
                            );
                            if (info&&info[0]) {
                                this.customStyle = {
                                    ...info[0]?.style,
                                    label_style: info[0]?.params.label_style
                                };
                            }
                        }
                    }catch(e){
                        console.log(e,'kdxGoods/detail/index.vue')
                    }
                },
            },
            type: {
                handler() {
                    let info = this.pageInfo.detail_sale?.data;
                    if (info && this.type) {
                        this.info = info.filter(
                            (item) => item.type == this.type
                        )[0];
                    }
                },
                immediate: true,
            },
            isLogin: {
                handler() {
                    this.getDetail();
                }
            },
            beforeLoaded(val){
                if(val){
                    // this.$loading.showLoading()
                } else {
                    this.$loading.hideLoading();
                }
            },
        },
        data() {
            return {
                scrollTop:0,
                showPoster:false,
                goodDetail: null,
                selectAddress: {},
                pickerShow: 0,
                optionChoose: "", // 选择规格
                optionId: "",
                optionChoseNum: "1", //多规格选择数量
                id: "",
                goods_id: "",
                liverId: '',
                showShare: false,
                showMaterial: false,
                shareInfo: null,//-----------
                materialType: "share",
                buy_num: 0, // 已经购买个数
                type: "",//商品营销活动类型
                show: false,
                info: {},//商品营销活动信息
                customStyle: {},
                canBuy: false,
                lazyLoadList: [],
                showReward: false,
                currentRoom: {
                    room_id: '',
                    broadcast_room_id: ''
                },
                activityInfo: null, // 商品活动信息
                isFullRefresh: false,

            };
        },
        onShow() {
            this.getLiverStatus()
            this.getDetail();
        },
        mounted() {

            console.log(this.isFixed,'isFixed>>>>>>>');

            this.getUrlParams();
            // #ifdef MP-TOUTIAO
            EventBus.$off('mounted-child')
            EventBus.$on('mounted-child', (child)=> {
                this.$refs.goodsPicker2 = child;
            })
            this.$once('hook:beforeDestory',()=> {
                 EventBus.$off('mounted-child')
            })
            // #endif
            this.cartAdder = new CartAdder((e)=>{
                if(e.type=='toggle'){
                    this.$refs?.goodsPicker2.toggle(this.cartAdder.pickerCallback, e.data?.type);
                    if(!this.$refs.goodsPicker2.showmodal&&e.data.errorInfo){
                        this.$toast(e.data.errorInfo)
                    }
                }
            });
            this.getLiverStatus()
            this.getDetail();
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
            async pullDownRefresh(tip=true){//下拉刷新，mixin.js中调用
                this.isFullRefresh = true;
                this.$decorator.getPage(11).clearAll() //清空商品信息
                this.$decorator.$emit('refreshMyVideo')
                // tip&&uni.showLoading({
                //     title: '正在刷新',
                // })
                await preloadDecorate(this.$Route.path,this.$Route.query,true);
                setTimeout(() => {
                    this.listLoader.refresh().getMore(this.pageList, this.scrollTop,0)
                    this.getLiverStatus()
                    this.getDetail()
                },300)
                setTimeout(() => {
                    this.isFullRefresh = false;
                    this.$closePageLoading()
                },1000)
            },
            eventHandler(e) {
                if (e.target == "detail_info/refresh") {
                    if (e.data == "frontStop") {
                        // 刷新底部导航
                        this.$decorator.getPage(11).setPageInfo({
                            detail_navbar: {
                                params: {
                                    is_buy_disable: true,
                                },
                            },
                        },'detail/index.vue/eventHandler');
                    } else {
                        this.pullDownRefresh();
                    }
                }
                if(e.target === 'detail_info/clickShare' && e.data?.from === 'suspension' && this.showMaterialModal) {
                    this.materialHandler("share");
                    return
                }
                if(e.target === "showCommissionMaterial") {
                    this.materialHandler("commission");
                    return
                }
                if(isRequestingDetail){//如果正在登录后的刷新过程中就等候，
                    if (e.target !== 'loginModal/closeModal') {//除了登录弹窗关闭事件
                        uni.showToast({
                            title:'系统忙，请稍后重试',
                            icon: 'none',
                        })
                    }
                    return
                }
                eventHandler.call(this, e, {
                    goodsData:this.goodsData,
                    goods_id: this.goods_id,
                    option_id: this.optionId,
                    total: this.optionChoseNum,
                    goodDetail:this.goodDetail,
                    detailInfo: this.detailInfo,
                    activityInfo:this.activityInfo,
                    buy_num:this.buy_num,
                });
            },
            //规格选完回来
            async customEventHandler(e) {//快速购买处理
                await this.cartAdder.pickerCallback(e)
                if (e.type === 'clickBtn') {
                    this.$refs?.goodsPicker2.toggle(); // 购物车添加成功关闭弹窗
                }
            },
            async clickBtn(type,restOpt) {
                let data = {
                    goods_id: this.goods_id,
                    option_id: this.optionId,
                    total: this.optionChoseNum,
                    detailInfo: this.detailInfo,
                    room_id: this.liverId,
                    goodsData:this.goodsData,
                    goodDetail:this.goodDetail,
                    liverId:this.liverId,
                    canBuy:this.canBuy,
                    buy_num:this.buy_num,
                    activityInfo:this.activityInfo,
                    ...restOpt
                };
                try {
                    await tipBeforeOper(
                        data,
                        this.$refs?.goodsPicker?.show
                    );
                    if ( type == "cart" ) {
                        await addCart(data);
                        this.$refs?.goodsPicker.toggle();
                        this.$decorator.getModule('diymenu').getCartNum()
                    } else if (type == "buy") {
                        await createOrder.call(this,data);
                        this.$refs?.goodsPicker.toggle()
                    }
                } catch (e) {
                    if (e.errorId == "openPicker") {
                        uni.showToast({
                            title: e.errorInfo,
                            icon: "none",
                        });
                    }
                }
            },
            //规格选完回来
            specPickerChoose(specs, options,is_origin) {
                if(!is_origin) {
                    let detail_spec = this.pageInfo["detail_spec"];
                    this.$decorator.getPage(this.$Route).setPageInfo({
                        detail_spec: {
                            params: {
                                specs:  options?.optionName,
                            },
                        },
                    },'goodDetail/index.vue/specPickerChoose');
                }

                this.optionId = options?.id;
                this.optionChoose = specs;
            },
            //数量选完回来
            optionChangeNum(num) {
                this.optionChoseNum = num;
            },
            shareHandler() {
                this.showShare = false;
                this.posterShow();
            },
            materialHandler(type) {
                console.log('进来了')
                this.materialType = type
                this.showShare = false;
                this.showMaterial = true;
                console.log('进来了')
                console.log('this.materialType：',this.materialType)
                console.log('this.showShare：',this.showShare)
                console.log('this.showMaterial：',this.showMaterial)

            },
            handleComplete() {
                this.showMaterial = false;
            },
            posterShow() {
                if(!this.showPoster){
                    this.showPoster=true;
                    return;
                }
                this.$refs.poster&&this.$refs.poster.toggle(show => {
                    console.log("toggle", show);
                });
            },
            getLiverStatus() {
                getLiverStatus(this.goods_id).then(res => {
                    this.currentRoom = res
                })
            },
            getDetail(goods_id) {
                if(!this.goods_id&&this.$Route.query.wxref){//扫码海报的问题
                    if(this.$Route.query.wxref.indexOf('?goods_id=')>0){
                        try{
                            this.goods_id = /goods_id=(\d+)/.exec(decodeURIComponent(this.$Route.query.wxref))[1]
                        }catch(e){
                            console.log(e)
                        }
                    }
                }
                if(!this.goods_id) {
                    return
                }
                //  获取直播状态
                if(this.goods_id){
                    isRequestingDetail=true;
                    this.$decorator.getPage('goodDetail').getDetail(this.goods_id, this.liverId).then(res => {
                        // console.log(res, "------->>>>>>>>>>>>>>>>>>>");
                        isRequestingDetail=false;//等待登录刷新的标识
                        if (res&&res.error == 0) {
                            this.goodDetail = res.data.goods;
                            this.buy_num = res.data.buy_num;
                            this.canBuy = res.perm.buy == "1";
                            this.activityInfo = res?.activity ?? null;
                            this.$decorator.getModule('diymenu').getCartNum()
                            //#ifdef H5
                            setShareInfo.call(this,res)
                            //#endif

                            if(!this.pageSettings.title){
                                this.$decorator.getPage('goodDetail').setPageTitle(this.goodDetail.title)
                            }
                            if(!this.lazyLoadList.length){
                                this.listLoader.refresh().getMore(this.pageList, 0,this.lazyLoadList.length)
                                setTimeout(() => {
                                    if(this.beforeLoaded){//1.5s后仍然没有关闭骨架屏就再试一次
                                        this.pullDownRefresh(false)
                                    }
                                },1500)
                            }
                        }
                    }).catch(() => {
                        isRequestingDetail = false
                    });
                }
            },

            getUrlParams() {
                let params=this.$decorator.getPage('goodDetail').getUrlParams(this.$Route);
                this.goods_id=params.goods_id
                this.liverId=params.liverId;
                return params;
            },
            goLiver() {
                this.$utils.openLiver({
                    liverId: this.currentRoom.room_id,
                    broadId: this.currentRoom.broadcast_room_id
                })
            },
            clickBuyItem(data){
                this.eventHandler({
                    target: 'detail_navbar/clickItem',
                    data: data
                })
            },
        },
        onLoad() {
            this.scrollTop = 0
            this.listLoader = this.listLoader||new LazyLoadList(this.loadList, 11)
            if(!this.lazyLoadList.length){
                this.listLoader.refresh().getMore(this.pageList, 0,this.lazyLoadList.length)
            }
            //#ifdef H5
            this.listLoader.h5ReachBottom((e) => {
                this.scrollTop = Math.max(e.scrollTop,this.scrollTop)
                this.reachBottom = true
                if (this.pageList ?.length) {
                   this.listLoader &&  this.listLoader.getMore(this.pageList, this.scrollTop,this.lazyLoadList.length)
                }
            })
            //#endif
        },
        onUnload(e) {
            this.scrollTop=0
            this.listLoader=null;
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
        beforeDestroy() {
            this.$decorator.$off('refreshMyVideo')
            this.scrollTop = 0;
            this.listLoader=null;
            this.$decorator.getPage('goodDetail').clearAll() //清空商品信息
        },
        // #ifndef H5
        onShareAppMessage() {
            let url = '/kdxGoods/detail/index?goods_id=' + this.goods_id + '&inviter_id=' + this.$store.state.login.userInfo.id;
            if( !this.goodsData.ext_field.title_type || this.goodsData.ext_field.title_type == "0"){
                return {
                    title: this.goodsData.title,
                    imageUrl: this.$utils.mediaUrl(this.goodsData.thumb),
                    desc: this.goodsData.sub_name,
                    path: url,
                    success: function () {},
                    fail: function () {}
                }
            }else {
                return {
                    title: this.goodsData.ext_field.title,
                    imageUrl: this.$utils.mediaUrl(this.goodsData.ext_field.wxapp_logo),
                    desc: this.goodsData.sub_name,
                    path: url,
                    success: function () {},
                    fail: function () {}
                }
            }

        },
        onShareTimeline(){
            // let shareimg = this.pageSettings.params.shareimg  || this.shareLogo; // 无用-去掉 修改bug--23474 报错导致下面代码执行错误

            let shareParams = {
                ...this.$Route.query,
            }
            if(this.$store.state.login.userInfo.id) {
                shareParams.inviter_id = this.$store.state.login.userInfo.id
            }
            return {
                title: this.goodsData.title,
                imageUrl: !this.goodsData.ext_field.title_type || this.goodsData.ext_field.title_type == "0" ? this.$utils.mediaUrl(this.goodsData.thumb) : this.$utils.mediaUrl(this.goodsData.ext_field.wxapp_logo),
                query: this.$utils.createRouteParams(shareParams)
            }
        },
        // #endif
    };
</script>

<style lang="scss">
.goods-detail-index {
    min-height: 100vh;
    background-color: $uni-bg-color-grey;
    .showSkeleten {
        height: 0;
        overflow: hidden;
    }
    .server-content {
        color: $uni-text-color;
        font-size: 28rpx;
        line-height: 80rpx;
        text {
            margin-left: 10rpx;
        }
    }
    .activity-content {
        color: $uni-text-color;
        font-size: 28rpx;
        line-height: 80rpx;
        .label {
            border: 1px solid $uni-color-primary;
            color: $uni-color-primary;
            height: 36rpx;
            line-height: 36rpx;
            padding: 0 16rpx;
            border-radius: 18rpx;
            margin-right: 16rpx;
        }
    }
    .area-content {
        color: $uni-text-color;
        font-size: 28rpx;
        line-height: 60rpx;
        border-bottom: 1px solid $uni-border-color;
        .area-name {
        }
        .area-address {
            font-size: 24rpx;
            line-height: 34rpx;
            color: $uni-text-color-grey;
            padding: 0 0 16rpx 30rpx;
        }
    }
    .area-content.default {
        color: $uni-color-primary;
        .area-address {
            color: $uni-color-primary;
        }
    }

    /deep/ .detail_pullup .notice-swiper {
        white-space: normal;
    }
    .broad-status {
        position: fixed;
        right: px2rpx(20);
        top: px2rpx(54);
        z-index: 999999999;
        border-radius: px2rpx(10);
        padding-top: px2rpx(10);
        width: px2rpx(48);
        height: px2rpx(60);
        text-align: center;
        overflow: hidden;
        box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.25);

        &-icon {
            display: block;
            font-size: px2rpx(20);
            color: #fe0c30;
        }

        &-text {
            margin-top: px2rpx(8);
            font-size: px2rpx(10);
            line-height: px2rpx(12);
            color: #212121;
            text-align: center;
        }

        &-box {
            border-radius: px2rpx(10);
            position: absolute;
            left: 0;
            top: 0;
            z-index: -1;
            width: px2rpx(48);
            height: px2rpx(60);
            backdrop-filter: blur(4px);
            background: rgba(255, 255, 255, 0.5);
        }
    }
}
</style>
