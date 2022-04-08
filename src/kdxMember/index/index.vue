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
    <div class="vip-index" :style="{
		'background':pageSettings.background_color
	}" @touchmove='touchMoving'>
        <Skeleten v-if="isSkeleton && loadingFlg < 1"></Skeleten>
        <div class='hidePagelist'>
            <page-decorater showDiymenu @custom-event="eventHandler" :pageSettings="pageSettings"
            :customIsTop='isTop'
            :customIsBottom='isBottom'
            :customIsFixed='isFixed'
            :customPageList='getPageList'
            :customPageInfo='pageInfo' :customPageBottom='pageBottom'
            :pageTop='pageTop'
            :load-tip='loadTip'>
            </page-decorater>
        </div>
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
    import PageDecorater from '../components/decorate/PageBox'
    import {
        mapState,
        mapGetters,
        mapMutations,
        mapActions
    } from 'vuex'
    import eventHandler from './eventHandler.js'
    import {
        LazyLoadList
    } from '@/components/decorate/loader/LazyLoadList'
    import Skeleten from './Skeleten'
    import {deepCopy} from '@/common/util.js'
    import preloadDecorate from '@/router/beforeEach/preLoadDecorate.js'
    import CartAdder from '@/components/goods/addCartTools.js'
    import goodsPicker from "@/components/goods/GoodsPicker";
    import redpacket from '@/components/modal-reward/Redpacket';
    let throttle=null;
    import PageMixin from '@/common/PageMixin.js'

    // #ifdef MP-TOUTIAO
    import EventBus from '@/common/eventBus.js'
    // #endif

    export default {
        mixins: [PageMixin],
        created(){
            this.$loading.showLoading();
        },
        components: {
            PageDecorater,
            Skeleten,
            goodsPicker,
            redpacket,
        },
        data() {
            return {
                scrollTop:0,
                cartAdder:null,//添加购物车类对象
                userInfo: null,
                isFirstLoad: true,
                lazyLoadList: [],
                listLoader: null,
                showSkeleten: true,
                reachBottom:false,
                visible: false, //返利红包弹窗是否显示
                activityType: '', //红包活动
                activityData: {},
                redpackNum: 0,//未领取红包数量
            }
        },
        onLoad() {
            this.scrollTop=0
            this.listLoader = this.listLoader||new LazyLoadList(this.loadList, 12)
            //#ifdef H5
            this.listLoader.h5ReachBottom(e=>{
                this.scrollTop = Math.max(e.scrollTop,this.scrollTop)
                this.reachBottom = true;
                if (this.pageList ?.length) {
                    this.listLoader.getMore(this.pageList, this.scrollTop);
                }
            })
            //#endif
            this.$store.dispatch('setting/getSysSetting') // 更新系统设置
        },
        onShow(){
            if(this.isFirstLoad) {
                this.isFirstLoad = false;
                return
            };
            if(!this.isLogin) {
                this.$decorator.getPage('vipCenter').initMember()
            } else {
                this.getMemberInfo()
            }
        },
        mounted() {
            this.$loading.hideLoading();
            if(this.isLogin) {
                this.getNoRedpacket();
            }
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
            this.scrollTop =0
            this.$decorator.$off('refreshMyVideo')
            this.$decorator.getPage('vipCenter').clearAll()
        },
        onPageScroll(e) {
            if((e.scrollTop>this.scrollTop+50)&&this.reachBottom){
                this.reachBottom=false;
            }
            this.scrollTop = Math.max(e.scrollTop,this.scrollTop)
        },
        onReachBottom(e) {
			this.reachBottom = true;
			if (this.pageList ?.length) {
				this.listLoader.getMore(this.pageList, this.scrollTop);
			}
        },
        methods: {
            async pullDownRefresh(){//下拉刷新，mixin.js中调用
                // uni.showLoading({
                //     title: '正在刷新',
                // })
                if(this.isLogin) {
                    this.getNoRedpacket();
                }
                this.$decorator.$emit('refreshMyVideo')
                await preloadDecorate(this.$Route.path,this.$Route.query,true);
                this.listLoader.refresh().getMore(this.pageList, this.scrollTop)
                if(!this.isLogin) {
                    this.$decorator.getPage('vipCenter').initMember()
                } else {
                    this.getMemberInfo()
                }
                setTimeout(() => {
                     this.$closePageLoading()
                },1500)
                uni.stopPullDownRefresh();
            },
            //规格选完回来
            async customEventHandler(e) {//快速购买处理
                await this.cartAdder.pickerCallback(e)
                if (e.type === 'clickBtn') {
                    this.$refs?.goodsPicker.toggle(); // 购物车添加成功关闭弹窗
                }
            },
            touchMoving(e){
                if(this.reachBottom&&this.pageList?.length){
                    clearTimeout(throttle)
                    throttle= setTimeout(()=>{
                        this.listLoader.getMore(this.pageList, this.scrollTop)
                    },500)
                }
            },
            loadList(list){
				this.lazyLoadList = list;
                // 页面全部显示时显示底部内容
                if (this.pageList.length === this.lazyLoadList.length) {
                    setTimeout(() => {
                        this.reachBottom = true;
                    },200)
                }
			},
            eventHandler(e) {
                eventHandler.call(this, e)
            },
            getMemberInfo() {
                this.$decorator.getPage('vipCenter').getUserInfo().then(res => {
                    //获取会员详情
                    if (res.error == 0) {
                        this.userInfo = res.data
                    }
                })
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
            ...mapState('decorate/vipcenterPage', {
                pageList: state => state.pageList,
                pageInfo: state => deepCopy(state.pageInfo),
                isTop: state => state.isTop,
                isBottom: state => state.isBottom,
                isFixed: state => state.isFixed,
                pageTop: state => state.pageTopHeight,
                pageBottom: state => state.pageBottomHeight,
				pageSettings:state => state.pageSettings
            }),
            ...mapGetters('login', ['isLogin']),
			loadTip() {
                let len = (this.$utils.is_weixin() || !this.isLogin)? 1:0;
                if (this.reachBottom) {
					return (this.pageList ?.length > 0 && (this.pageList.length-len) == this.getPageList.length) ? '已经到底了' : '正在加载...'
				} else {
					return '';
				}
			},
            getPageList() {
                // #ifdef H5
                if(this.$utils.is_weixin() || !this.isLogin) {
                   return this.lazyLoadList.filter(item=>item.id !='logout')
                }
                // #endif

                // #ifndef H5
				return this.lazyLoadList.filter(item=>item.id !='logout')
                // #endif

                return this.lazyLoadList
			},
        },
        watch: {
            pageList: {
                immediate: true,
                handler() {
                    if (this.pageList ?.length) {
                        this.listLoader = this.listLoader || new LazyLoadList(this.loadList, 12)
                        this.listLoader.getMore(this.pageList,this.scrollTop)
                    }
                }
            },
            isLogin: {
                handler(val) {
                    if (!val) {
                        this.$decorator.getPage('vipCenter').initMember()
                    } else {
                        this.getMemberInfo()
                    }
                },
                immediate: true
            },
        }
    }


    const SCENE_MAP = {
        '12': 'consumeReward',
        '11': 'shoppingReward',
    }
</script>
<style lang="scss" scoped>
    .vip-index {
        background: #eee;
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
</style>
